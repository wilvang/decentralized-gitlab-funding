const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

VALIDATORS=["0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0xdD870fA1b7C4700F2BD7f44238821C26f7392148"]

module.exports = buildModule("validatorModule", (m) => {
  const validatorMultiSig = m.contract("ValidatorMultiSig", [
    process.env.FUND_MANAGER_ADDRESS,
    VALIDATORS
    ]);
   return { validatorMultiSig }; 
  });  

