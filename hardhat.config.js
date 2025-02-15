require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


console.log("INFURA_URL:", process.env.INFURA_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
