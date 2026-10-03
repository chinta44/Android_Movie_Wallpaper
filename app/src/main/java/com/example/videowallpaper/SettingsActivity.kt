package com.example.videowallpaper

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class SettingsActivity : AppCompatActivity() {

    private lateinit var tvSelectedVideoStatus: TextView
    private lateinit var tvSelectedVideoSub: TextView

    private val selectVideoLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri ->
        if (uri != null) {
            StoragePickerHelper.persistUriPermission(this, uri)
            val fileName = getFileNameFromUri(uri)
            updateVideoStatusDisplay(fileName)
            Toast.makeText(this, "💖 動画を選択しました！「壁紙に設定する」を押してね", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val scrollView = ScrollView(this).apply {
            setBackgroundColor(Color.parseColor("#FFF8F9"))
            isFillViewport = true
        }

        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(36), dp(20), dp(40))
            gravity = Gravity.CENTER_HORIZONTAL
        }

        // 1. かわいいアプリアイコン
        val ivIcon = ImageView(this).apply {
            setImageDrawable(ContextCompat.getDrawable(this@SettingsActivity, R.drawable.ic_launcher))
            val size = dp(76)
            layoutParams = LinearLayout.LayoutParams(size, size).apply {
                bottomMargin = dp(12)
            }
        }
        rootLayout.addView(ivIcon)

        // 2. バージョンバッジ (v1.2.0)
        val tvVersion = TextView(this).apply {
            text = "🎀 Version 1.2.0 (Cute Edition)"
            textSize = 12f
            setTextColor(Color.parseColor("#FF4D6D"))
            typeface = Typeface.DEFAULT_BOLD
            background = ContextCompat.getDrawable(this@SettingsActivity, R.drawable.bg_badge_version)
            setPadding(dp(14), dp(5), dp(14), dp(5))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(10)
            }
        }
        rootLayout.addView(tvVersion)

        // 3. タイトル & サブタイトル
        val tvTitle = TextView(this).apply {
            text = "🌸 動く動画壁紙"
            textSize = 23f
            setTextColor(Color.parseColor("#2E2827"))
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(4)
            }
        }
        rootLayout.addView(tvTitle)

        val tvSubtitle = TextView(this).apply {
            text = "お気に入りの推し動画やペットをホーム画面に ✨"
            textSize = 13f
            setTextColor(Color.parseColor("#857270"))
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(24)
            }
        }
        rootLayout.addView(tvSubtitle)

        // 4. 選択中動画ステータスカード
        val statusCard = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = ContextCompat.getDrawable(this@SettingsActivity, R.drawable.bg_cute_card)
            setPadding(dp(18), dp(18), dp(18), dp(18))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(20)
            }
        }

        val tvCardLabel = TextView(this).apply {
            text = "🎬 選択中の動画ファイル"
            textSize = 12f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor("#FF4D6D"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(6)
            }
        }
        statusCard.addView(tvCardLabel)

        tvSelectedVideoStatus = TextView(this).apply {
            text = "📂 まだ動画が選ばれていません"
            textSize = 15f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor("#2E2827"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(4)
            }
        }
        statusCard.addView(tvSelectedVideoStatus)

        tvSelectedVideoSub = TextView(this).apply {
            text = "下の「好きな動画を選ぶ」から設定したい動画を選んでね 💕"
            textSize = 12f
            setTextColor(Color.parseColor("#9E8B89"))
        }
        statusCard.addView(tvSelectedVideoSub)

        rootLayout.addView(statusCard)

        // 5. 動画選択ボタン
        val btnSelect = Button(this).apply {
            text = "💖 好きな動画を選ぶ (推し・ペット)"
            textSize = 15f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = ContextCompat.getDrawable(this@SettingsActivity, R.drawable.bg_cute_btn_select)
            elevation = dp(4).toFloat()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp(54)
            ).apply {
                bottomMargin = dp(14)
            }
            setOnClickListener {
                selectVideoLauncher.launch(arrayOf("video/*"))
            }
        }
        rootLayout.addView(btnSelect)

        // 6. 壁紙設定ボタン
        val btnSetWallpaper = Button(this).apply {
            text = "🌸 ホーム画面の壁紙に設定する"
            textSize = 15f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            background = ContextCompat.getDrawable(this@SettingsActivity, R.drawable.bg_cute_btn_apply)
            elevation = dp(4).toFloat()
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dp(54)
            ).apply {
                bottomMargin = dp(24)
            }
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
        rootLayout.addView(btnSetWallpaper)

        // 7. 安心ポイントカード
        val safetyCard = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = ContextCompat.getDrawable(this@SettingsActivity, R.drawable.bg_cute_card)
            setPadding(dp(18), dp(18), dp(18), dp(18))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(24)
            }
        }

        val tvSafetyTitle = TextView(this).apply {
            text = "✨ 安心して使える3つのポイント"
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.parseColor("#2E2827"))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(10)
            }
        }
        safetyCard.addView(tvSafetyTitle)

        safetyCard.addView(createFeatureRow("🔋 電池減らない安心設計", "画面OFFや別アプリを開くと自動で0.0mW完全スリープ！充電を気にせず楽しめます。"))
        safetyCard.addView(createFeatureRow("🔇 電車でも安心の無音設定", "音声は最初から自動でミュート。公共の場所でも音が鳴りません。"))
        safetyCard.addView(createFeatureRow("🖐️ トントン一時停止", "画面をすばやくダブルタップすると、いつでも動画を一時停止できます。"))

        rootLayout.addView(safetyCard)

        // 永続化されたURIがあれば表示更新
        val currentUri = WallpaperPreferences.getSelectedVideoUri(this)
        if (currentUri != null) {
            val fileName = getFileNameFromUri(currentUri)
            updateVideoStatusDisplay(fileName)
        }

        scrollView.addView(rootLayout)
        setContentView(scrollView)
    }

    private fun createFeatureRow(title: String, desc: String): View {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(8)
            }

            val tvItemTitle = TextView(this@SettingsActivity).apply {
                text = title
                textSize = 12f
                typeface = Typeface.DEFAULT_BOLD
                setTextColor(Color.parseColor("#FF4D6D"))
            }
            addView(tvItemTitle)

            val tvItemDesc = TextView(this@SettingsActivity).apply {
                text = desc
                textSize = 11f
                setTextColor(Color.parseColor("#786563"))
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    topMargin = dp(1)
                }
            }
            addView(tvItemDesc)
        }
    }

    private fun updateVideoStatusDisplay(fileName: String?) {
        if (!fileName.isNullOrEmpty()) {
            tvSelectedVideoStatus.text = "✓ $fileName"
            tvSelectedVideoStatus.setTextColor(Color.parseColor("#2E2827"))
            tvSelectedVideoSub.text = "✨ 壁紙に設定する準備ができました！下のボタンを押してね"
            tvSelectedVideoSub.setTextColor(Color.parseColor("#FF4D6D"))
        }
    }

    private fun getFileNameFromUri(uri: Uri): String {
        var name = uri.lastPathSegment ?: "動画ファイル"
        if (uri.scheme == "content") {
            try {
                contentResolver.query(uri, null, null, null, null)?.use { cursor ->
                    val nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (nameIndex != -1 && cursor.moveToFirst()) {
                        name = cursor.getString(nameIndex)
                    }
                }
            } catch (e: Exception) {
                // Ignore
            }
        }
        return name
    }

    private fun dp(value: Int): Int {
        return (value * resources.displayMetrics.density).toInt()
    }
}
