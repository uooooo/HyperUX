ここでは**ハッカソン〜最初の公開**まで迷いなく実装できるレベルの**完全な要件定義**をまとめます。
技術選定（Next.js + Reown AppKit + @nktkas/hyperliquid）と、\*\*作者証明＋収益分配（Builder Code×Split）\*\*を前提に記述します。要点は一次情報で裏取り済みです（Hyperliquid の API/WS/レート制限/署名・Builder Codes・Bridge、Reown / AppKit）。 ([Hyperliquid Docs][1])

---

# 0. プロジェクト概要

* 名称（仮）：**HyperUX**
* 目的：**プロンプト→UI生成→実発注**をワンフロー化。ユーザーの戦略に最適化されたトレードUIを**数秒で生成**し、**Hyperliquid**にて実行。
* コア差別化：

  * 生成UIは**ハッシュ（BundleHash）**で検証。作者は**EIP-712署名**＋**Registry**で帰属を主張。
  * ユーザーが作成したフロントを公開し、それを他のユーザーが使用することと作成者に収益が分配される。
    * 実発注は**サーバ経由**で **Builder Code の `b`/`f` を強制付与**。分配先は**Splitコントラクト**で自動按分。 ([Hyperliquid Docs][2])
  * 非開発者のユーザー自身が取引戦略などに応じて個別最適化したUXを生成することができる。
    * 欲しいボタンや情報をカスタマイズ可能

---

# 1. スコープ

## 1.1 In scope（MVP）

* **ページ/機能**

  1. **トップ：チャットUI生成**（プロンプト→UI DSL）
  2. **個別トレード画面**（生成UIのレンダ＋実発注）
  3. **マーケットプレイス**（登録済み作品の一覧/詳細）
  4. **共通ヘッダー**（ウォレット接続、ブリッジ導線、アカウント）
* **外部統合**

  * Hyperliquid **REST/WS**（板・建玉・FR・注文系） ([Hyperliquid Docs][3])
  * **Builder Codes**（ユーザーが上限承認、注文毎に `b`/`f` 指定可能） ([Hyperliquid Docs][2])
  * **Reown AppKit（WalletConnect後継）＋**でウォレット接続（Arbitrum USDC 入金のため） ([docs.reown.com][4])
  * **ブリッジ導線**（Hyperliquid ネイティブ Bridge/Bridge2、推奨：Arbitrum USDC→HL入金） ([Hyperliquid Docs][5])
* **作者証明/分配**

  * **BundleHash**（ビルド成果物の内容ハッシュ）を算出
  * **EIP-712 署名**→ \*\*Registry（HyperEVM）\*\*へ登録
  * **UISplit**（受け口）に対し Builder Code の `b` を固定付与

## 1.2 Out of scope（MVP外）

* 永続DB（Supabase/Postgres）。一覧は**Registryイベント走査**で代替
* マルチチェーン本格対応、KPIのサーバ保存、自動A/B
* 完全オンチェーンUI保管（CIDメタのみ）

---

# 2. ペルソナと主要ユースケース

* **DCA初心者**：`“BTC 100$/week, auto DCA, alert if FR>0.1%”` → 低情報密度UI・安全ガード
* **デイトレーダー**：`“ETH 3x scalp, TP 0.5%, SL 0.3%”` → 1クリック発注＋ホットキー
* **裁定-アービトラージ**: `BTC/USDCとBTC/USDTのアービトラージ, 複数の取引所間でのアービトラージ` → 価格データ(hyperliquid上もしくはbinanceなどのCEX)や注文ボタンを表示 
* **機関**（将来）：複数銘柄・板深度・リスクカード
* 他にも良さげなユースケースが必要

共通 KPI：**TTV（入力→有効発注まで秒）**、**クリック数**、**ガード作動数**、**WS再接続回数**。

---

# 3. 情報アーキテクチャ（ルーティング）

* `/` … チャット生成（Prompt→UI DSL）
* `/t/[bundleHash]` … 個別トレード画面（BundleHash でレンダ）
* `/market` … 作品一覧（Registry イベントから取得）
* `/api/order` … 発注中継（Builder Code 強制）
* `/api/deploy` … Vercel 自動デプロイ（運営側）
* `/api/registry/*` … Registry 照会（読取）

---

# 4. UI/UX 要件

## 4.1 チャット生成（トップ）

* 入力：自然言語戦略
* 出力：**UI DSL(JSON)**＋**ライブプレビュー**
* 構成：`OrderPanel | RiskCard | FundingCard | PnLCard | Chart | Alerts` の有限集合
* 今回は実装しないもの: **差分パッチ**：追加入力で局所更新（再生成で画面破壊しない）チャット入力欄のモックだけ設置。

