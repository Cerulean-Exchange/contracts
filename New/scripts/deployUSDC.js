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
fs.writeFileSync(path.join(__dirname, 'deployUSDC.txt'), '');

try {
    //Deploy USDC
    USDC = await ethers.getContractFactory("USDC")
    USDCContract = await USDC.deploy();
    fs.appendFileSync(path.join(__dirname, 'deployUSDC.txt'), `USDCContract: ${USDCContract.target}\n`);
} catch (error) {
    console.log("Error al desplegar USDC");
}
    console.log("Todos los contratos han sido desplegados e inicializados correctamente");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });