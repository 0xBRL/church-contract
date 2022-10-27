// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./interfaces/IWedding.sol";

contract Wedding is IWedding {
    Union private union;

    constructor(address[] memory _participants) {
        require(_participants.length > 0, "Need at least one participant");

        for (uint cursor = 0; cursor < _participants.length; cursor++) {
            address participant = _participants[cursor];
            require(union.inserted[participant] == false, "Repeat participants");

            union.inserted[participant] = true;
            union.indexOf[participant] = union.participants.length;
            union.participants.push(participant);

            union.approvals[participant] = false;
            union.revocations[participant] = false;
        }

        union.status = Status.ACTIVE;
    }

    modifier isActive() {
        require(union.status == Status.ACTIVE, "Don't active");
        _;
    }

    modifier onlyParticipants(address _participant) {
        require(union.inserted[_participant] == true, "Only participants");
        _;
    }

    modifier isApproved(address _participant) {
        require(union.approvals[_participant] == true, "Only approved");
        _;
    }

    modifier notAprroved(address _participant) {
        require(union.approvals[_participant] == false, "Only not approved");
        _;
    }

    modifier notRevokedByParticipant(address _participant) {
        require(union.revocations[_participant] == false, "Already revoked");
        _;
    }

    function approve(address _participant)
        external
        onlyParticipants(_participant)
        isActive
        notAprroved(_participant)
    {
        union.approvals[_participant] = true;
    }

    function revoke(address _participant)
        external
        onlyParticipants(_participant)
        isApproved(_participant)
        notRevokedByParticipant(_participant)
    {
        if (union.status == Status.ACTIVE) {
            union.status = Status.REVOKED;
        }
        union.revocations[_participant] = true;
    }

    function viewStatus() external view override returns (Status) {
        return union.status;
    }

    function viewParticipants()
        external
        view
        override
        returns (address[] memory)
    {
        return union.participants;
    }
}
