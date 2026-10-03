import React from 'react';
import { 
  Play, 
  Pause, 
  Smartphone, 
  Layers, 
  BatteryLow, 
  Zap, 
  Sliders, 
  Upload, 
  VolumeX, 
  Volume2, 
  Power, 
  Maximize2,
  HardDrive,
  FileVideo,
  Info
} from 'lucide-react';
import { SimulatorState, VideoPreset } from '../types/wallpaper';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';

interface SimulatorControlsProps {
  state: SimulatorState;
  onChangeState: (updater: (prev: SimulatorState) => SimulatorState) => void;
  onCustomVideoSelect: (file: File) => void;
  onSelectPreset: (preset: VideoPreset) => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  state,
  onChangeState,
  onCustomVideoSelect,
  onSelectPreset
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomVideoSelect(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 動画ソースの選択 (内部ストレージ / SDカード) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              動画ソースの選択 (端末内部 / SDカード)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {state.videoSourceType === 'sdcard' ? 'SDカード (外部)' : state.videoSourceType === 'custom' ? 'ローカル動画' : '内部ストレージ'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Storage Access Framework (SAF) によるアクセスをシミュレートしています。PC/スマホ内の任意の動画ファイルもそのままロード可能です。
        </p>

        {/* Video Presets */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {SAMPLE_VIDEOS.map((preset) => {
            const isSelected = state.videoTitle === preset.title;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500/80 text-white shadow-md shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="font-medium truncate mb-1">{preset.title.split(' ')[0]}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{preset.resolution.split(' ')[0]}</span>
                  <span>{preset.fps}fps</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Video Picker Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>自分の動画を選択してテスト (MP4/WebM)</span>
          </button>
        </div>
      </div>

      {/* 2. OSライフサイクルシミュレーション (省電力動作トリガー) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            OSライフサイクル検証 (最も重要な省電力検証)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          ボタンを押してAndroid OSの画面遷移を再現し、壁紙サービスが即座にデコーダーを休止（0W化）するか確認できます。
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* App Obscuring Trigger (onVisibilityChanged) */}
          <button
            onClick={() => onChangeState((prev) => ({ ...prev, isAppObscuring: !prev.isAppObscuring }))}
            className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-start gap-1 transition-all ${
              state.isAppObscuring
                ? 'bg-amber-950/50 border-amber-500/70 text-amber-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="font-semibold">別アプリを開く</span>
              <Smartphone className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-400 leading-tight">
              {state.isAppObscuring ? '前面にアプリ表示中 (停止中)' : 'onVisibilityChanged(false) をテスト'}
            </span>
          </button>

          {/* Screen Off / Locked */}
          <button
            onClick={() => onChangeState((prev) => ({ ...prev, isScreenOff: !prev.isScreenOff }))}
            className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-start gap-1 transition-all ${
              state.isScreenOff
                ? 'bg-rose-950/50 border-rose-500/70 text-rose-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="font-semibold">画面オフ / ロック</span>
              <Power className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-[10px] text-slate-400 leading-tight">
              {state.isScreenOff ? '画面消灯中 (完全0mW)' : 'ACTION_SCREEN_OFF をテスト'}
            </span>
          </button>

          {/* Battery Saver Mode */}
          <button
            onClick={() => onChangeState((prev) => ({ ...prev, isBatterySaver: !prev.isBatterySaver }))}
            className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-start gap-1 transition-all ${
              state.isBatterySaver
                ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="font-semibold">省電力モード</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400 leading-tight">
              {state.isBatterySaver ? '省電力モード作動中' : 'PowerManager連動をテスト'}
            </span>
          </button>

          {/* Low Battery (<20%) */}
          <button
            onClick={() => onChangeState((prev) => ({ 
              ...prev, 
              batteryLevel: prev.batteryLevel <= 20 ? 85 : 15 
            }))}
            className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-start gap-1 transition-all ${
              state.batteryLevel <= 20
                ? 'bg-red-950/50 border-red-500/70 text-red-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="font-semibold">残量15% (低残量)</span>
              <BatteryLow className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-[10px] text-slate-400 leading-tight">
              {state.batteryLevel <= 20 ? 'ACTION_BATTERY_LOW発火中' : '低残量時スロットリングをテスト'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. 最適化エンジン設定 (Battery Optimization Settings) */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            省電力エンジンのパラメータ調整
          </h3>
        </div>

        {/* FPS Limiter */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">フレームレート制限 (FPS Cap)</span>
            <span className="text-cyan-400 font-mono font-medium">{state.targetFps} FPS</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            {[15, 24, 30, 60].map((fpsVal) => (
              <button
                key={fpsVal}
                onClick={() => onChangeState((prev) => ({ ...prev, targetFps: fpsVal as any }))}
                className={`py-1.5 text-xs font-mono rounded-lg transition-colors ${
                  state.targetFps === fpsVal
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fpsVal}fps
              </button>
            ))}
          </div>
          <div className="text-[10px] text-slate-500">
            ※ Androidの壁紙は通常120Hz駆動しますが、30fps以下に固定することでGPU負荷を60%削減できます。
          </div>
        </div>

        {/* Toggle switches */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          {/* Audio Muting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {state.isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              <div>
                <div className="text-xs text-slate-200 font-medium">音声を完全に無効化 (Mute)</div>
                <div className="text-[10px] text-slate-500">AudioTrackとDSPの待機電力をゼロにします</div>
              </div>
            </div>
            <button
              onClick={() => onChangeState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                state.isMuted ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                state.isMuted ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Double Tap Pause */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-200 font-medium">ダブルタップで一時停止</div>
              <div className="text-[10px] text-slate-500">ホーム画面の余白を素早く2回タップして手動休止</div>
            </div>
            <button
              onClick={() => onChangeState((prev) => ({ ...prev, enableDoubleTapPause: !prev.enableDoubleTapPause }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                state.enableDoubleTapPause ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                state.enableDoubleTapPause ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Auto Pause on Low Battery */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-200 font-medium">低バッテリー時/省電力モードで静止画化</div>
              <div className="text-[10px] text-slate-500">残量20%以下またはOS省電力モードで動画停止</div>
            </div>
            <button
              onClick={() => onChangeState((prev) => ({ ...prev, autoPauseOnLowBattery: !prev.autoPauseOnLowBattery }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                state.autoPauseOnLowBattery ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                state.autoPauseOnLowBattery ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
