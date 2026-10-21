import type { AppConfig } from '../config/types.ts';
import type { LinkState } from './DeviceManager.ts';

export interface UiState {
  displayShape: string;
  displayView: 'scene' | 'plan' | 'field';
  speed: number;
}

export interface AppHost {
  cfg: AppConfig;
  setFps(fps: number): void;
  setHint(text: string): void;
  notifyLink(state: LinkState): void;
  saveConfig(): void;
  saveUiState(): void;
}
