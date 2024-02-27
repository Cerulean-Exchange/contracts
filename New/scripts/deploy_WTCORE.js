const { ethers } = require("hardhat");

async function main() {

 
  //obtenemos el artifact de la implementacion
  const NuevoContrato = await ethers.getContractFactory("WTCORE");
  
  // Deployamos el contrato del ERC 20
  const wTCOREContract = await NuevoContrato.deploy();
  
  console.log("Address del Contrato WTCORE: ", wTCOREContract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});