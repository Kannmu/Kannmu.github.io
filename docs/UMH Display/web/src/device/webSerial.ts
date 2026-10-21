/** Structural typings for the Web Serial API (not in lib.dom yet). */

export interface SerialPortInfo {
  usbVendorId?: number;
  usbProductId?: number;
}

export interface SerialPort {
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
  open(options: { baudRate: number; bufferSize?: number }): Promise<void>;
  close(): Promise<void>;
  forget?(): Promise<void>;
  getInfo(): SerialPortInfo;
  addEventListener(type: 'disconnect', listener: () => void): void;
  removeEventListener(type: 'disconnect', listener: () => void): void;
}

export interface SerialApi {
  requestPort(options?: { filters?: Array<{ usbVendorId?: number; usbProductId?: number }> }): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
  addEventListener(type: 'connect' | 'disconnect', listener: (event: Event) => void): void;
  removeEventListener(type: 'connect' | 'disconnect', listener: (event: Event) => void): void;
}

declare global {
  interface Navigator {
    serial?: SerialApi;
  }
}

export const UMH_VID = 0x0483;
export const UMH_PID = 0x5740;

export function serialSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.serial;
}

/** Prefer an already-authorised UMH port; otherwise let the user pick one. */
export async function pickUmhPort(): Promise<SerialPort> {
  const api = navigator.serial;
  if (!api) throw new Error('此浏览器不支持 Web Serial，请使用 Chrome 或 Edge（HTTPS 页面）');
  const ports = await api.getPorts();
  const match = ports.find((port) => {
    const info = port.getInfo();
    return info.usbVendorId === UMH_VID && info.usbProductId === UMH_PID;
  });
  if (match) return match;
  return api.requestPort({ filters: [{ usbVendorId: UMH_VID, usbProductId: UMH_PID }] });
}
