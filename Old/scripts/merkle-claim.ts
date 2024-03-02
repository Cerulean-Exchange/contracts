import mainnet_config from "./constants/mainnet-config";
import testnet_config from "./constants/testnet-config";
async function main(){
    const [
        Viri,
        MerkleClaim
    ] = await Promise.all([
        hre.ethers.getContractFactory("Viri"),
        hre.ethers.getContractFactory("MerkleClaim")
    ]);
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const mainnet = chainId === 1116;
    console.log(`#Network: ${chainId}`);
    const CONFIG = mainnet ? mainnet_config : testnet_config;
    const viri = await Viri.deploy();
    await viri.deployed();
    const claim = await MerkleClaim.deploy(viri.address, CONFIG.merkleRoot);
    await claim.deployed();
    console.log('viri', viri.address);
    console.log('merkle', claim.address);
    await viri.setMerkleClaim(claim.address);
    await hre.run("verify:verify", {address: claim.address,
        constructorArguments: [viri.address, CONFIG.merkleRoot]});
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

