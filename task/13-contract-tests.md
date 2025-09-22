# 概要
Issue #14 「Post-#6: Contract test scaffolding + MSW/Vitest」の詳細タスク。`/api/order` の Contract Test と WebSocket マネージャの再接続テストを整備する。

# やること
- [ ] MSW (REST/WS) で Hyperliquid API をモックし、注文成功/失敗ケースを網羅したテストを作成
- [ ] `ws-manager` の再接続・心拍ロジックを Vitest で検証する
- [ ] テスト環境用の `bun test` スクリプトを追加し、CI で lint/build/test が通るようにする
- [ ] 主要ユーティリティ (size quantization など) のユニットテストを追加
- [ ] テストガイドラインを `docs/product/requirements.md` に追記

# 受入基準
- `bun test` でテストが実行でき、CI で lint/build/test が成功する
- `/api/order` Contract Test で builder fee/price guard/idempotency をカバーする

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/14
- `frontend/src/app/api/order/route.ts`
- `frontend/src/lib/hyperliquid/ws-manager.ts`
