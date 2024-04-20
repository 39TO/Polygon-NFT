// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


//  My39NFT.sol
contract My39NFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    // NFTメタデータのベースURI (IPFSのCID)
    string public baseURI;

    constructor(string memory _baseURI) ERC721("My39NFT", "TO") Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    function mintNFT(address recipient, string memory _baseURI) public onlyOwner{
        _tokenIdCounter += 1;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(recipient, newTokenId);
        _tokenURIs[newTokenId] = _baseURI;
    }
    function transferFrom(address from, address to, uint256 tokenId) public override {}
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {}
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked(_tokenURIs[tokenId], Strings.toString(tokenId), ".json"));
    }
}