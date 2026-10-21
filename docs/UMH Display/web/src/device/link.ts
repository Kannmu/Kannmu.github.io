/**
 * USB CDC transport over Web Serial: one request, one matching response.
 * Mirrors ``umh_display/device/link.py`` but asynchronous (the browser has no
 * blocking reads) and with the transaction serialised through a promise chain.
 */
import { FrameParser, MSG_ACK, MSG_NACK, FLAG_ERROR, STATUS_NAMES, encodeFrame, type Frame } from './protocol.ts';
import type { SerialPort, SerialPortInfo } from './webSerial.ts';

export class DeviceError extends Error {
  constructor(
    public readonly messageType: number,
    public readonly status: number
  ) {
    super(`device rejected 0x${messageType.toString(16)}: ${STATUS_NAMES[status] ?? String(status)}`);
    this.name = 'DeviceError';
  }
}

interface Pending {
  tid: number;
  expect: number;
  messageType: number;
  resolve: (payload: Uint8Array) => void;
  reject: (error: Error) => void;
  timer: number;
}

export class SerialLink {
  readonly portName: string;
  readonly info: SerialPortInfo;
  private parser = new FrameParser();
  private pending: Pending | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private transaction = 0;
  private closed = false;
  readonly timeoutS = 1.5;
  onDisconnect: (() => void) | null = null;

  private constructor(
    private readonly port: SerialPort,
    label: string
  ) {
    this.info = port.getInfo();
    this.portName = label;
  }

  static async open(port: SerialPort): Promise<SerialLink> {
    await port.open({ baudRate: 2_000_000, bufferSize: 1 << 16 });
    const info = port.getInfo();
    const label = `Web Serial ${info.usbVendorId?.toString(16).padStart(4, '0') ?? '????'}:${
      info.usbProductId?.toString(16).padStart(4, '0') ?? '????'
    }`;
    const link = new SerialLink(port, label);
    link.start();
    port.addEventListener('disconnect', link.handleDisconnect);
    return link;
  }

  private start(): void {
    if (!this.port.readable) throw new Error('串口不可读');
    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable?.getWriter() ?? null;
    if (!this.writer) throw new Error('串口不可写');
    void this.pump();
  }

  private async pump(): Promise<void> {
    try {
      while (!this.closed && this.reader) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (!value || value.length === 0) continue;
        this.parser.feed(value);
        for (;;) {
          const frame = this.parser.next();
          if (!frame) break;
          this.dispatch(frame);
        }
      }
    } catch (error) {
      if (!this.closed) this.failAll(error instanceof Error ? error : new Error(String(error)));
    } finally {
      if (!this.closed) this.handleDisconnect();
    }
  }

  private dispatch(frame: Frame): void {
    const pending = this.pending;
    if (!pending || frame.transactionId !== pending.tid) return; // stale reply
    this.pending = null;
    window.clearTimeout(pending.timer);
    if (frame.messageType === MSG_NACK || (frame.flags & FLAG_ERROR) !== 0) {
      pending.reject(new DeviceError(pending.messageType, frame.payload[0] ?? -1));
      return;
    }
    if (frame.messageType !== pending.expect) {
      pending.reject(
        new Error(
          `0x${pending.messageType.toString(16)}: expected 0x${pending.expect.toString(16)}, got 0x${frame.messageType.toString(16)}`
        )
      );
      return;
    }
    pending.resolve(frame.payload);
  }

  private failAll(error: Error): void {
    if (this.pending) {
      window.clearTimeout(this.pending.timer);
      this.pending.reject(error);
      this.pending = null;
    }
  }

  private handleDisconnect = (): void => {
    if (this.closed) return;
    this.closed = true;
    this.failAll(new Error('设备已断开'));
    this.onDisconnect?.();
  };

  request(
    messageType: number,
    payload: Uint8Array = new Uint8Array(0),
    expect = MSG_ACK,
    timeoutS?: number
  ): Promise<Uint8Array> {
    const run = async (): Promise<Uint8Array> => {
      if (this.closed || !this.writer) throw new Error('串口未连接');
      this.transaction = (this.transaction + 1) >>> 0;
      const tid = this.transaction;
      const timeout = (timeoutS ?? this.timeoutS) * 1000;
      const response = new Promise<Uint8Array>((resolve, reject) => {
        const timer = window.setTimeout(() => {
          if (this.pending?.tid === tid) this.pending = null;
          reject(new Error(`no reply to 0x${messageType.toString(16)} on ${this.portName}`));
        }, timeout);
        this.pending = { tid, expect, messageType, resolve, reject, timer };
      });
      const frame = encodeFrame(messageType, payload, tid);
      await this.writer.write(frame);
      return response;
    };
    // serialise transactions: one outstanding request at a time
    const result = this.queue.then(run, run);
    this.queue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.failAll(new Error('连接已关闭'));
    try {
      this.port.removeEventListener('disconnect', this.handleDisconnect);
      await this.reader?.cancel();
      this.reader?.releaseLock();
      this.writer?.releaseLock();
      await this.port.close();
    } catch {
      /* the device may already be gone */
    }
  }
}

export type { Frame };

