export interface VideoPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  resolution: string;
  fps: number;
  url: string;
  fallbackCanvasType?: 'cyberpunk' | 'aurora' | 'particles' | 'geometric';
  duration: string;
}

export interface SimulatorState {
  currentVideoUrl: string;
  videoTitle: string;
  videoSourceType: 'internal' | 'sdcard' | 'custom';
  isPlaying: boolean;
  isAppObscuring: boolean; // Simulates another app opened on top
  isScreenOff: boolean;    // Simulates screen locked / turned off
  isBatterySaver: boolean; // Simulates Android PowerManager.isPowerSaveMode
  batteryLevel: number;    // 0-100%
  isMuted: boolean;
  targetFps: 15 | 24 | 30 | 60;
  scaleMode: 'cover' | 'contain' | 'center';
  enableDoubleTapPause: boolean;
  powerDrawWatts: number;  // Simulated current power draw
  isHardwareAccelerated: boolean;
  autoPauseOnLowBattery: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tag: string;
  level: 'D' | 'I' | 'W' | 'E';
  message: string;
}

export interface CodeFile {
  filename: string;
  path: string;
  language: 'kotlin' | 'xml' | 'gradle' | 'json' | 'yaml' | 'properties';
  description: string;
  code: string;
}
