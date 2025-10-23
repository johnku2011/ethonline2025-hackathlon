// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title SubscriptionLib
 * @notice Library for subscription-related calculations and validations
 * @dev Pure functions for gas-efficient calculations, following OpenZeppelin library pattern
 */
library SubscriptionLib {
    // ============ Constants ============
    
    uint256 internal constant SECONDS_IN_YEAR = 365 days;
    uint256 internal constant APY_BASIS_POINTS = 450; // 4.5% APY
    uint256 internal constant BASIS_POINTS = 10000;
    uint256 internal constant MAX_PLATFORM_FEE = 1000; // 10% max
    
    // ============ Errors ============
    
    error InvalidPrice();
    error InvalidName();
    error InvalidPlatformFee();
    error InvalidAddress();
    error SelfSubscription();
    
    // ============ Fee Calculations ============
    
    /**
     * @notice Calculate platform fee and provider amount
     * @param principal Total amount paid
     * @param feePercent Platform fee in basis points
     * @return platformFee Fee amount for platform
     * @return providerAmount Amount for provider (principal - fee)
     */
    function calculateFees(uint256 principal, uint256 feePercent) 
        internal 
        pure 
        returns (uint256 platformFee, uint256 providerAmount) 
    {
        platformFee = (principal * feePercent) / BASIS_POINTS;
        providerAmount = principal - platformFee;
    }
    
    /**
     * @notice Calculate projected interest based on 4.5% APY
     * @param principal Principal amount
     * @return projectedInterest Expected interest after 1 year
     */
    function calculateProjectedInterest(uint256 principal) 
        internal 
        pure 
        returns (uint256 projectedInterest) 
    {
        projectedInterest = (principal * APY_BASIS_POINTS) / BASIS_POINTS;
    }
    
    /**
     * @notice Calculate actual interest earned
     * @param currentValue Current value including yield
     * @param principal Original principal
     * @return interest Actual interest earned (0 if no profit)
     */
    function calculateActualInterest(uint256 currentValue, uint256 principal) 
        internal 
        pure 
        returns (uint256 interest) 
    {
        interest = currentValue > principal ? currentValue - principal : 0;
    }
    
    // ============ Time Calculations ============
    
    /**
     * @notice Calculate subscription expiration time
     * @param startTime Start timestamp
     * @return expirationTime Expiration timestamp (1 year later)
     */
    function calculateExpiration(uint256 startTime) 
        internal 
        pure 
        returns (uint256 expirationTime) 
    {
        expirationTime = startTime + SECONDS_IN_YEAR;
    }
    
    /**
     * @notice Check if subscription has expired
     * @param expirationTime Expiration timestamp
     * @return expired Whether subscription has expired
     */
    function isExpired(uint256 expirationTime) 
        internal 
        view 
        returns (bool expired) 
    {
        expired = block.timestamp >= expirationTime;
    }
    
    // ============ Validations ============
    
    /**
     * @notice Validate plan creation parameters
     * @param yearlyPrice Price per year
     * @param name Plan name
     * @param provider Provider address
     */
    function validatePlanParams(
        uint256 yearlyPrice, 
        string memory name,
        address provider
    ) internal pure {
        if (yearlyPrice == 0) revert InvalidPrice();
        if (bytes(name).length == 0) revert InvalidName();
        if (provider == address(0)) revert InvalidAddress();
    }
    
    /**
     * @notice Validate subscription parameters
     * @param subscriber Subscriber address
     * @param provider Provider address
     */
    function validateSubscriptionParams(
        address subscriber,
        address provider
    ) internal pure {
        if (provider == address(0)) revert InvalidAddress();
        if (subscriber == provider) revert SelfSubscription();
    }
    
    /**
     * @notice Validate platform fee update
     * @param newFeePercent New fee percentage in basis points
     */
    function validatePlatformFee(uint256 newFeePercent) internal pure {
        if (newFeePercent > MAX_PLATFORM_FEE) revert InvalidPlatformFee();
    }
    
    /**
     * @notice Validate address is not zero
     * @param addr Address to validate
     */
    function validateAddress(address addr) internal pure {
        if (addr == address(0)) revert InvalidAddress();
    }
}

