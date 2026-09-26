# No Retreat · Saadi, Ghazal 187

The sole interpretation of Ghazal 187 lives at `saadi/ghazal-187/`. It replaces the earlier draft; there is one gallery entry and one social preview.

## Text and interpretation

Source: [Ganjoor, Saadi’s Divan, Ghazal 187](https://ganjoor.net/saadi/divan/ghazals/sh187). All sixteen hemistichs were checked against its poem text. English lines are interpretive glosses, not a quotation from a published translation.

The poem has an end rhyme on *-izad*, not a repeated verbal radif. A recurring santur descent answers that rhyme. The original ney phrases use a Chahargah-inspired collection on C (D and A koron); this is a synthesized interpretation, not a claim to reproduce a traditional performance.

The approved visual thread is a lover approaching, and refusing to leave, the beloved’s threshold. The earth-and-stars reflection in couplet 2 is a visual interpretation of “both worlds,” not a literal definition of that phrase. The rose at the window in couplet 4 stands for the beloved’s sweet lips. Neither symbol is written into the picture.

## Eight scenes

1. Beyond reason: two companions withdraw into an arcade; the lover crosses the courtyard toward the beloved.
2. Earth and stars: a landscape and starry sky share one reflection. Ripples settle toward the beloved’s feet as the lover kneels on the near bank.
3. No retreat: a flood crosses a submerged causeway; arrows fall into the water while the lover continues forward.
4. The wilderness of longing: a rose opens in a pot on the beloved’s windowsill; many small lovers cross the treeless dunes beyond it.
5. Empty hands: the lover tries three times to lift loose stones into a step beneath an unreachable threshold. Each stone slips away.
6. The threshold: the doorway opens, then shuts. Other visitors depart; the lover remains.
7. All other doors: the lover reaches and closes three doors, then approaches the seated beloved. Curtains, water, and other visitors move in the growing wind.
8. The hem: the beloved turns away; the lover kneels and holds the real trailing hem. Movement subsides without reconciliation or a promised dawn.

## Implementation

The HTML page contains its own styles, drawing functions, playback engine, and Web Audio score. No framework or build step. Google Fonts and the existing domain-restricted Umami script are the only external services.

Canvas scenes remain deterministic functions of time. They use the same virtual-height convention as the other pages: the visible area is the top 70% of a 1000-unit world. Width follows the available aspect ratio, so key positions recompose on a phone rather than cropping the edges of a desktop image.

Materials use seeded pigment grain and low-frequency cloud textures generated once. A bounded cache stores static masonry. Water reflections are sampled from a separate canvas. Hands and held objects share world-space coordinates, including the final cloth grip.

Each couplet lasts 22 seconds; the complete poem lasts 176 seconds. Caption word opacity is calculated from the playback clock, not CSS timers. Seeking thus freezes both words and artwork at the requested instant. The maximum caption height is measured after fonts load and on resize, keeping text outside the drawing.

Audio is created after a user gesture. A short look-ahead scheduler rebuilds its event bus on every seek or resume. Pausing disconnects active sources and reverb, so notes from an earlier scene do not leak into the next one. Hidden tabs pause and resume only if previously playing. Muting persists across seeks and replay.

Reduced-motion preference shows a composed still for each couplet while retaining the poem’s timing and manually started music. Reading opens a native dialog with keyboard focus handling and English glosses. Arrow keys move between couplets; Space pauses; the timeline supports continuous seeking.

Analytics use the label `saadi-ghazal-187`. A couplet is counted only during playback after its third second; test seeks do not count as visits to every scene.

## Checks

Run the site locally, then:

```bash
npm test
npm run test:saadi-187
```

The second check covers every couplet at several moments on desktop and mobile, small-screen and landscape layout, deterministic seeking, bounds, keyboard controls, the reading dialog, pause/resume, mute, generated audio, ending/replay, and reduced motion. To save review screenshots outside the repository:

```bash
SCREENSHOTS=/tmp/no-retreat-review npm run test:saadi-187
```

Test hooks:

```js
window.__seek(22 + 16); // second couplet, sixteen seconds in, paused
window.__poemInfo;      // couplets, secondsPerCouplet, duration
```

The gallery links only to this interpretation. Its social preview is `assets/og/saadi-ghazal-187.png`.
