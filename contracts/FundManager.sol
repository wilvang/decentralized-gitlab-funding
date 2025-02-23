// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IFundManager.sol";

/**
 * @title FundManager
 * @author Johan F. Wilvang
 * @notice This contract manages the allocation and reallocation of funds for various issues.
 * @dev The contract allows funders to contribute, allocate, and reallocate funds for specific issues.
 */
contract FundManager is IFundManager {

    // Custom errors for more efficient error handling
    error InsufficientBalance(uint256 issued, uint256 available);
    error Unauthorized(address caller);

    // Mapping to track the contributions of each funder
    mapping(address => uint256) public funderContributions;

    // Mapping to track the funds allocated to each issue
    mapping(uint256 => uint256) public issueFunds;

    // Nested mapping to track the funds a specific funder has allocated to each issue
    mapping(address => mapping(uint256 => uint256)) public trackFunds;

    // Events for searcheble EVM logging.
    event ContributionReceived(address indexed funder, uint256 amount);
    event FundsAllocated(address indexed funder, uint256 indexed issueId, uint256 amount);
    event FundsReallocated(address indexed funder, uint256 indexed fromIssueId, uint256 indexed toIssueId, uint256 amount);

    /**
     * @notice Receive function to accept Ether contributions.
     * @dev Increases the contribution balance of the sender.
     */
    receive() external payable {
        funderContributions[msg.sender] += msg.value;
	emit ContributionReceived(msg.sender, msg.value);    
    }

    /**
     * @notice Allocate funds to a specific issue.
     * @dev Transfers the specified amount from the sender's contributions to the issue's funds.
     * @param issueId The ID of the issue to allocate funds to.
     * @param amount The amount of funds to allocate.
     */
    function allocateFunds(uint256 issueId, uint256 amount) external hasSufficientBalance(amount) {    
        
        // Deduct the amount from the sender's contributions
        funderContributions[msg.sender] -= amount;
        // Add the amount to the specified issue's funds
        issueFunds[issueId] += amount;
        trackFunds[msg.sender][issueId] += amount;
    }

    /**
     * @notice Reallocate funds from one issue to another.
     * @dev Transfers the specified amount from one issue's funds to another issue's funds.
     * @param fromIssueId The ID of the issue to reallocate funds from.
     * @param toIssueId The ID of the issue to reallocate funds to.
     * @param amount The amount of funds to reallocate.
     */
    function reallocateFunds(uint256 fromIssueId, uint256 toIssueId, uint256 amount) external canReallocateFunding(fromIssueId, amount) {
        
        // Deduct the amount from the sender's tracked funds for the source issue
        trackFunds[msg.sender][fromIssueId] -= amount;
        // Deduct the amount from the source issue's funds
        issueFunds[fromIssueId] -= amount;

        // Add the amount to the sender's tracked funds for the destination issue
        trackFunds[msg.sender][toIssueId] += amount;
        // Add the amount to the destination issue's funds
        issueFunds[toIssueId] += amount;
    }

    /**
     * @notice Get the funds allocated to a specific issue.
     * @param issueId The ID of the issue to get funds for.
     * @return The amount of funds allocated to the issue.
     */
    function getIssueFunds(uint256 issueId) external view returns (uint256) {
        return issueFunds[issueId];
    }

    /**
     * @dev Modifier to check if the sender has sufficient balance to allocate funds.
     * @param amount The amount to check against the sender's balance.
     */
    modifier hasSufficientBalance(uint256 amount) {
        if (funderContributions[msg.sender] < amount) {
            revert InsufficientBalance(amount, funderContributions[msg.sender]);
        }
        _;
    }

    /**
     * @dev Modifier to check if the sender can reallocate funds from a specific issue.
     * @param issueId The ID of the issue to check.
     * @param amount The amount to check against the sender's tracked funds for the issue.
     */
    modifier canReallocateFunding(uint256 issueId, uint256 amount) {
        if (trackFunds[msg.sender][issueId] < amount) {
            revert InsufficientBalance(amount, trackFunds[msg.sender][issueId]);
        }
        _;
    }
}
