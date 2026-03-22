# Zenithratech Digital Vault Interface

Single-page hardware console built for the Zenithratech Final Stage challenge.

## What this app does

Implements the three required hardware channels on one dashboard:

1. Video Feed: Uses `navigator.mediaDevices.getUserMedia` to stream webcam video into a `<video>` element.
2. Voice to Text: Uses Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for live transcription.
3. Bluetooth: Uses `navigator.bluetooth.requestDevice` to scan and select a nearby device.

The interface surfaces:

1. Real-time permission state per channel.
2. Clear unsupported-browser messaging.
3. Recoverable error states for denied permissions and device issues.

## Stack

1. React 19
2. TypeScript
3. Vite
4. Native browser APIs (WebRTC media capture, Web Speech API, Web Bluetooth API)

## Project structure

```text
src/
  components/
    BluetoothPanel.tsx
    CameraPanel.tsx
    Panel.tsx
    SpeechPanel.tsx
    StatusPill.tsx
  hooks/
    useBluetooth.ts
    useCamera.ts
    useSpeechToText.ts
  lib/
    errors.ts
  types/
    hardware.ts
    web-speech.d.ts
  App.tsx
  App.css
  index.css
```

## Architecture notes

1. Separation of concerns:
   Hardware API interactions live in hooks (`useCamera`, `useSpeechToText`, `useBluetooth`), while components stay presentational.
2. Typed state model:
   Shared interfaces in `hardware.ts` keep permission/status/error handling consistent across features.
3. Error normalization:
   `toFeatureError` converts browser-specific exceptions into stable UI-facing errors.
4. Progressive enhancement:
   Each capability checks support at runtime and reports unsupported states without crashing the app.

## Local setup

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Browser and permission behavior

1. Camera requires user consent through browser permission prompt.
2. Speech recognition support varies by browser; Chrome and Chromium derivatives work best.
3. Web Bluetooth requires a secure context (`https`) and compatible Chromium-based browser.
4. If permissions are denied once, users may need to reset site permissions manually from browser settings.

## Deployment

Recommended targets:

1. Vercel
2. Cloudflare Pages
3. Netlify
4. GitHub Pages

Important: deploy over `https` so camera and Bluetooth APIs can function.

### Vercel (configured)

1. Ensure Vercel CLI authentication (`npx vercel login`) is completed once.
2. Run:

```bash
npm run deploy:vercel
```

### Cloudflare Pages (configured)

1. Ensure Wrangler authentication (`npx wrangler login`) is completed once.
2. Run:

```bash
npm run deploy:cloudflare
```

### Included deployment artifacts

1. `vercel.json` for SPA routing fallback.
2. `wrangler.toml` for Cloudflare Pages build output configuration.

## Puzzle walkthrough summary (how the blueprint was retrieved)

1. Decoded hidden `/v1/interview/start` endpoint from base64 chunks in client script.
2. Decoded payload riddle to derive `auth_token` value `1349`.
3. Solved vault handshake nuances:
   Request must be JSON with Unix `timestamp`, non-default client headers, and a specific requester signal.
4. Final successful request used:
   `X-Requested-With: Intern`, `Origin: https://zenithratech.com`, and `auth_token=1349` as cookie, then JSON body via `fetch`.
