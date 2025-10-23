// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IMorphoVault.sol";
import "./libraries/SubscriptionLib.sol";

/**
 * @title SubscriptionManager
 * @notice Subscription management with yield generation via Morpho Protocol
 * @dev Yearly subscriptions with 4.5% APY rewards, using SubscriptionLib for calculations
 * 
 * Architecture:
 * - Modular design with separate calculation library
 * - Morpho integration for yield generation
 * - Platform fee model for sustainability
 */
contract SubscriptionManager is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    using SubscriptionLib for *;

    // ============ Enums ============
    
    enum SubscriptionStatus { NONE, ACTIVE, COMPLETED, CANCELLED }

    // ============ Structs ============
    
    struct SubscriptionPlan {
        uint256 yearlyPrice;
        string name;
        string description;
        address provider;
        bool isActive;
        uint256 subscriberCount;
        uint256 totalRevenue;
    }

    struct Subscription {
        uint256 planId;
        address subscriber;
        uint256 principal;
        uint256 projectedInterest;
        uint256 startTime;
        uint256 expirationTime;
        SubscriptionStatus status;
        uint256 morphoShares;
    }

    // ============ State Variables ============
    
    IERC20 public immutable paymentToken;
    IMorphoVault public immutable morphoVault;
    
    uint256 public platformFeePercent = 250;
    address public feeCollector;
    
    uint256 public nextPlanId = 1;
    uint256 public nextSubscriptionId = 1;
    
    mapping(uint256 => SubscriptionPlan) public plans;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public userSubscriptions;
    mapping(address => uint256[]) public providerPlans;
    mapping(uint256 => uint256[]) public planSubscriptions;

    // ============ Events ============
    
    event PlanCreated(uint256 indexed planId, address indexed provider, string name, uint256 yearlyPrice);
    event PlanUpdated(uint256 indexed planId, string name, uint256 yearlyPrice, bool isActive);
    event Subscribed(uint256 indexed subscriptionId, uint256 indexed planId, address indexed subscriber, uint256 principal, uint256 projectedInterest);
    event SubscriptionCompleted(uint256 indexed subscriptionId, address indexed subscriber, uint256 principal, uint256 actualInterest);
    event SubscriptionCancelled(uint256 indexed subscriptionId, address indexed subscriber, uint256 refundedPrincipal, uint256 forfeitedInterest);
    event InterestClaimed(uint256 indexed planId, address indexed provider, uint256 amount);
    event PlatformFeeUpdated(uint256 newFeePercent);
    event FeeCollectorUpdated(address newFeeCollector);

    // ============ Constructor ============
    
    constructor(
        address _paymentToken,
        address _morphoVault,
        address _feeCollector
    ) Ownable(msg.sender) {
        SubscriptionLib.validateAddress(_paymentToken);
        SubscriptionLib.validateAddress(_morphoVault);
        SubscriptionLib.validateAddress(_feeCollector);
        
        paymentToken = IERC20(_paymentToken);
        morphoVault = IMorphoVault(_morphoVault);
        feeCollector = _feeCollector;
        
        require(morphoVault.asset() == _paymentToken, "Morpho vault asset mismatch");
    }

    // ============ Provider Functions ============
    
    /**
     * @notice Create a subscription plan
     */
    function createPlan(
        uint256 yearlyPrice,
        string memory name,
        string memory description
    ) external whenNotPaused returns (uint256) {
        SubscriptionLib.validatePlanParams(yearlyPrice, name, msg.sender);
        
        uint256 planId = nextPlanId++;
        
        plans[planId] = SubscriptionPlan({
            yearlyPrice: yearlyPrice,
            name: name,
            description: description,
            provider: msg.sender,
            isActive: true,
            subscriberCount: 0,
            totalRevenue: 0
        });
        
        providerPlans[msg.sender].push(planId);
        emit PlanCreated(planId, msg.sender, name, yearlyPrice);
        
        return planId;
    }

    /**
     * @notice Update a plan
     */
    function updatePlan(
        uint256 planId,
        string memory name,
        uint256 yearlyPrice,
        bool isActive
    ) external {
        SubscriptionPlan storage plan = plans[planId];
        require(plan.provider != address(0), "Plan does not exist");
        require(plan.provider == msg.sender, "Only provider can update");
        
        if (bytes(name).length > 0) plan.name = name;
        if (yearlyPrice > 0) plan.yearlyPrice = yearlyPrice;
        plan.isActive = isActive;
        
        emit PlanUpdated(planId, plan.name, plan.yearlyPrice, isActive);
    }

    /**
     * @notice Claim forfeited interest from cancelled subscriptions
     */
    function claimProviderInterest(uint256 planId) external nonReentrant {
        SubscriptionPlan storage plan = plans[planId];
        require(plan.provider == msg.sender, "Only provider can claim");
        
        uint256[] memory subs = planSubscriptions[planId];
        uint256 totalClaimable = 0;
        
        for (uint256 i = 0; i < subs.length; i++) {
            Subscription storage sub = subscriptions[subs[i]];
            if (sub.status == SubscriptionStatus.CANCELLED && sub.morphoShares > 0) {
                uint256 currentValue = morphoVault.convertToAssets(sub.morphoShares);
                totalClaimable += SubscriptionLib.calculateActualInterest(currentValue, sub.principal);
                sub.morphoShares = 0;
            }
        }
        
        require(totalClaimable > 0, "No interest to claim");
        morphoVault.withdraw(totalClaimable, msg.sender, address(this));
        
        emit InterestClaimed(planId, msg.sender, totalClaimable);
    }

    // ============ Subscriber Functions ============
    
    /**
     * @notice Subscribe to a plan
     */
    function subscribe(uint256 planId) external nonReentrant whenNotPaused returns (uint256) {
        SubscriptionPlan storage plan = plans[planId];
        require(plan.isActive, "Plan is not active");
        SubscriptionLib.validateSubscriptionParams(msg.sender, plan.provider);
        
        uint256 principal = plan.yearlyPrice;
        (uint256 platformFee, uint256 providerAmount) = SubscriptionLib.calculateFees(principal, platformFeePercent);
        
        // Transfer tokens
        paymentToken.safeTransferFrom(msg.sender, feeCollector, platformFee);
        paymentToken.safeTransferFrom(msg.sender, address(this), providerAmount);
        
        // Deposit to Morpho
        paymentToken.safeIncreaseAllowance(address(morphoVault), providerAmount);
        uint256 shares = morphoVault.deposit(providerAmount, address(this));
        
        // Create subscription
        uint256 subscriptionId = nextSubscriptionId++;
        uint256 projectedInterest = SubscriptionLib.calculateProjectedInterest(providerAmount);
        uint256 startTime = block.timestamp;
        
        subscriptions[subscriptionId] = Subscription({
            planId: planId,
            subscriber: msg.sender,
            principal: providerAmount,
            projectedInterest: projectedInterest,
            startTime: startTime,
            expirationTime: SubscriptionLib.calculateExpiration(startTime),
            status: SubscriptionStatus.ACTIVE,
            morphoShares: shares
        });
        
        userSubscriptions[msg.sender].push(subscriptionId);
        planSubscriptions[planId].push(subscriptionId);
        plan.subscriberCount++;
        plan.totalRevenue += principal;
        
        emit Subscribed(subscriptionId, planId, msg.sender, providerAmount, projectedInterest);
        return subscriptionId;
    }

    /**
     * @notice Claim rewards after completing full year
     */
    function claimRewards(uint256 subscriptionId) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not your subscription");
        require(sub.status == SubscriptionStatus.ACTIVE, "Subscription not active");
        require(SubscriptionLib.isExpired(sub.expirationTime), "Subscription not expired yet");
        
        sub.status = SubscriptionStatus.COMPLETED;
        
        uint256 totalValue = morphoVault.convertToAssets(sub.morphoShares);
        uint256 actualInterest = SubscriptionLib.calculateActualInterest(totalValue, sub.principal);
        
        morphoVault.withdraw(totalValue, msg.sender, address(this));
        sub.morphoShares = 0;
        
        emit SubscriptionCompleted(subscriptionId, msg.sender, sub.principal, actualInterest);
    }

    /**
     * @notice Cancel subscription and get principal back
     */
    function cancelSubscription(uint256 subscriptionId) external nonReentrant {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not your subscription");
        require(sub.status == SubscriptionStatus.ACTIVE, "Subscription not active");
        
        sub.status = SubscriptionStatus.CANCELLED;
        
        uint256 currentValue = morphoVault.convertToAssets(sub.morphoShares);
        uint256 forfeitedInterest = SubscriptionLib.calculateActualInterest(currentValue, sub.principal);
        
        // Withdraw principal only
        morphoVault.withdraw(sub.principal, msg.sender, address(this));
        
        // Keep interest for provider
        if (forfeitedInterest > 0) {
            paymentToken.safeIncreaseAllowance(address(morphoVault), forfeitedInterest);
            sub.morphoShares = morphoVault.deposit(forfeitedInterest, address(this));
        } else {
            sub.morphoShares = 0;
        }
        
        emit SubscriptionCancelled(subscriptionId, msg.sender, sub.principal, forfeitedInterest);
    }

    // ============ View Functions ============
    
    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }

    function getUserSubscriptions(address user) external view returns (uint256[] memory) {
        return userSubscriptions[user];
    }

    function getProviderPlans(address provider) external view returns (uint256[] memory) {
        return providerPlans[provider];
    }

    function getPlanSubscriptions(uint256 planId) external view returns (uint256[] memory) {
        return planSubscriptions[planId];
    }

    function canClaimRewards(uint256 subscriptionId) external view returns (bool) {
        Subscription memory sub = subscriptions[subscriptionId];
        return sub.status == SubscriptionStatus.ACTIVE && SubscriptionLib.isExpired(sub.expirationTime);
    }

    function getSubscriptionValue(uint256 subscriptionId) external view returns (uint256) {
        Subscription memory sub = subscriptions[subscriptionId];
        if (sub.morphoShares == 0) return 0;
        return morphoVault.convertToAssets(sub.morphoShares);
    }

    // ============ Admin Functions ============
    
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        SubscriptionLib.validatePlatformFee(newFeePercent);
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }

    function updateFeeCollector(address newFeeCollector) external onlyOwner {
        SubscriptionLib.validateAddress(newFeeCollector);
        feeCollector = newFeeCollector;
        emit FeeCollectorUpdated(newFeeCollector);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
