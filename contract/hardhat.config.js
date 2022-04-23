/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { PRIVATE_KEY, ETHERSCAN_TOKEN, WEB3_INFURA_PROJECT_ID } = process.env;

module.exports = {
    solidity: "0.8.4",
    defaultNetwork: "rinkeby",
    networks: {
        hardhat: {},
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${WEB3_INFURA_PROJECT_ID}`,
            accounts: [`0x${PRIVATE_KEY}`],
        },

        boba: {
            url: "https://rinkeby.boba.network/",
            chainId: 28,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        evmos: {
            url: "https://eth.bd.evmos.dev:8545/",
            chainId: 9000,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        findora: {
            url: "https://prod-testnet.prod.findora.org:8545",
            chainId: 2153,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        scale: {
            url: "https://amsterdam.skalenodes.com/v1/attractive-muscida",
            chainId: 3092851097537429,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_TOKEN,
        verify: true,
    },
};
