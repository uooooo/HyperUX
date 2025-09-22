# 概要
全ページの UI/UX を改善し、ウォレット接続ヘッダーの読み込み遅延を解消する。

# 背景
Issue #6 で最低限のページが揃ったが、デザインは仮状態。`docs/product/requirements.md` #4 UI/UX 要件では DCA 初心者〜裁定トレーダーが迷わない情報設計が求められている。ウォレットヘッダーも遅延があり UX を損ねているため、Tailwind/shadcn の再構成や Skeleton、パネルのレイアウト調整が必要。

# やること
- [ ] グローバルレイアウト (ヘッダー/フッター/背景) を再設計し、各ページで共通化する
- [ ] Home/Market/Trade のセクションレイアウト・タイポグラフィ・コントラストを改善する
- [ ] ヘッダーのウォレット接続 (Reown AppKit) の初期化を最適化し、遅延を軽減する（Suspense or skeleton）
- [ ] 主要カードに Skeleton/Loading ステートを追加する
- [ ] デモ用スクリーンショット/アセットの配置

## v0 デザイン指針

- **カラーパレット**
  - 背景: #020A08 (深緑ベース), サーフェス: #041411, アクセント: #00B894 / #0BD677, 警告: #FF5A5F, テキスト: #F1FFF9 (primary), #7DE0C4 (secondary)
  - グリッドライン/ボーダー: rgba(0, 255, 204, 0.08), カード影は最小限
- **タイポグラフィ**
  - 見出し: `font-semibold`, 追従色 #CCFFE4, サブテキスト: #78B09C
- **共通コンポーネント DSL**
  - `MarketTickerCard`: { venue, symbol, price, changePct }
  - `ScheduleProgressCard`: DCA 動向（progress, nextPurchaseEta, avgCost, totalAccumulated）
  - `ScalpControlCard`: 価格, timeframe, sliderSteps, actionButtons[{label, side, sizeUsd, leverage}]
  - `ArbOpportunityCard`: legs[{venue, price}], spreadBps, execLatency, pastOpportunities[]
  - `SignalFeedCard`: feedItems[{source, message, timestamp, isLive}]
- `DeltaExposureCard`: spotPosition, futuresPosition, deltaMetric, fundingApr, pnlDaily, nextRebalanceEta
- 参考コード: `docs/v0/hyperux-trading/components/interfaces/*` をベースにデザイン要素/トークンを移植
- **ページレイアウト**
  - Home: Hero (prompt + quick templates), Strategy gallery (cards), コンテナ幅 960px, 背景グラデ
  - Trade: Header (title, persona, prompt snippet, wallet status), KPI Bar（ttv/reconnect), Main grid (2列 >=1024px), 右 Col に signal/feed widgets
  - Market: Masonry 2列, 各カードは 320-360px, hover で preview/duplicate
- **ヘッダー改善**
  - WalletConnect ボタンは skeleton プレースホルダ→`useEffect` 内で AppKit 起動
  - ナビゲーション: Home / Market / Docs / Demo, sticky, 背景: rgba(2,10,8,0.8)
- **状態管理**
  - Loading skeleton: shimmer (#033024 -> #044136), エラー時はモーダル/トーストを shadcn toast で統一


# 受入基準
- 3ページとも統一されたスタイル・レスポンシブ対応が整う
- ウォレット接続ボタンがファーストビューで即座に描画される
- Trade ページの主要コンポーネントにローディング状態が導入される

# 参考
- Issue: https://github.com/uooooo/HyperUX/issues/18
- `docs/product/requirements.md` #4
- `docs/hyperliquid/Trading` 系資料 (情報優先度)
