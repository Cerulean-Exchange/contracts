// 1:1 with Hardhat test
pragma solidity 0.8.13;

import './BaseTest.sol';

contract MinterTest is BaseTest {
    VotingEscrow escrow;
    GaugeFactory gaugeFactory;
    BribeFactory bribeFactory;
    Voter voter;
    RewardsDistributor distributor;
    Minter minter;

    function deployBase() public {
        vm.warp(block.timestamp + 1 weeks); // put some initial time in

        deployProxyAdmin();
        deployOwners();
        deployCoins();
        mintStables();
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1e25;
        mintViri(owners, amounts);

        VeArtProxy artProxy = new VeArtProxy();

        VotingEscrow implEscrow = new VotingEscrow();
        proxy = new TransparentUpgradeableProxy(address(implEscrow), address(admin), abi.encodeWithSelector(VotingEscrow.initialize.selector, address(VIRI), address(artProxy)));
        escrow = VotingEscrow(address(proxy));

        Pair implPair = new Pair();
        PairFactory implPairFactory = new PairFactory();
        proxy = new TransparentUpgradeableProxy(address(implPairFactory), address(admin), abi.encodeWithSelector(PairFactory.initialize.selector, address(implPair)));
        factory = PairFactory(address(proxy));

        Router implRouter = new Router();
        proxy = new TransparentUpgradeableProxy(address(implRouter), address(admin), abi.encodeWithSelector(Router.initialize.selector, address(factory), address(owner)));
        router = Router(payable(address(proxy)));
        
        Gauge implGauge = new Gauge();
        GaugeFactory implGaugeFactory = new GaugeFactory();
        proxy = new TransparentUpgradeableProxy(address(implGaugeFactory), address(admin), abi.encodeWithSelector(GaugeFactory.initialize.selector, address(implGauge)));
        gaugeFactory = GaugeFactory(address(proxy));

        InternalBribe implInternalBribe = new InternalBribe();
        ExternalBribe implExternalBribe = new ExternalBribe();
        BribeFactory implBribeFactory = new BribeFactory();
        proxy = new TransparentUpgradeableProxy(address(implBribeFactory), address(admin), abi.encodeWithSelector(BribeFactory.initialize.selector, address(implInternalBribe), address(implExternalBribe)));
        bribeFactory = BribeFactory(address(proxy));

        Voter implVoter = new Voter();
        proxy = new TransparentUpgradeableProxy(address(implVoter), address(admin), abi.encodeWithSelector(Voter.initialize.selector, address(escrow), address(factory), address(gaugeFactory), address(bribeFactory)));
        voter = Voter(address(proxy));

        address[] memory tokens = new address[](2);
        tokens[0] = address(FRAX);
        tokens[1] = address(VIRI);
        voter.init(tokens, address(owner));
        VIRI.approve(address(escrow), TOKEN_1);
        escrow.create_lock(TOKEN_1, 1 * 365 * 86400);

        RewardsDistributor implDistributor = new RewardsDistributor();
        proxy = new TransparentUpgradeableProxy(address(implDistributor), address(admin), abi.encodeWithSelector(RewardsDistributor.initialize.selector, address(escrow)));
        distributor = RewardsDistributor(address(proxy));

        escrow.setVoter(address(voter));

        Minter implMinter = new Minter();
        proxy = new TransparentUpgradeableProxy(address(implMinter), address(admin), abi.encodeWithSelector(Minter.initialize.selector, address(voter), address(escrow), address(distributor)));
        minter = Minter(address(proxy));

        distributor.setDepositor(address(minter));
        VIRI.setMinter(address(minter));

        VIRI.approve(address(router), TOKEN_1);
        FRAX.approve(address(router), TOKEN_1);
        router.addLiquidity(address(FRAX), address(VIRI), false, TOKEN_1, TOKEN_1, 0, 0, address(owner), block.timestamp);

        address pair = router.pairFor(address(FRAX), address(VIRI), false);

        VIRI.approve(address(voter), 5 * TOKEN_100K);
        voter.createGauge(pair);
        vm.roll(block.number + 1); // fwd 1 block because escrow.balanceOfNFT() returns 0 in same block
        assertGt(escrow.balanceOfNFT(1), 995063075414519385);
        assertEq(VIRI.balanceOf(address(escrow)), TOKEN_1);

        address[] memory pools = new address[](1);
        pools[0] = pair;
        uint256[] memory weights = new uint256[](1);
        weights[0] = 5000;
        voter.vote(1, pools, weights);
    }

    function initializeVotingEscrow() public {
        deployBase();
        address[] memory claimants = new address[](1);
        claimants[0] = address(owner);
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = TOKEN_1M;
        minter.init(claimants, amounts, 2e25);
        assertEq(escrow.ownerOf(2), address(owner));
        assertEq(escrow.ownerOf(3), address(0));
        vm.roll(block.number + 1);
        assertEq(VIRI.balanceOf(address(minter)), 19 * TOKEN_1M);
    }

    function testMinterWeeklyDistribute() public {
        initializeVotingEscrow();

        uint256 weekly = minter.weekly();
        console2.log("Weekly:",weekly / 1e18);

        minter.update_period();
        assertEq(minter.weekly(), 100_000 * 1e18);

        changeEpoch(2);

        assertEq(distributor.claimable(1), 0);
        assertLt(minter.weekly(), 100_000 * 1e18); 

        changeEpoch(3);

        uint256 claimable = distributor.claimable(1);
        
        assertEq(claimable, 0);
        distributor.claim(1);
        assertEq(distributor.claimable(1), 0);


        /* console2.log("Total VIRI supply",VIRI.totalSupply());
        console2.log("Escrow total suply",escrow.totalSupply()); */

        changeEpoch(4);

        distributor.claim(1);

        changeEpoch(5);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = 1;
        distributor.claim_many(tokenIds);

        changeEpoch(6);

        distributor.claim(1);

        changeEpoch(7);

        //console2.log(distributor.claimable(1));
        distributor.claim_many(tokenIds);

        changeEpoch(8);

        //console2.log("Distributor claimable 1", distributor.claimable(1));
        distributor.claim(1);

        fromEpoch8To30();
    }

    function fromEpoch8To30() public{
        changeEpoch(9);
        changeEpoch(10);

        changeEpoch(11);
        changeEpoch(12);
        changeEpoch(13);
        changeEpoch(14);
        changeEpoch(15);
        changeEpoch(16);
        changeEpoch(17);
        changeEpoch(18);
        changeEpoch(19);
        changeEpoch(20);

        changeEpoch(21);
        changeEpoch(22);
        changeEpoch(23);
        changeEpoch(24);
        changeEpoch(25);
        changeEpoch(26);
        changeEpoch(27);
        changeEpoch(28);
        changeEpoch(29);
        changeEpoch(30);
    }

    function changeEpoch(uint epoch) public{
        vm.warp(block.timestamp + 86400 * 7);
        vm.roll(block.number + 1);
        console2.log("\x1b[33mEpoch:\x1b[0m", "\x1b[33m", epoch, "\x1b[0m");
        console2.log("weekly_emission ", minter.weekly_emission() / 1e18);
        minter.update_period();
    }
}
