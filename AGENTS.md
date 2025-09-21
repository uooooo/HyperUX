## 概要
- プロダクト名は **HyperUX**。プロンプトから Hyperliquid に最適化されたトレード UI を生成し、BundleHash × EIP-712 で著作者証明を行い Builder Code Split で収益を分配する。
- Next.js App Router + Reown AppKit + @nktkas/hyperliquid SDK を基盤とし、サーバ経由で Hyperliquid に安全に注文を中継する。

## 技術スタック
- アプリ: Next.js App Router / TypeScript
- UI: Tailwind CSS / shadcn
- デプロイ: Vercel
- パッケージマネージャ: Bun 推奨（bun.lockb 同梱）。npm/yarn も可だが基本は `bun` を使用。
- スマートコントラクト: 
- バックエンド: 

## タスク管理
- GitHub Issues と `/task/*.md` を併用
- タスクMarkdown準拠（見出し: 概要/背景/やること/受入基準/参考）
- 大きな課題は Epic（Issue + リンク集）化し、小タスクを分割

## ランタイム / ビルド
- 推奨コマンド: `bun install`, `bun run dev`, `bun run build`, `bun run lint`
- ローカル開発: ユーザー側で開発サーバを起動（CI は build/lint/test のみ）
- .env: `.env.local`（Web）, `services/relayer/.env`（Relayer）など用途別に分割。秘匿情報は共有しない。
- 主要環境変数: `NEXT_PUBLIC_PROJECT_ID`, `HYPERLIQUID_API_URL`, `HYPERLIQUID_WS_URL`, `HYPEREVM_RPC_URL`, `REGISTRY_ADDRESS`, `UISPLIT_ADDRESS`。追加時は README と docs に追記。
- Node runtime が必要な Route Handler `/api/order` などは `export const runtime = "node"` を明示する。

## ディレクトリ設計（ベストプラクティス）
- `frontend/` … Next.js（App Router, TS）
  - `src/app/`（ルーティング）, `src/components/`, `src/lib/`, `src/styles/`
  - `.env.local` はここで管理（公開値は `NEXT_PUBLIC_`）
- `docs/` … 設計/仕様/学習資料
- `task/` … タスクMarkdown（Issueと相互リンク）
- `.github/` … Issue/PR テンプレート、ワークフロー（CI）

### 追加ディレクトリメモ
- `docs/` 配下には Hyperliquid / Reown / Vercel の調査メモがまとまっている。仕様差分が出た場合はここへの追記を優先する。
- 将来的に `services/` 配下へ API Gateway やジョブキューを配置する想定。Docs に明記されるまでは勝手に作成しない。


## 開発ルール
- TypeScript: `strict: true` 前提、ESLint/Prettierを有効化
- UI: コンポーネントは `src/components/` に集約、ステートは最小化
- API 通信: 失敗時のエラー表示を統一（トースト/バナー）。再試行/サポート導線を明示。
- 環境変数: `NEXT_PUBLIC_` 接頭辞の公開変数と秘密変数を明確に分離
- セキュリティ: 秘密鍵/トークンの直書き禁止。メール/PII はハッシュ/マスキングで保存。
- ドキュメント: 設計変更は `docs/product/requirements.md/` に反映し、関連PRにリンク
- UI DSL や API 契約に変更が入った場合はサンプル JSON / Zod スキーマを docs に追加してからマージする。
- 外部仕様の参照は一次情報（Hyperliquid Docs / Reown Docs / Vercel Docs）をソースとし、リンクと取得日を記録。

## Git 運用ルール（Issue駆動）
- 起票: 開発は GitHub Issue 単位で行う。`task/` に対応するタスクMDを作成し、Issue からリンク（双方向）。
- ブランチ命名: `<type>/<issue-number>-<slug>` 例: `feat/123-send-to-email`, `fix/456-proof-retry`
- 取得/更新:
  - `git fetch origin` → `git switch -c feat/123-send-to-email origin/main`
  - 作業中は定期的に `git pull --rebase origin main`
