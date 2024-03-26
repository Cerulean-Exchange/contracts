// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import 'contracts/libraries/Math.sol';
import 'contracts/interfaces/IERC20.sol';
import 'contracts/interfaces/IGauge.sol';
import 'contracts/interfaces/IVoter.sol';
import 'contracts/interfaces/IVotingEscrow.sol';

contract WrappedExternalBribeV2 {
    address public immutable voter;
    address public immutable _ve;

    uint internal constant DURATION = 7 days;
    uint internal constant MAX_REWARD_TOKENS = 16;
    uint internal constant PRECISION = 10 ** 18;

    mapping(address => mapping(uint => uint)) public tokenRewardsPerEpoch;
    mapping(address => uint) public periodFinish;
    mapping(address => mapping(uint => uint)) public lastEarn;

    address[] public rewards;
    mapping(address => bool) public isReward;

    struct RewardCheckpoint {
        uint timestamp;
        uint balance;
    }

    event NotifyReward(address indexed from, address indexed reward, uint epoch, uint amount);
    event ClaimRewards(address indexed from, address indexed reward, uint amount);

    constructor(address _voter) {
        voter = _voter;
        _ve = IVoter(_voter)._ve();
    }

    uint internal _unlocked = 1;
    modifier lock() {
        require(_unlocked == 1);
        _unlocked = 2;
        _;
        _unlocked = 1;
    }

    function _bribeStart(uint timestamp) internal pure returns (uint) {
        return timestamp - (timestamp % (7 days));
    }

    function getEpochStart(uint timestamp) public pure returns (uint) {
        uint bribeStart = _bribeStart(timestamp);
        uint bribeEnd = bribeStart + DURATION;
        return timestamp < bribeEnd ? bribeStart : bribeStart + 7 days;
    }

    function rewardsListLength() external view returns (uint) {
        return rewards.length;
    }

    function lastTimeRewardApplicable(address token) public view returns (uint) {
        return Math.min(block.timestamp, periodFinish[token]);
    }

    // Modify this function to suit the new logic
    function getReward(uint tokenId, address[] memory tokens) external lock {
        // Custom logic for reward calculation and distribution
    }

    // Modify this function to suit the new logic
    function getRewardForOwner(uint tokenId, address[] memory tokens) external lock {
        // Custom logic for reward calculation and distribution
    }

    function earned(address token, uint tokenId) public view returns (uint) {
        // Adjust this function to fit the new reward distribution logic
    }

    function left(address token) external view returns (uint) {
        // Adjust this function as necessary
    }

    function notifyRewardAmount(address token, uint amount) external lock {
        require(amount > 0);
        // Rest of the function logic
    }

    function swapOutRewardToken(uint i, address oldToken, address newToken) external {
        require(msg.sender == IVotingEscrow(_ve).team(), 'only team');
        // Adjust the function logic
    }

    function _safeTransfer(address token, address to, uint256 value) internal {
        // Safe transfer implementation
    }

    function _safeTransferFrom(address token, address from, address to, uint256 value) internal {
        // Safe transferFrom implementation
    }
}
