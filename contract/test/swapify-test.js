// We import Chai to use its asserting functions here.
var chai = require('chai');
var sinon = require('sinon');

chai.use(require('sinon-chai'));

const expect = chai.expect

// an async function.
describe("Swapify contract", async function () {
    // Mocha has four functions that let you hook into the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for tests, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    let token;
    let swapify;
    let signer;
    let seller;
    let buyer;

    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.
    before(async function () {
        // Get the ContractFactory and Signers here.
        [signer, seller, buyer,] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();

        Swapify = await ethers.getContractFactory("Swapify");
        swapify = await Swapify.deploy();
        await swapify.deployed();

        // seller acquire token 0
        await token.safeMint(seller.address);
        // buyer acquire token 1 and 2
        await token.safeMint(buyer.address);
        await token.safeMint(buyer.address);

        // Approve swapify to spend token 0
        await token.connect(seller).approve(swapify.address, 0);
        //  Approve swapify to spend token 0
        await token.connect(buyer).approve(swapify.address, 1);
        await token.connect(buyer).approve(swapify.address, 2);

    });

    describe("Swap Flow", async function () {

        it("Should set the right seller", async function () {
            await swapify.connect(seller).createSwap([token.address], [0], "My token");

            expect((await swapify.swaps(0))[2]).to.equal(seller.address);
            expect((await swapify.swaps(0))[3]).to.equal("0x0000000000000000000000000000000000000000");
        });

        it("Should set the right buyer", async function () {
            await swapify.connect(buyer).proposeOffer(0, [token.address, token.address], [1, 2]);
            expect((await swapify.offers(0, 0))[1]).to.equal(buyer.address);
        });

        it("Should  cancel offer", async function () {
            await swapify.connect(buyer).cancelOffer(0, 0);
            expect((await swapify.offers(0, 0))[0]).to.equal(4);
        });

        it("Should fail to accept the offer", async function () {
            await expect(swapify.connect(seller).acceptOffer(0, 0)).to.be.returned//("Can't Accept now");
        });


    });

    // describe("Transactions", function () {
    //     it("Should transfer tokens between accounts", async function () {
    //         // Transfer 50 tokens from owner to addr1
    //         await hardhatToken.transfer(addr1.address, 50);
    //         const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(50);

    //         // Transfer 50 tokens from addr1 to addr2
    //         // We use .connect(signer) to send a transaction from another account
    //         await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    //         const addr2Balance = await hardhatToken.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(50);
    //     });

    //     it("Should fail if sender doesn’t have enough tokens", async function () {
    //         const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    //         // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
    //         // `require` will evaluate false and revert the transaction.
    //         await expect(
    //             hardhatToken.connect(addr1).transfer(owner.address, 1)
    //         ).to.be.revertedWith("Not enough tokens");

    //         // Owner balance shouldn't have changed.
    //         expect(await hardhatToken.balanceOf(owner.address)).to.equal(
    //             initialOwnerBalance
    //         );
    //     });

    //     it("Should update balances after transfers", async function () {
    //         const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

    //         // Transfer 100 tokens from owner to addr1.
    //         await hardhatToken.transfer(addr1.address, 100);

    //         // Transfer another 50 tokens from owner to addr2.
    //         await hardhatToken.transfer(addr2.address, 50);

    //         // Check balances.
    //         const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
    //         expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

    //         const addr1Balance = await hardhatToken.balanceOf(addr1.address);
    //         expect(addr1Balance).to.equal(100);

    //         const addr2Balance = await hardhatToken.balanceOf(addr2.address);
    //         expect(addr2Balance).to.equal(50);
    //     });
    // });
});