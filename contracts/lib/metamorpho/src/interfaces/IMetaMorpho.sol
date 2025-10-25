// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IMetaMorpho
 * @notice Interface for MetaMorpho vault (ERC4626-based)
 * @dev Simplified interface containing only the functions used by SubscriptionManager
 */
interface IMetaMorpho {
    /**
     * @notice Returns the address of the underlying asset
     * @return The address of the underlying ERC20 token
     */
    function asset() external view returns (address);

    /**
     * @notice Deposits assets into the vault
     * @param assets The amount of assets to deposit
     * @param receiver The address that will receive the shares
     * @return shares The amount of shares minted
     */
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);

    /**
     * @notice Withdraws assets from the vault
     * @param assets The amount of assets to withdraw
     * @param receiver The address that will receive the assets
     * @param owner The address that owns the shares
     * @return shares The amount of shares burned
     */
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) external returns (uint256 shares);

    /**
     * @notice Redeems shares for assets
     * @param shares The amount of shares to redeem
     * @param receiver The address that will receive the assets
     * @param owner The address that owns the shares
     * @return assets The amount of assets withdrawn
     */
    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) external returns (uint256 assets);

    /**
     * @notice Converts shares to assets
     * @param shares The amount of shares
     * @return assets The equivalent amount of assets
     */
    function convertToAssets(uint256 shares) external view returns (uint256 assets);

    /**
     * @notice Returns the maximum amount of assets that can be withdrawn
     * @param owner The address to check
     * @return maxAssets The maximum withdrawable assets
     */
    function maxWithdraw(address owner) external view returns (uint256 maxAssets);
}

