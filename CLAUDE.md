# CLAUDE.md

## テスト駆動開発（TDD）ルール

このプロジェクトでは **t-wada スタイルの TDD** で開発を進める。
新機能・バグ修正は必ず Red → Green → Refactor のサイクルで実施すること。

---

### サイクル

#### 🔴 Red — 失敗するテストを書く

- 実装より先にテストを書く
- テストは「1 つだけ」失敗させる（複数同時に Red にしない）
- テストは振る舞いを記述する（実装詳細ではない）
- テスト名は日本語で「〜する」「〜を返す」など仕様として読めるように書く

#### 🟢 Green — 最小限のコードでテストを通す

**仮実装（Fake It）** から始める:
- ハードコードした値でも構わない。テストが通ることを最優先する

**三角測量（Triangulation）**:
- 仮実装では通らない 2 つめのテストを追加し、一般化を強制する

**明白な実装（Obvious Implementation）**:
- 実装が自明な場合は直接書いて構わない

#### 🔵 Refactor — リファクタリング

- テストがグリーンの状態を保ちながらコードを整理する
- 重複を除去し、意図を明確にする
- テストコード自身もリファクタリング対象

---

### ルール

- テストなしで実装コードを追加しない
- 一度に 1 つのテストだけ Red にする
- 開発中は `npm run test:watch` を起動したまま作業する
- テストが壊れたまま次のステップに進まない
- テストファイルは実装ファイルと同じディレクトリに置く（`foo.ts` → `foo.test.ts`）

---

## コマンド

| コマンド | 用途 |
|--------|------|
| `npm run test:watch` | TDD 開発時の watch モード |
| `npm run test` | 一回実行（CI・pre-push hook） |
| `npm run check` | Biome lint + format（pre-commit でも自動実行） |
| `npm run build` | Astro SSG ビルド（要: microCMS 環境変数） |

## 環境変数

ローカル開発時は `.env` ファイルを作成すること:

```
MICROCMS_API_KEY=your_api_key
MICROCMS_SERVICE_DOMAIN=your_service_domain
```
