// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IValidatorMultiSig.sol";
import "./interfaces/IDeveloperPayouts.sol";

/**
 * @title DeveloperPayouts
 * @author Johan F. Wilvang
 * @notice This contract handles the payout process for developers working on specific issues.
 * @dev The contract interacts with a ValidatorMultiSig contract to release funds upon request.
 */
contract DeveloperPayouts is IDeveloperPayouts, ReentrancyGuard {
    // Reference to the ValidatorMultiSig contract
    IValidatorMultiSig validatorMultiSig;

    // Events for searchable EVM logging
    event IssueSelected(address indexed developer, uint256 indexed issueId);
    event MergeRequestSubmitted(address indexed developer, uint256 indexed issueId);
    event PaymentRequested(address indexed developer, uint256 indexed issueId);

    /**
     * @notice Constructor to initialize the contract with the ValidatorMultiSig contract address.
     * @param _validatorMultiSig The address of the ValidatorMultiSig contract.
     */
    constructor(address _validatorMultiSig) {
        validatorMultiSig = IValidatorMultiSig(_validatorMultiSig);
    }

    /**
     * @notice Select an issue to work on.
     * @dev This function allows a developer to select an issue. Implementation details are to be added.
     * @param issueId The ID of the issue to select.
     */
    function selectIssue(uint256 issueId) external {
        // Implementation for selecting an issue
        emit IssueSelected(msg.sender, issueId);
    }

    /**
     * @notice Submit a merge request for a specific issue.
     * @dev This function allows a developer to submit a merge request for an issue. Implementation details are to be added.
     * @param issueId The ID of the issue for which the merge request is submitted.
     */
    function submitMergeRequest(uint256 issueId) external {
        // Implementation for submitting a merge request
        emit MergeRequestSubmitted(msg.sender, issueId);
    }

    /**
     * @notice Request payment for a completed issue.
     * @dev This function allows a developer to request payment for a completed issue. It interacts with the ValidatorMultiSig contract to release funds.
     * @param issueId The ID of the issue for which payment is requested.
     */
    function requestPayment(uint256 issueId) external nonReentrant {
        validatorMultiSig.releaseFunds(issueId, msg.sender);
        emit PaymentRequested(msg.sender, issueId);
    }
}
