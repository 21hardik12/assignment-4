## Zenithratech Final Stage Submission: Digital Vault Hardware Interface

### Summary
This PR delivers a single-page hardware dashboard that satisfies all three required integrations:

1. Webcam Video Feed using WebRTC (`getUserMedia`)
2. Voice-to-Text using Web Speech API
3. Bluetooth Device Scan/Selection using Web Bluetooth API

The UI was built as a secure-console style interface with clear permission states, actionable controls, and graceful fallback messaging for denied permissions or unsupported APIs.

### What was implemented

1. Camera module
- Start/stop controls for webcam stream
- Live video rendering in a `<video>` element
- Permission + error status handling

2. Voice module
- Start/stop speech recognition
- Live transcript + interim transcript rendering
- Reset action for transcript state
- Permission + runtime error handling

3. Bluetooth module
- Device scan and selector flow (`requestDevice`)
- Displays selected device name and ID
- Handles cancel/unsupported/permission states

### Architecture decisions

1. Feature hooks per hardware channel
- `useCamera`
- `useSpeechToText`
- `useBluetooth`

2. Shared typed state contracts
- Unified permission/status/error model in `src/types/hardware.ts`

3. Error normalization layer
- Browser-specific errors mapped to stable UI error messages in `src/lib/errors.ts`

4. Reusable UI primitives
- Shared panel shell + status-pill components to keep feature panels consistent

### Permission lifecycle handling

Each channel follows a clear state progression where applicable:

`idle -> pending -> granted/denied/error/unsupported`

This makes the behavior explainable and debuggable in interview scenarios.

### Testing completed

1. `npm run lint`
2. `npm run build`

Both commands pass locally.

### Deployment

Live URL: https://assignment-4-two-lake.vercel.app/

Configured deployment options in repo:

1. Vercel (`vercel.json` + `npm run deploy:vercel`)
2. Cloudflare Pages (`wrangler.toml` + `npm run deploy:cloudflare`)

### Puzzle path summary

1. Decoded hidden start endpoint from frontend canvas trap.
2. Solved auth riddle (`auth_token=1349`).
3. Completed header/cookie/timestamp handshake to unlock final blueprint.
4. Implemented hardware-interface requirements from unlocked repository instructions.

### Notes for reviewers

1. Web Bluetooth requires secure context (`https`) and Chromium-based support.
2. Speech API support is browser-dependent.
3. If permission is denied once, browser site settings may be needed to re-enable access.
