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
fs.writeFileSync(path.join(__dirname, 'mainnetContracts.txt'), '');


try{
        //Deploy Viri
        viriContract = await deployContract("Viri");
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `ViriContract: ${viriContract.target}\n`);
        console.log("viriContract: ", viriContract.target)
    }catch(error){
        console.log("Error al desplegar Vir", error);
    }
    
    try {
        //Deploy VeArtProxy
        veArtProxy = await deployContract("VeArtProxy");
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `veArtProxy: ${veArtProxy.target}\n`); 
        console.log("veArtProxy: ", veArtProxy.target)   
    } catch (error) {
        console.log("Error al desplegar VeArt", error);
    }
    
    try {
        //Deploy Voting Escrow
        votingEscrow = await ethers.getContractFactory("VotingEscrow")
        //recibe address de VIRI y address de VeArtProxy
        votingEscrowContract = await votingEscrow.deploy(viriContract.target, veArtProxy.target)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `votingEscrowContract: ${votingEscrowContract.target}\n`);
        console.log("votingEscrow: ", votingEscrowContract.target)    
    } catch (error) {
        console.log("Error al desplegar VE", error);            
    }
    
    try {
        //Deploy BribeFactory
        bribeFactory = await ethers.getContractFactory("BribeFactory")
        bribeFactoryContract = await bribeFactory.deploy();
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `bribeFactoryContract: ${bribeFactoryContract.target}\n`);
        console.log("briberFactoryContract: ", bribeFactoryContract.target)
    } catch (error) {
        console.log("Error al desplegar BribeFactory", error);
    }
    
    try {
        //Deploy Gauge Factory
        gaugeFactoryContract = await deployContract("GaugeFactory")
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `gaugeFactoryContract: ${gaugeFactoryContract.target}\n`);
        console.log("gaugeFactoryContract: ", gaugeFactoryContract.target)
    } catch (error) {
        console.log("Error al desplegar GaugeFactory", error);
    }
    
    try {
        //Deploy Pair Factroy
        pairFactoryContract = await deployContract("PairFactory");
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `pairFactoryContract: ${pairFactoryContract.target}\n`);
        console.log("pairFactoryContract: ", pairFactoryContract.target)
    } catch (error) {
        console.log("Error al desplegar Pair Factory", error);
    }
    
    try {
        //Deploy Voter
        voter= await ethers.getContractFactory("Voter");
        //Recibe address de los siguientes contrato VE, pairFactory, gaugeFactory y bribeFactory
        voterContract = await voter.deploy(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `voterContract: ${voterContract.target}\n`);
        console.log("voterContract: ", voterContract.target)
        //await voterContract.initialize(votingEscrowContract.target, pairFactoryContract.target, gaugeFactoryContract.target, bribeFactoryContract.target); 

    } catch (error) {
        console.log("Error al desplegar Voter", error);
    }

    try {
        //Deploy WrappedExternalBribeFactory
        WrappedExternalBribeFactory = await ethers.getContractFactory("WrappedExternalBribeFactory");
        //Recibe address del contrato Voter
        WrappedExternalBribeFactoryContract = await WrappedExternalBribeFactory.deploy(voterContract.target);
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `WrappedExternalBribeFactoryContract: ${WrappedExternalBribeFactoryContract.target}\n`);
        console.log("WrappedExternalBribeFactoryContract: ", WrappedExternalBribeFactoryContract.target)
    } catch (error) {
        console.log("Error al desplegar WEBF", error);
    }
    
    try {
        //Deploy Router
        let WCOREContract = "0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f" //WCORE 0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f
        router = await ethers.getContractFactory("Router")
        //Recibe address de pairFactory y la direccion de WTCORE
        routerContract = await router.deploy(pairFactoryContract.target, WCOREContract)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `routerContract: ${routerContract.target}\n`);
        console.log("routerContract: ", routerContract.target)
    } catch (error) {
        console.log("Error al desplegar Router", error);
    }
    
    try {
        //Deploy Router2
        router2 = await ethers.getContractFactory("Router2")
        let WCOREContract = "0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f" //WCORE 0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f
        //Recibe address de pairFactory y la direccion de WTCORE
        router2Contract = await router2.deploy(pairFactoryContract.target, WCOREContract)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `router2Contract: ${router2Contract.target}\n`);
        console.log("router2Contract: ", router2Contract.target)
            
    } catch (error) {
        console.log("Error al desplegar Router2", error);            
    }
    
    try {
        //Deploy ViriLibrary
        viriLibrary = await ethers.getContractFactory("ViriLibrary");
        //Recibe address del contrato Router
        viriLibraryContract =await viriLibrary.deploy(routerContract.target);
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `viriLibraryContract: ${viriLibraryContract.target}\n`);
        console.log("viriLibraryContract: ", viriLibraryContract.target)
    
    } catch (error) {
        console.log("Error al desplegar viriLibrary", error);
    }
    
    try {
        //Deploy WrappedExternalBribe
        wrappedExternalBribe = await ethers.getContractFactory("WrappedExternalBribe");
        //Recibe address del contrato Voter y del anterior WEB
        wrappedExternalBribeContract = await wrappedExternalBribe.deploy(voterContract.target, wrappedExternalBribe2Contract.target);
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `wrappedExternalBribeContract: ${wrappedExternalBribeContract.target}\n`);
        console.log("wrappedExternalBribeContract: ", wrappedExternalBribeContract.target)
    } catch (error) {
        console.log("Error al desplegar WEB", error);
    }
    
    try {
        //Deploy RewardsDistributor
        rewardsDistriburor = await ethers.getContractFactory("RewardsDistributor");
        //Recibe address de votingEscrow
        rewardsDistriburorContract = await rewardsDistriburor.deploy(votingEscrowContract.target)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `rewardsDistributorContract: ${rewardsDistriburorContract.target}\n`);
        console.log("rewardsDistriburorContract: ", rewardsDistriburorContract.target) 
            
    } catch (error) {
        console.log("Error al desplegar RewardsDistributor", error);
    }

    try {
        //Deploy Minter
        minter = await ethers.getContractFactory("Minter");
        //Recibe address de voter, votingEscrow y rewardsDistributor
        minterContract = await minter.deploy(voterContract.target, votingEscrowContract.target, rewardsDistriburorContract.target)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `minterContract: ${minterContract.target}\n`);
        console.log("minterContract: ", minterContract.target)
    } catch (error) {
        console.log("Error al desplegar Minter", error);
    }
    
    try {
        //Deploy Multicall
        multicall = await ethers.getContractFactory("VIRI_MULTICALL")
        multicallContract = await multicall.deploy()
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `multicallContract: ${multicallContract.target}\n`);
        console.log("multicallContract: ", multicallContract.target)
    } catch (error) {
        console.log("Error al desplegar multicall", error);
    }
    
    try {
        //Deploy claimAll
        claimAllContract = await deployContract("ClaimAllImplementation")
        //Recibe address de votingEscrow, voter, pairFactory y rewardDistributor
        await claimAllContract.initialize(votingEscrowContract.target, voterContract.target, pairFactoryContract.target, rewardsDistriburorContract.target)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `claimAllContract: ${claimAllContract.target}\n`);
        console.log("claimAllContract: ", claimAllContract.target)
    } catch (error) {
        console.log("Error al desplegar claimall", error);
    }

   

    try {
        //preguntar si hace falta agregar la direccion de usdt en core
        const USDTContract= "0x900101d06A7426441Ae63e9AB3B9b0F63Be145F1" //USDT 0x900101d06A7426441Ae63e9AB3B9b0F63Be145F1
        const USDCContract= "0xa4151B2B3e269645181dCcF2D426cE75fcbDeca9" //USDC 0xa4151B2B3e269645181dCcF2D426cE75fcbDeca9
        let WCOREContract = "0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f" //WCORE 0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f
        const oracleArgs = [USDCContract, WCOREContract, USDTContract];
        //Deploy viriOracle
        viriOracle = await ethers.getContractFactory("ViriTvlOracle");
        //Recibe un arreglo de direcciones y un entero
        viriOracleContract = await viriOracle.deploy(oracleArgs,6)
        fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `viriOracleContract: ${viriOracleContract.target}\n`);
        console.log("viriOracleContract: ", viriOracleContract.target)
    } catch (error) {
        console.log("Error en el despliegue Oracle", error)
    }
    

    console.log("Todos los contratos han sido desplegados e inicializados correctamente");
}

//Esperar a que el equipo cree el pool
/* try {
    //Deploy veapi
    veApi = await ethers.getContractFactory("Viri_VE_Api")
                                      //address _oracle, address _pool2, address _viri, address _voter, address _ve
    veApiContract = await veApi.deploy("0xDea7a52204461e5d7324E9300f3cAaA81cEc034F","0xb6A4891DBf867131AA61B10F48F3F595700A38a1","0x2D743F95f99e19366C2e52d00fE4718b14202e36","0xae7192C5c94a47B5747Cc8e462859462E49AebA7","0x7E4c0246B5b449a3a2eb04Bae68a29d6E2A36f52");
    console.log(veApiContract)
    fs.appendFileSync(path.join(__dirname, 'mainnetContracts.txt'), `veApiContract: ${veApiContract.target}\n`);
} catch (error) {
    console.log("Error al desplegar veApiContract", error);
} */

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });