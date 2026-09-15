OFFER STASH V3 — NO APK + ANDROID SHARE TARGET

This version adds Android's Web Share Target.

WHAT IT DOES
- No APK.
- No login.
- No cloud database.
- Local IndexedDB storage.
- Local images.
- Backup/restore via .osb.
- Android Share Target: share text or an image from another app to Offer Stash.
- The shared content opens directly in the Add Offer screen.

IMPORTANT LIMITATION
For Android to expose "Offer Stash" in the system Share sheet, the PWA needs to be installed from a secure origin (normally HTTPS) and launched from its installed/home-screen version. Opening index.html directly as file:// or content:// is not sufficient for the full Share Target behavior.

PHONE SETUP
1. Put this folder on an HTTPS web host.
2. Open the site in Chrome on Android.
3. Use Chrome menu -> Add to Home screen / Install app.
4. Open Offer Stash once from the home-screen icon.
5. From Gallery/Chrome/another app, tap Share.
6. Offer Stash should appear as a share destination.
7. Share the text/image. Offer Stash opens with it prefilled.

EXAMPLES
Gallery -> Share -> Offer Stash -> image appears in Add Offer.
Chrome -> Share -> Offer Stash -> page title/text/URL appear in Offer Text.
WhatsApp -> Share -> Offer Stash -> shared text can be prefilled (behavior depends on what WhatsApp exposes to Android's share sheet).

BACKUP
Tap ⇅ to create an .osb backup.
Double-tap ⇅ to restore an .osb backup in this prototype.
Restore merges by permanent ID and updatedAt; it does not wipe the current database.

NEXT POSSIBLE STEP
We can add smart local extraction:
- detect bank/app/card
- detect promo code
- detect valid-till date
- suggest category
- extract conditions
using on-device processing where practical, while keeping user data local.
