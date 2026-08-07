import type { QuestionSet } from "./game";

export const extraQuestionSets: QuestionSet[] = [
  {
    id: "daily-04-digital",
    title: "デジタル生活編",
    questions: [
      {
        id: "notification-overflow",
        prompt: "スマホを開いたら通知が20件。最初にどうする？",
        choices: [
          { id: "notification-overflow-all", label: "上から全部確認する", percentage: 44 },
          { id: "notification-overflow-important", label: "大事そうな通知だけ見る", percentage: 31 },
          { id: "notification-overflow-clear", label: "いったん全部消す", percentage: 13 },
          { id: "notification-overflow-later", label: "スマホを閉じて後回しにする", percentage: 8 },
          { id: "notification-overflow-count", label: "種類ごとに件数を数える", percentage: 4 },
        ],
      },
      {
        id: "phone-battery-one-percent",
        prompt: "外出先でスマホの充電が残り1%。どうする？",
        choices: [
          { id: "phone-battery-one-percent-save", label: "省電力モードにする", percentage: 37 },
          { id: "phone-battery-one-percent-charge", label: "充電できる場所を探す", percentage: 34 },
          { id: "phone-battery-one-percent-stop", label: "必要になるまで使わない", percentage: 18 },
          { id: "phone-battery-one-percent-ask", label: "知人に充電器を借りる", percentage: 9 },
          { id: "phone-battery-one-percent-photo", label: "最後に1枚だけ写真を撮る", percentage: 2 },
        ],
      },
      {
        id: "group-chat-silence",
        prompt: "グループチャットで自分の発言後に会話が止まった。どうする？",
        choices: [
          { id: "group-chat-silence-wait", label: "気にせず待つ", percentage: 41 },
          { id: "group-chat-silence-sticker", label: "スタンプを1つ送る", percentage: 28 },
          { id: "group-chat-silence-topic", label: "別の話題を出す", percentage: 16 },
          { id: "group-chat-silence-close", label: "チャットを閉じて忘れる", percentage: 12 },
          { id: "group-chat-silence-second", label: "すぐ補足メッセージを送る", percentage: 3 },
        ],
      },
      {
        id: "ai-one-task",
        prompt: "AIに毎日1つだけ任せられるなら、何を頼む？",
        choices: [
          { id: "ai-one-task-schedule", label: "予定整理", percentage: 32 },
          { id: "ai-one-task-summary", label: "長い文章の要約", percentage: 29 },
          { id: "ai-one-task-meal", label: "今日の献立決め", percentage: 21 },
          { id: "ai-one-task-playlist", label: "気分に合う音楽選び", percentage: 15 },
          { id: "ai-one-task-praise", label: "毎朝ひとこと褒めてもらう", percentage: 3 },
        ],
      },
      {
        id: "new-password-memory",
        prompt: "新しいパスワードを覚えるなら、どの方法が合いそう？",
        choices: [
          { id: "new-password-memory-manager", label: "パスワード管理アプリに任せる", percentage: 39 },
          { id: "new-password-memory-phrase", label: "長いフレーズで覚える", percentage: 27 },
          { id: "new-password-memory-note", label: "安全な場所にメモする", percentage: 18 },
          { id: "new-password-memory-rule", label: "自分だけの覚え方を決める", percentage: 15 },
          { id: "new-password-memory-song", label: "メロディーにして覚える", percentage: 1 },
        ],
      },
    ],
  },
  {
    id: "daily-05-food",
    title: "食べもの気分編",
    questions: [
      {
        id: "late-night-snack",
        prompt: "夜遅くに少しだけお腹が空いた。何を選ぶ？",
        choices: [
          { id: "late-night-snack-ramen", label: "ラーメン", percentage: 35 },
          { id: "late-night-snack-icecream", label: "アイス", percentage: 27 },
          { id: "late-night-snack-onigiri", label: "おにぎり", percentage: 22 },
          { id: "late-night-snack-fruit", label: "果物", percentage: 13 },
          { id: "late-night-snack-water", label: "白湯だけ飲む", percentage: 3 },
        ],
      },
      {
        id: "convenience-dessert",
        prompt: "コンビニでデザートを1つ買うなら？",
        choices: [
          { id: "convenience-dessert-pudding", label: "プリン", percentage: 31 },
          { id: "convenience-dessert-icecream", label: "アイス", percentage: 33 },
          { id: "convenience-dessert-cake", label: "ケーキ", percentage: 20 },
          { id: "convenience-dessert-wagashi", label: "和菓子", percentage: 11 },
          { id: "convenience-dessert-jelly", label: "ゼリー", percentage: 5 },
        ],
      },
      {
        id: "pizza-last-slice",
        prompt: "みんなで食べているピザが最後の1切れ。どうする？",
        choices: [
          { id: "pizza-last-slice-take", label: "普通に食べる", percentage: 44 },
          { id: "pizza-last-slice-offer", label: "誰かに譲る", percentage: 28 },
          { id: "pizza-last-slice-split", label: "半分に分ける", percentage: 17 },
          { id: "pizza-last-slice-game", label: "じゃんけんで決める", percentage: 10 },
          { id: "pizza-last-slice-measure", label: "定規で完全に等分する", percentage: 1 },
        ],
      },
      {
        id: "breakfast-one-choice",
        prompt: "朝食を毎日1種類だけにするなら？",
        choices: [
          { id: "breakfast-one-choice-rice", label: "ごはんとおかず", percentage: 29 },
          { id: "breakfast-one-choice-bread", label: "パン", percentage: 40 },
          { id: "breakfast-one-choice-cereal", label: "シリアル", percentage: 16 },
          { id: "breakfast-one-choice-yogurt", label: "ヨーグルト", percentage: 12 },
          { id: "breakfast-one-choice-miso", label: "みそ汁だけ", percentage: 3 },
        ],
      },
      {
        id: "menu-photo-different",
        prompt: "メニュー写真が全部おいしそう。最後はどう決める？",
        choices: [
          { id: "menu-photo-different-favorite", label: "いつもの好みで選ぶ", percentage: 36 },
          { id: "menu-photo-different-new", label: "食べたことがない物にする", percentage: 24 },
          { id: "menu-photo-different-staff", label: "店員のおすすめを聞く", percentage: 18 },
          { id: "menu-photo-different-review", label: "口コミを見比べる", percentage: 17 },
          { id: "menu-photo-different-random", label: "目を閉じて指差しで決める", percentage: 5 },
        ],
      },
    ],
  },
  {
    id: "daily-06-outing",
    title: "おでかけ編",
    questions: [
      {
        id: "free-afternoon",
        prompt: "予定のない午後ができた。どこへ行く？",
        choices: [
          { id: "free-afternoon-cafe", label: "カフェ", percentage: 32 },
          { id: "free-afternoon-shopping", label: "買い物", percentage: 25 },
          { id: "free-afternoon-park", label: "公園", percentage: 19 },
          { id: "free-afternoon-movie", label: "映画館", percentage: 21 },
          { id: "free-afternoon-station", label: "駅で人の流れを眺める", percentage: 3 },
        ],
      },
      {
        id: "train-seat-choice",
        prompt: "長時間の電車で好きな場所を選べる。どこに座る？",
        choices: [
          { id: "train-seat-choice-window", label: "窓側", percentage: 39 },
          { id: "train-seat-choice-aisle", label: "通路側", percentage: 31 },
          { id: "train-seat-choice-door", label: "ドアに近い席", percentage: 18 },
          { id: "train-seat-choice-center", label: "車両の真ん中", percentage: 10 },
          { id: "train-seat-choice-stand", label: "空いていても立つ", percentage: 2 },
        ],
      },
      {
        id: "sudden-rain-outside",
        prompt: "外出中に急な雨。傘を持っていない。どうする？",
        choices: [
          { id: "sudden-rain-outside-buy", label: "傘を買う", percentage: 38 },
          { id: "sudden-rain-outside-run", label: "目的地まで走る", percentage: 27 },
          { id: "sudden-rain-outside-wait", label: "雨宿りして待つ", percentage: 21 },
          { id: "sudden-rain-outside-wet", label: "気にせず歩く", percentage: 11 },
          { id: "sudden-rain-outside-dance", label: "雨の中で少し踊る", percentage: 3 },
        ],
      },
      {
        id: "travel-plan-style",
        prompt: "旅行の予定はどこまで決めておきたい？",
        choices: [
          { id: "travel-plan-style-detail", label: "時間単位で細かく決める", percentage: 28 },
          { id: "travel-plan-style-must", label: "行きたい場所だけ決める", percentage: 37 },
          { id: "travel-plan-style-local", label: "現地でおすすめを聞く", percentage: 17 },
          { id: "travel-plan-style-random", label: "ほぼノープランで行く", percentage: 15 },
          { id: "travel-plan-style-first", label: "最初に来た乗り物で方向を決める", percentage: 3 },
        ],
      },
      {
        id: "hotel-room-first",
        prompt: "ホテルの部屋に入って最初にすることは？",
        choices: [
          { id: "hotel-room-first-bed", label: "ベッドに座る", percentage: 32 },
          { id: "hotel-room-first-wifi", label: "Wi-Fiを確認する", percentage: 24 },
          { id: "hotel-room-first-view", label: "窓から景色を見る", percentage: 22 },
          { id: "hotel-room-first-bath", label: "お風呂や洗面所を見る", percentage: 21 },
          { id: "hotel-room-first-exit", label: "非常口案内を最初から熟読する", percentage: 1 },
        ],
      },
    ],
  },
  {
    id: "daily-07-odd",
    title: "ちょっと変な日常編",
    questions: [
      {
        id: "talking-vending-machine",
        prompt: "自販機が急に「今日もお疲れさま」と話しかけてきた。どうする？",
        choices: [
          { id: "talking-vending-machine-thanks", label: "ありがとうと返す", percentage: 36 },
          { id: "talking-vending-machine-ignore", label: "聞かなかったことにする", percentage: 31 },
          { id: "talking-vending-machine-bow", label: "軽くお辞儀する", percentage: 18 },
          { id: "talking-vending-machine-question", label: "どうして話せるのか聞く", percentage: 13 },
          { id: "talking-vending-machine-sorry", label: "なぜか先に謝る", percentage: 2 },
        ],
      },
      {
        id: "mismatched-socks",
        prompt: "外出後に左右違う靴下だと気づいた。どうする？",
        choices: [
          { id: "mismatched-socks-change", label: "可能なら履き替える", percentage: 43 },
          { id: "mismatched-socks-keep", label: "そのまま過ごす", percentage: 29 },
          { id: "mismatched-socks-style", label: "最初から狙ったことにする", percentage: 16 },
          { id: "mismatched-socks-hide", label: "なるべく見えないようにする", percentage: 9 },
          { id: "mismatched-socks-name", label: "左右の靴下に名前を付ける", percentage: 3 },
        ],
      },
      {
        id: "backward-chair",
        prompt: "誰もいない部屋で椅子が1脚だけ逆向き。どうする？",
        choices: [
          { id: "backward-chair-fix", label: "正しい向きに戻す", percentage: 40 },
          { id: "backward-chair-ignore", label: "気にせずそのままにする", percentage: 28 },
          { id: "backward-chair-sit", label: "逆向きのまま座る", percentage: 18 },
          { id: "backward-chair-photo", label: "写真を撮る", percentage: 13 },
          { id: "backward-chair-name", label: "椅子に名前を付ける", percentage: 1 },
        ],
      },
      {
        id: "mystery-elevator-floor",
        prompt: "エレベーターに見覚えのない階のボタンが1つ増えている。どうする？",
        choices: [
          { id: "mystery-elevator-floor-no", label: "絶対に押さない", percentage: 42 },
          { id: "mystery-elevator-floor-curious", label: "気になって押す", percentage: 25 },
          { id: "mystery-elevator-floor-photo", label: "写真だけ撮る", percentage: 14 },
          { id: "mystery-elevator-floor-ask", label: "誰かに知っているか聞く", percentage: 16 },
          { id: "mystery-elevator-floor-twice", label: "念のため2回押す", percentage: 3 },
        ],
      },
      {
        id: "open-fridge-thinking",
        prompt: "冷蔵庫を開けたのに何を取りたかったか忘れた。どうする？",
        choices: [
          { id: "open-fridge-thinking-close", label: "いったん閉める", percentage: 45 },
          { id: "open-fridge-thinking-organize", label: "ついでに中を整理する", percentage: 26 },
          { id: "open-fridge-thinking-drink", label: "とりあえず飲み物を取る", percentage: 18 },
          { id: "open-fridge-thinking-stare", label: "思い出すまで眺める", percentage: 8 },
          { id: "open-fridge-thinking-greet", label: "冷蔵庫に挨拶して閉める", percentage: 3 },
        ],
      },
    ],
  },
];
