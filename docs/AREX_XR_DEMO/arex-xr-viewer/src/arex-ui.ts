import type { EngineConfig } from './xr-engine';

interface ArexState {
  depth: number;
  heading: number;
  isHeadingMarked: boolean;
  targetHeading: number;
  breathingGasIndex: number;
  gasCursorIndex: number;
  currentDashCard: number;
  currentState: number;
  wallCharge: number;
  menuIndexInfo: number;
  menuIndexSetup: number;
  ndl: number;
  tts: number;
  time: string;
  flashSpeed: number;
}

const gasData = [
  { name: 'AIR', mod: 56 },
  { name: 'NX 32', mod: 34 },
  { name: 'TX 18/45', mod: 68 },
  { name: 'O2 100%', mod: 6 },
];

export class ArexUIRenderer {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private config: EngineConfig | null = null;
  private state: ArexState;
  private dpr = 2;
  private W = 640;
  private H = 480;
  private lastTime = 0;
  private elapsed = 0;

  constructor() {
    this.state = {
      depth: 45.2,
      heading: 265,
      isHeadingMarked: false,
      targetHeading: 0,
      breathingGasIndex: 2,
      gasCursorIndex: 0,
      currentDashCard: 1,
      currentState: 0,
      wallCharge: 0,
      menuIndexInfo: 0,
      menuIndexSetup: 0,
      ndl: 0,
      tts: 24,
      time: '38:14',
      flashSpeed: 0.3,
    };
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.W * this.dpr;
    this.canvas.height = this.H * this.dpr;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.dpr, this.dpr);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  updateConfig(config: EngineConfig) {
    this.config = config;
  }

  update() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.elapsed += dt;

    this.state.heading += (Math.random() - 0.5) * 2;
    if (this.state.heading >= 360) this.state.heading -= 360;
    if (this.state.heading < 0) this.state.heading += 360;

    const drift = (Math.random() - 0.5) * 0.2;
    this.state.depth = 45.2 + drift;

    const totalSec = 38 * 60 + 14 + Math.floor(this.elapsed);
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    this.state.time = `${mm}:${ss.toString().padStart(2, '0')}`;

