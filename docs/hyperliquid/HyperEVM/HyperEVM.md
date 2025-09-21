# HyperEVM

The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books.

### What can I do on the HyperEVM?&#x20;

Explore directories of apps, tools, and more built by community members: [HypurrCo](https://www.hypurr.co/ecosystem-projects), [HL Eco](https://hl.eco/projects), [ASXN](https://data.asxn.xyz/dashboard/hyperliquid-ecosystem), and [Hyperliquid.wiki](https://hyperliquid.wiki/). Visit the [HyperEVM onboarding FAQ](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/how-to-use-the-hyperevm) for more questions.&#x20;

### Why build on the HyperEVM?

Builders can plug into a mature, liquid, and performant onchain order books with HyperCore + HyperEVM on Hyperliquid. In addition, Hyperliquid has a captive audience of users who want to be at the forefront of financial change; they are excited to try new applications and conduct finance onchain. See the [HyperEVM developer section](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm) for more technical details and [tools for HyperEVM builders](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm/tools-for-hyperevm-builders) for resources. &#x20;

As one example, a project XYZ could deploy an ERC20 contract on the HyperEVM using standard EVM tooling and deploy a corresponding spot asset XYZ permissionlessly in the HyperCore spot auction. Once the HyperCore token and HyperEVM contract are linked, users can use the same XYZ token on HyperEVM applications and trade it with on the native spot order book. This has two key improvements compared to CEX listings: 1) The entire process is permissionless, with no behind-the-scenes negotiations for preferential treatment and 2) There is no bridging risk between HyperCore and HyperEVM as one unified state. Trading and building on the same chain is a 10x product improvement over CEXs.

As another example, a lending protocol could set up a pool contract that accepts token XYZ as collateral and lends out another token ABC to the borrower. To determine the liquidation threshold, the lending smart contract can read XYZ/ABC prices directly from the HyperCore order books using a read precompile. For a Solidity developer, this is as simple as calling a built-in function. Suppose the borrower's position requires liquidation. The lending smart contract can send orders directly swapping XYZ and ABC on the HyperCore order books using a write system contract. Again, this is a simple built-in function in Solidity. In a few lines of code, the lending protocol has implemented protocolized liquidations similar to how perps function on HyperCore. A theme of the HyperEVM is to abstract away the deep liquidity on HyperCore as a building block for arbitrary user applications.

### What stage is the HyperEVM in?&#x20;

The HyperEVM is in the alpha stage. There are three reasons behind this gradual roll-out approach.&#x20;

First, this stays true to Hyperliquid’s “no insiders” principle; everyone has equal access and starts on a level playing field. The tradeoff is that HyperEVM did not launch with the same tooling you might see on other chains, since no one is given a heads up nor paid for an integration or marketing. These short term obstacles are worth it to be a fair, credibly neutral platform in the long-run.&#x20;

Second, a gradual roll-out is the safest way to upgrade a complex system doing billions of dollars of volume a day and protect against performance degradation or downtime.&#x20;

Third, shipping an MVP and iterating live with user feedback allows development to adjust more nimbly. Testnets are useful for technical testing, but systems can only be hardened through real economic use.&#x20;

As such, higher throughput and write system contracts are not live on mainnet yet, but will be in due time.&#x20;
