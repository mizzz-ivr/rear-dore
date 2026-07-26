# レアどれ？

みんなが選ばなそうな答えを選ぶ、少数派予測型のデイリーゲームです。

- 公開予定URL: https://reardore.ivrm.jp
- ホスティング: Vercel Hobby
- フレームワーク: Next.js App Router

## 開発

```bash
npm install
npm run dev
```

## 品質チェック

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## 環境変数

`.env.example`を`.env.local`へコピーします。

```env
NEXT_PUBLIC_SITE_URL=https://reardore.ivrm.jp
```

## Vercelへの公開

1. Vercelで`mizzz-ivr/rear-dore`をImportする
2. Production Branchを`main`にする
3. Production環境へ`NEXT_PUBLIC_SITE_URL=https://reardore.ivrm.jp`を設定する
4. Domainsへ`reardore.ivrm.jp`を追加する
5. DNS管理側へVercelが表示するCNAMEを設定する
6. HTTPS、canonical、OGPを確認する

## MVPのデータ方針

現在の問題と回答分布はフロントエンドの固定データです。リロードすると回答状態はリセットされます。永続化、重複回答対策、管理画面は後続タスクで実装します。
