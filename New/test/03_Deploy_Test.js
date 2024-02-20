// Importa las herramientas de prueba necesarias de hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy Test", function(){
   
    let Viri, viriContract, owner, addr1, addr2,VeArt, veArtProxy, votingEscrow, votingEscrowContract, intBribeImp, intBribeImplContract, extBribeImp, extBribeImpContract, bribeFactory, bribeFactoryContract;
    
    before(async ()=>{
        [owner, addr1, addr2, _] = await ethers.getSigners();
        //Deploy Viri
        Viri = await ethers.getContractFactory("Viri");
        viriContract = await Viri.deploy();
        await viriContract.initialize();

        //Deploy VeArtProxy
        VeArt = await ethers.getContractFactory("VeArtProxy")
        veArtProxy = await VeArt.deploy();

        //Deploy Voting Escrow
        votingEscrow = await ethers.getContractFactory("VotingEscrow");
        votingEscrowContract = await votingEscrow.deploy();
        await votingEscrowContract.initialize(viriContract.target, veArtProxy.target);
        //Deploy InternalBribe and External Bribe implementations
        intBribeImp = await ethers.getContractFactory("InternalBribe")
        intBribeImplContract = await intBribeImp.deploy();
        extBribeImp = await ethers.getContractFactory("ExternalBribe")
        extBribeImplContract = await extBribeImp.deploy();
        //Deploy BribeFactory
        
        bribeFactory = await ethers.getContractFactory("BribeFactory");
        bribeFactoryContract = await bribeFactory.deploy();
        await bribeFactoryContract.initialize(intBribeImplContract.target, extBribeImplContract.target);
   });
    
    it("01 Test Deploy Viri", async function () {
        console.log("Viri contract: ", viriContract.target);
        console.log("Variable name:", await viriContract.name())
        console.log("Variable symbol:", await viriContract.symbol())
    });
    
    it("02 Test Deploy veArt", async function () {
        console.log("veArt address: ", veArtProxy.target);
    });

    it("03 Test Deploy voting Escrow", async function () {
        console.log("VotingEscrow address: ", votingEscrowContract.target);
    });
    
    it("04 Test Deploy bribeFactory", async function () {
        //console.log("bribeFactory address: ", bribeFactoryContract.target);
        console.log("internal bribe: ", intBribeImplContract.target);
        console.log("external bribe: ", extBribeImplContract.target);
        console.log("bribe factory address: ", bribeFactoryContract.target)
    });

})