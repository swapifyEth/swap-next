
const hre = require("hardhat");

async function main() {

    // Test token 
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy();

    await token.deployed();
    console.log("Token deployed to:", token.address);

    // Swapify Contract
    const Swapify = await hre.ethers.getContractFactory("Swapify");
    const swapify = await Swapify.deploy();

    await swapify.deployed();
    console.log("Swapify deployed to:", swapify.address);

    // get signer, buyer and seller
    const [signer, seller, buyer] = await ethers.getSigners();
    console.log("signer:", signer.address);
    console.log("seller:", seller.address);
    console.log("buyer:", buyer.address);

    // seller acquire token 0
    await token.safeMint(seller.address);
    let owner0 = await token.ownerOf(0);
    console.log("Owner of Token 0 is:", owner0);

    // buyer acquire token 1 and 2
    await token.safeMint(buyer.address);
    await token.safeMint(buyer.address);
    let owner1 = await token.ownerOf(1);
    let owner2 = await token.ownerOf(2);
    console.log("Owner of Token 1 is:", owner1);
    console.log("Owner of Token 2 is:", owner2);


    // Approve swapify to spend token 0
    await token.connect(seller).approve(swapify.address, 0);
    console.log("seller approved contract");

    // create swap
    await swapify.connect(seller).createSwap([token.address], [0], "My token");
    console.log("swap created");

    //  Approve swapify to spend token 0
    await token.connect(buyer).approve(swapify.address, 1);
    await token.connect(buyer).approve(swapify.address, 2);
    console.log("buyer approved contract");

    // create offer
    await swapify.connect(buyer).proposeOffer(0, [token.address, token.address], [1, 2]);
    console.log("offer created");

    // accept offer
    await swapify.connect(seller).acceptOffer(0, 0);

    // Check owners 
    let new_owner0 = await token.ownerOf(0);
    let new_owner1 = await token.ownerOf(1);
    let new_owner2 = await token.ownerOf(2);

    console.log("Old owner of 0:", owner0, " New Owner of 0:", new_owner0);
    console.log("Old owner of 1:", owner1, " New Owner of 1:", new_owner1);
    console.log("Old owner of 2:", owner2, " New Owner of 2:", new_owner2);




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
