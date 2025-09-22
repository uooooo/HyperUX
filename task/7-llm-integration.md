# 概要
Home ページのチャット UI を LLM につなぎ込み、プロンプトから UI DSL を生成して `/t/[bundleHash]` へ遷移できるようにする。

# 背景
`docs/product/requirements.md` #5 生成エンジン要件 で、プロンプト→UI DSL 生成がコア要件として定義されている。現在はサンプル DSL を選択するだけの足場状態のため、LLM 呼び出しと DSL 正規化・保存のパイプラインが必要。

# やること
- [ ] LLM 呼び出し API（OpenAI / Anthropic / Azure いずれか）をサーバルートとして実装する
- [ ] プロンプトと few-shot コンテキストを整備し、UI DSL JSON を生成する
- [ ] 生成結果を `uiDslSchema` で検証し、失敗時にフィードバックを返す
- [ ] 成功時に BundleHash を発行し、UI DSL をフロント側ストレージ (Session または API) に保存する
- [ ] `/t/[bundleHash]` に遷移し、生成 DSL をレンダリングする

# 受入基準
- Home でプロンプトを送信すると、LLM 生成 DSL が検証を通過した場合 `/t/[bundleHash]` に遷移し UI が表示される
- DSL 検証に失敗した場合、エラーメッセージが表示され再試行できる

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/15
- `docs/product/requirements.md` #5, #9
- `docs/product/order-relay-notes.md`
