/* Joy — every word on the page in both languages, and everything that moves. */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Store links. Paste each one in once Joy is live there, and its "Coming soon"
  // button becomes a download link everywhere on the page.
  // ---------------------------------------------------------------------------
  var STORE = {
    appStore: '',
    googlePlay: ''
  };

  var C = window.JoyCards;
  var DECK = window.JOY_DECK;
  var GAMES = C.GAMES;
  var root = document.documentElement;
  var still = C.still;

  // ---------------------------------------------------------------------------
  // Copy. English is the source and Georgian is written alongside it, the way
  // the app does it: the polite plural, never upper-cased, „…“ quotes. Where the
  // app already has the line (Localizable.xcstrings), the page uses it word for
  // word. "\n" breaks a line, *stars* light a word, _underscores_ dim one.
  // ---------------------------------------------------------------------------
  var STRINGS = {
    en: {
      page_title: 'Joy · Eight games. One phone.',
      skip: 'Skip to content',
      nav_a11y: 'Sections', nav_how: 'How it works', nav_games: 'Games', nav_cards: 'Cards', nav_faq: 'Questions', nav_get: 'Get Joy',
      fan_a11y: 'The eight games, fanned out like a hand of cards',
      hero_l: 'Eight games.', hero_r: 'One phone.',
      hero_lede: 'Everything for a great night with friends. No accounts, nothing to set up.',
      hero_note: 'For iPhone and Android, in English and Georgian',
      store_soon: 'Coming soon', store_apple_small: 'Download on the', store_google_small: 'Get it on',

      how_label: 'How a night goes', how_title: 'Three steps.\n_Then just play._',
      step1_t: 'Add your friends',
      step1_x: 'Type a name and Joy gives them a colour of their own. Everyone stays saved, and a tap sits someone out for the night.',
      step1_count: '%1 of %2 playing', step1_toggle: '%s is playing tonight', step1_add: 'Add player',
      step2_t: 'Pick a game',
      step2_x: 'Flick through the deck, choose how long and how bold, and start. Or let Joy surprise you.',
      step3_t: 'Pass the phone around',
      step3_x: 'Joy says whose turn it is, deals the card, keeps the score, and crowns a winner at the end.',
      your_turn: 'Your turn',

      games_label: 'The games', games_title: 'What are we playing?',
      games_text: 'Eight games, each on a card of its own with an illustration that moves. Turn a card over to see how it plays.',
      surprise: 'Surprise me', prev_a11y: 'Previous game', next_a11y: 'Next game',
      how_to_play: 'How to play', min_players: 'At least %s players', card_open_a11y: '%s: how to play', card_close_a11y: '%s: turn back',
      levels: 'Light, Bold or 18+',

      cards_label: 'The cards', cards_title: 'Pick a deck.\n_Read it out loud._',
      cards_text: 'About 3,000 cards, written separately in English and Georgian rather than translated. Every deck remembers what it has dealt, so the next night starts with cards nobody has seen.',
      picker_a11y: 'Game', seg_a11y: 'Intensity',
      intensity_light: 'Light', intensity_bold: 'Bold',
      intensity_light_caption: 'Easygoing cards for any company',
      intensity_bold_caption: 'More personal and more daring, for friends who know each other well',
      intensity_adult_caption: 'Flirting, dating, and nights out. For adults only.',
      adult_title: 'Is everyone here over 18?',
      adult_text: "These cards are about flirting, dating, and drinking. We'll only ask once.",
      adult_yes: 'Yes, everyone is', adult_no: 'Cancel',
      truth: 'Truth', dare: 'Dare', card_no: 'No. %s', wyr_or: 'or', opt_a: 'A', opt_b: 'B',
      cap_turn: 'Your turn', cap_wyr: 'What would they pick?', cap_hot: 'In the hot seat',
      hint_nhie: 'Who has? They lose a finger', hint_mlt: 'On three, everyone point',
      deal_hint: 'Tap or swipe for the next one', deal_a11y: 'Next card',

      end_label: 'Game over', end_title: 'Every winner\n_gets a title._',
      end_text: "Pick how long to play before you start, and a hairline at the top shows how far there is to go. At the end, the winner's card is dealt and turned over, then come the final standings and Play again.",
      awards_a11y: 'Titles',
      award_bravest: 'The bravest', award_best_performer: 'Best performer', award_last_standing: 'Last one standing',
      award_mind_reader: 'Mind reader', award_groups_pick: "The group's pick", award_hot_seat: 'Everyone survived the hot seat',
      award_best_team: 'Masters of words', award_sharpest: 'Sharpest mind',
      score_dares: '%s dares', score_points: '%s points', score_fingers: '%s fingers left',
      team_b: 'Team B',

      no_label: 'Just the room', no_a11y: "What Joy doesn't need",
      no_1: 'No account', no_2: 'No sign-in', no_3: 'No ads', no_4: 'No internet',
      no_end: 'Just friends, and *one phone*',
      pv1_t: 'Nothing leaves the phone', pv1_x: 'Names, colours and settings are kept on the device and nowhere else. Joy has no server to send them to.',
      pv2_t: 'Plays anywhere', pv2_x: 'In the mountains, on a plane, in a basement with no signal. Every card is already on the phone.',
      pv3_t: 'Nobody watching', pv3_x: 'No analytics, no ad SDKs, no trackers. The only people watching the game are the ones playing it.',
      pv4_t: '18+ asks first', pv4_x: 'Before its first card is dealt, the 18+ deck asks once whether everyone is over 18.',
      pv_link: 'Read the privacy policy',

      faq_label: 'Questions', faq_title: 'Good to know', faq_more: 'Something else?', faq_support: 'Visit support',
      q1: 'How many people can play?',
      a1: 'Two to sixteen. Most games start at two; Most Likely To, Hot Seat and Spy need three, and Alias needs four, for two teams.',
      q2: 'Do we need an internet connection?',
      a2: "No. Everything Joy needs is already on the phone, so it plays the same in a basement as it does at home. There's no account and nothing to sign in to.",
      q3: 'Will we see the same cards again?',
      a3: "Not for a long while. Every deck remembers what it has dealt, across nights, and deals what your group hasn't seen first. Once you've been through a whole deck, it starts over.",
      q4: 'Is Joy in Georgian?',
      a4: 'Fully. Switch between English and Georgian in Settings and everything changes at once, cards included. The Georgian cards were written in Georgian, for Georgian tables, not translated.',
      q5: "What's in the 18+ decks?",
      a5: "Flirting, dating and nights out: suggestive, never explicit, and a physical dare always asks for the other person's agreement. Joy asks once whether everyone is over 18.",
      q6: 'How long does a game take?',
      a6: 'As long as you like. Before you start, pick Short, Standard or Long, and a hairline at the top shows how far there is to go.',
      q7: 'iPhone or Android?',
      a7: 'Both, with the same games, the same cards and the same look.',

      fi_title: "Let's play.",
      fi_soon: 'Joy is coming to iPhone and Android. Bring the friends; the games are on us.',
      fi_live: 'Joy is on the App Store and Google Play. Bring the friends; the games are on us.',
      row_a11y: '%s: see the game',
      foot_a11y: 'More', footer_privacy: 'Privacy policy', footer_support: 'Support', footer_made: 'Made for great nights with friends'
    },
    ka: {
      page_title: 'Joy · რვა თამაში. ერთი ტელეფონი.',
      skip: 'შინაარსზე გადასვლა',
      nav_a11y: 'სექციები', nav_how: 'როგორ მუშაობს', nav_games: 'თამაშები', nav_cards: 'ბარათები', nav_faq: 'კითხვები', nav_get: 'ჩამოტვირთვა',
      fan_a11y: 'რვა თამაში, ხელში გაშლილი ბარათებივით',
      hero_l: 'რვა თამაში.', hero_r: 'ერთი ტელეფონი.',
      hero_lede: 'ყველაფერი მეგობრებთან კარგი საღამოსთვის — რეგისტრაციისა და მომზადების გარეშე.',
      hero_note: 'iPhone‑სა და Android‑ზე, ქართულად და ინგლისურად',
      store_soon: 'მალე', store_apple_small: 'ჩამოტვირთეთ', store_google_small: 'ჩამოტვირთეთ',

      how_label: 'როგორ მიდის საღამო', how_title: 'სამი ნაბიჯი.\n_დანარჩენი თამაშია._',
      step1_t: 'დაამატეთ მეგობრები',
      step1_x: 'ჩაწერეთ სახელი და Joy თითოეულ მეგობარს საკუთარ ფერს მიანიჭებს. ყველა შენახული რჩება, ერთი შეხებით კი შეგიძლიათ, ვინმე დღევანდელ თამაშს გამოაკლოთ.',
      step1_count: 'თამაშობს %1 / %2', step1_toggle: '%s დღეს თამაშობს', step1_add: 'მოთამაშის დამატება',
      step2_t: 'აირჩიეთ თამაში',
      step2_x: 'გადაფურცლეთ დასტა, აირჩიეთ ხანგრძლივობა და სიმძაფრე და დაიწყეთ. ან არჩევანი Joy‑ს მიანდეთ.',
      step3_t: 'ტელეფონი გადაეცით',
      step3_x: 'Joy გეტყვით, ვისი ჯერია, დაარიგებს ბარათს, დაითვლის ქულებს და ბოლოს გამარჯვებულს გამოავლენს.',
      your_turn: 'თქვენი ჯერია',

      games_label: 'თამაშები', games_title: 'რას ვთამაშობთ?',
      games_text: 'რვა თამაში, თითოეული საკუთარ ბარათზე, მოძრავი ილუსტრაციით. გადმოაბრუნეთ ბარათი და ნახეთ, როგორ ითამაშება.',
      surprise: 'შემთხვევითი თამაში', prev_a11y: 'წინა თამაში', next_a11y: 'შემდეგი თამაში',
      how_to_play: 'როგორ ვითამაშოთ', min_players: 'მინიმუმ %s მოთამაშე', card_open_a11y: '%s: როგორ ვითამაშოთ', card_close_a11y: '%s: უკან გადაბრუნება',
      levels: 'მსუბუქი, თამამი ან 18+',

      cards_label: 'ბარათები', cards_title: 'აირჩიეთ დასტა.\n_წაიკითხეთ ხმამაღლა._',
      cards_text: 'დაახლოებით 3 000 ბარათი, ქართულად და ინგლისურად ცალ-ცალკე დაწერილი და არა თარგმნილი. ყოველ დასტას ახსოვს, რა დაარიგა, ამიტომ შემდეგი საღამო ისეთი ბარათებით იწყება, რომლებიც ჯერ არავის უნახავს.',
      picker_a11y: 'თამაში', seg_a11y: 'სიმძაფრე',
      intensity_light: 'მსუბუქი', intensity_bold: 'თამამი',
      intensity_light_caption: 'მსუბუქი ბარათები ნებისმიერი კომპანიისთვის',
      intensity_bold_caption: 'უფრო პირადი და უფრო გაბედული — მეგობრებისთვის, რომლებიც ერთმანეთს კარგად იცნობენ',
      intensity_adult_caption: 'ფლირტი, პაემნები და ღამის თავგადასავლები. მხოლოდ სრულწლოვნებისთვის.',
      adult_title: 'აქ ყველა სრულწლოვანია?',
      adult_text: 'ეს ბარათები ფლირტზე, პაემნებსა და ალკოჰოლზეა. ამას მხოლოდ ერთხელ გკითხავთ.',
      adult_yes: 'დიახ, ყველა', adult_no: 'გაუქმება',
      truth: 'სიმართლე', dare: 'მოქმედება', card_no: '№ %s', wyr_or: 'ან', opt_a: 'ა', opt_b: 'ბ',
      cap_turn: 'თქვენი ჯერია', cap_wyr: 'რას აირჩევს?', cap_hot: 'ცხელ სკამზე ზის',
      hint_nhie: 'ვისაც გაუკეთებია, თითს კარგავს', hint_mlt: 'სამის თვლაზე ყველამ მიუთითოს',
      deal_hint: 'შემდეგზე გადასასვლელად შეეხეთ ან გადაწიეთ', deal_a11y: 'შემდეგი ბარათი',

      end_label: 'თამაში დასრულდა', end_title: 'ყველა გამარჯვებულს\n_თავისი ტიტული აქვს._',
      end_text: 'დაწყებამდე აირჩიეთ, რამდენ ხანს ითამაშებთ, ზემოთ კი თხელი ხაზი გაჩვენებთ, რამდენი დარჩა. ბოლოს გამარჯვებულის ბარათი რიგდება და გადმობრუნდება, მას კი მოსდევს საბოლოო ცხრილი და „კიდევ ვითამაშოთ“.',
      awards_a11y: 'ტიტულები',
      award_bravest: 'ყველაზე გაბედული', award_best_performer: 'საუკეთესო მსახიობი', award_last_standing: 'ბოლომდე გაძლო',
      award_mind_reader: 'აზრების მკითხველი', award_groups_pick: 'კომპანიის რჩეული', award_hot_seat: 'ცხელ სკამს ყველამ გაუძლო',
      award_best_team: 'სიტყვის ოსტატები', award_sharpest: 'ყველაზე გამჭრიახი',
      score_dares: '%s მოქმედება', score_points: '%s ქულა', score_fingers: 'დარჩა %s თითი',
      team_b: 'გუნდი ბ',

      no_label: 'მხოლოდ თქვენი კომპანია', no_a11y: 'რა არ სჭირდება Joy‑ს',
      no_1: 'არც ანგარიში', no_2: 'არც რეგისტრაცია', no_3: 'არც რეკლამა', no_4: 'არც ინტერნეტი',
      no_end: 'მხოლოდ მეგობრები და *ერთი ტელეფონი*',
      pv1_t: 'ტელეფონიდან არაფერი გადის', pv1_x: 'სახელები, ფერები და პარამეტრები მხოლოდ მოწყობილობაზე ინახება. Joy‑ს სერვერი არც აქვს, რომ სადმე გაგზავნოს.',
      pv2_t: 'ყველგან ითამაშება', pv2_x: 'მთაში, თვითმფრინავში, სარდაფში, სადაც სიგნალი არ არის. ყველა ბარათი უკვე ტელეფონშია.',
      pv3_t: 'არავინ გითვალთვალებთ', pv3_x: 'არც ანალიტიკა, არც სარეკლამო SDK‑ები, არც ტრეკერები. თამაშს მხოლოდ ისინი უყურებენ, ვინც თამაშობს.',
      pv4_t: '18+ ჯერ გეკითხებათ', pv4_x: 'სანამ პირველ ბარათს დაარიგებს, 18+ დასტა ერთხელ გკითხავთ, არის თუ არა ყველა სრულწლოვანი.',
      pv_link: 'კონფიდენციალურობის პოლიტიკა',

      faq_label: 'კითხვები', faq_title: 'კარგია, რომ იცოდეთ', faq_more: 'სხვა რამე გაინტერესებთ?', faq_support: 'მხარდაჭერის გვერდი',
      q1: 'რამდენ ადამიანს შეუძლია თამაში?',
      a1: 'ორიდან თექვსმეტამდე. თამაშების უმეტესობისთვის ორიც საკმარისია, „ვინ უფრო?“, „ცხელი სკამი“ და „ჯაშუში“ სამ მოთამაშეს ითხოვს, „ალიასი“ კი — ოთხს, ორი გუნდისთვის.',
      q2: 'ინტერნეტი გვჭირდება?',
      a2: 'არა. ყველაფერი, რაც Joy‑ს სჭირდება, უკვე ტელეფონშია, ამიტომ სარდაფშიც ისევე ითამაშება, როგორც სახლში. არც ანგარიშია საჭირო და არც შესვლა.',
      q3: 'იგივე ბარათები განმეორდება?',
      a3: 'დიდხანს — არა. ყოველ დასტას ახსოვს, რა დაარიგა წინა საღამოებზე, და ჯერ იმას გაძლევთ, რაც თქვენს კომპანიას ჯერ არ უნახავს. როცა მთელ დასტას გაივლით, ის თავიდან იწყება.',
      q4: 'Joy ქართულად არის?',
      a4: 'სრულად. პარამეტრებში ქართულსა და ინგლისურს შორის გადართეთ და ყველაფერი ერთბაშად შეიცვლება, ბარათების ჩათვლით. ქართული ბარათები ქართულად დაიწერა, ქართული სუფრისთვის, და არა თარგმანით.',
      q5: 'რა არის 18+ დასტაში?',
      a5: 'ფლირტი, პაემნები და ღამის თავგადასავლები: პიკანტური, მაგრამ არასდროს უხამსი, ფიზიკური დავალება კი ყოველთვის მეორე ადამიანის თანხმობას ითხოვს. Joy ერთხელ გკითხავთ, არის თუ არა ყველა სრულწლოვანი.',
      q6: 'რამდენ ხანს გრძელდება თამაში?',
      a6: 'იმდენს, რამდენსაც მოისურვებთ. დაწყებამდე აირჩიეთ მოკლე, სტანდარტული ან გრძელი თამაში, ზემოთ კი თხელი ხაზი გაჩვენებთ, რამდენი დარჩა.',
      q7: 'iPhone თუ Android?',
      a7: 'ორივე — იგივე თამაშებით, იგივე ბარათებითა და იგივე იერით.',

      fi_title: 'ვითამაშოთ.',
      fi_soon: 'Joy მალე გამოჩნდება iPhone‑სა და Android‑ზე. მეგობრები თქვენზეა, თამაშები — ჩვენზე.',
      fi_live: 'Joy უკვე App Store‑სა და Google Play‑შია. მეგობრები თქვენზეა, თამაშები — ჩვენზე.',
      row_a11y: '%s: თამაშის ნახვა',
      foot_a11y: 'მეტი', footer_privacy: 'კონფიდენციალურობის პოლიტიკა', footer_support: 'მხარდაჭერა', footer_made: 'მეგობრებთან გატარებული კარგი საღამოებისთვის'
    }
  };

  // Each game's name, line and rules, word for word from the app.
  var GAME_TEXT = {
    en: {
      truthOrDare: ['Truth or Dare', 'Spill a secret or take on a challenge', ["Take turns — the app tells you who's up", 'Pick Truth or Dare, or let fate decide', 'No backing out. Whoever takes the most dares is crowned the bravest.'], '2, 3 or 5 rounds'],
      charades: ['Charades', 'Act it out, no words allowed', ['Pick categories and how long each turn lasts', 'Act out the word on screen while everyone else guesses', 'Tap Got it for every correct guess before the timer runs out'], '1, 2 or 3 rounds'],
      neverHaveIEver: ['Never Have I Ever', "Find out who's done what", ['Everyone starts with their fingers up', "Read the card out loud. If you've done it, put a finger down.", 'Out of fingers, out of the game. The last one with a finger up wins.'], '3, 5 or 10 fingers'],
      wouldYouRather: ['Would You Rather', 'How well do you know your friends?', ['Each turn, one player faces a tough choice', "Everyone else guesses out loud which way they'll go", 'The player reveals their answer. Every right guess scores a point.'], '2, 3 or 5 rounds'],
      mostLikelyTo: ['Most Likely To', 'Point at the friend who fits best', ['Read the question out loud', 'On three, everyone points at a player', 'Tap whoever got the most votes. After the last card, the most points wins.'], '10, 15 or 25 questions'],
      hotSeat: ['Hot Seat', 'One player, a barrage of questions', ['One player takes the hot seat', 'Everyone else takes turns reading questions out loud', 'Answer fast and honestly — no skipping'], '3, 5 or 7 questions each'],
      alias: ['Alias', 'Explain it without saying it', ['Split into teams. On each turn, one player explains words to their own team.', "Don't say the word or anything with the same root. No gestures, rhymes, or other languages.", 'A guessed word scores a point and a skip costs one. The team with the most points wins.'], '3, 5 or 7 turns per team'],
      spy: ['Spy', 'Everyone knows where they are, except one', ['Pass the phone round. Everyone sees the same place, except the spy.', 'Ask each other about the place. Answer so the others believe you, without giving it away.', 'Unmask the spy before time runs out. If they slip away or guess the place, the spy wins.'], '1, 3 or 5 rounds']
    },
    ka: {
      truthOrDare: ['სიმართლე თუ მოქმედება', 'გაამხილეთ საიდუმლო ან მიიღეთ გამოწვევა', ['ითამაშეთ რიგრიგობით — აპი გეტყვით, ვისი ჯერია', 'აირჩიეთ სიმართლე ან მოქმედება — ან არჩევანი ბედს მიანდეთ', 'უკან დახევა არ შეიძლება. ვინც ყველაზე მეტ მოქმედებას აირჩევს, ყველაზე გაბედული გახდება.'], '2, 3 ან 5 რაუნდი'],
      charades: ['პანტომიმა', 'აჩვენეთ ჟესტებით, სიტყვების გარეშე', ['აირჩიეთ კატეგორიები და ერთი ჯერის ხანგრძლივობა', 'აჩვენეთ ეკრანზე გამოსული სიტყვა, დანარჩენები კი გამოიცნობენ', 'ყოველ სწორ პასუხზე დააჭირეთ „გამოიცნეს“ — სანამ დრო ამოიწურება'], '1, 2 ან 3 რაუნდი'],
      neverHaveIEver: ['მე არასდროს', 'გაიგეთ, ვის რა ჩაუდენია', ['თამაშს ყველა აწეული თითებით იწყებს', 'ხმამაღლა წაიკითხეთ ბარათი. თუ ეს გაგიკეთებიათ, ერთი თითი ჩაკეცეთ.', 'ვისაც თითები გაუთავდება, თამაშიდან გადის. იგებს ის, ვისაც ბოლომდე შერჩება აწეული თითი.'], '3, 5 ან 10 თითი'],
      wouldYouRather: ['რას აირჩევდით?', 'რამდენად კარგად იცნობთ მეგობრებს?', ['ყოველ ჯერზე ერთი მოთამაშე რთული არჩევანის წინაშე დგება', 'დანარჩენები ხმამაღლა ცდილობენ გამოიცნონ, რას აირჩევს', 'მოთამაშე თავის პასუხს ამხელს. ყოველი სწორი გამოცნობა ერთი ქულაა.'], '2, 3 ან 5 რაუნდი'],
      mostLikelyTo: ['ვინ უფრო?', 'მიუთითეთ მეგობარზე, ვისაც ყველაზე მეტად შეეფერება', ['ხმამაღლა წაიკითხეთ კითხვა', 'სამის თვლაზე ყველამ ერთ მოთამაშეზე მიუთითოს', 'შეეხეთ ყველაზე მეტი ხმის მქონე მოთამაშეს. ბოლო ბარათის შემდეგ იგებს ის, ვისაც მეტი ქულა აქვს.'], '10, 15 ან 25 კითხვა'],
      hotSeat: ['ცხელი სკამი', 'ერთი მოთამაშე და კითხვების ქარცეცხლი', ['ერთი მოთამაშე ცხელ სკამზე ჯდება', 'დანარჩენები რიგრიგობით კითხულობენ კითხვებს', 'უპასუხეთ სწრაფად და გულწრფელად — გამოტოვება არ შეიძლება'], 'თითოეულს 3, 5 ან 7 კითხვა'],
      alias: ['ალიასი', 'ახსენი ისე, რომ არ თქვა', ['დაიყავით გუნდებად. ყოველ ჯერზე ერთი მოთამაშე საკუთარ გუნდს სიტყვებს უხსნის.', 'თავად სიტყვა ან მისი ძირის შემცველი სიტყვები არ თქვათ. ჟესტები, რითმები და უცხო ენა აკრძალულია.', 'გამოცნობილი სიტყვა ერთი ქულაა, გამოტოვებული — მინუს ერთი. იგებს გუნდი, რომელიც მეტ ქულას დააგროვებს.'], 'თითო გუნდს 3, 5 ან 7 ჯერი'],
      spy: ['ჯაშუში', 'ყველამ იცის, სად არის. ერთის გარდა', ['ტელეფონი ხელიდან ხელში გადაეცით. ყველა ერთსა და იმავე ადგილს ხედავს, ჯაშუშის გარდა.', 'ერთმანეთს ადგილზე კითხვები დაუსვით. უპასუხეთ ისე, რომ დაგიჯერონ, მაგრამ ადგილი არ გასცეთ.', 'გამოავლინეთ ჯაშუში, სანამ დრო ამოიწურება. თუ გაგექცათ ან ადგილს გამოიცნობს, ჯაშუში იგებს.'], '1, 3 ან 5 რაუნდი']
    }
  };

  // Tonight's company, each in a colour of their own.
  var PEOPLE = [
    ['Mari', 'მარი', 'orchid'], ['Nika', 'ნიკა', 'azure'], ['Ana', 'ანა', 'amber'], ['Dato', 'დათო', 'jade'],
    ['Salome', 'სალომე', 'ruby'], ['Luka', 'ლუკა', 'lagoon'], ['Giorgi', 'გიორგი', 'iris'], ['Tamta', 'თამთა', 'slate']
  ];

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  var lang = root.lang === 'ka' ? 'ka' : 'en';
  function t(key) { var s = STRINGS[lang][key]; return s != null ? s : STRINGS.en[key]; }
  function fill(template, a, b) { return String(template).replace('%s', a).replace('%1', a).replace('%2', b); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return ('0' + n).slice(-2); }
  function game(id) { return C.byId[id]; }
  function gt(id) { var g = GAME_TEXT[lang][id]; return { title: g[0], tagline: g[1], rules: g[2], length: g[3] }; }
  function person(i) { var p = PEOPLE[i % PEOPLE.length]; return { name: lang === 'ka' ? p[1] : p[0], tint: C.TINTS[p[2]] }; }
  function avatar(i, cls) {
    var p = person(i);
    return '<span class="avatar ' + (cls || '') + '" style="' + C.hueStyle(p.tint) + '" aria-hidden="true">' + esc(p.name.charAt(0)) + '</span>';
  }
  // "Luka, Salome, and Tamta" / "ლუკა, სალომე და თამთა", as the app formats a list of winners.
  function listOf(names) {
    if (names.length < 2) return names.join('');
    var head = names.slice(0, -1).join(', '), last = names[names.length - 1];
    if (lang === 'ka') return head + ' და ' + last;
    return head + (names.length > 2 ? ', and ' : ' and ') + last;
  }
  function shuffle(list) { for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = list[i]; list[i] = list[j]; list[j] = x; } return list; }
  // "*lit* words" → <em>, "_dim_ words" → a quieter span, and "\n" → a line break.
  function painted(text) {
    return String(text).split('\n').map(function (line) {
      return line.split(/(\*[^*]+\*|_[^_]+_)/).map(function (part) {
        if (part.charAt(0) === '*') return '<em>' + esc(part.slice(1, -1)) + '</em>';
        if (part.charAt(0) === '_') return '<span class="dim">' + esc(part.slice(1, -1)) + '</span>';
        return esc(part);
      }).join('');
    }).join('<br>');
  }
  // Run `start` while an element is on screen, and `stop` when it leaves.
  function whileVisible(el, start, stop, threshold) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { start(); return; }
    var on = false;
    new IntersectionObserver(function (entries) {
      var now = entries[entries.length - 1].isIntersecting;
      if (now === on) return;
      on = now;
      if (on) start(); else if (stop) stop();
    }, { threshold: threshold == null ? 0.25 : threshold }).observe(el);
  }

  // Turns a two-sided card over with the app's flip spring. Face up is 0°, face down 180°.
  function setAngle(el, a) {
    var persp = Math.max(600, el.offsetWidth * 2.6);
    el.style.transform = Math.abs(a) < 0.01 ? '' : 'perspective(' + persp + 'px) rotateY(' + a + 'deg)';
    el.classList.toggle('is-up', a < 90);
  }
  function turn(el, up, opts) {
    opts = opts || {};
    var landed = false;
    if (el.__spring) el.__spring.stop();
    var from = el.__angle == null ? (up ? 180 : 0) : el.__angle;
    var to = up ? 0 : 180;
    if (from === to) { setAngle(el, to); el.__angle = to; if (opts.done) opts.done(); return; }
    el.__spring = C.spring({
      from: from, to: to, response: opts.response || 0.62, damping: opts.damping || 0.82, epsilon: 0.05,
      update: function (a) {
        el.__angle = a;
        setAngle(el, a);
        if (opts.landing && !landed && a < 28) { landed = true; opts.landing(); }
        if (opts.near && !landed && Math.abs(a - to) < 14) { landed = true; if (el.__spring) el.__spring.stop(); opts.near(); }
      },
      done: opts.done
    });
  }
  function faceDown(el) { if (el.__spring) el.__spring.stop(); el.__angle = 180; setAngle(el, 180); }

  function cardBack(hue, symbol, w, h) {
    return '<div class="face face--back card back" style="' + C.hueStyle(hue) + '">' + C.layers() +
      '<div class="back__rosette">' + C.rosette(w || 300, h || 420) + '</div>' + C.emblem(symbol) + '</div>';
  }

  // ---------------------------------------------------------------------------
  // Icons and language
  // ---------------------------------------------------------------------------
  $$('[data-icon]').forEach(function (el) {
    var svg = C.icon(el.getAttribute('data-icon'));
    if (el.tagName === 'I') el.outerHTML = svg; else el.innerHTML = svg;
  });

  var onLanguage = [];
  function applyStrings() {
    document.title = t('page_title');
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-p]').forEach(function (el) { el.innerHTML = painted(t(el.getAttribute('data-i18n-p'))); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    onLanguage.forEach(function (fn) { fn(); });
  }
  function setLanguage(next) {
    if (next === lang) return;
    lang = next;
    root.lang = next;
    try { localStorage.setItem('joy.lang', next); } catch (e) {}
    try {
      var url = new URL(location.href);
      if (url.searchParams.has('lang')) { url.searchParams.set('lang', next); history.replaceState(null, '', url); }
    } catch (e) {}
    applyStrings();
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLanguage(b.getAttribute('data-lang')); });
  });

  // ---------------------------------------------------------------------------
  // The stores
  // ---------------------------------------------------------------------------
  var APPLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.64c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.15.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.9c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27z"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00D7FE" d="M3.6 2.3c-.3.3-.4.8-.4 1.3v16.8c0 .5.1 1 .4 1.3l.1.1 9.4-9.4v-.2L3.7 2.2z"/><path fill="#FFCE00" d="m16.2 15.5-3.1-3.1v-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2l-3.7 2.1z"/><path fill="#FF3A44" d="M16.3 15.4 13.1 12.3l-9.5 9.4c.4.4.9.4 1.6.1l11.1-6.4"/><path fill="#00F076" d="M16.3 9.2 5.2 2.8c-.7-.4-1.2-.3-1.6.1l9.5 9.4z"/></svg>';
  function store(kind, url, glyph, small, name) {
    var inner = glyph + '<span><small>' + esc(url ? small : t('store_soon')) + '</small>' + name + '</span>';
    return url
      ? '<a class="store store--' + kind + '" href="' + esc(url) + '" target="_blank" rel="noopener">' + inner + '</a>'
      : '<span class="store store--' + kind + '">' + inner + '</span>';
  }
  function renderStores() {
    var html = store('apple', STORE.appStore, APPLE, t('store_apple_small'), 'App Store') +
      store('google', STORE.googlePlay, PLAY, t('store_google_small'), 'Google Play');
    $$('[data-stores]').forEach(function (el) { el.innerHTML = html; });
    $('#finaleText').textContent = t(STORE.appStore && STORE.googlePlay ? 'fi_live' : 'fi_soon');
  }
  onLanguage.push(renderStores);

  // The bar firms up once the page moves.
  var bar = $('#bar');
  function onScroll() { bar.classList.toggle('is-solid', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------------------
  // Hero (WelcomeView): every game as a small card, dealt into a hand with the
  // middle cards on top. The fan pivots round a point well below the cards, so
  // the outer ones dip and lean, and once dealt it opens and closes ever so
  // slightly, as if held. Then the words arrive.
  // ---------------------------------------------------------------------------
  var goToGame = function () {};
  (function hero() {
    var section = $('#top'), hand = $('#fanHand');
    var cards = GAMES.map(function (g, i) {
      var el = document.createElement('div');
      var spread = i - (GAMES.length - 1) / 2;
      el.className = 'fan__card';
      el.style.zIndex = String(Math.round((10 - Math.abs(spread)) * 10) + i);
      el.innerHTML = '<div class="card" style="' + C.hueStyle(g) + '">' + C.layers() + '<span class="num">' + pad(i + 1) + '</span><canvas></canvas></div>';
      hand.appendChild(el);
      C.art(el.querySelector('canvas'), g.id, true);
      var card = { el: el, spread: spread, deal: still ? 1 : 0, lift: 0, to: 0 };
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') card.to = 1; });
      el.addEventListener('pointerleave', function () { card.to = 0; });
      el.addEventListener('click', function () { goToGame(i, true); });
      return card;
    });
    var visible = true, breathFrom = null, drop = 300, ch = 200, narrow = false;
    function measure() { drop = hand.offsetHeight; ch = cards[0].el.offsetHeight; narrow = window.innerWidth < 640; }
    measure();
    window.addEventListener('resize', measure);

    function render(now) {
      // The app's hand opens 9° between cards; a narrow screen holds it a little closer.
      var base = narrow ? 7 : 9, deg = base;
      if (breathFrom != null) deg = base + 0.5 - 0.5 * Math.cos((now - breathFrom) / 1000 * Math.PI / 3.6);
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        c.lift += (c.to - c.lift) * 0.16;
        var y = (1 - c.deal) * drop - c.lift * ch * 0.09;
        c.el.style.transform = 'rotate(' + (c.spread * deg * c.deal).toFixed(3) + 'deg) translateY(' + y.toFixed(2) + 'px) scale(' + (1 + c.lift * 0.035).toFixed(4) + ')';
        c.el.style.opacity = String(Math.max(0, Math.min(1, c.deal)));
      }
    }
    C.onFrame(function (t, now) { if (visible) render(now); });
    whileVisible(section, function () { visible = true; }, function () { visible = false; }, 0);

    function told() { section.classList.add('is-told'); }
    if (still) {
      section.classList.add('is-dealt');
      told();
      render(0);
      return;
    }
    setTimeout(function () {
      section.classList.add('is-dealt');
      cards.forEach(function (c, i) {
        setTimeout(function () {
          C.spring({ from: 0, to: 1, response: 0.7, damping: 0.8, update: function (v) { c.deal = v; } });
        }, i * 70);
      });
      setTimeout(told, cards.length * 70 + 260);
      setTimeout(function () { breathFrom = performance.now(); }, cards.length * 70 + 1200);
    }, 250);
  })();

  // ---------------------------------------------------------------------------
  // 01 — the roster: everyone saved stays saved, and a tap sits someone out.
  // ---------------------------------------------------------------------------
  (function roster() {
    var list = $('#rosterList'), count = $('#rosterCount');
    var people = [0, 1, 2, 3, 4].map(function (i) { return { i: i, out: false, fresh: false }; });
    var shown = false;
    function render() {
      list.innerHTML = people.map(function (p, k) {
        var who = person(p.i);
        return '<button type="button" class="avatar' + (p.out ? ' is-out' : '') + (p.fresh ? ' is-new' : '') + '" data-k="' + k + '" style="' + C.hueStyle(who.tint) + (p.fresh ? ';animation-delay:' + (p.delay || 0) + 'ms' : '') + '" aria-pressed="' + !p.out + '" aria-label="' + esc(fill(t('step1_toggle'), who.name)) + '">' + esc(who.name.charAt(0)) + '</button>';
      }).join('') + '<button type="button" class="roster__add" aria-label="' + esc(t('step1_add')) + '"' + (people.length >= PEOPLE.length ? ' disabled' : '') + '>' + C.icon('plus') + '</button>';
      people.forEach(function (p) { p.fresh = false; p.delay = 0; });
      var playing = people.filter(function (p) { return !p.out; }).length;
      count.textContent = fill(t('step1_count'), playing, people.length);
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.classList.contains('roster__add')) {
        if (people.length < PEOPLE.length) people.push({ i: people.length, out: false, fresh: true });
      } else {
        var p = people[+b.getAttribute('data-k')];
        p.out = !p.out;
        b.classList.toggle('is-out', p.out);
        b.setAttribute('aria-pressed', String(!p.out));
        var playing = people.filter(function (x) { return !x.out; }).length;
        count.textContent = fill(t('step1_count'), playing, people.length);
        return;
      }
      render();
    });
    onLanguage.push(render);
    whileVisible($('#roster'), function () {
      if (shown) return;
      shown = true;
      people.forEach(function (p, k) { p.fresh = true; p.delay = k * 80; });
      render();
    });
  })();

  // ---------------------------------------------------------------------------
  // 02 — the deck flicked through on its own, the focused card alive.
  // ---------------------------------------------------------------------------
  (function mini() {
    var host = $('#mini'), active = 0, timer = 0;
    var cards = GAMES.map(function (g, i) {
      var el = document.createElement('div');
      el.className = 'mini__card';
      el.innerHTML = '<div class="card" style="' + C.hueStyle(g) + '">' + C.layers() + '<span class="num">' + pad(i + 1) + '</span><canvas></canvas><b></b></div>';
      host.appendChild(el);
      C.art(el.querySelector('canvas'), g.id, false);
      return el;
    });
    function titles() { cards.forEach(function (el, i) { $('b', el).textContent = gt(GAMES[i].id).title; }); }
    function place() {
      var n = cards.length;
      cards.forEach(function (el, i) {
        var o = ((i - active) % n + n + n / 2) % n - n / 2;
        var a = Math.abs(o), side = o < 0 ? -1 : 1;
        // Neighbours tuck in behind the focused card and turn away, like the home carousel.
        var x = a === 0 ? 0 : side * (a === 1 ? 96 : a === 2 ? 172 : 230);
        el.style.transform = 'translateX(' + x + 'px) rotateY(' + (Math.max(-2, Math.min(2, o)) * -16) + 'deg) scale(' + (a === 0 ? 1 : a === 1 ? 0.84 : 0.7) + ')';
        el.style.opacity = a > 2 ? '0' : String(1 - a * 0.3);
        el.style.zIndex = String(10 - Math.round(a));
        C.setAnimated($('canvas', el), o === 0);
      });
    }
    titles();
    place();
    onLanguage.push(titles);
    whileVisible(host.parentNode, function () {
      clearInterval(timer);
      timer = setInterval(function () { active = (active + 1) % cards.length; place(); }, 2300);
    }, function () { clearInterval(timer); });
  })();

  // ---------------------------------------------------------------------------
  // 03 — the table from above, and the phone going round it.
  // ---------------------------------------------------------------------------
  (function table() {
    var host = $('#table'), arm = $('#phoneArm'), phone = $('#phone'), name = $('#tableName');
    var seats = [0, 1, 2, 3, 4, 5].map(function (i) {
      var el = document.createElement('span');
      el.className = 'seat';
      el.style.setProperty('--a', (i * 60) + 'deg');
      host.appendChild(el);
      return el;
    });
    var turnNo = 0, timer = 0;
    function render() {
      seats.forEach(function (el, i) {
        var p = person(i);
        el.setAttribute('style', '--a:' + (i * 60) + 'deg;' + C.hueStyle(p.tint));
        el.innerHTML = avatar(i);
      });
      paint();
    }
    var land = 0;
    function paint(moving) {
      var at = turnNo % seats.length;
      arm.style.transform = 'rotate(' + (turnNo * 60) + 'deg)';
      phone.setAttribute('style', C.hueStyle(GAMES[Math.floor(turnNo / seats.length) % GAMES.length]));
      // Whose turn it is changes as the phone reaches them, not as it leaves.
      clearTimeout(land);
      land = setTimeout(function () {
        seats.forEach(function (el, i) { el.classList.toggle('is-turn', i === at); });
        name.textContent = person(at).name;
      }, moving && !still ? 620 : 0);
    }
    render();
    onLanguage.push(render);
    whileVisible(host.parentNode, function () {
      clearInterval(timer);
      timer = setInterval(function () { turnNo++; paint(true); }, 1900);
    }, function () { clearInterval(timer); });
  })();

  // ---------------------------------------------------------------------------
  // The games (GameCarousel): a deck of big cards you flick through. The focused
  // card animates and leans with the hand; the neighbours shrink towards it and
  // turn away in 3D. Tap the focused card to turn it over and read the rules.
  // ---------------------------------------------------------------------------
  (function games() {
    var section = $('#games'), carousel = $('#carousel'), track = $('#track'), dots = $('#dots'), wash = $('#wash');
    var slides = GAMES.map(function (g, i) {
      var s = document.createElement('div');
      s.className = 'slide';
      s.innerHTML =
        '<div class="slide__in"><div class="lean-host"><div class="flip is-up" role="button" tabindex="-1" aria-expanded="false">' +
          '<div class="face face--front card gcard" style="' + C.hueStyle(g) + '">' + C.layers() +
            '<div class="gcard__top"><span class="num">' + pad(i + 1) + '</span><span class="pill">' + C.icon('person.2.fill') + g.min + '+</span></div>' +
            '<canvas></canvas>' +
            '<h3 class="gcard__title" data-g="title"></h3>' +
            '<p class="gcard__tag" data-g="tagline"></p>' +
            '<span class="gcard__cta"><span data-g="cta"></span>' + C.icon('arrow.right') + '</span>' +
          '</div>' +
          '<div class="face face--back card gback" style="' + C.hueStyle(g) + '">' + C.layers() +
            '<div class="back__rosette">' + C.rosette(300, 430) + '</div>' +
            '<p class="gback__head">' + C.icon(g.symbol) + '<span data-g="cta"></span></p>' +
            '<h3 class="gback__title" data-g="title"></h3>' +
            '<ol class="rules"><li data-g="rule0"></li><li data-g="rule1"></li><li data-g="rule2"></li></ol>' +
            '<div class="gback__meta"><span class="pill">' + C.icon('person.2.fill') + '<span data-g="min"></span></span><span class="pill" data-g="length"></span>' +
              (g.intensity ? '<span class="pill" data-g="levels"></span>' : '') + '</div>' +
          '</div>' +
        '</div></div></div>';
      track.appendChild(s);
      var flip = $('.flip', s);
      flip.__angle = 0;
      C.art($('canvas', s), g.id, false);
      flip.addEventListener('click', function () {
        if (suppress) return;
        if (focus === i) toggle(i); else goTo(i);
      });
      flip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (focus === i) toggle(i); else goTo(i); }
      });
      return { el: s, inner: $('.slide__in', s), flip: flip, canvas: $('canvas', s), open: false, g: g };
    });
    dots.innerHTML = GAMES.map(function (g, i) {
      return '<button type="button" style="--glow:' + g.glow + '" data-i="' + i + '"><i></i></button>';
    }).join('');

    function words() {
      slides.forEach(function (s, i) {
        var txt = gt(s.g.id);
        $$('[data-g]', s.el).forEach(function (el) {
          var k = el.getAttribute('data-g');
          el.textContent = k === 'title' ? txt.title : k === 'tagline' ? txt.tagline : k === 'cta' ? t('how_to_play') :
            k === 'min' ? fill(t('min_players'), s.g.min) : k === 'length' ? txt.length : k === 'levels' ? t('levels') : txt.rules[+k.slice(4)];
        });
        s.flip.setAttribute('aria-label', fill(t(s.open ? 'card_close_a11y' : 'card_open_a11y'), txt.title));
      });
      $$('button', dots).forEach(function (b, i) { b.setAttribute('aria-label', gt(GAMES[i].id).title); });
    }

    var sw = 0, gap = 14, cw = 0, focus = -1, suppress = false, raf = 0;
    function measure() {
      sw = slides[0].el.offsetWidth;
      gap = parseFloat(getComputedStyle(track).columnGap) || 14;
      cw = carousel.clientWidth;
      track.style.setProperty('--spacer', Math.max(0, (cw - sw) / 2 - gap) + 'px');
      update();
    }
    function centerOf(i) { return slides[i].el.offsetLeft + sw / 2; }
    function update() {
      raf = 0;
      var mid = carousel.scrollLeft + cw / 2, best = 0, bestD = Infinity;
      slides.forEach(function (s, i) {
        var p = (centerOf(i) - mid) / (sw + gap);
        var a = Math.min(Math.abs(p), 3);
        if (Math.abs(p) < bestD) { bestD = Math.abs(p); best = i; }
        s.inner.style.transformOrigin = p > 0 ? '0% 50%' : '100% 50%';
        s.inner.style.transform = a < 0.001 ? '' : 'rotateY(' + (Math.max(-3, Math.min(3, p)) * -12).toFixed(2) + 'deg) scale(' + (1 - a * 0.1).toFixed(4) + ')';
        s.inner.style.opacity = String(Math.max(0, 1 - a * 0.3));
      });
      if (best !== focus) setFocus(best);
    }
    function setFocus(i) {
      var was = focus;
      focus = i;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.el.classList.toggle('is-focus', on);
        s.flip.tabIndex = on ? 0 : -1;
        C.setAnimated(s.canvas, on);
        if (!on && s.open) close(k);
      });
      $$('button', dots).forEach(function (b, k) { b.setAttribute('aria-current', String(k === i)); });
      wash.style.setProperty('--wash', GAMES[i].glow);
      if (was !== -1 && document.activeElement && document.activeElement.classList.contains('flip')) slides[i].flip.focus({ preventScroll: true });
    }
    function toggle(i) { if (slides[i].open) close(i); else open(i); }
    function open(i) {
      var s = slides[i];
      s.open = true;
      turn(s.flip, false);
      s.flip.setAttribute('aria-expanded', 'true');
      s.flip.setAttribute('aria-label', fill(t('card_close_a11y'), gt(s.g.id).title));
    }
    function close(i) {
      var s = slides[i];
      s.open = false;
      turn(s.flip, true);
      s.flip.setAttribute('aria-expanded', 'false');
      s.flip.setAttribute('aria-label', fill(t('card_open_a11y'), gt(s.g.id).title));
    }
    function goTo(i, instant) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      carousel.scrollTo({ left: centerOf(i) - cw / 2, behavior: instant || still ? 'auto' : 'smooth' });
    }

    carousel.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', measure);
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(focus + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(focus - 1); }
    });
    $('#prev').addEventListener('click', function () { goTo(focus - 1); });
    $('#next').addEventListener('click', function () { goTo(focus + 1); });
    dots.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) goTo(+b.getAttribute('data-i')); });

    // A mouse can drag the deck as a finger would.
    var drag = null;
    carousel.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: carousel.scrollLeft, moved: false, v: 0, lx: e.clientX, lt: e.timeStamp };
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; carousel.classList.add('is-dragging'); }
      if (!drag.moved) return;
      carousel.scrollLeft = drag.left - dx;
      var dt = e.timeStamp - drag.lt;
      if (dt > 0) { drag.v = (e.clientX - drag.lx) / dt; drag.lx = e.clientX; drag.lt = e.timeStamp; }
    });
    window.addEventListener('pointerup', function () {
      if (!drag) return;
      var d = drag;
      drag = null;
      if (!d.moved) return;
      suppress = true;
      setTimeout(function () { suppress = false; }, 0);
      var target = focus;
      if (Math.abs(d.v) > 0.4) target = focus + (d.v < 0 ? 1 : -1) * (Math.abs(centerOf(focus) - carousel.scrollLeft - cw / 2) < sw * 0.2 ? 1 : 0);
      goTo(target);
      setTimeout(function () { carousel.classList.remove('is-dragging'); }, 650);
    });

    // Surprise me: the deck spins to a random game and turns it over.
    $('#surprise').addEventListener('click', function () {
      var pick = focus;
      while (pick === focus) pick = Math.floor(Math.random() * slides.length);
      slides.forEach(function (s, k) { if (s.open) close(k); });
      var from = carousel.scrollLeft, to = centerOf(pick) - cw / 2;
      function done() {
        carousel.classList.remove('is-dragging');
        setTimeout(function () { open(pick); }, still ? 0 : 160);
      }
      if (still) { carousel.scrollLeft = to; update(); done(); return; }
      // Go the long way round when the pick is close, so it reads as a spin.
      carousel.classList.add('is-dragging');
      var start = performance.now(), dur = 1150;
      (function step(now) {
        var p = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - p, 4);
        carousel.scrollLeft = from + (to - from) * e;
        if (p < 1) requestAnimationFrame(step); else done();
      })(start);
      var top = section.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.3 || top < -carousel.offsetTop) carousel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    goToGame = function (i, openIt) {
      carousel.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () {
        goTo(i);
        if (!openIt) return;
        // Turn it over once the deck has come to rest on it.
        var tries = 0;
        (function wait() {
          if (focus === i && Math.abs(centerOf(i) - carousel.scrollLeft - cw / 2) < 4) { if (!slides[i].open) setTimeout(function () { open(i); }, still ? 0 : 120); return; }
          if (++tries < 40) setTimeout(wait, 80);
        })();
      }, still ? 0 : 420);
    };

    words();
    onLanguage.push(words);
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('load', measure);
  })();

  // ---------------------------------------------------------------------------
  // The cards: the app's own decks, dealt face down and turned over. Each deck
  // deals every card once before any repeat, and never the same card twice in a
  // row (PromptDeck). The 18+ deck asks once.
  // ---------------------------------------------------------------------------
  (function dealer() {
    var CARD_GAMES = ['truthOrDare', 'neverHaveIEver', 'wouldYouRather', 'mostLikelyTo', 'hotSeat'];
    var LEVELS = ['light', 'bold', 'adult'];
    var picker = $('#picker'), seg = $('#seg'), thumb = $('#segThumb'), caption = $('#segCaption');
    var dealt = $('#dealt'), turnEl = $('#turn'), dialog = $('#adult');
    var state = { game: 'truthOrDare', level: 'light', number: {}, decks: {}, seat: 0, hot: 0 };
    var adultOk = false;
    try { adultOk = localStorage.getItem('joy.adult') === '1'; } catch (e) {}
    var current = null, started = false, dealtIn = null;

    function draw(key, pool) {
      var d = state.decks[key];
      if (!d || !d.left.length) {
        var order = shuffle(pool.slice());
        // A new pass never starts with the card just played.
        if (d && d.last != null && order.length > 1 && order[0] === d.last) order.push(order.shift());
        d = state.decks[key] = { left: order, last: d ? d.last : null };
      }
      var card = d.left.shift();
      d.last = card;
      return card;
    }
    function nextCard() {
      var deck = DECK[lang][state.game][state.level];
      var key = lang + '.' + state.game + '.' + state.level;
      if (state.game === 'truthOrDare') {
        var kind = Math.random() < 0.5 ? 'truths' : 'dares';
        return { kind: kind === 'truths' ? 'truth' : 'dare', text: draw(key + '.' + kind, deck[kind]) };
      }
      var list = deck.statements || deck.dilemmas || deck.prompts || deck.questions;
      return { text: draw(key, list) };
    }
    function build(card) {
      var g = game(state.game);
      var n = state.number[state.game] = (state.number[state.game] || 0) + 1;
      var symbol = card.kind === 'truth' ? 'questionmark' : card.kind === 'dare' ? 'bolt.fill' : g.symbol;
      var eyebrow = card.kind ? t(card.kind) : gt(g.id).title;
      var body = typeof card.text === 'object'
        ? '<div class="wyr"><p class="wyr__opt"><span>' + esc(t('opt_a')) + '</span>' + esc(card.text.a) + '</p><p class="wyr__or">' + esc(t('wyr_or')) + '</p><p class="wyr__opt"><span>' + esc(t('opt_b')) + '</span>' + esc(card.text.b) + '</p></div>'
        : '<p class="pcard__text">' + esc(card.text) + '</p>';
      var el = document.createElement('div');
      el.className = 'dealt__move';
      el.innerHTML = '<div class="flip">' +
        '<div class="face face--front card pcard" style="' + C.hueStyle(g) + '">' + C.layers() +
          '<span class="pcard__mark" aria-hidden="true">' + C.icon(symbol) + '</span>' +
          '<p class="pcard__top">' + C.icon(symbol) + '<span>' + esc(eyebrow) + '</span><span class="pcard__no">' + esc(fill(t('card_no'), n)) + '</span></p>' +
          body +
        '</div>' + cardBack(g, symbol, 320, 400) +
      '</div>';
      return el;
    }
    function banner() {
      var g = state.game, html;
      if (g === 'neverHaveIEver' || g === 'mostLikelyTo') {
        html = '<span class="turn__hint" style="' + C.hueStyle(game(g)) + '">' + C.icon(game(g).symbol) + '</span><span><b class="is-quiet">' + esc(t(g === 'neverHaveIEver' ? 'hint_nhie' : 'hint_mlt')) + '</b></span>';
      } else {
        var seat = g === 'hotSeat' ? state.hot : state.seat;
        var cap = g === 'hotSeat' ? 'cap_hot' : g === 'wouldYouRather' ? 'cap_wyr' : 'cap_turn';
        html = avatar(seat) + '<span><small>' + esc(t(cap)) + '</small><b>' + esc(person(seat).name) + '</b></span>';
      }
      if (turnEl.innerHTML === html) return;
      if (still || !turnEl.innerHTML) { turnEl.innerHTML = html; return; }
      turnEl.classList.add('is-swap');
      setTimeout(function () { turnEl.innerHTML = html; turnEl.classList.remove('is-swap'); }, 200);
    }
    function deal(dir, thrownFrom) {
      var old = current;
      if (old) setAside(old, dir || -1, thrownFrom);
      if (old) {
        // Whose turn is it now: the hot seat holds for three questions.
        state.seat = (state.seat + 1) % 6;
        if (state.game === 'hotSeat' && state.number.hotSeat % 3 === 0) state.hot = (state.hot + 1) % 6;
      }
      dealtIn = lang;
      current = build(nextCard());
      dealt.appendChild(current);
      var flip = $('.flip', current);
      faceDown(flip);
      banner();
      if (!still) current.classList.add('is-in');
      if (started) setTimeout(function () { turn(flip, true); }, still ? 0 : 140);
    }
    function setAside(el, dir, thrownFrom) {
      el.style.pointerEvents = 'none';
      var done = function () { el.remove(); };
      if (still || !el.animate) { done(); return; }
      var from = thrownFrom || el.style.transform || 'none';
      var to = thrownFrom
        ? 'translate(' + (dir * 640) + 'px, 0) rotate(' + (dir * 18) + 'deg)'
        : 'translateX(' + (dir * 300) + 'px) rotate(' + (dir * 4) + 'deg)';
      el.animate([
        { transform: from, opacity: 1, filter: 'blur(0)' },
        { transform: to, opacity: 0, filter: thrownFrom ? 'blur(0)' : 'blur(8px)' }
      ], { duration: thrownFrom ? 240 : 450, easing: thrownFrom ? 'ease-out' : 'cubic-bezier(.22,.8,.24,1)', fill: 'forwards' }).onfinish = done;
    }

    // Swipe it away like a real deck (SwipeableCard), or tap for the next one.
    var press = null;
    dealt.addEventListener('pointerdown', function (e) {
      if (!current || e.button > 0) return;
      press = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, moved: false, t: e.timeStamp, el: current, id: e.pointerId };
      try { dealt.setPointerCapture(e.pointerId); } catch (err) {}
    });
    dealt.addEventListener('pointermove', function (e) {
      if (!press || e.pointerId !== press.id) return;
      press.dx = e.clientX - press.x;
      press.dy = e.clientY - press.y;
      if (!press.moved && Math.abs(press.dx) > 8) press.moved = true;
      if (!press.moved) return;
      press.el.style.transition = 'none';
      press.el.style.transform = 'translate(' + press.dx + 'px,' + (press.dy * 0.15) + 'px) rotate(' + (press.dx / 30) + 'deg)';
    });
    function release(e) {
      if (!press || (e && e.pointerId !== press.id)) return;
      var p = press;
      press = null;
      if (!p.moved) { if (e && e.type === 'pointerup') deal(-1); return; }
      var speed = p.dx / Math.max(1, e.timeStamp - p.t) * 1000;
      if (Math.abs(p.dx) > 110 || Math.abs(speed) > 900) {
        deal(p.dx > 0 ? 1 : -1, p.el.style.transform);
      } else {
        p.el.style.transition = 'transform .45s cubic-bezier(.22,.8,.24,1)';
        p.el.style.transform = '';
      }
    }
    dealt.addEventListener('pointerup', release);
    dealt.addEventListener('pointercancel', release);
    dealt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); deal(e.key === 'ArrowRight' ? 1 : -1); }
    });

    function controls() {
      picker.innerHTML = CARD_GAMES.map(function (id) {
        var g = game(id);
        return '<button type="button" role="radio" class="chip" data-game="' + id + '" style="--glow:' + g.glow + '" aria-checked="' + (state.game === id) + '"><i aria-hidden="true"></i>' + esc(gt(id).title) + '</button>';
      }).join('');
      var k = LEVELS.indexOf(state.level);
      $$('button', seg).forEach(function (b, i) { b.setAttribute('aria-checked', String(i === k)); b.tabIndex = i === k ? 0 : -1; });
      thumb.style.transform = 'translateX(' + (k * 100) + '%)';
      caption.textContent = t('intensity_' + state.level + '_caption');
    }
    picker.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.getAttribute('data-game') === state.game) return;
      state.game = b.getAttribute('data-game');
      controls();
      deal(-1);
    });
    function setLevel(level) {
      if (level === state.level) return;
      if (level === 'adult' && !adultOk) {
        if (dialog.showModal) { dialog.returnValue = ''; dialog.showModal(); return; }
        if (!window.confirm(t('adult_title') + '\n' + t('adult_text'))) return;
        adultOk = true;
      }
      state.level = level;
      controls();
      deal(-1);
    }
    seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setLevel(b.getAttribute('data-level')); });
    seg.addEventListener('keydown', function (e) {
      var k = LEVELS.indexOf(state.level);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setLevel(LEVELS[(k + (e.key === 'ArrowRight' ? 1 : 2)) % 3]);
        var b = $('[aria-checked="true"]', seg);
        if (b) b.focus();
      }
    });
    dialog.addEventListener('close', function () {
      if (dialog.returnValue !== 'yes') return;
      adultOk = true;
      try { localStorage.setItem('joy.adult', '1'); } catch (e) {}
      setLevel('adult');
    });

    controls();
    deal();
    onLanguage.push(function () { controls(); if (current && dealtIn !== lang) deal(-1); });
    whileVisible($('.stack'), function () {
      if (started) return;
      started = true;
      setTimeout(function () { if (current) turn($('.flip', current), true); }, still ? 0 : 300);
    }, null, 0.45);
  })();

  // ---------------------------------------------------------------------------
  // Every game has an end (GameOverView): the winner's card between laurels,
  // dealt face down and turned over, with a fine burst of light as it lands.
  // ---------------------------------------------------------------------------
  (function winners() {
    var AWARDS = [
      { game: 'truthOrDare', award: 'bravest', who: [1], score: ['dares', 4] },
      { game: 'charades', award: 'best_performer', who: [2], score: ['points', 9] },
      { game: 'neverHaveIEver', award: 'last_standing', who: [3], score: ['fingers', 2] },
      { game: 'wouldYouRather', award: 'mind_reader', who: [0], score: ['points', 6] },
      { game: 'mostLikelyTo', award: 'groups_pick', who: [6], score: ['points', 7] },
      { game: 'hotSeat', award: 'hot_seat', who: [] },
      { game: 'alias', award: 'best_team', team: 'team_b', who: [5, 4, 7], score: ['points', 23] },
      { game: 'spy', award: 'sharpest', who: [4], score: ['points', 5] }
    ];
    var stage = $('#endStage'), flip = $('#winner'), list = $('#awards'), canvas = $('#burst');
    var at = 0, timer = 0, visible = false, paused = false, DURATION = 5200;

    function face(a) {
      var g = game(a.game), title = t('award_' + a.award), portrait, words;
      if (!a.who.length) {
        portrait = C.emblem(g.symbol);
        words = '<p class="wcard__name is-title">' + esc(title) + '</p><p class="wcard__score"></p>';
      } else if (a.team) {
        portrait = C.laurel('l') + '<span class="portrait__team">' + a.who.map(function (i) { return avatar(i); }).join('') + '</span>' + C.laurel('r');
        words = '<p class="wcard__award">' + esc(title) + '</p><p class="wcard__name">' + esc(t(a.team)) + '</p>' +
          '<p class="wcard__names">' + esc(listOf(a.who.map(function (i) { return person(i).name; }))) + '</p>';
      } else {
        portrait = C.laurel('l') + '<span class="portrait__ring">' + avatar(a.who[0]) + '</span>' + C.laurel('r');
        words = '<p class="wcard__award">' + esc(title) + '</p><p class="wcard__name">' + esc(person(a.who[0]).name) + '</p>';
      }
      var score = a.score ? '<p class="wcard__score">' + esc(fill(t('score_' + a.score[0]), a.score[1])) + '</p>' : '';
      if (a.team) score = a.score ? '<p class="wcard__score">' + esc(fill(t('score_points'), a.score[1])) + '</p>' : '';
      return '<div class="face face--front card wcard" style="' + C.hueStyle(g) + '">' + C.layers() +
        '<p class="wcard__top">' + C.icon(g.symbol) + '<span>' + esc(t('end_label')) + '</span></p>' +
        '<div class="portrait">' + portrait + '</div>' + words + score + '</div>' +
        cardBack(g, 'trophy', 320, 400);
    }
    function rows() {
      list.innerHTML = AWARDS.map(function (a, i) {
        return '<li><button type="button" style="--glow:' + game(a.game).glow + ';--dur:' + DURATION + 'ms" data-i="' + i + '" aria-current="' + (i === at) + '">' +
          '<i class="dot" aria-hidden="true"></i><span>' + esc(t('award_' + a.award)) + '</span><small>' + esc(gt(a.game).title) + '</small><i class="hairline" aria-hidden="true"></i></button></li>';
      }).join('');
    }
    function mark() {
      $$('button', list).forEach(function (b, i) {
        b.setAttribute('aria-current', String(i === at));
        b.classList.remove('is-running');
      });
      var b = $$('button', list)[at];
      if (b && visible && !paused && !still) { void b.offsetWidth; b.classList.add('is-running'); }
    }
    function show(i, first) {
      at = i;
      mark();
      var land = function () {
        flip.innerHTML = face(AWARDS[at]);
        faceDown(flip);
        setTimeout(function () {
          // Celebrate once the card has turned over, not while it's still face down.
          turn(flip, true, { landing: function () { if (AWARDS[at].who.length) burst(); } });
        }, first ? 120 : 60);
      };
      if (first || flip.__angle == null || flip.__angle > 90) land();
      else turn(flip, false, { response: 0.42, damping: 0.9, near: land });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (!visible || paused || still) return;
      timer = setTimeout(function () { show((at + 1) % AWARDS.length); }, DURATION);
    }

    // SparkBurst: short strokes flying out from a point and fading.
    function burst() {
      if (still || !canvas.getContext) return;
      var ctx = canvas.getContext('2d'), r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      var color = game(AWARDS[at].game).glow, start = performance.now(), cx = r.width / 2, cy = r.height / 2;
      var reach = Math.min(r.width, r.height) * 0.3, rays = 16;
      (function frame(now) {
        var p = Math.min((now - start) / 900, 1), e = 1 - Math.pow(1 - p, 3);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, r.width, r.height);
        ctx.strokeStyle = C.rgba(color, 1 - p);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (var i = 0; i < rays; i++) {
          var ang = i / rays * Math.PI * 2 + Math.PI / rays, len = i % 2 ? 0.62 : 1;
          var inner = reach * (0.18 + 0.62 * e) * len, outer = inner + reach * 0.16 * (1 - p) * len;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner);
          ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer);
          ctx.stroke();
        }
        if (p < 1) requestAnimationFrame(frame); else ctx.clearRect(0, 0, r.width, r.height);
      })(start);
    }

    list.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) show(+b.getAttribute('data-i'));
    });
    stage.addEventListener('click', function () { show((at + 1) % AWARDS.length); });
    [list, stage].forEach(function (el) {
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { paused = true; clearTimeout(timer); mark(); } });
      el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { paused = false; mark(); schedule(); } });
    });
    list.addEventListener('focusin', function () { paused = true; clearTimeout(timer); mark(); });
    list.addEventListener('focusout', function () { paused = false; mark(); schedule(); });

    rows();
    flip.innerHTML = face(AWARDS[0]);
    faceDown(flip);
    onLanguage.push(function () { rows(); flip.innerHTML = face(AWARDS[at]); setAngle(flip, flip.__angle || 0); mark(); });
    var begun = false;
    whileVisible(stage, function () {
      visible = true;
      if (!begun) { begun = true; show(0, true); } else { mark(); schedule(); }
    }, function () { visible = false; clearTimeout(timer); mark(); }, 0.4);
  })();

  // ---------------------------------------------------------------------------
  // The end: the deck laid out face down, turning over one by one.
  // ---------------------------------------------------------------------------
  (function finale() {
    var row = $('#row'), mid = (GAMES.length - 1) / 2;
    var cards = GAMES.map(function (g, i) {
      var el = document.createElement('div');
      el.className = 'row__card';
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.style.setProperty('--rot', ((i - mid) * 2.2).toFixed(2) + 'deg');
      el.style.setProperty('--y', (Math.pow(i - mid, 2) * 2.4).toFixed(1) + 'px');
      el.innerHTML = '<div class="flip">' +
        '<div class="face face--front card" style="' + C.hueStyle(g) + '">' + C.layers({ frame: false }) + '<span class="num">' + pad(i + 1) + '</span><canvas></canvas></div>' +
        cardBack(g, g.symbol, 120, 176) + '</div>';
      row.appendChild(el);
      var flip = $('.flip', el);
      faceDown(flip);
      C.art($('canvas', el), g.id, true);
      el.addEventListener('click', function () { goToGame(i, true); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToGame(i, true); } });
      return { el: el, flip: flip, g: g };
    });
    function labels() { cards.forEach(function (c) { c.el.setAttribute('aria-label', fill(t('row_a11y'), gt(c.g.id).title)); }); }
    labels();
    onLanguage.push(labels);
    var done = false;
    whileVisible(row, function () {
      if (done) return;
      done = true;
      cards.forEach(function (c, i) { setTimeout(function () { turn(c.flip, true); }, still ? 0 : 200 + i * 90); });
    }, null, 0.5);
  })();

  // ---------------------------------------------------------------------------
  // Words arrive as their section comes in.
  // ---------------------------------------------------------------------------
  (function reveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  applyStrings();
  window.joyReady = true;
  root.classList.remove('i18n-pending');
})();
