/* // SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20} from "lib/solmate/src/tokens/ERC20.sol";
import {SafeTransferLib} from "lib/solmate/src/utils/SafeTransferLib.sol";
import {IVotingEscrow} from "contracts/interfaces/IVotingEscrow.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ILayerZeroEndpointUpgradeable} from "contracts/@layerzerolabs/solidity-examples/contracts/contracts-upgradable/interfaces/ILayerZeroEndpointUpgradeable.sol";
import {OFTUpgradeable} from "contracts/@layerzerolabs/solidity-examples/contracts/contracts-upgradable/token/oft/OFTUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IVoter} from "contracts/interfaces/IVoter.sol";
import {IWrappedExternalBribeFactory} from "contracts/interfaces/IWrappedExternalBribeFactory.sol";
import {IConstants} from "contracts/interfaces/IConstants.sol";

contract bViri is Initializable, OFTUpgradeable {
    ERC20 public asset;
    IVotingEscrow public ve;
    IVoter public voter;
    IWrappedExternalBribeFactory wrappedFactory;
    IConstants public constants;

    /// @dev controls who can do transfers:
    mapping(address => bool) public whiteList;

    /// @dev last mint timestamp for each user for penalty calculation:
    mapping(address => uint) public lastMint;

    event WhiteList(address indexed _addr, bool _status);

    error NonWhiteListed();
    error InsufficientBalance();
    error InsufficientAllowance();

    address public treasureAddress;

    function initialize(address _constants, address _asset, address _ve, address _wrappedFactory, address _voter) public initializer {
        __OFTUpgradeable_init("bViri", "bVIRI", address(0));
        constants = IConstants(_constants);
        asset = ERC20(_asset);
        ve = IVotingEscrow(_ve);
        voter = IVoter(_voter);
        wrappedFactory = IWrappedExternalBribeFactory(_wrappedFactory);

        /// @dev set owner as whiteListed:
        whiteList[_msgSender()] = true;
        emit WhiteList(_msgSender(), true);

        /// @dev whitelist 0 address as it is the minter:
        whiteList[address(0)] = true;
        emit WhiteList(address(0), true);
    }

    /// @dev set whiteList status for _addr, allowing it to transfer bToken:
    function setWhitelist(address _addr, bool _status) public onlyOwner {
        whiteList[_addr] = _status;
        emit WhiteList(_addr, _status);
    }

    /// @dev mint bToken to _to, transfer _amount of asset from msg sender to this contract:
    function mint(address _to, uint256 _amount) public onlyOwner {
        /// @dev check allowance:
        if (asset.allowance(_msgSender(), address(this)) < _amount) {
            revert InsufficientAllowance();
        }

        /// @dev check balance:
        if (asset.balanceOf(_msgSender()) < _amount) {
            revert InsufficientBalance();
        }

        /// @dev transfer asset to this contract:
        SafeTransferLib.safeTransferFrom(asset, _msgSender(), address(this), _amount);

        /// @dev mint bToken to _to:
        _mint(_to, _amount);

        /// @dev update last mint timestamp for penalty calculation:
        lastMint[_to] = block.timestamp;
    }

    /// @dev convert bVIRI to veVIRI:
    function convertToVe(uint256 _amount) public returns (uint256 tokenId) {
        /// @dev check balance:
        if (balanceOf(_msgSender()) < _amount) {
            revert InsufficientBalance();
        }

        /// @dev burn bToken:
        _burn(_msgSender(), _amount);

        /// @dev mint veToken:
        asset.approve(address(ve), _amount);

        /// @dev conversion always lock for 1y:
        uint _lock_duration = (((1 * 365 days) / 1 weeks) * 1 weeks) - 1;
        return ve.create_lock_for(_amount, _lock_duration, _msgSender());
    }

    /// @dev only allow transfers if from or to is whiteListed:
    function _beforeTokenTransfer(address from, address to, uint256) internal view override {
        /// @dev check if from or to is whiteListed:
        if (!whiteList[from] && !whiteList[to]) {
            revert NonWhiteListed();
        }
    }

    function setTreasureAddress(address _treasureAddress) public onlyOwner {
        treasureAddress = _treasureAddress;
    }

    function whitelistBribes() public {
        uint t = voter.length();
        for (uint i = 0; i < t; i++) {
            address poolAddress = voter.pools(i);
            address gaugeAddress = voter.gauges(poolAddress);
            if (gaugeAddress == address(0)) continue;
            address bribe = voter.external_bribes(gaugeAddress);
            address wrapped = wrappedFactory.oldBribeToNew(bribe);
            bool isAlive = voter.isAlive(gaugeAddress);

            if (bribe != address(0)) {
                whiteList[bribe] = isAlive;
                emit WhiteList(bribe, isAlive);
            }

            if (wrapped != address(0)) {
                whiteList[wrapped] = isAlive;
                emit WhiteList(wrapped, isAlive);
            }
        }
    }

    /// @dev convert bVIRI to veVIRI and add to an existing position:
    function addToVe(uint256 _tokenId, uint256 _amount) public {
        /// @dev check balance:
        if (balanceOf(_msgSender()) < _amount) {
            revert InsufficientBalance();
        }

        /// @dev burn bToken:
        _burn(_msgSender(), _amount);

        /// @dev mint veToken:
        asset.approve(address(ve), _amount);

        /// @dev let's compute time left for 1y:
        uint _lock_duration = 1 * 365 days;
        uint unlock_time = ((block.timestamp + _lock_duration) / 1 weeks) * 1 weeks; // Locktime is rounded down to weeks
        /// @dev check if we need to push the unlock time:
        if (unlock_time > ve.locked__end(_tokenId)) ve.increase_unlock_time(_tokenId, _lock_duration);

        /// @dev let's add to an existing position:
        ve.increase_amount(_tokenId, _amount);
    }

    // @dev sets the LZ endpoint anytime if we need it:
    function setEndpoint(address _endpoint) public onlyOwner {
        lzEndpoint = ILayerZeroEndpointUpgradeable(_endpoint);
    }
} */