import cfg from "./constants/mainnet-config";
import allContracts from "../contracts";

interface IContract {
    Vara: string;
    Voter: string;
    VotingEscrow: string;
}

interface IAllContracts {
    [chainId: number]: IContract;
}

async function main() {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = network.chainId;
    const contracts:IContract = allContracts[chainId];
    //console.log('contracts', contracts);
    // Load
    const [ EquilibreTvlOracle, Equilibre_VE_Api  ] = await Promise.all([
        hre.ethers.getContractFactory("EquilibreTvlOracle"),
        hre.ethers.getContractFactory("Equilibre_VE_Api"),
    ]);
    const oracleArgs = [cfg.USDC, cfg.WETH, cfg.WCORE_USDT];
    //console.log('oracleArgs', oracleArgs);

    const oracle = await EquilibreTvlOracle.deploy(oracleArgs, cfg.USDC_DECIMALS);
    await oracle.deployed();
    console.log('EquilibreTvlOracle', oracle.address);

    const veApi = await Equilibre_VE_Api.deploy(oracle.address, cfg.VIRI_CORE,
        contracts.Viri, contracts.Voter, contracts.VotingEscrow);
    const veApiVerifyArgs = [oracle.address, cfg.VIRI_CORE,
        contracts.Viri, contracts.Voter, contracts.VotingEscrow];
    await veApi.deployed();
    console.log('Equilibre_VE_Api', veApi.address);

    try {
        if( chainId === 1116 || chainId === 1115 ) {
            await oracle.deployTransaction.wait(10);
            await hre.run("verify:verify", {
                address: oracle.address,
                constructorArguments: [oracleArgs, cfg.USDC_DECIMALS]
            });
        }
    } catch (e) {
        console.log(e.toString());
    }

    try {
        if( chainId === 1116 || chainId === 1115 ) {
            await veApi.deployTransaction.wait(10);
            await hre.run("verify:verify", {
                address: veApi.address,
                constructorArguments: veApiVerifyArgs
            });
        }
    } catch (e) {
        console.log(e.toString());
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

