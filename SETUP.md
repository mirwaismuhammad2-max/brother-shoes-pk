# OPTIONAL: native barcode scanner for an installed Android (Capacitor) app

You do NOT need this for the web app / "Add to Home screen" version: scanning already works there
using the phone camera (Chrome on Android, https address).

Only use this if you build an APK with Capacitor and want Google's scanner screen instead.

1. `npx cap add android` then `npx cap sync android`
2. Copy `plugins/BarcodeScanPlugin.kt` and `plugins/MainActivity.kt` into
   `android/app/src/main/java/com/brothershoes/app/` (delete the generated MainActivity.java).
   Use your real appId in the `package` lines.
3. Enable Kotlin: `android/build.gradle` buildscript dependencies:
   `classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24'`
   `android/app/build.gradle`: `apply plugin: 'kotlin-android'`, inside android { } add
   `kotlinOptions { jvmTarget = '17' }`, and in dependencies add
   `implementation 'com.google.android.gms:play-services-code-scanner:16.1.0'`
4. No Bluetooth or camera permission is needed. Build and run from Android Studio.
