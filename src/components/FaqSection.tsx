import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  RefreshCw, 
  HardDrive, 
  Volume2, 
  Lock,
  Smartphone
} from 'lucide-react';

interface FaqItem {
  id: string;
  icon: any;
  question: string;
  answer: React.ReactNode;
}

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-reboot', 'faq-sd-unmount']);

  const toggle = (id: string) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqs: FaqItem[] = [
    {
      id: 'faq-reboot',
      icon: RefreshCw,
      question: '端末を再起動（リブート）した際、壁紙が解除されたり真っ黒になりませんか？',
      answer: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>SAFの永続権限（takePersistableUriPermission）を実装していれば、再起動しても問題なく自動復旧します。</strong>
          </p>
          <p>
            通常の一時的なIntent URIでは端末再起動時にアクセス権が破棄されますが、<code className="text-emerald-400 font-mono">contentResolver.takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)</code> を呼んでSharedPreferencesにURI文字列を保存しておくことで、AndroidシステムがOS起動直後から壁紙サービスへ読み取り権限を自動付与し続けます。
          </p>
        </div>
      )
    },
    {
      id: 'faq-sd-unmount',
      icon: HardDrive,
      question: 'SDカードが抜かれたり、動画ファイルが削除された場合はどうなりますか？',
      answer: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            SDカードが物理的に抜かれたり、動画ファイルがリネーム・削除された場合は <code className="text-amber-400 font-mono">FileNotFoundException</code> や <code className="text-amber-400 font-mono">SecurityException</code> が発生します。
          </p>
          <p>
            アプリがクラッシュしてホーム画面がクラッシュループに陥るのを防ぐため、コード内で例外を捕捉し、<strong>「アセット同梱のデフォルト背景」または「暗色グラデーションの静止画」に自動フォールバック</strong>するガード処理を組み込んでいます。
          </p>
        </div>
      )
    },
    {
      id: 'faq-audio',
      icon: Volume2,
      question: '動画にBGMや音声がある場合、音声を流すことはできますか？',
      answer: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>技術的には可能です。ただし「デフォルトは完全ミュート」が業界標準です。</strong>
          </p>
          <p>
            常にホーム画面で音が鳴るとユーザーのストレスになり、オーディオDSP回路が常時稼働してバッテリーを消費します。
            音声に対応する場合は、「設定画面で音声ON/OFFを選べるようにする」または「ホーム画面をタップした時だけ一時的にフェードインする」仕様がおすすめです。
          </p>
        </div>
      )
    },
    {
      id: 'faq-lockscreen',
      icon: Lock,
      question: 'ロック画面とホーム画面で、別々の動画を壁紙に設定できますか？',
      answer: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Androidの仕様上、ライブ壁紙（WallpaperService）は「ホーム画面のみ」または「ホーム画面とロック画面の両方」のいずれかに適用されます（<code className="text-indigo-400 font-mono">WallpaperManager.FLAG_SYSTEM</code> / <code className="text-indigo-400 font-mono">FLAG_LOCK</code>）。
          </p>
          <p>
            ロック画面のみに別々のライブ壁紙を適用できるかどうかは端末メーカーのカスタムOS（One UI, MIUI, Pixel等）の実装に依存しますが、サービス内部で「現在画面がロック中か（KeyguardManager.isKeyguardLocked）」を判定して再生する動画を切り替える高度なアプローチも可能です。
          </p>
        </div>
      )
    },
    {
      id: 'faq-playstore',
      icon: ShieldCheck,
      question: 'Google Play ストアの審査でリジェクトされるリスクはありませんか？',
      answer: (
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>今回提示している SAF (Storage Access Framework) 実装であれば審査リスクは極めて低いです。</strong>
          </p>
          <p>
            過去に壁紙アプリで審査拒否された原因の多くは、過剰な権限（<code className="text-rose-400 font-mono">MANAGE_EXTERNAL_STORAGE</code> / 全ファイルアクセス）を要求したことによるものでした。SAFを使えば危険な権限を一切宣言せずにSDカードや内部動画を読み取れるため、Google Playのポリシーに100%適合します。
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            開発者向け 実装Q&A (よくある疑問とトラブル対策)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Android実機開発においてハマりやすいポイントや、Google Playストア公開時の注意点をまとめました。
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          const Icon = faq.icon;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{faq.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
