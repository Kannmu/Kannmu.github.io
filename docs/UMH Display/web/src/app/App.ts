/** Shell: workspaces, link UI, help dialog, drawers, boot sequence. */
import type { AppConfig } from '../config/types.ts';
import { loadConfig, saveConfig as persistConfig } from '../config/store.ts';
import { DeviceManager, type LinkState } from './DeviceManager.ts';
import { PlanClient } from './PlanClient.ts';
import { DisplayWorkspace } from './DisplayWorkspace.ts';
import { GunWorkspace } from './GunWorkspace.ts';
import type { AppHost, UiState } from './workspace.ts';
import { UI_KEY } from '../config/defaults.ts';
import { toast } from '../ui/toast.ts';
import { mountIcons } from '../ui/icons.ts';
import { debounce } from '../core/dom.ts';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));
const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

function loadUi(): UiState {
  try {
    const raw = localStorage.getItem(UI_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UiState>;
      return {
        workspace: parsed.workspace === 'gun' ? 'gun' : 'display',
        displayShape: typeof parsed.displayShape === 'string' ? parsed.displayShape : 'circle',
        displayView: parsed.displayView === 'plan' || parsed.displayView === 'field' ? parsed.displayView : 'scene',
        speed: [1, 0.5, 0.25].includes(Number(parsed.speed)) ? Number(parsed.speed) : 1
      };
    }
  } catch {
    /* ignore corrupt UI state */
  }
  return { workspace: 'display', displayShape: 'circle', displayView: 'scene', speed: 1 };
}

export class App implements AppHost {
  readonly cfg: AppConfig;
  private readonly devices = new DeviceManager();
  private readonly client = new PlanClient();
  private readonly ui: UiState;
  private display!: DisplayWorkspace;
  private gun!: GunWorkspace;
  private active: 'display' | 'gun';
  private lastLinkVersion = -1;
  private readonly saveUi = debounce(() => {
    try {
      localStorage.setItem(UI_KEY, JSON.stringify(this.ui));
    } catch {
      /* storage unavailable */
    }
  }, 160);

  constructor() {
    this.cfg = loadConfig();
    this.ui = loadUi();
    this.active = this.ui.workspace;
  }

  async boot(): Promise<void> {
    const boot = document.getElementById('boot');
    const bootText = document.getElementById('bootText');
    const bootBar = document.getElementById('bootBar');
    const progress = (value: number, text: string): void => {
      if (bootBar) bootBar.style.width = `${value}%`;
      if (bootText) bootText.textContent = text;
    };

    try {
      mountIcons(document);
      progress(8, '读取配置与界面状态');
      await nextFrame();
      progress(22, '装配光绘 / 重力枪工作区');
      this.display = new DisplayWorkspace(this, this.devices, this.client, this.ui);
      this.gun = new GunWorkspace(this, this.devices, this.client);
      mountIcons(document);
      await nextFrame();

      progress(38, '预热声场模型（Gor′kov 势）');
      const warm = this.client.warm();
      await Promise.race([warm, sleep(8000)]);
      progress(58, '规划初始图形');
      await this.display.start();
      progress(78, '合成瓶状声场截面');
      await this.gun.start();
      progress(94, '就绪');
      await nextFrame();

      this.display.deactivate();
      this.gun.deactivate();
      this.bindShell();
      this.devices.subscribe((state) => this.onLink(state));
      this.onLink(this.devices.state);
      this.switchWorkspace(this.active, false);
      this.setHint('规划在 Web Worker 中运行 · 拖动三维视图可旋转');
      await sleep(260);
      boot?.classList.add('is-done');
      window.setTimeout(() => boot?.remove(), 700);
    } catch (error) {
      console.error(error);
      if (bootText) bootText.textContent = `启动失败：${error instanceof Error ? error.message : String(error)}`;
      if (bootBar) bootBar.style.width = '100%';
      toast(`启动失败：${error instanceof Error ? error.message : String(error)}`, 'error', 8000);
    }
  }

  // ------------------------------------------------------------------ host API
  get config(): AppConfig {
    return this.cfg;
  }

  setFps(fps: number): void {
    const el = document.getElementById('statusFps');
    if (el) el.textContent = `${Math.max(0, Math.round(fps))} fps`;
  }

  setHint(text: string): void {
    const el = document.getElementById('statusHint');
    if (el) el.textContent = text;
  }

  notifyLink(state: LinkState): void {
    this.onLink(state);
  }

  saveConfig(): void {
    // localStorage writes are cheap; keep it synchronous so an import followed
    // by a reload can never be overwritten by a stale debounced write.
    persistConfig(this.cfg);
  }

  saveUiState(): void {
    this.saveUi();
  }

