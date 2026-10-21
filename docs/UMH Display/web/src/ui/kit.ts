/** Reusable control primitives for the two workspaces. */
import { clear, el, formatNumber, hexToRgb, icon, rgbToHex, type Child } from '../core/dom.ts';
import { mountIcons } from './icons.ts';

export interface SliderOptions {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  hint?: string;
  format?: (value: number) => string;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
}

export interface SliderHandle {
  root: HTMLElement;
  input: HTMLInputElement;
  setValue(value: number, silent?: boolean): void;
  setDisabled(disabled: boolean): void;
}

export function slider(options: SliderOptions): SliderHandle {
  const format = options.format ?? ((value: number) => String(Math.round(value * 100) / 100));
  const valueLabel = el('span', { class: 'control-value' });
  const input = el('input', {
    type: 'range',
    min: String(options.min),
    max: String(options.max),
    step: String(options.step),
    value: String(options.value),
    attrs: { 'aria-label': options.label }
  });

  const paint = (value: number, silent = false): void => {
    const pct = ((value - options.min) / (options.max - options.min)) * 100;
    input.style.setProperty('--fill', `${Math.max(0, Math.min(100, pct))}%`);
    clear(valueLabel);
    valueLabel.append(format(value));
    if (options.unit) valueLabel.append(el('span', { text: options.unit }));
    if (!silent) {
      const numeric = Number(input.value);
      options.onInput?.(numeric);
    }
  };

  input.addEventListener('input', () => paint(Number(input.value)));
  input.addEventListener('change', () => options.onChange?.(Number(input.value)));

  const root = el(
    'div',
    { class: 'control' },
    el(
      'div',
      { class: 'control-head' },
      el('label', { class: 'control-label', text: options.label }),
      valueLabel
    ),
    input,
    options.hint ? el('p', { class: 'section-note', text: options.hint }) : null
  );

  paint(options.value, true);
  return {
    root,
    input,
    setValue(value: number, silent = true) {
      input.value = String(value);
      paint(value, silent);
    },
    setDisabled(disabled: boolean) {
      input.disabled = disabled;
      root.classList.toggle('is-disabled', disabled);
    }
  };
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  title?: string;
}

export interface SegmentedHandle<T extends string> {
  root: HTMLElement;
  setValue(value: T): void;
}

export function segmented<T extends string>(
  options: SegmentedOption<T>[],
  value: T,
  onChange: (value: T) => void,
  extraClass = ''
): SegmentedHandle<T> {
  const root = el('div', { class: `segmented ${extraClass}`.trim(), attrs: { role: 'group' } });
  const buttons = options.map((option) => {
    const button = el('button', {
      type: 'button',
      text: option.label,
      title: option.title ?? option.label,
      class: option.value === value ? 'is-active' : ''
    });
    button.addEventListener('click', () => {
      if (button.classList.contains('is-active')) return;
      set(option.value);
      onChange(option.value);
    });
    root.append(button);
    return { option, button };
  });
  const set = (next: T): void => {
    for (const { option, button } of buttons) button.classList.toggle('is-active', option.value === next);
  };
  return { root, setValue: set };
}

export interface SectionOptions {
  title: string;
  eyebrow?: string;
  note?: string;
  actions?: HTMLElement | null;
  className?: string;
}

export function section(options: SectionOptions, ...children: Child[]): HTMLElement {
  return el(
    'section',
    { class: `control-section ${options.className ?? ''}`.trim() },
    el(
      'div',
      { class: 'section-head' },
      el('h2', { text: options.title }),
      options.actions ?? el('span', { class: 'eyebrow', text: options.eyebrow ?? '' })
    ),
    ...children
  );
}

export function button(
  label: string,
  options: {
    icon?: string;
    variant?: 'primary' | 'danger' | 'ghost' | 'small' | 'small-primary';
    title?: string;
    disabled?: boolean;
    onClick?: () => void;
    block?: boolean;
  } = {}
): HTMLElement {
  const classes = ['btn'];
  if (options.variant === 'primary') classes.push('btn-primary');
  else if (options.variant === 'danger') classes.push('btn-danger');
  else if (options.variant === 'ghost') classes.push('btn-ghost');
  else if (options.variant === 'small') classes.push('btn-small');
  else if (options.variant === 'small-primary') classes.push('btn-small', 'btn-primary');
  if (options.block) classes.push('btn-block');
  const node = el(
    'button',
    {
      type: 'button',
      class: classes.join(' '),
      title: options.title ?? label,
      attrs: options.disabled ? { disabled: true } : {}
    },
    options.icon ? icon(options.icon, 14) : null,
    el('span', { text: label })
  );
  if (options.onClick) node.addEventListener('click', options.onClick);
  return node;
}

const SHAPE_ICON_MAP: Record<string, { icon: string; label: string }> = {
  circle: { icon: 'circle', label: '圆' },
  square: { icon: 'square', label: '方' },
  triangle: { icon: 'triangle', label: '三角' },
  hexagon: { icon: 'hexagon', label: '六边' },
  star: { icon: 'star', label: '星' },
  heart: { icon: 'heart', label: '心' },
  rose: { icon: 'flower-2', label: '玫瑰' },
  lissajous: { icon: 'waves', label: '李萨如' },
  infinity: { icon: 'infinity', label: '无穷' },
  text: { icon: 'type', label: '文字' }
};

