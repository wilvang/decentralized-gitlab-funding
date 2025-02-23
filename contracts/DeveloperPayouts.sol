// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IFundManager.sol";
import "./interfaces/IValidatorMultiSig.sol";
import "./interfaces/IDeveloperPayouts.sol";

/**
 * @title DeveloperPayouts
 * @notice This contract handles the payout process for developers working on specific issues.
 * @dev The contract interacts with a ValidatorMultiSig contract to release funds upon request.
 */
contract DeveloperPayouts is IDeveloperPayouts, ReentrancyGuard {
    // Reference to the other contracts
    IValidatorMultiSig validatorMultiSig;
    IFundManager fundManager;

    // Mapping to track developers working on each issue
    mapping(uint256 => address[]) public issuesInDevelopment;

    // Mapping to track the merge request IDs for each developer and issue
    mapping(address => mapping(uint256 => uint256)) public proposals;

    // Events for searchable EVM logging
    event IssueSelected(address indexed developer, uint256 indexed issueId);
    event MergeRequestSubmitted(address indexed developer,uint256 indexed mergeRequest, uint256 indexed issueId);
    event PaymentRequested(address indexed developer, uint256 indexed issueId);

    /**
     * @notice Constructor to initialize the contract with the FundManager and ValidatorMultiSig contract addresses.
     * @param _fundManager The address of the FundManager contract.
     * @param _validatorMultiSig The address of the ValidatorMultiSig contract.
     */
    constructor(address _fundManager, address _validatorMultiSig) {
        fundManager = IFundManager(_fundManager);
        validatorMultiSig = IValidatorMultiSig(_validatorMultiSig);
    }

    /**
     * @notice Select an issue to work on.
     * @dev This function allows a developer to select an issue.
     * @param issueId The ID of the issue to select.
     */
    function selectIssue(uint256 issueId) external uniqueDeveloper(issueId) isFunded(issueId) {
        issuesInDevelopment[issueId].push(msg.sender);
        emit IssueSelected(msg.sender, issueId);
    }

    /**
     * @notice Submit a merge request for a specific issue.
     * @dev This function allows a developer to submit a merge request for an issue.
     * @param mergeRequest The ID of the merge request proposed.
     * @param issueId The ID of the issue for which the merge request is submitted.
     */
    function submitMergeRequest(uint256 mergeRequest, uint256 issueId) external {
        proposals[msg.sender][issueId] = mergeRequest;
        emit MergeRequestSubmitted(msg.sender, mergeRequest, issueId);
    }

    /**
     * @notice Request payment for a completed issue.
     * @dev This function allows a developer to request payment for a completed issue. It interacts with the ValidatorMultiSig contract to release funds.
     * @param mergeRequest The ID of the merge request for which payment is requested.
     */
    function requestPayment(uint256 mergeRequest) external nonReentrant {
        uint256 issueId = proposals[msg.sender][mergeRequest];
        validatorMultiSig.releaseFunds(issueId, mergeRequest, msg.sender);
        
        delete issuesInDevelopment[issueId];
        emit PaymentRequested(msg.sender, issueId);
    }

    /**
     * @dev Modifier to check if the issue has allocated funds.
     * @param issueId The ID of the issue to check.
     */
    modifier isFunded(uint256 issueId) {
        require(fundManager.getIssueFunds(issueId) > 0, "Issue is not funded");
        _;
    }

    /**
     * @dev Modifier to ensure a developer can only select an issue once.
     * @param issueId The ID of the issue to check.
     */
    modifier uniqueDeveloper(uint256 issueId) {
        bool exists = false;
        for (uint256 i = 0; i < issuesInDevelopment[issueId].length; i++) {
            if (issuesInDevelopment[issueId][i] == msg.sender) {
                exists = true;
                break;
            }
        }
        require(!exists, "Developer already assigned to this issue");
        _;
    }
}
