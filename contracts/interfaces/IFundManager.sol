// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IFundManager
 * @author Johan F. Wilvang
 * @notice Interface for the FundManager contract.
 * @dev This interface defines the functions for allocating, reallocating, and retrieving funds for issues.
 */
interface IFundManager {
    /**
     * @notice Allocate funds to a specific issue.
     * @param issueId The ID of the issue to allocate funds to.
     * @param amount The amount of funds to allocate.
     */
    function allocateFunds(uint256 issueId, uint256 amount) external;

    /**
     * @notice Reallocate funds from one issue to another.
     * @param fromIssueId The ID of the issue to reallocate funds from.
     * @param toIssueId The ID of the issue to reallocate funds to.
     * @param amount The amount of funds to reallocate.
     */
    function reallocateFunds(uint256 fromIssueId, uint256 toIssueId, uint256 amount) external;

    /**
     * @notice Get the funds allocated to a specific issue.
     * @param issueId The ID of the issue to get funds for.
     * @return The amount of funds allocated to the issue.
     */
    function getIssueFunds(uint256 issueId) external view returns (uint256);
}
