// Importa las herramientas de prueba necesarias de hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Minter contract", function () {
    let Minter;
    let minter;
    let rewards_distributor;
    let owner, voter, ve, rewardsDistributor;
  
    beforeEach(async function () {
        Minter = await ethers.getContractFactory("Minter");
        rewardsDistributor = await ethers.getContractFactory("rewardsDistributor");

        // Suponiendo que las direcciones son proveídas por ganache
        [owner, voter, ve, rewardsDistributor] = await ethers.getSigners();
        console.log("owner", owner.address)
        minter = await Minter.deploy();
        rewards_distributor = await rewardsDistributor.deploy();
        await minter.initialize(voter.address, ve.address, rewardsDistributor.address);
        console.log("minter", minter.address)
    });
  
    describe("initialize function", function () {
        it("Should successfully initialize Minter contract", async function () {
            // aqui asumiendo que voter.address, ve.address, rewardsDistributor.address son direcciones válidas
            

            // podemos verificar que la inicialización se llevó a cabo correctamente
            // por ejemplo, verificando que el valor de _voter en el contrato es igual al proporcionado
            expect(await minter._voter()).to.equal(voter.address);
        });
    });
});