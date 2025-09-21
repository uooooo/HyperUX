# Web Components

AppKit's [web components](https://www.webcomponents.org/) are custom and reusable HTML tags. They will work across modern browsers, and can be used with any JavaScript library or framework that works with HTML.

<Note>
  Web components are global html elements that don't require importing.
</Note>

### List of optional properties for AppKit web components

### `<appkit-button />`

| Variable       | Description                                                                                            | Type                               |
| -------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `disabled`     | Enable or disable the button.                                                                          | `boolean`                          |
| `balance`      | Show or hide the user's balance.                                                                       | `'show'   \| 'hide'`               |
| `size`         | Default size for the button.                                                                           | `'md'     \| 'sm'`                 |
| `label`        | The text shown in the button.                                                                          | `string`                           |
| `loadingLabel` | The text shown in the button when the modal is open.                                                   | `string`                           |
| `namespace`    | Option to show specific namespace account info. Note: `eip155` is for EVM and `bip122` is for Bitcoin. | `'eip155' \| 'solana' \| 'bip122'` |

### `<appkit-account-button />`

| Variable   | Description                      | Type                 |
| ---------- | -------------------------------- | -------------------- |
| `disabled` | Enable or disable the button.    | `boolean`            |
| `balance`  | Show or hide the user's balance. | `'show'   \| 'hide'` |

### `<appkit-connect-button />`

| Variable       | Description                                          | Type              |
| -------------- | ---------------------------------------------------- | ----------------- |
| `size`         | Default size for the button.                         | `'md'    \| 'sm'` |
| `label`        | The text shown in the button.                        | `string`          |
| `loadingLabel` | The text shown in the button when the modal is open. | `string`          |

### `<appkit-network-button />`

| Variable   | Description                   | Type      |
| ---------- | ----------------------------- | --------- |
| `disabled` | Enable or disable the button. | `boolean` |

### `<appkit-wallet-button  />`

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4311e99e62b86393bba087f4d750f58f" width="1416" height="356" data-path="images/assets/walletButtons.jpg" srcset="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=280&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=0a26ae29a8a696be07b86c62286b44e7 280w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=560&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=d91ff2d4dbf21f630c42b2c2f4927560 560w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=840&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=be643bdc3020a5d61dabdb13d80a2673 840w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1100&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=f158003e40f0d4c946e25f7f0537bc0a 1100w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1650&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4a06b3ea8602f07a87a58a393fbe954c 1650w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=2500&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=afe5cebcfd50d6b4cd874cfa9bf7beb1 2500w" data-optimize="true" data-opv="2" />
</Frame>

Using the wallet button components ([Demo in our Lab](https://appkit-lab.reown.com/appkit/?name=wagmi)), you can directly connect to the top 20 wallets, WalletConnect QR and also all the social logins.
This component allows to customize dApps, enabling users to connect their wallets effortlessly, all without the need for the traditional modal.

Follow these steps to use the component:

1. Install the package:

<CodeGroup>
  ```bash npm
  npm install @reown/appkit-wallet-button
  ```

  ```bash Yarn
  yarn add @reown/appkit-wallet-button
  ```

  ```bash Bun
  bun a @reown/appkit-wallet-button
  ```

  ```bash pnpm
  pnpm add @reown/appkit-wallet-button
  ```
</CodeGroup>

2. Import the library in your project:

```tsx
import "@reown/appkit-wallet-button/react";
```

3. use the component in your project:

```tsx
<appkit-wallet-button wallet="metamask" />
```

#### Multichain Support

You can specify a blockchain namespace to target specific chains:

```tsx
<!-- Connect to Ethereum/EVM chains -->
<appkit-wallet-button wallet="metamask" namespace="eip155" />

<!-- Connect to Solana -->
<appkit-wallet-button wallet="phantom" namespace="solana" />

<!-- Connect to Bitcoin -->
<appkit-wallet-button wallet="leather" namespace="bip122" />
```

#### Options for wallet property

| Type          | Options                                                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| QR Code       | `walletConnect`                                                                                                                                                                                                                                                                                                                                                               |
| Wallets       | `metamask`, `trust`, `coinbase`, `rainbow`, `coinbase`, `jupiter`, `solflare`, `coin98`, `magic-eden`, `backpack`, `frontier`, `xverse`, `okx`, `bitget`, `leather`, `binance`, `uniswap`, `safepal`, `bybit`, `phantom`, `ledger`, `timeless-x`, `safe`, `zerion`, `oneinch`, `crypto-com`, `imtoken`, `kraken`, `ronin`, `robinhood`, `exodus`, `argent`, and `tokenpocket` |
| Social logins | `google`, `github`, `apple`, `facebook`, `x`, `discord`, and `farcaster`                                                                                                                                                                                                                                                                                                      |

#### Options for namespace property

| Value    | Description                        |
| -------- | ---------------------------------- |
| `eip155` | Ethereum and EVM-compatible chains |
| `solana` | Solana blockchain                  |
| `bip122` | Bitcoin blockchain                 |
