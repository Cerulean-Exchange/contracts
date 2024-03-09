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
    event Redeemed(address indexed _addr, uint vestID, uint256 _amount, uint256 _redeemAmount);

    error NonWhiteListed();
    error InsufficientBalance();
    error InsufficientAllowance();

    // upgrade v2
    error VestingPositionNotFound(address user, uint256 vestId);
    error VestingPositionAlreadyExists();

    event NewVest(address indexed _addr, uint256 _vestID, uint256 _amount);
    event Exit(address indexed _addr, uint256 _vestID, uint256 _amount);

    struct VestPosition {
        uint256 amount; // amount of bViri
        uint256 start; // start unix timestamp
        uint256 maxEnd; // start + maxVest (end timestamp)
        uint256 vestID; // vest identifier (starting from 0)
        uint256 exitIn;
    }

    /// @dev map of vesting positions for each user:
    mapping(address => VestPosition[]) public vestInfo;
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

    /// @dev vest an amount to exit later:
    function vest(uint _amount) public returns (uint256 vestID) {
        address user = _msgSender();

        /// @dev check if user has enough balance:
        if (balanceOf(user) < _amount) revert InsufficientBalance();

        /// @dev to avoid user trying to convert same amount to veToken:
        ///      we burn bViri while user is in the queue:
        _burn(user, _amount);

        /// @dev add vesting position:
        vestID = vestInfo[user].length;
        vestInfo[user].push(VestPosition(_amount, block.timestamp, block.timestamp + constants.BTOKEN_MIN_WITHDRAW_DAYS(), vestID, 0));

        emit NewVest(user, vestID, _amount);
    }

    /// @dev exit an vested position and get back bViri:
    function cancelVest(uint256 vestID) public {
        address user = _msgSender();

        if (vestInfo[user][vestID].exitIn != 0) revert VestingPositionAlreadyExists();

        /// @dev update vesting position to avoid reentrancy:
        vestInfo[user][vestID].exitIn = block.timestamp;

        uint amount = vestInfo[user][vestID].amount;

        /// @dev mint the bToken back to user:
        _mint(user, amount);

        emit Exit(user, vestID, amount);
    }

    /// @dev compute penalty amount for _amount of bToken:
    function penalty(uint timestamp, uint256 vestStartAt, uint256 vestEndAt, uint256 _amount) public view returns (uint256 _received, uint256 _pct, uint256 _days) {
        if (timestamp >= vestEndAt) return (_amount, 0, 0);
        /// @dev use a larger denominator to avoid rounding errors:
        uint d = 10_000;
        uint md = 1_000;
        _days = (vestEndAt - timestamp) / 1 days;
        /// @dev check if vesting period is less than epoch:
        _pct = (timestamp - vestStartAt < 1 weeks) ? md : d - (((vestEndAt - timestamp) * d) / constants.BTOKEN_MIN_WITHDRAW_DAYS());
        _received = ((_amount * _pct) / d);
        /// @dev invert the _pct value to display correctly in the UI:
        _pct = d - ((_received * d) / _amount);
    }

    /// @dev redeem bToken for asset with penalty check:
    function redeem(uint256 vestID) public returns (uint256 _received, uint256 _pct, uint256 _days) {
        address user = _msgSender();

        /// @dev prevent reentrancy:
        if (vestInfo[user][vestID].exitIn != 0) revert VestingPositionAlreadyExists();

        /// @dev check penalty:
        uint256 _amount = vestInfo[user][vestID].amount;
        uint256 vestEndAt = vestInfo[user][vestID].maxEnd;
        uint256 vestStartAt = vestInfo[user][vestID].start;

        if (_amount == 0) revert VestingPositionNotFound(user, vestID);

        (_received, _pct, _days) = penalty(block.timestamp, vestStartAt, vestEndAt, _amount);

        /// @dev update vesting position to avoid reentrancy:
        vestInfo[user][vestID].exitIn = block.timestamp;

        /// @dev we already burned bToken when user entered the queue:

        /// @dev transfer asset to msg sender:
        SafeTransferLib.safeTransfer(asset, user, _received);

        /// @dev set left amount to the treasure address:
        if (treasureAddress != address(0)) SafeTransferLib.safeTransfer(asset, treasureAddress, _amount - _received);

        emit Redeemed(user, vestID, _amount, _received);
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

    /// @dev get the queue of vested positions of an address:
    function getVestLength(address user) public view returns (uint256) {
        return vestInfo[user].length;
    }

    /// @dev get the queue of vested positions of an address:
    function getAllVestInfo(address user) public view returns (VestPosition[] memory) {
        return vestInfo[user];
    }

    /// @dev get the vesting position of an address:
    function getVestInfo(address user, uint256 vestID) public view returns (VestPosition memory) {
        return vestInfo[user][vestID];
    }

    /// @dev get the vesting position of an address:
    function balanceOfVestId(address user, uint256 vestID) public view returns (uint256) {
        return vestInfo[user][vestID].amount;
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