// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RecoveryProcess.sol";

contract SecurityLayer is RecoveryProcess {

    event RecoverySecurityCheck(address indexed requester, bool passed);

    function initiateSecureRecovery() public onlyOwner {
        initiateRecovery();
        emit RecoverySecurityCheck(msg.sender, true);  // Notify that the security check passed
    }

    function approveWithSecurity(address _delegate) public {
        approveRecovery(_delegate);
        emit RecoverySecurityCheck(_delegate, true);
    }

    function completeSecureRecovery() public onlyOwner {
        completeRecovery();
    }
}
