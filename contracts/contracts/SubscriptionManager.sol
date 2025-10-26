// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IMetaMorpho} from "../lib/metamorpho/src/interfaces/IMetaMorpho.sol";

/**
 * @title SubscriptionManager
 * @dev A subscription contract with two business models:
 * 1. Monthly subscriptions with automatic payments and optional yearly staking
 * 2. Yearly subscriptions with immediate payment and yield generation
 */
contract SubscriptionManager is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Subscription types
    enum SubscriptionType {
        MONTHLY,
        YEARLY
    }

    // Subscription status
    enum SubscriptionStatus {
        NONE,
        ACTIVE,
        CANCELLED,
        EXPIRED
    }

    struct Subscription {
        SubscriptionType subType;
        SubscriptionStatus status;
        uint256 monthlyRate;
        uint256 yearlyRate;
        uint256 startTime;
        uint256 lastPayment;
        uint256 expirationTime;
        bool autoPayEnabled;
        uint256 stakedAmount; // For yearly staking in monthly subscriptions
        uint256 morphoShares; // Shares in Morpho vault
    }

    struct SubscriptionPlan {
        uint256 monthlyRate;
        uint256 yearlyRate;
        bool isActive;
        string name;
    }

    // State variables
    mapping(address => mapping(uint256 => Subscription)) public subscriptions; // user => planId => subscription
    mapping(uint256 => SubscriptionPlan) public subscriptionPlans;
    mapping(address => uint256[]) public userActiveSubscriptions; // user => array of planIds

    uint256 public nextPlanId = 1;
    uint256 public constant SECONDS_IN_MONTH = 30 days;
    uint256 public constant SECONDS_IN_YEAR = 365 days;

    IERC20 public immutable paymentToken; // ETH or ERC20 token for payments
    IMetaMorpho public immutable morphoVault; // Morpho vault for yield generation

    address public backend; // Backend address for automated payments
    uint256 public totalYearlyDeposits; // Total deposits in Morpho from yearly subscriptions

    // Events
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

    // event YieldWithdrawn(
    //     address indexed user,
    //     uint256 indexed planId,
    //     uint256 amount
    // );

    event BusinessOwnerWithdrawal(uint256 amount, uint256 remainingBalance);

    event AutoPaymentPermissionGranted(
        address indexed user,
        uint256 indexed planId,
        uint256 allowanceAmount
    );

    modifier onlyBackend() {
        require(msg.sender == backend, "Only backend can call this function");
        _;
    }

    modifier validPlan(uint256 planId) {
        require(subscriptionPlans[planId].isActive, "Invalid or inactive plan");
        _;
    }

    constructor(
        address _paymentToken,
        address _morphoVault,
        address _backend,
        address _owner
    ) Ownable(_owner) {
        require(_paymentToken != address(0), "Payment token required");
        require(_morphoVault != address(0), "Morpho vault required");

        paymentToken = IERC20(_paymentToken);
        morphoVault = IMetaMorpho(_morphoVault);
        backend = _backend;

        // Verify Morpho vault asset matches payment token
        require(
            morphoVault.asset() == _paymentToken,
            "Morpho vault asset mismatch"
        );
    }

    /**
     * @dev Create a new subscription plan
     */
    function createSubscriptionPlan(
        uint256 _monthlyRate,
        uint256 _yearlyRate,
        string memory _name
    ) external onlyOwner returns (uint256) {
        require(_monthlyRate > 0 && _yearlyRate > 0, "Rates must be positive");

        uint256 planId = nextPlanId++;
        subscriptionPlans[planId] = SubscriptionPlan({
            monthlyRate: _monthlyRate,
            yearlyRate: _yearlyRate,
            isActive: true,
            name: _name
        });

        return planId;
    }

    /**
     * @dev Subscribe with monthly payments
     * @param planId The subscription plan ID
     * @param stakeYearlyAmount Whether to stake one year worth of payments upfront
     */
    function subscribeMonthly(
        uint256 planId,
        bool stakeYearlyAmount
    ) external validPlan(planId) nonReentrant whenNotPaused {
        bool enableAutoPay = true; // Default to auto-pay enabled
        require(
            subscriptions[msg.sender][planId].status == SubscriptionStatus.NONE,
            "Already subscribed"
        );

        SubscriptionPlan memory plan = subscriptionPlans[planId];
        uint256 totalAmount = plan.monthlyRate;

        if (stakeYearlyAmount) {
            totalAmount = plan.yearlyRate;
        }

        // Collect PYUSD from subscriber
        paymentToken.safeTransferFrom(msg.sender, address(this), totalAmount);

        uint256 morphoShares = 0;
        uint256 stakedAmount = 0;

        if (stakeYearlyAmount) {
            // Deposit yearly amount to Morpho for yield
            stakedAmount = plan.yearlyRate;
            paymentToken.safeIncreaseAllowance(
                address(morphoVault),
                stakedAmount
            );
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

        emit SubscriptionCreated(
            msg.sender,
            planId,
            SubscriptionType.MONTHLY,
            totalAmount,
            enableAutoPay
        );

        if (enableAutoPay) {
            emit AutoPaymentPermissionGranted(
                msg.sender,
                planId,
                plan.monthlyRate
            );
        }

        if (stakeYearlyAmount) {
            emit YearlyStakeDeposited(
                msg.sender,
                planId,
                stakedAmount,
                morphoShares
            );
        }
    }

    /**
     * @dev Subscribe with yearly payment
     * @param planId The subscription plan ID
     */
    function subscribeYearly(
        uint256 planId
    ) external validPlan(planId) nonReentrant whenNotPaused {
        require(
            subscriptions[msg.sender][planId].status == SubscriptionStatus.NONE,
            "Already subscribed"
        );

        SubscriptionPlan memory plan = subscriptionPlans[planId];

        // Collect PYUSD from subscriber
        paymentToken.safeTransferFrom(
            msg.sender,
            address(this),
            plan.yearlyRate
        );

        // Deposit to Morpho vault for yield generation
        paymentToken.safeIncreaseAllowance(
            address(morphoVault),
            plan.yearlyRate
        );
        uint256 morphoShares = morphoVault.deposit(
            plan.yearlyRate,
            address(this)
        );
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

        emit SubscriptionCreated(
            msg.sender,
            planId,
            SubscriptionType.YEARLY,
            plan.yearlyRate,
            false
        );
    }

    /**
     * @dev Process monthly payment (called by backend for auto-pay users)
     */
    function processMonthlyPayment(
        address user,
        uint256 planId
    ) external onlyBackend nonReentrant {
        Subscription storage sub = subscriptions[user][planId];
        require(
            sub.status == SubscriptionStatus.ACTIVE,
            "Subscription not active"
        );
        require(
            sub.subType == SubscriptionType.MONTHLY,
            "Not a monthly subscription"
        );
        require(sub.autoPayEnabled, "Auto-pay not enabled");
        require(
            block.timestamp >= sub.expirationTime - 1 days,
            "Too early for payment"
        );

        uint256 paymentAmount = sub.monthlyRate;

        if (sub.stakedAmount > 0) {
            // Deduct from staked amount held in Morpho vault
            require(
                sub.stakedAmount >= paymentAmount,
                "Insufficient staked amount"
            );

            uint256 burnedShares = morphoVault.withdraw(
                paymentAmount,
                address(this),
                address(this)
            );

            sub.morphoShares -= burnedShares;
            sub.stakedAmount -= paymentAmount;
        } else {
            // Transfer PYUSD directly from user's wallet
            paymentToken.safeTransferFrom(user, address(this), paymentAmount);
        }

        sub.lastPayment = block.timestamp;
        sub.expirationTime = block.timestamp + SECONDS_IN_MONTH;

        // Forward payment to the business owner
        paymentToken.safeTransfer(owner(), paymentAmount);

        emit MonthlyPaymentProcessed(
            user,
            planId,
            paymentAmount,
            block.timestamp
        );
    }

    /**
     * @dev Cancel subscription and handle refunds
     */
    function cancelSubscription(uint256 planId) external nonReentrant {
        Subscription storage sub = subscriptions[msg.sender][planId];
        require(
            sub.status == SubscriptionStatus.ACTIVE,
            "Subscription not active"
        );

        sub.status = SubscriptionStatus.CANCELLED;
        uint256 refundAmount = 0;

        if (sub.subType == SubscriptionType.MONTHLY && sub.stakedAmount > 0) {
            // Refund remaining staked amount for monthly subscriptions
            if (sub.morphoShares > 0) {
                refundAmount = morphoVault.redeem(
                    sub.morphoShares,
                    address(this),
                    address(this)
                );
            } else {
                refundAmount = sub.stakedAmount;
            }
            sub.stakedAmount = 0;
            sub.morphoShares = 0;
        } else if (sub.subType == SubscriptionType.YEARLY) {
            // Calculate pro-rata refund for yearly subscriptions
            uint256 remainingTime = sub.expirationTime > block.timestamp
                ? sub.expirationTime - block.timestamp
                : 0;
            if (remainingTime > 0) {
                uint256 totalAssets = morphoVault.convertToAssets(
                    sub.morphoShares
                );
                refundAmount = (totalAssets * remainingTime) / SECONDS_IN_YEAR;

                morphoVault.withdraw(
                    refundAmount,
                    address(this),
                    address(this)
                );
                totalYearlyDeposits -= refundAmount;
            }
            sub.morphoShares = 0;
        }

        // Remove from active subscriptions
        _removeFromActiveSubscriptions(msg.sender, planId);

        if (refundAmount > 0) {
            paymentToken.safeTransfer(msg.sender, refundAmount);
        }

        emit SubscriptionCancelled(msg.sender, planId, refundAmount);
    }

    // /**
    //  * @dev Withdraw yield earned from staked amounts (for monthly subscribers)
    //  */
    // function withdrawYield(uint256 planId) external nonReentrant {
    //     Subscription storage sub = subscriptions[msg.sender][planId];
    //     require(
    //         sub.status == SubscriptionStatus.ACTIVE,
    //         "Subscription not active"
    //     );
    //     require(sub.morphoShares > 0, "No staked amount");

    //     uint256 currentAssets = morphoVault.convertToAssets(sub.morphoShares);
    //     require(currentAssets > sub.stakedAmount, "No yield to withdraw");

    //     uint256 yieldAmount = currentAssets - sub.stakedAmount;
    //     uint256 burnedShares = morphoVault.withdraw(
    //         yieldAmount,
    //         address(this),
    //         address(this)
    //     );

    //     paymentToken.safeTransfer(msg.sender, yieldAmount);

    //     // Reduce stored shares to reflect withdrawn yield
    //     sub.morphoShares -= burnedShares;

    //     emit YieldWithdrawn(msg.sender, planId, yieldAmount);
    // }

    /**
     * @dev Business owner can withdraw funds from yearly subscriptions
     */
    function businessOwnerWithdraw(
        uint256 amount
    ) external onlyOwner nonReentrant {
        uint256 withdrawableAssets = morphoVault.maxWithdraw(address(this));
        require(amount <= withdrawableAssets, "Insufficient vault balance");

        morphoVault.withdraw(amount, address(this), address(this));

        if (amount >= totalYearlyDeposits) {
            totalYearlyDeposits = 0;
        } else {
            totalYearlyDeposits -= amount;
        }

        paymentToken.safeTransfer(owner(), amount);

        emit BusinessOwnerWithdrawal(amount, totalYearlyDeposits);
    }

    /**
     * @dev Get subscription details for a user and plan
     */
    function getSubscription(
        address user,
        uint256 planId
    ) external view returns (Subscription memory) {
        return subscriptions[user][planId];
    }

    /**
     * @dev Get user's active subscriptions
     */
    function getUserActiveSubscriptions(
        address user
    ) external view returns (uint256[] memory) {
        return userActiveSubscriptions[user];
    }

    /**
     * @dev Check if subscription is expired and update status
     */
    function checkAndUpdateExpiration(address user, uint256 planId) external {
        Subscription storage sub = subscriptions[user][planId];
        if (
            sub.status == SubscriptionStatus.ACTIVE &&
            block.timestamp > sub.expirationTime
        ) {
            sub.status = SubscriptionStatus.EXPIRED;
            _removeFromActiveSubscriptions(user, planId);
        }
    }

    /**
     * @dev Set backend address
     */
    function setBackend(address _backend) external onlyOwner {
        backend = _backend;
    }

    /**
     * @dev Toggle subscription plan active status
     */
    function togglePlanStatus(uint256 planId) external onlyOwner {
        subscriptionPlans[planId].isActive = !subscriptionPlans[planId]
            .isActive;
    }

    /**
     * @dev Emergency pause/unpause
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Internal function to remove plan from user's active subscriptions
     */
    function _removeFromActiveSubscriptions(
        address user,
        uint256 planId
    ) internal {
        uint256[] storage activeSubs = userActiveSubscriptions[user];
        for (uint256 i = 0; i < activeSubs.length; i++) {
            if (activeSubs[i] == planId) {
                activeSubs[i] = activeSubs[activeSubs.length - 1];
                activeSubs.pop();
                break;
            }
        }
    }

    // No native token support
}
