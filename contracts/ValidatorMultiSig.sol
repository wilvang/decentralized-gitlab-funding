// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IValidatorMultiSig.sol";
import "./interfaces/IFundManager.sol";

/**
 * @title ValidatorMultiSig
 * @notice This contract allows a group of validators to approve and release funds for specific issues.
 * @dev The contract uses a multi-signature mechanism where a minimum number of approvals are required to release funds.
 */
contract ValidatorMultiSig is ReentrancyGuard, IValidatorMultiSig {
    // Reference to the FundManager contract
    IFundManager fundManager;

    struct Validator {
        mapping(uint256 => bool) hasVoted;
        bool authorized;
    }

    // The minimum number of approvals required to release funds for an issue
    uint256 public constant requiredApprovals = 3;

    // Mapping to track the number of approvals each issue has received
    mapping(uint256 => uint256) public approvals;

    // Mapping to track which addresses are authorized validators
    mapping(address => Validator) public isValidator;

    // Events for searchable EVM logging
    event WorkApproved(address indexed validator, uint256 indexed issueId);
    event FundsReleased(uint256 indexed issueId, uint256 amount);

    /**
     * @notice Constructor to initialize the contract with the fund manager and validators.
     * @param _fundManager The address of the fund manager contract.
     * @param validators The list of validator addresses.
     */
    constructor(address _fundManager, address[] memory validators) {
        fundManager = IFundManager(_fundManager);
        for (uint256 i = 0; i < validators.length; i++) {
            isValidator[validators[i]].authorized = true;
        }
    }

    /**
     * @notice Approve work for a specific issue.
     * @dev This function allows a validator to approve work for an issue.
     * @param mergeRequest The ID of the merge request to approve.
     */
    function approveWork(uint256 mergeRequest) external onlyValidator singleVote(mergeRequest) {
        approvals[mergeRequest]++;
        emit WorkApproved(msg.sender, mergeRequest);
    }

    /**
     * @notice Release funds for a specific issue if the required number of approvals is met.
     * @dev This function releases funds to the developer if the required number of approvals is met.
     * @param issueId The ID of the issue to release funds for.
     * @param mergeRequest The ID of the merge request associated with the issue.
     * @param developer The address of the developer to receive the funds.
     */
    function releaseFunds(uint256 issueId, uint256 mergeRequest, address developer) external payable 
    workApproved(mergeRequest) isFunded(issueId) nonReentrant {
        
        uint256 amount = fundManager.getIssueFunds(issueId);
        payable(developer).transfer(amount);

        emit FundsReleased(issueId, amount);

        // Reset the approvals for the issue
        delete approvals[issueId];
    }

    /**
     * @dev Modifier to check if the caller is an authorized validator.
     */
    modifier onlyValidator() {
        require(isValidator[msg.sender].authorized, "Not an authorized validator");
        _;
    }

    /**
     * @dev Modifier to ensure a validator can only vote once per issue.
     * @param issueId The ID of the issue to check.
     */
    modifier singleVote(uint256 issueId) {
        require(!isValidator[msg.sender].hasVoted[issueId], "You have already voted");
        _;
    }

    /**
     * @dev Modifier to check if the issue has allocated funds.
     * @param issueId The ID of the issue to check.
     */
    modifier isFunded(uint256 issueId) {
        uint256 amount = fundManager.getIssueFunds(issueId);
        require(amount > 0, "No funds allocated for this issue");
        _;
    }

    /**
     * @dev Modifier to check if the work has received the required number of approvals.
     * @param mergeRequest The ID of the merge request to check.
     */
    modifier workApproved(uint256 mergeRequest) {
        require(approvals[mergeRequest] >= requiredApprovals, "Not enough approvals");
        _;
    }
}