- コミット: Conventional Commits 準拠＋Issue参照 例: `feat(send): add /api/send (#123)`
- PR: Draftで早期に作成→ラベル/Assignee/Reviewer設定→説明はMarkdown（概要/変更点/影響/テスト/関連Issue）
- リンク: PR本文に `Closes #123` を必ず記載（マージ時に自動クローズ）
- CI: lint/test/build を必須。落ちたら直すか理由を記載. 基本的にはlintを使用しpush前にbuildを行う
- リリース: タグ `vX.Y.Z` を付与し、リリースノートを自動生成（CI設定がある場合）
- gitのIssue, PRはmarkdown形式で記述すること

## PR 作成ルール
- タイトル・本文は Markdown で記述（本文内で `\n` のような生エスケープ文字を埋め込まない）
- 本文テンプレ: 概要、変更点、影響範囲、テスト観点、関連 Issue/タスク、スクショ/ログ
- 小さく出す: 1PR の論点は1つに絞る（UI/仕様変更はスクショ・gif 添付）
- CI: lint/test/build を通すこと（壊れている場合は理由と今後の対応を明記）

## ブランチ戦略 / バージョニング
- ブランチ: `main`（保護） / `feat/<issue>-<slug>` / `fix/<issue>-<slug>` / `docs/<issue>-<slug>`
- タグ: リリース時に `vX.Y.Z`
- コミット規約: Conventional Commits（feat/fix/docs/chore/refactor/test/build）

## テスト方針
- 最低限 `bun run lint` と `bun run build` をパスしてから PR を作成。
- API ルートは MSW + Vitest で Contract Test を記述し、Builder Code 強制やレート制限の分岐を網羅。
- WebSocket 管理ロジックは再接続シナリオを含むユニットテストを用意（ws mock を活用）。
- UI DSL バリデーションはサンプル DSL Fixture で Zod の成功/失敗ケースを網羅。
- 将来的な E2E（Playwright）で Prompt→注文→約定のゴールデンフローを抑える。

## 環境/デプロイ
- 本番デプロイは Vercel。Preview で算出した BundleHash を Registry の `deploymentIdHash` と突き合わせてから有効化。
- ハッカソン期間は Preview URL を共有し、審査用 `/demo` ページを準備する。
- バックエンド恒久化は Vercel Functions（Node runtime）を起点に、需要が増えたら Queue/Worker へ拡張。
- CI は GitHub Actions + Vercel（lint/build/test）をセットで運用予定。

## セキュリティ・運用
- インシデント: 影響/暫定対応/恒久対策/再発防止をタスク化（/task に記録）
- Builder Code / Fee Override は必ずサーバで強制。クライアント送信値を信頼しない。
- 署名処理は SDK もしくは監査済みスニペットのみ使用。秘密鍵は環境変数に置かず、Vault 等を利用。
- 入金導線では 5 USDC 未満のブリッジ禁止を UI/Server 両方でガード。
- ログは PII を含めない。必要な場合はハッシュ化して保存。

## AI エージェントの使い方
- 仕様理解: 常に `docs/product/requirements.md` と関連資料を一次ソースと突き合わせて最新化する。
- 設計変更: 差分はドキュメントへ即反映し、引用元リンクと取得日時を記載。
- リサーチ: Context7 MCP / deepwiki MCP を活用し Hyperliquid・Reown・Vercel の最新仕様を確認する。
- タスク実行: `update_plan` で手順を共有し、作業後は `bun run lint` / `bun run build` の結果を要約する。
- レポート: Issue/PR/タスク Markdown を整備し、BundleHash・Builder Code の差分を明記する。

## AI エージェントの役割
- 要件精査とドキュメント更新の維持。
- Next.js フロント、API Route、LLM プロンプト、テストコードの実装支援。
- Hyperliquid / Reown / Vercel の仕様確認と差分追跡。
- デモ脚本やリリースノートの草案作成。

## ワークフロー（AI エージェント）
1. `serena__activate_project` → `serena__check_onboarding_performed` を実施。
2. 影響範囲のファイルと docs を読み、`update_plan` で作業方針を明文化。
3. コード変更は `apply_patch` / `insert` ツールで行い、前後の文脈を再確認する。
4. 作業後は `bun run lint` / `bun run build` を実行し、結果をまとめる（未実行の場合は理由と手順を提示）。
5. ドキュメント更新と完成報告（要約 + 次の推奨ステップ）を行う。