    this.draw();
  }

  private draw() {
    const ctx = this.ctx;
    const W = this.W;
    const H = this.H;

    ctx.clearRect(0, 0, W, H);

    this.drawLeftAnchor(ctx);
    this.drawRightCanvas(ctx);
  }

  private drawLeftAnchor(ctx: CanvasRenderingContext2D) {
    const x = 0;
    const y = 0;
    const w = 180;
    const h = 480;

    ctx.save();
    ctx.fillStyle = 'transparent';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#003300';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w, h);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.textBaseline = 'top';

    let cy = 15;
    ctx.fillText('DEPTH', x + 12, cy);
    cy += 20;
    ctx.font = 'bold 58px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(this.state.depth.toFixed(1), x + 12, cy);
    cy += 65;

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('NDL', x + 12, cy);
    ctx.fillText('TTS', x + 120, cy);
    cy += 20;
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(String(this.state.ndl), x + 12, cy);

    ctx.fillStyle = '#00ff00';
    ctx.fillRect(x + 120, cy, 44, 24);
    ctx.fillStyle = '#000000';
    ctx.fillText(`${this.state.tts}'`, x + 124, cy + 2);

    cy += 35;
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('NEXT STOP', x + 12, cy);
    cy += 20;
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText("21m 3'", x + 12, cy);
    cy += 38;

    ctx.strokeStyle = '#003300';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x + 12, cy);
    ctx.lineTo(x + w - 12, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    cy += 10;

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('POD 1', x + 12, cy);
    ctx.fillText('POD 2', x + 110, cy);
    cy += 20;
    ctx.font = 'bold 21px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('210', x + 12, cy);
    ctx.fillStyle = '#55ff55';
    ctx.fillText('195', x + 110, cy);
    cy += 18;
    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('BAR', x + 48, cy);
    ctx.fillStyle = '#55ff55';
    ctx.fillText('BAR', x + 146, cy);
    cy += 15;

    ctx.strokeStyle = '#003300';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x + 12, cy);
    ctx.lineTo(x + w - 12, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    cy += 8;

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('GAS', x + 12, cy);
    cy += 20;
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(gasData[this.state.breathingGasIndex].name, x + 12, cy);
    cy += 28;

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('PO2', x + 12, cy);
    cy += 20;
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText('1.2|1.2|1.3', x + 12, cy);

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.fillText('TIME', x + 12, H - 25);
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(this.state.time, x + 12, H - 48);

    ctx.restore();
  }

  private drawRightCanvas(ctx: CanvasRenderingContext2D) {
    const ox = 180;
    const W = 460;
    const H = 480;

    ctx.save();
    ctx.beginPath();
    ctx.rect(ox, 0, W, H);
    ctx.clip();

    this.drawCompassCard(ctx, ox);
    this.drawScrollIndicator(ctx, ox);

    ctx.restore();
  }

  private drawCompassCard(ctx: CanvasRenderingContext2D, ox: number) {
    const cx = ox + 230;
    const heading = Math.round(this.state.heading);

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.textAlign = 'center';
    ctx.fillText('1F: NAV COMPASS', cx, 30);

    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox + 25, 40);
    ctx.lineTo(ox + 435, 40);
    ctx.stroke();

    ctx.font = 'bold 46px "Courier New", monospace';
    ctx.fillStyle = '#00ff00';
    ctx.fillText(`${heading}°`, cx, 100);

    const tapeY = 130;
    const tapeH = 60;
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + 30, tapeY, 400, tapeH);

    const centerLineX = cx;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerLineX, tapeY);
    ctx.lineTo(centerLineX, tapeY + tapeH);
    ctx.stroke();
    ctx.lineWidth = 1;

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const degPerDir = 45;
    const pxPerDeg = 3.5;
    const offset = this.state.heading * pxPerDeg;

    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    for (let i = -2; i <= 2; i++) {
      const baseIdx = Math.floor(this.state.heading / degPerDir);
      const idx = ((baseIdx + i) % 8 + 8) % 8;
      const labelDeg = Math.round(((baseIdx + i) * degPerDir + 360) % 360);
      const xPos = cx + (i * degPerDir - (this.state.heading % degPerDir)) * pxPerDeg;
      if (xPos < ox + 30 || xPos > ox + 430) continue;
      ctx.fillStyle = idx === 0 ? '#ffffff' : '#00ff00';
      const label = directions[idx];
      ctx.font = label.length <= 2 ? 'bold 24px "Courier New", monospace' : '14px "Courier New", monospace';
      ctx.fillText(label.length <= 2 ? label : String(labelDeg), xPos, tapeY + 38);
    }

    ctx.beginPath();
    ctx.moveTo(centerLineX - 8, tapeY + tapeH);
    ctx.lineTo(centerLineX, tapeY + tapeH + 10);
    ctx.lineTo(centerLineX + 8, tapeY + tapeH);
    ctx.fillStyle = '#00ff00';
    ctx.fill();

    if (this.state.isHeadingMarked) {
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = '#00ff00';
      ctx.textAlign = 'center';
      ctx.fillText(`[ TARGET: ${Math.round(this.state.targetHeading)}° ]`, cx, 220);
    }

    ctx.font = '14px "Courier New", monospace';
    ctx.fillStyle = '#55ff55';
    ctx.globalAlpha = 0.6;
      ctx.textAlign = 'center';
    ctx.fillText('[ PRESS TO MARK HEADING ]', cx, H - 30);
    ctx.globalAlpha = 1.0;

    ctx.restore();
  }

  private drawScrollIndicator(ctx: CanvasRenderingContext2D, ox: number) {
    const x = ox + 450;
    const cards = 5;
    for (let i = 0; i < cards; i++) {
      const y = H / 2 - (cards * 7) / 2 + i * 14;
      ctx.fillStyle = i === this.state.currentDashCard ? '#00ff00' : '#003300';
      ctx.fillRect(x, y, 6, 6);
      if (i === this.state.currentDashCard) {
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 8;
        ctx.fillRect(x, y, 6, 6);
        ctx.shadowBlur = 0;
      }
    }
  }

  getState(): ArexState {
    return this.state;
  }

  setState(partial: Partial<ArexState>) {
    Object.assign(this.state, partial);
  }
}
const H = 480;
