const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require('dotenv').config();

module.exports = buildModule("gitlabFundingModule", (m) => {
  const fundManager = m.contract("FundManager");
  return { fundManager };
});
