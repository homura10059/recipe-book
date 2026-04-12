# DESIGN.md — homura's recipe book

> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

---

## 1. Visual Theme & Atmosphere

- **デザイン方針**: 温かみのある、落ち着いたパーソナルレシピサイト。明朝体セリフフォントで上品なエディトリアル感を演出する
- **密度**: ゆったりとしたメディア/ブログ型。余白を広く取り、コンテンツを際立たせる
- **キーワード**: 温かみのある、落ち着いた、エディトリアル、ミニマル、和風モダン

---

## 2. Color Palette & Roles

<!-- 色はすべて hex 値で記述。global.css および Tailwind CSS stone パレットに基づく -->

### Primary（ブランドカラー）

- **Mustard** (`#d4a017`): メインのブランドカラー。バッジ枠線、ホバー時のアクセント、アクティブタブの下線に使用
- **Mustard (Hover BG)** (`#d4a017`): バッジ・リンクのホバー時の背景色（テキストは白 `#ffffff`）

### Neutral（ニュートラル）

- **Text Primary** (`#292524`): 本文テキスト（Tailwind `stone-800`）
- **Text Secondary** (`#44403c`): ナビゲーション、ドロップダウンリンク（Tailwind `stone-700`）
- **Text Muted** (`#78716c`): カテゴリ表示、メタ情報（Tailwind `stone-500`）
- **Text Disabled** (`#a8a29e`): 日付、プレースホルダー、非アクティブタブ（Tailwind `stone-400`）
- **Border** (`#e7e5e4`): カード枠線、ヘッダー下線、区切り線（Tailwind `stone-200`）
- **Background** (`#f8f5f0`): ページ背景（温かみのあるオフホワイト。カスタム変数 `--color-background`）
- **Surface** (`#fafaf9`): コードブロック・プレビュー背景（Tailwind `stone-50`）
- **Surface Hover** (`#f5f5f4`): ドロップダウン項目のホバー背景（Tailwind `stone-100`）

> **Note:** エラー・警告・成功の Semantic カラーは現在未定義（読み取り専用のレシピ閲覧サイトのため）

---

## 3. Typography Rules

<!-- 明朝体セリフフォントを基本とした日本語タイポグラフィ -->

### 3.1 和文フォント

- **明朝体**: Yu Mincho（游明朝）, YuMincho

### 3.2 欧文フォント

- **セリフ**: Georgia（和文フォントより優先して先頭に置く）
- **等幅**: システムデフォルト（`font-mono` クラスを使用）

### 3.3 font-family 指定

```css
/* 本文・見出し共通（カスタム変数 --font-family-base） */
font-family: "Georgia", "Yu Mincho", "YuMincho", serif;

/* 等幅（コードブロック） */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

**フォールバックの考え方**:
- Georgia を先頭に置き、欧文の表示品質を優先する（サイト名・セクションラベルが英語表記のため）
- 和文は Yu Mincho / YuMincho の順でフォールバック
- 最後に generic family `serif` を指定

### 3.4 文字サイズ・ウェイト階層

<!-- Tailwind CSS デフォルトスケールに基づく -->

| Role | Class | Size | Weight | Line Height | Letter Spacing | 備考 |
|------|-------|------|--------|-------------|----------------|------|
| Display | `text-3xl` | 30px | 400 | 1.5 | 0 | レシピ詳細ページの h1 |
| Heading 1 | `text-xl` | 20px | 400 | 1.5 | 0.1em (`tracking-widest`) | サイトタイトル |
| Heading 2 | `text-lg` | 18px | 400 | 1.5 | 0 | カードタイトル |
| Label | `text-sm` | 14px | 400 | 1.5 | 0.1em (`tracking-widest`) | セクションラベル（INGREDIENTS / STEPS） |
| Body | `text-base` | 16px | 400 | 1.5 | 0 | 本文デフォルト |
| Caption | `text-xs` | 12px | 400 | 1.5 | 0 | カテゴリ、日付、バッジテキスト |

### 3.5 行間・字間

- **本文の行間 (line-height)**: Tailwind デフォルト `1.5`（`leading-normal`）
- **コードブロックの行間**: `1.625`（`leading-relaxed`）
- **本文の字間 (letter-spacing)**: 基本 `0`
- **サイトタイトル・セクションラベルの字間**: `0.1em`（`tracking-widest`）。lowercase 表記と組み合わせてエディトリアルな雰囲気を演出

### 3.6 禁則処理・改行ルール

```css
/* コードブロック */
white-space: pre-wrap;
overflow-wrap: break-word;
word-break: break-words;
```

本文の禁則処理は Tailwind CSS のデフォルト設定に準拠。

### 3.7 OpenType 機能

現時点では `font-feature-settings` の明示的な指定なし。Georgia / Yu Mincho のデフォルト設定に依存。

---

## 4. Component Stylings

### Badges（カテゴリ・タグ）

CategoryBadge / TagBadge 共通スタイル:
- Background: `transparent`
- Text: `#d4a017`（mustard）
- Border: `1px solid #d4a017`
- Padding: `2px 8px`（`py-0.5 px-2`）
- Border Radius: なし（シャープ）
- Font Size: 12px（`text-xs`）
- Hover: Background `#d4a017`、Text `#ffffff`

### Cards（レシピカード）

- Background: `#f8f5f0`（背景色と同一）
- Border: `1px solid #e7e5e4`
- Border（hover）: `1px solid #d4a017`
- Border Radius: `8px`（`rounded-lg`）
- Inner Padding: `20px`（`p-5`）
- Overflow: `hidden`
- Transition: `border-color` に `transition-colors`

### Tabs（RecipeTabs）

