// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IMorphoVault.sol";

/**
 * @title MockMorphoVault
 * @notice Mock implementation of Morpho Vault for testing
 * @dev Simulates yield generation for testing subscription contracts
 */
contract MockMorphoVault is IMorphoVault {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable assetToken;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    uint256 public totalAssets;
    uint256 private yieldAccumulator;

    event YieldSimulated(uint256 amount, uint256 newTotalAssets);

    constructor(address _asset) {
        require(_asset != address(0), "Invalid asset address");
        assetToken = IERC20(_asset);
    }

    /**
     * @notice Deposit assets and receive shares
     */
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        require(assets > 0, "Cannot deposit 0");
        require(receiver != address(0), "Invalid receiver");

        assetToken.safeTransferFrom(msg.sender, address(this), assets);
        
        // Calculate shares: first deposit gets 1:1, later deposits account for yield
        shares = totalSupply == 0 ? assets : (assets * totalSupply) / totalAssets;
        
        balanceOf[receiver] += shares;
        totalSupply += shares;
        totalAssets += assets;
        
        return shares;
    }

    /**
     * @notice Withdraw assets by burning shares
     */
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares) {
        require(assets > 0, "Cannot withdraw 0");
        require(receiver != address(0), "Invalid receiver");
        
        // Calculate shares needed (including accumulated yield)
        uint256 totalValue = totalAssets + yieldAccumulator;
        shares = (assets * totalSupply) / totalValue;
        
        require(balanceOf[owner] >= shares, "Insufficient shares");
        
        balanceOf[owner] -= shares;
        totalSupply -= shares;
        totalAssets -= assets;
        
        // If we have accumulated yield, use it proportionally
        if (yieldAccumulator > 0) {
            uint256 yieldPortion = (assets * yieldAccumulator) / totalValue;
            yieldAccumulator -= yieldPortion;
        }
        
        assetToken.safeTransfer(receiver, assets);
        return shares;
    }

    /**
     * @notice Convert shares to assets (including yield)
     */
    function convertToAssets(uint256 shares) external view returns (uint256) {
        if (totalSupply == 0) return shares;
        return (shares * (totalAssets + yieldAccumulator)) / totalSupply;
    }

    /**
     * @notice Get the underlying asset
     */
    function asset() external view returns (address) {
        return address(assetToken);
    }

    /**
     * @notice Simulate yield generation for testing
     * @dev Only for testing - simulates APY without actual DeFi integration
     */
    function simulateYield(uint256 yieldAmount) external {
        yieldAccumulator += yieldAmount;
        emit YieldSimulated(yieldAmount, totalAssets + yieldAccumulator);
    }

    /**
     * @notice Simulate time-based yield (APY calculation)
     * @param annualRateBps Annual rate in basis points (e.g., 450 = 4.5%)
     * @param timeElapsed Time elapsed in seconds
     */
    function simulateTimeBasedYield(uint256 annualRateBps, uint256 timeElapsed) external {
        require(totalAssets > 0, "No assets deposited");
        
        // Calculate yield: assets * rate * time / (365 days * 10000)
        uint256 yieldAmount = (totalAssets * annualRateBps * timeElapsed) / (365 days * 10000);
        yieldAccumulator += yieldAmount;
        
        emit YieldSimulated(yieldAmount, totalAssets + yieldAccumulator);
    }

    /**
     * @notice Get current yield accumulated
     */
    function getCurrentYield() external view returns (uint256) {
        return yieldAccumulator;
    }

    /**
     * @notice Get total value (assets + yield)
     */
    function getTotalValue() external view returns (uint256) {
        return totalAssets + yieldAccumulator;
    }
}


