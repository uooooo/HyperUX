# Theming

The theme for the AppKit integration in your dApp can be fully customized.

## ThemeMode

By default `themeMode` option will be set to user system settings 'light' or 'dark'. But you can override it like this:

```ts
createAppKit({
  //...
  themeMode: "light",
});
```

## themeVariables

By default `themeVariables` are undefined. You can set them like this:

```ts
createAppKit({
  //...
  themeVariables: {
    "--w3m-color-mix": "#00BB7F",
    "--w3m-color-mix-strength": 40,
  },
});
```

The following list shows the theme variables you can override:

| Variable                     | Description                                                  | Type     |
| ---------------------------- | ------------------------------------------------------------ | -------- |
| `--w3m-font-family`          | Base font family                                             | `string` |
| `--w3m-accent`               | Color used for buttons, icons, labels, etc.                  | `string` |
| `--w3m-color-mix`            | The color that blends in with the default colors             | `string` |
| `--w3m-color-mix-strength`   | The percentage on how much "--w3m-color-mix" should blend in | `number` |
| `--w3m-font-size-master`     | The base pixel size for fonts.                               | `string` |
| `--w3m-border-radius-master` | The base border radius in pixels.                            | `string` |
| `--w3m-z-index`              | The z-index of the modal.                                    | `number` |

## Wallet Buttons

Wallet buttons are components that allow users to connect their wallets to your dApp. They provide a simple and easy way to connect to the top 20 wallets, WalletConnect QR, and all the social logins.
You can also call them directly using hooks. Please check the [components](/appkit/next/core/components#walletButtons) and [hooks](/appkit/next/core/hooks#useappkitwallet) documentation for more information.

<Frame>
  <img src="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4311e99e62b86393bba087f4d750f58f" width="1416" height="356" data-path="images/assets/walletButtons.jpg" srcset="https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=280&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=0a26ae29a8a696be07b86c62286b44e7 280w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=560&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=d91ff2d4dbf21f630c42b2c2f4927560 560w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=840&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=be643bdc3020a5d61dabdb13d80a2673 840w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1100&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=f158003e40f0d4c946e25f7f0537bc0a 1100w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=1650&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=4a06b3ea8602f07a87a58a393fbe954c 1650w, https://mintcdn.com/reown-5552f0bb/EKbxEvu_zecC7Jp2/images/assets/walletButtons.jpg?w=2500&fit=max&auto=format&n=EKbxEvu_zecC7Jp2&q=85&s=afe5cebcfd50d6b4cd874cfa9bf7beb1 2500w" data-optimize="true" data-opv="2" />
</Frame>

<br />

<br />

<Card title="Try Wallet Buttons" href="https://appkit-lab.reown.com/appkit/?name=wagmi" />
