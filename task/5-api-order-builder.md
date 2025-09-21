# 概要
`/api/order` Route Handler を実装し、BundleHash と Builder Code をサーバ側で強制しつつ Hyperliquid への注文を中継する。

# 背景
`docs/product/requirements.md` #22 `/api/order` 詳細設計 に具体的な挙動が定義されている。安全な注文フローを成立させ、ハッカソンでのデモに備える。

# やること
- [ ] Route Handler (`app/api/order/route.ts`) を Node runtime で実装する
- [ ] リクエストボディおよびヘッダ (`x-bundle-hash`, `x-wallet-address`, `x-idempotency-key`) を検証する
- [ ] Registry 参照 (当面モック) から `splitAddress` と `fMax` を取得する
- [ ] Builder Code と Builder Fee をサーバ側で上書きし、Hyperliquid SDK を呼び出す
- [ ] エラー分類と監査ログ出力を実装する

# 受入基準
- 正しい入力で Hyperliquid に注文が転送されレスポンスが返る
- 不正な BundleHash や Fee を送ると 403 エラーになる
- 同じ Idempotency-Key を再送すると二重実行を防止できる

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/5
- `docs/product/requirements.md` #7, #22
- `docs/hyperliquid/API/Signing.md`
