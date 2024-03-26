const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployContract(contractName) {
    let contractFactory = await ethers.getContractFactory(contractName);
    let contractInstance = await contractFactory.deploy();
    return contractInstance;
}

let Viri, viriContract, owner, addr1, addr2,VeArt, veArtProxy, votingEscrow, votingEscrowContract, 
    intBribeImp, intBribeImplContract, extBribeImp, extBribeImpContract, bribeFactory, bribeFactoryContract, 
    gaugeImpl, gaugeImplContract, gaugeFactory, gaugeFactoryContract, pairImpl, pairImplContract, pairFactoryContract, voterContract,
    WrappedExternalBribeFactoryContract, veSplitter,veSplitterContract, router, routerContract,
    router2Contract, viriLibraryContract, wrappedExternalBribe, wrappedExternalBribeContract, wrappedExternalBribe2,
    rewardsDistriburorContract, minterContract, merkleClaimContract, veApi,veApiContract, gaugeContract, internalBribeContract, externalBribeContract;

//fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `${contractName}: ${contract.address}\n`);
async function main() {
    const signers = await ethers.getSigners();
        [deployer] = await ethers.getSigners();
        let contractAddresses = [deployer];
        
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    // Limpia el archivo o crea uno nuevo si no existe
    fs.writeFileSync(path.join(__dirname, 'deployed_contracts.txt'), '');

    //Deploy Viri
    viriContract = await deployContract("Viri");
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `ViriContract: ${viriContract.target}\n`);

    //Deploy VeArtProxy
    veArtProxy = await deployContract("VeArtProxy");
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `VeArtProxyContract: ${veArtProxy.target}\n`);

    //Deploy Voting Escrow
    votingEscrowContract = await deployContract("VotingEscrow")
    await votingEscrowContract.initialize(viriContract.target, veArtProxy.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `VotingEscrowContract: ${votingEscrowContract.target}\n`);

    //Deploy InternalBribe and External Bribe implementations
    intBribeImplContract = await deployContract("InternalBribe");
    extBribeImplContract = await deployContract("ExternalBribe");

    //Deploy BribeFactory
    bribeFactoryContract = await deployContract("BribeFactory")
    await bribeFactoryContract.initialize(intBribeImplContract.target, extBribeImplContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `bribeFactoryContract: ${bribeFactoryContract.target}\n`);

    //Deploy Gauge Implementation
    gaugeImplContract = await deployContract("Gauge");

    //Deploy Gauge Factory
    gaugeFactoryContract = await deployContract("GaugeFactory")
    await gaugeFactoryContract.initialize(gaugeImplContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `gaugeFactoryContract: ${gaugeFactoryContract.target}\n`);

    //Deploy Pair Implementation
    pairImplContract = await deployContract("Pair");

    //Deploy Pair Factroy
    pairFactoryContract = await deployContract("PairFactory");
    await pairFactoryContract.initialize(pairImplContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `pairFactoryContract: ${pairFactoryContract.target}\n`);

    //Deploy Voter
    voterContract = await deployContract("Voter");
    await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `voterContract: ${voterContract.target}\n`);

    //Deploy WrappedExternalBribeFactory
    WrappedExternalBribeFactoryContract = await deployContract("WrappedExternalBribeFactory");
    await WrappedExternalBribeFactoryContract.initialize(voterContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `WrappedExternalBribeFactoryContract: ${WrappedExternalBribeFactoryContract.target}\n`);

    //Deploy InternalBribe/ExternalBribe
    await intBribeImplContract.initialize(voterContract.target, contractAddresses);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `intBribeImplContract: ${intBribeImplContract.target}\n`);
    await extBribeImplContract.initialize(voterContract.target, contractAddresses);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `extBribeImplContract: ${extBribeImplContract.target}\n`);
    //console.log(contractAddresses);
    //Deploy veSplitter
    /* veSplitter = await ethers.getContractFactory("veSplitter");
    veSplitterContract = await veSplitter.deploy(voterContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `veSplitterContract: ${veSplitterContract.target}\n`); */

    //Deploy Router
    routerContract = await deployContract("Router")
    await routerContract.initialize(pairFactoryContract.target, "0xeAB3aC417c4d6dF6b143346a46fEe1B847B50296")
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `routerContract: ${routerContract.target}\n`);

    //Deploy Router2
    router2Contract = await deployContract("Router2")
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `router2Contract: ${router2Contract.target}\n`);
    
    //Deploy ViriLibrary
    viriLibraryContract = await deployContract("ViriLibrary");
    await viriLibraryContract.initialize(routerContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `viriLibraryContract: ${viriLibraryContract.target}\n`);

   /*  wrappedExternalBribe2 = await deployContract("WrappedExternalBribe")
    console.log("Wrapped2: ", wrappedExternalBribe2) */

    //Deploy WrappedExternalBribe
    /* wrappedExternalBribe = await ethers.getContractFactory("WrappedExternalBribeV2");
    wrappedExternalBribeContract = await wrappedExternalBribe.deploy(voterContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `wrappedExternalBribeContract: ${wrappedExternalBribeContract.target}\n`); */

    //Deploy RewardsDistributor
    /* rewardsDistriburorContract = await deployContract("RewardsDistributor");
    await rewardsDistriburorContract.initialize(votingEscrowContract.target)
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `rewardsDistributorContract: ${rewardsDistributorContract.target}\n`); */ 

    
    //Deploy veApi
    /* veApi = await ethers.getContractFactory("VE_Api_V2");
    veApiContract = await veApi.deploy("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", viriContract.target, voterContract.target, votingEscrowContract.target);
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `veApiContract: ${veApiContract.target}\n`); */

    //Deploy Minter
   /*  minterContract = await deployContract("Minter");
    await minterContract.initialize(voterContract.target, votingEscrowContract.target, rewardsDistriburorContract.target)
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `minterContract: ${minterContract.target}\n`); */


    //Internal and External Bribe deploy
    internalBribeContract = await deployContract("InternalBribe")
    await internalBribeContract.initialize(voterContract.target, contractAddresses)
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `internalBribeContract: ${internalBribeContract.target}\n`);
    
    externalBribeContract = await deployContract("ExternalBribe")
    await externalBribeContract.initialize(voterContract.target, contractAddresses)
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `externalBribeContract: ${externalBribeContract.target}\n`);


    //Deploy Gauge
    /* gaugeContract = await deployContract("Gauge");
    await gaugeContract.initialize("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", internalBribeContract.target, externalBribeContract.target, votingEscrowContract.target, voterContract.target, true, contractAddresses)
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `gaugeContract: ${gaugeContract.target}\n`); */

    console.log("Todos los contratos han sido desplegados e inicializados correctamente");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
