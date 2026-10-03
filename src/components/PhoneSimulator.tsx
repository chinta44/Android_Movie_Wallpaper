import React, { useRef, useEffect, useState } from 'react';
import { 
  Wifi, 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  Signal, 
  Search, 
  Mic, 
  Camera, 
  Phone, 
  MessageSquare, 
  Compass, 
  Image as ImageIcon, 
  Youtube, 
  Folder, 
  Settings as SettingsIcon,
  X, 
  Pause, 
  Play, 
  VolumeX, 
  Volume2, 
  Zap, 
  AlertCircle,
  EyeOff
} from 'lucide-react';
import { SimulatorState } from '../types/wallpaper';

interface PhoneSimulatorProps {
  state: SimulatorState;
  onTogglePlay: () => void;
  onToggleAppObscure: (obscure?: boolean) => void;
  onToggleScreenOff: () => void;
  onDoubleTap: () => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  state,
  onTogglePlay,
  onToggleAppObscure,
  onToggleScreenOff,
  onDoubleTap
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('10月3日 (土)');
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showTapHint, setShowTapHint] = useState(false);

  // Sync clock with real time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = ['日', '月', '火', '水', '木', '金', '土'];
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const day = days[now.getDay()];
      setCurrentDate(`${month}月${date}日 (${day})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Control video play/pause based on lifecycle states (onVisibilityChanged, screen off, app obscuring)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = state.isPlaying && !state.isAppObscuring && !state.isScreenOff && (!state.isBatterySaver || !state.autoPauseOnLowBattery);

    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay may be blocked if unmuted or error
      });
    } else {
      video.pause();
    }
  }, [state.isPlaying, state.isAppObscuring, state.isScreenOff, state.isBatterySaver, state.autoPauseOnLowBattery]);

  // Handle Mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = state.isMuted;
    }
  }, [state.isMuted]);

  // Handle Fallback Canvas Animation when video cannot load or offline
  useEffect(() => {
    if (!videoError) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      if (state.isScreenOff || state.isAppObscuring || !state.isPlaying) {
        animId = requestAnimationFrame(render);
        return;
      }
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Draw aesthetic procedural animated wallpaper
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Gradient waves
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#311042');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Cyber glowing orbs
      for (let i = 0; i < 3; i++) {
        const cx = w * 0.5 + Math.sin(frame * 0.02 + i * 2) * (w * 0.3);
        const cy = h * 0.4 + Math.cos(frame * 0.015 + i * 2) * (h * 0.25);
        const rad = 140 + Math.sin(frame * 0.03 + i) * 30;
        const orbGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, rad);
        orbGrad.addColorStop(0, i === 0 ? 'rgba(99, 102, 241, 0.4)' : i === 1 ? 'rgba(236, 72, 153, 0.35)' : 'rgba(16, 185, 129, 0.3)');
        orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [videoError, state.isPlaying, state.isAppObscuring, state.isScreenOff]);

  const handleScreenClick = () => {
    if (!state.enableDoubleTapPause) return;
    const now = Date.now();
    if (now - lastTapTime < 350) {
      // Double tap detected!
      onDoubleTap();
      setShowTapHint(true);
      setTimeout(() => setShowTapHint(false), 1200);
      setLastTapTime(0);
    } else {
      setLastTapTime(now);
    }
  };

  const isActuallyRunning = state.isPlaying && !state.isAppObscuring && !state.isScreenOff && !(state.isBatterySaver && state.autoPauseOnLowBattery);

  return (
    <div className="relative flex flex-col items-center">
      {/* Phone Hardware Mockup */}
      <div className="relative w-[340px] sm:w-[370px] h-[720px] bg-slate-900 rounded-[52px] p-3 shadow-2xl shadow-indigo-950/40 border-[7px] border-slate-800 ring-1 ring-white/10 select-none overflow-hidden transition-all">
        
        {/* Antenna bands / subtle metallic sheen */}
        <div className="absolute top-16 -left-[7px] w-[3px] h-10 bg-slate-700/60 rounded-r" />
        <div className="absolute top-32 -right-[7px] w-[3px] h-14 bg-slate-700/60 rounded-l" />
        <div className="absolute top-52 -right-[7px] w-[3px] h-14 bg-slate-700/60 rounded-l" />

        {/* Screen Bezel Container */}
        <div 
          onClick={handleScreenClick}
          className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex flex-col justify-between cursor-pointer"
        >
          {/* CAMERA PUNCH HOLE */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 w-4 h-4 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900/90 ring-1 ring-blue-900/30" />
          </div>

          {/* STATUS BAR */}
          <div className="relative z-30 flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium tracking-tight text-white/90">
            <span className="font-semibold">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              {state.isBatterySaver && (
                <span className="flex items-center text-amber-400 font-semibold text-[10px] bg-amber-500/20 px-1 rounded">
                  <Zap className="w-2.5 h-2.5 mr-0.5 fill-amber-400" />
                  省電力
                </span>
              )}
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">{state.batteryLevel}%</span>
                {state.batteryLevel <= 20 ? (
                  <BatteryLow className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-white/90" />
                )}
              </div>
            </div>
          </div>

          {/* BACKGROUND VIDEO WALLPAPER (WallpaperService.Engine surface) */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {!videoError ? (
              <video
                ref={videoRef}
                src={state.currentVideoUrl}
                loop
                playsInline
                muted={state.isMuted}
                onError={() => setVideoError(true)}
                onLoadedData={() => setVideoError(false)}
                className={`w-full h-full object-${state.scaleMode} transition-opacity duration-300 ${
                  state.isScreenOff ? 'opacity-0' : 'opacity-100'
                }`}
              />
            ) : (
              <canvas
                ref={canvasRef}
                width={360}
                height={720}
                className="w-full h-full object-cover"
              />
            )}

            {/* Video overlay shade for readability of Android widgets */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
          </div>

          {/* HOME SCREEN CONTENT (WIDGETS & ICONS) */}
          <div className={`relative z-10 flex flex-col justify-between h-full pt-1 pb-3 px-4 transition-all duration-300 ${
            state.isScreenOff ? 'opacity-0' : 'opacity-100'
          }`}>
            
            {/* Top Widgets: Clock & Date */}
            <div className="mt-4 text-center">
              <div className="text-5xl font-light tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {currentTime}
              </div>
              <div className="text-xs font-medium text-white/90 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {currentDate}
              </div>
            </div>

            {/* Google Search Bar Widget */}
            <div className="mt-4 mx-1 px-4 py-2.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/15 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 text-white/80">
                <Search className="w-4 h-4 text-white/70" />
                <span className="text-xs text-white/60">Googleで検索</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/80">
                <Mic className="w-3.5 h-3.5 hover:text-white" />
                <Camera className="w-3.5 h-3.5 hover:text-white" />
              </div>
            </div>

            {/* Tap Hint Toast Notification */}
            {showTapHint && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs font-medium animate-fade-in shadow-xl flex items-center gap-1.5">
                {state.isPlaying ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span>{state.isPlaying ? '再生中 (ダブルタップ)' : '一時停止中 (ダブルタップ)'}</span>
              </div>
            )}

            {/* App Grid */}
            <div className="mt-auto mb-4 grid grid-cols-4 gap-y-4 gap-x-2 text-center">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleAppObscure(true); }}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="タップしてアプリ起動 (onVisibilityChanged検証)"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20 group-hover:ring-white/40">
                  <Youtube className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate w-full">
                  YouTube
                </span>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); onToggleAppObscure(true); }}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                title="タップしてChrome起動 (onVisibilityChanged検証)"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white ring-1 ring-white/20 group-hover:ring-white/40">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate w-full">
                  Chrome
                </span>
              </button>

              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate w-full">
                  ギャラリー
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                  <Folder className="w-6 h-6" />
                </div>
                <span className="text-[10px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate w-full">
                  ファイル
                </span>
              </div>
            </div>

            {/* Bottom App Dock */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-around px-2">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                <Phone className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                <Compass className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-500 shadow-md flex items-center justify-center text-white ring-1 ring-white/20">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            {/* Gesture Navigation Bar */}
            <div className="pt-2 flex justify-center">
              <div className="w-24 h-1 bg-white/70 rounded-full" />
            </div>
          </div>

          {/* SIMULATED OPEN APP OVERLAY (Triggered when user opens YouTube or other app) */}
          {state.isAppObscuring && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col animate-slide-up"
            >
              {/* Fake App Header */}
              <div className="pt-8 px-4 pb-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">YouTube (別アプリが起動中)</span>
                </div>
                <button
                  onClick={() => onToggleAppObscure(false)}
                  className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                  title="ホームに戻る"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* App Content & Explanation */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
                  <div className="font-semibold flex items-center gap-1.5 text-emerald-300 text-xs mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    onVisibilityChanged(false) が正常に発火！
                  </div>
                  ホーム画面が完全に覆われたため、バックグラウンドの動画デコーダーは直ちに一時停止されました。CPU/GPU消費は<strong>0 mW</strong>です。
                </div>

                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-200">OS内部の動作状況:</div>
                  <div className="font-mono text-[10px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                    VideoWallpaperService: onVisibilityChanged(false)<br/>
                    └─ ExoPlayer.pause()<br/>
                    └─ MediaCodec: RELEASE_BUFFERS<br/>
                    └─ Power Drain: 0.0 mA (省電力状態)
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => onToggleAppObscure(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-xs shadow-lg transition-colors"
                  >
                    ホーム画面に戻る（動画再生を再開）
                  </button>
                </div>
              </div>

              {/* Gesture bar */}
              <div className="pb-2 flex justify-center bg-slate-900">
                <div className="w-24 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          )}

          {/* SCREEN OFF / LOCK OVERLAY */}
          {state.isScreenOff && (
            <div 
              onClick={(e) => { e.stopPropagation(); onToggleScreenOff(); }}
              className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center select-none"
            >
              <div className="text-4xl font-extralight text-slate-500 tracking-wider">
                {currentTime}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                画面ロック中（タップで点灯）
              </div>
              <div className="mt-8 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-mono">
                GPU/Decoder: SHUTDOWN (0.0 W)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Under Phone Live Status Pill */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono">
        <span className="text-slate-400">レンダリング状態:</span>
        {isActuallyRunning ? (
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            再生稼働中 ({state.targetFps} fps / HW加速)
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {state.isScreenOff 
              ? '画面OFF (完全停止 0mW)' 
              : state.isAppObscuring 
              ? 'アプリ前面 (デコーダー休止 0mW)' 
              : '省電力停止中'}
          </span>
        )}
      </div>
    </div>
  );
};
