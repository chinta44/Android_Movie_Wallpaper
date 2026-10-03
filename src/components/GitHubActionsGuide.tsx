import React, { useState } from 'react';
import { 
  Rocket, 
  GitBranch, 
  Tag, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  
  FolderTree, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink,
  Smartphone,
  Cpu,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { ANDROID_CODE_FILES } from '../data/androidCodeSnippets';
import { GitHubDirectUploader } from './GitHubDirectUploader';

export const GitHubActionsGuide: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [simulatedReleaseCreated, setSimulatedReleaseCreated] = useState(false);
  const [copiedYml, setCopiedYml] = useState(false);

  const workflowFile = ANDROID_CODE_FILES.find(f => f.filename === 'build-apk.yml');

  const startPipelineSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedReleaseCreated(false);
    setPipelineStep(1);

    setTimeout(() => setPipelineStep(2), 900);
    setTimeout(() => setPipelineStep(3), 2000);
    setTimeout(() => setPipelineStep(4), 3200);
    setTimeout(() => {
      setPipelineStep(5);
      setIsSimulating(false);
      setSimulatedReleaseCreated(true);
    }, 4200);
  };

  const copyWorkflow = () => {
    if (workflowFile) {
      navigator.clipboard.writeText(workflowFile.code);
      setCopiedYml(true);
      setTimeout(() => setCopiedYml(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Header Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 shadow-inner">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xl font-bold text-white">
                結論: Android Studio不要で、GitHubから直接APKを自動生成・Release登録できます！
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              <strong>GitHub Actions (無料CI/CD)</strong> を利用すれば、重たいAndroid Studioをご自身のPCにインストールする必要はありません。GitHub上にソースコードをプッシュするだけで、クラウド上のLinux仮想マシンが自動でAndroid SDKとGradleを起動し、コンパイル・APK作成から<strong>GitHub Releasesへの配布用ファイル登録</strong>まで全自動で完了します。
            </p>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">PCの環境構築ゼロ</div>
                  <div className="text-slate-400 mt-0.5">ギガ単位のAndroid SDKインストール不要</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">全自動Release登録</div>
                  <div className="text-slate-400 mt-0.5">タグ付けやWeb上のボタン1つでAPK公開</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">完全無料で利用可能</div>
                  <div className="text-slate-400 mt-0.5">Publicリポジトリなら実行時間無制限</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Direct GitHub Uploader Tool */}
      <GitHubDirectUploader />

      {/* 3. Interactive Pipeline Runner Simulation */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                GitHub Actions クラウドビルド・パイプライン シミュレーター
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              「ビルド開始」を押して、GitHubクラウド上でどのようにAPKが生成されていくか体験できます。
            </p>
          </div>

          <button
            onClick={startPipelineSimulation}
            disabled={isSimulating}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/40'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>クラウドでビルド中...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run workflow (ビルド開始)</span>
              </>
            )}
          </button>
        </div>

        {/* Pipeline Visual Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          {/* Step 1 */}
          <div className={`p-3 rounded-xl border transition-all ${
            pipelineStep >= 1
              ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400">Step 1</span>
              {pipelineStep > 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : pipelineStep === 1 ? (
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              ) : null}
            </div>
            <div className="font-semibold text-white">Git Checkout</div>
            <div className="text-[10px] text-slate-400 mt-0.5">コードを取得</div>
          </div>

          {/* Step 2 */}
          <div className={`p-3 rounded-xl border transition-all ${
            pipelineStep >= 2
              ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400">Step 2</span>
              {pipelineStep > 2 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : pipelineStep === 2 ? (
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              ) : null}
            </div>
            <div className="font-semibold text-white">JDK 17 Setup</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Java環境構成</div>
          </div>

          {/* Step 3 */}
          <div className={`p-3 rounded-xl border transition-all ${
            pipelineStep >= 3
              ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400">Step 3</span>
              {pipelineStep > 3 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : pipelineStep === 3 ? (
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              ) : null}
            </div>
            <div className="font-semibold text-white">./gradlew assemble</div>
            <div className="text-[10px] text-slate-400 mt-0.5">APKコンパイル</div>
          </div>

          {/* Step 4 */}
          <div className={`p-3 rounded-xl border transition-all ${
            pipelineStep >= 4
              ? 'bg-slate-950 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400">Step 4</span>
              {pipelineStep >= 4 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : null}
            </div>
            <div className="font-semibold text-white">GitHub Release</div>
            <div className="text-[10px] text-slate-400 mt-0.5">APK配布ページ作成</div>
          </div>
        </div>

        {/* Simulated Release Outcome */}
        {simulatedReleaseCreated && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                    Latest Release
                  </span>
                  <span className="font-bold text-white text-sm">Android_Movie_Wallpaper v1.0.0</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  GitHub Releases への登録が完了しました！AssetsからAPKを直接端末へダウンロードできます。
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#download-sample"
                  onClick={(e) => {
                    e.preventDefault();
                    const dummyBlob = new Blob(['Simulated Android_Movie_Wallpaper APK binary'], { type: 'application/vnd.android.package-archive' });
                    const url = URL.createObjectURL(dummyBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Android-Movie-wallpaper-v1.0.0.apk';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>app-release.apk をダウンロード</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Step-by-Step Practical Implementation Guide */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">
            ゼロから始める 5ステップ実践ガイド
          </h3>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-white">
                GitHubで新規リポジトリを作成
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub（github.com）で「New repository」をクリックし、リポジトリ名（例: <code className="text-indigo-300 font-mono bg-slate-950 px-1 py-0.5 rounded">android-video-wallpaper</code>）を入力して作成します。PublicにするとGitHub Actionsの実行時間が完全無料になります。
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              2
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-semibold text-white">
                ソースコードを配置（ブラウザからドラッグ＆ドロップでもOK）
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Android Studioは使わなくて構いません。GitHubのWeb画面上の「Upload files」からでも、以下のディレクトリ構成の通りにファイルを配置するだけで完了します。
              </p>

              {/* Directory Tree Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-0.5">
                <div className="text-indigo-400 font-bold">your-repository/</div>
                <div>├── <span className="text-emerald-400 font-semibold">.github/workflows/build-apk.yml</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← 【最重要】ビルド定義</div>
                <div>├── <span className="text-cyan-400">app/</span></div>
                <div>│&nbsp;&nbsp; ├── <span className="text-cyan-400">src/main/</span></div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; ├── <span className="text-slate-300">AndroidManifest.xml</span></div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; ├── <span className="text-cyan-400">java/com/example/videowallpaper/</span></div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; │&nbsp;&nbsp; ├── VideoWallpaperService.kt</div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; │&nbsp;&nbsp; ├── StoragePickerHelper.kt</div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; │&nbsp;&nbsp; └── BatteryOptimizationManager.kt</div>
                <div>│&nbsp;&nbsp; │&nbsp;&nbsp; └── <span className="text-cyan-400">res/xml/</span>wallpaper.xml</div>
                <div>│&nbsp;&nbsp; └── build.gradle.kts</div>
                <div>├── gradlew &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Gradle起動スクリプト</div>
                <div>└── settings.gradle.kts</div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-white">
                GitHub Actions のワークフロー権限を有効化
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHubリポジトリの <strong>Settings → Actions → General → Workflow permissions</strong> に進み、<code className="text-emerald-400 font-mono">Read and write permissions</code> にチェックを入れて「Save」します（Releasesにファイルを自動アップロードするために必要な設定です）。
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-white">
                ビルドの実行（ボタン1発 or Gitタグ）
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                以下の2つのいずれかの方法でビルドが即座に始まります：
              </p>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-2">
                <li><strong>ブラウザから実行:</strong> GitHubリポジトリの「Actions」タブを開き、「Build & Release APK」を選んで <strong>Run workflow</strong> をクリック。</li>
                <li><strong>Gitタグで実行:</strong> <code className="font-mono text-cyan-400">git tag v1.0.0 & git push origin v1.0.0</code> を実行すると自動検知。</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              5
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-semibold text-white">
                GitHub Releases からスマホでAPKをダウンロード！
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                約2〜3分でビルドが終わり、リポジトリの <strong>Releases</strong> ページに <code className="text-emerald-400 font-mono">app-debug.apk</code> が自動生成されます。スマホのブラウザでアクセスしてタップするだけでインストール可能です。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Workflow File Code Display */}
      {workflowFile && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
            <div>
              <div className="font-mono text-xs font-semibold text-white">
                .github/workflows/build-apk.yml
              </div>
              <div className="text-[11px] text-slate-400">
                リポジトリの <code className="text-indigo-300">.github/workflows/</code> フォルダに保存する設定ファイル
              </div>
            </div>

            <button
              onClick={copyWorkflow}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                copiedYml ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {copiedYml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedYml ? 'コピー完了！' : 'ワークフローをコピー'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[420px] overflow-y-auto text-xs font-mono text-slate-200">
            <pre>
              <code>{workflowFile.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
