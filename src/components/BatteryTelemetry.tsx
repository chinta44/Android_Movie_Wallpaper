import React, { useMemo } from 'react';
import { 
  Zap, 
  Cpu, 
  Activity, 
  Terminal, 
  ShieldCheck, 
  Gauge,
  TrendingDown,
  Clock
} from 'lucide-react';
import { SimulatorState, LogEntry } from '../types/wallpaper';

interface BatteryTelemetryProps {
  state: SimulatorState;
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const BatteryTelemetry: React.FC<BatteryTelemetryProps> = ({
  state,
  logs,
  onClearLogs
}) => {
  // Calculate simulated real-time power metrics
  const powerMetrics = useMemo(() => {
    // If screen is off, power is 0 mW
    if (state.isScreenOff) {
      return {
        totalWatts: 0,
        gpuWatts: 0,
        decoderWatts: 0,
        audioWatts: 0,
        statusText: '画面OFF: デコーダー完全シャットダウン (0 mW)',
        drainRatePerHour: 0.1, // normal standby
        batterySavedPercentage: 100
      };
    }

    // If app is obscuring (onVisibilityChanged == false), power is 0 mW for wallpaper
    if (state.isAppObscuring) {
      return {
        totalWatts: 0,
        gpuWatts: 0,
        decoderWatts: 0,
        audioWatts: 0,
        statusText: 'アプリ前面: onVisibilityChanged(false) 休止中 (0 mW)',
        drainRatePerHour: 0.1,
        batterySavedPercentage: 100
      };
    }

    // If paused (e.g. by double-tap or low battery auto pause)
    if (!state.isPlaying || (state.isBatterySaver && state.autoPauseOnLowBattery)) {
      return {
        totalWatts: 4, // static wallpaper buffer
        gpuWatts: 2,
        decoderWatts: 0,
        audioWatts: 0,
        statusText: '静止画休止: デコード停止・静止フレーム保持 (4 mW)',
        drainRatePerHour: 0.3,
        batterySavedPercentage: 96
      };
    }

    // Baseline active video playback calculation
    let baseGpu = 45; // mW
    let baseDecoder = 55; // mW
    let baseAudio = state.isMuted ? 0 : 35; // mW

    // FPS scaling factor
    const fpsScale = state.targetFps / 60;
    const actualGpu = Math.round(baseGpu * fpsScale * (state.isBatterySaver ? 0.7 : 1));
    const actualDecoder = Math.round(baseDecoder * fpsScale);
    const total = actualGpu + actualDecoder + baseAudio;

    // Compare with an unoptimized naive implementation (60fps, no visibility hook, audio playing): ~220 mW
    const unoptimizedWatts = 220;
    const savedPct = Math.round(((unoptimizedWatts - total) / unoptimizedWatts) * 100);
    const drainRate = (total / 100) * 1.5; // % per hour of screen-on

    return {
      totalWatts: total,
      gpuWatts: actualGpu,
      decoderWatts: actualDecoder,
      audioWatts: baseAudio,
      statusText: `ハードウェア再生中 (${state.targetFps}fps / ${total} mW)`,
      drainRatePerHour: Number(drainRate.toFixed(1)),
      batterySavedPercentage: Math.max(0, savedPct)
    };
  }, [state]);

  return (
    <div className="space-y-5">
      {/* 1. Real-Time Hardware Power Drain Gauge */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              リアルタイム電力消費モニター (Telemetry)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {powerMetrics.statusText}
          </span>
        </div>

        {/* Big Watts Indicator & Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium mb-1">現在の消費電力</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {powerMetrics.totalWatts}
              <span className="text-xs font-normal text-slate-400 ml-1">mW</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              通常アプリ比: <span className="text-emerald-400 font-semibold">極小</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium mb-1">未対策比の省電力効果</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              -{powerMetrics.batterySavedPercentage}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              <span className="text-cyan-400">削減済み</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium mb-1">画面点灯時消費レート</div>
            <div className="text-2xl font-bold font-mono text-indigo-400">
              {powerMetrics.drainRatePerHour}
              <span className="text-xs font-normal text-slate-400 ml-1">%/h</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              5,000mAh バッテリー想定
            </div>
          </div>
        </div>

        {/* Hardware Component Power Distribution */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-300">
            <span>ハードウェア内訳</span>
            <span className="font-mono text-slate-400">GPU: {powerMetrics.gpuWatts}mW · デコーダー: {powerMetrics.decoderWatts}mW · 音声: {powerMetrics.audioWatts}mW</span>
          </div>

          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${powerMetrics.totalWatts > 0 ? (powerMetrics.gpuWatts / (powerMetrics.totalWatts || 1)) * 100 : 0}%` }}
              className="bg-indigo-500 transition-all duration-300" 
              title="GPU Surface描画"
            />
            <div 
              style={{ width: `${powerMetrics.totalWatts > 0 ? (powerMetrics.decoderWatts / (powerMetrics.totalWatts || 1)) * 100 : 0}%` }}
              className="bg-cyan-500 transition-all duration-300" 
              title="MediaCodec ハードウェアデコーダー"
            />
            <div 
              style={{ width: `${powerMetrics.totalWatts > 0 ? (powerMetrics.audioWatts / (powerMetrics.totalWatts || 1)) * 100 : 0}%` }}
              className="bg-amber-500 transition-all duration-300" 
              title="AudioTrack (音声DSP)"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Surface描画 (GPU)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>動画HWデコーダー (MediaCodec)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>音声DSP {state.isMuted ? '(ミュート済み 0mW)' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Simulated Android Logcat Output */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl font-mono">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Android Logcat (ライブ壁紙プロセスの実機ログ)
            </span>
          </div>
          <button
            onClick={onClearLogs}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            ログ消去
          </button>
        </div>

        <div className="h-44 overflow-y-auto space-y-1 text-[11px] scrollbar-thin scrollbar-thumb-slate-800 pr-1">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 font-bold ${
                log.level === 'E' ? 'text-red-400' :
                log.level === 'W' ? 'text-amber-400' :
                log.level === 'I' ? 'text-cyan-400' : 'text-slate-400'
              }`}>
                {log.level}/{log.tag}:
              </span>
              <span className={`${
                log.level === 'E' ? 'text-red-300' :
                log.level === 'W' ? 'text-amber-300' :
                log.level === 'I' ? 'text-slate-300' : 'text-slate-400'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
