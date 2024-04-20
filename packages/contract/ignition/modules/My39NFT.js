const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");

const BASE_URL = "ipfs://bafybeifnniv7df2opoe2l6paveyciktw362g4sockn3ptwexezpckgqoke/";
module.exports = buildModule("My39NFTModule", (m) => {
    const baseURI = m.getParameter("baseURI", BASE_URL);
    const nft = m.contract("My39NFT", [baseURI]);
    return {nft};
    }
);