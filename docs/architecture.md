# 初期アーキテクチャ

## 構成

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vitest
- Vercel

## 状態管理

MVPでは`app/page.tsx`のローカル状態だけを利用する。外部状態管理ライブラリは導入しない。

## ドメインロジック

`lib/game.ts`が問題データ、レア度、得点、称号を所有する。UIは計算結果を表示し、判定ルールを再実装しない。

## データ

MVPは固定データを利用し、サーバーへ回答を保存しない。将来は問題取得と回答登録のインターフェースを追加し、UIから永続化方式を分離する。

## デプロイ

Vercel Hobbyを利用し、`main`をProduction Branchとする。PRと機能ブランチはPreview Deploymentとして扱う。
