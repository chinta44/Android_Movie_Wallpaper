import React, { useRef, useEffect, useState } from 'react';
import { 
  Wifi, 
  Battery, 
  BatteryCharging, 
  Signal, 
  Search, 
  Camera, 
  Phone, 
  MessageSquare, 
  Image as ImageIcon, 
  Youtube, 
  Settings as SettingsIcon,
  X, 
  Pause, 
  Play, 
  VolumeX, 
  Volume2, 
  Sparkles,
  Heart,
  Eye,
  EyeOff,
  Moon,
  Clock,
  Music
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
  const [showHeartPopup, setShowHeartPopup] = useState(false);
  const [heartMessage, setHeartMessage] = useState('一時停止');
  const [isLockScreen, setIsLockScreen] = useState(false);

  // Sync clock
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

  // Video play/pause logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = state.isPlaying && !state.isAppObscuring && !state.isScreenOff;
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [state.isPlaying, state.isAppObscuring, state.isScreenOff]);

  // Mute logic
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = state.isMuted;
    }
  }, [state.isMuted]);

  // Fallback canvas drawing (aesthetic pastel starry animation)
  useEffect(() => {
    if (!videoError) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      if (!state.isPlaying || state.isAppObscuring || state.isScreenOff) {
        animId = requestAnimationFrame(render);
        return;
      }
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Romantic twilight pastel gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#fbcfe8'); // rose-200
      grad.addColorStop(0.4, '#e9d5ff'); // purple-200
      grad.addColorStop(0.7, '#fed7aa'); // orange-200
      grad.addColorStop(1, '#fde68a'); // amber-200
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stars / sparkles
      for (let i = 0; i < 25; i++) {
        const x = (Math.sin(i * 99 + t * 0.5) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 33 + t * 0.3) * 0.5 + 0.5) * h;
        const r = Math.sin(t * 2 + i) * 1.5 + 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [videoError, state.isPlaying, state.isAppObscuring, state.isScreenOff]);

  // Handle double tap
  const handleScreenClick = () => {
    const now = Date.now();
    if (now - lastTapTime < 350) {
      // Double tap detected
      onDoubleTap();
      setHeartMessage(state.isPlaying ? 'トントン 一時停止 ⏸️' : 'トントン 再開 💖');
      setShowHeartPopup(true);
      setTimeout(() => setShowHeartPopup(false), 1200);
      setLastTapTime(0);
    } else {
      setLastTapTime(now);
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Phone Body Frame */}
      <div className="relative w-[300px] sm:w-[320px] h-[620px] sm:h-[650px] bg-stone-900 rounded-[50px] p-[10px] shadow-2xl shadow-rose-200/50 border-[4px] border-rose-100/80 ring-1 ring-stone-900/10">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-900 rounded-full z-40 flex items-center justify-between px-3 border border-stone-800">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-950 border border-stone-800"></div>
          <div className="w-2 h-2 rounded-full bg-rose-500/80 animate-pulse"></div>
        </div>

        {/* Screen Bezel inner */}
        <div 
          onClick={handleScreenClick}
          className="relative w-full h-full rounded-[40px] overflow-hidden bg-stone-950 cursor-pointer"
        >
          {/* Wallpaper Video Layer */}
          <div className="absolute inset-0 z-0">
            <video
              ref={videoRef}
              src={state.currentVideoUrl}
              loop
              playsInline
              muted={state.isMuted}
              poster="/wallpaper-preview.jpg"
              onError={() => setVideoError(true)}
              onLoadedData={() => setVideoError(false)}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                state.scaleMode === 'contain' ? 'object-contain' : 'object-cover'
              }`}
            />
            {videoError && (
              <canvas
                ref={canvasRef}
                width={320}
                height={650}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Double Tap Heart Feedback Overlay */}
          {showHeartPopup && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in zoom-in duration-200">
              <div className="p-4 rounded-3xl bg-white/95 text-stone-800 shadow-xl flex flex-col items-center gap-2 border border-rose-100">
                <Heart className="w-10 h-10 fill-rose-500 text-rose-500 animate-bounce" />
                <span className="text-xs font-bold text-rose-600">{heartMessage}</span>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="relative z-20 flex items-center justify-between px-6 pt-3 text-white text-[11px] font-medium drop-shadow-md">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span>{state.batteryLevel}%</span>
                {state.isBatterySaver ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Battery className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>

          {/* LOCKSCREEN MODE */}
          {isLockScreen && !state.isAppObscuring && !state.isScreenOff && (
            <div className="relative z-10 h-[calc(100%-40px)] flex flex-col justify-between p-6 text-white text-center">
              <div className="pt-10 space-y-1">
                <div className="text-xs font-medium tracking-wide text-white/90 drop-shadow">
                  {currentDate}
                </div>
                <div className="text-6xl font-light tracking-tight drop-shadow-lg font-sans">
                  {currentTime}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] mt-2 drop-shadow">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span>今日も素敵な一日に ✨</span>
                </div>
              </div>

              {/* Music Widget */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-left shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-400/80 flex items-center justify-center shrink-0 shadow-sm">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">Aesthetic Twilight BGM</div>
                    <div className="text-[10px] text-white/70">動く壁紙 再生中</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>
              </div>

              <div className="text-[10px] text-white/70 pb-2">
                ↑ スワイプしてロック解除
              </div>
            </div>
          )}

          {/* HOMESCREEN MODE */}
          {!isLockScreen && !state.isAppObscuring && !state.isScreenOff && (
            <div className="relative z-10 h-[calc(100%-40px)] flex flex-col justify-between p-4 text-white">
              {/* Cute Weather / Date Widget */}
              <div className="pt-2 px-1">
                <div className="bg-white/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-white/80 font-medium">{currentDate}</div>
                      <div className="text-2xl font-bold tracking-tight">{currentTime}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl">🌸 22°C</div>
                      <div className="text-[10px] text-white/80">晴れ・心地よい風</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cute App Grid */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 px-2 text-center">
                {/* Our App with Cute Icon */}
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/60 bg-white transform group-hover:scale-105 transition">
                    <img src="/app-icon.jpg" alt="動く壁紙" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow truncate w-full">動画壁紙</span>
                </div>

                {/* Instagram */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg border border-white/30">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow">Instagram</span>
                </div>

                {/* LINE / Chat */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg border border-white/30">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow">LINE</span>
                </div>

                {/* Photos */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-amber-300 flex items-center justify-center text-white shadow-lg border border-white/30">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow">写真</span>
                </div>

                {/* YouTube */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg border border-white/30">
                    <Youtube className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow">YouTube</span>
                </div>

                {/* Settings */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-2xl bg-stone-700/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30">
                    <SettingsIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-white drop-shadow">設定</span>
                </div>
              </div>

              {/* Bottom Dock Bar */}
              <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-2.5 mx-1 border border-white/30 flex items-center justify-around shadow-xl">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-11 h-11 rounded-2xl bg-rose-400 flex items-center justify-center text-white shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="w-11 h-11 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-sm">
                  <Search className="w-5 h-5" />
                </div>
                <div className="w-11 h-11 rounded-2xl bg-stone-800 flex items-center justify-center text-white shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* FOREGROUND APP SIMULATION (0mW PAUSE PROOF) */}
          {state.isAppObscuring && (
            <div className="absolute inset-0 z-30 bg-white flex flex-col justify-between animate-in fade-in duration-300">
              {/* App Topbar */}
              <div className="p-4 border-b border-stone-100 flex items-center justify-between pt-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-400 flex items-center justify-center text-white text-xs font-bold">
                    S
                  </div>
                  <span className="font-bold text-xs text-stone-800">SNSアプリを開き中</span>
                </div>
                <button
                  onClick={() => onToggleAppObscure(false)}
                  className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* App Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <BatteryCharging className="w-7 h-7" />
                </div>
                <div className="font-bold text-sm text-stone-800">
                  壁紙動画はピタッと完全停止中！
                </div>
                <p className="text-xs text-stone-500 max-w-[220px] leading-relaxed">
                  別のアプリを使っている間は、動画再生が0mW休止し、バッテリー消費が完全にゼロになります。
                </p>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span>電力消費: 0.0 mW (安全)</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-3 border-t border-stone-100 text-center">
                <button
                  onClick={() => onToggleAppObscure(false)}
                  className="w-full py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
                >
                  ホーム画面に戻る（再生再開）
                </button>
              </div>
            </div>
          )}

          {/* SCREEN OFF (SLEEP) SIMULATION */}
          {state.isScreenOff && (
            <div 
              onClick={onToggleScreenOff}
              className="absolute inset-0 z-30 bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-400 text-center cursor-pointer animate-in fade-in"
            >
              <Moon className="w-10 h-10 text-rose-300 mb-3 animate-pulse" />
              <div className="text-sm font-bold text-white">画面スリープ中</div>
              <div className="text-xs text-stone-500 mt-1">動画デコーダー完全休止中 (0mW)</div>
              <div className="mt-4 text-[11px] px-3 py-1.5 rounded-full bg-stone-900 text-rose-300 border border-stone-800">
                タップして画面点灯
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quick Bar Under Phone */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-sm">
        <button
          onClick={() => setIsLockScreen(!isLockScreen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isLockScreen 
              ? 'bg-rose-500 text-white shadow-sm' 
              : 'bg-white text-stone-600 border border-rose-100 hover:bg-rose-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isLockScreen ? 'ホーム画面へ' : 'ロック画面へ'}</span>
        </button>

        <button
          onClick={() => onToggleAppObscure()}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            state.isAppObscuring
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-rose-100 hover:bg-rose-50'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>{state.isAppObscuring ? 'ホームに戻る' : '別アプリを開く(0mW検証)'}</span>
        </button>

        <button
          onClick={onToggleScreenOff}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            state.isScreenOff
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-rose-100 hover:bg-rose-50'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>{state.isScreenOff ? '画面点灯' : '画面OFF'}</span>
        </button>

        <button
          onClick={onTogglePlay}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-stone-600 border border-rose-100 hover:bg-rose-50 flex items-center gap-1.5"
        >
          {state.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{state.isPlaying ? '一時停止' : '再生'}</span>
        </button>
      </div>

      <div className="mt-2 text-[11px] text-stone-400 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-rose-400" />
        <span>画面をすばやく2回タップするとトントン一時停止できます</span>
      </div>
    </div>
  );
};
