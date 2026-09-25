# CLAUDE.md: context for working on Naqsh-e Khiyal (نقشِ خیال)

Classical Persian poems animated couplet by couplet. Static site on GitHub Pages:
https://kimzify.github.io/naqsh-e-khiyal/ · repo https://github.com/Kimzify/naqsh-e-khiyal (branch `main`, Pages deploys from `main` / root; no build step).

## Working with the owner
- The owner (Kimia) writes in Persian; reply in Persian, briefly, and say exactly what changed. She reviews visuals frame by frame.
- Edit files in this repo directly and commit; she runs `git push` herself.
- Before building a new scene or poem, propose one line per couplet (symbol + what happens) and wait for approval. When a symbol is uncertain, offer 2–3 concrete options.
- Read `docs/DESIGN-NOTES.md` before designing anything: it lists the rules and every rejected idea. The most important rules:
  - clear Persian-poetry symbols that cover every part of the couplet
  - no references that need a footnote
  - no religious imagery
  - no words drawn in place of images
  - people small or in silhouette
  - true-to-life drawing
  - gradual appearances
  - restrained endings
- Claims in text (README, glosses) need a source. Don't invent facts like "Hafez's favourite word". Use Ganjoor and Dehkhoda.
- English lines in Markdown must start with a Latin character, or GitHub renders them right-to-left.

## Layout
- `index.html`: gallery; `POEMS` array + `COVERS` functions at the top of its script.
- `hafez/ghazal-1/`, `hafez/ghazal-179/`, `hafez/ghazal-255/`, `saadi/ghazal-268/`: one self-contained HTML page per poem (inline CSS/JS, canvas scenes, Web Audio music). Ghazal 255 is the newest approved page and the template; Saadi 268 is a first draft waiting for review.
- `assets/og/*.png`: 1200×630 link previews; `assets/favicon.svg`.
- `docs/ADDING-A-POEM.md`: page anatomy, music, checking, publishing.
- `tests/smoke.mjs` + `.github/workflows/check.yml`: loads every page headless and fails on JS errors.
  - Run locally: `python3 -m http.server 8000`, then `npm test`.

## Page architecture (short)
- Scenes `rN(c,t,W,H)` are pure functions of time.
- The caption sits on its own dark band. Scenes are drawn at a virtual height of sceneHeight/0.7, so keep content above 70% of H.
- Nastaliq glyphs are very tall. A `<style id="nastaliq-fix">` block before `</head>` gives Persian headings and verse lines room. Keep it when editing.
- `window.__seek(sec)` jumps to any moment, for testing.
- Music: each poem has its own dastgah (Shur, Bayat-e Esfahan, Segah, Homayoun so far), a ney phrase per couplet, and a recurring santur cadence at the end of each couplet as a musical radif. No drums.

## Ghazal 255 scenes (current, approved)
1. Joseph's shirt comes down into Jacob's hands at the hut door.
2. Wind breaks the courtyard pool's reflection, and it comes back whole.
3. A nightingale on a blossoming arched branch.
4. The turning sky: stars wheel and the moon waxes to full (the climax).
5. Saadi's raindrop becomes a pearl inside a shell.
6. Noah's ark.
7. A pilgrim in white crosses a treeless night desert; a camel-thorn tears the hem.
8. A lantern traveller reaches a caravanserai.
9. A candle in a glass lantern; wind keeps throwing a moth back; the lantern door opens by itself.
10. The hut far off in a long stormy night, one window lit with a small reader inside, until dawn.

## Saadi Ghazal 268 scenes (third draft; 5, 6, 7, 9, 11, 12, 13 and the visible beloved were revised after review)
Its full-text view puts the two hemistichs close to the middle (the owner's choice); the Hafez pages still align them to the outer edges.
One caravan leaves at dusk and is watched by the one left behind until dawn; radif «می‌رود». The cadence is santur plus a camel bell (درای) that sounds farther off each couplet. Umami label: `saadi-ghazal-268`.
1. Caravan leaves the caravanserai at sunset; a small light leaves the figure and settles at the breast of the beloved, who sits visible in an open mahmal.
2. Cold night; the caravan vanishes on the horizon; the figure sinks down in the wind; frost.
3. Doors of the caravanserai close on the figure; red tulips with dark hearts rise on the threshold.
4. Low moon behind the figure; long shadows; the mahmal's shadow is a lying cypress, the figure's shadow reaches after it.
5. The mahmal's trailing cloth smooths the tracks; the figure's footprints fill in with wind.
6. The beloved looks back from the mahmal, then turns away; coals kindle inside the seated lover's silhouette and smoke rises from their head.
7. Where the mahmal's camel knelt, the wind smooths every print away except the beloved's one footprint, which the lover kneels and shelters with a hand and a little wall of sand.
8. A whirlwind rises from the ground to the sky; the figure shades their eyes.
9. Night rider on the camel tracks, reins slipping loose; someone at the caravanserai waves them back.
10. Rain; one camel sinks in the mud and the caravan halts, then pulls free and goes on.
11. The seated lover holds a handful of sand; it runs out between the fingers and the wind carries it toward the far caravan, three times.
12. Climax: dawn; a figure of light steps out of the standing lover, walks after the far caravan leaving fading light footprints, and joins the light in the mahmal; the body sinks to its knees.
13. Empty morning; the lover cries out and the cry spreads over the sand in rings that fade at the dunes with no echo; they sit down.

## Open items
- Umami analytics (done): one Umami site for the whole domain. Every page's `<head>` has the script with website ID `2786b32f-32db-4029-a82f-e0adbcf506d7` and `data-domains="kimzify.github.io"` so local runs aren't counted.
  - Events (each with `{poem:"ghazal-N"}`): `begin`, `couplet-N` (once per visit, after 3 s of that couplet), `finish` (once per visit), `read-text`, `sound-off`.
- Check every poem text against Ganjoor before promoting the site.
- Ideas not done yet:
  - deep links to a couplet (`#5`)
  - a Persian UI toggle
  - a shared JS file for audio/playback
