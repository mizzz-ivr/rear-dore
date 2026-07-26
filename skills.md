# skills.md

## ドメイン概要

「レアどれ？」は、選択率が低い回答ほど高得点になる少数派予測ゲームです。回答者は自分の好みだけでなく、他の参加者が何を選ぶかを予想します。

## 問題データ

問題は`lib/game.ts`の`Question`型に従います。

- `id`: 永続的に変更しない識別子
- `prompt`: 問題文
- `choices`: 4〜5件の選択肢
- `choices[].percentage`: MVP用の固定選択率

選択率の合計は100になるようにしてください。回答前の画面から割合を推測できる文言や並び順は避けます。

## レア度と得点

境界値は`getRarity`と`getScore`へ集約します。UI側に同じ判定を重複実装しないでください。

- 0〜1%: UR / 1,000点
- 1%超〜3%: SSR / 500点
- 3%超〜8%: SR / 300点
- 8%超〜15%: R / 150点
- 15%超〜30%: N / 75点
- 30%超: 多数派 / 20点

境界値を変更する場合は、仕様書・テスト・表示文言も同じPRで更新します。

## 新しい問題の追加手順

1. `questions`へ問題を追加する
2. 一意な英語`id`を設定する
3. 選択肢を4〜5件登録する
4. 選択率の合計が100であることを確認する
5. モバイル幅で問題文と選択肢が見切れないことを確認する
6. 必要に応じてテストを追加する

## ローカル実行

```bash
npm install
cp .env.example .env.local
npm run dev
```

品質確認:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## CIで確認するポイント

- Node.js 22で依存関係を解決できる
- ESLint
- TypeScript
- Vitest
- Next.js本番ビルド
- `NEXT_PUBLIC_SITE_URL=https://reardore.ivrm.jp`

## デプロイ時の注意点

- Vercel Hobbyプランを前提とする
- Production Branchは`main`
- PreviewとProductionを混同しない
- 本番metadataと共有URLは`reardore.ivrm.jp`へ統一する
- DNS値はVercelのProject Settingsに表示された内容を優先する

## よくある失敗

- 回答前に割合をDOMへ出してしまう
- UI内にレア度判定を重複実装する
- 回答確定後も選択肢を変更できる
- 最終問題で結果画面へ遷移できない
- Web Share APIのキャンセルをエラー表示してしまう
- モバイルで長い選択肢が横にはみ出す
- Preview URLをcanonical URLに使用する
