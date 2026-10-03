# 🌸 Android_Movie_Wallpaper (動く動画壁紙)

<div align="center">
  <img src="public/app-icon.jpg" width="128" height="128" alt="Android_Movie_Wallpaper Icon" style="border-radius: 28px; box-shadow: 0 8px 24px rgba(255, 117, 143, 0.3);" />
  <br />

  ### お気に入りの推し動画やペットの動画を、スマホのホーム画面に ✨
  **20代女子向けのかわいい淡色UI ＆ バッテリー消費ゼロ（0mW）の超省電力設計**

  <p>
    <a href="https://github.com/chinta44/Android_Movie_Wallpaper/releases"><img src="https://img.shields.io/badge/Release-v1.2.0-ff758f?style=for-the-badge&logo=android&logoColor=white" alt="Release" /></a>
    <img src="https://img.shields.io/badge/Android-7.0%20(API%2024)+-ffb3c1?style=for-the-badge&logo=android&logoColor=white" alt="Android Version" />
    <img src="https://img.shields.io/badge/Kotlin-1.9.23-7f5af0?style=for-the-badge&logo=kotlin&logoColor=white" alt="Kotlin" />
    <img src="https://img.shields.io/badge/ExoPlayer-Media3-2cb67d?style=for-the-badge" alt="Media3" />
    <img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 🎀 このアプリについて

**Android_Movie_Wallpaper** は、スマートフォンの内部ストレージやSDカードにある動画（mp4等）を、ホーム画面の「動くライブ壁紙」として設定できるAndroidアプリです。

「動画の壁紙って、スマホの充電がすぐ減りそう……」  
「電車やオフィスで突然音が鳴ったら困る……」  
そんな不安を解消するため、**画面が消えている時や別のアプリを開いている時は動画が完全停止（0mW休止）する安心設計**で作られています。

---

## ✨ 6つの推しポイント (Features)

| アイコン | 機能 | 説明 |
| :---: | :--- | :--- |
| 🐱 | **かわいい3D子猫アイコン** | ホーム画面に置くだけでテンションが上がる、淡色ピンク＆ラベンダーの専用アイコン。 |
| 🌸 | **大人カワイイ設定画面 (v1.2.0)** | 誰でも直感的に操作できる、やさしい淡色ピンク＆角丸カードの日本語UI。 |
| 🔋 | **電池が減らない安心設計 (0.0mW)** | 画面スリープ時や他アプリ起動時は、ExoPlayerを即座に停止してバッテリー消費をゼロにします。 |
| 🔇 | **完全ミュート（自動無音）** | 音声は最初から自動で消音。電車やオフィスでも安心して使えます。 |
| 🖐️ | **トントン（ダブルタップ）一時停止** | ホーム画面の空いている場所をすばやく2回タップすると、いつでも動画の再生・一時停止を切り替え可能。 |
| 📂 | **SDカード＆再起動に対応 (SAF)** | Androidの最新権限機構（Storage Access Framework）に対応。スマホを再起動しても壁紙が消えません。 |

---

## 📱 スマホへのインストール手順（誰でもかんたん3ステップ）

Android Studioなどの専門的なソフトは一切不要です！

1. **APKをダウンロード**  
   スマホのブラウザで [GitHub Releases](https://github.com/chinta44/Android_Movie_Wallpaper/releases) を開き、最新の **`app-debug.apk`** をタップしてダウンロードします。
2. **インストールを許可**  
   通知やダウンロード履歴からファイルを開き、「提供元不明のアプリのインストール」を許可してインストールします。
3. **動画を選んで壁紙に設定！**  
   アプリを開き、**「💖 好きな動画を選ぶ」** でお好みの動画を選択したら、**「🌸 ホーム画面の壁紙に設定する」** をタップして完了です！

---

## 🚀 GitHub Actions による自動ビルド（Studio不要）

このリポジトリには **GitHub Actions（無料CI/CD）** が組み込まれています。

ご自身のパソコンに重たい開発環境（Android StudioやAndroid SDK）をインストールしなくても、**GitHubにコードを保存するだけ**で、クラウド上のLinuxマシンが全自動でコンパイルし、数分で [Releases](https://github.com/chinta44/Android_Movie_Wallpaper/releases) に完成した `.apk` を届けてくれます。

### 手動でビルドを実行する方法
1. GitHubの **「Actions」** タブを開く
2. 左メニューの **「Build & Release APK」** を選択
3. 右側の **「Run workflow」** ボタンを押すだけで、約1分後に最新APKが作成されます。

---

## 📁 プロジェクト構成 (Architecture)

```text
Android_Movie_Wallpaper/
├── .github/workflows/
│   └── build-apk.yml               # APK自動ビルド＆Release公開ワークフロー
├── app/
│   ├── build.gradle.kts            # アプリ依存関係 (Media3 / Kotlin / AndroidX)
│   └── src/main/
│       ├── AndroidManifest.xml     # 壁紙サービス・権限・アイコン設定
│       ├── java/com/example/videowallpaper/
│       │   ├── VideoWallpaperService.kt     # 壁紙描画エンジン (0mWスリープ・ダブルタップ)
│       │   ├── SettingsActivity.kt          # 大人カワイイ淡色設定画面 (v1.2.0)
│       │   ├── StoragePickerHelper.kt       # SDカード/内部ストレージ永続権限 (SAF)
│       │   ├── WallpaperPreferences.kt      # 動画URIの保存・復元
│       │   └── BatteryOptimizationManager.kt# 動的フレームレート制御
│       └── res/
│           ├── drawable/           # アイコン (ic_launcher) & 角丸ボタングラデーション
│           ├── values/strings.xml  # 文字列リソース
│           └── xml/wallpaper.xml   # ライブ壁紙メタデータ
├── build.gradle.kts                # ルートGradle設定
├── gradle.properties               # AndroidX & メモリ設定
└── settings.gradle.kts             # プロジェクト設定
