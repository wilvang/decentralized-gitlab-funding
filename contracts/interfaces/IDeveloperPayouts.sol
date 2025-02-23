// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IDeveloperPayouts
 * @author Johan F. Wilvang
 * @notice Interface for the DeveloperPayouts contract.
 * @dev This interface defines the functions for selecting issues, submitting merge requests, and requesting payments.
 */
interface IDeveloperPayouts {
    /**
     * @notice Select an issue to work on.
     * @param issueId The ID of the issue to select.
     */
    function selectIssue(uint256 issueId) external;

    /**
     * @notice Submit a merge request for a specific issue.
     * @param mergeRequest The ID of the merge request proposed.
     * @param issueId The ID of the issue for which the merge request is submitted.
     */
    function submitMergeRequest(uint256 mergeRequest, uint256 issueId) external;

    /**
     * @notice Request payment for a completed issue.
     * @param issueId The ID of the issue for which payment is requested.
     */
    function requestPayment(uint256 issueId) external;
}
