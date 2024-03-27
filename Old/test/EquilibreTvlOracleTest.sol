pragma solidity 0.8.13;

import "../test/BaseTest.sol";
import "contracts/EquilibreTvlOracle.sol";
import "contracts/Viri.sol";

contract EquilibreTvlOracleTest is BaseTest {
    uint TOKEN_100 = 100 * 1e18;
    uint TOKEN_100e6 = 100 * 1e6;
    EquilibreTvlOracle oracle;
    EquilibreTvlOracle oracle_viri;
    Pair poolViri;
    function setUp() public {
        deployCoins();
        factory = new PairFactory();
        router2 = new Router2(address(factory), address(WETH));

        // weth/usdc
        USDC.mint(address(this), TOKEN_100e6);
        USDC.approve(address(router2), TOKEN_100e6);
        router2.addLiquidityETH{value : TOKEN_100}(address(USDC), false, TOKEN_100e6, 0, 0, address(this), block.timestamp);
        pair = Pair(factory.getPair(address(USDC), address(WETH), false));

        // viri/usdc
        USDC.mint(address(this), TOKEN_100e6);
        USDC.approve(address(router2), TOKEN_100e6);
        VIRI.mint(address(this), TOKEN_100);
        VIRI.approve(address(router2), TOKEN_100);
        router2.addLiquidity(address(VIRI), address(USDC), false, TOKEN_100, TOKEN_100e6, 0, 0, address(this), block.timestamp);
        poolViri = Pair(factory.getPair(address(USDC), address(VIRI), false));

        address[3] memory uwl = [address(USDC), address(WETH), address(pair)];
        oracle = new EquilibreTvlOracle(uwl, 6);

        address[3] memory uwl_viri = [address(USDC), address(VIRI), address(poolViri)];
        oracle_viri = new EquilibreTvlOracle(uwl_viri, 6);

    }

    function testCmd() public{
        Router.route[] memory routes = new Router.route[](1);
        routes[0] = Router.route(address(WETH), address(USDC), false);
        router2.swapExactETHForTokensSupportingFeeOnTransferTokens{value: TOKEN_1}(0, routes, address(this), block.timestamp);

        uint price_eth = oracle.p_t_coin_usd(address(pair));
        console2.log('eth/usdc price', price_eth);

        uint price_viri = oracle.p_t_coin_usd(address(poolViri));
        console2.log('viri/usdc price', price_viri);

    }
}
