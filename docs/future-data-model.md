# 将来のデータモデル案

MVP後に回答保存を導入する場合の候補。

- `question_sets`: 公開日、状態
- `questions`: 問題文、表示順
- `choices`: 選択肢、表示順
- `answers`: 匿名端末ID、選択肢、回答日時
- `daily_results`: 合計点、称号、共有ID

実装前に匿名端末ID、保存期間、削除方針、不正対策を確定する。