## 4.2 個別トレード画面

* 初回ロード：RESTで**スナップショット**、ハイドレーション後 **WS購読**へ移行
* 重要可視：価格/FR/建玉/未実現PnL/清算価格
* **事故防止**：証拠金比率・レバ上限・スリッページ上限・二段確認
* **WS劣化**：切断時は灰色化＋発注ボタン無効

## 4.3 共通ヘッダー

* **ウォレット接続**（Reown AppKit + ）
* **入金導線**：

  * Arbitrum USDC → **HL Bridge**導線（**最小5 USDC**注意喚起） ([Hyperliquid Docs][5])
  * deBridgeへの統合

## 4.4 マーケットプレイス

* ソート：作成日/人気（DL数/いいねはMVP外）
* 詳細：プレビュー、作者、**Split比率表示**、**デプロイURL**（Previewは不変URL） ([Hyperliquid Docs][7])

---

# 5. 生成エンジン（LLM）要件

* **System Prompt 制約**：

  * 利用可能コンポーネントは固定集合のみ（要検討）
  * **実行は必ず確認を要求**、危険レバ/矛盾（資金<必要証拠金）点は出力しない
* **出力形式**：UI DSL（Zod で strict validate）
* **キャッシュ**：同一/類似プロンプト→DSL を再利用
* **few-shot**：DCA/スキャル/ヘッジ/複数口座などデモ用のコアユースケース 4例

---

# 6. 外部API/SDK 仕様

## 6.1 Hyperliquid API

