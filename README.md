# Joy web

The landing page for Joy, eight party games to play with friends on one phone:
Truth or Dare, Charades, Never Have I Ever, Would You Rather, Most Likely To,
Hot Seat, Alias and Spy. Joy is built for iPhone
([joy-ios](https://github.com/FactoryLabsGroup/joy-ios)) and Android
([joy-android](https://github.com/FactoryLabsGroup/joy-android)).

Live at **https://factorylabs.app/joy**, from this repository's GitHub Pages
(every Pages site in the organization appears under `factorylabs.app/<repository>`).

A static site with no build step:

| File | What |
|---|---|
| `index.html` | The page. |
| `assets/styles.css` | Its look. |
| `assets/cards.js` | The cards, as the app makes them: the material, the foil and tilt, and every game's living artwork. |
| `assets/app.js` | The copy in both languages, and everything that moves. |
| `assets/deck.js` | A sample of the app's own cards, every game, language and intensity. |
| `privacy.html`, `support.html` | The privacy policy and support pages, both languages in each (`assets/page.css`, `assets/page.js`). |
| `404.html` | Not found: a card that isn't in the deck. |
| `assets/og.jpg`, icons | The share image (the deck, fanned) and the icons, made from the app's own icon. |

## Store links

Joy isn't live in the stores yet, so both buttons say *Coming soon*. When it
is, set the links at the top of `assets/app.js`:

```js
var STORE = {
  appStore: 'https://apps.apple.com/app/id…',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.factorylabs.joy'
};
```

Each button becomes a download link everywhere on the page, and the last
section says Joy is in the stores.

## Languages

English and Georgian. The page opens in Georgian when the browser prefers it,
remembers the reader's choice (`joy.lang`, shared with the privacy and support
pages), and takes `?lang=ka` or `?lang=en`. All the copy on the main page is in
`STRINGS` and `GAME_TEXT` in `assets/app.js`.

Where the app already has the line (`Localizable.xcstrings`), the site uses it
word for word: the welcome page, every game's name, line and rules, the
intensity captions and the winners' titles. The rest follows
the app's own rules for Georgian: the polite plural, never upper-cased, „…“
quotes, and a non-breaking hyphen where a Georgian ending meets a Latin name
(`Android‑ზე`), so the line never breaks inside it.

## What the site is built from

The page is built the way the app is: dark, quiet and premium everywhere except
the cards, because the cards are the show.

- **Colour** is the app's (`Theme.swift`): the near-black canvas `#09090B`,
  graphite surfaces with a one-pixel hairline, and colour kept for the games and
  the players. Each game owns its `Hue` from `GameID.swift`, a deep gradient for
  its cards and a lifted glow for its small accents on the canvas: the page dots,
  the light behind the deck, the dot beside a title.
- **Type** is the app's one sans: SF Pro on Apple devices, Inter elsewhere, and
  Noto Sans Georgian for Georgian, set bold with tracking tightened as the size
  grows, and none for Georgian (`TextStyle`).
- **The cards** are the app's material (`CardSurface`): the hue's gradient, a
  slowly drifting inner glow, print grain, an inset frame, a light-catching edge,
  and a band of holographic foil. The foil follows the mouse, or the phone when
  the browser reports its tilt, and sways on its own otherwise, as it does in the
  simulator. The cards lean with the hand (`TiltSensor`, `tiltEffect`).
- **The artwork** is `GameArtwork.swift` ported line for line to a canvas: the
  flame and its embers, the spotlight on the stage, the hand folding its fingers,
  the two orbs, every line leading to one, the heat rings, the words in flight and
  the eye looking round the room. It plays at 30 fps while it's on screen.
- **Dealing** is `FlipReveal` and `DealtCard`: cards arrive face down with the
  guilloché back and the game's emblem, and turn over on the app's spring. Dealt
  cards carry their number and the game's symbol as a watermark, and can be
  swiped away like a real deck (`SwipeableCard`).
- **The hero** is the app's welcome page (`WelcomeView`): the whole deck dealt
  into a hand that pivots below the cards and breathes, the aurora of every
  game's colour behind it, and the words arriving after the cards.
- **The games** are the home carousel (`GameCarousel`): neighbours shrink towards
  the focused card and turn away in 3D, the page dots light in the game's glow,
  and *Surprise me* spins to a random game. A card turns over to show the rules.
- **The cards section** deals real cards from `deck.js` in the page's language,
  one deck per game and intensity, each dealt once before any repeats
  (`PromptDeck`), Light or Bold, as in the app.
- **The end** is `GameOverView`: the winner's card between laurels, turned over
  with the `SparkBurst`, and a title for every winner.
- **Motion** is the app's: `.arrive` (smooth, no overshoot) and its springs.
  Everything holds still under Reduce Motion.

`assets/deck.js` is generated by `tools/deck.py` from the app's
`Joy/Resources/Content/*.json`, so the site only ever shows cards the app really
deals. The sample is seeded, the same one each time. When the decks change, run
`python3 tools/deck.py ../joy-ios`.

## Privacy

The privacy claims come from the apps themselves: Joy has no accounts and no
servers, the iOS code makes no network requests, and the Android app asks for no
permission except vibration. Change the policy if that ever changes.

## Running locally

```bash
python3 -m http.server 8123
```

and open http://localhost:8123. `404.html` uses absolute `/joy/` paths, so to see
it locally serve the parent folder and open http://localhost:8123/joy/404.html.
