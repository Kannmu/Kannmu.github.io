import '../styles/tokens.css';
import '../styles/layout.css';
import '../styles/components.css';
import '../styles/workspaces.css';
import { createApp } from './app/App.ts';
import { mountIcons } from './ui/icons.ts';

const app = createApp();
mountIcons(document);
void app.boot();

declare global {
  interface Window {
    __UMH_DISPLAY__?: unknown;
  }
}
window.__UMH_DISPLAY__ = app;
