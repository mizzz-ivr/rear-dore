# Vercelデプロイ手順

## 前提

- Vercel Hobbyプランを利用する
- GitHubリポジトリ: `mizzz-ivr/rear-dore`
- 本番ブランチ: `main`
- 本番URL: `https://reardore.ivrm.jp`

## プロジェクト作成

1. Vercelで「Add New Project」を選択する
2. `mizzz-ivr/rear-dore` をImportする
3. Framework Presetが`Next.js`であることを確認する
4. Root Directoryはリポジトリ直下のままにする
5. Production Branchを`main`にする
6. 環境変数を設定する

```text
NEXT_PUBLIC_SITE_URL=https://reardore.ivrm.jp
```

Production・Preview・Developmentのすべてに設定する。

## カスタムドメイン

1. Project Settings > Domainsを開く
2. `reardore.ivrm.jp`を追加する
3. Vercelに表示されたDNSレコードを`ivrm.jp`のDNS管理サービスへ設定する
4. DNS反映後、Vercel上でValid Configurationになることを確認する

サブドメインでは通常CNAMEが案内されるが、実際の値はVercel画面の指示を優先する。

## 公開確認

- `https://reardore.ivrm.jp`へHTTPSでアクセスできる
- ページタイトルと説明が正しい
- canonical URLが`https://reardore.ivrm.jp`を参照する
- OGP画像が表示される
- 5問を最後まで回答できる
- スマートフォン幅で横スクロールが発生しない
- Preview URLが検索エンジン向けURLとして使われていない

## ロールバック

VercelのDeployments画面から直前の正常なProduction Deploymentを選択し、Promote to Productionを実行する。

## 無料枠運用上の注意

MVPでは固定問題データを利用し、DB・Cron・高頻度なServerless Function実行を持たない。回答保存や動的集計を追加する際は、利用量と不正アクセス対策を別途確認する。
