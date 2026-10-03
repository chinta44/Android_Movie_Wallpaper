import React, { useState } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  GitBranch, 
  FolderGit2, 
  FileCode, 
  Copy, 
  Check, 
  RefreshCw, 
  Lock, 
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { ANDROID_CODE_FILES } from '../data/androidCodeSnippets';

export const GitHubDirectUploader: React.FC = () => {
  const [token, setToken] = useState('');
  const [repoFullName, setRepoFullName] = useState(''); // e.g. "Nagoya3021/video-wallpaper"
  const [branch, setBranch] = useState('main');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [commitUrl, setCommitUrl] = useState('');
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const workflowFile = ANDROID_CODE_FILES.find(f => f.filename === 'build-apk.yml');
  const workflowCode = workflowFile ? workflowFile.code : '';

  const handleDirectUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setUploadStatus('error');
      setStatusMessage('GitHubのPersonal Access Token (PAT) を入力してください。');
      return;
    }
    if (!repoFullName.trim() || !repoFullName.includes('/')) {
      setUploadStatus('error');
      setStatusMessage('リポジトリ名を「ユーザー名/リポジトリ名」(例: Nagoya3021/video-wallpaper) の形式で入力してください。');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setStatusMessage('');

    try {
      const [owner, repo] = repoFullName.trim().split('/');
      const filePath = '.github/workflows/build-apk.yml';
      const cleanToken = token.trim();

      // 1. Check if the file already exists to get its SHA (required for updates)
      let existingSha: string | undefined = undefined;
      const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      
      const checkRes = await fetch(getFileUrl, {
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (checkRes.ok) {
        const fileData = await checkRes.json();
        existingSha = fileData.sha;
      } else if (checkRes.status !== 404) {
        if (checkRes.status === 401) {
          throw new Error('トークンが無効または権限が不足しています。トークンに「repo」または「Contents (Read and write)」権限があるか確認してください。');
        } else if (checkRes.status === 403) {
          throw new Error('リポジトリへの書き込み権限がありません。リポジトリ名やトークンの権限をご確認ください。');
        }
      }

      // 2. Base64 encode the YAML content (handling UTF-8)
      const encodedContent = btoa(unescape(encodeURIComponent(workflowCode)));

      // 3. Put / create / update file via GitHub Contents API
      const putFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
      const payload: any = {
        message: 'Add GitHub Actions build workflow (.github/workflows/build-apk.yml)',
        content: encodedContent,
        branch: branch.trim() || 'main'
      };
      if (existingSha) {
        payload.sha = existingSha;
      }

      const putRes = await fetch(putFileUrl, {
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
        throw new Error(errJson.message || `HTTPエラー: ${putRes.status}`);
      }

      const result = await putRes.json();
      setUploadStatus('success');
      setStatusMessage('🎉 .github/workflows/build-apk.yml のアップロード（コミット）に成功しました！');
      setCommitUrl(result.commit?.html_url || `https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`);

    } catch (err: any) {
      console.error(err);
      setUploadStatus('error');
      setStatusMessage(err.message || 'アップロードに失敗しました。リポジトリ名やトークンをご確認ください。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadYml = () => {
    const blob = new Blob([workflowCode], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'build-apk.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenWebEditor = () => {
    if (!repoFullName.trim() || !repoFullName.includes('/')) {
      alert('リポジトリ名（例: ユーザー名/リポジトリ名）を入力してください。');
      return;
    }
    const [owner, repo] = repoFullName.trim().split('/');
    const githubNewFileUrl = `https://github.com/${owner}/${repo}/new/${branch}?filename=.github/workflows/build-apk.yml`;
    window.open(githubNewFileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-md space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              GitHubリポジトリへ .github/workflows/build-apk.yml を直接アップロード
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            このアプリからGitHub APIを直接呼び出し、ご自身のリポジトリへワークフローファイルを1クリックでコミット・作成します。
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadYml}
          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>ファイルをダウンロード (.yml)</span>
        </button>
      </div>

      {/* Main Upload Form */}
      <form onSubmit={handleDirectUpload} className="space-y-4">
        {/* Repository Input */}
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1.5">
            1. あなたのGitHubリポジトリ名 (必須)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="例: Nagoya3021/video-live-wallpaper"
              value={repoFullName}
              onChange={(e) => setRepoFullName(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ※ 作成したGitHubリポジトリのURL（github.com/<strong>ユーザー名/リポジトリ名</strong>）の太字部分を入力してください。
          </span>
        </div>

        {/* Branch Input */}
        <div>
          <label className="text-xs font-semibold text-slate-200 block mb-1.5">
            2. ブランチ名
          </label>
          <input
            type="text"
            placeholder="main"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Token Input with Security Notice */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>3. GitHub Personal Access Token (PAT)</span>
            </label>
            <button
              type="button"
              onClick={() => setShowTokenHelp(!showTokenHelp)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
            >
              トークンの発行手順（1分で完了）
            </button>
          </div>

          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            required
          />

          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              安全性: トークンはお使いのブラウザ内から直接 <code className="text-slate-300">api.github.com</code> へのアップロード通信のみに使用され、外部サーバーには一切保存されません。
            </span>
          </div>
        </div>

        {/* Token Help Accordion */}
        {showTokenHelp && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-300 space-y-2 animate-fade-in">
            <div className="font-semibold text-white flex items-center gap-1.5 text-indigo-300">
              <Key className="w-4 h-4" />
              <span>Personal Access Token (トークン) の簡単な作成手順:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
              <li>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=VideoWallpaperUploader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline inline-flex items-center gap-1"
                >
                  GitHubのトークン新規作成ページを開く <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <strong>Note:</strong> に任意の名前（例: <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">VideoWallpaperUploader</code>）を入力
              </li>
              <li>
                <strong>Select scopes:</strong> で <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">repo</code> (リポジトリへのアクセス権) にチェックを入れる
              </li>
              <li>一番下の <strong>「Generate token」</strong> ボタンをクリック</li>
              <li>表示された <code className="text-emerald-400 font-mono">ghp_...</code> で始まる緑色の文字列をコピーして上の入力欄に貼り付けます</li>
            </ol>
          </div>
        )}

        {/* Target File Summary */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-slate-300">作成されるファイル:</span>
            <span className="font-mono text-emerald-400 font-semibold">.github/workflows/build-apk.yml</span>
          </div>
          <span className="text-[10px] text-slate-500">自動APKビルドワークフロー</span>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full sm:w-auto flex-1 py-3 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              isUploading
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-900/50 hover:shadow-indigo-600/30'
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>GitHub API経由でアップロード中...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>GitHubリポジトリに直接アップロード（コミット）</span>
              </>
            )}
          </button>

          {/* Fallback button to open GitHub Web Editor */}
          <button
            type="button"
            onClick={handleOpenWebEditor}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            title="トークンを使わずにブラウザのGitHub画面で直接作成"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GitHub Webエディタで直接開く</span>
          </button>
        </div>

        {/* Status Message */}
        {uploadStatus === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
            <p className="text-slate-300">
              GitHub Actionsがリポジトリ内に構成されました！これで、Web画面上の「Run workflow」ボタンを押すか、Gitタグを付けるだけでいつでもAPKが自動ビルドされReleasesに公開されます。
            </p>
            <div className="flex items-center gap-3 pt-1">
              {commitUrl && (
                <a
                  href={commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>コミットされたファイルを確認</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {repoFullName && (
                <a
                  href={`https://github.com/${repoFullName.trim()}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>GitHub Actionsを実行する</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-300">アップロード失敗</div>
              <p className="mt-0.5 text-slate-300">{statusMessage}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
