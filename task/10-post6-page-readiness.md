# 概要
Issue #11 のフォローとして、ページ足場 (#6) を PR マージ後にチェックリスト化し、残タスクの洗い出しと引き継ぎを整理する。

# 背景
Issue #11 "Scaffold pages and UI flow" は #6 の進捗確認用途として作成した。マージ後に不足点を棚卸しし、次の Issue (#16〜#18) へ引き継ぐドキュメントが必要。

# やること
- [x] PR #15 マージ後の smoke test（Home → Trade、Market）
- [x] 既知の TODO (LLM, Hyperliquid binding, UI polish) を整理して共有
- [x] README/タスク一覧を更新し、関係者へ連絡

# 受入基準
- ページ遷移の確認結果と残課題が Issue コメントにまとまる
- 次タスク (#16〜#18) の優先度が共有される

# 実施メモ
- `bun run lint` / `bun run build` ✅
- Home → Trade → Market ナビゲーション確認 ✅
- README を更新し、優先タスク一覧（#16〜#18, #12, #13, #14）を明記 ✅

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/11
- PR: https://github.com/uooooo/HyperUX/pull/15
