/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { PRIVATE_KEY, ETHERSCAN_TOKEN, WEB3_INFURA_PROJECT_ID } = process.env;

module.exports = {
    solidity: "0.8.4",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        // rinkeby: {
        //     url: `https://rinkeby.infura.io/v3/${WEB3_INFURA_PROJECT_ID}`,
        //     accounts: [`0x${PRIVATE_KEY}`],
        // },
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_TOKEN,
    },
};
