# 初期運用手順

## 公開前

- CIが成功している
- Vercel Previewで主要導線を確認した
- metadataとOGPを確認した
- 本番環境変数を確認した
- カスタムドメインのDNS設定を確認した

## 公開後

- トップページへHTTPSでアクセスする
- 5問完走する
- 共有導線を確認する
- Vercel Runtime Logsに異常がないことを確認する

## 障害時

1. VercelのDeployment状態とBuild Logsを確認する
2. 直前の正常Deploymentへロールバックする
3. 再現手順と影響範囲をIssueへ記録する
4. 原因修正は小さなPRで行う
