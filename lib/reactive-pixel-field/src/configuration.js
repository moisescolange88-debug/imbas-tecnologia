function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
}

function number(value, fallback, minimum, maximum, step = null) {
  const parsed = Number(value);
  const finite = Number.isFinite(parsed) ? parsed : fallback;
  const clamped = Math.min(maximum, Math.max(minimum, finite));
  if (!step) return clamped;
  const decimals = (String(step).split(".")[1] || "").length;
  return Number((Math.round(clamped / step) * step).toFixed(decimals));
}

function integer(value, fallback, minimum, maximum) {
  return Math.round(number(value, fallback, minimum, maximum));
}

function choice(value, values, fallback) {
  return values.includes(value) ? value : fallback;
}

function color(value, fallback) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : fallback;
}

export const reactivePixelFieldConfigurationDefaults = deepFreeze({
  schemaVersion: 1,
  touchMode: "scroll",
  ariaLabel: "Interactive Reactive Pixel Field",
  gridSize: 9,
  fillSize: 8,
  cellShape: "square",
  showGrid: false,
  gridStep: 4,
  gridOpacity: 1,
  gridLineWidth: 1,
  gridColor: "#1c1c1b",
  palette: ["#34392d", "#787f69", "#e7edce", "#d9fd78"],
  introDuration: 1600,
  ambientMotion: true,
  motionSpeed: 1,
  ambientIntensity: 0.7,
  patternScale: 1,
  grainIntensity: 0.65,
  decayDuration: 680,
  pointerTrail: true,
  trailStrength: 1.35,
  trailRadius: 0.8,
  trailSampling: 0.55,
  chargeEnabled: true,
  chargeDuration: 2200,
  chargeSize: 1,
  chargeSpokes: 18,
  chargeSpin: 1,
  waveEnabled: true,
  waveDuration: 1800,
  waveRadius: 0.52,
  waveThickness: 1,
  maxWaves: 8,
  burstEnabled: true,
  burstStrength: 1.8,
  burstRadius: 4,
  shakeStrength: 1,
  shakeDuration: 420,
  target: { x: 0.5, y: 0.5 },
  autoCrawler: true,
  targetIdleDelay: 2400,
  crawlerSpeed: 7200,
  crawlerSize: 1,
  crawlerY: 0.68,
  crawlerWander: 1,
  dprCap: 2,
});

