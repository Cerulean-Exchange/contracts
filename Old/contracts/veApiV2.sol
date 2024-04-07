pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
    function allowance(address, address) external view returns (uint256);
}
interface IVoter {
    function length() external view returns (uint256);
    function pools(uint256) external view returns (address);
    function gauges(address) external view returns (address);
}
interface IveNFT {
    function totalSupply() external view returns (uint256);
}

contract VE_Api_V2 is Ownable {
    IERC20 public VIRI;
    IVoter public VOTER;
    IveNFT public veNFT;

    address[] public excluded = [address(0), 0x000000000000000000000000000000000000dEaD];
    address public pool2;

    constructor(address _pool2, address _viri, address _voter, address _ve) {
        VIRI = IERC20(_viri);
        VOTER = IVoter(_voter);
        veNFT = IveNFT(_ve);
        pool2 = _pool2;
    }

    function setPool2(address _pool2) public onlyOwner {
        pool2 = _pool2;
    }

    function addExcluded(address _e) public onlyOwner {
        excluded.push(_e);
    }

    function pullExcluded(uint n) public onlyOwner {
        excluded[n] = excluded[excluded.length - 1];
        excluded.pop();
    }

    function name() public pure returns(string memory) {
        return "Viridian.s";
    }

    function symbol() public pure returns(string memory) {
        return "VIRI.s";
    }

    function decimals() public pure returns(uint8) {
        return 18;
    }

    function allowance(address _o, address _s) public view returns(uint256) {
        return VIRI.allowance(_o, _s);
    }

    function balanceOf(address _o) public view returns(uint256) {
        return VIRI.balanceOf(_o);
    }

    function inExcluded() public view returns(uint256 _t) {
        for(uint i; i < excluded.length; i++) {
            _t += VIRI.balanceOf(excluded[i]);
        }
        return _t;
    }

    function inGauges() public view returns(uint256 _t) {
        uint _l = VOTER.length();
        for(uint i; i < _l; i++) {
            address _p = VOTER.pools(i);
            address _g = VOTER.gauges(_p);
            _t += VIRI.balanceOf(_g);
        }
        return _t;
    }

    function inNFT() public view returns(uint256) {
        return VIRI.balanceOf(address(veNFT));
    }

    function dilutedSupply() public view returns(uint256) {
        return VIRI.totalSupply();
    }

    function outstandingSupply() public view returns(uint256) {
        return dilutedSupply() - inExcluded() - inGauges();
    }

    function totalSupply() public view returns(uint256) {
        return circulatingSupply();
    }

    function circulatingSupply() public view returns(uint256) {
        return dilutedSupply() - inExcluded() - inGauges() - inNFT();
    }

    function lockRatio() public view returns(uint256) {
        return (inNFT() * 1e18) / (circulatingSupply() + inNFT());
    }

    // Nota: Funciones como 'price', 'liquidity', 'circulatingMarketCap', 'marketCap', 'fdv', y 'lockedMarketCap'
    // que dependían de ORACLE han sido removidas. Asegúrate de ajustar tu lógica de contrato en consecuencia.

    function info() public view returns(uint256[9] memory) {
        uint256[9] memory _info = [
        uint256(0), 1, 2, 3, 4, 5, 6, 7, 8
        ];
        _info[0] = block.timestamp;
        _info[1] = circulatingSupply();
        _info[2] = outstandingSupply();
        _info[3] = dilutedSupply();
        _info[4] = inNFT();
        _info[5] = inGauges();
        _info[6] = inExcluded();
        _info[7] = veNFT.totalSupply();
        _info[8] = lockRatio();
        return _info;
    }
}
