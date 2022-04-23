
const hre = require("hardhat");

async function main() {


    const tokenAddress = "0x.....";
    const token = await hre.ethers.getContractAt("ERC721", tokenAddress);
    const user = "0x....";
    const swapifyAddress = "...";
    const tokenId = 200;
    await token.connect(user).approve(swapifyAddress, tokenId);

    // get signer, buyer and seller
    const [signer, seller] = await ethers.getSigners();
    console.log("signer:", signer.address);
    console.log("seller:", seller.address);

    // seller acquire token 0
    await originalToken.safeMint(seller.address);
    let owner0 = await originalToken.ownerOf(0);
    console.log("Owner of Token 0 is:", owner0);

    // approve from interface
    await token.connect(seller).approve(signer.address, 0)






}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