export function normalizeReactivePixelFieldConfiguration(input = {}) {
  const defaults = reactivePixelFieldConfigurationDefaults;
  const gridSize = number(input.gridSize, defaults.gridSize, 6, 18, 0.5);
  const paletteInput = Array.isArray(input.palette) ? input.palette : defaults.palette;
  return {
    schemaVersion: 1,
    touchMode: choice(input.touchMode, ["scroll", "interact"], defaults.touchMode),
    ariaLabel: typeof input.ariaLabel === "string" && input.ariaLabel.trim()
      ? input.ariaLabel.trim().slice(0, 240) : defaults.ariaLabel,
    gridSize,
    fillSize: number(input.fillSize, defaults.fillSize, 2, Math.max(2, gridSize - 0.5), 0.5),
    cellShape: choice(input.cellShape, ["square", "rounded", "circle"], defaults.cellShape),
    showGrid: false,
    gridStep: integer(input.gridStep, defaults.gridStep, 2, 10),
    gridOpacity: number(input.gridOpacity, defaults.gridOpacity, 0, 1, 0.05),
    gridLineWidth: number(input.gridLineWidth, defaults.gridLineWidth, 0.5, 3, 0.25),
    gridColor: color(input.gridColor, defaults.gridColor),
    palette: Array.from({ length: 4 }, (_, index) => color(paletteInput[index], defaults.palette[index])),
    introDuration: integer(input.introDuration, defaults.introDuration, 0, 8000),
    ambientMotion: input.ambientMotion === undefined ? defaults.ambientMotion : Boolean(input.ambientMotion),
    motionSpeed: number(input.motionSpeed, defaults.motionSpeed, 0.1, 3, 0.05),
    ambientIntensity: number(input.ambientIntensity, defaults.ambientIntensity, 0, 2, 0.05),
    patternScale: number(input.patternScale, defaults.patternScale, 0.5, 2, 0.05),
    grainIntensity: number(input.grainIntensity, defaults.grainIntensity, 0, 2, 0.05),
    decayDuration: integer(input.decayDuration, defaults.decayDuration, 120, 2400),
    pointerTrail: input.pointerTrail === undefined ? defaults.pointerTrail : Boolean(input.pointerTrail),
    trailStrength: number(input.trailStrength, defaults.trailStrength, 0.2, 2.5, 0.05),
    trailRadius: number(input.trailRadius, defaults.trailRadius, 0.4, 4, 0.05),
    trailSampling: number(input.trailSampling, defaults.trailSampling, 0.2, 1.5, 0.05),
    chargeEnabled: input.chargeEnabled === undefined ? defaults.chargeEnabled : Boolean(input.chargeEnabled),
    chargeDuration: integer(input.chargeDuration, defaults.chargeDuration, 250, 8000),
    chargeSize: number(input.chargeSize, defaults.chargeSize, 0.4, 2.5, 0.05),
    chargeSpokes: integer(input.chargeSpokes, defaults.chargeSpokes, 4, 36),
    chargeSpin: number(input.chargeSpin, defaults.chargeSpin, 0, 3, 0.05),
    waveEnabled: input.waveEnabled === undefined ? defaults.waveEnabled : Boolean(input.waveEnabled),
    waveDuration: integer(input.waveDuration, defaults.waveDuration, 250, 5000),
    waveRadius: number(input.waveRadius, defaults.waveRadius, 0.15, 1, 0.01),
    waveThickness: number(input.waveThickness, defaults.waveThickness, 0.25, 2.5, 0.05),
    maxWaves: integer(input.maxWaves, defaults.maxWaves, 1, 16),
    burstEnabled: input.burstEnabled === undefined ? defaults.burstEnabled : Boolean(input.burstEnabled),
    burstStrength: number(input.burstStrength, defaults.burstStrength, 0.4, 3, 0.05),
    burstRadius: number(input.burstRadius, defaults.burstRadius, 1, 8, 0.25),
    shakeStrength: number(input.shakeStrength, defaults.shakeStrength, 0, 3, 0.05),
    shakeDuration: integer(input.shakeDuration, defaults.shakeDuration, 0, 1200),
    target: {
      x: number(input.target?.x, defaults.target.x, 0.05, 0.95, 0.01),
      y: number(input.target?.y, defaults.target.y, 0.05, 0.95, 0.01),
    },
    autoCrawler: input.autoCrawler === undefined ? defaults.autoCrawler : Boolean(input.autoCrawler),
    targetIdleDelay: integer(input.targetIdleDelay, defaults.targetIdleDelay, 0, 15000),
    crawlerSpeed: integer(input.crawlerSpeed, defaults.crawlerSpeed, 1800, 16000),
    crawlerSize: number(input.crawlerSize, defaults.crawlerSize, 0.5, 2.5, 0.05),
    crawlerY: number(input.crawlerY, defaults.crawlerY, 0.15, 0.85, 0.01),
    crawlerWander: number(input.crawlerWander, defaults.crawlerWander, 0, 2, 0.05),
    dprCap: number(input.dprCap, defaults.dprCap, 1, 2, 0.25),
  };
}

export function reactivePixelFieldRuntimeOptions(configuration) {
  return normalizeReactivePixelFieldConfiguration(configuration);
}

const range = (key, label, minimum, maximum, step, unit, hint, visibleWhen = null) => ({
  key, label, type: "range", min: minimum, max: maximum, step, unit, hint,
  ...(visibleWhen ? { visibleWhen } : {}),
});

