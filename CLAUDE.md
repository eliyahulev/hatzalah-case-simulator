# חובשטח – סימולטור ומדריך שטח לכונן

Unofficial training/reference app for Israeli first responders (United Hatzalah volunteers).
Hebrew, RTL, mobile-first. **Not affiliated with United Hatzalah** – the footer disclaimer must stay.

Live: https://eliyahulev.github.io/hatzalah-case-simulator/ (GitHub Pages, legacy build from `main`, root).
Repo name still says `hatzalah-case-simulator`; the app was renamed to **חובשטח** (repo rename is pending).

## Architecture: one file, no build, no dependencies

- `index.html` – everything: CSS, three views, all data, service-worker registration.
  - **🚑 סימולטור** – `CASES` array (9 cases × stages; question types `single`, `multi`, `order`). Scoring is in `check()`; `multi` counts correct options automatically, so the "סמן N" text in `q.text` must match the number of `1` options.
  - **🧭 מדריך שטח** – `FG_COMPLAINTS` (complaint → candidate conditions) and `FG_CONDS` (per condition: `key` = the one distinguishing sign, `nums` = key-number chips, `treat`, `danger`, `ask`). Rendered by `renderField(hash)`. Routes: `#field`, `#field/<complaint>`, `#field/c/<cond>`, `#field/nums`, `#field/all`, `#field/tools[/cpr|epi|sugar]`.
  - **📚 חומר לימוד** – a complete separate HTML page stored as base64 in `LEARN_B64` and loaded into `<iframe srcdoc>`. `#learn/<condId>` deep-links into it. **Edit it with `node scripts/learn.js extract` → edit `learn.html` → `node scripts/learn.js embed`.** `learn.html` is git-ignored.
  - **Tools** – metronome (Web Audio, 100–120 bpm, wake lock) and timers (`FT_PRESETS`, several at once, `loop` for the AED 2-min cycle). State lives in `FT`; a floating badge (`ftBadge`) shows running timers on other screens.
  - Routing is hash-based in `route()`. The field container id is `fieldView` on purpose: an element with id `field` would make the browser anchor-scroll on `#field`.
- `sw.js` – offline support. Same-origin: network-first with cache fallback; cross-origin (fonts): cache-first. **Bump `CACHE` (`hcs-vN`) whenever icons/manifest change.**
- `manifest.json`, `icons/` – PWA. `icons/icon-source.png` is the user-supplied logo; regenerate sizes with ImageMagick (`magick icons/icon-source.png -background white -alpha remove -resize 512x512 icons/icon-512.png`, same for 192 and 180/apple-touch-icon).

## Medical content rules

- Source of truth is United Hatzalah's own site, 1221.org.il ("דבר רפואה" articles, "החייאה במבוגר", "עדכונים בהחייאה"). When the course booklet and the site disagree, follow the site. Key points already aligned: oxygen only for distress or SpO₂ < 94% (ACS, stroke); high-flow O₂ in asthma; no field differentiation of stroke type; breaths every 6 s; no repeated pulse checks after CPR starts; epinephrine first in anaphylaxis; aspirin 300 mg chewed with contraindications (bleeding, ulcer, allergy, surgery/trauma < 2 weeks, pregnancy, age > 16); glucose normal 60–100, hypo < 60.
- Items **not found** on the site and left as in the booklet (verify with an instructor before changing): glucose recheck 5 min after glucogel; "every seizure goes to hospital"; BP in both arms under FAST; febrile-seizure details; straw tip for hyperventilation.
- Simulator and field guide and study page must say the same thing. When you change a fact, change it in all three (`CASES`, `FG_CONDS`, learn page).
- Never remove the unofficial-project disclaimer (footer in `index.html` and in the learn page).

## Working on it

- Preview: `python3 -m http.server 8765` in the repo and open http://127.0.0.1:8765/. The Claude desktop browser pane **blocks service workers**; test offline/PWA in real Chrome or on a phone.
- Quick sanity after editing: `node --check <(sed -n '/^<script>$/,/^<\/script>$/p' index.html | sed '1d;$d')` and load every view in the browser (`#`, `#field`, `#field/c/cpr`, `#field/tools`, `#learn`).
- RTL gotcha: `‹ ›` and other bidi-mirrored glyphs flip in RTL; use `←`/`→`.
- Deploy = push to `main`. Pages builds take 1–3 min; builds occasionally fail on GitHub's side with "Page build failed" while queued – just push again or re-run.
- Keep it one file. No frameworks, no bundler, no npm.
