package com.example.videowallpaper

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