const configurationContract = {
  schemaVersion: 1,
  templateId: "reactive-pixel-field",
  title: "Reactive Pixel Field",
  defaults: reactivePixelFieldConfigurationDefaults,
  normalize: normalizeReactivePixelFieldConfiguration,
  toRuntimeOptions: reactivePixelFieldRuntimeOptions,
  actions: [
    { id: "replay", label: "Replay intro", description: "Replay the configured load fade-in without changing your tweaks." },
    { id: "pulse", label: "Send a ripple", description: "Start a ripple at the keyboard ripple position." },
    { id: "burst", label: "Trigger burst", description: "Shatter the field at center with a strong ripple.", enabledWhen: { key: "burstEnabled", equals: true } },
  ],
  presets: [
    { id: "signal", label: "Signal", description: "Square graphite and chartreuse pixels.", values: { gridSize: 9, fillSize: 8, cellShape: "square", palette: ["#34392d", "#787f69", "#e7edce", "#d9fd78"], } },
    { id: "sonar", label: "Red pulse", description: "Wide circular pixels in a red palette on black.", values: { gridSize: 12, fillSize: 9, cellShape: "circle", palette: ["#321818", "#842f2f", "#e4e2de", "#d83a3a"], } },
    { id: "terminal", label: "Blue hour", description: "Fine rounded ice-blue pixels on black.", values: { gridSize: 7, fillSize: 5.5, cellShape: "rounded", palette: ["#163346", "#32677c", "#c4e7ee", "#7bddef"], } },
  ],
  groups: [
    {
      id: "look", title: "Look", description: "Grid, pixel shape, and palette.", level: "simple", fields: [
        { ...range("gridSize", "Grid size", 6, 18, 0.5, "px", "Distance between pixel origins."), numberInput: true },
        { ...range("fillSize", "Pixel size", 2, 17.5, 0.5, "px", "Filled area inside each cell; at most Grid size minus 0.5 px."), maxFrom: { key: "gridSize", offset: -0.5 }, numberInput: true },
        { key: "cellShape", label: "Pixel shape", type: "segmented", options: [
          { label: "Square", value: "square" }, { label: "Soft", value: "rounded" }, { label: "Circle", value: "circle" },
        ] },
        ...["Dim", "Medium", "Bright", "Highlight"].map((label, index) => ({ key: `palette.${index}`, label, type: "color", colorRow: "Pixel colors" })),
      ],
    },
    {
      id: "motion", title: "Ambient motion", description: "Passive field rhythm and persistence.", level: "simple", fields: [
        { key: "ambientMotion", label: "Ambient animation", type: "toggle" },
        range("motionSpeed", "Motion speed", 0.1, 3, 0.05, "×", "How fast the pattern drifts and reshapes.", { key: "ambientMotion", equals: true }),
        range("ambientIntensity", "Ambient strength", 0, 2, 0.05, "×", "Brightness of the drifting pattern.", { key: "ambientMotion", equals: true }),
        range("decayDuration", "Signal decay", 120, 2400, 20, "ms", "How long painted energy persists."),
        range("introDuration", "Intro reveal", 0, 8000, 100, "ms", "Initial field fade-in."),
      ],
    },
    {
      id: "pointer", title: "Pointer & ripples", description: "Draw, charge and release ripples.", level: "simple", fields: [
        { key: "pointerTrail", label: "Pointer trail", type: "toggle" },
        range("trailStrength", "Trail strength", 0.2, 2.5, 0.05, "×", "Energy painted by pointer movement.", { key: "pointerTrail", equals: true }),
        range("trailRadius", "Trail radius", 0.4, 4, 0.05, "cells", "Width of pointer drawing.", { key: "pointerTrail", equals: true }),
        { key: "chargeEnabled", label: "Hold charge", type: "toggle" },
        range("chargeDuration", "Charge time", 250, 8000, 50, "ms", "Hold duration for a full release.", { key: "chargeEnabled", equals: true }),
        { key: "waveEnabled", label: "Click ripples", type: "toggle" },
        range("waveDuration", "Ripple duration", 250, 5000, 50, "ms", "How long each ripple spreads before the pixels settle.", { key: "waveEnabled", equals: true }),
        range("waveRadius", "Ripple reach", 0.15, 1, 0.01, "×", "How far ripples spread relative to the field.", { key: "waveEnabled", equals: true }),
      ],
    },
    {
      id: "target", title: "Keyboard & idle ripples", description: "Keyboard ripple position and automatic ripples.", level: "simple", fields: [
        range("target.x", "Keyboard ripple X", 0.05, 0.95, 0.01, "ratio", "Horizontal position of keyboard and preview ripples."),
        range("target.y", "Keyboard ripple Y", 0.05, 0.95, 0.01, "ratio", "Vertical position of keyboard and preview ripples."),
        { key: "autoCrawler", label: "Idle ripples", type: "toggle", hint: "Occasional automatic ripples on fine-pointer devices while click ripples are enabled." },
        range("targetIdleDelay", "Idle ripple delay", 0, 15000, 100, "ms", "Inactivity before the first automatic ripple.", { key: "autoCrawler", equals: true }),
        range("crawlerSpeed", "Ripple interval", 1800, 16000, 100, "ms", "Time between automatic ripples.", { key: "autoCrawler", equals: true }),
      ],
    },
    {
      id: "advanced-field", title: "Advanced field", description: "Pattern construction and renderer detail.", level: "advanced", fields: [
        range("patternScale", "Pattern scale", 0.5, 2, 0.05, "×", "Pattern detail; higher draws smaller, more frequent masses."),
        range("grainIntensity", "Grain", 0, 2, 0.05, "×", "Deterministic per-cell variation."),
        range("dprCap", "Pixel ratio cap", 1, 2, 0.25, "×", "Canvas resolution ceiling."),
      ],
    },
    {
      id: "advanced-input", title: "Advanced input", description: "Charge geometry, ripple, burst, and idle details.", level: "advanced", fields: [
        range("trailSampling", "Trail sampling", 0.2, 1.5, 0.05, "cells", "Spacing between sampled pointer discs.", { key: "pointerTrail", equals: true }),
        range("chargeSize", "Charge size", 0.4, 2.5, 0.05, "×", "Spread of the pixels gathering into the launcher.", { key: "chargeEnabled", equals: true }),
        range("chargeSpokes", "Charge spokes", 4, 36, 1, "", "Number of incoming charge particles.", { key: "chargeEnabled", equals: true }),
        range("chargeSpin", "Charge spin", 0, 3, 0.05, "×", "Speed of incoming charge particles.", { key: "chargeEnabled", equals: true }),
        range("waveThickness", "Ripple height", 0.25, 2.5, 0.05, "×", "How far pixels are displaced as a ripple passes.", { key: "waveEnabled", equals: true }),
        range("maxWaves", "Concurrent ripples", 1, 16, 1, "", "Maximum active ripples.", { key: "waveEnabled", equals: true }),
        { key: "burstEnabled", label: "Double-click burst", type: "toggle" },
        range("burstStrength", "Burst strength", 0.4, 3, 0.05, "×", "Energy of the immediate impact."),
        range("burstRadius", "Burst paint", 1, 8, 0.25, "cells", "Painted burst radius."),
        range("shakeStrength", "Burst shake", 0, 3, 0.05, "×", "Stage displacement after a burst."),
        range("shakeDuration", "Shake time", 0, 1200, 20, "ms", "Duration of burst displacement."),
        range("crawlerSize", "Idle ripple strength", 0.5, 2.5, 0.05, "×", "Strength of automatic ripples."),
        range("crawlerY", "Idle ripple height", 0.15, 0.85, 0.01, "ratio", "Vertical center of automatic ripples."),
        range("crawlerWander", "Idle ripple variation", 0, 2, 0.05, "×", "Vertical variation between automatic ripples."),
      ],
    },
    {
      id: "page-behavior", title: "Page behavior", level: "advanced", fields: [
        { key: "touchMode", label: "Touch mode", type: "segmented", options: [
          { label: "Scroll page", value: "scroll" }, { label: "Interact", value: "interact" },
        ], hint: "Scroll page lets swipes scroll over the hero and disables touch drawing. Interact enables touch aiming and hold/release, but swipes over the field cannot scroll the page." },
        { key: "ariaLabel", label: "Name for screen readers", type: "text", maxLength: 240, hint: "Used when the host has no aria-label or aria-labelledby. Describe this field’s purpose." },
      ],
    },
  ],
};

// Curate the customer panel without changing canonical settings or developer fields.
const fields = new Map(configurationContract.groups.flatMap(group => group.fields).map(field => [field.key, field]));
const control = (key, changes = {}) => ({ ...fields.get(key), ...changes });

export const reactivePixelFieldConfigurationContract = deepFreeze({
  ...configurationContract,
  editorGroups: [
    configurationContract.groups[0],
    { id: "motion", title: "Motion", level: "simple", fields: [
      control("ambientMotion", { label: "Animate pattern" }),
      control("motionSpeed", { label: "Pattern speed" }),
      control("ambientIntensity", { label: "Pattern intensity", hint: "Strength of the pattern, including when animation is off.", visibleWhen: undefined }),
    ] },
    { id: "interaction", title: "Interaction", level: "simple", fields: [
      control("pointerTrail"),
      control("waveRadius", { label: "Ripple size", visibleWhen: undefined }),
      control("burstEnabled"),
      control("autoCrawler"),
    ] },
    { ...configurationContract.groups.find(group => group.id === "page-behavior"), fields: [control("touchMode")] },
  ],
});
