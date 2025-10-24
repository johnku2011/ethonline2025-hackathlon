// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PyUSDSubscription
 * @dev Manages recurring subscription payments using PyUSD on Arbitrum
 */
contract PyUSDSubscription is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Plan {
        uint256 id;
        string name;
        uint256 amount; // Amount in PyUSD (6 decimals)
        uint256 interval; // Billing interval in seconds
        bool active;
        address merchant;
    }

    struct Subscription {
        uint256 planId;
        address subscriber;
        uint256 startTime;
        uint256 nextBillingTime;
        bool active;
        uint256 totalPaid;
    }

    IERC20 public immutable pyusdToken;
    
    uint256 public planCounter;
    uint256 public subscriptionCounter;
    uint256 public platformFeePercent = 250; // 2.5% (basis points)
    address public feeCollector;

    mapping(uint256 => Plan) public plans;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public merchantPlans;
    mapping(address => uint256[]) public userSubscriptions;

    event PlanCreated(
        uint256 indexed planId,
        address indexed merchant,
        string name,
        uint256 amount,
        uint256 interval
    );

    event PlanUpdated(
        uint256 indexed planId,
        string name,
        uint256 amount,
        bool active
    );

    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        uint256 indexed planId,
        address indexed subscriber,
        uint256 startTime
    );

    event PaymentProcessed(
        uint256 indexed subscriptionId,
        uint256 indexed planId,
        address indexed subscriber,
        uint256 amount,
        uint256 fee,
        uint256 timestamp
    );

    event SubscriptionCancelled(
        uint256 indexed subscriptionId,
        address indexed subscriber,
        uint256 timestamp
    );

    event PlatformFeeUpdated(uint256 newFeePercent);
    event FeeCollectorUpdated(address newFeeCollector);

    constructor(address _pyusdToken, address _feeCollector) Ownable(msg.sender) {
        require(_pyusdToken != address(0), "Invalid PyUSD token address");
        require(_feeCollector != address(0), "Invalid fee collector address");
        pyusdToken = IERC20(_pyusdToken);
        feeCollector = _feeCollector;
    }

    /**
     * @dev Creates a new subscription plan
     */
    function createPlan(
        string memory name,
        uint256 amount,
        uint256 interval
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Plan name cannot be empty");
        require(amount > 0, "Amount must be greater than 0");
        require(interval >= 1 days, "Interval must be at least 1 day");

        planCounter++;
        uint256 planId = planCounter;

        plans[planId] = Plan({
            id: planId,
            name: name,
            amount: amount,
            interval: interval,
            active: true,
            merchant: msg.sender
        });

        merchantPlans[msg.sender].push(planId);

        emit PlanCreated(planId, msg.sender, name, amount, interval);
        return planId;
    }

    /**
     * @dev Updates an existing plan
     */
    function updatePlan(
        uint256 planId,
        string memory name,
        uint256 amount,
        bool active
    ) external {
        Plan storage plan = plans[planId];
        require(plan.id != 0, "Plan does not exist");
        require(plan.merchant == msg.sender, "Only plan owner can update");

        if (bytes(name).length > 0) {
            plan.name = name;
        }
        if (amount > 0) {
            plan.amount = amount;
        }
        plan.active = active;

        emit PlanUpdated(planId, plan.name, plan.amount, active);
    }

    /**
     * @dev Subscribe to a plan
     */
    function subscribe(uint256 planId) external nonReentrant returns (uint256) {
        Plan storage plan = plans[planId];
        require(plan.id != 0, "Plan does not exist");
        require(plan.active, "Plan is not active");
        require(plan.merchant != msg.sender, "Cannot subscribe to own plan");

        // Process initial payment
        uint256 fee = (plan.amount * platformFeePercent) / 10000;
        uint256 merchantAmount = plan.amount - fee;

        pyusdToken.safeTransferFrom(msg.sender, plan.merchant, merchantAmount);
        pyusdToken.safeTransferFrom(msg.sender, feeCollector, fee);

        subscriptionCounter++;
        uint256 subscriptionId = subscriptionCounter;

        uint256 nextBilling = block.timestamp + plan.interval;

        subscriptions[subscriptionId] = Subscription({
            planId: planId,
            subscriber: msg.sender,
            startTime: block.timestamp,
            nextBillingTime: nextBilling,
            active: true,
            totalPaid: plan.amount
        });

        userSubscriptions[msg.sender].push(subscriptionId);

        emit SubscriptionCreated(subscriptionId, planId, msg.sender, block.timestamp);
        emit PaymentProcessed(subscriptionId, planId, msg.sender, plan.amount, fee, block.timestamp);

        return subscriptionId;
    }

    /**
     * @dev Process recurring payment for a subscription
     */
    function processPayment(uint256 subscriptionId) external nonReentrant {
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.active, "Subscription is not active");
        require(block.timestamp >= subscription.nextBillingTime, "Payment not due yet");

        Plan storage plan = plans[subscription.planId];
        require(plan.active, "Plan is no longer active");

        uint256 fee = (plan.amount * platformFeePercent) / 10000;
        uint256 merchantAmount = plan.amount - fee;

        pyusdToken.safeTransferFrom(subscription.subscriber, plan.merchant, merchantAmount);
        pyusdToken.safeTransferFrom(subscription.subscriber, feeCollector, fee);

        subscription.nextBillingTime = block.timestamp + plan.interval;
        subscription.totalPaid += plan.amount;

        emit PaymentProcessed(
            subscriptionId,
            subscription.planId,
            subscription.subscriber,
            plan.amount,
            fee,
            block.timestamp
        );
    }

    /**
     * @dev Cancel a subscription
     */
    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.active, "Subscription is not active");
        require(
            subscription.subscriber == msg.sender || 
            plans[subscription.planId].merchant == msg.sender,
            "Not authorized"
        );

        subscription.active = false;

        emit SubscriptionCancelled(subscriptionId, subscription.subscriber, block.timestamp);
    }

    /**
     * @dev Get all plans created by a merchant
     */
    function getMerchantPlans(address merchant) external view returns (uint256[] memory) {
        return merchantPlans[merchant];
    }

    /**
     * @dev Get all subscriptions of a user
     */
    function getUserSubscriptions(address user) external view returns (uint256[] memory) {
        return userSubscriptions[user];
    }

    /**
     * @dev Check if a subscription needs payment
     */
    function isPaymentDue(uint256 subscriptionId) external view returns (bool) {
        Subscription storage subscription = subscriptions[subscriptionId];
        return subscription.active && block.timestamp >= subscription.nextBillingTime;
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }

    /**
     * @dev Update fee collector address (only owner)
     */
    function updateFeeCollector(address newFeeCollector) external onlyOwner {
        require(newFeeCollector != address(0), "Invalid address");
        feeCollector = newFeeCollector;
        emit FeeCollectorUpdated(newFeeCollector);
    }
}

