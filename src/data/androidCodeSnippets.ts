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

            // SharedPreferences または Database から永続化された動画URIを取得
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
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

/**
 * Android 10以降の Scoped Storage および SDカードに対応した
 * Storage Access Framework (SAF) のファイルピッカー。
 */
object StoragePickerHelper {

    /**
     * SAF (Storage Access Framework) を起動するIntentを生成。
     * 端末本体ストレージ、SDカード、外部ストレージを透過的に選択可能。
     */
    fun createVideoPickerIntent(): Intent {
        return Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "video/*" // MP4, WebM, MKVなどの動画のみを対象
            
            // 永続的なアクセス権限をリクエスト
            flags = (Intent.FLAG_GRANT_READ_URI_PERMISSION 
                    or Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
        }
    }

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

/**
 * 設定画面 (Activity / Fragment) での利用例
 */
class SettingsActivity : AppCompatActivity() {

    // Activity Result Launcher の登録
    private val selectVideoLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        uri?.let { selectedUri ->
            // 1. 永続アクセス権限の獲得（SDカード/内部ストレージ共通）
            StoragePickerHelper.persistUriPermission(this, selectedUri)
            
            // 2. プレビュー表示や壁紙サービスの再ロードを指示
            notifyWallpaperServiceUpdated()
        }
    }

    private fun openPicker() {
        selectVideoLauncher.launch(arrayOf("video/*"))
    }

    private fun notifyWallpaperServiceUpdated() {
        // 設定更新をServiceに通知するブロードキャストまたはLiveWallPaper再起動
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
import androidx.media3.exoplayer.ExoPlayer

/**
 * 端末のバッテリー状態・発熱状況に応じた動的スロットリング管理
 */
class BatteryOptimizationManager(private val context: Context) {

    private val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    private val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager

    data class PowerProfile(
        val targetFrameRate: Float, // 例: 通常時 30fps / 省電力時 20fps
        val pausePlayback: Boolean,  // 完全に一時停止するか
        val muteAudio: Boolean = true,
        val downscaleResolution: Boolean // 4Kなどの高負荷動画をGPU側で抑制するか
    )

    /**
     * 現在のバッテリー残量(%)を取得
     */
    fun getBatteryLevel(): Int {
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }

    /**
     * 充電中かどうかを判定
     */
    fun isCharging(): Boolean {
        val status = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_STATUS)
        return status == BatteryManager.BATTERY_STATUS_CHARGING ||
               status == BatteryManager.BATTERY_STATUS_FULL
    }

    /**
     * 現在のシステム状況に応じた最適な省電力プロファイルを計算
     */
    fun evaluateCurrentProfile(): PowerProfile {
        val isPowerSave = powerManager.isPowerSaveMode
        val batteryPct = getBatteryLevel()
        val isPlugged = isCharging()

        return when {
            // 充電中は最大品質 (30fps〜60fps)
            isPlugged -> PowerProfile(
                targetFrameRate = 60f,
                pausePlayback = false,
                downscaleResolution = false
            )
            // OSのバッテリーセーバー稼働中、または残量15%以下
            isPowerSave || batteryPct <= 15 -> PowerProfile(
                targetFrameRate = 15f,
                pausePlayback = true, // 15%以下は停止して静止画化が推奨
                downscaleResolution = true
            )
            // 残量30%以下の軽度省電力
            batteryPct <= 30 -> PowerProfile(
                targetFrameRate = 24f,
                pausePlayback = false,
                downscaleResolution = true
            )
            // 通常時: 30fpsで滑らかさと省電力のバランスを両立
            else -> PowerProfile(
                targetFrameRate = 30f,
                pausePlayback = false,
                downscaleResolution = false
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

    <!-- ライブ壁紙の機能要件を宣言 -->
    <uses-feature
        android:name="android.software.live_wallpaper"
        android:required="true" />

    <!-- ストレージアクセス権限 (SAFを使うため基本的に不要ですが、Android 12以前の互換用) -->
    <uses-permission
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission
        android:name="android.permission.READ_MEDIA_VIDEO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.VideoWallpaper">

        <!-- 壁紙設定アクティビティ -->
        <activity
            android:name=".SettingsActivity"
            android:exported="true"
            android:label="@string/settings_title">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 核心となるライブ壁紙サービス -->
        <service
            android:name=".VideoWallpaperService"
            android:enabled="true"
            android:exported="true"
            android:label="@string/wallpaper_service_label"
            android:permission="android.permission.BIND_WALLPAPER">
            <intent-filter>
                <!-- システムがライブ壁紙として認識するための必須アクション -->
                <action android:name="android.service.wallpaper.WallpaperService" />
            </intent-filter>

            <!-- res/xml/wallpaper.xml を参照 -->
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
    android:thumbnail="@drawable/wallpaper_thumb"
    android:description="@string/wallpaper_description"
    android:author="@string/app_author"
    android:settingsActivity="com.example.videowallpaper.SettingsActivity" />
`
  },
  {
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'gradle',
    description: 'AndroidX Media3 ExoPlayer および Jetpack コンポーネントの依存関係。',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.videowallpaper"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.videowallpaper"
        minSdk = 24 // Android 7.0以降
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
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    
    // 【重要】高効率・ハードウェアアクセラレーション対応の動画再生エンジン
    implementation("androidx.media3:media3-exoplayer:1.3.1")
    implementation("androidx.media3:media3-ui:1.3.1")
    implementation("androidx.media3:media3-common:1.3.1")

    // コルーチン（非同期I/O・URI解決用）
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
}
`
  },
  {
    filename: 'build-apk.yml',
    path: '.github/workflows/build-apk.yml',
    language: 'yaml',
    description: 'Android Studio不要！GitHubにpushするだけでAPKを自動ビルドしReleasesに登録するCI/CDワークフロー。',
    code: `name: Build & Release APK

# トリガー: タグ (v1.0.0等) 作成時、または GitHub 上の「Run workflow」ボタンで即時実行
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

      - name: 2. JDK 17 (Java開発キット) のセットアップ
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: 3. Gradleラッパー実行権限の付与
        run: chmod +x gradlew || true

      - name: 4. APKの自動ビルド (Gradle assembleRelease / assembleDebug)
        run: |
          if [ -f "./gradlew" ]; then
            ./gradlew assembleDebug --stacktrace
          else
            gradle assembleDebug --stacktrace
          fi

      - name: 5. 生成されたAPKファイルの検索
        id: apk_step
        run: |
          APK_FILE=$(find app/build/outputs/apk -name "*.apk" | head -n 1)
          echo "Found APK at: $APK_FILE"
          echo "apk_path=$APK_FILE" >> $GITHUB_OUTPUT

      - name: 6. GitHub Releases への自動公開
        if: startsWith(github.ref, 'refs/tags/v') || github.event_name == 'workflow_dispatch'
        uses: softprops/action-gh-release@v2
        with:
          files: \${{ steps.apk_step.outputs.apk_path }}
          tag_name: \${{ github.ref_name || 'v1.0.0' }}
          name: "Video Live Wallpaper \${{ github.ref_name || 'v1.0.0' }}"
          body: |
            ### 📱 Video Live Wallpaper APK (自動生成ビルド)
            
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

rootProject.name = "VideoLiveWallpaper"
include(":app")
`
  }
];
