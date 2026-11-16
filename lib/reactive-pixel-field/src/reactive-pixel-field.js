import {
  reactivePixelFieldConfigurationDefaults,
  reactivePixelFieldRuntimeOptions,
} from "./configuration.js";

const mountedRoots = new WeakMap();

export const reactivePixelDefaults = Object.freeze(
  reactivePixelFieldRuntimeOptions(reactivePixelFieldConfigurationDefaults),
);

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeOptions(options) {
  return reactivePixelFieldRuntimeOptions(options);
}

function easeOutCubic(progress) {
  const value = 1 - clamp(progress, 0, 1);
  return 1 - value * value * value;
}

function hash2d(column, row) {
  let value = Math.imul(column + 31, 73856093) ^ Math.imul(row + 17, 19349663);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function smoothstep(progress) {
  return progress * progress * (3 - 2 * progress);
}

function valueNoise(x, y) {
  const column = Math.floor(x), row = Math.floor(y);
  const fx = smoothstep(x - column), fy = smoothstep(y - row);
  const a = hash2d(column, row), b = hash2d(column + 1, row);
  const c = hash2d(column, row + 1), d = hash2d(column + 1, row + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

// Blend two offset noise slices so the surface reshapes smoothly over time.
function morphingNoise(x, y, time) {
  const slice = Math.floor(time), blend = smoothstep(time - slice);
  return valueNoise(x + slice * 17.3, y - slice * 9.1) * (1 - blend)
    + valueNoise(x + (slice + 1) * 17.3, y - (slice + 1) * 9.1) * blend;
}

export class NTReactivePixelField {
  constructor(root, options = {}) {
    if (!(root instanceof HTMLElement)) throw new TypeError("NTReactivePixelField requires an HTMLElement mount.");
    if (mountedRoots.has(root)) throw new Error("This Reactive Pixel Field mount is already active.");
    this.root = root;
    this.options = normalizeOptions(options);
    this.hadClass = root.hasAttribute("class");
    this.originalStyle = root.getAttribute("style");
    this.hadStyle = root.hasAttribute("style");
    this.originalChildren = [...root.childNodes];
    this.addedClass = !root.classList.contains("reactive-pixel-field");
    this.ownedAttributes = new Map();
    this.ownedStyles = new Map();
    this.ownsName = !root.hasAttribute("aria-label") && !root.hasAttribute("aria-labelledby");
    this.canvas = null;
    this.context = null;
    this.width = 1;
    this.height = 1;
    this.columns = 1;
    this.rows = 1;
    this.heat = new Float32Array(1);
    this.light = new Float32Array(1);
    this.elevation = new Float32Array(4);
    this.offsetX = new Float32Array(1);
    this.offsetY = new Float32Array(1);
    this.activeCells = 0;
    this.impactCount = 0;
    this.lastIdleShot = -1;
    this.animationFrame = 0;
    this.idleTimer = 0;
    this.visible = true;
    this.remainingHeat = 0;
    this.resizeObserver = null;
    this.startedAt = performance.now();
    this.lastFrameAt = this.startedAt;
    this.ambientTime = 0;
    this.lastInputAt = this.startedAt;
    this.shakeUntil = 0;
    this.waves = [];
    this.lastRelease = null;
    this.crawlerActive = false;
    this.burstCount = 0;
    this.pulseCount = 0;
    this.status = "idle";
    this.pointer = {
      active: false,
      down: false,
      downAt: 0,
      id: null,
      x: 0,
      y: 0,
    };
    // The painted trail follows a smoothed copy of the pointer path.
    this.trail = { active: false, x: 0, y: 0, x1: 0, y1: 0, x2: 0, y2: 0 };
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.prefersReducedMotion = this.reducedMotion.matches;
    this.render = this.render.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.cancelInput = this.cancelInput.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMotionPreference = this.onMotionPreference.bind(this);
    this.finePointer = window.matchMedia("(pointer: fine)");
    this.onPointerPreference = () => this.wake();
  }

  mount() {
    mountedRoots.set(this.root, this);
    this.root.replaceChildren();
    this.root.classList.add("reactive-pixel-field");
    if (!this.root.hasAttribute("role")) this.setOwnedAttribute("role", "application");
    if (!this.root.hasAttribute("tabindex")) this.setOwnedAttribute("tabindex", "0");
    this.applyPageOptions();
    this.applyVisualOptions();

    this.canvas = document.createElement("canvas");
    this.canvas.className = "reactive-pixel-field__canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.context = this.canvas.getContext("2d", { alpha: true });
    if (!this.context) throw new Error("Canvas 2D is unavailable.");
    this.root.append(this.canvas);

    this.root.addEventListener("pointermove", this.onPointerMove);
    this.root.addEventListener("pointerdown", this.onPointerDown);
    this.root.addEventListener("pointerup", this.onPointerUp);
    this.root.addEventListener("pointercancel", this.onPointerCancel);
    this.root.addEventListener("lostpointercapture", this.onPointerCancel);
    this.root.addEventListener("blur", this.cancelInput);
    window.addEventListener("blur", this.cancelInput);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.root.addEventListener("pointerleave", this.onPointerLeave);
    this.root.addEventListener("dblclick", this.onDoubleClick);
    this.root.addEventListener("keydown", this.onKeyDown);
    // Construction may precede mounting and miss a preference change.
    this.prefersReducedMotion = this.reducedMotion.matches;
    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    this.finePointer.addEventListener("change", this.onPointerPreference);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.visible = entries[entries.length - 1].isIntersecting;
      this.onVisibilityChange();
    });
    this.intersectionObserver.observe(this.root);

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.root);
    this.onResize();
    this.status = "running";
    this.wake();
    this.root.dispatchEvent(new CustomEvent("ntpixel:ready", { detail: this.getState() }));
    return this;
  }

  localPoint(event) {
    const rect = this.root.getBoundingClientRect();
    return {
      x: clamp(event.clientX - rect.left, 0, rect.width),
      y: clamp(event.clientY - rect.top, 0, rect.height),
    };
  }

  onPointerMove(event) {
    if (event.pointerType === "touch" && (this.options.touchMode !== "interact" || !this.pointer.down)) return;
    if (this.pointer.id !== null && event.pointerId !== this.pointer.id) return;
    if (this.pointer.down && (event.buttons === 0 || !this.root.hasPointerCapture?.(this.pointer.id))) { this.cancelInput(); return; }
    const point = this.localPoint(event);
    if (!this.pointer.active) this.resetTrail(point);
    this.trail.x = point.x;
    this.trail.y = point.y;
    this.trail.active = this.options.pointerTrail;
    this.pointer.active = true;
    this.pointer.x = point.x;
    this.pointer.y = point.y;
    this.lastInputAt = performance.now();
    this.crawlerActive = false;
    this.wake();
  }

  onPointerDown(event) {
    if (event.pointerType === "touch" && this.options.touchMode !== "interact") return;
    if (this.pointer.down || event.isPrimary === false) { this.cancelInput(); return; }
    if (event.button !== 0) return;
    const point = this.localPoint(event);
    this.root.setPointerCapture?.(event.pointerId);
    if (!this.pointer.active) this.resetTrail(point);
    this.pointer.active = true;
    this.pointer.down = true;
    this.pointer.downAt = performance.now();
    this.pointer.id = event.pointerId;
    this.pointer.x = point.x;
    this.pointer.y = point.y;
    this.lastInputAt = this.pointer.downAt;
    if (this.options.chargeEnabled) {
      this.paintDisc(
        point.x,
        point.y,
        this.options.gridSize * 2.2 * this.options.chargeSize,
        1.8,
      );
    }
    this.wake();
  }

  onPointerUp(event) {
    if (!this.pointer.down || event.pointerId !== this.pointer.id) return;
    if (!this.root.hasPointerCapture?.(this.pointer.id)) { this.cancelInput(); return; }
    const now = performance.now();
    const heldFor = Math.max(0, now - this.pointer.downAt);
    const strength = this.options.chargeEnabled
      ? clamp(0.3 + heldFor / this.options.chargeDuration, 0.3, 1.3)
      : 0.8;
    this.lastRelease = this.options.waveEnabled ? this.addWave(this.pointer.x, this.pointer.y, strength, now) : null;
    if (!this.lastRelease) this.paintDisc(this.pointer.x, this.pointer.y, this.options.gridSize * 2.5, strength);
    this.cancelInput();
    this.pointer.active = event.pointerType !== "touch";
    this.pulseCount += 1;
    this.lastInputAt = now;
    this.wake();
    this.root.dispatchEvent(new CustomEvent("ntpixel:pulse", {
      detail: { heldFor, strength, x: this.pointer.x / this.width, y: this.pointer.y / this.height },
    }));
    event.preventDefault();
  }

  cancelInput() {
    const id = this.pointer.id;
    this.pointer.down = false;
    this.pointer.active = false;
    this.pointer.downAt = 0;
    this.pointer.id = null;
    if (id !== null && this.root.hasPointerCapture?.(id)) this.root.releasePointerCapture(id);
    this.wake();
  }

  onPointerCancel(event) {
    if (event.pointerId === this.pointer.id) this.cancelInput();
  }

  onVisibilityChange() {
    if (document.hidden || !this.visible) { this.cancelInput(); this.stopRendering(); }
    else this.wake();
  }

  onPointerLeave() {
    if (!this.pointer.down || !this.root.hasPointerCapture?.(this.pointer.id)) this.cancelInput();
  }

  onDoubleClick(event) {
    if (event.pointerType === "touch" || event.sourceCapabilities?.firesTouchEvents) return;
    // The second click has just started a ripple at this point; the burst replaces it.
    const release = this.lastRelease;
    this.lastRelease = null;
    if (this.options.burstEnabled && release && performance.now() - release.bornAt < 100) {
      this.waves = this.waves.filter(wave => wave !== release);
    }
    const point = this.localPoint(event);
    this.burst(point.x / this.width, point.y / this.height);
  }

  onKeyDown(event) {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    this.pulse(this.options.target.x, this.options.target.y, 1.1);
  }

  onMotionPreference(event) {
    // Keep preference state event-owned: polling matches while rendering can
    // consume Chromium’s pending change before its listener is notified.
    this.prefersReducedMotion = event.matches;
    this.waves = [];
    this.offsetX.fill(0);
    this.offsetY.fill(0);
    this.crawlerActive = false;
    this.lastIdleShot = -1;
    this.startedAt = performance.now() - this.options.introDuration;
    this.wake();
  }

  onResize() {
    if (this.status === "destroyed") return;
    const previousColumns = this.columns;
    const previousRows = this.rows;
    const previousHeat = this.heat;
    const rect = this.root.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const ratio = Math.min(this.options.dprCap, Math.max(1, window.devicePixelRatio || 1));
    this.canvas.width = Math.max(1, Math.round(this.width * ratio));
    this.canvas.height = Math.max(1, Math.round(this.height * ratio));
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.columns = Math.max(1, Math.ceil(this.width / this.options.gridSize));
    this.rows = Math.max(1, Math.ceil(this.height / this.options.gridSize));
    const nextHeat = new Float32Array(this.columns * this.rows);
    if (previousHeat?.length && previousColumns > 0 && previousRows > 0) {
      for (let row = 0; row < this.rows; row += 1) {
        const sourceRow = Math.min(
          previousRows - 1,
          Math.floor(((row + 0.5) / this.rows) * previousRows),
        );
        for (let column = 0; column < this.columns; column += 1) {
          const sourceColumn = Math.min(
            previousColumns - 1,
            Math.floor(((column + 0.5) / this.columns) * previousColumns),
          );
          nextHeat[row * this.columns + column] = previousHeat[
            sourceRow * previousColumns + sourceColumn
          ];
        }
      }
    }
    this.heat = nextHeat;
    this.light = new Float32Array(nextHeat.length);
    this.elevation = new Float32Array((this.columns + 1) * (this.rows + 1));
    this.offsetX = new Float32Array(nextHeat.length);
    this.offsetY = new Float32Array(nextHeat.length);
    // Keep active ripples attached to their normalized host positions.
    for (const wave of this.waves) {
      wave.x = wave.target.x * this.width;
      wave.y = wave.target.y * this.height;
    }
    this.wake();
  }

  applyVisualOptions() {
    this.setOwnedStyle("--pixel-accent", this.options.palette[3]);
  }

  setOwnedAttribute(name, value) {
    const owned = this.ownedAttributes.get(name);
    if (owned && this.root.getAttribute(name) !== owned.value) return false;
    this.ownedAttributes.set(name, { original: owned ? owned.original : this.root.getAttribute(name), value });
    this.root.setAttribute(name, value);
    return true;
  }

  setOwnedStyle(name, value) {
    const owned = this.ownedStyles.get(name);
    if (owned && (this.root.style.getPropertyValue(name) !== owned.value || this.root.style.getPropertyPriority(name) !== "")) return;
    this.ownedStyles.set(name, {
      original: owned ? owned.original : this.root.style.getPropertyValue(name),
      priority: owned ? owned.priority : this.root.style.getPropertyPriority(name), value,
    });
    this.root.style.setProperty(name, value);
  }

  applyPageOptions() {
    this.setOwnedStyle("touch-action", this.options.touchMode === "interact" ? "none" : "auto");
    if (!this.ownsName) return;
    const owned = this.ownedAttributes.get("aria-label");
    if (this.root.hasAttribute("aria-labelledby") || (owned && this.root.getAttribute("aria-label") !== owned.value)) {
      if (owned && this.root.getAttribute("aria-label") === owned.value) this.root.removeAttribute("aria-label");
      this.ownedAttributes.delete("aria-label");
      this.ownsName = false;
      return;
    }
    this.setOwnedAttribute("aria-label", this.options.ariaLabel);
  }

  heatIndex(column, row) {
    if (column < 0 || row < 0 || column >= this.columns || row >= this.rows) return -1;
    return row * this.columns + column;
  }

  raiseCell(column, row, amount) {
    const index = this.heatIndex(column, row);
    if (index < 0) return;
    this.heat[index] = Math.max(this.heat[index], amount);
  }

  paintDisc(x, y, radius, amount) {
    const pitch = this.options.gridSize;
    const minColumn = Math.floor((x - radius) / pitch);
    const maxColumn = Math.ceil((x + radius) / pitch);
    const minRow = Math.floor((y - radius) / pitch);
    const maxRow = Math.ceil((y + radius) / pitch);
    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const cellX = column * pitch + pitch * 0.5;
        const cellY = row * pitch + pitch * 0.5;
        const distance = Math.hypot(cellX - x, cellY - y);
        if (distance <= radius) this.raiseCell(column, row, amount * (1 - distance / Math.max(1, radius) * 0.48));
      }
    }
  }

  resetTrail(point) {
    Object.assign(this.trail, { active: false, x: point.x, y: point.y, x1: point.x, y1: point.y, x2: point.x, y2: point.y });
  }

  renderTrail(delta) {
    const trail = this.trail;
    if (!trail.active) return;
    // Two cascaded followers round off corners and hand jitter, so the line is
    // a smooth, gently corrected version of the pointer's path.
    const follow = 1 - Math.exp(-delta / 34);
    trail.x1 += (trail.x - trail.x1) * follow;
    trail.y1 += (trail.y - trail.y1) * follow;
    const fromX = trail.x2, fromY = trail.y2;
    trail.x2 += (trail.x1 - trail.x2) * follow;
    trail.y2 += (trail.y1 - trail.y2) * follow;
    this.paintLine(fromX, fromY, trail.x2, trail.y2, this.options.trailStrength);
    if (Math.hypot(trail.x - trail.x2, trail.y - trail.y2) < 0.5) trail.active = false;
  }

  paintLine(fromX, fromY, toX, toY, amount) {
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(1, Math.ceil(distance / (this.options.gridSize * this.options.trailSampling)));
    for (let step = 0; step <= steps; step += 1) {
      const progress = step / steps;
      const x = fromX + (toX - fromX) * progress;
      const y = fromY + (toY - fromY) * progress;
      this.paintDisc(x, y, this.options.gridSize * this.options.trailRadius, amount);
    }
  }

  drawCell(x, y, size) {
    if (this.options.cellShape === "circle") {
      this.context.beginPath();
      this.context.arc(x + size * 0.5, y + size * 0.5, size * 0.5, 0, Math.PI * 2);
      this.context.fill();
      return;
    }
    if (this.options.cellShape === "rounded") {
      this.context.beginPath();
      this.context.roundRect(x, y, size, size, Math.min(size * 0.3, 3));
      this.context.fill();
      return;
    }
    this.context.fillRect(x, y, size, size);
  }

  addWave(x, y, strength, now = performance.now(), { idle = false } = {}) {
    const wave = {
      bornAt: now, strength: clamp(strength, 0.2, 2.2), x, y,
      target: { x: x / this.width, y: y / this.height },
      impacted: false, idle,
    };
    this.waves.push(wave);
    while (this.waves.length > this.options.maxWaves) this.waves.shift();
    return wave;
  }

  pulse(x = 0.5, y = 0.5, strength = 1) {
    if (this.status === "destroyed") return this;
    const pointX = clamp(finiteNumber(x, 0.5), 0, 1) * this.width;
    const pointY = clamp(finiteNumber(y, 0.5), 0, 1) * this.height;
    const normalizedStrength = finiteNumber(strength, 1);
    if (this.options.waveEnabled) this.addWave(pointX, pointY, normalizedStrength);
    else this.paintDisc(pointX, pointY, this.options.gridSize * 3, normalizedStrength);
    this.pulseCount += 1;
    this.lastInputAt = performance.now();
    this.wake();
    this.root.dispatchEvent(new CustomEvent("ntpixel:pulse", {
      detail: { heldFor: 0, strength: normalizedStrength, x: pointX / this.width, y: pointY / this.height },
    }));
    return this;
  }

  burst(x = 0.5, y = 0.5) {
    if (this.status === "destroyed" || !this.options.burstEnabled) return this;
    const pointX = clamp(finiteNumber(x, 0.5), 0, 1) * this.width;
    const pointY = clamp(finiteNumber(y, 0.5), 0, 1) * this.height;
    const now = performance.now();
    if (this.options.waveEnabled) this.addWave(pointX, pointY, this.options.burstStrength, now);
    this.shakeUntil = now + this.options.shakeDuration;
    this.paintDisc(
      pointX,
      pointY,
      this.options.gridSize * this.options.burstRadius,
      this.options.burstStrength * 1.22,
    );
    this.burstCount += 1;
    this.lastInputAt = now;
    this.wake();
    this.root.dispatchEvent(new CustomEvent("ntpixel:burst", {
      detail: { x: pointX / this.width, y: pointY / this.height },
    }));
    return this;
  }

  reportImpact(wave) {
    if (wave.impacted) return;
    wave.impacted = true;
    this.impactCount += 1;
    this.root.dispatchEvent(new CustomEvent("ntpixel:impact", {
      detail: { ...wave.target, strength: wave.strength, idle: wave.idle },
    }));
  }

  renderWave(wave, now) {
    if (this.prefersReducedMotion) {
      this.paintDisc(wave.x, wave.y, this.options.gridSize * 3, wave.strength);
      this.reportImpact(wave);
      return false;
    }
    const progress = Math.max(0, now - wave.bornAt) / this.options.waveDuration;
    if (progress >= 1) return false;
    this.reportImpact(wave);
    // An expanding front leaves damped rings that push the actual grid cells
    // out and back. The analytic displacement keeps rapid impacts stable at any
    // frame rate and returns each cell to its exact origin as the ripple fades.
    const pitch = this.options.gridSize;
    const reach = Math.max(pitch * 6, Math.min(this.width, this.height) * this.options.waveRadius * 0.8)
      * (0.75 + 0.25 * wave.strength);
    const wavelength = Math.max(pitch * 3, reach * 0.24);
    const front = reach * 1.15 * (1 - (1 - progress) ** 1.6);
    const fade = (1 - progress) ** 1.2;
    const radius = Math.min(front, reach);
    const minColumn = Math.max(0, Math.floor((wave.x - radius) / pitch));
    const maxColumn = Math.min(this.columns - 1, Math.ceil((wave.x + radius) / pitch));
    const minRow = Math.max(0, Math.floor((wave.y - radius) / pitch));
    const maxRow = Math.min(this.rows - 1, Math.ceil((wave.y + radius) / pitch));
    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const dx = (column + 0.5) * pitch - wave.x;
        const dy = (row + 0.5) * pitch - wave.y;
        const distance = Math.hypot(dx, dy);
        if (distance > radius) continue;
        const behind = front - distance;
        const amount = wave.strength * fade * (1 - (distance / reach) ** 1.5)
          * Math.exp(-behind / (wavelength * 1.3));
        if (amount < 0.002) continue;
        const crest = Math.sin(behind / wavelength * Math.PI * 2);
        const grain = hash2d(column, row);
        const push = pitch * 1.8 * this.options.waveThickness * amount * crest * (0.85 + grain * 0.3);
        const ux = distance ? dx / distance : 0, uy = distance ? dy / distance : 0;
        const twist = (grain - 0.5) * 0.3;
        const index = row * this.columns + column;
        this.offsetX[index] += (ux - uy * twist) * push;
        this.offsetY[index] += (uy + ux * twist) * push;
        if (crest > 0) {
          this.light[index] += amount * crest * 1.6;
          this.raiseCell(column, row, amount * crest * 0.5);
        }
      }
    }
    return true;
  }

  renderCharge(now) {
    if (!this.pointer.down || !this.options.chargeEnabled) return;
    const progress = clamp((now - this.pointer.downAt) / this.options.chargeDuration, 0, 1);
    if (this.prefersReducedMotion) {
      this.paintDisc(
        this.pointer.x,
        this.pointer.y,
        this.options.gridSize * 2.2 * this.options.chargeSize,
        0.8 + progress * 1.4,
      );
      return;
    }
    const origin = this.pointer;
    const radius = this.options.gridSize * (4 + progress * 3) * this.options.chargeSize;
    for (let index = 0; index < this.options.chargeSpokes; index += 1) {
      const phase = (index / this.options.chargeSpokes + now * 0.0006 * this.options.chargeSpin) % 1;
      const angle = (index % 8) * Math.PI / 4;
      this.paintDisc(
        origin.x + Math.cos(angle) * radius * (1 - phase),
        origin.y + Math.sin(angle) * radius * (1 - phase),
        this.options.gridSize * 0.55,
        0.7 + progress * 1.1,
      );
    }
  }

  renderCrawler(now) {
    const idleFor = now - this.lastInputAt;
    this.crawlerActive = Boolean(this.options.autoCrawler && this.options.waveEnabled
      && !this.pointer.down && !this.prefersReducedMotion
      && this.finePointer.matches && idleFor >= this.options.targetIdleDelay);
    if (!this.crawlerActive) { this.lastIdleShot = -1; return; }
    const cycle = Math.floor((idleFor - this.options.targetIdleDelay) / this.options.crawlerSpeed);
    if (cycle === this.lastIdleShot) return;
    this.lastIdleShot = cycle;
    // Spread automatic ripples across the field around the configured height.
    const x = this.width * (0.5 + Math.sin(cycle * 1.7) * 0.3);
    const y = this.height * clamp(this.options.crawlerY + Math.sin(cycle * 2.4) * 0.1 * this.options.crawlerWander, 0.08, 0.92);
    this.addWave(x, y, 0.8 * this.options.crawlerSize, now, { idle: true });
  }

  // Sample a slowly drifting, reshaping height field once per cell corner.
  updateElevation(time) {
    const scale = 4.5 * this.options.patternScale, aspect = this.height / this.width;
    const stride = this.columns + 1;
    for (let row = 0; row <= this.rows; row += 1) {
      const y = row / Math.max(1, this.rows - 1) * scale * aspect;
      for (let column = 0; column <= this.columns; column += 1) {
        const x = column / Math.max(1, this.columns - 1) * scale + time * 0.05;
        this.elevation[row * stride + column] = morphingNoise(x, y, time * 0.07) * 0.65
          + morphingNoise(x * 2.1 + 5, y * 2.1 - 3, time * 0.1) * 0.35;
      }
    }
  }

  drawGrid(now, delta) {
    const context = this.context;
    const pitch = this.options.gridSize;
    const fill = this.options.fillSize;
    const reveal = this.prefersReducedMotion || this.options.introDuration === 0
      ? 1
      : easeOutCubic((now - this.startedAt) / this.options.introDuration);
    if (!this.prefersReducedMotion && this.options.ambientMotion) {
      this.ambientTime += delta / 1000 * this.options.motionSpeed;
    }
    const time = this.prefersReducedMotion ? 0 : this.ambientTime;
    const decay = Math.exp(-delta / this.options.decayDuration);
    this.updateElevation(time);
    const elevationStride = this.columns + 1;
    const shake = this.prefersReducedMotion || now >= this.shakeUntil
      ? { x: 0, y: 0 }
      : {
          x: Math.sin(now * 0.12) * 4 * this.options.shakeStrength,
          y: Math.cos(now * 0.15) * 3 * this.options.shakeStrength,
        };

    // Clear before shake so transparent hosts never retain edge residues.
    context.clearRect(0, 0, this.width, this.height);
    context.save();
    context.translate(shake.x, shake.y);
    if (this.options.showGrid && this.options.gridOpacity > 0) {
      context.globalAlpha = this.options.gridOpacity;
      context.fillStyle = this.options.gridColor;
      for (let x = 0; x <= this.width; x += pitch * this.options.gridStep) {
        context.fillRect(x, 0, this.options.gridLineWidth, this.height);
      }
      for (let y = 0; y <= this.height; y += pitch * this.options.gridStep) {
        context.fillRect(0, y, this.width, this.options.gridLineWidth);
      }
      context.globalAlpha = 1;
    }

    this.activeCells = 0;
    this.remainingHeat = 0;
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        const index = row * this.columns + column;
        this.heat[index] *= decay;
        // Exponential tails otherwise never reach rest. This threshold is far
        // below an 8-bit alpha step and leaves a deterministic zero-heat frame.
        if (this.heat[index] < .0001) this.heat[index] = 0;
        this.remainingHeat = Math.max(this.remainingHeat, this.heat[index]);
        // The drifting height field sets how likely each cell is to light, so
        // every mass fades out through a wide dithered gradient, never an edge.
        const rise = (this.elevation[row * elevationStride + column] - 0.5) * 2.2;
        const density = smoothstep(clamp((rise - 0.18) / 0.24, 0, 1));
        const ambient = hash2d(column, row) < density
          ? (0.38 + rise * 0.3 + (hash2d(row + 7, column + 3) - 0.5) * 0.25 * this.options.grainIntensity)
            * reveal * this.options.ambientIntensity
          : 0;
        const signal = clamp(ambient + this.heat[index] + this.light[index], 0, 2.3);
        let color = null;
        if (signal > 1.24) color = this.options.palette[3];
        else if (signal > 0.78) color = this.options.palette[2];
        else if (signal > 0.46) color = this.options.palette[1];
        else if (signal > 0.26) color = this.options.palette[0];
        if (!color) continue;
        context.fillStyle = color;
        context.globalAlpha = clamp(0.38 + signal * 0.48, 0.38, 1);
        this.drawCell(column * pitch + this.offsetX[index], row * pitch + this.offsetY[index], fill);
        this.activeCells += 1;
      }
    }
    context.restore();
    context.globalAlpha = 1;
  }

  stopRendering() {
    cancelAnimationFrame(this.animationFrame);
    clearTimeout(this.idleTimer);
    this.animationFrame = this.idleTimer = 0;
  }

  wake() {
    clearTimeout(this.idleTimer);
    this.idleTimer = 0;
    if (this.status !== "running" || !this.visible || document.hidden || this.animationFrame) return;
    this.lastFrameAt = performance.now();
    this.animationFrame = requestAnimationFrame(this.render);
  }

  scheduleNext(now) {
    if (this.status !== "running" || !this.visible || document.hidden || this.animationFrame) return;
    const moving = this.waves.length > 0 || this.remainingHeat > 0 || this.trail.active
      || (this.pointer.down && this.options.chargeEnabled)
      || (!this.prefersReducedMotion && (
        (this.options.ambientMotion && this.options.motionSpeed > 0 && this.options.ambientIntensity > 0)
        || now < this.startedAt + this.options.introDuration
        || now < this.shakeUntil));
    if (moving) { this.animationFrame = requestAnimationFrame(this.render); return; }
    if (!this.prefersReducedMotion && this.options.autoCrawler && this.options.waveEnabled && !this.pointer.down && this.finePointer.matches) {
      const deadline = this.lastInputAt + this.options.targetIdleDelay + Math.max(0, this.lastIdleShot + 1) * this.options.crawlerSpeed;
      this.idleTimer = setTimeout(() => { this.idleTimer = 0; this.wake(); }, Math.max(1, deadline - now));
    }
  }

  render(now) {
    this.animationFrame = 0;
    if (this.status !== "running" || !this.visible || document.hidden) return;
    const delta = clamp(now - this.lastFrameAt, 0, 50);
    this.lastFrameAt = now;
    this.light.fill(0);
    this.offsetX.fill(0);
    this.offsetY.fill(0);
    this.renderCrawler(now);
    this.renderTrail(delta);
    this.renderCharge(now);
    const waves = this.waves.filter((wave) => this.renderWave(wave, now));
    if (this.status !== "running") return;
    this.waves = waves;
    this.drawGrid(now, delta);
    this.scheduleNext(now);
  }

  update(nextOptions = {}, { restartIntro = false } = {}) {
    if (this.status === "destroyed") throw new Error("Cannot update a destroyed Reactive Pixel Field.");
    const previous = this.options;
    const nextTarget = nextOptions.target
      ? { ...previous.target, ...nextOptions.target }
      : previous.target;
    this.options = normalizeOptions({ ...previous, ...nextOptions, target: nextTarget });
    if (previous.touchMode !== this.options.touchMode) this.cancelInput();
    this.applyPageOptions();
    this.applyVisualOptions();

    if (
      previous.gridSize !== this.options.gridSize
      || previous.dprCap !== this.options.dprCap
    ) this.onResize();
    if (!this.options.waveEnabled) {
      this.waves = [];
      this.light.fill(0);
      this.offsetX.fill(0);
      this.offsetY.fill(0);
    }
    else if (this.waves.length > this.options.maxWaves) this.waves = this.waves.slice(-this.options.maxWaves);
    if (!this.options.autoCrawler || !this.options.waveEnabled) this.crawlerActive = false;
    if (!this.options.pointerTrail) this.trail.active = false;
    if (previous.autoCrawler !== this.options.autoCrawler || previous.crawlerSpeed !== this.options.crawlerSpeed
      || previous.targetIdleDelay !== this.options.targetIdleDelay) this.lastIdleShot = -1;
    if (restartIntro) {
      this.startedAt = performance.now();
    } else if (previous.introDuration !== this.options.introDuration) {
      const now = performance.now();
      const introProgress = previous.introDuration === 0
        ? 1
        : clamp((now - this.startedAt) / previous.introDuration, 0, 1);
      this.startedAt = now - introProgress * this.options.introDuration;
    }
    this.root.dispatchEvent(new CustomEvent("ntpixel:update", { detail: this.getState() }));
    this.wake();
    return this;
  }

  getState() {
    const chargingFor = this.pointer.down ? performance.now() - this.pointer.downAt : 0;
    return {
      activeCells: this.activeCells,
      canvas: this.canvas ? { buffer: [this.canvas.width, this.canvas.height], css: [this.width, this.height] } : null,
      burstCount: this.burstCount,
      cellShape: this.options.cellShape,
      charging: this.pointer.down,
      chargingProgress: clamp(chargingFor / this.options.chargeDuration, 0, 1),
      columns: this.columns,
      context: "2d",
      crawlerActive: this.crawlerActive,
      fillSize: this.options.fillSize,
      gridSize: this.options.gridSize,
      impactCount: this.impactCount,
      mounted: this.status !== "destroyed",
      options: {
        ...this.options,
        palette: [...this.options.palette],
        target: { ...this.options.target },
      },
      pointerActive: this.pointer.active,
      pulseCount: this.pulseCount,
      reducedMotion: this.prefersReducedMotion,
      rows: this.rows,
      status: this.status,
      waves: this.waves.length,
    };
  }

  destroy() {
    if (this.status === "destroyed") return;
    this.cancelInput();
    this.status = "destroyed";
    this.waves = [];
    this.offsetX.fill(0);
    this.offsetY.fill(0);
    this.stopRendering();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    this.finePointer.removeEventListener("change", this.onPointerPreference);
    this.root.removeEventListener("pointermove", this.onPointerMove);
    this.root.removeEventListener("pointerdown", this.onPointerDown);
    this.root.removeEventListener("pointerup", this.onPointerUp);
    this.root.removeEventListener("pointercancel", this.onPointerCancel);
    this.root.removeEventListener("lostpointercapture", this.onPointerCancel);
    this.root.removeEventListener("blur", this.cancelInput);
    window.removeEventListener("blur", this.cancelInput);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.root.removeEventListener("pointerleave", this.onPointerLeave);
    this.root.removeEventListener("dblclick", this.onDoubleClick);
    this.root.removeEventListener("keydown", this.onKeyDown);
    this.canvas?.remove();
    this.root.append(...this.originalChildren);
    if (this.addedClass) this.root.classList.remove("reactive-pixel-field");
    for (const [name, { original, value }] of this.ownedAttributes) {
      if (this.root.getAttribute(name) !== value) continue;
      if (original === null) this.root.removeAttribute(name);
      else this.root.setAttribute(name, original);
    }
    for (const [name, { original, priority, value }] of this.ownedStyles) {
      if (this.root.style.getPropertyValue(name) !== value || this.root.style.getPropertyPriority(name) !== "") continue;
      if (original) this.root.style.setProperty(name, original, priority);
      else this.root.style.removeProperty(name);
    }
    if (!this.hadClass && !this.root.getAttribute("class")) this.root.removeAttribute("class");
    if (this.originalStyle !== null) {
      const original = document.createElement("div");
      original.setAttribute("style", this.originalStyle);
      if (original.style.cssText === this.root.style.cssText) this.root.setAttribute("style", this.originalStyle);
    }
    if (!this.hadStyle && !this.root.getAttribute("style")) this.root.removeAttribute("style");
    mountedRoots.delete(this.root);
  }
}

export function mountReactivePixelField(root, options) {
  return new NTReactivePixelField(root, options).mount();
}
