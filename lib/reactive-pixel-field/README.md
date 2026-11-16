# Reactive Pixel Field

Reactive Pixel Field is a self-contained Canvas 2D Component. Hold the pointer to gather pixels, then release a ripple whose rings push the actual grid cells out and back before they settle into place. A soft, slowly drifting and reshaping texture forms the passive pattern; smoothed pointer trails, double-click bursts, keyboard input and occasional idle ripples share the same field.

The canonical implementation is `src/reactive-pixel-field.js`; its versioned customization contract is `src/configuration.js`. `adapters/react/ReactivePixelField.js` is a React and Next.js lifecycle adapter around that unchanged runtime.

The Component uses local files only.

This runtime does not accept or render image media. Its default visual direction pairs graphite and warm white with chartreuse highlights.

## Install

Copy `src/reactive-pixel-field.js`, `src/configuration.js`, and `src/styles.css`, load the stylesheet, then mount the field:

```js
import { mountReactivePixelField } from "./reactive-pixel-field.js";

const field = mountReactivePixelField(document.querySelector("#pixel-field"), {
  gridSize: 9,
  fillSize: 8,
  waveRadius: 0.52,
});
```

The mount element needs a defined width and height. The controller exposes `update()`, `pulse()`, `burst()`, `getState()`, and `destroy()`. Destruction cancels rendering, disconnects observers, removes listeners, and restores the mount element.

See `CUSTOMIZATION.md` for supported inputs and the lifecycle contract.

## React adapter

Import the canonical stylesheet once from the host application, then pass an immutable canonical options object to the adapter:

```jsx
import { ReactivePixelField } from "./adapters/react/ReactivePixelField.js";
import {
  reactivePixelFieldConfigurationDefaults,
  reactivePixelFieldRuntimeOptions,
} from "./src/configuration.js";
import "./src/styles.css";

const options = reactivePixelFieldRuntimeOptions({
  ...reactivePixelFieldConfigurationDefaults,
  autoCrawler: false,
});

export function SignalField() {
  return (
    <div className="signal-stage">
      <ReactivePixelField options={options} />
    </div>
  );
}
```

The host wrapper must provide the intended width and height. The adapter owns canonical mount/update/destroy and exposes only `getState()`, `pulse()`, and `burst()` through a forwarded ref. Changing the `options` object calls the canonical controller's `update()` method; mutating an existing object does not constitute a React update.

React is a host-provided dependency and is not bundled into the Component package. The repository reference verifies React 19.2.8; that evidence is not a compatibility claim for untested versions.

## Next.js App Router

The same adapter begins with a client boundary and can be rendered from a Server Component. Import the canonical global stylesheet from an applicable App Router layout, page, or component, then import `ReactivePixelField` normally. The isolated reference remains under `examples/next-kinetic-carousel/` and includes a Reactive Pixel Field route without changing package ownership.

## Behind foreground hero content

Keep foreground content as a sibling of the mount (mounting replaces its children). Give the field an explicit height and let decorative text pass pointer input through, then opt real controls back into hit testing:

```html
<section class="hero">
  <div id="pixel-field"></div>
  <div class="hero-content">
    <h1>Ideas into motion</h1>
    <p>A short introduction to your work.</p>
    <a href="#work">Explore our work</a>
    <button type="button">Contact us</button>
  </div>
</section>
<section id="work">Your next section…</section>
```

```css
.hero { position: relative; }
.hero #pixel-field { width: 100%; height: 80svh; min-height: 360px; }
.hero-content {
  position: absolute; inset: 0; z-index: 1;
  display: grid; place-content: center; padding: 2rem;
  color: white; pointer-events: none;
}
.hero-content :is(a, button, input, select, textarea, [contenteditable]) {
  pointer-events: auto; touch-action: auto;
}
```

Use `touchMode: "scroll"` (the default) for a scrolling hero. Touch swipes then scroll normally across the background and decorative text; touch drawing and hold/release ripples are disabled. Desktop drawing, clicks and Enter/Space still work. Choose `touchMode: "interact"` only when touch drawing is the priority: swipes starting over the field cannot scroll. Foreground links/buttons remain separate, operable controls and do not trigger field pulses. Their normal touch scrolling remains available. Text with `pointer-events: none` stays readable by assistive technology but cannot be selected with a pointer; opt selectable text back in if selection matters more than drawing beneath it.

Set `ariaLabel` to describe the field, or provide an `aria-label`/`aria-labelledby` on the mount for host-owned naming. Put any referenced label outside the mount. Do not put the foreground controls inside the field or set `pointer-events: none` on the field itself.
