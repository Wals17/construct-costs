# Construct Costs — PWA Starter

A free, offline-ready PWA you can open in **Cursor** and deploy to **Vercel**. Works on iPhone 13 via Safari → Share → **Add to Home Screen**. Auto-updates when you redeploy.

## Quick start
```bash
npm i
npm run dev
# open http://localhost:5173
```

## Build & deploy
```bash
npm run build
npm run preview
# or push to GitHub and import in Vercel (defaults are fine)
```

## PWA install on iPhone
1. Open your deployed URL in **Safari**.
2. Tap **Share** → **Add to Home Screen**.
3. Next time you push changes to Vercel, your dad will see an update banner or get the new version on next launch.

## Tech
- React + Vite
- Dexie (IndexedDB) for offline storage
- Simple Service Worker (NetworkFirst for HTML, SWR for static/assets)
- Basic Jobs, Entries, and Profit Calculator (margin/markup)

## Notes
- This is a minimal starter; extend schemas, add receipt photos, exports, and auth when ready.
- Service worker is simple by design. If you need more control, consider Workbox or `vite-plugin-pwa` later.