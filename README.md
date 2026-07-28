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

現在の問題と回答分布はフロントエンドの固定データです。回答途中と総合結果は、日本時間の当日分として同一ブラウザの`localStorage`へ保存されます。

保存するのは問題IDと選択肢IDのみで、選択率・レア度・点数は復元時に現行問題データから再計算します。壊れたデータ、過去日のデータ、現行問題と不整合なデータは利用しません。

別ブラウザ・別端末間の同期、厳密な重複回答防止、サーバー保存、管理画面は後続タスクです。
