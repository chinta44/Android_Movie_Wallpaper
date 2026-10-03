import React, { useState } from 'react';
import { 
  Smartphone, 
  Cpu, 
  FileCode, 
  Calculator, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  HardDrive, 
  Layers, 
  Battery, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { SimulatorState, LogEntry, VideoPreset } from './types/wallpaper';
import { SAMPLE_VIDEOS } from './data/sampleVideos';
import { PhoneSimulator } from './components/PhoneSimulator';
import { SimulatorControls } from './components/SimulatorControls';
import { BatteryTelemetry } from './components/BatteryTelemetry';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { CodeViewer } from './components/CodeViewer';
import { BatteryCalculator } from './components/BatteryCalculator';
import { FaqSection } from './components/FaqSection';
import { GitHubActionsGuide } from './components/GitHubActionsGuide';

type ActiveTab = 'simulator' | 'architecture' | 'code' | 'github' | 'calculator' | 'faq';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  // Initial Simulator State
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    currentVideoUrl: SAMPLE_VIDEOS[0].url,
    videoTitle: SAMPLE_VIDEOS[0].title,
    videoSourceType: 'internal',
    isPlaying: true,
    isAppObscuring: false,
    isScreenOff: false,
    isBatterySaver: false,
    batteryLevel: 85,
    isMuted: true,
    targetFps: 30,
    scaleMode: 'cover',
    enableDoubleTapPause: true,
    powerDrawWatts: 90,
    isHardwareAccelerated: true,
    autoPauseOnLowBattery: true,
  });

  // Real-time Android Logcat stream
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '09:41:00.102',
      tag: 'VideoWallpaperService',
      level: 'I',
      message: 'onCreateEngine() -> Initializing VideoWallpaperEngine'
    },
    {
      id: 'log-2',
      timestamp: '09:41:00.125',
      tag: 'StoragePickerHelper',
      level: 'I',
      message: 'takePersistableUriPermission granted for content://media/external/video'
    },
    {
      id: 'log-3',
      timestamp: '09:41:00.210',
      tag: 'ExoPlayer',
      level: 'D',
      message: 'Hardware Surface created. SurfaceView hardware accelerated pipeline ready.'
    },
    {
      id: 'log-4',
      timestamp: '09:41:00.245',
      tag: 'AudioTrack',
      level: 'I',
      message: 'Audio output muted. Audio DSP hardware entered standby (0 mW).'
    }
  ]);

  const addLog = (tag: string, level: 'D' | 'I' | 'W' | 'E', message: string) => {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const newEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: ts,
      tag,
      level,
      message
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 50)]);
  };

  const handleSelectPreset = (preset: VideoPreset) => {
    setSimulatorState((prev) => ({
      ...prev,
      currentVideoUrl: preset.url,
      videoTitle: preset.title,
      videoSourceType: 'internal'
    }));
    addLog('VideoWallpaperEngine', 'I', `Video source updated: ${preset.title} (${preset.fps}fps / ${preset.resolution})`);
  };

  const handleCustomVideoSelect = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setSimulatorState((prev) => ({
      ...prev,
      currentVideoUrl: objectUrl,
      videoTitle: file.name,
      videoSourceType: 'custom'
    }));
    addLog('StoragePickerHelper', 'I', `Custom file loaded from device/SD: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
    addLog('SAF', 'D', 'contentResolver.takePersistableUriPermission() persisted for reboot resistance');
  };

  const handleTogglePlay = () => {
    setSimulatorState((prev) => {
      const next = !prev.isPlaying;
      addLog('VideoWallpaperEngine', 'D', next ? 'Manual resume: ExoPlayer.play()' : 'Manual pause: ExoPlayer.pause()');
      return { ...prev, isPlaying: next };
    });
  };

  const handleToggleAppObscure = (obscure?: boolean) => {
    setSimulatorState((prev) => {
      const next = obscure !== undefined ? obscure : !prev.isAppObscuring;
      if (next) {
        addLog('VideoWallpaperEngine', 'W', '⚠️ onVisibilityChanged(false) -> App opened in foreground. ExoPlayer.pause() triggered. Current Draw: 0 mW');
      } else {
        addLog('VideoWallpaperEngine', 'I', 'onVisibilityChanged(true) -> Returning to home screen. ExoPlayer.play() resumed.');
      }
      return { ...prev, isAppObscuring: next };
    });
  };

  const handleToggleScreenOff = () => {
    setSimulatorState((prev) => {
      const next = !prev.isScreenOff;
      if (next) {
        addLog('PowerManager', 'W', 'ACTION_SCREEN_OFF received -> Screen turned off. Full decoder shutdown. Power: 0.0 mW');
      } else {
        addLog('PowerManager', 'I', 'ACTION_SCREEN_ON received -> Screen unlocked. Surface recreated.');
      }
      return { ...prev, isScreenOff: next };
    });
  };

  const handleDoubleTap = () => {
    setSimulatorState((prev) => {
      const next = !prev.isPlaying;
      addLog('GestureDetector', 'I', `Double tap gesture detected on home screen -> togglePlayPause(${next})`);
      return { ...prev, isPlaying: next };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  Android 動画ライブ壁紙 作成ガイド & 省電力シミュレーター
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  実現可能性: 100%可能
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SDカード・内蔵動画の再生仕様 & バッテリー消費を極小化するエンジニアリング設計
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span>SAF永続権限対応</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>非表示時 0mW 休止</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/40 pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>動作シミュレーター & テレメトリ</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>技術解説 & 8つの省電力戦略</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>完全実装コード (Kotlin / XML)</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 font-semibold'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>🚀 GitHubでAPK自動作成 (Studio不要)</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>バッテリー消費シミュレーション</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`py-2 px-3.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>実装Q&A / トラブル対策</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'simulator' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Phone Screen Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneSimulator
                state={simulatorState}
                onTogglePlay={handleTogglePlay}
                onToggleAppObscure={handleToggleAppObscure}
                onToggleScreenOff={handleToggleScreenOff}
                onDoubleTap={handleDoubleTap}
              />
            </div>

            {/* Controls & Telemetry Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Answer Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">作成可能です！</span> Androidの公式APIである <code className="text-emerald-300 font-mono">WallpaperService</code> と <strong>Storage Access Framework (SAF)</strong> を組み合わせることで、SDカード内の動画も安全に永続設定できます。下のスイッチで実機のライフサイクルをシミュレートできます。
                </div>
              </div>

              {/* Real-time Telemetry Gauge */}
              <BatteryTelemetry
                state={simulatorState}
                logs={logs}
                onClearLogs={() => setLogs([])}
              />

              {/* Simulator Controls & Video Selectors */}
              <SimulatorControls
                state={simulatorState}
                onChangeState={setSimulatorState}
                onCustomVideoSelect={handleCustomVideoSelect}
                onSelectPreset={handleSelectPreset}
              />
            </div>
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureGuide />}

        {activeTab === 'code' && <CodeViewer />}

        {activeTab === 'github' && <GitHubActionsGuide />}

        {activeTab === 'calculator' && <BatteryCalculator />}

        {activeTab === 'faq' && <FaqSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Android Live Wallpaper Engine & Battery Optimization Guide</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Android 14 (API 34) 準拠</span>
            <span>·</span>
            <span>Media3 ExoPlayer</span>
            <span>·</span>
            <span>Scoped Storage & SAF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
