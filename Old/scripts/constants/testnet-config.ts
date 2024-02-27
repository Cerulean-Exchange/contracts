import {ethers} from "ethers";
const TEAM_MULTISIG = "0xB123E01098E022755A86C660d18586d55d00d01c";
const TEAM_EOA = "0x0E70F0eE28c15C3215Ca220Ef3048e3Bc46651DF";
const TCORE = "0xbB7855fA0Ad297EC6e4aa1d4BE30f148447eD68c";
const USDT = "0x3786495f5d8a83b7bacd78e2a0c61ca20722cce3";
const testnetArgs = {
    TCORE: TCORE,
    USDT: USDT,
    teamEOA: TEAM_EOA,
    teamTreasure: '0xB123E01098E022755A86C660d18586d55d00d01c',
    teamMultisig: TEAM_MULTISIG,
    emergencyCouncil: TEAM_EOA,
    merkleRoot: "",
    tokenWhitelist: [],
    partnerAddrs: [

    ],
    partnerAmts: [

    ],
};

export default testnetArgs;
