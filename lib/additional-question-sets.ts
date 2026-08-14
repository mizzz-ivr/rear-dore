import type { QuestionSet } from "./game";

export const additionalQuestionSets: QuestionSet[] = [
  {
    id: "daily-08-work-study",
    title: "仕事・学校編",
    questions: [
      {
        id: "meeting-silence-first",
        prompt: "会議や授業で急に沈黙。最初にどうする？",
        choices: [
          { id: "meeting-silence-first-wait", label: "誰かが話すまで待つ", percentage: 38 },
          { id: "meeting-silence-first-note", label: "手元のメモを見直す", percentage: 27 },
          { id: "meeting-silence-first-question", label: "質問を1つ出す", percentage: 18 },
          { id: "meeting-silence-first-summary", label: "ここまでを要約してみる", percentage: 14 },
          { id: "meeting-silence-first-clock", label: "時計の秒針を数え始める", percentage: 3 },
        ],
      },
      {
        id: "deadline-extra-day",
        prompt: "締切が突然1日延びた。どう使う？",
        choices: [
          { id: "deadline-extra-day-finish", label: "予定どおり今日中に終える", percentage: 40 },
          { id: "deadline-extra-day-polish", label: "完成度を上げる", percentage: 26 },
          { id: "deadline-extra-day-rest", label: "少し休んでから再開する", percentage: 19 },
          { id: "deadline-extra-day-rebuild", label: "構成から見直す", percentage: 10 },
          { id: "deadline-extra-day-celebrate", label: "延長を記念して先に祝う", percentage: 5 },
        ],
      },
      {
        id: "presentation-first-slide",
        prompt: "発表資料の1枚目、最初に何を置く？",
        choices: [
          { id: "presentation-first-slide-title", label: "シンプルなタイトル", percentage: 35 },
          { id: "presentation-first-slide-goal", label: "発表の目的", percentage: 30 },
          { id: "presentation-first-slide-image", label: "印象的な画像", percentage: 20 },
          { id: "presentation-first-slide-question", label: "聞き手への問いかけ", percentage: 13 },
          { id: "presentation-first-slide-empty", label: "あえて真っ白な1枚", percentage: 2 },
        ],
      },
      {
        id: "lunch-break-choice",
        prompt: "昼休みが30分だけ空いた。何をする？",
        choices: [
          { id: "lunch-break-choice-eat", label: "ゆっくり昼食をとる", percentage: 37 },
          { id: "lunch-break-choice-phone", label: "スマホを見て休む", percentage: 29 },
          { id: "lunch-break-choice-walk", label: "少し散歩する", percentage: 18 },
          { id: "lunch-break-choice-nap", label: "短い昼寝をする", percentage: 9 },
          { id: "lunch-break-choice-desk", label: "机の引き出しを整理する", percentage: 7 },
        ],
      },
      {
        id: "group-project-role",
        prompt: "グループ作業で役割を選べる。どれを選ぶ？",
        choices: [
          { id: "group-project-role-organizer", label: "全体を整理する進行役", percentage: 34 },
          { id: "group-project-role-builder", label: "実際に作る担当", percentage: 28 },
          { id: "group-project-role-research", label: "情報を調べる担当", percentage: 22 },
          { id: "group-project-role-review", label: "最後に確認する担当", percentage: 15 },
          { id: "group-project-role-name", label: "チーム名だけ全力で考える担当", percentage: 1 },
        ],
      },
    ],
  },
  {
    id: "daily-09-hobbies",
    title: "休日・趣味編",
    questions: [
      {
        id: "unexpected-free-night",
        prompt: "予定がなくなって夜が丸ごと空いた。何をする？",
        choices: [
          { id: "unexpected-free-night-video", label: "映画や動画を見る", percentage: 36 },
          { id: "unexpected-free-night-game", label: "ゲームをする", percentage: 29 },
          { id: "unexpected-free-night-read", label: "本や漫画を読む", percentage: 21 },
          { id: "unexpected-free-night-create", label: "何か作る", percentage: 11 },
          { id: "unexpected-free-night-map", label: "行く予定のない旅行計画を立てる", percentage: 3 },
        ],
      },
      {
        id: "new-hobby-budget",
        prompt: "新しい趣味に1万円だけ使える。何から始める？",
        choices: [
          { id: "new-hobby-budget-tools", label: "道具をそろえる", percentage: 33 },
          { id: "new-hobby-budget-trial", label: "体験教室へ行く", percentage: 31 },
          { id: "new-hobby-budget-book", label: "入門書や教材を買う", percentage: 22 },
          { id: "new-hobby-budget-used", label: "中古品から試す", percentage: 10 },
          { id: "new-hobby-budget-random", label: "くじ引きで趣味を決める", percentage: 4 },
        ],
      },
      {
        id: "game-backlog",
        prompt: "積んでいるゲームが増えてきた。次に遊ぶ1本はどう決める？",
        choices: [
          { id: "game-backlog-newest", label: "一番最近買ったもの", percentage: 39 },
          { id: "game-backlog-short", label: "短く終わりそうなもの", percentage: 27 },
          { id: "game-backlog-review", label: "評判が一番いいもの", percentage: 19 },
          { id: "game-backlog-oldest", label: "一番長く積んでいるもの", percentage: 13 },
          { id: "game-backlog-random", label: "乱数で1本選ぶ", percentage: 2 },
        ],
      },
      {
        id: "weekend-photo",
        prompt: "休日に写真を撮るなら、何を一番撮りたい？",
        choices: [
          { id: "weekend-photo-food", label: "食べ物", percentage: 35 },
          { id: "weekend-photo-scenery", label: "景色", percentage: 28 },
          { id: "weekend-photo-people", label: "一緒にいる人", percentage: 21 },
          { id: "weekend-photo-street", label: "街の何気ない風景", percentage: 10 },
          { id: "weekend-photo-shadow", label: "自分の影だけを撮る", percentage: 6 },
        ],
      },
      {
        id: "playlist-repeat",
        prompt: "お気に入りの曲を見つけた。しばらくどう聴く？",
        choices: [
          { id: "playlist-repeat-loop", label: "何度もリピートする", percentage: 42 },
          { id: "playlist-repeat-list", label: "プレイリストに入れる", percentage: 26 },
          { id: "playlist-repeat-artist", label: "同じアーティストを掘る", percentage: 17 },
          { id: "playlist-repeat-share", label: "誰かにおすすめする", percentage: 14 },
          { id: "playlist-repeat-alarm", label: "翌朝のアラーム音にする", percentage: 1 },
        ],
      },
    ],
  },
  {
    id: "daily-10-future-tech",
    title: "未来・テクノロジー編",
    questions: [
      {
        id: "household-robot",
        prompt: "家庭用ロボットに1つだけ得意技を持たせるなら？",
        choices: [
          { id: "household-robot-clean", label: "掃除", percentage: 40 },
          { id: "household-robot-cook", label: "料理", percentage: 25 },
          { id: "household-robot-laundry", label: "洗濯", percentage: 18 },
          { id: "household-robot-organize", label: "片付け", percentage: 14 },
          { id: "household-robot-joke", label: "絶妙なタイミングで冗談を言う", percentage: 3 },
        ],
      },
      {
        id: "future-transport",
        prompt: "未来の移動手段を1つ使えるなら？",
        choices: [
          { id: "future-transport-self-driving", label: "完全自動運転車", percentage: 37 },
          { id: "future-transport-flying", label: "空飛ぶ乗り物", percentage: 29 },
          { id: "future-transport-tube", label: "超高速チューブ交通", percentage: 19 },
          { id: "future-transport-walk", label: "強化スーツで高速歩行", percentage: 11 },
          { id: "future-transport-chair", label: "どこへでも動く自分専用の椅子", percentage: 4 },
        ],
      },
      {
        id: "memory-backup",
        prompt: "自分の記憶を1種類だけバックアップできる。何を残す？",
        choices: [
          { id: "memory-backup-family", label: "大切な人との思い出", percentage: 36 },
          { id: "memory-backup-skill", label: "身につけた知識や技能", percentage: 27 },
          { id: "memory-backup-travel", label: "旅行や特別な日の記憶", percentage: 21 },
          { id: "memory-backup-small", label: "何気ない日常の記憶", percentage: 14 },
          { id: "memory-backup-dream", label: "起きたら忘れる夢だけ保存する", percentage: 2 },
        ],
      },
      {
        id: "smart-home-failure",
        prompt: "家中がスマート化された日にネットが止まった。最初にどうする？",
        choices: [
          { id: "smart-home-failure-router", label: "ルーターを確認する", percentage: 39 },
          { id: "smart-home-failure-manual", label: "手動で使える物を確認する", percentage: 30 },
          { id: "smart-home-failure-phone", label: "スマホ回線でしのぐ", percentage: 17 },
          { id: "smart-home-failure-out", label: "復旧まで外出する", percentage: 9 },
          { id: "smart-home-failure-candle", label: "なぜかロウソクを並べ始める", percentage: 5 },
        ],
      },
      {
        id: "future-job-partner",
        prompt: "未来の仕事でAIと組むなら、どんな役割を任せたい？",
        choices: [
          { id: "future-job-partner-routine", label: "定型作業", percentage: 34 },
          { id: "future-job-partner-research", label: "情報収集", percentage: 28 },
          { id: "future-job-partner-draft", label: "たたき台作り", percentage: 22 },
          { id: "future-job-partner-review", label: "抜け漏れチェック", percentage: 15 },
          { id: "future-job-partner-break", label: "休憩するタイミングの判断", percentage: 1 },
        ],
      },
    ],
  },
];
