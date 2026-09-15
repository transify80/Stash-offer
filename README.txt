OFFER STASH V4

V4 is the working no-APK phone version.

NEW
- Cleaner mobile UI.
- Share -> Offer Stash opens Add Offer automatically.
- Shared title/text/URL are analysed locally.
- Smart fill suggests source, promo code, expiry date and category from shared text.
- Shared images remain attached locally.
- Better expiry display ("Today", "Tomorrow", "in 12 days", "Expired").
- Tracker sorted by next date.
- Local backup/restore remains merge-safe.
- No login, no cloud database, no user data server.

PRIVACY
All saved offer/tracker records and attached images stay in the browser storage on the phone. GitHub Pages only serves the application files.

IMPORTANT
Smart fill is rule-based/local in V4. It does NOT send offer text or images to an AI service.
Screenshot OCR is intentionally not claimed yet: a screenshot can be attached, while smart extraction currently works from text supplied by the Share sheet or pasted text.

DEPLOY
1. Upload the V4 files to the root of the GitHub Pages repository, replacing V3 files.
2. Keep manifest.webmanifest and sw.js.
3. On Android, uninstall/reinstall the home-screen PWA if Share Target does not update.
4. Test Gallery/Chrome -> Share -> Offer Stash.
