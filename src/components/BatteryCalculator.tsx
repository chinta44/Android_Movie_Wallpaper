import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Battery, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

export const BatteryCalculator: React.FC = () => {
  const [batteryCapacity, setBatteryCapacity] = useState(5000); // mAh
  const [screenOnHours, setScreenOnHours] = useState(5.0); // hours
  const [homeScreenPct, setHomeScreenPct] = useState(15); // % of screen time spent on home screen
  const [targetFps, setTargetFps] = useState(30);
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [enableVisibilityOpt, setEnableVisibilityOpt] = useState(true);
  const [enableMute, setEnableMute] = useState(true);

  // Calculations
  const stats = useMemo(() => {
    // Total hours home screen is actually visible
    const homeScreenHours = screenOnHours * (homeScreenPct / 100);
    const backgroundHours = screenOnHours - homeScreenHours;
    const standbyHours = 24 - screenOnHours;

    // Res multiplier
    const resMult = resolution === '720p' ? 0.75 : resolution === '1080p' ? 1.0 : 2.4;
    // FPS multiplier
    const fpsMult = targetFps / 30;

    // Active power draw (mA at ~3.85V)
    const baseDecoderMa = 22 * resMult * fpsMult;
    const baseGpuMa = 18 * fpsMult;
    const baseAudioMa = enableMute ? 0 : 12;
    const activeTotalMa = baseDecoderMa + baseGpuMa + baseAudioMa;

    // Unoptimized implementation:
    // Naive wallpaper without onVisibilityChanged keeps decoding even when app is open or screen is on!
    // Unoptimized total mA consumption per day:
    const unoptimizedActiveHours = screenOnHours; // decodes full 5 hours!
    const unoptimizedDrainMah = unoptimizedActiveHours * (activeTotalMa + 15); // with extra overhead
    const unoptimizedPct = (unoptimizedDrainMah / batteryCapacity) * 100;

    // Optimized implementation:
    // Only decodes when homeScreenHours is active!
    // Background hours power = 0 mA!
    const optimizedActiveHours = enableVisibilityOpt ? homeScreenHours : screenOnHours;
    const optimizedDrainMah = optimizedActiveHours * activeTotalMa;
    const optimizedPct = (optimizedDrainMah / batteryCapacity) * 100;

    const savedPct = Math.max(0, unoptimizedPct - optimizedPct);
    const savedMah = Math.round(unoptimizedDrainMah - optimizedDrainMah);

    return {
      homeScreenHours: homeScreenHours.toFixed(1),
      optimizedPct: optimizedPct.toFixed(1),
      unoptimizedPct: unoptimizedPct.toFixed(1),
      savedPct: savedPct.toFixed(1),
      savedMah,
      activeTotalMa: Math.round(activeTotalMa),
      efficiencyScore: savedPct > 10 ? 'S (極めて優秀)' : 'A (良好)'
    };
  }, [batteryCapacity, screenOnHours, homeScreenPct, targetFps, resolution, enableVisibilityOpt, enableMute]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            バッテリー消費・節約シミュレーション計算機
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          スマホの画面利用時間や解像度、フレームレート、最適化フラグを変更して、1日あたりのバッテリー影響を比較できます。
        </p>
      </div>

      {/* Main Grid: Controls + Results */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
            {/* Battery Capacity */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">端末のバッテリー容量</span>
                <span className="font-mono text-indigo-400 font-semibold">{batteryCapacity} mAh</span>
              </div>
              <input
                type="range"
                min={3000}
                max={6000}
                step={200}
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>3,000 mAh (小型機)</span>
                <span>5,000 mAh (標準)</span>
                <span>6,000 mAh (大容量)</span>
              </div>
            </div>

            {/* Screen On Time */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">1日の画面点灯時間 (SOT)</span>
                <span className="font-mono text-cyan-400 font-semibold">{screenOnHours} 時間</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={10.0}
                step={0.5}
                value={screenOnHours}
                onChange={(e) => setScreenOnHours(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1時間 (ライト利用)</span>
                <span>5時間 (平均)</span>
                <span>10時間 (ヘビー利用)</span>
              </div>
            </div>

            {/* Home Screen Visible Ratio */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">ホーム画面の滞在比率 (他アプリ非起動時)</span>
                <span className="font-mono text-emerald-400 font-semibold">{homeScreenPct}% ({stats.homeScreenHours}時間/日)</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={homeScreenPct}
                onChange={(e) => setHomeScreenPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                ※ 一般的なAndroidユーザーは画面使用時間の約10〜15%のみホーム画面に滞在し、残りはSNSやゲームなどの別アプリを利用します。
              </div>
            </div>

            {/* Video Settings: FPS & Resolution */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">フレームレート</label>
                <select
                  value={targetFps}
                  onChange={(e) => setTargetFps(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={15}>15 FPS (ウルトラ省電力)</option>
                  <option value={24}>24 FPS (シネマ調)</option>
                  <option value={30}>30 FPS (推奨バランス)</option>
                  <option value={60}>60 FPS (高負荷)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">動画解像度</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="720p">720p HD (軽量)</option>
                  <option value="1080p">1080p FHD (推奨)</option>
                  <option value="4k">4K UHD (高負荷注意)</option>
                </select>
              </div>
            </div>

            {/* Optimization Switches */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-200 font-medium">onVisibilityChanged 省電力フック</div>
                  <div className="text-[10px] text-slate-400">アプリ起動時に動画デコードを完全休止</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableVisibilityOpt}
                  onChange={(e) => setEnableVisibilityOpt(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-200 font-medium">音声デコーダー停止 (Mute)</div>
                  <div className="text-[10px] text-slate-400">AudioTrack DSPの電力消費を遮断</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableMute}
                  onChange={(e) => setEnableMute(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
                1日あたりの推定バッテリー消費量
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold font-mono text-emerald-400">
                  {stats.optimizedPct}%
                </span>
                <span className="text-xs text-slate-400">/ 24時間</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                今回の最適化を施した場合、1日中動かしてもわずか <strong>{stats.optimizedPct}%</strong> しかバッテリーを消費しません！
              </p>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    最適化あり (今回の設計)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{stats.optimizedPct}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Math.max(2, Number(stats.optimizedPct) * 3))}%` }}
                    className="h-full bg-emerald-500 rounded-full" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    最適化なし (一般的な粗悪実装)
                  </span>
                  <span className="font-mono text-rose-400 font-bold">{stats.unoptimizedPct}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${Math.min(100, Number(stats.unoptimizedPct) * 3)}%` }}
                    className="h-full bg-rose-500 rounded-full" 
                  />
                </div>
              </div>
            </div>

            {/* Battery Savings Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                <TrendingDown className="w-4 h-4" />
                <span>節約できるバッテリー量:</span>
              </div>
              <div className="text-xl font-bold font-mono text-white">
                約 {stats.savedMah} mAh <span className="text-xs font-normal text-slate-400">(-{stats.savedPct}%)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                スマートフォンが1日中持続する安心のスタミナ性能を確保できます。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
