# Vara


---

Main protocol token, used to pay rewards.
This is the token that is accepted to be locked in the veNFT.

# GaugeFactory


---

Used to correctly create gauges contracts.

As gauges need a list of specific parameters, the factory should
be used to build this gauges correctly.

This contract is used by `Voter` contract to build gauges for gauges.

# BribeFactory


---

Used to correctly create bribe contracts.

As bribes need a list of specific parameters, the factory should
be used to build this bribes correctly.

This contract is used by `Voter` contract to build bribes for gauges.

# PairFactory


---

Used to correctly create pair contracts.

This contract is used by Router/Router2 to create pair/pools contracts.

After pair pools contracts are created the router can deposit or swap
on pools.

Also, PairFactory contains the fees and a list of available pools to query.

# Router


---

Used to swap tokens from pools.

This is the original contract that does not support tokens with fee on transfer.

# Router2


---

Used to swap tokens from pools.

This version support tokens with fee on transfer, and it is used in the app.

# VaraLibrary


---

Math library internally used by Router calculations.

# VeArtProxy


---

Used by veNFT to build the SVG image with token balance info
returned by tokenURI.

# VotingEscrow


---

This is the veNFT contract, an ERC721 contract that hold 
Vara tokens and provide the NFT with the lock.

The veNFT info is used in gauges/bribe system to pay user rewards.

# RewardsDistributor


---

This is an internal contract used by `Minter` contract that distribute
`Vara` rewards. 

# Voter


---

Contract responsible to manage gauges and allow users to vote/reset
on gauges by nft id.

# WrappedExternalBribeFactory


---

Used to create a wrapped external bribe contract. After the external bribe
fix, this don't need to be used anymore, but maybe used in the ui to avoid
breaking the app.

# Minter


---

The contract responsible for minting epoch Vara tokens to be distributed
during the epoch.

# VaraGovernor


---

Can be used to create proposal and votes, like vote to whitelist a
new token to create a Gauge for example.

# MerkleClaim


---

Used during the airdrop to allow users to claim airdrops from collected
wallet data.
