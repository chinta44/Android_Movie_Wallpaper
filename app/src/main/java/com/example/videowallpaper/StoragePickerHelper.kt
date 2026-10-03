package com.example.videowallpaper

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
