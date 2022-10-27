// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Wedding.sol";
import "./interfaces/IChurch.sol";

contract Church is IChurch, Ownable {
    uint256 private fee;

    Wedding[] private weddings;
    Book private book;

    modifier isValidWedding(uint256 _weddingId) {
        require(weddings.length - 1 >= _weddingId, "Invalid wedding id");
        _;
    }

    constructor(uint256 _fee) {
        fee = _fee;
    }

    function createWedding(address[] memory _participants) public payable {
        require(msg.value >= fee, "Invalid fee for the create wedding");

        uint256 id = weddings.length;
        Wedding wedding = new Wedding(_participants);
        weddings.push(wedding);

        for (uint256 cursor = 0; cursor < _participants.length; cursor++) {
            uint256[] storage weddingsOfParticipant = book.weddingsForParticipant[_participants[cursor]];
            weddingsOfParticipant.push(id);
        }

        emit NewWedding(msg.sender, id);
    }

    function approveWedding(uint256 _weddingId) public isValidWedding(_weddingId) {
        weddings[_weddingId].approve(msg.sender);
        emit ApproveWedding(msg.sender, _weddingId);
    }

    function revokeWedding(uint256 _weddingId) public isValidWedding(_weddingId) {
        weddings[_weddingId].revoke(msg.sender);
        emit RevokeWedding(msg.sender, _weddingId);
    }

    function viewWeddingsAmount() public view returns (uint256) {
        return weddings.length;
    }

    function viewWeddingById(uint256 _id) public view returns (Wedding) {
        return weddings[_id];
    }

    function transferBalanceForOwner() public onlyOwner {
        payable(owner()).transfer(viewBalance());
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function viewFee() public view returns (uint256) {
        return fee;
    }

    function viewBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
