import type { QuestionSet } from "./game";

export const questionSets11To15: QuestionSet[] = [
  {
    id: "daily-11-transport",
    title: "乗り物・移動編",
    questions: [
      {
        id: "train-seat-choice",
        prompt: "電車で好きな場所を自由に選べる。どこに座る？",
        choices: [
          { id: "train-seat-choice-window", label: "窓側の席", percentage: 37 },
          { id: "train-seat-choice-aisle", label: "通路側の席", percentage: 24 },
          { id: "train-seat-choice-door", label: "ドアに近い席", percentage: 21 },
          { id: "train-seat-choice-stand", label: "空いていても立つ", percentage: 15 },
          { id: "train-seat-choice-end", label: "車両のいちばん端まで行く", percentage: 3 },
        ],
      },
      {
        id: "commute-delay",
        prompt: "いつもの移動ルートが20分遅延。最初にどうする？",
        choices: [
          { id: "commute-delay-route", label: "別ルートを探す", percentage: 34 },
          { id: "commute-delay-wait", label: "そのまま待つ", percentage: 29 },
          { id: "commute-delay-contact", label: "到着が遅れると連絡する", percentage: 20 },
          { id: "commute-delay-cafe", label: "近くで時間をつぶす", percentage: 12 },
          { id: "commute-delay-walk", label: "一駅ぶん歩き始める", percentage: 5 },
        ],
      },
      {
        id: "road-trip-role",
        prompt: "4人で長距離ドライブ。担当するなら？",
        choices: [
          { id: "road-trip-role-driver", label: "運転", percentage: 31 },
          { id: "road-trip-role-navigation", label: "道案内", percentage: 28 },
          { id: "road-trip-role-music", label: "音楽選び", percentage: 23 },
          { id: "road-trip-role-snacks", label: "飲み物・お菓子係", percentage: 15 },
          { id: "road-trip-role-sleep", label: "寝て体力を温存する係", percentage: 3 },
        ],
      },
      {
        id: "bicycle-route",
        prompt: "自転車で知らない街を走る。ルートはどう選ぶ？",
        choices: [
          { id: "bicycle-route-short", label: "最短ルート", percentage: 36 },
          { id: "bicycle-route-safe", label: "走りやすく安全な道", percentage: 29 },
          { id: "bicycle-route-scenery", label: "景色がよさそうな道", percentage: 18 },
          { id: "bicycle-route-shortcut", label: "地図にない近道を試す", percentage: 12 },
          { id: "bicycle-route-loop", label: "同じ道を一周してから決める", percentage: 5 },
        ],
      },
      {
        id: "station-extra-time",
        prompt: "駅に30分早く着いた。何をする？",
        choices: [
          { id: "station-extra-time-cafe", label: "カフェに入る", percentage: 33 },
          { id: "station-extra-time-shop", label: "駅のお店を見る", percentage: 26 },
          { id: "station-extra-time-platform", label: "早めにホームへ行く", percentage: 21 },
          { id: "station-extra-time-walk", label: "駅の周りを歩く", percentage: 17 },
          { id: "station-extra-time-count", label: "通る電車を数える", percentage: 3 },
        ],
      },
    ],
  },
  {
    id: "daily-12-shopping-money",
    title: "買い物・お金編",
    questions: [
      {
        id: "sudden-coupon",
        prompt: "今日だけ使える20%OFFクーポンをもらった。どうする？",
        choices: [
          { id: "sudden-coupon-planned", label: "予定していた物を買う", percentage: 39 },
          { id: "sudden-coupon-stock", label: "日用品をまとめ買いする", percentage: 26 },
          { id: "sudden-coupon-treat", label: "少し高い物を試す", percentage: 18 },
          { id: "sudden-coupon-skip", label: "必要な物がなければ使わない", percentage: 12 },
          { id: "sudden-coupon-gift", label: "誰かへの小さなプレゼントを買う", percentage: 5 },
        ],
      },
      {
        id: "wallet-cash",
        prompt: "財布に現金を入れておくなら、どんな持ち方？",
        choices: [
          { id: "wallet-cash-card", label: "基本はキャッシュレス", percentage: 43 },
          { id: "wallet-cash-emergency", label: "緊急用に少しだけ現金", percentage: 25 },
          { id: "wallet-cash-coins", label: "小銭もある程度持つ", percentage: 14 },
          { id: "wallet-cash-split", label: "現金とカードを半々で使う", percentage: 11 },
          { id: "wallet-cash-exact", label: "よく使う金額を細かくそろえる", percentage: 7 },
        ],
      },
      {
        id: "impulse-buy",
        prompt: "予定外だけどかなり欲しい物を見つけた。どうする？",
        choices: [
          { id: "impulse-buy-wait", label: "一晩考える", percentage: 34 },
          { id: "impulse-buy-compare", label: "価格やレビューを比較する", percentage: 29 },
          { id: "impulse-buy-now", label: "予算内ならその場で買う", percentage: 22 },
          { id: "impulse-buy-friend", label: "誰かに相談する", percentage: 12 },
          { id: "impulse-buy-coin", label: "コイントスで決める", percentage: 3 },
        ],
      },
      {
        id: "gift-budget",
        prompt: "同じ予算でプレゼントを選ぶなら、何を優先する？",
        choices: [
          { id: "gift-budget-practical", label: "普段使える実用品", percentage: 32 },
          { id: "gift-budget-wanted", label: "相手が欲しがっていた物", percentage: 31 },
          { id: "gift-budget-experience", label: "食事や体験", percentage: 20 },
          { id: "gift-budget-handmade", label: "手作りやメッセージ", percentage: 14 },
          { id: "gift-budget-mystery", label: "中身が分からない謎ギフト", percentage: 3 },
        ],
      },
      {
        id: "price-drop-after-buy",
        prompt: "昨日買った物が今日だけ値下げされていた。どうする？",
        choices: [
          { id: "price-drop-after-buy-accept", label: "タイミングの差だと割り切る", percentage: 38 },
          { id: "price-drop-after-buy-rebuy", label: "返品・買い直しが可能か確認する", percentage: 26 },
          { id: "price-drop-after-buy-store", label: "お店の価格調整制度を調べる", percentage: 16 },
          { id: "price-drop-after-buy-ignore", label: "しばらく価格を見ない", percentage: 17 },
          { id: "price-drop-after-buy-celebrate", label: "誰かが安く買えることを祝う", percentage: 3 },
        ],
      },
    ],
  },
  {
    id: "daily-13-communication",
    title: "コミュニケーション編",
    questions: [
      {
        id: "unread-message",
        prompt: "返信が必要なメッセージに気づいた。どう返す？",
        choices: [
          { id: "unread-message-quick", label: "短くてもすぐ返信する", percentage: 35 },
          { id: "unread-message-later", label: "落ち着いてから返信する", percentage: 30 },
          { id: "unread-message-reaction", label: "まずリアクションだけ返す", percentage: 18 },
          { id: "unread-message-call", label: "電話した方が早ければ電話する", percentage: 12 },
          { id: "unread-message-draft", label: "長文を書いて一度全部消す", percentage: 5 },
        ],
      },
      {
        id: "group-chat-topic",
        prompt: "グループチャットで話題が止まった。どうする？",
        choices: [
          { id: "group-chat-topic-reply", label: "直前の話題に返信する", percentage: 34 },
          { id: "group-chat-topic-watch", label: "しばらく様子を見る", percentage: 29 },
          { id: "group-chat-topic-new", label: "別の話題を出す", percentage: 20 },
          { id: "group-chat-topic-emoji", label: "絵文字だけ送る", percentage: 14 },
          { id: "group-chat-topic-sticker", label: "文脈のないスタンプを1個送る", percentage: 3 },
        ],
      },
      {
        id: "first-meeting-topic",
        prompt: "初対面の人と2人きり。最初の話題は？",
        choices: [
          { id: "first-meeting-topic-hobby", label: "趣味", percentage: 36 },
          { id: "first-meeting-topic-weather", label: "天気", percentage: 27 },
          { id: "first-meeting-topic-work", label: "仕事や学校", percentage: 20 },
          { id: "first-meeting-topic-food", label: "好きな食べ物", percentage: 13 },
          { id: "first-meeting-topic-silence", label: "沈黙が何秒続くか観察する", percentage: 4 },
        ],
      },
      {
        id: "small-disagreement",
        prompt: "友達と小さな意見の違い。どう進める？",
        choices: [
          { id: "small-disagreement-explain", label: "自分の考えを説明する", percentage: 33 },
          { id: "small-disagreement-ask", label: "相手の理由を先に聞く", percentage: 30 },
          { id: "small-disagreement-pause", label: "一度話題を置く", percentage: 20 },
          { id: "small-disagreement-compromise", label: "中間案を探す", percentage: 14 },
          { id: "small-disagreement-rps", label: "じゃんけんで決める", percentage: 3 },
        ],
      },
      {
        id: "voice-message",
        prompt: "友達から長めのボイスメッセージが届いた。どう返す？",
        choices: [
          { id: "voice-message-text", label: "文章で返信する", percentage: 37 },
          { id: "voice-message-voice", label: "自分も音声で返す", percentage: 21 },
          { id: "voice-message-call", label: "そのまま電話する", percentage: 18 },
          { id: "voice-message-later", label: "時間がある時に聞き直して返す", percentage: 19 },
          { id: "voice-message-note", label: "要点をメモに起こしてから返す", percentage: 5 },
        ],
      },
    ],
  },
  {
    id: "daily-14-season-events",
    title: "季節・イベント編",
    questions: [
      {
        id: "summer-festival-first",
        prompt: "夏祭りに到着。最初に向かうのは？",
        choices: [
          { id: "summer-festival-first-food", label: "食べ物の屋台", percentage: 34 },
          { id: "summer-festival-first-fireworks", label: "花火が見やすい場所", percentage: 28 },
          { id: "summer-festival-first-game", label: "ゲーム系の屋台", percentage: 23 },
          { id: "summer-festival-first-walk", label: "まず会場を一周する", percentage: 12 },
          { id: "summer-festival-first-map", label: "案内図を全部読んでから動く", percentage: 3 },
        ],
      },
      {
        id: "rainy-holiday",
        prompt: "休日が朝から雨。どう過ごしたい？",
        choices: [
          { id: "rainy-holiday-home", label: "家でのんびりする", percentage: 38 },
          { id: "rainy-holiday-cafe", label: "近くのカフェへ行く", percentage: 25 },
          { id: "rainy-holiday-movie", label: "映画館や屋内施設へ行く", percentage: 18 },
          { id: "rainy-holiday-walk", label: "傘をさして散歩する", percentage: 14 },
          { id: "rainy-holiday-puddle", label: "水たまりの写真を撮りに行く", percentage: 5 },
        ],
      },
      {
        id: "first-snow",
        prompt: "今年最初の雪が降った。最初にしたいことは？",
        choices: [
          { id: "first-snow-watch", label: "窓から眺める", percentage: 35 },
          { id: "first-snow-photo", label: "写真を撮る", percentage: 27 },
          { id: "first-snow-walk", label: "少し外を歩く", percentage: 21 },
          { id: "first-snow-drink", label: "温かい飲み物を用意する", percentage: 14 },
          { id: "first-snow-measure", label: "雪が何ミリ積もるか測り始める", percentage: 3 },
        ],
      },
      {
        id: "birthday-style",
        prompt: "自分の誕生日を過ごすなら、どんな感じがいい？",
        choices: [
          { id: "birthday-style-meal", label: "好きな物を食べる", percentage: 33 },
          { id: "birthday-style-friends", label: "家族や友達と過ごす", percentage: 29 },
          { id: "birthday-style-gift", label: "自分へのプレゼントを買う", percentage: 22 },
          { id: "birthday-style-normal", label: "いつもどおり静かに過ごす", percentage: 13 },
          { id: "birthday-style-challenge", label: "毎年ひとつ新しい挑戦をする", percentage: 3 },
        ],
      },
      {
        id: "new-year-first",
        prompt: "新年になって最初にしたいことは？",
        choices: [
          { id: "new-year-first-sleep", label: "ゆっくり寝る", percentage: 31 },
          { id: "new-year-first-shrine", label: "初詣に行く", percentage: 28 },
          { id: "new-year-first-food", label: "お正月らしい物を食べる", percentage: 24 },
          { id: "new-year-first-goal", label: "今年の目標を書く", percentage: 14 },
          { id: "new-year-first-seconds", label: "元日が始まってからの秒数を数える", percentage: 3 },
        ],
      },
    ],
  },
  {
    id: "daily-15-entertainment",
    title: "ゲーム・エンタメ編",
    questions: [
      {
        id: "movie-seat",
        prompt: "映画館の席を自由に選べる。どこにする？",
        choices: [
          { id: "movie-seat-center", label: "中央あたり", percentage: 39 },
          { id: "movie-seat-back", label: "後方", percentage: 27 },
          { id: "movie-seat-aisle", label: "通路側", percentage: 18 },
          { id: "movie-seat-side", label: "端の落ち着く席", percentage: 13 },
          { id: "movie-seat-front", label: "最前列", percentage: 3 },
        ],
      },
      {
        id: "game-character-style",
        prompt: "ゲームで最初に選ぶキャラクタータイプは？",
        choices: [
          { id: "game-character-style-balanced", label: "万能なバランス型", percentage: 32 },
          { id: "game-character-style-power", label: "一撃が重いパワー型", percentage: 28 },
          { id: "game-character-style-speed", label: "素早いスピード型", percentage: 22 },
          { id: "game-character-style-technical", label: "操作が難しいテクニカル型", percentage: 15 },
          { id: "game-character-style-joke", label: "性能より見た目が面白いキャラ", percentage: 3 },
        ],
      },
      {
        id: "spoiler-avoidance",
        prompt: "楽しみにしている作品のネタバレを避けたい。どうする？",
        choices: [
          { id: "spoiler-avoidance-mute", label: "関連ワードをミュートする", percentage: 35 },
          { id: "spoiler-avoidance-finish", label: "できるだけ早く自分で見る", percentage: 28 },
          { id: "spoiler-avoidance-social", label: "SNSをしばらく見ない", percentage: 20 },
          { id: "spoiler-avoidance-accept", label: "多少は気にしない", percentage: 12 },
          { id: "spoiler-avoidance-decoy", label: "友達に偽ネタバレだけ送ってもらう", percentage: 5 },
        ],
      },
      {
        id: "live-show-position",
        prompt: "ライブやステージを見るなら、どの位置が好き？",
        choices: [
          { id: "live-show-position-center", label: "中央でしっかり見る", percentage: 36 },
          { id: "live-show-position-front", label: "できるだけ前", percentage: 26 },
          { id: "live-show-position-back", label: "後方で全体を見る", percentage: 20 },
          { id: "live-show-position-side", label: "端で自分のペースで楽しむ", percentage: 15 },
          { id: "live-show-position-exit", label: "出口の近さを最優先する", percentage: 3 },
        ],
      },
      {
        id: "series-watch-style",
        prompt: "全10話の面白そうなシリーズを見つけた。どう見る？",
        choices: [
          { id: "series-watch-style-daily", label: "1日1〜2話ずつ見る", percentage: 34 },
          { id: "series-watch-style-binge", label: "一気に最後まで見る", percentage: 27 },
          { id: "series-watch-style-weekend", label: "週末にまとめて見る", percentage: 23 },
          { id: "series-watch-style-mood", label: "気が向いた時だけ見る", percentage: 13 },
          { id: "series-watch-style-finale", label: "最終話だけ先に見る", percentage: 3 },
        ],
      },
    ],
  },
];
