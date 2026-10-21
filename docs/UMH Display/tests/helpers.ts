import { readFileSync } from 'node:fs';

export function fixture<T = unknown>(name: string): T {
  const url = new URL(`./fixtures/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, 'utf8')) as T;
}

export function expectClose(actual: number, expected: number, tol = 1e-9): void {
  if (!Number.isFinite(expected)) {
    if (Number.isFinite(actual)) throw new Error(`expected ${expected}, got ${actual}`);
    return;
  }
  const scale = Math.max(1, Math.abs(expected));
  if (Math.abs(actual - expected) > tol * scale) {
    throw new Error(`expected ${expected}, got ${actual} (|d|=${Math.abs(actual - expected)})`);
  }
}

export function expectArrayClose(
  actual: ArrayLike<number>,
  expected: ArrayLike<number | null>,
  tol = 1e-9,
  label = ''
): void {
  if (actual.length !== expected.length) {
    throw new Error(`${label}: length ${actual.length} != ${expected.length}`);
  }
  for (let i = 0; i < expected.length; i++) {
    const want = expected[i];
    if (want === null || !Number.isFinite(want)) {
      if (Number.isFinite(actual[i])) throw new Error(`${label}[${i}]: expected NaN, got ${actual[i]}`);
      continue;
    }
    const got = actual[i];
    if (Math.abs(got - want) > tol * Math.max(1, Math.abs(want))) {
      throw new Error(`${label}[${i}]: expected ${want}, got ${got}`);
    }
  }
}

export function hex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}
