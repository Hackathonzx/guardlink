// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelegateSetup {
    struct Delegate {
        address delegateAddress;
        uint256 reputation;
    }

    mapping(address => Delegate) public delegates;
    mapping(address => bool) public isDelegate;

    event DelegateAdded(address indexed delegate);
    event ReputationUpdated(address indexed delegate, uint256 newReputation);

    modifier onlyValidDelegate(address _delegate) {
        require(isDelegate[_delegate], "Not a registered delegate");
        _;
    }

    function addDelegate(address _delegate) public {
        require(!isDelegate[_delegate], "Delegate already added");
        delegates[_delegate] = Delegate(_delegate, 0);  // Initialize with zero reputation
        isDelegate[_delegate] = true;
        emit DelegateAdded(_delegate);
    }

    function updateReputation(address _delegate, bool success) public onlyValidDelegate(_delegate) {
        if (success) {
            delegates[_delegate].reputation += 1;
        } else {
            if (delegates[_delegate].reputation > 0) {
                delegates[_delegate].reputation -= 1;
            }
        }
        emit ReputationUpdated(_delegate, delegates[_delegate].reputation);
    }

    function getReputation(address _delegate) public view returns (uint256) {
        return delegates[_delegate].reputation;
    }
}