* **WebSocket**：`wss://api.hyperliquid.xyz/ws`（Testnet: `…-testnet…`）で価格/FR/約定等を購読。**WS 経由のPOST**も可能（Info/Exchange） ([Hyperliquid Docs][3])
* **REST**：`/info`（500件上限の時間系はカーソル継続）、`/exchange`（発注/キャンセル等） ([Hyperliquid Docs][7])
* **レート制限**：**1200 weight/分/IP**、`exchange`重み＝`1 + floor(batch_length/40)`。指数バックオフ＆合流必須。 ([Hyperliquid Docs][8])
* **署名**：**SDK推奨**（自前実装は誤りやすい）。**API Wallet**発行ページあり。 ([Hyperliquid Docs][9])
* **SDK**：`@nktkas/hyperliquid`（TypeScript）。HTTP/WS 両対応。 ([GitHub][10]), (https://deepwiki.com/nktkas/hyperliquid)

## 6.2 ウォレット/入金

* **Reown AppKit** で EVM ウォレット接続（Arbitrum USDC の入金操作） ([docs.reown.com][4])
* **ブリッジ**：Hyperliquid の **Bridge/Bridge2** 仕様を案内（**5 USDC 未満は失われる**注意） ([Hyperliquid Docs][5])

---

# 7. サーバ/API 設計（Next.js App Router / Nodeランタイム）

## 7.1 `/api/order`（発注中継）

* 入力：`{ orders: [...], f?: number }`、ヘッダ `x-bundle-hash`
* 処理：

  1. Registry から **splitAddress** を照会
  2. Builder Code 強制：`b=splitAddress`、`f=min(f, fMax)`
  3. **Idempotency-Key** で重複拒否（30–60秒）
  4. HL REST（または WS POST）へ送信
* 出力：HLのレスポンスを透過返却
* 失敗時：**分類**（検証/認可/レート/ネット/サーバ）＋再試行指針

## 7.2 `/api/deploy`（運営のみ）

* 入力：静的ファイル群（path/sha/size）
* 処理：Vercel REST ワークフロー（**ファイルSHA→/v2/files→/v13/deployments**）。**プレビューURLは不変**。 ([Hyperliquid Docs][1])
* 出力：`{ deploymentId, url }`

## 7.3 `/api/registry/*`

* `GET /registry/:bundleHash`：creator/split/deploymentIdHash 等
* `POST /registry/register`：EIP-712 メッセージ＋署名をブロードキャスト（HyperEVM へ）

---

# 8. 作者証明＆分配（仕様）

## 8.1 BundleHash

* 生成物（`.vercel/output/static` または `.next/static`）の\*\*(path→SHA256)\*\* マニフェストを**キー順JSON化→SHA256**＝**BundleHash**（決定的）。

## 8.2 EIP-712 登録

* メッセージ：`bundleHash, deploymentIdHash, split, modelVersionHash, createdAt`
* 登録先：**Registry**（HyperEVM）。**未登録の bundleHash**のみ可。

## 8.3 分配

* **UISplit**（pull型）にシェア（例：作者80/運営20）。
* 実発注は**必ずサーバ経由**とし、**`b=UISplit`** を強制付与。ユーザーは**最大ビルダーフィー**を承認し、**いつでも撤回可**。 ([Hyperliquid Docs][2])

---

# 9. データ契約（UI DSL / バリデーション）

* **Zod スキーマ（例）**

```ts
const UI = z.object({
  layout: z.array(z.enum(["OrderPanel","RiskCard","FundingCard","PnLCard","Chart","Alerts"])).min(1),
  OrderPanel: z.object({
    market: z.string(), side: z.enum(["buy","sell"]),
    leverage: z.number().min(1).max(25),
    sizeUsd: z.number().positive(),
    orderType: z.enum(["market","limit"]),
    tpPct: z.number().min(0).max(10).optional(),
    slPct: z.number().min(0).max(10).optional()
  }).optional(),
  // …各カード
});
```

* **検証**：TP/SL の %／価格形式の整合、銘柄存在、必要証拠金 ≤ 残高 等。
* **不正時フォールバック**：未知コンポーネント→`InfoCard`（修正ヒント表示）。

---

# 10. 非機能要件

## 10.1 セキュリティ

* 発注は**サーバ必須**。クライアントの `b/f` は**無視**しサーバで上書き。
* **CSP/SRI**：主要静的ファイルは SRI 付与。
* **監査ログ**：入力プロンプト/生成DSL/発注レスを匿名化で保持（MVPはクライアントDLでも可）。

## 10.2 パフォーマンス

* 初回表示：**SSRスナップショット**→クライアントで **WS 購読切替**。
* **WS合流**：同一銘柄は1購読を複数パネルに配信。IntersectionObserverで**視界外購読停止**。
* **REST 合流**：同一キーの同時リクエストは coalescing。
* **レート制限**：1200 weight/分/IP を遵守（指数バックオフ、バッチ）。 ([Hyperliquid Docs][8])

## 10.3 可用性

* WS切断時は**灰色劣化**＋発注無効。自動再接続（指数バックオフ＋ジッター）。
* Info系のページング（500要素上限）は**カーソル継続**で実装。 ([Hyperliquid Docs][7])

## 10.4 テレメトリ

* 画面下 KPI バー（TTV/クリック/再接続/ガード）。
* （任意）Sentry 等でエラー収集。

---

# 11. テスト計画（受入基準）

* **ユニット**：UI DSL バリデーション、注文ペイロード整形、Builder Code 強制付与
* **統合**：

  * 生成→レンダ→WSライブ→成行・指値→約定確認（Testnet）
  * WS切断→劣化→再接続の回復
  * レート制限を模擬し指数バックオフが働く
* **E2E**：

  * Arbitrum USDC を少額ブリッジ→HL 口座反映（**5 USDC 未満の警告**表示確認） ([Hyperliquid Docs][5])
  * **BundleHash 署名→Registry 登録→/t/\[bundleHash] 発注**
  * 改造クライアントで `b` を変更してもサーバで強制上書きされること
* **アクセシビリティ**：キーボード操作・コントラスト達成

**合格条件（例）**

* Prompt から **15秒以内**にUI生成、**30秒以内**に Testnet で有効注文
* WS切断時、**3秒以内**にUI劣化表示、**15秒以内**に自動復帰

---

# 12. 実装フロー（詳細）

## 12.1 コア生成エンジン

* LLM（GPT-4/Claude）→ **UI DSL(JSON)**
* **Zodで検証→TSXレンダ**、未知は `InfoCard`
* **@nktkas/hyperliquid** を薄いラッパで包んで依存点を限定 ([GitHub][10])

## 12.2 戦略特化UI

* ペルソナ別テンプレ（DCA/スキャル/ヘッジ/リスク）
* **WS**（Main/Testnet切替）で価格/FR/建玉/PnL 更新。**WS POST**は将来拡張で検討。 ([Hyperliquid Docs][3])
* **Builder Code統合**：UIで上限承認→注文時に `b/f` 付与。 ([Hyperliquid Docs][2])

## 12.3 デモ・最適化

* **Vercel** デプロイ自動化（RESTワークフロー；プレビューURLは不変） ([Hyperliquid Docs][1])
* 起動時：**Registryの deploymentIdHash と Vercel の ID を照合**。不一致は発注不可。
* 5分台本：プロンプト→UI→承認→発注→差分パッチ→KPI提示

---

# 13. 技術スタック確定

* **フロント**：Next.js 14（App Router）＋ shadcn/ui ＋ Tailwind
* **ウォレット**：**Reown AppKit**（WalletConnect後継） ([docs.reown.com][4])
* **HL SDK**：**@nktkas/hyperliquid**（TS、HTTP/WS、バージョン固定） ([npm][11])
* **型/検証**：TypeScript + Zod + decimal.js
* **デプロイ**：Vercel（API Routesは Node ランタイム）
* **チェーン**：HyperEVM（Registry/Split）、Arbitrum（入金）

---

# 14. 既知のリスクと対策

| リスク           | 影響    | 対策                                            |
| ------------- | ----- | --------------------------------------------- |
| 署名/検証の齟齬      | 発注失敗  | **SDK利用推奨**（自前署名は非推奨） ([Hyperliquid Docs][9]) |
| レート制限         | API落ち | 合流・バッチ・指数バックオフ、WS活用 ([Hyperliquid Docs][8])   |
| 入金ミス（5USDC未満） | 資金ロス  | UIで警告と最小額入力制御 ([Hyperliquid Docs][5])         |
| WS切断          | UX低下  | 自動再接続＋劣化UI・発注無効化                              |
| 盗用/改ざん        | 収益流出  | **BundleHash×Registry 照合**＋サーバで `b/f` 強制      |

---

# 15. 受け入れデモ（審査）

1. プロンプト入力 → **UIが即生成/ライブ更新**
2. **Builder Fee 上限承認**（ワンクリック） ([Hyperliquid Docs][2])
3. **Testnet**で成行/指値→**約定**（Explorer で確認可）
4. 追加入力でUI**差分パッチ**
5. 画面下 KPI が改善→**BundleHash/署名/DeploymentID** を表示

---

# 16. 依存リンク（一次情報）

* **API 総覧/REST/WS/署名/Info**（500件ページング） ([Hyperliquid Docs][1])
* **レート制限**（1200 weight/分、batch重み） ([Hyperliquid Docs][8])
* **Builder Codes**（注文毎 `b/f`、承認/撤回） ([Hyperliquid Docs][2])
* **Bridge/Bridge2 & Onboarding**（最小5USDC注意） ([Hyperliquid Docs][5])
* **TS SDK（nktkas）**（GitHub/NPM） ([GitHub][10])
* **Reown AppKit（WalletConnect後継）**（インストール/概要） ([docs.reown.com][4])

---

## 次アクション（すぐ着手できる順）

1. **UI DSL スキーマ確定**（6コンポーネント固定）
2. **WSクライアント**（単一接続・購読合流・再接続）と **RESTラッパ**（Idempotency/重み対策）
3. **/api/order** 実装（Registry照合→`b/f`強制）
4. **BundleHash 生成・署名UI・Registry/Split**（testnet）
5. **Vercel デプロイAPI**（あなた側から自動で）と起動時照合

この要件定義で、そのまま実装を進められます。必要なら、\*\*最小スターター（コード雛形＋Foundryテスト）\*\*も一気に用意します。

[1]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api?utm_source=chatgpt.com "API - Hyperliquid Docs - GitBook"
[2]: https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes?utm_source=chatgpt.com "Builder codes - Hyperliquid Docs - GitBook"
[3]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket?utm_source=chatgpt.com "Websocket - Hyperliquid Docs - GitBook"
[4]: https://docs.reown.com/appkit/next/core/installation?utm_source=chatgpt.com "Installation"
[5]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/bridge2?utm_source=chatgpt.com "Bridge2 - Hyperliquid Docs - GitBook"
[6]: https://across.to/blog/hyperliquid-bridge?utm_source=chatgpt.com "How to Bridge to Hyperliquid with Across (Step-By- ..."
[7]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint?utm_source=chatgpt.com "Info endpoint | Hyperliquid Docs - GitBook"
[8]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/rate-limits-and-user-limits?utm_source=chatgpt.com "Rate limits and user limits - Hyperliquid Docs - GitBook"
[9]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/signing?utm_source=chatgpt.com "Signing | Hyperliquid Docs - GitBook"
[10]: https://github.com/nktkas/hyperliquid?utm_source=chatgpt.com "Unofficial Hyperliquid API SDK written in TypeScript"
[11]: https://www.npmjs.com/package/%40nktkas/hyperliquid/v/0.15.4?utm_source=chatgpt.com "nktkas/hyperliquid"
[12]: https://deepwiki.com/nktkas/hyperliquid "deepwiki/nktkas/hyperliquid"


---

// 報酬分配と作成者の検証について

# 1) 報酬分配は「必要に応じて」スマコンを書く

* **Hyperliquid だけでも最低限は可能**
  各注文に **Builder Code** を付ければ、その注文のフィルに対する手数料が**指定アドレス（= builder）**へ自動で入ります。ユーザーは最初に**最大ビルダーフィーを承認**でき、いつでも撤回可能。これは**プロトコル側のオンチェーン手数料ロジック**として処理されます。([Hyperliquid Docs][1])

* **複数人に自動で分配したい**（作者・あなた・共同作者・親テンプレのロイヤルティ…）
  → `b` に**あなたが用意した Split コントラクト**のアドレスを入れるだけでOK。Hyperliquid の Builder Code は**1つのアドレス**しか受け取れないため、**N人分配**はあなたのコントラクト側で行います（pull型のPaymentSplitter相当）。
  （単一受取で良いなら**スマコンは不要**。）

* 参考：レートや承認の仕組み・API記法は公式ドキュメント/SDKでも明記。([Hyperliquid Docs][2])

---

# 2) 作成者検証（Authorship）と Vercel デプロイ：要件の補強

ご指摘のとおり、**デプロイ/署名/検証**は要件に明記すべき重要ピースです。次を**要件定義の追加セクション**として入れてください。

## 2.1 デプロイ（あなた側が自動実行）

* **Vercel REST ワークフロー**であなたのバックエンドが実行：

  1. 各ファイルの **SHA** を生成
  2. **/v2/files** にアップロード
  3. **/v13/deployments** でデプロイ作成（**プレビューURLは不変**） ([Vercel][3])
     取得した **deploymentId / URL** をメタとして保持します。([Vercel][4])

## 2.2 BundleHash（内容ハッシュ）と署名

* デプロイ対象ファイル群の **(path → SHA)** マニフェストを**キー順で正規化 JSON**化し、その **SHA-256 = BundleHash** を作成。
* クリエイターは **EIP-712** で
  `bundleHash, keccak256(deploymentId), splitAddress, createdAt, modelVersionHash`
  に**署名**。レジストリ（HyperEVM）へ `bundleHash → (creator, split, …)` を登録。
  こうすると **「この UI 内容をこの作者が作った」** を**可検証**にできます。

## 2.3 ランタイム強制

* フロントは **`x-bundle-hash`** を常に送信。
* サーバの `/api/order` は **Registry を照合**→**`b=splitAddress` / `f`（上限内）**を**強制付与**して発注。クライアント改ざんは無効化。
* 初回起動時に **Vercel API で deploymentId を照合**し、レジストリの `deploymentIdHash` と一致しなければ発注不可。([Vercel][4])

## 2.4 「ビルド後の変更でハッシュが変わるのでは？」への方針

* **変わります**。だからこそ **BundleHash = バージョンID** とみなします。
* 変更があれば**新しいバージョンとして再登録**（`parentBundleHash` をメタに持たせて系譜を辿れるように）。
* マーケットプレイスでは**最新版**表示＋**過去版も履歴で参照**。
* これで「**内容と署名が常に 1:1**」になり、改ざん耐性と再現性が担保されます。

---

# 4) すばやい結論まとめ

* **Hyperliquid 機能だけでも単一アドレスへの報酬は可能**（Builder Code）。**複数人分配**を自動化したいなら**Split スマコンが必要**。([Hyperliquid Docs][1])
* **作成者検証**は **BundleHash（内容）× EIP-712 署名 × Registry** を**要件に明記**。Vercel は**内容ハッシュ生成と不変URLの発行**に使い、**サーバから自動デプロイ**。([Vercel][3])
* **ビルド変更でハッシュは変わる**→**新バージョンとして登録**（親子リンク付き）


[1]: https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes?utm_source=chatgpt.com "Builder codes - Hyperliquid Docs - GitBook"
[2]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api?utm_source=chatgpt.com "API - Hyperliquid Docs - GitBook"
[3]: https://vercel.com/docs/deployments?utm_source=chatgpt.com "Deploying to Vercel"
[4]: https://vercel.com/docs/rest-api?utm_source=chatgpt.com "Using the REST API - Vercel API Docs"
[5]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/websocket?utm_source=chatgpt.com "Websocket - Hyperliquid Docs - GitBook"
[6]: https://vercel.com/docs/rest-api/reference/endpoints/deployments/upload-deployment-files?utm_source=chatgpt.com "Upload Deployment Files - Vercel API Docs"
[7]: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/rate-limits-and-user-limits?utm_source=chatgpt.com "Rate limits and user limits - Hyperliquid Docs - GitBook"
