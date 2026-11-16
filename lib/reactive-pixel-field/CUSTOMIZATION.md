# Reactive Pixel Field configuration

`src/configuration.js` is the canonical, versioned product contract. It exports normalized defaults, presets, human-facing field definitions, and `reactivePixelFieldRuntimeOptions()` so the live editor, demo, documentation, Reset, and runtime all use the same configuration object.

Pass an options object to `mountReactivePixelField(root, options)`.

```js
const controller = mountReactivePixelField(root, {
  gridSize: 9,
  fillSize: 8,
  dprCap: 2,
  introDuration: 1600,
  chargeDuration: 2200,
  waveDuration: 1800,
  targetIdleDelay: 2400,
  autoCrawler: true,
  target: { x: 0.5, y: 0.5 },
  palette: ["#323232", "#777572", "#e4e2de", "#d83a3a"],
});
```

## Supported inputs

| Input | Type | Default | Contract |
| --- | --- | --- | --- |
| `touchMode` | `"scroll"` or `"interact"` | `"scroll"` | Scroll page ignores touch drawing/charge/release and allows native panning and zoom. Interact reserves field gestures for drawing and hold/release. Mouse, pen and keyboard remain available in either mode. |
| `ariaLabel` | string | `"Interactive Reactive Pixel Field"` | Trimmed to 240 characters; blank/invalid values use the default. Used only when the host has no `aria-label` or `aria-labelledby`. |
| `gridSize` | number | `9` | Cell pitch, clamped to 6–18 CSS pixels. |
| `fillSize` | number | `8` | Filled area inside each cell, clamped below the pitch. |
| `dprCap` | number | `2` | Canvas pixel-ratio ceiling, 1–2. |
| `introDuration` | number | `1600` | Initial field reveal in milliseconds. |
| `chargeDuration` | number | `2200` | Hold time needed for a fully charged ripple. |
| `waveDuration` | number | `1800` | How long each ripple spreads before the pixels settle, in milliseconds. |
| `targetIdleDelay` | number | `2400` | Inactivity before the first automatic ripple. |
| `autoCrawler` | boolean | `true` | Enables idle ripples for fine-pointer devices when click ripples are on. |
| `target` | record | `{ x: 0.5, y: 0.5 }` | Normalized ripple position for keyboard and preview ripples, each axis clamped to 0.05–0.95. |
| `palette` | string array | Demo palette | Four valid CSS colors from low signal to accent. |
| `gridColor` | CSS color | `#1c1c1b` | Structural grid color. |

## Lifecycle

```js
controller.pulse(0.5, 0.5, 1);
controller.burst(0.5, 0.5);
controller.update({ cellShape: "circle", motionSpeed: 1.4, waveRadius: 0.7 });
console.log(controller.getState());
controller.destroy();
```

The normalized contract also exposes real cell geometry, structural grid, ambient pattern, pointer trail, charge, ripple, burst, keyboard position, idle-ripple, color, and renderer inputs. See the exported field groups for exact safe ranges and labels.

`pulse(x, y, strength)` and `burst(x, y)` accept normalized coordinates and return the controller. `update()` applies values immediately and reallocates the field only when grid density or renderer resolution changes. `destroy()` cancels animation, removes every event listener, disconnects the resize observer, and restores the original mount contents, style, and attributes.

When using `adapters/react/ReactivePixelField.js`, pass these same runtime options through the component's `options` prop and use a new object when values change. The adapter forwards identity changes to the canonical `update()` method, owns cleanup, and exposes only `getState()`, `pulse()`, and `burst()`; consumers should not mount or destroy a second controller on the adapter element.

Reactive Pixel Field has no image-media contract. Its default palette uses graphite, warm white and chartreuse.

## Ripples and impact

Holding the pointer gathers pixels into the pointer; releasing starts a ripple exactly there, stronger the longer it was held. `pulse(x, y, strength)` starts a ripple at normalized coordinates, and Enter/Space starts one at `target`. Each ripple's front spreads outward and leaves damped rings that push the actual grid cells out and back; every cell returns to its original grid position as the ripple fades. Stronger ripples reach further. `burst(x, y)` starts a strong ripple with a painted flash and stage shake. A double-click shows the first click's ripple and then the burst; the second click's ripple is replaced by the burst. Resize keeps active ripples at their normalized positions. At most `maxWaves` ripples are retained.

The existing setting keys remain portable, with labels describing their current behavior:

- `waveEnabled`: **Click ripples**. When off, activation leaves a local glow instead of rippling.
- `waveRadius`: **Ripple size** in the editor (**Ripple reach** in the developer descriptors); `waveDuration`: **Ripple duration**; `waveThickness`: **Ripple height**.
- `autoCrawler`: **Idle ripples**; `targetIdleDelay`: initial delay; `crawlerSpeed`: interval. Automatic ripples spread across the field, pause during a held charge and after pointer input.
- `crawlerY`: **Idle ripple height**; `crawlerWander`: vertical variation; `crawlerSize`: idle ripple strength.

