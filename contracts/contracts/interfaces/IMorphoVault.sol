// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IMorphoVault
 * @notice Interface for Morpho Protocol vault integration
 * @dev Minimal interface for deposit/withdraw and share conversion
 */
interface IMorphoVault {
    /**
     * @notice Deposit assets into the vault
     * @param assets Amount of assets to deposit
     * @param receiver Address that will receive the shares
     * @return shares Amount of shares minted
     */
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);

    /**
     * @notice Withdraw assets from the vault
     * @param assets Amount of assets to withdraw
     * @param receiver Address that will receive the assets
     * @param owner Address that owns the shares
     * @return shares Amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);

    /**
     * @notice Get the share balance of an account
     * @param account Address to query
     * @return balance Share balance
     */
    function balanceOf(address account) external view returns (uint256 balance);

    /**
     * @notice Convert shares to assets
     * @param shares Amount of shares to convert
     * @return assets Equivalent amount of assets
     */
    function convertToAssets(uint256 shares) external view returns (uint256 assets);

    /**
     * @notice Get the underlying asset address
     * @return assetAddress Address of the underlying asset token
     */
    function asset() external view returns (address assetAddress);
}

