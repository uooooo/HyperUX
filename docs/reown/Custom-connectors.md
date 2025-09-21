# Custom connectors

In AppKit, a 'connector' is the bridge between your app and a user's wallet. This page shows how to add custom connectors beyond the default ones, allowing your users to connect with additional wallet types and authentication methods.

<Tabs>
  <Tab title="Wagmi">
    If you already have Wagmi integrated into your application or would like more control over Wagmi's configuration, you can integrate AppKit on top of it.

    Adding custom connectors like WalletConnect and Coinbase is optional.

    By default, [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) and WC connectors are provided out of the box.

    ```tsx
    import { createAppKit } from '@reown/appkit/react'
    import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

    import { http, WagmiProvider, CreateConnectorFn } from 'wagmi'
    import { abstractTestnet } from '@reown/appkit/networks'
    // you need to add the abstract library in order to make it work
    import { abstractWalletConnector } from "@abstract-foundation/agw-react/connectors";
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

    const queryClient = new QueryClient()

    export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

    const metadata = {
      //...
    }

    // create the custom connector (in this example Abastract)
    const connectors: CreateConnectorFn[] = []
    connectors.push(abstractWalletConnector())

    export const networks = [abstractTestnet]

    export const wagmiAdapter = new WagmiAdapter({
      connectors,
      projectId,
      networks
    })

    export const config = wagmiAdapter.wagmiConfig

    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks
    })

    export function ContextProvider({ children }) {
      return (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
      )
    }
    ```

    Check our Next.js Wagmi demo in [Github](https://github.com/reown-com/appkit-web-examples/)
  </Tab>
</Tabs>
