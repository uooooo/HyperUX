# 概要
Issue #13 「Post-#6: On-chain Registry + EIP-712 flow」の詳細タスク。BundleHash / EIP-712 署名から Registry 登録、UISplit 反映までを実装する。

# やること
- [ ] EIP-712 タイプ定義とバリデーション実装
- [ ] サーバ側で署名検証→Registry 書き込みを行うルート（stub → 本実装）
- [ ] UI から署名ダイアログを表示し、登録フローを通せるようにする
- [ ] UISplit アドレス・builder fee の管理画面を追加（MVP）
- [ ] 登録結果が `/market` や `/t/[bundleHash]` で参照できるようにデータ取得パスを更新

# 受入基準
- 新規 bundle の署名→登録→マーケット反映まで一貫して動作する
- 失敗時にエラーが明示され、再試行できる

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/13
- `docs/product/requirements.md` #8 EIP-712 登録
- `docs/product/order-relay-notes.md`
