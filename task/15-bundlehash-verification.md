# 概要
Vercel にデプロイされた生成 UI から BundleHash／deploymentId を取得し、Registry/EIP-712 登録と突合する仕組みを整える。

# 背景
Issue #19 でユーザー UI をデプロイできるようにした後、`docs/product/requirements.md` #8 で定義された BundleHash 証跡を維持する必要がある。Vercel からビルドアーティファクトをダウンロードしてハッシュ化し、Registry に登録された `deploymentIdHash` と一致するかを検証するフェーズが未実装。

# やること
- [ ] Vercel Files API からビルドファイル一覧を取得し、path→SHA256 マニフェストを生成する
- [ ] マニフェスト JSON をソートし、最終的な BundleHash（SHA256）を計算するユーティリティを実装
- [ ] Registry から取得した `deploymentIdHash` と比較し、UI 一覧に検証結果を表示する
- [ ] 検証フローを CLI or サーバルートとして提供し、Webhook 連携（任意）を検討する

# 受入基準
- Vercel デプロイ済みの UI について、BundleHash が計算され Registry 上の値と一致することを確認できる
- `/market` などに検証ステータス（Verified/Unverified）が表示される

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/20
- `docs/product/requirements.md` #8
- Vercel Files API (`/v13/deployments/{id}/files`)
