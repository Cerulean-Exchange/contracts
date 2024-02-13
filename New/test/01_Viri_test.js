const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Viri Test", function () {
  let Viri, viriContract, owner, addr1, addr2;

  before(async () => {
    Viri = await ethers.getContractFactory("Viri");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    viriContract = await Viri.deploy();
    await viriContract.initialize();
  });

  describe("Deployment", function () {
    it("01 Should set the right owner", async function () {
        console.log("owner address:", owner.address)
        console.log("minter address:", await viriContract.minter())
        expect(await viriContract.minter()).to.equal(owner.address);
    });

    it("02. The contract must have a totalsupply of 0", async function () {
        console.log("TotalSupply:", await viriContract.totalSupply())
        let expectTotalSupply = 0;
        expect(await viriContract.totalSupply()).to.equal(expectTotalSupply);
    });

    it("03. Symbol and name variables should be named Viri and Viridian", async function () {
        console.log("Variable name:", await viriContract.name())
        console.log("Variable symbol:", await viriContract.symbol())
        let expectedName = "Viridian";
        let expectedSymbol = "VIRI";
        expect(await viriContract.name()).to.equal(expectedName);
        expect(await viriContract.symbol()).to.equal(expectedSymbol);
    });

    it("04. initialMinted should be false", async function () {
        console.log("initialMinted:", await viriContract.initialMinted())
        expect(await viriContract.initialMinted()).to.equal(false);
    });

    it("05. redemptionReceiver should be 0x", async function () {
        console.log("redemptionReceiver:", await viriContract.redemptionReceiver())
        let expectedAddress = '0x0000000000000000000000000000000000000000'
        expect(await viriContract.redemptionReceiver()).to.equal(expectedAddress);
    });

    it("06. merkleClaim should be 0x", async function () {
        console.log("merkleClaim:", await viriContract.merkleClaim())
        let expectedAddress = '0x0000000000000000000000000000000000000000'
        expect(await viriContract.merkleClaim()).to.equal(expectedAddress);
    });
  });

  describe("Setting variables", function (){
    it("07 Should set the minter address correctly", async function () {
        console.log("New Minter Address:", addr1.address)
        let newMinter = addr1.address
        await viriContract.setMinter(newMinter);
        expect(await viriContract.minter()).to.equal(newMinter);
    });

    it("08. Should set the redemption receiver address correctly", async function () {
        console.log("New Receiver Address:", addr2.address)
        let newReceiver = addr2.address
        await viriContract.connect(addr1).setRedemptionReceiver(newReceiver);
        expect(await viriContract.redemptionReceiver()).to.equal(newReceiver);
    });

    it("09. Should set the merkleclaim address correctly", async function () {
        console.log("New merkleClaim Address:", addr2.address)
        let newMerkleClaim = addr2.address
        await viriContract.connect(addr1).setMerkleClaim(newMerkleClaim);
        expect(await viriContract.redemptionReceiver()).to.equal(newMerkleClaim);
    });

    it("10. Should mint the initial supply correctly", async function () {
        let recipient = addr1.address
        console.log("Recipient initial supply:", recipient)
        console.log("initial supply before initialMint:", await viriContract.balanceOf(recipient))

        await viriContract.connect(addr1).initialMint(recipient);

        console.log("initial supply after initialMint:", await viriContract.balanceOf(recipient))
        let balance = "6000000000000000000000000";

        expect(await viriContract.initialMinted()).to.equal(true);
        expect(await viriContract.balanceOf(recipient)).to.equal(balance);
      });
    
  });
});
