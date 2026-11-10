# Brother Shoes (upgraded app)

Your original screens, buttons and data are unchanged. New: real login with roles, intro video, logo, sounds,
Firestore backup with offline sync, Google Drive backup, receipts, soft-delete.

Files (all in one folder, no sub-folders): `index.html`, `logo.png`, `icon-192.png`, `icon-512.png`, `intro.mp4`,
`manifest.json`, `sw.js` (service worker), `firestore.rules`, `README.md`.

> **About the Firebase SDK files.** They could not be downloaded while this ZIP was built, so they are not inside it.
> The app loads the pinned version 10.12.2 from Google the first time it is opened with internet and the service worker
> saves it, so after that the app opens fully offline. Optional: if you want them inside your own folder, put
> `firebase-app-compat.js`, `firebase-auth-compat.js` and `firebase-firestore-compat.js` (version 10.12.2, from
> `https://www.gstatic.com/firebasejs/10.12.2/`) next to `index.html`; the app uses them first automatically.

## Step-by-step (phone only, beginner friendly)

### A. Firebase
1. Open Chrome on your phone, go to **console.firebase.google.com**, sign in with Google. (Tip: Chrome menu > Desktop site makes the console easier.)
2. Tap **Create a project**. Name it `brother-shoes`. Turn Google Analytics off. Tap **Create**.
3. **Enable login:** left menu **Build > Authentication > Get started > Sign-in method > Email/Password > Enable > Save**.
   (Optional: also enable **Google** the same way if you want the Google button to work. The Apple button needs a paid Apple developer account, so it will show "not set up".)
4. **Create the database:** **Build > Firestore Database > Create database**. Pick the location nearest you. Choose **Production mode**. Tap **Enable**.
5. **Copy firebaseConfig:** the gear icon > **Project settings > General**. Scroll to **Your apps**, tap the **</>** (Web) icon, name it `brother-shoes`, tap **Register app**. You will see a block called `firebaseConfig` with `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`. Keep this page open.
6. **Paste it into the app:** open `index.html` in a phone text editor (for example "Acode" or "Quick Edit"). Near the top find the block **FIREBASE CONFIG**. Paste each value between the quotes. Save.
7. **Publish the rules:** in Firebase open **Firestore Database > Rules**. Delete everything there, paste the whole content of `firestore.rules`, tap **Publish**.
8. **Allow your website address:** **Authentication > Settings > Authorized domains > Add domain** and add `YOURNAME.github.io` (your GitHub username, see step 12).

### B. Google Drive backup (optional; the app works without it)
9. Go to **console.cloud.google.com**, select the same project (Firebase made it for you). **APIs & Services > Library**, search **Google Drive API**, tap **Enable**.
   Then **APIs & Services > OAuth consent screen**: choose **External**, fill the app name `Brother Shoes` and your email, save. Under **Audience/Test users** add your own Google email.
   Then **Credentials > Create credentials > OAuth client ID > Web application**. Under **Authorized JavaScript origins** add `https://YOURNAME.github.io` (no path, no slash at the end). Create, then copy the **Client ID**.
   Paste it into `index.html` in the block **GOOGLE CLIENT ID** (between the quotes). Save.

### C. Put it online
10. On your phone open your Files app, find `BrotherShoes.zip`, long-press > **Extract**. You get a folder with the files above.
11. Go to **github.com**, sign in (or create a free account). Tap **+ > New repository**. Name it `brothershoes`, choose **Public**, tap **Create repository**.
12. In the new repository tap **Add file > Upload files**. Select **all the extracted files** (not the ZIP itself) and upload. Tap **Commit changes**. Check that `index.html` is at the top level of the repository.
13. **Settings > Pages**. Under **Branch** choose `main` and folder `/ (root)`, tap **Save**. After about a minute the page shows your address: `https://YOURNAME.github.io/brothershoes/`.
14. Open that address in Chrome. Chrome menu > **Add to Home screen / Install app**.

### D. Test everything
15. **First start:** the app shows **Create Owner Account**. Enter your name, email (or a username), a password (6+ characters). You become the owner.
16. **Login + video:** log out (power button, top right), log in again. The 4-second intro video plays full screen with sound, then the app opens.
17. **Remember me:** log out, turn **Remember me ON**, log in, close the app completely, open it again: it opens straight in, with no login and no video. Log out clears it. With it OFF the app asks every time.
18. **Offline mode:** switch on airplane mode, open the app (it opens). Make a sale. The top chip says **Offline · 1 waiting**. Turn airplane mode off: it says **Syncing**, then **All synced**.
19. **Check the backup:** Firebase console > Firestore Database > Data: you see `sales`, `articles`, `state` and more.
20. **Team:** Settings (in the app) > **Team**: invite a person as **staff** or **partner**. They open the app, tap **Sign up** and use the same email or username.
21. **Drive:** Settings > **Connect Google Drive**, then **Backup now**. Check Google Drive for the folder **Brother Shoes Backup**.

## Roles
- **Owner:** everything.
- **Staff:** sells, adds stock, adds expenses. Cannot see buying price or profit, cannot refund, cannot change settings or users.
- **Partner (view-only):** sees everything, changes nothing. Enforced in the app and in `firestore.rules`.

## Notes
- Usernames (not real emails) cannot receive a password-reset email. Ask the owner, or use real emails for staff.
- "Remember me" uses Firebase Auth persistence. No password is ever stored by this app.
- Nothing is deleted for good. "Remove" only hides a record; the owner restores it in Settings > Recently removed.
- Drive backups: daily at the closing time you set in Settings, 30 seconds after big changes, or **Backup now**. Only the last 30 are kept. Google only gives a short-lived token, so if a background backup cannot run, the app shows "A backup is waiting. Tap Backup now."
- To update the app later: replace the files on GitHub and, in `sw.js`, change `bs-v1` to `bs-v2`. Open the app twice.
