// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DelegateSetup.sol";

contract RecoveryProcess is DelegateSetup {
    address public owner;
    uint256 public rewardAmount = 10;  // Example fixed reward

    event RecoveryInitiated(address indexed requester);
    event DelegateApproved(address indexed delegate);
    event RecoveryCompleted(address indexed requester);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function initiateRecovery() public onlyOwner {
        emit RecoveryInitiated(msg.sender);
    }

    function approveRecovery(address _delegate) public onlyValidDelegate(_delegate) {
        emit DelegateApproved(_delegate);
        rewardDelegate(_delegate);
    }

    function rewardDelegate(address _delegate) internal onlyValidDelegate(_delegate) {
        delegates[_delegate].reputation += rewardAmount;
        emit ReputationUpdated(_delegate, delegates[_delegate].reputation);
    }

    function completeRecovery() public onlyOwner {
        emit RecoveryCompleted(msg.sender);
    }
}
