const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployContract(contractName, ...args) {
    const ContractFactory = await hre.ethers.getContractFactory(contractName);
    const contract = await ContractFactory.deploy(...args);
    await contract.deployed();
    console.log(`${contractName} desplegado en: ${contract.address}`);
    // Guardar la dirección del contrato desplegado en un archivo
    fs.appendFileSync(path.join(__dirname, 'deployed_contracts.txt'), `${contractName}: ${contract.address}\n`);
    return contract;
}

async function main() {
    const [deployer, addr1, addr2, _] = await hre.ethers.getSigners();
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    // Limpia el archivo o crea uno nuevo si no existe
    fs.writeFileSync(path.join(__dirname, 'deployed_contracts.txt'), '');

    // Desplegar contratos
    const viri = await deployContract("Viri");
    const veArtProxy = await deployContract("VeArtProxy");
    const votingEscrow = await deployContract("VotingEscrow");

    // Aquí necesitarás reemplazar 'viri.address' y 'veArtProxy.address' con las direcciones reales después de desplegar
    await votingEscrow.initialize(viri.address, veArtProxy.address);

    const intBribeImp = await deployContract("InternalBribe");
    const extBribeImp = await deployContract("ExternalBribe");
    const bribeFactory = await deployContract("BribeFactory");
    await bribeFactory.initialize(intBribeImp.address, extBribeImp.address);

    const gaugeImpl = await deployContract("Gauge");
    const gaugeFactory = await deployContract("GaugeFactory");
    await gaugeFactory.initialize(gaugeImpl.address);

    const pairImpl = await deployContract("Pair");
    const pairFactory = await deployContract("PairFactory");
    await pairFactory.initialize(pairImpl.address);

    const voter = await deployContract("Voter");
    await voter.initialize(votingEscrow.address, pairFactory.address, gaugeFactory.address, bribeFactory.address);

    const wrappedExternalBribeFactory = await deployContract("WrappedExternalBribeFactory");
    await wrappedExternalBribeFactory.initialize(voter.address);

    const veSplitter = await deployContract("veSplitter");
    const router = await deployContract("Router");

    // Reemplaza '0xeAB3aC417c4d6dF6b143346a46fEe1B847B50296' con la dirección real necesaria
    await router.initialize(pairFactory.address, "0xeAB3aC417c4d6dF6b143346a46fEe1B847B50296");

    const router2 = await deployContract("Router2");
    const viriLibrary = await deployContract("ViriLibrary");
    await viriLibrary.initialize(router.address);

    const wrappedExternalBribe = await deployContract("WrappedExternalBribeV2");
    const rewardsDistributor = await deployContract("RewardsDistributor");
    await rewardsDistributor.initialize(votingEscrow.address);

    const veApi = await deployContract("VE_Api_V2");
    // Reemplaza estos valores con las direcciones reales necesarias
    await veApi.initialize("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", viri.address, voter.address, votingEscrow.address);

    const minter = await deployContract("Minter");
    await minter.initialize(voter.address, votingEscrow.address, rewardsDistributor.address);

    const internalBribe = await deployContract("InternalBribe");
    // Reemplaza 'contractAddresses' con un array de direcciones reales
    await internalBribe.initialize(voter.address, contractAddresses);

    const externalBribe = await deployContract("ExternalBribe");
    await externalBribe.initialize(voter.address, contractAddresses);

    const gauge = await deployContract("Gauge");
    // Reemplaza estos valores con las direcciones y parámetros reales necesarios
    await gauge.initialize("0x3d6c56f6855b7Cc746fb80848755B0a9c3770122", internalBribe.address, externalBribe.address, votingEscrow.address, voter.address, true, contractAddresses);

    console.log("Todos los contratos han sido desplegados e inicializados correctamente");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
