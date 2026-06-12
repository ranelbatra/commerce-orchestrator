# OmniCommerce — AI Marketing Suite (Preview)

A front-end preview of the **Multi-Modal Omni-Channel Commerce Orchestrator** — a tool concept that turns any product URL into a full AI-generated marketing suite: ad copy, a cinematic video ad, and multi-language lip-synced localizations.

This is a static **HTML / CSS / JS** prototype. No build tools, frameworks, or dependencies required — everything runs directly in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and content for all three views |
| `styles.css` | Dark-mode theme, layout, animations |
| `main.js` | View switching, simulated processing flow, and interactive UI logic |

## Running it

1. Download all three files into the **same folder**.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).

No server is required — it's a fully static page. (For best results with the Google Font loading, an internet connection is recommended; it'll fall back to system fonts offline.)

## How it works

The app simulates the orchestrator's pipeline through three views:

### 1. Input view
A hero landing page with a headline, supporting stats, and a large URL input. Paste any URL and click **Generate Marketing Suite** (or press Enter) to start the simulated pipeline.

### 2. Processing view
A canvas-drawn **orbital loader** animates while four pipeline steps run in sequence, each transitioning from spinner → checkmark with a "DONE" badge:

1. Scraping product URL and extracting details
2. Analyzing images and generating ad copy with Gemini 2.0
3. Rendering cinematic video ad via Veo 3.1
4. Applying multi-language lip-syncing and localization

After ~5 seconds total, it automatically advances to the results dashboard.

### 3. Results dashboard
A sidebar (Dashboard / Analytics / Settings) plus three main sections:

- **Generated Ad Copy** — hook, primary text, and CTA, each with a one-click "Copy to clipboard" button.
- **Cinematic Video Ad** — a mock Veo 3.1 player with platform tabs (YouTube / Instagram / TikTok), play/pause, progress bar, mute toggle, and a Download Video button.
- **Localization & Lip-Sync Studio** — a grid of 8 languages, each marked complete, with a live waveform preview and per-language export.

Click **New URL** in the header to reset and return to the input view.

## Notes

- All AI processing, scraping, video rendering, and language outputs are **simulated** — there is no backend or API integration. This prototype is for demonstrating the UI/UX flow only.
- The sample ad copy, video placeholder, and language list are static demo content and can be swapped for real generated data once connected to a backend.

## Next steps (for full implementation)

- Connect the input form to a backend that scrapes the submitted URL.
- Replace the simulated processing steps with real API calls (e.g. Gemini for copy, Veo for video, TTS/lip-sync services for localization).
- Replace the video placeholder with an actual `<video>` element or embed pointing to generated assets.
- Wire up the Copy, Download, and Export buttons to real clipboard/file outputs.
