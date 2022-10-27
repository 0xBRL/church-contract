// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Wedding.sol";

interface IChurch {
    /**======= WEDDING =======*/
    struct Book {
        address[] participants;
        mapping(address => uint[]) weddingsForParticipant;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    event NewWedding(address indexed creator, uint id);
    event ApproveWedding(address indexed creator, uint id);
    event RevokeWedding(address indexed creator, uint id);

    /**
     * @notice Create the new wedding
     * @param _participants: array of the participants address
     * @dev Callable by users
     */
    function createWedding(address[] memory _participants) external payable;

    /**
     * @notice Approve the wedding
     * @param _weddingId: ID of the wedding
     * @dev Callable by users
     */
    function approveWedding(uint _weddingId) external;

    /**
     * @notice Revoke the wedding
     * @param _weddingId: ID of the wedding
     * @dev Callable by users
     */
    function revokeWedding(uint _weddingId) external;

    /**
     * @notice View current number of weddings
     * @dev Callable by users
     */
    function viewWeddingsAmount() external returns (uint);

    /**
     * @notice View wedding by id
     * @param _id: ID of the wedding
     * @dev Callable by users
     */
    function viewWeddingById(uint _id) external view returns (Wedding);

    // /**
    //  * @notice Get the wedding by id
    //  * @param _weddingId: ID of the wedding
    //  * @dev Callable by users
    //  */
    // function viewWeddingById(uint _weddingId) external view;

    // /**
    //  * @notice Get the wedding by participant address
    //  * @param _participant: Address of the participant
    //  * @dev Callable by users
    //  */
    // function viewWeddingsByParticipant(address _participant) external;

    /**======= MANAGEMENT =======*/
    /**
     * @notice Transfer balance for owner
     * @dev Only callable by owner
     */
    function transferBalanceForOwner() external;

    /**
     * @notice Set fee for wedding creation
     * @param _fee: New fee in ether
     * @dev Only callable by owner
     */
    function setFee(uint _fee) external;

    /**
     * @notice View current fee fot wedding creation
     * @dev Callable by users
     */
    function viewFee() external returns (uint);

    /**
     * @notice View current balance of the Church
     * @dev Callable by users
     */
    function viewBalance() external returns (uint);
}
