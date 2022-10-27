// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Wedding.sol";
import "./interfaces/IChurch.sol";

contract Church is IChurch, Ownable {
    uint private fee;

    Wedding[] private weddings;
    Book private book;

    modifier isValidWedding(uint _weddingId) {
        require(weddings.length - 1 >= _weddingId, "Invalid wedding id");
        _;
    }

    constructor(uint _fee) {
        fee = _fee;
    }

    function createWedding(address[] memory _participants) public payable {
        require(msg.value >= fee, "Invalid fee for the create wedding");

        uint id = weddings.length;
        Wedding wedding = new Wedding(_participants);
        weddings.push(wedding);

        for (uint cursor = 0; cursor < _participants.length; cursor++) {
            uint[] storage weddingsOfParticipant = book.weddingsForParticipant[_participants[cursor]];
            weddingsOfParticipant.push(id);
        }

        emit NewWedding(msg.sender, id);
    }

    function approveWedding(uint _weddingId) public isValidWedding(_weddingId) {
        weddings[_weddingId].approve(msg.sender);
        emit ApproveWedding(msg.sender, _weddingId);
    }

    function revokeWedding(uint _weddingId) public isValidWedding(_weddingId) {
        weddings[_weddingId].revoke(msg.sender);
        emit RevokeWedding(msg.sender, _weddingId);
    }

    function viewWeddingsAmount() public view returns (uint) {
        return weddings.length;
    }

    function viewWeddingById(uint _id) public view returns (Wedding) {
        return weddings[_id];
    }

    function transferBalanceForOwner() public onlyOwner {
      payable(owner()).transfer(viewBalance());
    }

    function setFee(uint _fee) public onlyOwner {
        fee = _fee;
    }

    function viewFee() public view returns (uint) {
        return fee;
    }

    function viewBalance() public view returns (uint) {
        return address(this).balance;
    }
}
