// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IWedding {
    enum Status {
        CREATED,
        ACTIVE,
        REVOKED
    }

    struct Union {
        Status status;
        address[] participants;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
        mapping(address => bool) approvals;
        mapping(address => bool) revocations;
    }

    /**
     * @notice Approve the wedding by msg.sender
     * @param _participant: The participant address
     * @dev Callable by users
     */
    function approve(address _participant) external;

    /**
     * @notice Revoke the wedding by msg.sender
     * @param _participant: The participant address
     * @dev Callable by users
     */
    function revoke(address _participant) external;

    /**
     * @notice View current status
     * @dev Callable by users
     */
    function viewStatus() external returns (Status);

    /**
     * @notice View all participants
     * @dev Callable by users
     */
    function viewParticipants() external returns (address[] memory);
}
