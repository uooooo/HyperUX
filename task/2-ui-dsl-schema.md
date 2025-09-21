# 概要
UI DSL の Zod スキーマとレンダラーを実装し、生成 JSON から UI コンポーネントを描画できるようにする。

# 背景
`docs/product/requirements.md` の #19 UI DSL 詳細仕様 に主要コンポーネントと制約が定義されている。ここを固めることで、LLM 出力の検証やトレード画面の構築が可能になる。

# やること
- [x] `src/lib/ui-dsl/schema.ts` に Zod スキーマとデフォルト値を実装する
- [x] スキーマ由来の型を `src/lib/ui-dsl/types.ts` としてエクスポートする
- [x] `src/components/ui-dsl/` にカードごとのプレースホルダー TSX を配置する
- [x] `renderer` コンポーネントで layout 配列に従い描画する
- [x] サンプル DSL を用意し、`/t/[bundleHash]` ページでレンダリングを確認する

# 受入基準
- 未知コンポーネントや不正プロパティがバリデーションではじかれること
- サンプル DSL を読み込んだページで OrderPanel / RiskCard などが表示されること
- TypeScript strict モードで型エラーが発生しないこと

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/2
- `docs/product/requirements.md` #19, #24
