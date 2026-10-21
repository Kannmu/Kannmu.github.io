import { el, icon } from '../core/dom.ts';
import { mountIcons } from './icons.ts';

type ToastKind = 'info' | 'ok' | 'error';

let stack: HTMLElement | null = null;

function ensureStack(): HTMLElement {
  if (!stack) stack = document.getElementById('toastStack');
  if (!stack) {
    stack = el('div', { class: 'toast-stack', id: 'toastStack' });
    document.body.append(stack);
  }
  return stack;
}

export function toast(message: string, kind: ToastKind = 'info', duration = 2800): void {
  const host = ensureStack();
  const iconName = kind === 'ok' ? 'check' : kind === 'error' ? 'triangle-alert' : 'info';
  const node = el(
    'div',
    { class: `toast is-${kind}`, attrs: { role: 'status' } },
    icon(iconName, 14),
    el('span', { text: message })
  );
  host.append(node);
  mountIcons(node);
  while (host.children.length > 4) host.firstElementChild?.remove();
  window.setTimeout(() => {
    node.classList.add('is-leaving');
    window.setTimeout(() => node.remove(), 260);
  }, duration);
}

export { toast as showToast };
