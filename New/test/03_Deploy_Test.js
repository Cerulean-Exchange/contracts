// Importa las herramientas de prueba necesarias de hardhat
//const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy Test", function(){
   
    let router2,WTCore,WTCOREContract,externalBribeAddress,internalBribeAddress, Viri, viriContract, owner, addr1, addr2,VeArt, veArtProxy, votingEscrow, votingEscrowContract, 
    intBribeImp, intBribeImplContract, extBribeImp, extBribeImpContract, bribeFactory, bribeFactoryContract, 
    gaugeImpl, gaugeImplContract, gaugeFactory, gaugeFactoryContract, pairImpl, pairImplContract, pairFactoryContract, voterContract,
    WrappedExternalBribeFactoryContract, veSplitter,veSplitterContract, router, routerContract,
    router2Contract, viriLibraryContract, wrappedExternalBribe, wrappedExternalBribeContract, wrappedExternalBribe2, viriLibrary, wrappedExternalBribe2Contract,
    rewardsDistriburorContract, minterContract, merkleClaimContract, veApi,veApiContract, gaugeContract, internalBribeContract, externalBribeContract, WrappedExternalBribeFactory;

    
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
        votingEscrow = await ethers.getContractFactory("VotingEscrow")
        votingEscrowContract = await votingEscrow.deploy(viriContract.target, veArtProxy.target)
        /* votingEscrowContract = await deployContract("VotingEscrow")
        await votingEscrowContract.initialize(viriContract.target, veArtProxy.target);
         */
        //Deploy InternalBribe and External Bribe implementations
        /* intBribeImp = await ethers.getContractFactory("InternalBribe")
        extBribeImp = await ethers.getContractFactory("ExternalBribe") */
        /* intBribeImplContract = await deployContract("InternalBribe");
        extBribeImplContract = await deployContract("ExternalBribe");
 */
        //Deploy BribeFactory
        bribeFactory = await ethers.getContractFactory("BribeFactory")
        bribeFactoryContract = await bribeFactory.deploy();
        /* internalBribeAddress = await bribeFactoryContract.createInternalBribe(contractAddresses);
        externalBribeAddress = await bribeFactoryContract.createExternalBribe(contractAddresses);
         */
        //Deploy Gauge Implementation
        //gaugeImplContract = await deployContract("Gauge");

        //Deploy Gauge Factory
        gaugeFactoryContract = await deployContract("GaugeFactory")
        //Deploy Pair Implementation
        //pairImplContract = await deployContract("Pair");

        //Deploy Pair Factroy
        pairFactoryContract = await deployContract("PairFactory");
        //await pairFactoryContract.initialize(pairImplContract.target);

        //Deploy Voter
        
        voter= await ethers.getContractFactory("Voter");
        voterContract = await voter.deploy(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target)
        //await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 

        //Deploy WrappedExternalBribeFactory
        WrappedExternalBribeFactory = await ethers.getContractFactory("WrappedExternalBribeFactory");
        WrappedExternalBribeFactoryContract = await WrappedExternalBribeFactory.deploy(voterContract.target);
 
        //Deploy InternalBribe/ExternalBribe
        /* internalBribeAddress = await bribeFactoryContract.createInternalBribe(contractAddresses);
        externalBribeAddress = await bribeFactoryContract.createExternalBribe(contractAddresses);
         */
        /* await intBribeImplContract.initialize(voterContract.target, contractAddresses);
        await extBribeImplContract.initialize(voterContract.target, contractAddresses);
         *///console.log(contractAddresses);
        //Deploy veSplitter
        veSplitter = await ethers.getContractFactory("veSplitter");
        veSplitterContract = await veSplitter.deploy(voterContract.target);

        //Deploy WTCORE
        WTCore = await ethers.getContractFactory("WTCORE")
        WTCOREContract = await WTCore.deploy();


        //Deploy Router
        router = await ethers.getContractFactory("Router")
        routerContract = await router.deploy(pairFactoryContract.target, WTCOREContract.target)

        //Deploy Router2
        router2 = await ethers.getContractFactory("Router")
        router2Contract = await router2.deploy(pairFactoryContract.target, WTCOREContract.target)
        
        //Deploy ViriLibrary
        viriLibrary = await ethers.getContractFactory("ViriLibrary");
        viriLibraryContract =await viriLibrary.deploy(routerContract.target);

        wrappedExternalBribe2 = await ethers.getContractFactory("WrappedExternalBribeV2")
        wrappedExternalBribe2Contract = await wrappedExternalBribe2.deploy(voterContract.target)

        //Deploy WrappedExternalBribe
        wrappedExternalBribe = await ethers.getContractFactory("WrappedExternalBribe");
        wrappedExternalBribeContract = await wrappedExternalBribe.deploy(voterContract.target, wrappedExternalBribe2Contract.target);

        //Deploy RewardsDistributor
        /* rewardsDistriburorContract = await deployContract("RewardsDistributor");
        await rewardsDistriburorContract.initialize(votingEscrowContract.target) 
 */
        
        //Deploy veApi
        /* veApi = await ethers.getContractFactory("VE_Api_V2");
        veApiContract = await veApi.deploy("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", viriContract.target, voterContract.target, votingEscrowContract.target);
 */
        //Deploy Minter
        /* minterContract = await deployContract("Minter");
        await minterContract.initialize(voterContract.target, votingEscrowContract.target, rewardsDistriburorContract.target)
 */

        //Internal and External Bribe deploy
        /* internalBribeContract = await deployContract("InternalBribe")
        await internalBribeContract.initialize(voterContract.target, contractAddresses)
         */
        /* externalBribeContract = await deployContract("ExternalBribe")
        await externalBribeContract.initialize(voterContract.target, contractAddresses)
 */

        //Deploy Gauge
        /* gaugeContract = await deployContract("Gauge");
        await gaugeContract.initialize("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", internalBribeContract.target, externalBribeContract.target, votingEscrowContract.target, voterContract.target, true, contractAddresses)
 */

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
        /*  console.log("internal bribe implementation: ", internalBribeAddress);
            console.log("external bribe implementation: ", externalBribeAddress);
         */
        console.log("bribe factory address: ", bribeFactoryContract.target)    
        });

        it("05 Test Deploy Gauge Factory", async function () {
       //console.log("gauge implementation: ", gaugeImplContract.target);
        console.log("gauge factory: ", gaugeFactoryContract.target)
        });

        it("06 Test Deploy Pair Factory", async function () {
            //console.log("Pair implementation: ", pairImplContract.target);
            console.log("pair factory: ", pairFactoryContract.target)
        });

        it("07 Test Deploy Voter", async function () {
            
            console.log("Voter contract: ", voterContract.target)
        });

        it("08 Test Deploy WrappedExternalBribeFactory", async function () {
            
            console.log("WrappedExternalBribeFactory: ", WrappedExternalBribeFactoryContract.target)
        });

        it.skip("09 Test Deploy Internal/External bribe", async function(){
            
            console.log("internal bribe: ", internalBribeAddress);
            console.log("external bribe: ", externalBribeAddress);

        })

        it("10 Test Deploy veSplitter", async function () {
            
            console.log("veSplitter: ", veSplitterContract.target)
        });

        it("11 Test Deploy Router", async function () {
            console.log("Router: ", routerContract.target);
            console.log("Router2: ", router2Contract.target);
            console.log("ViriLibrary: ", viriLibraryContract.target);
            console.log("Wrapped External Bribe: ", wrappedExternalBribeContract.target);
        });

        it.skip("12 Test Deploy Minter", async function () {
            console.log("Internal Bribe contract: ", internalBribeContract.target)
            console.log("External Bribe contract: ", externalBribeContract.target)
            console.log("Minter: ", minterContract.target)
            console.log("veApi: ", veApiContract.target)
            console.log("Gauge: ", gaugeContract.target)
        });

        

})