- コンテナ下線: `1px solid #e7e5e4`
- アクティブタブ: `border-bottom: 2px solid #d4a017`、Text `#d4a017`
- 非アクティブタブ: `border-bottom: 2px solid transparent`、Text `#a8a29e`
- タブテキスト: 14px（`text-sm`）
- Padding: `8px 16px`（`py-2 px-4`）

### Dropdown（ナビゲーションメニュー）

- Background: `#f8f5f0`
- Border: `1px solid #e7e5e4`
- Border Radius: `4px`（`rounded`）
- Shadow: `0 1px 2px rgba(0,0,0,0.05)`（`shadow-sm`）
- Item Padding: `8px 20px`（`py-2 px-5`）
- Item Text: `#44403c`（stone-700）
- Item Hover Text: `#d4a017`、Background: `#f5f5f4`（stone-100）

### Code Block（Cooklangソースビュー）

- Background: `#fafaf9`（stone-50）
- Border: `1px solid #e7e5e4`（stone-200）
- Border Radius: `4px`（`rounded`）
- Padding: `16px`（`p-4`）
- Font: `font-mono`
- Font Size: 14px（`text-sm`）
- Text Color: `#44403c`（stone-700）
- Line Height: `1.625`（`leading-relaxed`）

---

## 5. Layout Principles

### Spacing Scale

Tailwind CSS の 4px ベーススケール（`--spacing` = 4px）を使用。

| Token | Tailwind | Value | 主な用途 |
|-------|----------|-------|---------|
| XS | `1` / `0.5` | 4px / 2px | バッジの縦 padding |
| S | `2` | 8px | バッジの横 padding、タブ padding |
| M | `4` | 16px | コードブロック padding、タブ横 padding |
| L | `6` | 24px | コンテナ横 padding（`px-6`） |
| XL | `8` | 32px | グリッド gap（`gap-8`） |
| XXL | `12` | 48px | ページ縦 padding（`py-12`） |

### Container

- Max Width（サイト全体）: `1024px`（`max-w-5xl`）
- Max Width（記事本文）: `672px`（`max-w-2xl`）
- Horizontal Padding: `24px`（`px-6`）

### Grid（レシピ一覧）

| Breakpoint | Columns | Gap |
|-----------|---------|-----|
| Mobile (< 640px) | 1 | 32px |
| Tablet (≥ 640px) | 2 | 32px |
| Desktop (≥ 1024px) | 3 | 32px |

---

## 6. Depth & Elevation

| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | none | カード（通常状態）、バッジ |
| 1 | `shadow-sm`（`0 1px 2px rgba(0,0,0,0.05)`） | ドロップダウンメニュー |

> このサイトはフラットなデザインを基本とし、深い影は使用しない。

---

## 7. Do's and Don'ts

### Do（推奨）

- フォントは必ず `"Georgia", "Yu Mincho", "YuMincho", serif` のフォールバックチェーンを指定する
- カードのホバー状態は `border-color` を `#d4a017`（mustard）に変化させる
- セクションラベル（INGREDIENTS / STEPS 等）は `text-sm tracking-widest uppercase text-stone-400` スタイルで統一する
- バッジ（カテゴリ・タグ）は border-only スタイルを使用し、hover でmustard背景に反転させる
- コンテナ幅は `max-w-5xl`（1024px）を基本とし、記事コンテンツは `max-w-2xl`（672px）に収める

### Don't（禁止）

- `font-family` に和文フォント1つだけを指定しない（環境依存になる）
- 純粋な `#000000` をテキスト色に使わない（本文は `#292524`）
- 白背景（`#ffffff`）を使わない（ページ背景は温かみのある `#f8f5f0`）
- バッジに `border-radius` を付けない（シャープなエッジがデザインの特徴）
- mustard 以外のアクセントカラーを追加しない（mustard 単色でブランドを統一する）

---

## 8. Responsive Behavior

### Breakpoints

Tailwind CSS デフォルトブレークポイント:

| Name | Width | 説明 |
|------|-------|------|
| Mobile | < 640px | 1カラムレイアウト |
| Tablet | ≥ 640px (`sm`) | 2カラムグリッド |
| Desktop | ≥ 1024px (`lg`) | 3カラムグリッド |

### タッチターゲット

- ナビゲーションボタン: `24px` アイコン + `p-1`（実効 26px）。必要に応じて 44px × 44px（WCAG基準）に拡大を検討
- バッジ・タブ: タップ操作での誤タップに注意。十分な gap を確保する

### フォントサイズの調整

- モバイルでは Tailwind デフォルトのサイズスケールをそのまま使用（現時点でブレークポイント別のフォントサイズ調整なし）
- 最小フォントサイズは 12px（`text-xs`）

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
サイト名: homura's recipe book
URL: https://recipe-book.homura10059.dev

Primary (Mustard): #d4a017
Text Primary:      #292524
Text Secondary:    #44403c
Text Muted:        #78716c
Text Disabled:     #a8a29e
Border:            #e7e5e4
Background:        #f8f5f0
Surface:           #fafaf9

Font: "Georgia", "Yu Mincho", "YuMincho", serif
Body Size: 16px
Line Height: 1.5
Heading Letter Spacing: 0.1em (tracking-widest)

Container Max Width: 1024px (max-w-5xl)
Article Max Width: 672px (max-w-2xl)
```

### プロンプト例

```
homura's recipe book のデザインシステムに従って、新しいコンポーネントを作成してください。
- 背景色: #f8f5f0
- フォント: "Georgia", "Yu Mincho", "YuMincho", serif
- アクセントカラー（mustard）: #d4a017
- テキスト色: #292524
- ボーダー: 1px solid #e7e5e4
- ホバー時ボーダー: 1px solid #d4a017
- 行間: line-height 1.5
- コンテナ: max-w-5xl mx-auto px-6
```
