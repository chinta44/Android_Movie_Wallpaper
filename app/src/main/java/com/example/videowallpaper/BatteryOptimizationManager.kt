package com.example.videowallpaper

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
