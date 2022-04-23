import { ethers } from "ethers";

const contractABI = require("../contract/artifacts/contracts/Swapify.sol/Swapify.json");
const contractAddress = "0x27C13a0615ab45dA17f230522CE308787f220Da0";
const erc721 = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");

// Create connector

// const provider = new ethers.providers.InfuraProvider(
//     "homestead",
//     "9bde5ac2ebc84a20928bd82154cd5f6b"
// );

async function swapTest() {
    const swapContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        provider
    );
    const swapCount = await swapContract.swapCount();
    console.log(swapCount);
}

async function tokkenApproval(userAddress, tokenAddress, tokenInt, provider) {
    const tokenContract = new ethers.Contract(
        tokenAddress,
        erc721.abi,
        provider
    );

    //Call approve
    const tx = await tokenContract.approve(userAddress, tokenInt);
    await tx.wait();
    console.log(tx);

    //Some kind of update?
    return true;
}

module.exports = {
    swapTest,
    tokkenApproval,
};
