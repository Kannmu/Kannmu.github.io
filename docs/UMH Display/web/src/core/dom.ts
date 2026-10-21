/** Tiny DOM helpers — no framework, no virtual DOM. */

export type Child = Node | string | number | null | undefined | false;

export interface ElementProps {
  class?: string;
  text?: string | number;
  html?: string;
  title?: string;
  id?: string;
  style?: Partial<CSSStyleDeclaration> | Record<string, string>;
  dataset?: Record<string, string | number>;
  on?: Partial<Record<keyof HTMLElementEventMap | string, (event: Event) => void>>;
  attrs?: Record<string, string | number | boolean | null | undefined>;
  [key: string]: unknown;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ElementProps = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'text') node.textContent = String(value);
    else if (key === 'html') node.innerHTML = String(value);
    else if (key === 'style' && typeof value === 'object') {
      Object.assign(node.style, value as Record<string, string>);
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [dataKey, dataValue] of Object.entries(value as Record<string, string | number>)) {
        node.dataset[dataKey] = String(dataValue);
      }
    } else if (key === 'on' && typeof value === 'object') {
      for (const [eventName, handler] of Object.entries(value as Record<string, (event: Event) => void>)) {
        node.addEventListener(eventName, handler);
      }
    } else if (key === 'attrs' && typeof value === 'object') {
      for (const [attr, attrValue] of Object.entries(value as Record<string, string | number | boolean>)) {
        if (attrValue === false || attrValue === null || attrValue === undefined) continue;
        node.setAttribute(attr, attrValue === true ? '' : String(attrValue));
      }
    } else if (key in node) {
      (node as unknown as Record<string, unknown>)[key] = value;
    } else {
      node.setAttribute(key, String(value));
    }
  }
  append(node, children);
  return node;
}

export function append(parent: Node, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function icon(name: string, size = 15): HTMLElement {
  const holder = document.createElement('i');
  holder.setAttribute('data-lucide', name);
  holder.style.width = `${size}px`;
  holder.style.height = `${size}px`;
  holder.setAttribute('aria-hidden', 'true');
  return holder;
}

export function formatNumber(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(digits);
}

export function formatSigned(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}`;
}

export function rgbToHex(rgb: readonly [number, number, number]): string {
  return `#${rgb.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T & { cancel(): void } {
  let timer: number | undefined;
  const wrapped = ((...args: Parameters<T>) => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), ms);
  }) as T & { cancel(): void };
  wrapped.cancel = () => {
    if (timer !== undefined) window.clearTimeout(timer);
  };
  return wrapped;
}

export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let queued = false;
  let lastArgs: Parameters<T> | null = null;
  return ((...args: Parameters<T>) => {
    lastArgs = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (lastArgs) fn(...lastArgs);
    });
  }) as T;
}
