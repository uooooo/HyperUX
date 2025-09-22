# 概要
Delta Neutral Monitor のダッシュボードに実データ（Hyperliquid + Redstone）とチャートを接続し、ポジションのヘッジ調整を行えるようにする。

# 背景
Issue #17 の派生タスク。ETH Scalping と BTC DCA については UI から `/api/order` を介した実注文が可能になったが、Delta Neutral Monitor は依然としてモック値のまま。`docs/product/requirements.md` #4 UI/UX 要件と #6 外部API/SDK 仕様では、ポジション管理・Funding 表示・再平衡トリガの実装が必須とされている。また ETH scalping 用チャートは仮置きのままのため、軽量チャートの導入をこのタスクでまとめて扱う。

# やること
- [ ] `DeltaNeutralDashboardCard` に Hyperliquid ポジション情報をバインドし、spot/perpの delta・PnL・Funding をリアルタイム表示する
- [ ] 再平衡／クローズ操作から `/api/order` を呼び出せるようにし、両建てのサイズ計算ユーティリティを追加する
- [ ] Redstone を用いたスポット価格フォールバックを実装し、価格乖離が大きい場合に警告バナーを表示する
- [ ] Lightweight Charts を導入し、Scalper/DeltaNeutral 双方で簡易チャートを表示できるチャートコンポーネントを実装する
- [ ] KPI バーへ Delta Neutral 再接続統計・Funding APR を反映できるようフックを拡張する

# 受入基準
- Delta Neutral ダッシュボードがライブデータで更新され、再平衡・クローズボタンからサーバ経由の注文が成功する
- 価格データが取得できない、または大きく乖離している場合にユーザーへ警告が表示される
- `/t/[bundleHash]` の ETH Scalping と Delta Neutral カードでチャートが実際の価格を描画する

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/17
- `docs/product/requirements.md` #4, #6, #21
- `frontend/src/components/ui-dsl/cards.tsx`
- `frontend/src/lib/hyperliquid/hooks.ts`
