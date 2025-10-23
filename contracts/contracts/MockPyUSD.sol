// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPyUSD
 * @notice Mock PayPal USD stablecoin for testing
 * @dev Simple ERC20 with minting capability for Hackathon development
 */
contract MockPyUSD is ERC20, Ownable {
    uint8 private constant DECIMALS = 6; // PyUSD uses 6 decimals

    constructor(
        address initialOwner
    ) ERC20("Mock PayPal USD", "PYUSD") Ownable(initialOwner) {
        // Mint initial supply for testing (1M PYUSD)
        _mint(initialOwner, 1_000_000 * 10 ** DECIMALS);
    }

    /**
     * @notice Returns decimals (6 for PyUSD)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mint tokens for testing purposes
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

