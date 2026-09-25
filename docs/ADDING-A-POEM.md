# Adding a poem

Every poem is one self-contained HTML page in `<poet>/<poem>/index.html`. Use the newest page, [`hafez/ghazal-255/index.html`](../hafez/ghazal-255/index.html), as the template. Read [`DESIGN-NOTES.md`](DESIGN-NOTES.md) before you design any scenes.

## 1. Plan before you draw

1. Take the text from [Ganjoor](https://ganjoor.net) and check every couplet against it.
2. Find **one visual idea that runs through the whole poem**, usually through its radif. Ghazal 179's radif is «نخواهد ماند», so everything turns to dust except kindness. In Ghazal 255 the radif is «غم مخور», so every scene starts at its darkest moment and then turns.
3. Write **one line per couplet**: the symbol and what happens to it. Test each line against the design notes. Could a reader who doesn't know the reference understand it? Does it cover every part of the couplet?

## 2. Page anatomy

| Part | What it is |
|---|---|
| `POEM` | One entry per couplet: `[hemistich 1, hemistich 2, English gloss, short English title]` |
| `BD`, `F` | Seconds per couplet (18) and crossfade length (1.8) |
| `rN(c,t,W,H)` | One scene per couplet: a **pure function of time** `t` (0…18). Don't keep state between frames. Seeking and crossfades depend on this. |
| `SCENES` | The list of scene functions, in order |
| `rAmbient` | Background of the intro screen |
| Audio | `ney()`, `pad()`, `strike()` (Karplus–Strong santur), `riz()`, `cadence()` (the musical radif), `hiss()`, `bell()`, `chirp()` |
| `PHR`, `PADS`, `CAD`, `EVENTS` | Ney phrase per couplet, pad chords, when the cadence plays, and any extra sound cues. `fire()` triggers them as time passes. |
| `GALLERY_URL` | `"../../"`, the link back to the gallery |

### Layout

The scene is drawn only in the top part of the screen, and the caption has its own dark band below it (`sceneH()`, `sceneFrame()`). The band's height comes from the tallest caption. Scenes are rendered at a virtual height of `sceneHeight / 0.7`, so **anything below 70% of `H` inside a scene is cut off**. Keep the action above that line.

### Useful helpers

`person()` (robed figure), `hut()`, `cypress()`, `hillLayer()`, `mountains()`, `archPath()`, `star8()`, `glow()`, `stars()`, `moonPhase()`, `candle()`, `rose()`, `camel()`, `nightingale()`, `lantern()`, `moth2()`, `thornBranch()`, `camelthorn()`, `duneLayer()`.

## 3. Music

- Give each poem a **different dastgah**. Used so far: Shur (Ghazal 1), Bayat-e Esfahan (179), Segah (255). Quarter tones are written as, for example, `Ek4 = E4 × 2^(-1/24)`.
- The ney plays **one composed phrase per couplet**. No drums, and no note on every word.
- End every couplet with the same short santur figure (`cadence()`), so the music has a radif of its own.

## 4. Check it

```bash
python3 -m http.server 8000
npm test          # loads every page and fails on any JavaScript error
```

Use `window.__seek(seconds)` in the browser console to jump to any moment. Take screenshots of a few moments in every couplet, then crop and zoom on the details: hands, held objects, animals, faces. Most of the problems found so far were in those details.

## 5. Publish

1. Add the poem to the `POEMS` list at the top of the script in `/index.html`, and add a small cover function to `COVERS`.
2. Add a 1200×630 preview image to `assets/og/` and the matching `<meta>` tags in the new page's `<head>`. Copy them from an existing page.
3. Add a row to the table in `README.md`.
4. Keep the Umami `<script>` tag in the `<head>` and the `track(...)` calls (they come with the template). Change the `poem:"ghazal-255"` label next to `const track` to the new page's folder name.
5. Push. GitHub Pages redeploys automatically.
