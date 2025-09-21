# 概要
Hyperliquid の REST/WS クライアントと状態管理レイヤーを実装し、ポジションや価格データをアプリ全体で共有できるようにする。

# 背景
`docs/product/requirements.md` #17 システムアーキテクチャ と #21 状態管理とデータ取得 で、TanStack Query と単一 WebSocket マネージャを使う方針が定義されている。リアルデータが動く UI の基盤として優先度が高い。

# やること
- [x] `@nktkas/hyperliquid` を導入し、REST/WS クライアント初期化ユーティリティを `src/lib/hyperliquid/` に作成する
- [x] TanStack Query で positions / balances / funding を取得する hooks を実装する
- [x] WebSocket マネージャを実装し、subscribe / unsubscribe / resubscribe と指数バックオフを備える
- [x] 受信イベントを UI DSL コンポーネントへブロードキャストできる仕組み（listeners）を整備する
- [x] 再接続時に Query キャッシュを利用して UI を劣化させず復旧できるか確認する

# 受入基準
- 指定マーケットの ticker がリアルタイムに更新されるハンドラを用意できていること
- WebSocket を切断しても指数バックオフで再接続する実装が存在すること
- 取得したデータを Query キャッシュ経由でカードコンポーネントから参照できる形で提供していること

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/3
- `docs/product/requirements.md` #17, #21
- `docs/hyperliquid/API/Websocket.md`
