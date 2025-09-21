# 概要
Reown AppKit と Wagmi を導入し、SSR 対応の ContextProvider と共通ヘッダーを実装する。

# 背景
`docs/product/requirements.md` #4.3 共通ヘッダー と #17.2 クライアント に、ウォレット接続と Bridge 導線を含む UI 要件がまとめられている。`AGENTS.md` に記載された環境変数の整備も合わせて実施する。

# やること
- [x] AppKit / Wagmi / TanStack Query の依存を追加する
- [x] WagmiAdapter の初期化と `NEXT_PUBLIC_PROJECT_ID` 検証を行う `config` を作成する
- [x] `context/index.tsx` で QueryClientProvider + WagmiProvider + AppKit 初期化を実装する
- [x] `app/layout.tsx` を async 版に更新し、`headers()` から cookie を読み込んで ContextProvider に渡す
- [x] ウォレット接続ボタンと Bridge リンクを含むヘッダーコンポーネントを追加する

# 受入基準
- ローカルでウォレット接続が成功し、再読み込み後も接続状態が保持される
- ヘッダーから Hyperliquid Bridge へのリンクが表示される
- 未設定の `NEXT_PUBLIC_PROJECT_ID` でビルドするとエラーが発生し、警告が表示される

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/4
- `docs/product/requirements.md` #4.3, #17
- `docs/reown/reown-Installation.md`
- `AGENTS.md` ランタイム / ビルド
