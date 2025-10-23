// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockPyUSD
 * @notice Mock PayPal USD stablecoin for testing
 * @dev Simple ERC20 with minting capability for Hackathon development
 */
contract MockPyUSD is ERC20 {
    uint8 private constant DECIMALS = 6; // PyUSD uses 6 decimals

    constructor() ERC20("Mock PayPal USD", "PYUSD") {
        // Mint initial supply for testing (1M PYUSD)
        _mint(msg.sender, 1_000_000 * 10 ** DECIMALS);
    }

    /**
     * @notice Returns decimals (6 for PyUSD)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mint tokens for testing purposes - anyone can mint for hackathon
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

