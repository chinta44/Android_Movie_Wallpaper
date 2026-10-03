package com.example.videowallpaper

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
