import React, { useState } from 'react';
import { 
  Smartphone, 
  Cpu, 
  FileCode, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Rocket,
  Heart,
  Download,
  CheckCircle2,
  HelpCircle,
  BatteryCharging,
  Layers,
  Palette
} from 'lucide-react';
import { SimulatorState, LogEntry, VideoPreset } from './types/wallpaper';
import { SAMPLE_VIDEOS } from './data/sampleVideos';
import { PhoneSimulator } from './components/PhoneSimulator';
import { SimulatorControls } from './components/SimulatorControls';
import { CuteAppIconSection } from './components/CuteAppIconSection';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { CodeViewer } from './components/CodeViewer';
import { GitHubActionsGuide } from './components/GitHubActionsGuide';
import { FaqSection } from './components/FaqSection';

type ActiveTab = 'simulator' | 'icon' | 'download' | 'battery' | 'code';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  // Simulator State
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    currentVideoUrl: SAMPLE_VIDEOS[0].url,
    videoTitle: SAMPLE_VIDEOS[0].title,
    videoSourceType: 'internal',
    isPlaying: true,
    isAppObscuring: false,
    isScreenOff: false,
    isBatterySaver: false,
    batteryLevel: 92,
    isMuted: true,
    targetFps: 30,
    scaleMode: 'cover',
    enableDoubleTapPause: true,
    powerDrawWatts: 85,
    isHardwareAccelerated: true,
    autoPauseOnLowBattery: true,
  });

  const handleSelectPreset = (preset: VideoPreset) => {
    setSimulatorState((prev) => ({
      ...prev,
      currentVideoUrl: preset.url,
      videoTitle: preset.title,
      videoSourceType: 'internal'
    }));
  };

  const handleCustomVideoSelect = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setSimulatorState((prev) => ({
      ...prev,
      currentVideoUrl: objectUrl,
      videoTitle: file.name,
      videoSourceType: 'custom'
    }));
  };

  const handleTogglePlay = () => {
    setSimulatorState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleToggleAppObscure = (obscure?: boolean) => {
    setSimulatorState((prev) => ({
      ...prev,
      isAppObscuring: obscure !== undefined ? obscure : !prev.isAppObscuring
    }));
  };

  const handleToggleScreenOff = () => {
    setSimulatorState((prev) => ({
      ...prev,
      isScreenOff: !prev.isScreenOff
    }));
  };

  const handleDoubleTap = () => {
    setSimulatorState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-stone-800 flex flex-col font-['M_PLUS_Rounded_1c',sans-serif]">
      {/* 🌸 Cute Top Header */}
      <header className="border-b border-rose-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-rose-200/60 border-2 border-white ring-2 ring-rose-200/50">
                <img
                  src="/app-icon.jpg"
                  alt="動く動画壁紙 アプリアイコン"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-400 text-white flex items-center justify-center text-[9px] shadow-xs">
                💖
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-stone-900 tracking-tight">
                  動く動画壁紙
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  大人カワイイ設計
                </span>
              </div>
              <p className="text-xs text-stone-500">
                お気に入りの推し動画・ペット動画をホーム画面の動く壁紙に ✨
              </p>
            </div>
          </div>

          {/* Quick Action Badges / Release Download */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/chinta44/Android_Movie_Wallpaper/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm shadow-rose-200 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>完成したAPKをダウンロード</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* 🎀 Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto border-t border-rose-100/50 pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ときめき壁紙シミュレーター</span>
          </button>

          <button
            onClick={() => setActiveTab('icon')}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'icon'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>🎀 アプリアイコン設定</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'download'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>📦 APKダウンロード & 導入ガイド</span>
          </button>

          <button
            onClick={() => setActiveTab('battery')}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'battery'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50'
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>🔋 バッテリー安心のひみつ (0mW)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 px-3.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>💻 開発コード (Kotlin/XML)</span>
          </button>
        </div>
      </header>

      {/* 🌸 Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* TAB 1: SIMULATOR & CONTROLS */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            {/* Top Friendly Greeting Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50/60 to-amber-50/50 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-500">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" />
                  <span>スマホを自分だけの特別なお気に入りに</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                  画面をタップして、動く壁紙の心地よさを体験してみてね 🌸
                </h2>
                <p className="text-xs text-stone-500">
                  画面をすばやくトントン（2回タップ）すると一時停止！別のアプリを開けば動画が自動でスリープする安心設計です。
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('icon')}
                  className="px-4 py-2 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold shadow-xs transition"
                >
                  🎀 かわいいアイコンを見る
                </button>
                <a
                  href="https://github.com/chinta44/Android_Movie_Wallpaper/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs shadow-rose-200 transition"
                >
                  📱 スマホに入れる
                </a>
              </div>
            </div>

            {/* Simulator + Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Phone Simulator Frame */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <PhoneSimulator
                  state={simulatorState}
                  onTogglePlay={handleTogglePlay}
                  onToggleAppObscure={handleToggleAppObscure}
                  onToggleScreenOff={handleToggleScreenOff}
                  onDoubleTap={handleDoubleTap}
                />
              </div>

              {/* Right Column: Video & Comfort Controls */}
              <div className="lg:col-span-7 space-y-6">
                <SimulatorControls
                  state={simulatorState}
                  onChangeState={setSimulatorState}
                  onCustomVideoSelect={handleCustomVideoSelect}
                  onSelectPreset={handleSelectPreset}
                />

                {/* 3安心ポイント Card */}
                <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-500" />
                    <span>20代女子が嬉しい「3つの安心ポイント」</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100/80 space-y-1">
                      <div className="font-bold text-rose-900 flex items-center gap-1">
                        <span>🔋 充電が減らない</span>
                      </div>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        画面が消えたり他アプリ起動時は0.0mW完全スリープ！充電を気にせず使えます。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1">
                        <span>🔇 電車でも安心</span>
                      </div>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        音声は自動でミュート（無音）。オフィスや通学中にも音が鳴る心配ゼロ。
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-1">
                      <div className="font-bold text-purple-900 flex items-center gap-1">
                        <span>🎬 どんな動画もOK</span>
                      </div>
                      <p className="text-stone-500 text-[11px] leading-relaxed">
                        カメラで撮った動画や推しのライブ映像、TikTok動画もそのままセット可能！
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUTE APP ICON SECTION */}
        {activeTab === 'icon' && (
          <CuteAppIconSection />
        )}

        {/* TAB 3: APK DOWNLOAD & GITHUB SETUP GUIDE */}
        {activeTab === 'download' && (
          <div className="space-y-8">
            {/* Direct Download Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-pink-50 border border-rose-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-100/60 px-3 py-1 rounded-full">
                  <Rocket className="w-3.5 h-3.5" />
                  <span>ビルド完了済みのAPKを今すぐゲット！</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  💖 Android_Movie_Wallpaper APK ダウンロード
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
                  GitHub Actions によって自動ビルドされた最新のインストール用 <code className="bg-white px-2 py-0.5 rounded border border-rose-200 text-rose-700 font-mono">.apk</code> ファイルは、GitHub Releases ページで直接ダウンロードできます。
                </p>
              </div>

              <a
                href="https://github.com/chinta44/Android_Movie_Wallpaper/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-rose-200 transition-all hover:scale-[1.02] shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Releases ページを開く</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 3-Step Easy Install Guide for 20s Women */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-rose-500" />
                <span>スマホへ入れるカンタン3ステップ（誰でもできる！）</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-rose-400 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-stone-800">
                    スマホでAPKをダウンロード
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Androidスマホのブラウザで GitHub Releases を開き、<code className="text-rose-600 font-mono text-[11px]">.apk</code> ファイルをタップして保存します。
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-rose-400 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-stone-800">
                    インストールを許可して開く
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    通知またはダウンロード履歴からファイルを開き、「提供元不明のアプリのインストール」を許可してインストールします。
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/60 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-rose-400 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-stone-800">
                    好きな動画を選んで壁紙に！
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    アプリを開いて「📂 動画を選択」をタップ。好きな動画を選んだら「壁紙に設定」を押すだけで完了です！
                  </p>
                </div>
              </div>
            </div>

            {/* GitHub Actions Technical Pipeline */}
            <GitHubActionsGuide />
          </div>
        )}

        {/* TAB 4: BATTERY ARCHITECTURE GUIDE */}
        {activeTab === 'battery' && (
          <ArchitectureGuide />
        )}

        {/* TAB 5: SOURCE CODE & GRADLE CONFIG */}
        {activeTab === 'code' && (
          <CodeViewer />
        )}
      </main>

      {/* 🌸 Footer */}
      <footer className="border-t border-rose-100 bg-white/60 py-6 text-center text-xs text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
            <span>Android Movie Wallpaper - かわいい動く動画壁紙</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <a href="https://github.com/chinta44/Android_Movie_Wallpaper" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition">
              GitHub リポジトリ
            </a>
            <a href="https://github.com/chinta44/Android_Movie_Wallpaper/releases" target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition">
              Releases (.apk)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
