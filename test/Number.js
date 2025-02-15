const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Numbers", function () {

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNumberFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Number = await ethers.getContractFactory("Number");
    const num = await Number.deploy();

    return { num };
  }

  describe("Deployment", function () {
    it("Should set the right initial state", async function () {
      const { num } = await loadFixture(deployNumberFixture);

      expect(await num.number()).to.equal(0);
    });
  });

  describe("setNumber", function () {
    it("Should set number properly", async function () {
      const { num } = await loadFixture(deployNumberFixture);
      await num.setNumber(42);
      expect(await num.number()).to.be.equal(42);
    });
  });

});
