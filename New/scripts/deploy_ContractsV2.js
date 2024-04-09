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
    multicall, multicallContract, claimAll, claimAllContract, minter, USDC, USDCContract, viriOracle, viriOracleContract;

//fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `${contractName}: ${contract.address}\n`);
async function main() {
    const signers = await ethers.getSigners();
        [deployer] = await ethers.getSigners();
        let contractAddresses = [deployer];
        
    console.log("Desplegando contratos con la cuenta:", deployer.address);

// Limpia el archivo o crea uno nuevo si no existe
fs.writeFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), '');

    try{
        //Deploy Viri
        viriContract = await deployContract("Viri");
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `ViriContract: ${viriContract.target}\n`);
    }catch(error){
        console.log("Error al desplegar Vir", error);
    }
    
    try {
        //Deploy VeArtProxy
        veArtProxy = await deployContract("VeArtProxy");
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `veArtProxy: ${veArtProxy.target}\n`);    
    } catch (error) {
        console.log("Error al desplegar VeArt", error);
    }
    
    try {
        //Deploy Voting Escrow
        votingEscrow = await ethers.getContractFactory("VotingEscrow")
        //recibe address de VIRI y address de VeArtProxy
        votingEscrowContract = await votingEscrow.deploy(viriContract.target, veArtProxy.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `votingEscrowContract: ${votingEscrowContract.target}\n`);
            
    } catch (error) {
        console.log("Error al desplegar VE", error);            
    }
    
    try {
        //Deploy BribeFactory
        bribeFactory = await ethers.getContractFactory("BribeFactory")
        bribeFactoryContract = await bribeFactory.deploy();
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `bribeFactoryContract: ${bribeFactoryContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar BribeFactory", error);
    }
    
    try {
        //Deploy Gauge Factory
        gaugeFactoryContract = await deployContract("GaugeFactory")
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `gaugeFactoryContract: ${gaugeFactoryContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar GaugeFactory", error);
    }
    
    try {
        //Deploy Pair Factroy
        pairFactoryContract = await deployContract("PairFactory");
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `pairFactoryContract: ${pairFactoryContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar Pair Factory", error);
    }
    
    try {
        //Deploy Voter
        voter= await ethers.getContractFactory("Voter");
        //Recibe address de los siguientes contrato VE, pairFactory, gaugeFactory y bribeFactory
        voterContract = await voter.deploy(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `voterContract: ${voterContract.target}\n`);
        //await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 

    } catch (error) {
        console.log("Error al desplegar Voter", error);
    }

    try {
        //Deploy WrappedExternalBribeFactory
        WrappedExternalBribeFactory = await ethers.getContractFactory("WrappedExternalBribeFactory");
        //Recibe address del contrato Voter
        WrappedExternalBribeFactoryContract = await WrappedExternalBribeFactory.deploy(voterContract.target);
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `WrappedExternalBribeFactoryContract: ${WrappedExternalBribeFactoryContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar WEBF", error);
    }
    
    try {
        //Deploy veSplitter
        veSplitter = await ethers.getContractFactory("veSplitter");
        //recibe address del contrato voter
        veSplitterContract = await veSplitter.deploy(voterContract.target);
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `veSplitterContract: ${veSplitterContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar veSplitter", error);
    }
    
    try {
        //Deploy WTCORE
        WTCore = await ethers.getContractFactory("WTCORE")
        WTCOREContract = await WTCore.deploy();
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `WTCOREContract: ${WTCOREContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar WTCORE", error);
    }
    
    try {
        //Deploy Router
        router = await ethers.getContractFactory("Router")
        //Recibe address de pairFactory y la direccion de WTCORE
        routerContract = await router.deploy(pairFactoryContract.target, WTCOREContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `routerContract: ${routerContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar Router", error);
    }
    
    try {
        //Deploy Router2
        router2 = await ethers.getContractFactory("Router")
        //Recibe address de pairFactory y la direccion de WTCORE
        router2Contract = await router2.deploy(pairFactoryContract.target, WTCOREContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `router2Contract: ${router2Contract.target}\n`);
            
    } catch (error) {
        console.log("Error al desplegar Router2", error);            
    }
    
    try {
        //Deploy ViriLibrary
        viriLibrary = await ethers.getContractFactory("ViriLibrary");
        //Recibe address del contrato Router
        viriLibraryContract =await viriLibrary.deploy(routerContract.target);
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `viriLibraryContract: ${viriLibraryContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar viriLibrary", error);
    }
    
    try {
        //Deploy WrappedExternalBribe2
        wrappedExternalBribe2 = await ethers.getContractFactory("WrappedExternalBribeV2")
        //Recibe address del contrato Voter
        wrappedExternalBribe2Contract = await wrappedExternalBribe2.deploy(voterContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `wrappedExternalBribe2Contract: ${wrappedExternalBribe2Contract.target}\n`);
        //Deploy WrappedExternalBribe
        wrappedExternalBribe = await ethers.getContractFactory("WrappedExternalBribe");
        //Recibe address del contrato Voter y del anterior WEB
        wrappedExternalBribeContract = await wrappedExternalBribe.deploy(voterContract.target, wrappedExternalBribe2Contract.target);
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `wrappedExternalBribeContract: ${wrappedExternalBribeContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar WEB", error);
    }
    
    try {
        //Deploy RewardsDistributor
        rewardsDistriburor = await ethers.getContractFactory("RewardsDistributor");
        //Recibe address de votingEscrow
        rewardsDistriburorContract = await rewardsDistriburor.deploy(votingEscrowContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `rewardsDistributorContract: ${rewardsDistriburorContract.target}\n`); 
            
    } catch (error) {
        console.log("Error al desplegar RewardsDistributor", error);
    }

    try {
        //Deploy Minter
        minter = await ethers.getContractFactory("Minter");
        //Recibe address de voter, votingEscrow y rewardsDistributor
        minterContract = minter.deploy(voterContract.target, votingEscrowContract.target, rewardsDistriburorContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `minterContract: ${minterContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar Minter", error);
    }
    
    try {
        //Deploy Multicall
        multicall = await ethers.getContractFactory("VIRI_MULTICALL")
        multicallContract = await multicall.deploy()
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `multicallContract: ${multicallContract.target}\n`);
    
    } catch (error) {
        console.log("Error al desplegar multicall", error);
    }
    
    try {
        //Deploy claimAll
        claimAllContract = await deployContract("ClaimAllImplementation")
        //Recibe address de votingEscrow, voter, pairFactory y rewardDistributor
        await claimAllContract.initialize(votingEscrowContract.target, voterContract.target, pairFactoryContract.target, rewardsDistriburorContract.target)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `claimAllContract: ${claimAllContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar claimall", error);
    }

    try {
        //Deploy USDC
        USDC = await ethers.getContractFactory("USDC")
        USDCContract = USDC.deploy();
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `USDCContract: ${USDCContract.target}\n`);
    } catch (error) {
        console.log("Error al desplegar USDC");
    }

    try {
        //preguntar si hace falta agregar la direccion de usdt en core
        const oracleArgs = [USDCContract, /* reemplazar con WETH de core */];
        //Deploy viriOracle
        viriOracle = await ethers.getContractFactory("ViriTvlOracle");
        //Recibe un arreglo de direcciones y un entero
        viriOracleContract = await viriOracle.deploy(oracleArgs,6)
        fs.appendFileSync(path.join(__dirname, 'Test_2_Days_Contracs.txt'), `viriOracleContract: ${viriOracleContract.target}\n`);
    } catch (error) {
        
        console.log("Error en el despliegue Oracle")
    }
    


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
