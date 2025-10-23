// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IMorphoVault {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
    function balanceOf(address account) external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);
    function asset() external view returns (address);
}

/**
 * @title SubscriptionManager
 * @notice Manage subscriptions with PyUSD and yield generation via Morpho
 * @dev Supports monthly and yearly subscriptions with automated payments
 */
contract SubscriptionManager is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    enum SubscriptionType { MONTHLY, YEARLY }
    enum SubscriptionStatus { NONE, ACTIVE, CANCELLED, EXPIRED }

    struct Subscription {
        SubscriptionType subType;
        SubscriptionStatus status;
        uint256 monthlyRate;
        uint256 yearlyRate;
        uint256 startTime;
        uint256 lastPayment;
        uint256 expirationTime;
        bool autoPayEnabled;
        uint256 stakedAmount;
        uint256 morphoShares;
    }

    struct SubscriptionPlan {
        uint256 monthlyRate;
        uint256 yearlyRate;
        bool isActive;
        string name;
    }

    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    mapping(uint256 => SubscriptionPlan) public subscriptionPlans;
    mapping(address => uint256[]) public userActiveSubscriptions;
    
    uint256 public nextPlanId = 1;
    uint256 public constant SECONDS_IN_MONTH = 30 days;
    uint256 public constant SECONDS_IN_YEAR = 365 days;
    
    IERC20 public immutable paymentToken;
    IMorphoVault public immutable morphoVault;
    
    address public backend;
    uint256 public totalYearlyDeposits;

    event SubscriptionCreated(
        address indexed user,
        uint256 indexed planId,
        SubscriptionType subType,
        uint256 amount,
        bool autoPayEnabled
    );
    
    event MonthlyPaymentProcessed(
        address indexed user,
        uint256 indexed planId,
        uint256 amount,
        uint256 timestamp
    );
    
    event YearlyStakeDeposited(
        address indexed user,
        uint256 indexed planId,
        uint256 amount,
        uint256 morphoShares
    );
    
    event SubscriptionCancelled(
        address indexed user,
        uint256 indexed planId,
        uint256 refundAmount
    );
    
    event YieldWithdrawn(
        address indexed user,
        uint256 indexed planId,
        uint256 amount
    );

    modifier onlyBackend() {
        require(msg.sender == backend, "Only backend");
        _;
    }

    modifier validPlan(uint256 planId) {
        require(subscriptionPlans[planId].isActive, "Invalid plan");
        _;
    }

    constructor(
        address _paymentToken,
        address _morphoVault,
        address _backend,
        address _owner
    ) Ownable(_owner) {
        paymentToken = IERC20(_paymentToken);
        morphoVault = IMorphoVault(_morphoVault);
        backend = _backend;
        
        require(morphoVault.asset() == _paymentToken, "Asset mismatch");
    }

    function createSubscriptionPlan(
        uint256 _monthlyRate,
        uint256 _yearlyRate,
        string memory _name
    ) external onlyOwner returns (uint256) {
        require(_monthlyRate > 0 && _yearlyRate > 0, "Invalid rates");
        
        uint256 planId = nextPlanId++;
        subscriptionPlans[planId] = SubscriptionPlan({
            monthlyRate: _monthlyRate,
            yearlyRate: _yearlyRate,
            isActive: true,
            name: _name
        });
        
        return planId;
    }

    function subscribeMonthly(
        uint256 planId,
        bool enableAutoPay,
        bool stakeYearlyAmount
    ) external validPlan(planId) nonReentrant whenNotPaused {
        require(subscriptions[msg.sender][planId].status == SubscriptionStatus.NONE, "Already subscribed");
        
        SubscriptionPlan memory plan = subscriptionPlans[planId];
        uint256 totalAmount = stakeYearlyAmount ? plan.yearlyRate : plan.monthlyRate;

        paymentToken.safeTransferFrom(msg.sender, address(this), totalAmount);

        uint256 morphoShares = 0;
        uint256 stakedAmount = 0;

        if (stakeYearlyAmount) {
            stakedAmount = plan.yearlyRate;
            paymentToken.safeIncreaseAllowance(address(morphoVault), stakedAmount);
            morphoShares = morphoVault.deposit(stakedAmount, address(this));
        }

        subscriptions[msg.sender][planId] = Subscription({
            subType: SubscriptionType.MONTHLY,
            status: SubscriptionStatus.ACTIVE,
            monthlyRate: plan.monthlyRate,
            yearlyRate: plan.yearlyRate,
            startTime: block.timestamp,
            lastPayment: block.timestamp,
            expirationTime: block.timestamp + SECONDS_IN_MONTH,
            autoPayEnabled: enableAutoPay,
            stakedAmount: stakedAmount,
            morphoShares: morphoShares
        });

        userActiveSubscriptions[msg.sender].push(planId);

        emit SubscriptionCreated(msg.sender, planId, SubscriptionType.MONTHLY, totalAmount, enableAutoPay);
        
        if (stakeYearlyAmount) {
            emit YearlyStakeDeposited(msg.sender, planId, stakedAmount, morphoShares);
        }
    }

    function subscribeYearly(
        uint256 planId
    ) external validPlan(planId) nonReentrant whenNotPaused {
        require(subscriptions[msg.sender][planId].status == SubscriptionStatus.NONE, "Already subscribed");
        
        SubscriptionPlan memory plan = subscriptionPlans[planId];
        
        paymentToken.safeTransferFrom(msg.sender, address(this), plan.yearlyRate);

        paymentToken.safeIncreaseAllowance(address(morphoVault), plan.yearlyRate);
        uint256 morphoShares = morphoVault.deposit(plan.yearlyRate, address(this));
        totalYearlyDeposits += plan.yearlyRate;

        subscriptions[msg.sender][planId] = Subscription({
            subType: SubscriptionType.YEARLY,
            status: SubscriptionStatus.ACTIVE,
            monthlyRate: plan.monthlyRate,
            yearlyRate: plan.yearlyRate,
            startTime: block.timestamp,
            lastPayment: block.timestamp,
            expirationTime: block.timestamp + SECONDS_IN_YEAR,
            autoPayEnabled: false,
            stakedAmount: 0,
            morphoShares: morphoShares
        });

        userActiveSubscriptions[msg.sender].push(planId);

        emit SubscriptionCreated(msg.sender, planId, SubscriptionType.YEARLY, plan.yearlyRate, false);
    }
}
