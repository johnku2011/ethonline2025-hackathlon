// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title MockMorphoVault
 * @notice Mock Morpho vault for testing yield generation
 * @dev Simulates ERC4626-like vault behavior for hackathon
 */
contract MockMorphoVault {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable asset;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;
    uint256 public totalAssets;
    uint256 private yieldAccumulator;

    constructor(address _asset) {
        asset = IERC20(_asset);
    }

    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        asset.safeTransferFrom(msg.sender, address(this), assets);
        
        shares = totalSupply == 0 ? assets : (assets * totalSupply) / totalAssets;
        balanceOf[receiver] += shares;
        totalSupply += shares;
        totalAssets += assets;
        
        return shares;
    }

    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares) {
        shares = (assets * totalSupply) / totalAssets;
        require(balanceOf[owner] >= shares, "Insufficient shares");
        
        balanceOf[owner] -= shares;
        totalSupply -= shares;
        totalAssets -= assets;
        
        asset.safeTransfer(receiver, assets);
        return shares;
    }

    function convertToAssets(uint256 shares) external view returns (uint256) {
        if (totalSupply == 0) return shares;
        return (shares * (totalAssets + yieldAccumulator)) / totalSupply;
    }

    function convertToShares(uint256 assets) external view returns (uint256) {
        if (totalSupply == 0) return assets;
        return (assets * totalSupply) / (totalAssets + yieldAccumulator);
    }

    function simulateYield(uint256 yieldAmount) external {
        yieldAccumulator += yieldAmount;
    }
}