export interface ShapeGridHandle {
  root: HTMLElement;
  setActive(name: string): void;
}

export function shapeGrid(names: string[], active: string, onSelect: (name: string) => void): ShapeGridHandle {
  const root = el('div', { class: 'shape-grid', attrs: { role: 'group', 'aria-label': '图形' } });
  const buttons = new Map<string, HTMLElement>();
  for (const name of names) {
    const meta = SHAPE_ICON_MAP[name] ?? { icon: 'circle-dot', label: name };
    const button = el(
      'button',
      { type: 'button', class: name === active ? 'shape-btn is-active' : 'shape-btn', title: meta.label },
      icon(meta.icon, 17),
      el('span', { text: meta.label })
    );
    button.addEventListener('click', () => onSelect(name));
    buttons.set(name, button);
    root.append(button);
  }
  return {
    root,
    setActive(name: string) {
      for (const [key, button] of buttons) button.classList.toggle('is-active', key === name);
    }
  };
}

export function colorField(
  label: string,
  value: readonly [number, number, number],
  onChange: (rgb: [number, number, number]) => void
): HTMLElement {
  const input = el('input', { type: 'color', value: rgbToHex(value), attrs: { 'aria-label': label } });
  const code = el('span', { class: 'mono', text: rgbToHex(value).toUpperCase() });
  input.addEventListener('input', () => {
    const rgb = hexToRgb(input.value);
    code.textContent = input.value.toUpperCase();
    onChange(rgb);
  });
  return el('label', { class: 'swatch-input', title: `${label} 颜色` }, input, `${label} `, code);
}

export function fieldRow(label: string, control: HTMLElement, hint?: string): HTMLElement {
  return el(
    'div',
    { class: 'control' },
    el('div', { class: 'control-head' }, el('span', { class: 'control-label', text: label })),
    control,
    hint ? el('p', { class: 'section-note', text: hint }) : null
  );
}

export function textInput(
  value: string,
  options: { placeholder?: string; maxLength?: number; onCommit?: (value: string) => void; ariaLabel?: string } = {}
): HTMLInputElement {
  const input = el('input', {
    class: 'text-input',
    type: 'text',
    value,
    placeholder: options.placeholder ?? '',
    spellcheck: false,
    autocomplete: 'off',
    attrs: {
      maxlength: options.maxLength ?? 24,
      'aria-label': options.ariaLabel ?? '文字'
    }
  });
  input.addEventListener('change', () => options.onCommit?.(input.value));
  input.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Enter') {
      input.blur();
      options.onCommit?.(input.value);
    }
  });
  return input;
}

export interface MetricDefinition {
  key: string;
  label: string;
  unit?: string;
  digits?: number;
  accent?: boolean;
}

export class MetricBar {
  private readonly values = new Map<
    string,
    { text: Text; unit: HTMLElement; card: HTMLElement; def: MetricDefinition }
  >();

  constructor(root: HTMLElement, definitions: MetricDefinition[]) {
    root.innerHTML = '';
    for (const def of definitions) {
      const text = document.createTextNode('—');
      const unit = el('small', { text: def.unit ?? '' });
      const value = el('span', { class: 'metric-value' }, text, unit);
      const card = el(
        'div',
        { class: `metric-card${def.accent ? ' is-accent' : ''}` },
        el('span', { class: 'metric-label', text: def.label }),
        value
      );
      root.append(card);
      this.values.set(def.key, { text, unit, card, def });
    }
  }

  update(values: Record<string, number | string>, warnKeys: string[] = [], dangerKeys: string[] = []): void {
    for (const [key, entry] of this.values) {
      const raw = values[key];
      const digits =
        entry.def.digits ??
        (typeof raw === 'number' ? (Math.abs(raw) >= 100 ? 0 : Math.abs(raw) >= 10 ? 1 : 2) : 0);
      entry.text.textContent = typeof raw === 'number' ? formatNumber(raw, digits) : raw ?? '—';
      entry.unit.textContent = entry.def.unit ?? '';
      entry.card.classList.toggle('is-warn', warnKeys.includes(key));
      entry.card.classList.toggle('is-danger', dangerKeys.includes(key));
    }
  }
}

export interface ReadoutRow {
  label: string;
  value: string;
  state?: 'good' | 'warn' | 'bad' | 'dim';
}

export interface ReadoutSection {
  title: string;
  meta?: string;
  rows: ReadoutRow[];
}

export function renderReadout(container: HTMLElement, sections: ReadoutSection[]): void {
  container.innerHTML = '';
  for (const sectionData of sections) {
    const grid = el('dl', { class: 'readout-grid' });
    for (const row of sectionData.rows) {
      grid.append(
        el('dt', { text: row.label }),
        el('dd', { class: row.state ? `is-${row.state}` : '', text: row.value })
      );
    }
    container.append(
      el(
        'div',
        { class: 'readout-section' },
        el(
          'div',
          { class: 'readout-title' },
          el('span', { text: sectionData.title }),
          sectionData.meta ? el('em', { text: sectionData.meta }) : null
        ),
        grid
      )
    );
  }
}

