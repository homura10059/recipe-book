# Design: CookLang Recipe Site

requirements.md の要件定義をもとに、実装に向けたアーキテクチャとコンポーネント設計を定義する。

-----

## 技術スタック

| レイヤー           | 技術                      |
|----------------|-------------------------|
| SSG            | Astro                   |
| スタイリング          | Tailwind CSS v4         |
| microCMS クライアント | `microcms-js-sdk`       |
| CookLang パーサー   | `@cooklang/cooklang-ts` |

-----

## ディレクトリ構成

```
src/
  components/
    RecipeCard.astro       # レシピ一覧カード（thumbnail / title / tags）
    RecipeGrid.astro       # カードのグリッドレイアウト
    IngredientList.astro   # 食材リスト（CookLang パース済みデータを受け取る）
    StepList.astro         # 調理手順リスト（同上）
    TagBadge.astro         # タグ 1 件（リンク付き）
    TagList.astro          # タグ複数表示
    CategoryBadge.astro    # カテゴリ 1 件（リンク付き）
    Header.astro           # サイトヘッダー（サイト名）
  layouts/
    BaseLayout.astro       # 共通レイアウト（head / Header / slot）
  pages/
    index.astro            # /                    レシピ一覧
    recipes/
      [slug].astro         # /recipes/[slug]      レシピ詳細
    tags/
      [slug].astro         # /tags/[slug]         タグ別一覧
    categories/
      [slug].astro         # /categories/[slug]   カテゴリ別一覧
  lib/
    microcms.ts            # microCMS クライアント初期化・型定義・fetch 関数
    cooklang.ts            # CookLang パースユーティリティ
  styles/
    global.css             # Tailwind v4 エントリ・テーマ定義
```

-----

## データフロー

```
ビルド時:
  Astro (getStaticPaths / top-level fetch)
    → lib/microcms.ts  (microcms-js-sdk)
      → microCMS REST API
        → Recipe / Tag / Category データ取得
          → CookLang body → lib/cooklang.ts でパース
            → コンポーネントへ props として渡す
              → 静的 HTML 生成 → dist/
```

-----

## コンポーネント仕様

### `layouts/BaseLayout.astro`

| props   | 型        |
|---------|---------|
| `title` | `string` |

- `<head>` に charset / viewport / `<title>` / global.css を含む
- `<Header />` を内包
- `<slot />` でページコンテンツを受け取る

### `components/Header.astro`

- サイト名「recipe book」を表示
- クリックで `/` へ遷移

### `components/RecipeCard.astro`

| props    | 型         |
|----------|----------|
| `recipe` | `Recipe` |

- `/recipes/[slug]` へのリンク
- `thumbnail` がある場合は `<Image>` で最適化表示、ない場合は代替エリア
- タイトルと `<TagList />` を表示

### `components/RecipeGrid.astro`

| props     | 型           |
|-----------|------------|
| `recipes` | `Recipe[]` |

- グリッドレイアウトで `<RecipeCard />` を並べる
- レスポンシブ（1 列 → 2 列 → 3 列）

### `components/IngredientList.astro`

| props         | 型                 |
|---------------|------------------|
| `ingredients` | `Ingredient[]` ※ |

※ `@cooklang/cooklang-ts` の型

- `<ul>` でシンプルに一覧表示
- 分量・単位・名称を並べる

### `components/StepList.astro`

| props   | 型          |
|---------|-----------|
| `steps` | `Step[]` ※ |

- `<ol>` で手順を表示
- 手順内の食材・調理器具をマスタードカラーでハイライト

### `components/TagBadge.astro` / `components/CategoryBadge.astro`

| props  | 型        |
|--------|--------|
| `name` | `string` |
| `slug` | `string` |

- それぞれ `/tags/[slug]` / `/categories/[slug]` へのリンク
- マスタードカラーのバッジスタイル（`border-mustard text-mustard`）

### `components/TagList.astro`

| props  | 型       |
|--------|-------|
| `tags` | `Tag[]` |

- `<TagBadge />` を横並びで表示

-----

## lib 設計

### `lib/microcms.ts`

```ts
// 型定義
export type Tag = { id: string; name: string; slug: string }
export type Category = { id: string; name: string; slug: string }
export type Recipe = {
  id: string; title: string; slug: string
  body: string; thumbnail?: { url: string; width: number; height: number }
  tags: Tag[]; category: Category; publishedAt: string
}

// createClient で microcms-js-sdk 初期化（環境変数から読み込み）

// エクスポート関数
export const getAllRecipes = (): Promise<Recipe[]>
export const getRecipe = (slug: string): Promise<Recipe>
export const getAllTags = (): Promise<Tag[]>
export const getAllCategories = (): Promise<Category[]>
export const getRecipesByTag = (slug: string): Promise<Recipe[]>
export const getRecipesByCategory = (slug: string): Promise<Recipe[]>
```

### `lib/cooklang.ts`

```ts
import { Recipe as CooklangRecipe } from '@cooklang/cooklang-ts'

// @cooklang/cooklang-ts の Recipe クラスをラップ
export const parseCooklang = (body: string): {
  ingredients: Ingredient[]
  steps: Step[]
}
```

-----

## スタイリング仕様（Tailwind CSS v4）

### `src/styles/global.css`

```css
@import "tailwindcss";

@theme {
  --color-mustard: #D4A017;
  --color-background: #F8F5F0;  /* オフホワイト */

  --font-family-base: 'Georgia', 'Yu Mincho', 'YuMincho', serif;
}
```

### デザイン原則

| 要素       | クラス / 値                             |
|----------|-------------------------------------|
| 背景       | `bg-background` (`#F8F5F0`)         |
| テキスト     | `text-stone-800`                    |
| アクセント    | `text-mustard` / `border-mustard` (`#D4A017`) |
| フォント     | serif 系（`font-base`）               |
| 余白       | `p-6` / `gap-8` など広めに設定            |
| ボーダー・影   | 最小限（`border border-stone-200` 程度）  |
| 画像なし時    | テキストとタグのみでカードレイアウトが成立する設計          |

-----

## 環境変数

```
MICROCMS_API_KEY=xxx
MICROCMS_SERVICE_DOMAIN=xxx
```

`lib/microcms.ts` 内で `import.meta.env.MICROCMS_API_KEY` / `import.meta.env.MICROCMS_SERVICE_DOMAIN` から参照。
Cloudflare Pages の環境変数に同名で設定する。