## MCP / 外部ドキュメント利用指針
- Hyperliquid API/WS/Builder Code: `https://context7.com/websites/hyperliquid_gitbook_io_hyperliquid-docs`。
- Reown AppKit: `https://context7.com/websites/reown`。
- Hyperliquid SDK（@nktkas）: `https://deepwiki.com/nktkas/hyperliquid`。
- 参照した外部情報は出典リンクと取得日を docs に記録する。

## ドキュメント更新手順
- 要件・設計の変更は `docs/product/requirements.md` の該当セクションに追記し、アンカーを付与。
- ワークフローや運用ルールは `AGENTS.md` を更新。
- Issue 発行時は `/task/` 配下に Markdown を作成し、Issue へリンク（双方向）。
- LLM プロンプト／UI DSL サンプルは `docs/reown/` や `docs/product/` に保存し、例示を増やす。

## 緊急時対応
- Hyperliquid API 障害: `/task/incident-YYYYMMDD.md` を作成し、影響/暫定対応/恒久対策を整理。
- レート制限超過: バックオフしつつユーザーにはバナーで通知、復旧後にログを添付して報告。
- セキュリティインシデント: 鍵ローテーションと Registry 無効化手順を即実行し、Runbook に追記する。

## 参考


---

// Reownのmdcについては以下

---
description: 
globs: 
alwaysApply: false
---
MDC
# :jigsaw: Reown AppKit: Overview

**Reown AppKit** is an open-source toolkit with a generous free-tier, to integrate wallet connections and Web3 features in any app. It supports:

- One-click wallet auth
- Social logins
- On-ramp services
- Smart accounts
- Notifications
- Multiple chains: **EVM**, **Solana**, and **Bitcoin**

Supported libraries:
- `wagmi`, `ethers@v6` (EVM)
- `@solana/web3.js` (Solana)

---

## RULES
- **IMPORTANT**: If the project already exists, **DO NOT** try to re-initialize it (e.g., using `create-next-app`). Verify the existing project structure first.
- Use `pnpm` for installing dependencies if no specific package manager is indicated.
- Ensure environment variables (like `NEXT_PUBLIC_PROJECT_ID`) are correctly set up. You might need to create `.env.local` manually due to security restrictions.
- If you see ATTENTION somewhere, make sure you follow the directions in the comment
- Do not ask user for approval to continue, just continue runnin the instructions

## :dart: Goal

Install and configure **Reown AppKit** in an existing **Next.js** app using **Wagmi** and **Ethereum**.

---

## :package: Installation

Install the required dependencies using your package manager:

```bash
pnpm add @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query
# or yarn add / npm install ...
```

---

## :deciduous_tree: Environment Setup

