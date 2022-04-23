const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(
    (network = "ropsten"),
    API_KEY
);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const helloWorldContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contract.abi,
    signer
);

console.log(helloWorldContract);

async function main() {
    let message = await helloWorldContract.sender();
    console.log("Message ", message);

    const tx = await helloWorldContract.update("Lets gooo!");
    await tx.wait();

    message = await helloWorldContract.message();
    console.log("New message ", message);
}
main();
