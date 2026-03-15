# Requirements: CookLang Recipe Site

## 概要

microCMS で管理したレシピ（CookLang形式）を Astro でビルドし、Cloudflare Pages に静的ホスティングするサイト。

-----

## 技術スタック

|レイヤー        |技術                              |
|------------|--------------------------------|
|SSG         |Astro                           |
|CMS         |microCMS                        |
|CookLangパーサー|`@cooklang/cooklang-ts`         |
|ホスティング      |Cloudflare Pages                |
|CI/CD       |GitHub → Cloudflare Pages 自動デプロイ|

-----

## microCMS コンテンツ設計

### `recipes` API（リスト形式）

|フィールド        |型          |説明                      |
|-------------|-----------|------------------------|
|`title`      |テキスト       |レシピ名                    |
|`slug`       |テキスト       |URLスラッグ（一意）             |
|`body`       |テキストエリア    |CookLang本文（`.cook` テキスト）|
|`thumbnail`  |画像         |サムネイル画像                 |
|`tags`       |コンテンツ参照（複数）|タグ一覧への参照                |
|`category`   |コンテンツ参照    |カテゴリへの参照                |
|`publishedAt`|日時         |公開日                     |

### `tags` API（リスト形式）

|フィールド |型   |
|------|---|
|`name`|テキスト|
|`slug`|テキスト|

### `categories` API（リスト形式）

|フィールド |型   |
|------|---|
|`name`|テキスト|
|`slug`|テキスト|

-----

## 画面・ルーティング

|パス                  |内容       |
|--------------------|---------:|
|`/`                 |レシピ一覧（全件）|
|`/recipes/[slug]`   |レシピ詳細    |
|`/tags/[slug]`      |タグ別一覧    |
|`/categories/[slug]`|カテゴリ別一覧  |

-----

## 機能要件

### レシピ一覧ページ

- microCMS から全レシピを取得してカード表示
- サムネイル・タイトル・タグを表示
- タグ / カテゴリでのフィルタリング（静的生成 or クライアントサイドフィルタ）

### レシピ詳細ページ

- `body` フィールドの CookLang テキストをビルド時にパース
- 食材リスト・調理手順を構造化して表示
- サムネイル画像表示（microCMS の画像URL）
- 付属タグ・カテゴリ表示（リンクでフィルタページへ）

### 画像

- microCMS の画像配信URLをそのまま使用
- Astro の `<Image>` コンポーネントで最適化（width/height指定）

-----

## ビルド・デプロイ

```
GitHub push (main)
  → Cloudflare Pages ビルドトリガー
    → astro build（microCMS API を叩いて全ページ静的生成）
      → dist/ を Cloudflare Pages に配信
```

### Cloudflare Pages 設定

|項目      |値                                                               |
|--------|----------------------------------------------------------------|
|ビルドコマンド |`astro build`                                                   |
|出力ディレクトリ|`dist/`                                                         |
|環境変数    |`MICROCMS_API_KEY`, `MICROCMS_SERVICE_DOMAIN`, `NODE_VERSION=20`|

### microCMS Webhook（オプション）

- コンテンツ更新時に Cloudflare Pages の Deploy Hook URL へ POST → 自動再ビルド

-----

## 非機能要件

- 全ページ静的HTML（JS最小化・SEOフレンドリー）
- デザイン: ミニマル・クラフト系
  - 背景: オフホワイト
  - タイポグラフィ重視、余白多め、装飾少なめ
  - アクセントカラー: マスタード（`#D4A017` 前後）1色のみ
  - 画像なしでもレイアウトが成立するテキスト中心設計
- レスポンシブ対応
- カスタムドメイン: `recipe-book.homura10059.dev`（Cloudflare DNS で管理）

-----

## 未確定事項（TBD）

なし

## スコープ外（対象外）

- 全文検索（Pagefind等）
- OGP / メタタグ
