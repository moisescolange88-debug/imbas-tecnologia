// Customized Reactive Pixel Field. Use with package 0.1.0-prototype.2.
import { reactivePixelFieldConfigurationContract as contract } from "./src/configuration.js";

const saved = {
  "mediaProvenance": [],
  "assetId": "reactive-pixel-field",
  "assetVersion": "0.1.0-prototype.2",
  "configurationSchemaVersion": 1,
  "values": {
    "schemaVersion": 1,
    "touchMode": "scroll",
    "ariaLabel": "Interactive Reactive Pixel Field",
    "gridSize": 9,
    "fillSize": 8,
    "cellShape": "square",
    "showGrid": false,
    "gridStep": 4,
    "gridOpacity": 1,
    "gridLineWidth": 1,
    "gridColor": "#1c1c1b",
    "palette": [
      "#34392d",
      "#787f69",
      "#e7edce",
      "#d9fd78"
    ],
    "introDuration": 1600,
    "ambientMotion": true,
    "motionSpeed": 1,
    "ambientIntensity": 0.7,
    "patternScale": 1,
    "grainIntensity": 0.65,
    "decayDuration": 680,
    "pointerTrail": true,
    "trailStrength": 1.35,
    "trailRadius": 0.8,
    "trailSampling": 0.55,
    "chargeEnabled": true,
    "chargeDuration": 2200,
    "chargeSize": 1,
    "chargeSpokes": 18,
    "chargeSpin": 1,
    "waveEnabled": true,
    "waveDuration": 1800,
    "waveRadius": 0.52,
    "waveThickness": 1,
    "maxWaves": 8,
    "burstEnabled": true,
    "burstStrength": 1.8,
    "burstRadius": 4,
    "shakeStrength": 1,
    "shakeDuration": 420,
    "target": {
      "x": 0.5,
      "y": 0.5
    },
    "autoCrawler": true,
    "targetIdleDelay": 2400,
    "crawlerSpeed": 7200,
    "crawlerSize": 1,
    "crawlerY": 0.68,
    "crawlerWander": 1,
    "dprCap": 2
  }
};
if (saved.assetId !== contract.templateId || saved.configurationSchemaVersion !== contract.schemaVersion) throw new Error("Settings do not match this asset configuration contract.");
const values = contract.normalize(saved.values);
if (JSON.stringify(values) !== JSON.stringify(saved.values)) throw new Error("Settings are invalid for this package. Export them again.");
export default contract.toRuntimeOptions(values);
