import React from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Upload, 
  VolumeX, 
  Volume2, 
  BatteryCharging, 
  Heart,
  Sliders,
  CheckCircle2,
  Maximize2,
  Film
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
      {/* 1. 動画プリセットの選択 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">
                お気に入りの壁紙動画を選ぶ
              </h3>
              <p className="text-[11px] text-stone-500">
                淡色女子に人気のプリセット動画をお試しできます
              </p>
            </div>
          </div>
        </div>

        {/* Video Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_VIDEOS.map((preset) => {
            const isSelected = state.videoTitle === preset.title;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-400 text-rose-900 shadow-xs ring-1 ring-rose-300'
                    : 'bg-stone-50/70 border-stone-200/70 text-stone-700 hover:bg-rose-50/40 hover:border-rose-200'
                }`}
              >
                <div className="font-bold text-xs truncate mb-1">{preset.title}</div>
                <div className="text-[11px] text-stone-500 line-clamp-1 mb-2">
                  {preset.description}
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium pt-1 border-t border-rose-100/50">
                  <span>{preset.category}</span>
                  <span>{preset.fps}fps / 滑らか</span>
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
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm shadow-rose-200"
          >
            <Upload className="w-4 h-4" />
            <span>スマホやPC内の好きな動画（推し・ペットなど）を試す</span>
          </button>
          <p className="text-[11px] text-stone-400 text-center mt-1.5">
            ※ ファイルは外部に送信されず、ブラウザ内だけで安全にシミュレートされます
          </p>
        </div>
      </div>

      {/* 2. こだわり設定（省電力・音量・フィット） */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">
              安心・快適カスタマイズ
            </h3>
            <p className="text-[11px] text-stone-500">
              バッテリー持ちと使い心地を両立するスマート機能
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              {state.isMuted ? (
                <VolumeX className="w-4 h-4 text-stone-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-rose-500" />
              )}
              <div>
                <div className="text-xs font-bold text-stone-800">音声ミュート</div>
                <div className="text-[11px] text-stone-500">電車内でも安心の完全静音</div>
              </div>
            </div>
            <button
              onClick={() => onChangeState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                state.isMuted
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {state.isMuted ? '消音中 (ON)' : '音声を再生'}
            </button>
          </div>

          {/* Double Tap to Pause */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <div>
                <div className="text-xs font-bold text-stone-800">トントン一時停止</div>
                <div className="text-[11px] text-stone-500">画面ダブルタップで動画をストップ</div>
              </div>
            </div>
            <button
              onClick={() => onChangeState((prev) => ({ ...prev, enableDoubleTapPause: !prev.enableDoubleTapPause }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                state.enableDoubleTapPause
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {state.enableDoubleTapPause ? '有効' : '無効'}
            </button>
          </div>

          {/* Scale Mode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              <Maximize2 className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs font-bold text-stone-800">画面フィット</div>
                <div className="text-[11px] text-stone-500">画面いっぱいに広げるか全体を表示</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl">
              <button
                onClick={() => onChangeState((prev) => ({ ...prev, scaleMode: 'cover' }))}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  state.scaleMode === 'cover'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                全画面
              </button>
              <button
                onClick={() => onChangeState((prev) => ({ ...prev, scaleMode: 'contain' }))}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  state.scaleMode === 'contain'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                全体
              </button>
            </div>
          </div>

          {/* Target FPS */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-xs font-bold text-stone-800">フレームレート</div>
                <div className="text-[11px] text-stone-500">24fps/30fpsでバッテリー長持ち</div>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl">
              <button
                onClick={() => onChangeState((prev) => ({ ...prev, targetFps: 24 }))}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  state.targetFps === 24
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                24fps (超省電力)
              </button>
              <button
                onClick={() => onChangeState((prev) => ({ ...prev, targetFps: 30 }))}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  state.targetFps === 30
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                30fps (標準)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
