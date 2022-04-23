
const hre = require("hardhat");

async function main() {

    // Test token 
    const Token = await hre.ethers.getContractFactory("Token");
    const originalToken = await Token.deploy();

    await originalToken.deployed();
    console.log("Token deployed to:", originalToken.address);

    const token = await hre.ethers.getContractAt("ERC721", originalToken.address);

    // get signer, buyer and seller
    const [signer, seller, buyer] = await ethers.getSigners();
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
