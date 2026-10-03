import React from 'react';
import { 
  CheckCircle2, 
  HardDrive, 
  BatteryCharging, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  FileCode, 
  Power,
  VolumeX,
  Gauge,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Feasibility Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              結論: 完全に作成可能です (Android公式API準拠)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Android標準の <code className="text-indigo-300 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800">android.service.wallpaper.WallpaperService</code> を使用することで、端末内ストレージおよびSDカード内の動画（MP4 / WebM / MKV等）をホーム画面の背景として再生するアプリは完全に実現可能です。
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">SDカード & 内部ストレージ対応</div>
                  <div className="text-slate-400 mt-0.5">Storage Access Framework (SAF) による安全な永続アクセス</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">バッテリー極小化エンジン</div>
                  <div className="text-slate-400 mt-0.5">画面非表示時の即時休止（0W）と30fpsリミッターで通常アプリ以下の負荷</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SD Card & Storage Access Architecture */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">
            1. SDカード・内部ストレージの動画を扱う技術仕様
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">現代のAndroid (Android 10〜14+) の重要注意点:</span>
              <p className="text-amber-300/90 mt-0.5">
                従来の <code className="font-mono bg-amber-950 px-1 py-0.5 rounded">File("/sdcard/video.mp4")</code> のようなファイルパス指定は <strong>Scoped Storage（ストレージ分離）</strong> により原則ブロックされます。直接パスではなく、公式の <strong>Storage Access Framework (SAF)</strong> を使用する必要があります。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-900/80 border border-indigo-500/50 flex items-center justify-center text-xs font-mono text-indigo-300 shrink-0">
                1
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Intent.ACTION_OPEN_DOCUMENT による動画選択
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  システム標準のドキュメントピッカーを呼び出します。これにより、ユーザーは端末本体の「ダウンロード」フォルダだけでなく、挿入されているSDカード内のフォルダもシームレスにブラウズして動画を選択できます。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-900/80 border border-indigo-500/50 flex items-center justify-center text-xs font-mono text-indigo-300 shrink-0">
                2
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  【最重要】takePersistableUriPermission による権限の永続化
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  通常のファイル選択では、設定画面（Activity）を閉じた瞬間にファイルへのアクセス権が破棄されます。壁紙サービスが<strong>端末再起動後も動画を再生し続けるため</strong>には、以下のようにパーミッションを永続化します。
                </p>
                <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                  contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-900/80 border border-indigo-500/50 flex items-center justify-center text-xs font-mono text-indigo-300 shrink-0">
                3
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  SDカード取り出し時のフェールセーフ（フォールバック）
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  SDカードが物理的に抜かれたり破損した場合にアプリがクラッシュしないよう、<code className="text-indigo-300 font-mono">SecurityException</code> や <code className="text-indigo-300 font-mono">FileNotFoundException</code> をキャッチし、デフォルトの内蔵グラデーション壁紙にフォールバックする例外処理を組み込みます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Battery Optimization Strategies (8 Critical Pillars) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BatteryCharging className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            2. バッテリー消費を抑えるための8つの最適化戦略
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Rule 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">戦略 1</span>
              <span>onVisibilityChanged での即時停止 (最も重要)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ユーザーがブラウザやゲームなどの他アプリを開いた時、または画面をロックした時は <code className="text-emerald-300 font-mono">onVisibilityChanged(false)</code> が通知されます。ここで直ちに ExoPlayer を pause() することで、ホーム画面が見えていない間のCPU/GPU消費を<strong>完全なゼロ（0 mW）</strong>にします。
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">戦略 2</span>
              <span>SurfaceView 直結ハードウェアデコード</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              TextureView ではなく WallpaperService が提供するネイティブの <code className="text-cyan-300 font-mono">SurfaceHolder</code> に直接デコードフレームを転送します。AndroidのSurfaceFlingerが直接合成するため、View階層の描画オーバーヘッドがなく約25%電力を削減できます。
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/30">戦略 3</span>
              <span>音声トラックの完全休止 (DSPスタンバイ)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              動画ファイルに音声トラックが含まれていても、音量をゼロにするだけでなく、ExoPlayerの音声トラック選択を無効化（Mute）します。スマートフォンのオーディオDSP回路やオーディオミキサーの通電を遮断し、待機電力を排除します。
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-500/30">戦略 4</span>
              <span>フレームレート制限 (30fps / 24fps)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              近年のスマートフォンは90Hz/120Hzのリフレッシュレートに対応していますが、壁紙動画を60fps以上で回すとGPUが発熱します。30fpsまたは映画調の24fpsにクランプすることで、滑らかさを維持したままGPU演算量を半減させます。
            </p>
          </div>

          {/* Rule 5 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/30">戦略 5</span>
              <span>OS省電力モード / 低バッテリー連動</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <code className="text-rose-300 font-mono">PowerManager.isPowerSaveMode</code> や <code className="text-rose-300 font-mono">ACTION_BATTERY_LOW</code> (残量15%以下) を監視し、バッテリーがピンチの時は自動で動画を一時停止し、最初のフレームを静止画として描画してバッテリー切れを防ぎます。
            </p>
          </div>

          {/* Rule 6 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-purple-950 px-1.5 py-0.5 rounded border border-purple-500/30">戦略 6</span>
              <span>画面消灯ブロードキャスト (ACTION_SCREEN_OFF)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              端末の電源ボタンが押されて画面が消灯した際、WallpaperServiceのライフサイクル通知に加え、ScreenOffイベントを安全にリッスンして確実にプレイヤーをアイドル待機状態へ遷移させます。
            </p>
          </div>

          {/* Rule 7 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-blue-950 px-1.5 py-0.5 rounded border border-blue-500/30">戦略 7</span>
              <span>高解像度 (4K/60fps) 動画のクランプ</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              4K 60fpsなどの巨大な動画をSDカードからそのままデコードすると、メモリ帯域を圧迫し本体が温かくなります。スマホの画面解像度（FHD+など）に合わせてダウンサンプリングするか、推奨スペックを案内します。
            </p>
          </div>

          {/* Rule 8 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm mb-1.5">
              <span className="font-mono text-xs bg-teal-950 px-1.5 py-0.5 rounded border border-teal-500/30">戦略 8</span>
              <span>ジェスチャーによるダブルタップ手動一時停止</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <code className="text-teal-300 font-mono">Engine.onTouchEvent()</code> でホーム画面の空白部分のダブルタップを検出。ユーザーが作業中や集中したいときに、いつでもワンアクションで壁紙の動きをフリーズできるようにします。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
