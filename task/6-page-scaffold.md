# 概要
トップのプロンプト生成画面、トレードページ `/t/[bundleHash]`、マーケットページ `/market` を実装し、UI DSL とデータレイヤを結線する。

# 背景
`docs/product/requirements.md` #3 情報アーキテクチャ と #4 UI/UX 要件 でページ構成が定義されている。最小でも「入力 → UI 表示 → 発注準備」までを成立させ、動くデモを用意する必要がある。

# やること
- [ ] `/page.tsx` にチャット風 UI とサンプル DSL ジェネレータを実装する
- [ ] `/t/[bundleHash]/page.tsx` で DSL を取得しレンダラー経由で表示、Hyperliquid データをバインドする
- [ ] `/market/page.tsx` に登録済み UI (モック) の一覧と詳細モーダルを実装する
- [ ] KPI ステータスバーを設置し、TTV や再接続回数を表示する
- [ ] Tailwind v4 + shadcn で最低限のスタイルを整える

# 受入基準
- 3 ページに遷移でき、エラーが発生しない
- トップでプロンプトを送信するとトレード画面へ遷移し DSL が表示される
- マーケット一覧から UI 詳細 (BundleHash, 作者, Split) を確認できる

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/6
- `docs/product/requirements.md` #3, #4, #20
- `AGENTS.md` 開発ルール
