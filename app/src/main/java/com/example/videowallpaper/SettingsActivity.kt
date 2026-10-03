package com.example.videowallpaper

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
