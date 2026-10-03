import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, ExternalLink, Heart, Smartphone, ShieldCheck, Palette } from 'lucide-react';

export const CuteAppIconSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const manifestSnippet = `<application
    android:allowBackup="true"
    android:icon="@drawable/app_icon"
    android:roundIcon="@drawable/app_icon"
    android:label="動く動画壁紙"
    android:supportsRtl="true"
    android:theme="@style/Theme.AppCompat.DayNight.NoActionBar">`;

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>20代女子向けデザイン完成！</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight flex items-center gap-2">
            🎀 かわいらしいアプリアイコン & 設定ガイド
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            淡色ピンク＆ラベンダーのきらめく3Dアイコン。ホーム画面に置いておくだけでテンションが上がります。
          </p>
        </div>

        <a
          href="/app-icon.jpg"
          download="app_icon.jpg"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-medium text-sm py-2.5 px-5 rounded-2xl shadow-sm shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>アイコン画像を保存 (.jpg)</span>
        </a>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Icon Presentation */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-amber-50/40 rounded-3xl border border-rose-100/80">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 rounded-[32px] blur-xl opacity-60 group-hover:opacity-90 transition duration-500"></div>
            
            {/* Icon Card */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[28px] overflow-hidden shadow-xl border-4 border-white/90 bg-white">
              <img
                src="/app-icon.jpg"
                alt="かわいい動く壁紙アプリアイコン"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="mt-5 text-center">
            <span className="text-sm font-bold text-stone-800 flex items-center justify-center gap-1.5">
              <span>動く動画壁紙</span>
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            </span>
            <p className="text-xs text-stone-500 mt-1">
              3Dパステル調・ベレー帽のねこちゃん×映画テープ
            </p>
          </div>

          {/* Homescreen Preview mockup chip */}
          <div className="mt-4 flex items-center gap-3 bg-white/80 border border-rose-100 rounded-2xl px-4 py-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-rose-100 shrink-0">
              <img src="/app-icon.jpg" alt="Icon" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-stone-700">スマホ画面の見た目</div>
              <div className="text-[11px] text-stone-400">丸みのあるアプリアイコンとして表示</div>
            </div>
          </div>
        </div>

        {/* Right: How to apply to Android Studio / GitHub project */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-stone-800 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-rose-500" />
              <span>Androidアプリにこのアイコンを設定する3ステップ</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              すでにリポジトリの <code className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-[11px]">app/src/main/res/drawable/app_icon.jpg</code> にアイコン画像を配置済みです。あとはマニフェストファイルで指定するだけでアイコンが変わります！
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60">
              <div className="w-6 h-6 rounded-full bg-rose-400 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800">AndroidManifest.xml を開く</span>
                <p>
                  GitHubの <code className="bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">app/src/main/AndroidManifest.xml</code> の編集画面を開きます。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60">
              <div className="w-6 h-6 rounded-full bg-rose-400 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-stone-600 space-y-2 flex-1">
                <span className="font-bold text-stone-800">android:icon を書き換える</span>
                <p>
                  <code className="text-stone-700">&lt;application&gt;</code> タグの <code className="text-stone-700">android:icon</code> を以下のように書き換えます：
                </p>
                
                <div className="relative rounded-xl bg-stone-900 text-rose-100 p-3 font-mono text-[11px] overflow-x-auto">
                  <pre>{manifestSnippet}</pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-rose-200 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'コピー完了！' : 'コピー'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/60">
              <div className="w-6 h-6 rounded-full bg-rose-400 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-stone-600 space-y-1">
                <span className="font-bold text-stone-800">保存（コミット）するだけ</span>
                <p>
                  保存すると GitHub Actions が自動で新しいAPKを作り、スマホのホーム画面にこのかわいいアイコンが並びます！
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-700 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>安心設計：</strong> 高解像度（1024×1024px）なので、最新のAndroidスマートフォンでもクッキリ綺麗に表示されます。
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
