/** Main-thread RPC wrapper around the planning worker. */
import type { AppConfig } from '../config/types.ts';
import type { Plan } from '../motion/planner.ts';
import { MotionPoint } from '../device/protocol.ts';
import type { FieldMap } from '../ui/charts.ts';

interface Pending {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

/** Worker results lose class prototypes; rebuild the points the device layer packs. */
export function hydratePlan(raw: Plan): Plan {
  return {
    ...raw,
    points: raw.points.map((point) => new MotionPoint(point.xUm, point.yUm, point.zUm, point.level, point.palette))
  };
}

export class PlanClient {
  private readonly worker: Worker;
  private readonly pending = new Map<number, Pending>();
  private nextId = 1;
  private ready: Promise<void> | null = null;

  constructor() {
    this.worker = new Worker(new URL('../worker/planWorker.ts', import.meta.url), { type: 'module' });
    this.worker.addEventListener('message', this.onMessage);
    this.worker.addEventListener('error', (event) => {
      for (const pending of this.pending.values()) pending.reject(new Error(event.message || '规划线程出错'));
      this.pending.clear();
    });
  }

  private onMessage = (event: MessageEvent<Record<string, unknown>>): void => {
    const message = event.data;
    const id = Number(message.id ?? -1);
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);
    if (message.type === 'ready') {
      pending.resolve(message.ms);
      return;
    }
    if (message.type === 'error') {
      pending.reject(new Error(String(message.message ?? 'worker error')));
      return;
    }
    if (message.type === 'plan-result') pending.resolve(hydratePlan(message.plan as Plan));
    else pending.resolve(message.map ?? message.ms);
  };

  private request<T>(message: Record<string, unknown>): Promise<T> {
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
      this.worker.postMessage({ ...message, id });
    });
  }

  /** Warm the field-shape caches; resolves when the worker is ready. */
  warm(): Promise<void> {
    if (!this.ready) {
      this.ready = this.request<void>({ type: 'warmup' }).then(() => undefined);
    }
    return this.ready;
  }

  async plan(cfg: AppConfig, name: string, maxPoints?: number, periodS?: number): Promise<Plan> {
    return this.request<Plan>({ type: 'plan', cfg, name, maxPoints, periodS });
  }

  async displayField(options: {
    mode: number;
    tableDistanceMm: number;
    focusOffsetMm: number;
    radiusMm?: number;
    phaseSpan?: number;
    heightMm: number;
    extentMm: number;
    grid: number;
    bead: { diameterMm: number; densityKgM3: number };
  }): Promise<FieldMap> {
    return this.request<FieldMap>({ type: 'display-field', ...options });
  }

  dispose(): void {
    this.worker.terminate();
    for (const pending of this.pending.values()) pending.reject(new Error('planning worker disposed'));
    this.pending.clear();
  }
}

