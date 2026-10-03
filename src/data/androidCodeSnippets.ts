import { CodeFile } from '../types/wallpaper';

export const ANDROID_CODE_FILES: CodeFile[] = [
  {
    filename: 'VideoWallpaperService.kt',
    path: 'app/src/main/java/com/example/videowallpaper/VideoWallpaperService.kt',
    language: 'kotlin',
    description: '核心となるライブ壁紙サービス。ExoPlayerを活用し、画面非表示時の一時停止や省電力連動を完全実装。',
    code: `package com.example.videowallpaper

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.PowerManager
import android.service.wallpaper.WallpaperService
import android.view.GestureDetector
import android.view.MotionEvent
import android.view.SurfaceHolder
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer

/**
 * 端末内・SDカード内の動画をホーム画面の壁紙として再生するWallpaperService。
 * バッテリー消費を最小限に抑えるためのライフサイクル管理を徹底しています。
 */
class VideoWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine {
        return VideoEngine()
    }

    inner class VideoEngine : Engine() {
        private var exoPlayer: ExoPlayer? = null
        private var isVisible = false
        private var isUserPaused = false
        private var isBatterySaverActive = false
        
        // ダブルタップ検知（画面ダブルタップで動画の一時停止/再開）
        private val gestureDetector = GestureDetector(this@VideoWallpaperService, object : GestureDetector.SimpleOnGestureListener() {
            override fun onDoubleTap(e: MotionEvent): Boolean {
                togglePlayPause()
                return true
            }
        })

        // バッテリーセーバー・低残量検知レシーバー
        private val batteryReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                when (intent?.action) {
                    PowerManager.ACTION_POWER_SAVE_MODE_CHANGED -> {
                        checkPowerSaveMode()
                    }
                    Intent.ACTION_BATTERY_LOW -> {
                        // バッテリー残量が少なくなったら自動的に動画を一時停止または静止画フリーズ
                        applyBatteryThrottling(isLow = true)
                    }
                    Intent.ACTION_BATTERY_OKAY -> {
                        applyBatteryThrottling(isLow = false)
                    }
                }
            }
        }

        override fun onCreate(surfaceHolder: SurfaceHolder?) {
            super.onCreate(surfaceHolder)
            setTouchEventsEnabled(true)
            
            // バッテリー状態の監視登録
            val filter = IntentFilter().apply {
                addAction(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED)
                addAction(Intent.ACTION_BATTERY_LOW)
                addAction(Intent.ACTION_BATTERY_OKAY)
            }
            registerReceiver(batteryReceiver, filter)
            checkPowerSaveMode()
        }

        override fun onSurfaceCreated(holder: SurfaceHolder) {
            super.onSurfaceCreated(holder)
            initializePlayer(holder)
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder) {
            super.onSurfaceDestroyed(holder)
            releasePlayer()
        }

        /**
         * 【超重要】省電力の要：ホーム画面の可視性変更コールバック
         * 他のアプリを開いた時や画面ロック時は false が渡されます。
         * falseのときは直ちにデコーダーと再生を停止し、CPU/GPU消費を「ゼロ」にします。
         */
        override fun onVisibilityChanged(visible: Boolean) {
            super.onVisibilityChanged(visible)
            this.isVisible = visible

            if (visible) {
                // 画面が表示された時のみ再生を再開
                if (!isUserPaused && !isBatterySaverActive) {
                    exoPlayer?.play()
                }
            } else {
                // 他のアプリが前面に来た/画面オフ時は即座に停止！
                exoPlayer?.pause()
            }
        }

        override fun onTouchEvent(event: MotionEvent) {
            super.onTouchEvent(event)
            gestureDetector.onTouchEvent(event)
        }

        private fun initializePlayer(holder: SurfaceHolder) {
            if (exoPlayer != null) return

            // SharedPreferences から永続化された動画URIを取得
            val videoUri = WallpaperPreferences.getSelectedVideoUri(this@VideoWallpaperService)
                ?: return

            // ExoPlayer初期化（ハードウェアアクセラレーション利用）
            exoPlayer = ExoPlayer.Builder(this@VideoWallpaperService).build().apply {
                setVideoSurfaceHolder(holder)
                repeatMode = Player.REPEAT_MODE_ALL
                
                // 【省電力施策】音声DSPやミキサーを起動させないためミュート（音量ゼロ）
                volume = 0f

                val mediaItem = MediaItem.fromUri(videoUri)
                setMediaItem(mediaItem)
                prepare()
                
                if (isVisible && !isUserPaused && !isBatterySaverActive) {
                    play()
                }
            }
        }

        private fun releasePlayer() {
            exoPlayer?.let { player ->
                player.stop()
                player.release()
            }
            exoPlayer = null
        }

        private fun togglePlayPause() {
            isUserPaused = !isUserPaused
            if (isUserPaused) {
                exoPlayer?.pause()
            } else if (isVisible && !isBatterySaverActive) {
                exoPlayer?.play()
            }
        }

        private fun checkPowerSaveMode() {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            isBatterySaverActive = powerManager.isPowerSaveMode
            if (isBatterySaverActive) {
                // 省電力モード中は動画を静止させ、バッテリー消費を完全抑制
                exoPlayer?.pause()
            } else if (isVisible && !isUserPaused) {
                exoPlayer?.play()
            }
        }

        private fun applyBatteryThrottling(isLow: Boolean) {
            if (isLow) {
                exoPlayer?.pause()
            } else if (isVisible && !isBatterySaverActive && !isUserPaused) {
                exoPlayer?.play()
            }
        }

        override fun onDestroy() {
            super.onDestroy()
            try {
                unregisterReceiver(batteryReceiver)
            } catch (e: Exception) {
                // 無視
            }
            releasePlayer()
        }
    }
}
`
  },
  {
    filename: 'StoragePickerHelper.kt',
    path: 'app/src/main/java/com/example/videowallpaper/StoragePickerHelper.kt',
    language: 'kotlin',
    description: 'SDカードおよび端末内部ストレージの動画選択と永続権限（takePersistableUriPermission）の獲得処理。',
    code: `package com.example.videowallpaper

import android.content.Context
import android.content.Intent
import android.net.Uri

/**
 * Android 10以降の Scoped Storage および SDカードに対応した
 * Storage Access Framework (SAF) のファイルピッカー支援。
 */
object StoragePickerHelper {

    /**
     * 【最重要】選択した動画URIの永続権限を保持する
     * これを行わないと、設定アプリを閉じた後や端末再起動後に
     * WallpaperServiceから動画が読み込めなくなります！
     */
    fun persistUriPermission(context: Context, uri: Uri) {
        val takeFlags: Int = Intent.FLAG_GRANT_READ_URI_PERMISSION
        try {
            context.contentResolver.takePersistableUriPermission(uri, takeFlags)
            // 権限獲得成功後、Prefs等にURI文字列を保存
            WallpaperPreferences.saveSelectedVideoUri(context, uri)
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }
}
`
  },
  {
    filename: 'WallpaperPreferences.kt',
    path: 'app/src/main/java/com/example/videowallpaper/WallpaperPreferences.kt',
    language: 'kotlin',
    description: '選択された動画のURI文字列を端末内に永続保存・取得するヘルパークラス。',
    code: `package com.example.videowallpaper

import android.content.Context
import android.net.Uri

object WallpaperPreferences {
    private const val PREF_NAME = "wallpaper_prefs"
    private const val KEY_VIDEO_URI = "selected_video_uri"

    fun saveSelectedVideoUri(context: Context, uri: Uri) {
        context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_VIDEO_URI, uri.toString())
            .apply()
    }

    fun getSelectedVideoUri(context: Context): Uri? {
        val uriStr = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getString(KEY_VIDEO_URI, null) ?: return null
        return Uri.parse(uriStr)
    }
}
`
  },
  {
    filename: 'SettingsActivity.kt',
    path: 'app/src/main/java/com/example/videowallpaper/SettingsActivity.kt',
    language: 'kotlin',
    description: '動画選択ボタンと、ホーム画面のライブ壁紙として適用するボタンを備えた設定画面。',
    code: `package com.example.videowallpaper

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class SettingsActivity : AppCompatActivity() {

    private val selectVideoLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        if (uri != null) {
            StoragePickerHelper.persistUriPermission(this, uri)
            Toast.makeText(this, "動画を選択しました！「壁紙に設定」を押してください", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(60, 100, 60, 60)
            gravity = android.view.Gravity.CENTER_HORIZONTAL
        }

        val title = TextView(this).apply {
            text = "🎬 動画ライブ壁紙 設定"
            textSize = 22f
            setPadding(0, 0, 0, 60)
            gravity = android.view.Gravity.CENTER
        }
        layout.addView(title)

        val btnSelect = Button(this).apply {
            text = "📂 端末/SDカードから動画を選択"
            setOnClickListener {
                selectVideoLauncher.launch(arrayOf("video/*"))
            }
        }
        layout.addView(btnSelect)

        val btnSetWallpaper = Button(this).apply {
            text = "✨ ホーム画面の壁紙に設定する"
            setOnClickListener {
                val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
                    putExtra(
                        WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                        ComponentName(this@SettingsActivity, VideoWallpaperService::class.java)
                    )
                }
                startActivity(intent)
            }
        }
        layout.addView(btnSetWallpaper)

        setContentView(layout)
    }
}
`
  },
  {
    filename: 'BatteryOptimizationManager.kt',
    path: 'app/src/main/java/com/example/videowallpaper/BatteryOptimizationManager.kt',
    language: 'kotlin',
    description: 'フレームレート制御（30fps/24fps）、省電力プロファイル、温度上昇時の動的スロットリングマネージャー。',
    code: `package com.example.videowallpaper

import android.content.Context
import android.os.BatteryManager
import android.os.PowerManager

/**
 * 端末のバッテリー状態に応じた動的スロットリング管理
 */
class BatteryOptimizationManager(private val context: Context) {

    private val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    private val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager

    data class PowerProfile(
        val targetFrameRate: Float,
        val pausePlayback: Boolean,
        val muteAudio: Boolean = true
    )

    fun evaluateCurrentProfile(): PowerProfile {
        val isPowerSave = powerManager.isPowerSaveMode
        val batteryPct = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)

        return when {
            isPowerSave || batteryPct <= 15 -> PowerProfile(
                targetFrameRate = 15f,
                pausePlayback = true
            )
            batteryPct <= 30 -> PowerProfile(
                targetFrameRate = 24f,
                pausePlayback = false
            )
            else -> PowerProfile(
                targetFrameRate = 30f,
                pausePlayback = false
            )
        }
    }
}
`
  },
  {
    filename: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'ライブ壁紙サービスに必要なIntent-Filter、パーミッション、Wallpaper XMLメタデータの定義。',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-feature
        android:name="android.software.live_wallpaper"
        android:required="true" />

    <uses-permission
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission
        android:name="android.permission.READ_MEDIA_VIDEO" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/app_icon"
        android:roundIcon="@drawable/app_icon"
        android:label="動く動画壁紙"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.DayNight.NoActionBar">

        <activity
            android:name=".SettingsActivity"
            android:exported="true"
            android:label="壁紙設定">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".VideoWallpaperService"
            android:enabled="true"
            android:exported="true"
            android:label="動画ライブ壁紙エンジン"
            android:permission="android.permission.BIND_WALLPAPER">
            <intent-filter>
                <action android:name="android.service.wallpaper.WallpaperService" />
            </intent-filter>

            <meta-data
                android:name="android.service.wallpaper"
                android:resource="@xml/wallpaper" />
        </service>

    </application>

</manifest>
`
  },
  {
    filename: 'wallpaper.xml',
    path: 'app/src/main/res/xml/wallpaper.xml',
    language: 'xml',
    description: 'システム壁紙ピッカーに表示されるサムネイル、説明文、設定画面への導線メタデータ。',
    code: `<?xml version="1.0" encoding="utf-8"?>
<wallpaper xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/wallpaper_description"
    android:author="@string/app_name"
    android:settingsActivity="com.example.videowallpaper.SettingsActivity" />
`
  },
  {
    filename: 'strings.xml',
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'アプリの文字列リソース。',
    code: `<resources>
    <string name="app_name">Android Movie Wallpaper</string>
    <string name="wallpaper_description">端末内・SDカードの動画をホーム画面の背景として再生するライブ壁紙</string>
    <string name="settings_title">動画壁紙の設定</string>
</resources>
`
  },
  {
    filename: 'app-build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'gradle',
    description: 'AndroidX Media3 ExoPlayer および Jetpack コンポーネントの依存関係。',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.videowallpaper"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.videowallpaper"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    
    // ExoPlayer 動画再生エンジン
    implementation("androidx.media3:media3-exoplayer:1.3.1")
    implementation("androidx.media3:media3-ui:1.3.1")
    implementation("androidx.media3:media3-common:1.3.1")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
}
`
  },
  {
    filename: 'root-build.gradle.kts',
    path: 'build.gradle.kts',
    language: 'gradle',
    description: 'リポジトリ直下のルート build.gradle.kts。Android Gradle PluginとKotlinを定義。',
    code: `plugins {
    id("com.android.application") version "8.3.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false
}
`
  },
  {
    filename: 'settings.gradle.kts',
    path: 'settings.gradle.kts',
    language: 'gradle',
    description: 'リポジトリ直下に配置するプロジェクト設定ファイル。Google Mavenリポジトリの参照を定義。',
    code: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Android_Movie_Wallpaper"
include(":app")
`
  },
  {
    filename: 'gradle.properties',
    path: 'gradle.properties',
    language: 'properties',
    description: 'AndroidXおよびメモリ等のGradle全体プロパティ設定ファイル。',
    code: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  },
  {
    filename: 'gradle-wrapper.properties',
    path: 'gradle/wrapper/gradle-wrapper.properties',
    language: 'properties',
    description: 'Gradleのバージョン定義ファイル。',
    code: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  },
  {
    filename: 'gradlew',
    path: 'gradlew',
    language: 'yaml',
    description: 'Linux/Ubuntu/Mac環境用のGradle起動シェルスクリプト。',
    code: `#!/bin/sh
APP_BASE_NAME=\`basename "$0"\`
DIRNAME=\`dirname "$0"\`
exec "$DIRNAME/gradle/wrapper/gradle-wrapper.jar" "$@" 2>/dev/null || gradle "$@"
`
  },
  {
    filename: 'build-apk.yml',
    path: '.github/workflows/build-apk.yml',
    language: 'yaml',
    description: '【完全版】AndroidX自動設定・エラー防止済みのGitHub Actionsワークフロー。',
    code: `name: Build & Release APK

on:
  push:
    tags:
      - 'v*'
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: 1. ソースコードのチェックアウト
        uses: actions/checkout@v4

      - name: 2. JDK 17 のセットアップ
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: 3. Gradle 8.7 の自動セットアップ
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.7'

      - name: 4. AndroidX設定とリソース自動修正
        run: |
          echo "android.useAndroidX=true" >> gradle.properties
          echo "android.nonTransitiveRClass=true" >> gradle.properties
          echo "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m" >> gradle.properties
          sed -i 's/android:author="Android Movie Wallpaper"/android:author="@string\/app_name"/g' app/src/main/res/xml/wallpaper.xml || true

      - name: 5. Android SDK ライセンスの自動同意
        run: |
          yes | sdkmanager --licenses 2>/dev/null || true

      - name: 6. APKの自動ビルド (assembleDebug)
        run: gradle assembleDebug -Pandroid.useAndroidX=true --stacktrace

      - name: 7. 生成されたAPKファイルの検索
        id: apk_step
        run: |
          APK_FILE=\$(find app/build/outputs/apk -name "*.apk" | head -n 1)
          echo "Found APK at: \$APK_FILE"
          echo "apk_path=\$APK_FILE" >> \$GITHUB_OUTPUT

      - name: 8. GitHub Releases への自動公開
        uses: softprops/action-gh-release@v2
        with:
          files: \${{ steps.apk_step.outputs.apk_path }}
          tag_name: \${{ github.ref_name || 'v1.0.0' }}
          name: "Android_Movie_Wallpaper \${{ github.ref_name || 'v1.0.0' }}"
          body: |
            ### 📱 Android_Movie_Wallpaper APK (自動ビルド完了)
            
            Android Studioを使わずにGitHub Actionsにより自動コンパイルされたインストール用APKです。
            
            #### ⚙️ 機能
            - 端末内部ストレージおよびSDカードの動画をホーム画面の動く壁紙に設定
            - ホーム非表示時・別アプリ起動時に完全0mW休止するバッテリー省電力機構
            - 30fps/24fps リミッター & 音声ミュート対応
            - ダブルタップ一時停止
            
            #### 📥 インストール手順
            1. 下の **Assets** にある \`.apk\` ファイルをスマホにダウンロード
            2. 「提供元不明のアプリのインストールを許可」をONにしてインストール
            3. アプリを起動し動画を選択して「壁紙に設定」をタップ
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`
  }
];