  // -------------------------------------------------------------------- shell
  private bindShell(): void {
    for (const tab of document.querySelectorAll<HTMLElement>('[data-workspace]')) {
      tab.addEventListener('click', () => {
        const workspace = tab.dataset.workspace === 'gun' ? 'gun' : 'display';
        this.switchWorkspace(workspace, true);
      });
    }

    const connect = document.getElementById('connectBtn');
    connect?.addEventListener('click', () => void this.toggleConnection());

    const help = document.getElementById('helpDialog') as HTMLDialogElement | null;
    document.getElementById('helpBtn')?.addEventListener('click', () => {
      if (help && !help.open) help.showModal();
    });
    document.querySelectorAll('[data-close-help]').forEach((node) =>
      node.addEventListener('click', () => help?.close())
    );
    help?.addEventListener('click', (event) => {
      if (event.target === help) help.close();
    });

    for (const drawer of document.querySelectorAll<HTMLElement>('[data-open-rail]')) {
      drawer.addEventListener('click', () => {
        const workspace = drawer.dataset.openRail;
        document.getElementById(workspace === 'gun' ? 'gunRail' : 'displayRail')?.classList.add('is-open');
      });
    }
    for (const closer of document.querySelectorAll<HTMLElement>('[data-close-rail]')) {
      closer.addEventListener('click', () => closer.closest('.rail')?.classList.remove('is-open'));
    }
    for (const drawer of document.querySelectorAll<HTMLElement>('[data-open-inspector]')) {
      drawer.addEventListener('click', () => {
        const workspace = drawer.dataset.openInspector;
        document
          .getElementById(workspace === 'gun' ? 'gunInspector' : 'displayInspector')
          ?.classList.add('is-open');
      });
    }
    for (const closer of document.querySelectorAll<HTMLElement>('[data-close-inspector]')) {
      closer.addEventListener('click', () => closer.closest('.inspector')?.classList.remove('is-open'));
    }

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (document.querySelector('dialog[open]')) return;
      if (event.key === '1') this.switchWorkspace('display', true);
      else if (event.key === '2') this.switchWorkspace('gun', true);
      else if (event.key === '?' || (event.key === 'h' && !event.ctrlKey && !event.metaKey)) {
        if (help && !help.open) help.showModal();
      } else if (event.key === 'Escape') {
        document.querySelectorAll('.rail.is-open, .inspector.is-open').forEach((node) => node.classList.remove('is-open'));
      }
    });

    window.addEventListener('beforeunload', (event) => {
      if (!this.devices.isDemo) {
        event.preventDefault();
        event.returnValue = '';
      }
      this.saveUi();
    });
    window.addEventListener('pagehide', () => {
      this.saveUi();
    });
  }

  private switchWorkspace(workspace: 'display' | 'gun', persist: boolean): void {
    if (workspace === this.active && document.querySelector('.workspace.is-active')) {
      // still make sure the right one is visible on first boot
    }
    const previous = this.active;
    if (previous !== workspace) {
      if (previous === 'display') this.display.deactivate();
      else this.gun.deactivate();
    }
    this.active = workspace;
    this.ui.workspace = workspace;
    if (persist) this.saveUiState();

    for (const tab of document.querySelectorAll<HTMLElement>('[data-workspace]')) {
      const isActive = tab.dataset.workspace === workspace;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
    for (const panel of document.querySelectorAll<HTMLElement>('[data-workspace-panel]')) {
      panel.classList.toggle('is-active', panel.dataset.workspacePanel === workspace);
    }
    document.querySelectorAll('.rail.is-open, .inspector.is-open').forEach((node) => node.classList.remove('is-open'));
    if (workspace === 'display') {
      this.display.activate();
      this.setHint('光绘：规划在后台完成 · 1/2 切换工作区 · 拖动三维视图旋转');
    } else {
      this.gun.activate();
      this.setHint('重力枪：WASD / 方向键移动 · R·F 升降 · Space 回中 · Esc 急停');
    }
  }

  private onLink(state: LinkState): void {
    const chip = document.getElementById('linkChip');
    const label = document.getElementById('linkLabel');
    const connectLabel = document.getElementById('connectLabel');
    const mode = document.getElementById('statusMode');
    if (chip) {
      chip.dataset.state = state.busy ? 'busy' : state.mode === 'demo' ? 'demo' : 'connected';
    }
    if (label) {
      label.textContent = state.busy ? '正在连接…' : state.mode === 'demo' ? '演示模式' : '已连接';
    }
    if (connectLabel) connectLabel.textContent = state.mode === 'demo' ? '连接设备' : '断开设备';
    if (mode) {
      mode.classList.toggle('is-connected', state.mode === 'serial');
      const text = mode.querySelector('span');
      if (text) text.textContent = state.mode === 'serial' ? `真实设备 · ${state.label}` : '演示模式';
    }

    if (state.version !== this.lastLinkVersion) {
      this.lastLinkVersion = state.version;
      this.display?.onDeviceChanged();
      this.gun?.onDeviceChanged();
      if (state.mode === 'serial') {
        toast(`已连接 ${state.device.profile.model} · ${state.device.profile.firmware}`, 'ok');
        this.setHint('设备已连接 · Web Serial 2 Mbaud');
      } else if (state.error) {
        toast(state.error, 'error', 4500);
        this.devices.clearError();
        this.setHint('演示模式：可规划、预览与学习，不起浮真实硬件');
      }
    }
  }

  private async toggleConnection(): Promise<void> {
    if (this.devices.state.busy) return;
    if (this.devices.isDemo) {
      try {
        await this.devices.connect();
      } catch (error) {
        toast(`连接失败：${error instanceof Error ? error.message : String(error)}`, 'error', 6000);
      }
      return;
    }
    const fieldActive = this.display.isFieldActive() || this.gun.isFieldActive();
    if (fieldActive && !window.confirm('声场正在运行。断开设备后阵列会保持最后一帧，可能需要先在设备上急停。确定断开？')) {
      return;
    }
    await this.devices.disconnect();
  }

  async dispose(): Promise<void> {
    this.display?.dispose();
    this.gun?.dispose();
    this.client.dispose();
    await this.devices.dispose();
  }
}

export function createApp(): App {
  return new App();
}

