import { ethers } from "ethers";
const hre = require("hardhat");

// const contractABI = require("../contract/artifacts/contracts/Swapify.sol/Swapify.json");
// const contractAddress = "0x27C13a0615ab45dA17f230522CE308787f220Da0";
// const ercABI = require("../contract/artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json");

// Create connector

const provider = new ethers.providers.InfuraProvider(
    "homestead",
    "9bde5ac2ebc84a20928bd82154cd5f6b"
);

async function swapTest() {
    // const swapContract = new ethers.Contract(
    //     contractAddress,
    //     contractABI.abi,
    //     provider
    // );
    // const swapCount = await swapContract.swapCount();
    // console.log(swapCount);

    const tokenAddress = "0x.....";
    const token = await hre.ethers.getContractAt("ERC721", tokenAddress);
    const user = "0x....";
    const swapifyAddress = "...";
    const tokenId = 200;
    await token.connect(user).approve(swapifyAddress, tokenId);
}

// async function tokenTest() {
//     const ercContract = new ethers.ContractFactory("erc721");

//     ercContract.attach("0xeE467844905022D2A6CC1dA7A0B555608faae751");

//     console.log(ercContract);
// }

module.exports = {
    swapTest,
    tokenTest,
};
