async function main() {

    async function deployContract(contractName) {
        let contractFactory = await ethers.getContractFactory(contractName);
        let contractInstance = await contractFactory.deploy();
        return contractInstance;
    }

    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const veSplitter = await ethers.getContractFactory("veSplitter");
    const veSplitterContract = await veSplitter.deploy("0x29A84d8f728c9cd9DA7560d290a1FAcB3b8FC06e");

    console.log("veSplitter address:", veSplitterContract.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
