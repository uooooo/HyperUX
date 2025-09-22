# 概要
Issue #12 「Post-#6: Vercel deploy + Env wiring」の詳細タスク。Vercel でのデプロイ、環境変数設定、/demo ページ追加を行う。

# やること
- [ ] Vercel プロジェクトを作成し、GitHub ブランチを接続する
- [ ] 必要な env (`NEXT_PUBLIC_PROJECT_ID`, `NEXT_PUBLIC_HYPERLIQUID_*`, `HYPERLIQUID_API_PRIVATE_KEY` など) を設定
- [ ] Preview/Prod で Home/Trade/Market が正しく動作することを確認
- [ ] デモ共有用 `/demo` ページを作成、審査チェックリストを反映
- [ ] README にデプロイ手順と Preview URL を追記

# 受入基準
- Vercel Preview/Production へアクセスし、主要フローが動作する
- `.env` テンプレートと README に環境変数一覧が整備される
- `/demo` ページが審査用に利用できる

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/12
- `docs/product/requirements.md` #20 デプロイ要件
