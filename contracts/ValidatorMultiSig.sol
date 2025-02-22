// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IValidatorMultiSig.sol";
import "./interfaces/IFundManager.sol";

/**
 * @title ValidatorMultiSig
 * @author Johan F. Wilvang
 * @notice This contract allows a group of validators to approve and release funds for specific issues.
 * @dev The contract uses a multi-signature mechanism where a minimum number of approvals are required to release funds.
 */
contract ValidatorMultiSig is ReentrancyGuard, IValidatorMultiSig {
    // Reference to the FundManager contract
    IFundManager fundManager;

    // The minimum number of approvals required to release funds for an issue
    uint256 public constant requiredApprovals = 3;

    // Mapping to track the number of approvals each issue has received
    mapping(uint256 => uint256) public approvals;

    // Mapping to track which addresses are authorized validators
    mapping(address => bool) public isValidator;


    // Events for searchable EVM logging
    event WorkApproved(address indexed validator, uint256 indexed issueId);
    event FundsReleased(uint256 indexed issueId, uint256 amount);

    /**
     * @dev Modifier to check if the caller is an authorized validator.
     */
    modifier onlyValidator() {
        require(isValidator[msg.sender], "Not an authorized validator");
        _;
    }

    /**
     * @notice Constructor to initialize the contract with the fund manager and validators.
     * @param _fundManager The address of the fund manager contract.
     * @param validators The list of validator addresses.
     */
    constructor(address _fundManager, address[] memory validators) {
        fundManager = IFundManager(_fundManager);
        for (uint256 i = 0; i < validators.length; i++) {
            isValidator[validators[i]] = true;
        }
    }

    /**
     * @notice Approve work for a specific issue.
     * @dev This function allows a validator to approve work for an issue.
     * @param issueId The ID of the issue to approve.
     */
    function approveWork(uint256 issueId) external onlyValidator {
        approvals[issueId]++;
        emit WorkApproved(msg.sender, issueId);
    }

    /**
     * @notice Release funds for a specific issue if the required number of approvals is met.
     * @dev This function releases funds to the developer if the required number of approvals is met.
     * @param issueId The ID of the issue to release funds for.
     * @param developer The address of the developer to receive the funds.
     */
    function releaseFunds(uint256 issueId, address developer) external payable onlyValidator nonReentrant {
        require(approvals[issueId] >= requiredApprovals, "Not enough approvals");
        uint256 amount = fundManager.getIssueFunds(issueId);
        require(amount > 0, "No funds allocated for this issue");

        // Transfer the funds to the developer
        (bool success, ) = developer.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(issueId, amount);

        // Reset the approvals for the issue
        approvals[issueId] = 0;
    }
}
