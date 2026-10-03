import { VideoPreset } from '../types/wallpaper';

export const SAMPLE_VIDEOS: VideoPreset[] = [
  {
    id: 'sunset',
    title: '🌙 パステル夕暮れの星空 (Dreamy Sunset)',
    description: 'ピンクとラベンダー色に染まる夕焼け空と瞬く星たち。見つめるだけで癒やされる人気No.1壁紙。',
    category: '淡色 / ドリーミー',
    resolution: '1080 x 2400 (FHD+)',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackCanvasType: 'aurora',
    duration: '20秒 ループ',
  },
  {
    id: 'kitten',
    title: '🐱 ふわふわ子猫のお昼寝 (Fluffy Kitty)',
    description: 'すやすや眠る子猫の愛らしい寝息と柔らかい光。ホーム画面を開くたびに心がほどけます。',
    category: '動物 / 癒やし',
    resolution: '1080 x 1920 (FHD)',
    fps: 24,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    fallbackCanvasType: 'particles',
    duration: '15秒 ループ',
  },
  {
    id: 'cafe',
    title: '☕ おうちカフェのラテアート (Cozy Cafe)',
    description: '湯気立ちのぼるカフェラテと温もりあるキャンドル。大人女子の落ち着いた日常にぴったり。',
    category: 'カフェ / ライフスタイル',
    resolution: '1080 x 1920 (FHD)',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackCanvasType: 'cyberpunk',
    duration: '15秒 ループ',
  },
  {
    id: 'sakura',
    title: '🌸 舞い散るさくら並木 (Spring Sakura)',
    description: '春のやさしい風に揺れ、舞い散るピンクの花びら。淡色コーデやパステル系アイコンに最高にマッチ。',
    category: '季節 / フラワー',
    resolution: '1080 x 2400 (FHD+)',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackCanvasType: 'geometric',
    duration: '10秒 ループ',
  }
];
