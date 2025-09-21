# Bridge2

### General Information

The bridge between Hyperliquid and Arbitrum: <https://arbiscan.io/address/0x2df1c51e09aecf9cacb7bc98cb1742757f163df7>

The bridge code: <https://github.com/hyperliquid-dex/contracts/blob/master/Bridge2.sol>

### Deposit

The deposit flow for the bridge is simple. The user sends native USDC to the bridge, and it is credited to the account that sent it in less than 1 minute. The minimum deposit amount is 5 USDC. If you send an amount less than this, it will not be credited and be lost forever.&#x20;

### Withdraw

The withdrawal flow requires a user wallet signature on Hyperliquid only, and no Arbitrum transaction. The withdrawal from Arbitrum is handled entirely by validators, and the funds arrive in the user wallet in 3-4 minutes. This payload for signTypedData is

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub(crate) struct WithdrawAction3 {
    pub(crate) signature_chain_id: U256,
    pub(crate) hyperliquid_chain: Chain,
    pub(crate) destination: String,
    pub(crate) amount: String,
    pub(crate) time: u64,
}

impl Eip712 for WithdrawAction3 {
    type Error = Eip712Error;

    fn domain(&self) -> StdResult<EIP712Domain, Self::Error> {
        Ok(eip_712_domain(self.signature_chain_id))
    }

    fn type_hash() -> StdResult<[u8; 32], Self::Error> {
        Ok(eip712::make_type_hash(
            format!("{HYPERLIQUID_EIP_PREFIX}Withdraw"),
            &[
                ("hyperliquidChain".to_string(), ParamType::String),
                ("destination".to_string(), ParamType::String),
                ("amount".to_string(), ParamType::String),
                ("time".to_string(), ParamType::Uint(64)),
            ],
        ))
    }

    fn struct_hash(&self) -> StdResult<[u8; 32], Self::Error> {
        let Self { signature_chain_id: _, hyperliquid_chain, destination, amount, time } = self;
        let items = vec![
            ethers::abi::Token::Uint(Self::type_hash()?.into()),
            encode_eip712_type(hyperliquid_chain.to_string().into_token()),
            encode_eip712_type(destination.clone().into_token()),
            encode_eip712_type(amount.clone().into_token()),
            encode_eip712_type(time.into_token()),
        ];
        Ok(keccak256(encode(&items)))
    }
}
```

Example signed Hyperliquid action:

```json
{
    "action": {
        "type": "withdraw3",
        "signatureChainId": "0xa4b1",
        "hyperliquidChain": "Mainnet" or "Testnet" 
        "destination": "0x000....0",
        "amount": "12.3",
        "time": 1698693262
    },
    "nonce": 1698693262 // IMPORTANT: this must match "time",
    "signature": {"r": ..., "s": ..., "v": ... } // signedTypedData output based on Eip712 implementation above. See python sdk for equivalent python code
}
```

### Deposit with permit

The bridge supports depositing on behalf of another user via the `batchedDepositWithPermit`function. Example code for how the user can sign the PermitPayload

```typescript
const payload: PermitPayload = {
  owner, // The address of the user with funds they want to deposit
  spender, // The address of the bridge 0x2df1c51e09aecf9cacb7bc98cb1742757f163df7 on mainnet and 0x08cfc1B6b2dCF36A1480b99353A354AA8AC56f89 on testnet
  value,
  nonce,
  deadline,
};

const isMainnet = true;

const domain = {
  name: isMainnet ? "USD Coin" : "USDC2",
  version: isMainnet ? "2" : "1",
  chainId: isMainnet ? 42161 : 421614,
  verifyingContract: isMainnet ? "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" : "0x1baAbB04529D43a73232B713C0FE471f7c7334d5",
};

const permitTypes = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

const dataToSign = {
  domain,
  types: permitTypes,
  primaryType: "Permit",
  message: payload,
} as const;

const data = await walletClient.signTypedData(dataToSign);
const signature = splitSig(data);
```
