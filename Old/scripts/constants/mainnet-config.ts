import { ethers } from "ethers";
const TEAM_MULTISIG = "0xc0b722Ad426Fd297B110E94EA8c71Ca9413bB5C4";
const TEAM_EOA = "0x9074831C9e669577812A99553A6C175E68898ff8";
const WETH = "";
const USDC = "";
const mainnet_config = {
  WETH: WETH,
  USDC: USDC,
  USDC_DECIMALS: 6,
  WCORE_USDT: "",
  VIRI_USDT: "",
  VIRI_CORE: "",
  POOL2: "",  //Gauge WCORE/VIRI
  teamEOA: TEAM_EOA,
  teamTreasure: '0xc0b722Ad426Fd297B110E94EA8c71Ca9413bB5C4',
  teamMultisig: TEAM_MULTISIG,
  emergencyCouncil: "",
  merkleRoot: "",
  tokenWhitelist: [],
  partnerAddrs: [

  ],
  partnerAmts: [

  ],
};

export default mainnet_config;
