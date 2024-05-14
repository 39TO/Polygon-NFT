// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


//  My39NFT.sol
contract URIStorageSBT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("My39NFT", "TO") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenUrl) public onlyOwner{
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenUrl);
    }
    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert("Transfer is not allowed for this token");
    }
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override(ERC721, IERC721) {
        revert("Transfer is not allowed for this token");
    }
}