const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployContract(contractName) {
    let contractFactory = await ethers.getContractFactory(contractName);
    let contractInstance = await contractFactory.deploy();
    return contractInstance;
}

let router2,WTCore,WTCOREContract,externalBribeAddress,internalBribeAddress, Viri, viriContract, owner, addr1, addr2,VeArt, veArtProxy, votingEscrow, votingEscrowContract, 
    intBribeImp, intBribeImplContract, extBribeImp, extBribeImpContract, bribeFactory, bribeFactoryContract, 
    gaugeImpl, gaugeImplContract, gaugeFactory, gaugeFactoryContract, pairImpl, pairImplContract, pairFactoryContract, voterContract,
    WrappedExternalBribeFactoryContract, veSplitter,veSplitterContract, router, routerContract,
    router2Contract, viriLibraryContract, wrappedExternalBribe, wrappedExternalBribeContract, wrappedExternalBribe2, viriLibrary, wrappedExternalBribe2Contract,
    rewardsDistriburor,rewardsDistriburorContract, minterContract, merkleClaimContract, veApi,veApiContract, gaugeContract, internalBribeContract, externalBribeContract, WrappedExternalBribeFactory,
    multicall, multicallContract, claimAll, claimAllContract, minter;

//fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `${contractName}: ${contract.address}\n`);
async function main() {
    const signers = await ethers.getSigners();
        [deployer] = await ethers.getSigners();
        let contractAddresses = [deployer];
        
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    try{
        //Deploy Viri
        viriContract = await deployContract("Viri");
    }catch(error){
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy VeArtProxy
        veArtProxy = await deployContract("VeArtProxy");    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Voting Escrow
        votingEscrow = await ethers.getContractFactory("VotingEscrow")
        votingEscrowContract = await votingEscrow.deploy(viriContract.target, veArtProxy.target)
            
    } catch (error) {
        console.log("Error al desplegar", error);            
    }
    
    try {
        //Deploy BribeFactory
        bribeFactory = await ethers.getContractFactory("BribeFactory")
        bribeFactoryContract = await bribeFactory.deploy();
            
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Gauge Factory
        gaugeFactoryContract = await deployContract("GaugeFactory")
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Pair Factroy
        pairFactoryContract = await deployContract("PairFactory");
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Voter
        voter= await ethers.getContractFactory("Voter");
        voterContract = await voter.deploy(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target)
        //await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 

    } catch (error) {
        console.log("Error al desplegar", error);
    }

    try {
        //Deploy WrappedExternalBribeFactory
        WrappedExternalBribeFactory = await ethers.getContractFactory("WrappedExternalBribeFactory");
        WrappedExternalBribeFactoryContract = await WrappedExternalBribeFactory.deploy(voterContract.target);
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy veSplitter
        veSplitter = await ethers.getContractFactory("veSplitter");
        veSplitterContract = await veSplitter.deploy(voterContract.target);
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy WTCORE
        WTCore = await ethers.getContractFactory("WTCORE")
        WTCOREContract = await WTCore.deploy();
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Router
        router = await ethers.getContractFactory("Router")
        routerContract = await router.deploy(pairFactoryContract.target, WTCOREContract.target)
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Router2
        router2 = await ethers.getContractFactory("Router")
        router2Contract = await router2.deploy(pairFactoryContract.target, WTCOREContract.target)
            
    } catch (error) {
        console.log("Error al desplegar", error);            
    }
    
    try {
        //Deploy ViriLibrary
        viriLibrary = await ethers.getContractFactory("ViriLibrary");
        viriLibraryContract =await viriLibrary.deploy(routerContract.target);
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy WrappedExternalBribe2
        wrappedExternalBribe2 = await ethers.getContractFactory("WrappedExternalBribeV2")
        wrappedExternalBribe2Contract = await wrappedExternalBribe2.deploy(voterContract.target)

        //Deploy WrappedExternalBribe
        wrappedExternalBribe = await ethers.getContractFactory("WrappedExternalBribe");
        wrappedExternalBribeContract = await wrappedExternalBribe.deploy(voterContract.target, wrappedExternalBribe2Contract.target);
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy RewardsDistributor
        rewardsDistriburor = await ethers.getContractFactory("RewardsDistributor");
        rewardsDistriburorContract = await rewardsDistriburor.deploy(votingEscrowContract.target) 
            
    } catch (error) {
        console.log("Error al desplegar", error);
    }

    try {
        //Deploy Minter
        minter = await ethers.getContractFactory("Minter");
        minterContract = minter.deploy(voterContract.target, votingEscrowContract.target, rewardsDistriburorContract.target)
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy Multicall
        multicall = await ethers.getContractFactory("VIRI_MULTICALL")
        multicallContract = await multicall.deploy()
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    try {
        //Deploy claimAll
        claimAllContract = await deployContract("ClaimAllImplementation")
        await claimAllContract.initialize(votingEscrowContract.target, voterContract.target, pairFactoryContract.target, rewardsDistriburorContract)
    
    } catch (error) {
        console.log("Error al desplegar", error);
    }
    
    //Deploy viriOracle
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

    console.log("Todos los contratos han sido desplegados e inicializados correctamente");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
