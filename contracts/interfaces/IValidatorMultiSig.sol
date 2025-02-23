// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IValidatorMultiSig
 * @author Johan F. Wilvang
 * @notice Interface for the ValidatorMultiSig contract.
 * @dev This interface defines the functions for approving work and releasing funds.
 */
interface IValidatorMultiSig {
    /**
     * @notice Approve work for a specific issue.
     * @param mergeRequest The ID of the merge request to approve.
     */
    function approveWork(uint256 mergeRequest) external;

    /**
     * @notice Release funds for a specific issue to a developer.
     * @param issueId The ID of the issue to release funds for.
     * @param developer The address of the developer to receive the funds.
     */
    function releaseFunds(uint256 issueId, uint256 mergeRequest, address developer) external payable;
}
