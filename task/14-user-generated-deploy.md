# 概要
ユーザーがプロンプトから生成した UI DSL を Vercel にデプロイし、BundleHash を算出するパイプラインを実装する。

# 背景
`docs/product/requirements.md` #8, #20 では、生成 UI を BundleHash で検証し、Vercel で配信するフローが前提となっている。現状はサンプル DSL をローカル表示するのみで、ユーザーの成果物をデプロイする仕組みがない。Vercel Deploy API を利用して、生成 DSL を静的アプリとしてアップロードし、BundleHash を取得して Registry/EIP-712 フローへ引き渡す必要がある。

# やること
- [ ] 生成 DSL を元に静的ビルドを作成するライブラリ/スクリプトを実装する（`/apps/generated/<bundleHash>` など）
- [ ] Vercel Deploy API (`/v13/deployments`) を呼び出し、ユーザー毎の UI をデプロイするサーバルートを追加する
- [ ] デプロイ結果から `deploymentId` と preview URL を返し、BundleHash を計算（path→SHA256 マニフェスト）
- [ ] `/market` などにデプロイ済み UI の preview URL と BundleHash を表示する
- [ ] エラー時のリトライ・進行状況表示を整備する

# 受入基準
- 生成 DSL を送信すると Vercel Preview (もしくは mock) が作成され、BundleHash/preview URL が取得できる
- BundleHash が Issue #13 の Registry 登録フローへ渡る

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/19
- `docs/product/requirements.md` #8, #20
- Vercel Deploy API docs (`/v13/deployments`)
