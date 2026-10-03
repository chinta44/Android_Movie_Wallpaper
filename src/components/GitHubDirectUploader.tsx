import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  FileCode, 
  Download, 
  RefreshCw, 
  Lock, 
  Layers,
  FolderArchive,
  Sparkles,
  HelpCircle,
  Check,
  FolderUp,
  ArrowRight
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_CODE_FILES } from '../data/androidCodeSnippets';

export const GitHubDirectUploader: React.FC = () => {
  const [token, setToken] = useState('');
  const [repoFullName, setRepoFullName] = useState('chinta44/Android_Movie_Wallpaper');
  const [branch, setBranch] = useState('main');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'all' | 'workflow-only'>('all');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  // 1-Click ZIP Download for full Android Project
  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each Android file into the ZIP with its exact path
      ANDROID_CODE_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Android_Movie_Wallpaper_Project.zip';
      a.click();
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
    } catch (err) {
      console.error(err);
      alert('ZIPの生成に失敗しました。');
    } finally {
      setIsZipping(false);
    }
  };

  // Upload either all Android files or just build-apk.yml to GitHub
  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setUploadStatus('error');
      setStatusMessage('GitHubのPersonal Access Token (PAT) を入力してください。');
      return;
    }
    if (!repoFullName.trim() || !repoFullName.includes('/')) {
      setUploadStatus('error');
      setStatusMessage('リポジトリ名を「ユーザー名/リポジトリ名」(例: chinta44/Android_Movie_Wallpaper) の形式で入力してください。');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setStatusMessage('');

    try {
      const [owner, repo] = repoFullName.trim().split('/');
      const cleanToken = token.trim();
      const targetBranch = branch.trim() || 'main';

      setUploadProgress('トークンの権限を検証中...');

      // 1. Verify user token identity
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });
      if (userRes.status === 401) {
        throw new Error('トークンが無効または有効期限切れです。GitHubで再発行してください。');
      }

      // 2. Verify repository access & write permission
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (repoRes.status === 404) {
        throw new Error(
          `リポジトリ「${owner}/${repo}」に対してトークンにアクセス権限がありません（404 Not Found）。\n` +
          `Fine-grainedトークンをお使いの場合は、対象リポジトリに「${repo}」を追加し、Repository permissionsで「Contents: Read and write」を許可してください。`
        );
      }

      if (repoRes.ok) {
        const repoData = await repoRes.json();
        if (repoData.permissions && repoData.permissions.push === false) {
          throw new Error(
            'このトークンにはリポジトリへの書き込み（push）権限がありません。\n' +
            'Classicトークンの場合は「repo」権限、Fine-grainedトークンの場合は「Contents: Read and write」権限をチェックして再発行してください。'
          );
        }
      }

      const filesToUpload = uploadMode === 'workflow-only'
        ? ANDROID_CODE_FILES.filter(f => f.filename === 'build-apk.yml')
        : ANDROID_CODE_FILES;

      let successCount = 0;

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress(`アップロード中 (${i + 1}/${filesToUpload.length}): ${file.path}`);

        // Check if file already exists to get SHA
        let existingSha: string | undefined = undefined;
        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${targetBranch}`;

        const checkRes = await fetch(getUrl, {
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        });

        if (checkRes.ok) {
          const fileData = await checkRes.json();
          existingSha = fileData.sha;
        }

        // Base64 encode content
        const encodedContent = btoa(unescape(encodeURIComponent(file.code)));

        const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`;
        const payload: any = {
          message: `Add ${file.filename} for Android Movie Wallpaper build`,
          content: encodedContent,
          branch: targetBranch
        };
        if (existingSha) {
          payload.sha = existingSha;
        }

        const putRes = await fetch(putUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!putRes.ok) {
          const errJson = await putRes.json().catch(() => ({}));
          if (putRes.status === 404) {
            throw new Error(
              'GitHubから「Not Found（404）」エラーが返されました。\n' +
              'GitHubの仕様上、トークンにリポジトリへの書き込み権限（Contents: Read & write または repo）が付いていないと403ではなく404になります。\n' +
              '下の「方法1: ZIPでドラッグ＆ドロップ」を使うと、トークン不要で確実に解決できます！'
            );
          }
          throw new Error(errJson.message || `アップロード失敗: ${file.path} (HTTP ${putRes.status})`);
        }

        successCount++;
        await new Promise(r => setTimeout(r, 200));
      }

      setUploadStatus('success');
      setStatusMessage(`🎉 ${successCount}個のAndroid構成ファイルを GitHub (${repoFullName}) にアップロードしました！`);

    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      setStatusMessage(err.message || 'アップロードに失敗しました。');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const cleanRepoName = repoFullName.trim() || 'chinta44/Android_Movie_Wallpaper';
  const githubUploadUrl = `https://github.com/${cleanRepoName}/upload/${branch.trim() || 'main'}`;

  return (
    <div className="space-y-6">
      {/* 1. BEST & EASIEST METHOD: ZIP DOWNLOAD & DRAG-AND-DROP (100% Guaranteed Success) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-slate-950 text-[11px] font-extrabold rounded-bl-xl tracking-wider">
          ★ 最も簡単・確実な解決法（トークン不要）
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                方法1: ZIPファイルをダウンロードしてGitHubにドラッグ＆ドロップ
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                トークンの発行や権限エラーに悩まされることなく、<strong>30秒で確実にファイルを配置</strong>できます。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all shrink-0 cursor-pointer"
          >
            {isZipping ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : zipDownloaded ? (
              <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
            ) : (
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            )}
            <span>{zipDownloaded ? 'ZIPを再ダウンロード' : 'Androidプロジェクト一式をZIP保存 (推奨)'}</span>
          </button>
        </div>

        {/* 3 Simple Steps */}
        <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-500/20 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">1</span>
              <span>上のボタンでZIPを保存</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              「Android_Movie_Wallpaper_Project.zip」がダウンロードされます。PCで解凍（展開）してください。
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">2</span>
              <span>GitHubのアップロード画面を開く</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <a
                href={githubUploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 underline font-semibold hover:text-emerald-200 inline-flex items-center gap-1"
              >
                GitHubアップロード画面を開く <ExternalLink className="w-3 h-3" />
              </a>
              からリポジトリのアップロード画面へ進みます。
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">3</span>
              <span>ドラッグ＆ドロップしてCommit</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              解凍した中身（appフォルダ、settings.gradle.kts等）をドラッグして「Commit changes」を押すだけ！
            </p>
          </div>
        </div>
      </div>

      {/* 2. EXPLANATION OF "Not Found" ERROR */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shadow-xl space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>「Not Found」エラーが出た理由について</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          GitHub APIでは、入力したトークンに<strong>リポジトリへの書き込み権限（Contents: Read & write または repo）が付いていない場合</strong>、セキュリティ上の理由から403（拒否）ではなく<strong>「404 Not Found（見つかりません）」</strong>というエラーを返します。
        </p>
        <p className="text-slate-400">
          ※トークンの権限設定が難しい場合は、上記の<strong>「方法1: ZIPファイルをダウンロードしてGitHubにドラッグ＆ドロップ」</strong>を行っていただくのが一番早くて確実です。
        </p>
      </div>

      {/* 3. METHOD 2: API DIRECT UPLOAD (WITH ENHANCED DIAGNOSTICS) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-md space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Key className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              方法2: GitHub API トークンによる自動アップロード
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              正しい書き込み権限（repo）を持つトークンを使用して、アプリから直接コミットします。
            </p>
          </div>
        </div>

        <form onSubmit={handleDirectUpload} className="space-y-4">
          {/* Target Mode */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              アップロード対象
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode('all')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  uploadMode === 'all'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Android全ファイル (推奨)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  settings.gradle.kts, app/build.gradle.kts, Kotlinソース一式
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode('workflow-only')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  uploadMode === 'workflow-only'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 text-white">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>修正版 build-apk.yml のみ</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  エラーを防止したワークフローファイルのみ
                </div>
              </button>
            </div>
          </div>

          {/* Repo Name */}
          <div>
            <label className="text-xs font-semibold text-slate-200 block mb-1">
              GitHubリポジトリ名
            </label>
            <input
              type="text"
              value={repoFullName}
              onChange={(e) => setRepoFullName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Token */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Personal Access Token (PAT)</span>
              </label>
              <button
                type="button"
                onClick={() => setShowTokenHelp(!showTokenHelp)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
              >
                トークン作成手順
              </button>
            </div>

            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Token Help Accordion */}
          {showTokenHelp && (
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-300 space-y-2 animate-fade-in">
              <div className="font-semibold text-white flex items-center gap-1.5 text-indigo-300">
                <Key className="w-4 h-4" />
                <span>【重要】Not Foundにならないトークン作成手順:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                <li>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=AndroidWallpaperUploader"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline inline-flex items-center gap-1"
                  >
                    Classicトークン作成ページを開く（推奨） <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <strong>Note:</strong> に任意の名前を入力
                </li>
                <li>
                  <strong>Select scopes:</strong> で必ず一番上の <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 font-bold">repo</code>（Full control of private repositories）にチェックを入れる
                </li>
                <li>ページ下部の <strong>「Generate token」</strong> をクリック</li>
                <li>表示された <code className="text-emerald-400 font-mono">ghp_...</code> をコピーして貼り付けます</li>
              </ol>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isUploading
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/50'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{uploadProgress || 'GitHubへアップロード中...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadMode === 'all'
                      ? 'Androidアプリ全ファイルをGitHubへ一括アップロード'
                      : '修正版 build-apk.yml のみをGitHubへアップロード'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Status Feedback */}
          {uploadStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{statusMessage}</span>
              </div>
              <p className="text-slate-300">
                リポジトリ内にAndroidのビルド構成が正しく配置されました！
                Actionsタブから再度「Run workflow」を実行してください。
              </p>
              <div className="pt-1">
                <a
                  href={`https://github.com/${cleanRepoName}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>GitHub Actions画面を開いてビルド実行</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in whitespace-pre-line">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-300">アップロード失敗</div>
                <p className="mt-0.5 text-slate-300">{statusMessage}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
