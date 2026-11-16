# Install Reactive Pixel Field for Vanilla

Keep this extracted asset folder intact so relative runtime, media, and dependency paths continue to resolve.
The surrounding Example website HTML, CSS and JavaScript are not included.

Read `README.md` and `CUSTOMIZATION.md` for the asset's supported options, required host markup or content props, sizing, fallbacks, and lifecycle.

## Vanilla setup

Load `src/styles.css` once, then import the canonical mount function from `src/reactive-pixel-field.js`:

```js
import { mountReactivePixelField } from "./src/reactive-pixel-field.js";
import options from "./reactive-pixel-field.options.js";

const root = document.querySelector("[data-asset]");
const controller = mountReactivePixelField(root, options);

// Later: controller.update(nextOptions);
// Teardown: controller.destroy();
```

Use a stylesheet import or a `<link>` that points to `src/styles.css`.

## Package boundary

Read `WEBSITE-USE.md` for permission to use, modify and reuse this item and its bundled media in personal, commercial and client websites.
Bundled third-party software remains under its own license; retain the applicable notices and license files. See `THIRD_PARTY_NOTICES.md`. Declared local runtime dependencies and media remain in their original relative paths.

