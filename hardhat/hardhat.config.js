/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

DeploymentUrl = process.env["DEPLOYMENT_URL"]
PrivateKey = process.env["PRIVATE_KEY"]
ALCHEMY_API_KEY = process.env["ALCHEMY_API_KEY"]
ETHERSCAN_API_KEY = process.env["ETHERSCAN_API_KEY"]

module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "goerli",
  networks: {
    // hardhat: {
    //   forking: {
    //     url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   }
    // },
    goerli: {
      url: DeploymentUrl,
      accounts: [`0x${PrivateKey}`]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
