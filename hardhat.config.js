require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/<put here your infura key>`,
      accounts: [`put here your private key to the Sepolia ETH account`],
    },
  },
};
