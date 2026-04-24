interface XRSession {
  requestReferenceSpace(type: string): Promise<XRReferenceSpace>;
  updateRenderState(state: XRRenderStateInit): void;
  requestAnimationFrame(callback: XRFrameRequestCallback): number;
  renderState: XRRenderState;
  end(): Promise<void>;
}

interface XRRenderState {
  baseLayer: XRWebGLLayer | null;
}

interface XRRenderStateInit {
  baseLayer?: XRWebGLLayer;
}

interface XRWebGLLayerInit {
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  antialias?: boolean;
}

declare class XRWebGLLayer {
  constructor(session: XRSession, gl: WebGLRenderingContext, options?: XRWebGLLayerInit);
  framebuffer: WebGLFramebuffer;
  getViewport(view: XRView): XRViewport;
}

interface XRViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface XRFrame {
  getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
  session: XRSession;
}

interface XRViewerPose extends XRPose {
  views: XRView[];
}

interface XRPose {
  transform: XRRigidTransform;
  emulatedPosition?: boolean;
}

interface XRRigidTransform {
  position: DOMPointReadOnly;
  orientation: DOMPointReadOnly;
  matrix: Float32Array;
  inverse: XRRigidTransform;
}

interface XRView {
  eye: XREye;
  projectionMatrix: Float32Array;
  transform: XRRigidTransform;
  viewport?: XRViewport;
}

type XREye = 'left' | 'right' | 'none';

interface XRReferenceSpace extends XRSpace {
  getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
}

interface XRSpace {}

interface NavigatorXR {
  xr: XRSystem;
}

interface XRSystem extends EventTarget {
  isSessionSupported(mode: string): Promise<boolean>;
  requestSession(mode: string, options?: XRSessionInit): Promise<XRSession>;
}

interface XRSessionInit {
  requiredFeatures?: string[];
  optionalFeatures?: string[];
}

type XRFrameRequestCallback = (time: number, frame: XRFrame) => void;

interface DOMPointReadOnly {
  x: number;
  y: number;
  z: number;
  w: number;
}
declare class DOMPointReadOnly {
  constructor(x?: number, y?: number, z?: number, w?: number);
}