function localizeWarning(warning: string): string {
  const rules: Array<[RegExp, string]> = [
    [
      /^needs (\d+)% of the modelled trap force at ([\d.]+) Hz:.*$/,
      '$2 Hz 时模型需要 $1% 的陷阱力：前导饱和，小球会滞后或甩出。降低刷新率、提高绘制强度，或先做 Spin 标定。'
    ],
    [
      /^LOST: at the modelled lateral strength the simulated bead lags the trap by ([\d.]+) mm \(> ([\d.]+) mm, the escape radius\).*$/,
      'LOST：仿真小球滞后陷阱 $1 mm（逃逸半径 $2 mm），会掉球。降低刷新率、提高绘制强度，或提高横向强度。'
    ],
    [
      /^at risk: the bead escapes in the simulation if the trap is (\d+)% weaker than modelled.*$/,
      '风险：如果实际陷阱比模型弱 $1%，仿真小球会逃出。建议做 Spin 标定或留出刷新率余量。'
    ],
    [
      /^simulated bead is pushed ([\d.]+) mm off the trap, near the force peak \(([\d.]+) mm\) where it slips and bends the trail.*$/,
      '仿真小球被推离陷阱 $1 mm，接近力峰（$2 mm），会打滑并弯折轨迹。降低刷新率或提高绘制强度。'
    ],
    [
      /^shape distortion up to ([\d.]+) mm if the lateral strength is (\d+)% off; the spin test calibrates it$/,
      '横向强度偏差 $2% 时形状误差可达 $1 mm；Spin 标定可以校准。'
    ],
    [
      /^device interpolation error ([\d.]+) mm: the path needs more than (\d+) points - slow it down or shrink it$/,
      '设备插值误差 $1 mm：路径需要多于 $2 个点。放慢刷新或缩小图形。'
    ],
    [
      /^refresh ([\d.]+) Hz is below persistence of vision; use a long camera exposure or a smaller shape$/,
      '刷新率 $1 Hz 低于视觉暂留阈值；请用长曝光拍摄，或缩小图形。'
    ],
    [
      /^the figure reaches ([\d.]+) mm off the array axis, where the trap keeps only (\d+)% of its force; centre or shrink it to draw faster$/,
      '图形最远到达距阵列轴 $1 mm，那里陷阱只剩 $2% 的力；把图形移到中心或缩小可以画得更快。'
    ],
    [
      /^the trap is too weak for motion at this level \(model\): raise the draw level or the lateral strength$/,
      '这个强度下模型认为陷阱不足以运动：提高绘制强度或横向强度。'
    ]
  ];
  for (const [pattern, replacement] of rules) {
    if (pattern.test(warning)) return warning.replace(pattern, replacement);
  }
  return warning;
}

export function renderWarnings(container: HTMLElement, warnings: string[]): void {
  container.innerHTML = '';
  if (warnings.length === 0) {
    container.append(
      el('div', { class: 'warning-empty' }, icon('check', 13), el('span', { text: '模型检查通过：轨迹在陷阱能力范围内' }))
    );
    mountIcons(container);
    return;
  }
  for (const warning of warnings) {
    const bad = /^(LOST|at risk)/i.test(warning);
    container.append(
      el(
        'div',
        { class: `warning-item${bad ? ' is-bad' : ''}` },
        el('span', { text: localizeWarning(warning) })
      )
    );
  }
}

export type LogKind = 'info' | 'ok' | 'warn' | 'error';

export class EventLog {
  private readonly lines: Array<{ time: string; text: string; kind: LogKind }> = [];

  constructor(
    private readonly container: HTMLElement,
    private readonly limit = 60
  ) {}

  add(text: string, kind: LogKind = 'info'): void {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;
    this.lines.push({ time, text, kind });
    if (this.lines.length > this.limit) this.lines.shift();
    this.render();
  }

  clear(): void {
    this.lines.length = 0;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    for (const line of [...this.lines].reverse()) {
      this.container.append(
        el(
          'div',
          { class: `log-line is-${line.kind}` },
          el('time', { text: line.time }),
          el('span', { text: line.text })
        )
      );
    }
  }
}

export function setLoading(loading: HTMLElement, textEl: HTMLElement | null, loadingOn: boolean, text?: string): void {
  loading.hidden = !loadingOn;
  if (textEl && text) textEl.textContent = text;
}

export function progressBar(): { root: HTMLElement; set(value: number): void } {
  const fill = el('i');
  const root = el('div', { class: 'progress-bar', attrs: { role: 'progressbar' } }, fill);
  return {
    root,
    set(value: number) {
      fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
      root.setAttribute('aria-valuenow', String(Math.round(value)));
    }
  };
}

export function mount(root: HTMLElement = document.body): void {
  mountIcons(root);
}


