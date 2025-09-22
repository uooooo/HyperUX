# 概要
トレードページ `/t/[bundleHash]` の UI コンポーネントに実データを接続し、注文ボタンから `/api/order` を実行できるようにする。

# 背景
Issue #5 で `/api/order` が実装済み。Issue #6 では UI の足場のみで、リアルタイムデータ取得や注文実行は未接続。`docs/product/requirements.md` #4 UI/UX 要件・#6 外部API/SDK 仕様に従い、Hyperliquid REST/WS を通じて DSL コンポーネントへデータを供給し、OrderPanel から注文を送信できるようにする必要がある。

# やること
- [ ] `ws-manager` を使って必要なマーケットデータ (価格、建玉、Funding 等) を購読し、コンテキストで管理する
- [ ] `UiDslRenderer` が提供する各カードにデータを流し込むための props/adapter を実装する
- [ ] OrderPanel の CTA から `/api/order` を呼び出し、成功/エラーをトーストで表示する
- [ ] KPI バーの再接続回数や TTV を実データベースで更新する
- [ ] 基本的なエラーハンドリングとローディング状態を整備する

# 受入基準
- `/t/[bundleHash]` で価格・Funding 等がリアルタイム更新される
- OrderPanel でサイズ/価格を入力して送信すると `/api/order` へリクエストされ、成功時に結果が表示される
- WebSocket 切断時に UI が警告を表示し、KPI バーの再接続回数が更新される

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/17
- `docs/product/requirements.md` #4, #6
- `frontend/src/lib/hyperliquid/ws-manager.ts`
- `frontend/src/app/api/order/route.ts`
