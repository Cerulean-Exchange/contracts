const { ethers } = require("hardhat");

async function main() {
  //obtenemos el artifact de la NUEVA implementacion
  const NuevoContrato = await ethers.getContractFactory("Lock");
  
  // hacemos el upgrade del proxy
  const lock = await NuevoContrato.deploy(1797175292);
  
  console.log("Address del Contrato Lock: ", lock.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
