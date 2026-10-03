import { VideoPreset } from '../types/wallpaper';

export const SAMPLE_VIDEOS: VideoPreset[] = [
  {
    id: 'cyberpunk',
    title: 'ネオン・サイバーシティ (Cyberpunk Loop)',
    description: '近未来都市の夜景と光のストリーム。有機ELディスプレイ映えする高コントラスト動画。',
    category: 'SF / アーバン',
    resolution: '1080 x 1920 (FHD)',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackCanvasType: 'cyberpunk',
    duration: '15秒 ループ',
  },
  {
    id: 'aurora',
    title: 'オーロラ・コズミック (Aurora Borealis)',
    description: '夜空に揺らめく極光と星空。バッテリー消費の少ない滑らかな低フレーム遷移。',
    category: '自然 / ネイチャー',
    resolution: '1080 x 1920 (FHD)',
    fps: 24,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackCanvasType: 'aurora',
    duration: '20秒 ループ',
  },
  {
    id: 'particles',
    title: 'アンビエント・ディープシー (Deep Sea Glow)',
    description: '深海の微小発光生物とゆったりとした水流。常時動作に適した穏やかな映像。',
    category: '癒やし / アンビエント',
    resolution: '720 x 1280 (HD)',
    fps: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    fallbackCanvasType: 'particles',
    duration: '12秒 ループ',
  },
  {
    id: 'geometric',
    title: 'ミニマル・ジオメトリック (Minimal Kinetic)',
    description: '幾何学模様がなだらかに変形する幾何学アート。ホーム画面のアプリアイコンを邪魔しない設計。',
    category: 'ミニマル / アート',
    resolution: '1080 x 2400 (FHD+)',
    fps: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackCanvasType: 'geometric',
    duration: '10秒 ループ',
  }
];