The launcher, projectile, aim guide and target marker were removed. Their former settings (`launcher`, `targetMarker`, `targetSignal`, `targetRange`, `targetStrength`, `targetMarkerSize`, `targetMarkerShape`, `crawlerTrailLength`) are discarded from older saves.

## Pointer trail and passive pattern

The pointer trail follows a smoothed copy of the pointer path: two cascaded followers round off corners and hand jitter, so the painted line is slim and continuous. `trailRadius` sets its width (default `0.8` cells).

The passive pattern is a slowly drifting, reshaping height field: its higher ground lights the grid as soft masses whose edges fade out through a wide dithered gradient, with no hard lines. `ambientIntensity` sets its brightness, `motionSpeed` how fast it drifts, `patternScale` how small and frequent the masses are and `grainIntensity` the per-cell texture. The former cloud pattern's `edgeBandIntensity`, `idleDelay` and `idleBoost` settings are discarded from older saves.

`ntpixel:pulse` reports each requested user/API ripple; `ntpixel:impact` reports its start with normalized `x`, `y`, `strength` and `idle`. Idle ripples do not increment the user pulse counter. `getState()` also reports `impactCount`.

Reduced motion gives immediate local light feedback without rippling, idle ripples or animated charge gathering. Changing the preference clears active motion; disabling click ripples and destroying the controller also clear displaced cells. Touch scroll/interact modes and cancellation rules remain intact. These behaviors use the same canonical runtime/configuration in Example, Asset only, ZIP, Code, CLI, MCP and AI Prompt.

## Input studio presentation

The default uses chartreuse signals over a quiet drifting texture, giving foreground website content space to read. Signal, Red pulse, and Blue hour are look presets that change only grid size, pixel size, pixel shape, the four-color palette while retaining their existing preset IDs (`signal`, `sonar`, and `terminal`). Signal explicitly restores the default look. Switching looks preserves feature toggles, keyboard ripple position, idle-ripple settings, interaction strengths and timing, and all other settings. The editor shows 15 customer controls: **Look** (Grid size, Pixel size, Pixel shape and the four colors), **Motion** (Animate pattern, Pattern speed, Pattern intensity), **Interaction** (Pointer trail, Ripple size, Double-click burst, Idle ripples) and **Advanced → Page behavior** (Touch mode). Every other setting, including the screen-reader name, the keyboard ripple position, ripple timing and strength, charge, burst, idle timing and renderer detail, is a code-only option: it remains in the canonical configuration and developer API, retains its default and saved values, and travels through delivery. Pattern intensity remains available when Animate pattern is off. Public runtime methods are retained.

Example shows the Input studio context and a real Send a ripple action. Asset only removes this context while retaining the same live field. Customized options download through the shared package flow. All visuals are NT-authored HTML, CSS, and the existing procedural Canvas runtime; no image media or external fonts were added. Status announcements now change on pulse/burst counts rather than continually announcing changing cell counts.

### Look controls

Look groups Grid size, Pixel size, Pixel shape, the four independently editable palette colors (Dim / Medium / Bright / Highlight). `fillSize` is clamped to `2…gridSize - 0.5` px; the published field metadata `maxFrom: { key: "gridSize", offset: -0.5 }` describes that dependent maximum within its static bounds. Both size controls accept numeric and keyboard edits.

The canvas always clears to alpha before drawing pixels, so the consuming host owns the surrounding surface. Choose palette colors that suit that surface. ZIP, Code, CLI, MCP and AI Prompt use the same normalized configuration.

### Page behavior

Advanced → Page behavior contains **Touch mode**. The screen-reader name (`ariaLabel`) is a code-only option with a descriptive default. Scroll page is the hero-friendly default, including when opening older saved settings that predate these fields. Interact enables one-finger drawing, hold charge and release ripple, but prevents page scrolling that starts on the field. Provide an area outside the field for scrolling when choosing Interact. Changing modes during a gesture cancels it; lift all fingers before starting another gesture. Cancellation, lost capture, a second touch, window/focus interruption, and teardown clear input without a release ripple. Existing painted afterglow can still fade normally.

The name is portable text: looks and Reset look keep it; explicit Reset everything restores the default. Both fields travel through ZIP, Code, CLI, MCP and AI Prompt using the same configuration as the preview. Older saves gain only the missing new defaults; invalid supplied settings remain rejected.

Author-provided `aria-label` and `aria-labelledby` take precedence. Reference labels outside the mount, since mounting replaces its children. Runtime updates change only a name the component supplied. If the host replaces that name or adds `aria-labelledby`, later updates leave naming to the host. Teardown removes component-owned state and restores previous inline values without overwriting subsequent host attribute/style changes. Original child nodes are restored with their identity and listeners intact.

### Preview intro replay

The editor’s **Replay intro** action restarts **Load fade-in** at its current duration through `update({}, { restartIntro: true })`, without remounting or changing configuration, saved tweaks, undo history, or exported settings. It is a preview action, not a delivered setting. A zero duration keeps the field fully revealed. Under reduced motion the action acknowledges the request without restarting the intro clock.

The surrounding background belongs to the host page or shared preview environment. Legacy saved background settings are discarded; asset behavior, geometry, image settings and intrinsic surfaces remain portable.
