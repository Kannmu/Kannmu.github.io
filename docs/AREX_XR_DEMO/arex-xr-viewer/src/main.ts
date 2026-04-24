import './style.css';
import { XREngine } from './xr-engine';
import { ControlsPanel } from './controls-panel';

const app = document.getElementById('app')!;

const canvas = document.createElement('canvas');
canvas.id = 'xr-canvas';
app.appendChild(canvas);

const engine = new XREngine(canvas);

const controls = new ControlsPanel(app, engine);
controls.init();

engine.init().then(() => {
  engine.startRenderLoop();
});
