// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Wedding.sol";

interface IChurch {
    /**======= WEDDING =======*/
    struct Book {
        address[] participants;
        mapping(address => uint256[]) weddingsForParticipant;
        mapping(address => uint256) indexOf;
        mapping(address => bool) inserted;
    }

    event NewWedding(address indexed creator, uint256 id);
    event ApproveWedding(address indexed creator, uint256 id);
    event RevokeWedding(address indexed creator, uint256 id);

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
    function approveWedding(uint256 _weddingId) external;

    /**
     * @notice Revoke the wedding
     * @param _weddingId: ID of the wedding
     * @dev Callable by users
     */
    function revokeWedding(uint256 _weddingId) external;

    /**
     * @notice View current number of weddings
     * @dev Callable by users
     */
    function viewWeddingsAmount() external returns (uint256);

    /**
     * @notice View wedding by id
     * @param _id: ID of the wedding
     * @dev Callable by users
     */
    function viewWeddingById(uint256 _id) external view returns (Wedding);

    /**
     * @notice Get the weddings id by participant address
     * @param _participant: Address of the participant
     * @dev Callable by users
     */
    function viewWeddingsIdByParticipant(address _participant) external view returns (uint256[] memory);

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
    function setFee(uint256 _fee) external;

    /**
     * @notice View current fee fot wedding creation
     * @dev Callable by users
     */
    function viewFee() external returns (uint256);

    /**
     * @notice View current balance of the Church
     * @dev Callable by users
     */
    function viewBalance() external returns (uint256);
}