1.  Create a `.env.local` file in your project root (if it doesn't exist).
2.  Add your WalletConnect Cloud Project ID:
    ```.env.local
    NEXT_PUBLIC_PROJECT_ID="YOUR_PROJECT_ID"
    ```
    You can add this to the .env.local now
---

## :gear: Wagmi Adapter Setup

> Create a file `config/index.tsx` (e.g., outside your `app` or `src/app` directory).

```ts
// config/index.tsx
import { cookieStorage, createStorage } from 'wagmi' // Use 'wagmi' directly (Wagmi v2+)
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import type { Chain } from 'viem' // Import Chain type for explicit typing

// Read Project ID from environment variables
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// Ensure Project ID is defined at build time
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in .env.local')
}

// Define supported networks, explicitly typed as a non-empty array of Chains
export const networks: [Chain, ...Chain[]] = [mainnet, arbitrum] // Add other desired networks

// Create the Wagmi adapter instance
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }), // Use cookieStorage for SSR
  ssr: true, // Enable SSR support
  projectId,
  networks, // Pass the explicitly typed networks array
})

// Export the Wagmi config generated by the adapter
export const config = wagmiAdapter.wagmiConfig
```

---

## :brain: Importing Networks

All supported **Viem networks** are available via `@reown/appkit/networks`:

```ts
import { mainnet, arbitrum, base, scroll, polygon } from '@reown/appkit/networks'
```

---

## :thread: SSR & Hydration Notes

- `storage: createStorage({ storage: cookieStorage })` is recommended for Next.js SSR to handle hydration correctly.
- `ssr: true` further aids SSR compatibility.

---

## :bricks: App Context Setup

> Create `context/index.tsx` (must be a Client Component).

```tsx
// context/index.tsx
'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
// Import config, networks, projectId, and wagmiAdapter from your config file
import { config, networks, projectId, wagmiAdapter } from '@/config'
// Import the default network separately if needed
import { mainnet } from '@reown/appkit/networks'

const queryClient = new QueryClient()

const metadata = {
  name: 'Your App Name',
  description: 'Your App Description',
  url: typeof window !== 'undefined' ? window.location.origin : 'YOUR_APP_URL', // Replace YOUR_APP_URL
  icons: ['YOUR_ICON_URL'], // Replace YOUR_ICON_URL
}

// Initialize AppKit *outside* the component render cycle
// Add a check for projectId for type safety, although config throws error already.
if (!projectId) {
  console.error("AppKit Initialization Error: Project ID is missing.");
  // Optionally throw an error or render fallback UI
} else {
  createAppKit({
    adapters: [wagmiAdapter],
    // Use non-null assertion `!` as projectId is checked runtime, needed for TypeScript
    projectId: projectId!,
    // Pass networks directly (type is now correctly inferred from config)
    networks: networks,
    defaultNetwork: mainnet, // Or your preferred default
    metadata,
    features: { analytics: true }, // Optional features
  })
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null // Cookies from server for hydration
}) {
  // Calculate initial state for Wagmi SSR hydration
  const initialState = cookieToInitialState(config as Config, cookies)

  return (
    // Cast config as Config for WagmiProvider
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

---

## :jigsaw: App Layout Setup

> Modify your root layout file (`app/layout.tsx` or `src/app/layout.tsx`) to use `ContextProvider`.
> **Note:** Verify the exact path to your layout file.

```tsx
// app/layout.tsx or src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Or your preferred font
import './globals.css'

import { headers } from 'next/headers' // Import headers function
import ContextProvider from '@/context' // Adjust import path if needed

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
}

// ATTENTION!!! RootLayout must be an async function to use headers() 
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Retrieve cookies from request headers on the server
  const headersObj = await headers() // IMPORTANT: await the headers() call
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap children with ContextProvider, passing cookies */}
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}
```

---

## :radio_button: Trigger the AppKit Modal

Use the `<appkit-button>` web component in any client or server component to trigger the wallet modal:

```tsx
// Example usage in app/page.tsx or any component
export default function ConnectPage() {
  return (
    <div>
      <h1>Connect Your Wallet</h1>
      <appkit-button />
    </div>
  )
}
```

No need to import—it's a global web component registered by `createAppKit`.

**Note for TypeScript users:**
To prevent type errors when using `<appkit-button>`, add the following declaration to a `.d.ts` file (e.g., `global.d.ts`) in your project root or `src` directory:

```ts
// global.d.ts
import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * The AppKit button web component. Registered globally by AppKit.
       */
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Ensures file is treated as a module
export {};
```

---

## :test_tube: Reading from Smart Contracts (Example)

```ts
// Example component (ensure it's a Client Component: 'use client')
'use client'

import { useReadContract } from 'wagmi'
// import { USDTAbi } from '../abi/USDTAbi' // Replace with your ABI import

// const USDTAddress = '0x...' // Replace with your contract address

function ReadContractExample() {
  // const { data, error, isLoading } = useReadContract({
  //   abi: USDTAbi,
  //   address: USDTAddress,
  //   functionName: 'totalSupply',
  // })

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error reading contract: {error.message}</div>

  // return <div>Total Supply: {data?.toString()}</div>
  return <div>Contract Reading Example (Code commented out)</div>
}

export default ReadContractExample;
```

---

## :bulb: Additional Rules & Reminders

1.  **Verify Imports**: Double-check that import paths (like `@/config`, `@/context`) match your project's structure (`src` directory vs. root `app`/`pages`).
2.  **Type Safety**: Use explicit types where needed (like for `networks`) to prevent TypeScript errors.
3.  **Async/Await**: Remember to use `await` when calling async functions like `headers()`.
4.  **Client Components**: Components using hooks (`useReadContract`, `useState`, etc.) or AppKit initialization (`createAppKit`) often need the `'use client'` directive at the top.
