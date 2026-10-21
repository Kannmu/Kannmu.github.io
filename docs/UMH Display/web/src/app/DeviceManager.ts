/** One serial link shared by both workspaces, with the demo board as fallback. */
import { DemoDevice } from '../device/demo.ts';
import { UmhDevice } from '../device/umh.ts';
import type { DeviceLike } from '../device/types.ts';
import { pickUmhPort, serialSupported } from '../device/webSerial.ts';

export type LinkMode = 'demo' | 'serial';

export interface LinkState {
  mode: LinkMode;
  busy: boolean;
  device: DeviceLike;
  label: string;
  version: number;
  error: string;
}

type Listener = (state: LinkState) => void;

export class DeviceManager {
  private demo = new DemoDevice();
  private device: DeviceLike = this.demo;
  private mode: LinkMode = 'demo';
  private busy = false;
  private error = '';
  private version = 0;
  private readonly listeners = new Set<Listener>();

  get current(): DeviceLike {
    return this.device;
  }

  get isDemo(): boolean {
    return this.mode === 'demo';
  }

  get state(): LinkState {
    return {
      mode: this.mode,
      busy: this.busy,
      device: this.device,
      label: this.device.label,
      version: this.version,
      error: this.error
    };
  }

  get serialAvailable(): boolean {
    return serialSupported();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const state = this.state;
    for (const listener of this.listeners) listener(state);
  }

  async connect(): Promise<void> {
    if (this.mode === 'serial' || this.busy) return;
    if (!serialSupported()) throw new Error('此浏览器不支持 Web Serial，请使用 Chrome 或 Edge');
    this.busy = true;
    this.error = '';
    this.emit();
    try {
      const port = await pickUmhPort();
      const device = await UmhDevice.open(port);
      device.onDisconnect = () => {
        if (this.device === device) this.fallback('设备已断开，已切换到演示模式');
      };
      await this.demo.close();
      this.device = device;
      this.mode = 'serial';
      this.version++;
      this.busy = false;
      this.emit();
    } catch (error) {
      this.busy = false;
      this.error = error instanceof Error ? error.message : String(error);
      this.emit();
      throw error;
    }
  }

  async disconnect(reason = '已断开设备，回到演示模式'): Promise<void> {
    if (this.mode !== 'serial') return;
    const device = this.device;
    await device.close();
    this.fallback(reason);
  }

  private fallback(reason: string): void {
    this.demo = new DemoDevice();
    this.device = this.demo;
    this.mode = 'demo';
    this.error = reason;
    this.version++;
    this.busy = false;
    this.emit();
  }

  clearError(): void {
    this.error = '';
    this.emit();
  }

  async dispose(): Promise<void> {
    await this.device.close();
  }
}
