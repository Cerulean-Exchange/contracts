// Importa las herramientas de prueba necesarias de hardhat
//const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy Test", function(){
   
    let Viri, viriContract, owner, addr1, addr2,VeArt, veArtProxy, votingEscrow, votingEscrowContract, 
    intBribeImp, intBribeImplContract, extBribeImp, extBribeImpContract, bribeFactory, bribeFactoryContract, 
    gaugeImpl, gaugeImplContract, gaugeFactory, gaugeFactoryContract, pairImpl, pairImplContract, pairFactoryContract, voterContract,
    WrappedExternalBribeFactoryContract, veSplitter,veSplitterContract;

    
    before(async ()=>{

        async function deployContract(contractName) {
            let contractFactory = await ethers.getContractFactory(contractName);
            let contractInstance = await contractFactory.deploy();
            return contractInstance;
        }

        const signers = await ethers.getSigners();
        [owner, addr1, addr2, _] = await ethers.getSigners();
        let contractAddresses = [];
        // llenar la matriz con las direcciones de los signatarios
        for (let i = 0; i < 5; i++) {
            contractAddresses.push(signers[i].address);
        }
        //Deploy Viri
        viriContract = await deployContract("Viri");

        //Deploy VeArtProxy
        veArtProxy = await deployContract("VeArtProxy");

        //Deploy Voting Escrow
        votingEscrowContract = await deployContract("VotingEscrow")
        await votingEscrowContract.initialize(viriContract.target, veArtProxy.target);
        
        //Deploy InternalBribe and External Bribe implementations
        intBribeImplContract = await deployContract("InternalBribe");
        extBribeImplContract = await deployContract("ExternalBribe");

        //Deploy BribeFactory
        bribeFactoryContract = await deployContract("BribeFactory")
        await bribeFactoryContract.initialize(intBribeImplContract.target, extBribeImplContract.target);

        //Deploy Gauge Implementation
        gaugeImplContract = await deployContract("Gauge");

        //Deploy Gauge Factory
        gaugeFactoryContract = await deployContract("GaugeFactory")
        await gaugeFactoryContract.initialize(gaugeImplContract.target);

        //Deploy Pair Implementation
        pairImplContract = await deployContract("Pair");

        //Deploy Pair Factroy
        pairFactoryContract = await deployContract("PairFactory");
        await pairFactoryContract.initialize(pairImplContract.target);

        //Deploy Voter
        voterContract = await deployContract("Voter");
        await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 

        //Deploy WrappedExternalBribeFactory
        WrappedExternalBribeFactoryContract = await deployContract("WrappedExternalBribeFactory");
        await WrappedExternalBribeFactoryContract.initialize(voterContract.target);

        //Deploy InternalBribe/ExternalBribe
        await intBribeImplContract.initialize(voterContract.target, contractAddresses);
        await extBribeImplContract.initialize(voterContract.target, contractAddresses);
        //console.log(contractAddresses);
        //Deploy veSplitter
            veSplitter = await ethers.getContractFactory("veSplitter");
            veSplitterContract = await veSplitter.deploy(voterContract.target);

        
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
        console.log("internal bribe: ", intBribeImplContract.target);
        console.log("external bribe: ", extBribeImplContract.target);
        console.log("bribe factory address: ", bribeFactoryContract.target)
        });

        it("05 Test Deploy Gauge Factory", async function () {
        console.log("gauge implementation: ", gaugeImplContract.target);
        console.log("gauge factory: ", gaugeFactoryContract.target)
        });

        it("06 Test Deploy Pair Factory", async function () {
            console.log("Pair implementation: ", pairImplContract.target);
            console.log("pair factory: ", pairFactoryContract.target)
        });

        it("07 Test Deploy Voter", async function () {
            
            console.log("Voter contract: ", voterContract.target)
        });

        it("08 Test Deploy WrappedExternalBribeFactory", async function () {
            
            console.log("WrappedExternalBribeFactory: ", WrappedExternalBribeFactoryContract.target)
        });

        it("09 Test Deploy Internal/External bribe", async function(){
            
            console.log("internal bribe: ", intBribeImplContract.target);
            console.log("external bribe: ", extBribeImplContract.target);

        })

        it("10 Test Deploy veSplitter", async function () {
            
            console.log("veSplitter: ", veSplitterContract.target)
        });

})