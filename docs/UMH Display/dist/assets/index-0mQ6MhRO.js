(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Yl=9.81;function pl(i,t,e){return i<t?t:i>e?e:i}function gd(i){const t=Math.floor(i),e=i-t;return e>.5?t+1:e<.5||t%2===0?t:t+1}function ma(i,t,e){const n=new Float64Array(e);if(e===1)return n[0]=i,n;const s=(t-i)/(e-1);for(let r=0;r<e;r++)n[r]=i+s*r;return n}function _d(i,t,e){const n=t.length;if(n===0)return NaN;if(n===1||i<=t[0])return e[0];if(i>=t[n-1])return e[n-1];let s=0,r=n-1;for(;r-s>1;){const a=s+r>>1;t[a]<=i?s=a:r=a}const o=t[r]-t[s];return o<=0?e[s]:e[s]+(e[r]-e[s])*(i-t[s])/o}function $l(i,t){const e=i.length,n=new Float64Array(e);if(e<2)return n;n[0]=(i[1]-i[0])/(t[1]-t[0]),n[e-1]=(i[e-1]-i[e-2])/(t[e-1]-t[e-2]);for(let s=1;s<e-1;s++)n[s]=(i[s+1]-i[s-1])/(t[s+1]-t[s-1]);return n}function vd(i,t){const e=Math.sqrt(i*i+t*t);return e>1e-12?[i/e,t/e]:[0,0]}function Md(i,t,e,n){if(i===0&&t===0||e===0&&n===0)return 0;const s=i*e+t*n;return Math.acos(pl(s,-1,1))}function an(i){return!Number.isFinite(i)||i<0?"—":i<1e3?`${i<10?i.toFixed(2):i.toFixed(0)} ms`:i<6e4?`${(i/1e3).toFixed(i<1e4?2:1)} s`:i<36e5?`${(i/6e4).toFixed(2)} min`:`${(i/36e5).toFixed(2)} h`}const qh=3,ml="umh-display.config.v3",jh="umh-display.ui.v1",xd=7,Yr={focus:0,twinz:1,twiny:2,ring:3,vortex:4,duallring:5},ga={focus:"单焦点",twinz:"轴向双焦",twiny:"横向双焦",ring:"环形",vortex:"涡旋",duallring:"双环"};function yd(){return[255,40,0]}function Sd(){return[0,90,255]}function $r(){return{port:"",configVersion:qh,bead:{diameterMm:3,densityKgM3:25},trap:{field:"focus",level:88,tableDistanceMm:95,focusOffsetMm:0,patternRadiusMm:2,phaseSpan:0,mount:"down",lateralAccels:{focus:200,vortex:40,twinz:120,twiny:60,ring:40,duallring:45},dropLevels:{},extraDampingRatio:.02},planner:{outputRateHz:2e3,accelFraction:.6,maxSpeedMmS:5e3,drawLevel:255,jerkTimeMs:8,cornerRadiusMm:1.2,cornerMode:"round",sampleStepMm:.05,maxPoints:1024,interpolation:"catmull",rampMs:600,seekSpeedMmS:40,seekAccelMmS2:400,robustForceError:.2,maxTrackingErrorMm:1.2,minPeriodMs:5},display:{sizeMm:16,centerXMm:0,centerYMm:0,text:"HI",textHeightMm:8,refreshHz:0,colorScheme:"wheel",colorA:yd(),colorB:Sd(),hueSpinRevS:.25,brightness:1,gamma:2.2,evenLines:.8,hoverBrightness:.15},unlimited:{enabled:!1,loopMs:2e3,rate:1,speedMmS:2,accelMmS2:5},ulm:{enabled:!1,frequencyHz:120,amplitudeUm:0,waveSpeedMmS:0,axis:"ring",sawtooth:!1},holo:{shapes:["circle","square"],transitionMs:1200,outputRateHz:200,level:128,loopMs:0,holdLast:!1,gamma:!0}}}function bd(i,t){const e=i*5e-4;return t*4/3*Math.PI*e**3}function Mi(i){return Yr[i.trap.field]??0}function qr(i){return i.trap.lateralAccels[i.trap.field]??200}function ql(i,t){i.trap.lateralAccels={...i.trap.lateralAccels,[i.trap.field]:t}}function _o(i){return xd+i.trap.tableDistanceMm+i.trap.focusOffsetMm}function Ed(i){const t=i.trap.dropLevels[i.trap.field];return typeof t=="number"&&Number.isFinite(t)?t:null}function vn(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function Yt(i,t,e=-1/0,n=1/0){const s=typeof i=="number"?i:Number(i);return Number.isFinite(s)?Math.min(n,Math.max(e,s)):t}function Oe(i,t,e,n){return Math.round(Yt(i,t,e,n))}function Gn(i,t){return typeof i=="string"?i:t}function gs(i,t){return typeof i=="boolean"?i:t}function jl(i,t){return Array.isArray(i)&&i.length>=3?[Oe(i[0],t[0],0,255),Oe(i[1],t[1],0,255),Oe(i[2],t[2],0,255)]:[...t]}function Kl(i){const t={};if(vn(i))for(const[e,n]of Object.entries(i)){const s=Number(n);Number.isFinite(s)&&(t[e]=s)}return t}function Kh(i){const t=$r();if(!vn(i))return t;t.port=Gn(i.port,t.port);const e=vn(i.bead)?i.bead:{};t.bead.diameterMm=Yt(e.diameter_mm??e.diameterMm,t.bead.diameterMm,.5,20),t.bead.densityKgM3=Yt(e.density_kg_m3??e.densityKgM3,t.bead.densityKgM3,1,500);const n=vn(i.trap)?i.trap:{},s=Gn(n.field,t.trap.field);t.trap.field=Object.prototype.hasOwnProperty.call(Yr,s)?s:"focus",t.trap.level=Oe(n.level,t.trap.level,1,255),t.trap.tableDistanceMm=Yt(n.table_distance_mm??n.tableDistanceMm,t.trap.tableDistanceMm,10,400),t.trap.focusOffsetMm=Yt(n.focus_offset_mm??n.focusOffsetMm,t.trap.focusOffsetMm,-95,95),t.trap.patternRadiusMm=Yt(n.pattern_radius_mm??n.patternRadiusMm,t.trap.patternRadiusMm,.5,20),t.trap.phaseSpan=Oe(n.phase_span??n.phaseSpan,t.trap.phaseSpan,0,255),t.trap.mount=Gn(n.mount,t.trap.mount)==="side"?"side":"down",t.trap.lateralAccels={...t.trap.lateralAccels,...Kl(n.lateral_accels??n.lateralAccels)},t.trap.dropLevels={...t.trap.dropLevels,...Kl(n.drop_levels??n.dropLevels)},t.trap.extraDampingRatio=Yt(n.extra_damping_ratio??n.extraDampingRatio,t.trap.extraDampingRatio,0,.5);const r=vn(i.planner)?i.planner:{};t.planner.outputRateHz=Oe(r.output_rate_hz??r.outputRateHz,t.planner.outputRateHz,50,4e3),t.planner.accelFraction=Yt(r.accel_fraction??r.accelFraction,t.planner.accelFraction,.01,2),t.planner.maxSpeedMmS=Yt(r.max_speed_mm_s??r.maxSpeedMmS,t.planner.maxSpeedMmS,1,2e4),t.planner.drawLevel=Oe(r.draw_level??r.drawLevel,t.planner.drawLevel,0,255),t.planner.jerkTimeMs=Yt(r.jerk_time_ms??r.jerkTimeMs,t.planner.jerkTimeMs,0,100),t.planner.cornerRadiusMm=Yt(r.corner_radius_mm??r.cornerRadiusMm,t.planner.cornerRadiusMm,0,20);const o=Gn(r.corner_mode??r.cornerMode,t.planner.cornerMode);t.planner.cornerMode=o==="stop"?"stop":"round",t.planner.sampleStepMm=Yt(r.sample_step_mm??r.sampleStepMm,t.planner.sampleStepMm,.01,1),t.planner.maxPoints=Oe(r.max_points??r.maxPoints,t.planner.maxPoints,32,1024);const a=Gn(r.interpolation,t.planner.interpolation);t.planner.interpolation=a==="linear"?"linear":"catmull",t.planner.rampMs=Oe(r.ramp_ms??r.rampMs,t.planner.rampMs,0,1e4),t.planner.seekSpeedMmS=Yt(r.seek_speed_mm_s??r.seekSpeedMmS,t.planner.seekSpeedMmS,1,500),t.planner.seekAccelMmS2=Yt(r.seek_accel_mm_s2??r.seekAccelMmS2,t.planner.seekAccelMmS2,10,1e4),t.planner.robustForceError=Yt(r.robust_force_error??r.robustForceError,t.planner.robustForceError,0,.9),t.planner.maxTrackingErrorMm=Yt(r.max_tracking_error_mm??r.maxTrackingErrorMm,t.planner.maxTrackingErrorMm,.1,20),t.planner.minPeriodMs=Yt(r.min_period_ms??r.minPeriodMs,t.planner.minPeriodMs,1,1e3);const l=vn(i.display)?i.display:{};t.display.sizeMm=Yt(l.size_mm??l.sizeMm,t.display.sizeMm,2,80),t.display.centerXMm=Yt(l.center_x_mm??l.centerXMm,t.display.centerXMm,-40,40),t.display.centerYMm=Yt(l.center_y_mm??l.centerYMm,t.display.centerYMm,-40,40),t.display.text=Gn(l.text,t.display.text).slice(0,24),t.display.textHeightMm=Yt(l.text_height_mm??l.textHeightMm,t.display.textHeightMm,2,40),t.display.refreshHz=Yt(l.refresh_hz??l.refreshHz,t.display.refreshHz,0,200);const c=Gn(l.color_scheme??l.colorScheme,t.display.colorScheme);t.display.colorScheme=["wheel","gradient","solid"].includes(c)?c:"wheel",t.display.colorA=jl(l.color_a??l.colorA,t.display.colorA),t.display.colorB=jl(l.color_b??l.colorB,t.display.colorB),t.display.hueSpinRevS=Yt(l.hue_spin_rev_s??l.hueSpinRevS,t.display.hueSpinRevS,0,1.55),t.display.brightness=Yt(l.brightness,t.display.brightness,0,1),t.display.gamma=Yt(l.gamma,t.display.gamma,.5,4),t.display.evenLines=Yt(l.even_lines??l.evenLines,t.display.evenLines,0,1),t.display.hoverBrightness=Yt(l.hover_brightness??l.hoverBrightness,t.display.hoverBrightness,0,1);const u=vn(i.unlimited)?i.unlimited:{};t.unlimited.enabled=gs(u.enabled,t.unlimited.enabled),t.unlimited.loopMs=Oe(u.loop_ms??u.loopMs,t.unlimited.loopMs,1,6e4),t.unlimited.rate=Yt(u.rate,t.unlimited.rate,.001,1),t.unlimited.speedMmS=Yt(u.speed_mm_s??u.speedMmS,t.unlimited.speedMmS,.01,50),t.unlimited.accelMmS2=Yt(u.accel_mm_s2??u.accelMmS2,t.unlimited.accelMmS2,.01,500);const h=vn(i.ulm)?i.ulm:{};t.ulm.enabled=gs(h.enabled,t.ulm.enabled),t.ulm.frequencyHz=Oe(h.frequency_hz??h.frequencyHz,t.ulm.frequencyHz,1,1e3),t.ulm.amplitudeUm=Yt(h.amplitude_um??h.amplitudeUm,t.ulm.amplitudeUm,0,5e4),t.ulm.waveSpeedMmS=Yt(h.wave_speed_mm_s??h.waveSpeedMmS,t.ulm.waveSpeedMmS,0,1e4);const d=Gn(h.axis,t.ulm.axis);t.ulm.axis=["x","y","ring"].includes(d)?d:"ring",t.ulm.sawtooth=gs(h.sawtooth,t.ulm.sawtooth);const p=vn(i.holo)?i.holo:{},_=Array.isArray(p.shapes)?p.shapes.filter(m=>typeof m=="string"):null;t.holo.shapes=_&&_.length>0?_.slice(0,10):t.holo.shapes,t.holo.transitionMs=Oe(p.transition_ms??p.transitionMs,t.holo.transitionMs,50,1e4),t.holo.outputRateHz=Oe(p.output_rate_hz??p.outputRateHz,t.holo.outputRateHz,10,1e3),t.holo.level=Oe(p.level,t.holo.level,0,128),t.holo.loopMs=Oe(p.loop_ms??p.loopMs,t.holo.loopMs,0,6e4),t.holo.holdLast=gs(p.hold_last??p.holdLast,t.holo.holdLast),t.holo.gamma=gs(p.gamma,t.holo.gamma);const g=Oe(i.config_version??i.configVersion,1,1,999);if(g<2){const m={outputRateHz:[1500,2e3],maxPoints:[255,1024],minPeriodMs:[60,20]};for(const[f,[w,E]]of Object.entries(m))t.planner[f]===w&&(t.planner[f]=E)}if(g<3){const m=$r(),f=["accelFraction","maxSpeedMmS","jerkTimeMs","robustForceError","outputRateHz","cornerMode","minPeriodMs"];for(const E of f)t.planner[E]=m.planner[E];const w=Number((vn(i.display)?i.display.period_ms:0)??0);t.display.refreshHz=w>0?1e3/w:0,t.bead.diameterMm===3.5&&(t.bead.diameterMm=3)}return t.configVersion=qh,t}function wd(){try{const i=localStorage.getItem(ml);return i?Kh(JSON.parse(i)):$r()}catch{return $r()}}function vo(i){try{localStorage.setItem(ml,JSON.stringify(i))}catch{}}function Td(){try{localStorage.removeItem(ml)}catch{}}async function Ad(i){const t=await i.text();return Kh(JSON.parse(t))}function Rd(i){const t=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download="umh-display-config.json",e.click(),setTimeout(()=>URL.revokeObjectURL(e.href),1e3)}const jr=7,gl=4e4,la=343,xn=[[-26,-35],[-43.3,-15],[8.6,-45],[-0,-30],[-26,-25],[-0,-10],[-26,-5],[-0,-40],[-17.4,-30],[-17.4,-20],[-17.3,-10],[-43.3,-5],[-8.7,-35],[-34.7,-30],[-34.7,-20],[-8.7,-25],[-8.7,-15],[-26,-15],[-34.7,-10],[-34.7,0],[-8.7,-5],[0,10],[-17.3,0],[0,30],[-8.7,25],[-8.7,5],[-34.7,10],[-26,25],[-8.7,45],[-17.3,40],[-26,5],[-43.3,15],[-26,35],[-8.7,35],[-8.7,15],[-34.7,20],[-17.3,30],[-17.3,20],[-26,15],[-17.3,10],[-43.3,5],[-34.6,30],[0,20],[43.3,15],[0,40],[17.4,40],[26,35],[8.7,45],[8.7,25],[17.3,30],[8.7,5],[34.7,-0],[34.7,10],[8.7,35],[17.3,20],[8.7,15],[17.3,10],[17.4,-0],[34.7,30],[26,25],[34.7,20],[26,15],[26,5],[8.6,-35],[26,-25],[-0,-20],[26,-15],[17.3,-20],[43.3,-15],[26,-5],[-8.7,-45],[26,-35],[43.3,5],[-17.4,-40],[17.3,-30],[17.3,-40],[34.7,-30],[34.7,-20],[17.4,-10],[43.3,-5],[8.6,-25],[8.6,-15],[34.7,-10],[8.7,-5]];function _l(i){const t=xn.length,e=new Float64Array(t*3);if(i&&i.length>=t)for(let n=0;n<t;n++)e[n*3]=i[n][0]*1e-6,e[n*3+1]=i[n][1]*1e-6,e[n*3+2]=i[n][2]*1e-6;else for(let n=0;n<t;n++)e[n*3]=xn[n][0]*.001,e[n*3+1]=xn[n][1]*.001,e[n*3+2]=jr*.001;return{xyz:e,count:t}}const Zh=85,Jh=170,Cd=7,Fn=16,Mo=2048,Pd=1,Ld=2,Ud=3,Dd=4,Id=35,Zl=98,Nd=99,Fd=100,Od=101,Bd=102,Jl=103,zd=104,Hd=160,kd=161,Gd=162,Vd=163,Ql=165,Or=112,Wd=113,Xd=1,Yd=16,$d={0:"OK",1:"BAD_HEADER",2:"BAD_LENGTH",3:"BAD_SEQUENCE",4:"NO_MEMORY",5:"UNSUPPORTED",6:"INVALID_STATE",7:"BUSY",8:"IO",9:"CRC"},Qh=256,tu=512,eu=2048,nu=4096,iu=8192,qd=1,su=2,jd=4,_a=1024,tc=2048,ec=4096,xo=0,ru=1,nc=2,va=4,ic=8,Kd=16,Zd=128,au=4,Jd=5,Qd=1,tf=2,ef=3,nf=128,sf=1,rf=2,ou=1,af=2,lu={0:"OFF",1:"READY",2:"RUNNING",3:"STOPPING",4:"FAULT"},os=255,yo=1024,of=16,ts=1e3,lf=50,cf=4e3,hf=6e4;function uf(i,t=new Uint8Array(0),e,n=0,s=Xd){const r=t instanceof Uint8Array?t:Uint8Array.from(t);if(r.length>Mo)throw new Error(`payload ${r.length} > ${Mo}`);const o=new Uint8Array(Fn+r.length),a=new DataView(o.buffer);return o[0]=Zh,o[1]=Jh,o[2]=Cd,o[3]=i&255,o[4]=s&255,o[5]=Fn,a.setUint16(6,r.length,!0),a.setUint32(8,e>>>0,!0),a.setUint32(12,n>>>0,!0),o.set(r,Fn),o}class df{buffer=new Uint8Array(0);feed(t){if(t.length===0)return;const e=new Uint8Array(this.buffer.length+t.length);e.set(this.buffer,0),e.set(t,this.buffer.length),this.buffer=e}next(){for(;this.buffer.length>=Fn;){if(this.buffer[0]!==Zh||this.buffer[1]!==Jh||this.buffer[5]!==Fn){this.buffer=this.buffer.subarray(1);continue}const t=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength),e=t.getUint16(6,!0);if(e>Mo){this.buffer=this.buffer.subarray(1);continue}if(this.buffer.length<Fn+e)return null;const n={messageType:this.buffer[3],flags:this.buffer[4],transactionId:t.getUint32(8,!0),streamSequence:t.getUint32(12,!0),payload:this.buffer.slice(Fn,Fn+e)};return this.buffer=this.buffer.subarray(Fn+e),n}return null}reset(){this.buffer=new Uint8Array(0)}}function ce(i,t,e){return Math.max(t,Math.min(e,gd(i)))}class Kr{constructor(t,e,n,s=255,r=0){this.xUm=t,this.yUm=e,this.zUm=n,this.level=s,this.palette=r}xUm;yUm;zUm;level;palette;pack(){const t=new Uint8Array(8),e=new DataView(t.buffer);return e.setInt16(0,ce(this.xUm/10,-32767,32767),!0),e.setInt16(2,ce(this.yUm/10,-32767,32767),!0),e.setInt16(4,ce(this.zUm/10,-32767,32767),!0),t[6]=ce(this.level,0,255),t[7]=ce(this.palette,0,255),t}}function ff(i,t=!1){if(i.length>os)throw new Error(`${i.length} points > ${os}`);const e=new Uint8Array(8+i.length*8),n=new DataView(e.buffer);return e[0]=1,e[1]=t?ou:0,n.setUint16(2,i.length,!0),i.forEach((s,r)=>e.set(s.pack(),8+r*8)),e}function pf(i,t=!1){const e=i.length;if(e>yo)throw new Error(`${e} points > ${yo}`);const n=af|(t?ou:0),s=[];for(let r=0;r<Math.max(e,1);r+=os){const o=i.slice(r,r+os),a=new Uint8Array(8+o.length*8),l=new DataView(a.buffer);a[0]=1,a[1]=n,l.setUint16(2,o.length,!0),l.setUint16(4,r,!0),l.setUint16(6,e,!0),o.forEach((c,u)=>a.set(c.pack(),8+u*8)),s.push(a)}return s}function mf(i){return i.pack()}function gf(i,t){const e=new Uint8Array(4),n=new DataView(e.buffer);return n.setUint16(0,ce(i*ts,0,ts),!0),n.setUint16(2,ce(t,0,65535),!0),e}class Br{mode;flags;outputRateHz;loopMs;maxSpeedMmS;maxAccelMmS2;zOffsetUm;level;trapMode;trapRadiusUm;trapPhaseSpan;palette;paletteSpinX10;pathSpinMradS;ulmFrequencyHz;ulmAmplitudeUm;ulmWaveSpeedMmS;ulmAxis;displayFlags;rateInitial;rateTarget;rateRampMs;constructor(t={}){this.mode=t.mode??ru,this.flags=t.flags??0,this.outputRateHz=t.outputRateHz??1e3,this.loopMs=t.loopMs??1e3,this.maxSpeedMmS=t.maxSpeedMmS??60,this.maxAccelMmS2=t.maxAccelMmS2??600,this.zOffsetUm=t.zOffsetUm??0,this.level=t.level??111,this.trapMode=t.trapMode??au,this.trapRadiusUm=t.trapRadiusUm??0,this.trapPhaseSpan=t.trapPhaseSpan??0,this.palette=t.palette??[[255,255,255]],this.paletteSpinX10=t.paletteSpinX10??0,this.pathSpinMradS=t.pathSpinMradS??0,this.ulmFrequencyHz=t.ulmFrequencyHz??0,this.ulmAmplitudeUm=t.ulmAmplitudeUm??0,this.ulmWaveSpeedMmS=t.ulmWaveSpeedMmS??0,this.ulmAxis=t.ulmAxis??0,this.displayFlags=t.displayFlags??sf|rf,this.rateInitial=t.rateInitial??1,this.rateTarget=t.rateTarget??1,this.rateRampMs=t.rateRampMs??0}pack(){if(this.outputRateHz<lf||this.outputRateHz>cf)throw new Error(`output rate ${this.outputRateHz} Hz out of range`);if(this.loopMs<1||this.loopMs>hf)throw new Error(`loop_ms ${this.loopMs} out of range`);if(this.trapMode<0||this.trapMode>Jd)throw new Error(`trap mode ${this.trapMode} is not one of the firmware patterns`);if(this.palette.length<1||this.palette.length>of)throw new Error("palette needs 1..16 colours");if(this.ulmFrequencyHz<0||this.ulmFrequencyHz>1e3)throw new Error(`ulm frequency ${this.ulmFrequencyHz} Hz out of range`);if(this.ulmWaveSpeedMmS<0||this.ulmWaveSpeedMmS>1e4)throw new Error("ulm wave speed out of range");if((this.ulmAxis&124)!==0)throw new Error("ulm axis bit2..6 must be zero");const t=new Uint8Array(84),e=new DataView(t.buffer);return t[0]=this.mode,t[1]=this.flags&255,e.setUint16(2,this.outputRateHz,!0),e.setUint16(4,this.loopMs,!0),e.setUint16(6,ce(this.maxSpeedMmS,0,1e4),!0),e.setUint16(8,ce(this.maxAccelMmS2,0,65535),!0),e.setInt16(10,ce(this.zOffsetUm/10,-32767,32767),!0),t[12]=ce(this.level,0,255),t[13]=this.trapMode,e.setUint16(14,ce(this.trapRadiusUm/10,0,5e4),!0),t[16]=this.trapPhaseSpan&255,t[17]=this.palette.length,this.palette.forEach(([n,s,r],o)=>{t[18+3*o]=ce(n,0,255),t[19+3*o]=ce(s,0,255),t[20+3*o]=ce(r,0,255)}),t[66]=ce(this.paletteSpinX10,0,250),e.setInt16(67,ce(this.pathSpinMradS,-32767,32767),!0),e.setUint16(69,ce(this.ulmFrequencyHz,0,1e3),!0),e.setUint16(71,ce(this.ulmAmplitudeUm/10,0,32767),!0),e.setUint16(73,ce(this.ulmWaveSpeedMmS,0,1e4),!0),t[75]=this.ulmAxis&255,t[76]=this.displayFlags&255,e.setUint16(78,ce(this.rateInitial*ts,0,ts),!0),e.setUint16(80,ce(this.rateTarget*ts,0,ts),!0),e.setUint16(82,ce(this.rateRampMs,0,65535),!0),t}}function _f(i){if(i.length!==52)throw new Error(`motion status length ${i.length}`);const t=new DataView(i.buffer,i.byteOffset,i.byteLength),e=i[0];return{state:e,flags:i[1],outputRateHz:t.getUint16(2,!0),pathPoints:t.getUint16(4,!0),loopMs:t.getUint16(6,!0),xUm:t.getInt32(8,!0),yUm:t.getInt32(12,!0),zUm:t.getInt32(16,!0),level:i[20],trapMode:i[21],phase:t.getUint16(22,!0)/65536,serviceMaxUs:t.getUint16(24,!0),serviceAvgUs:t.getUint16(26,!0),renderMaxUs:t.getUint16(28,!0),renderAvgUs:t.getUint16(30,!0),submitMaxUs:t.getUint16(32,!0),submitAvgUs:t.getUint16(34,!0),frames:t.getUint32(36,!0),missedDeadlines:t.getUint32(40,!0),frameErrors:t.getUint32(44,!0),fps:t.getUint32(48,!0)/100,stateName:lu[e]??String(e),running:e===2||e===3}}function sc(i,t,e){const n=i.subarray(t,e),s=n.indexOf(0),r=s>=0?n.subarray(0,s):n;return new TextDecoder("ascii").decode(r)}function vf(i){if(i.length!==1118)throw new Error(`profile length ${i.length}`);const t=new DataView(i.buffer,i.byteOffset,i.byteLength),e=t.getUint16(64,!0),n=t.getUint32(80,!0),s=t.getUint32(84,!0),r=t.getUint32(106,!0),o=[];for(let a=0;a<e;a++){const l=110+12*a;o.push([t.getInt32(l,!0),t.getInt32(l+4,!0),t.getInt32(l+8,!0)])}return{model:sc(i,0,16),firmware:sc(i,16,32),channelCount:e,carrierHz:n,soundSpeedUmS:s,capabilityFlags:r,coordinatesUm:o,hasDisplay:(r&nu)!==0,hasMotion:(r&tu)!==0,hasHologram:(r&eu)!==0,hasFocusAm:(r&Qh)!==0,maxPathPoints:r&iu?yo:os}}function Mf(i){if(i.length!==8)throw new Error(`status length ${i.length}`);return new DataView(i.buffer,i.byteOffset,i.byteLength).getUint32(0,!0)}const Qe=84,ks=10,Zr=11,cu=10,hu=1e3,rc=6e4,Ma=128,ac=2*Qe,xf=1,yf=2,uu=4;function Sf(i){if(i.phase.length!==Qe||i.level.length!==Qe)throw new Error(`hologram keyframe needs ${Qe} channels`)}function bf(i,t){if(t.length===0||t.length>Zr)throw new Error(`hologram upload carries 1..${Zr} keyframes`);if(i<0||i+t.length>ks)throw new Error(`keyframes ${i}..${i+t.length} exceed ${ks}`);const e=new Uint8Array(12+t.length*ac),n=new DataView(e.buffer);return e[0]=1,e[1]=0,n.setUint16(2,i,!0),n.setUint16(4,t.length,!0),t.forEach((s,r)=>{Sf(s);const o=12+r*ac;e.set(s.phase,o),e.set(s.level,o+Qe)}),e}class du{version=1;flags;outputRateHz;loopMs;transitionMs;level;keyframes;constructor(t={}){this.flags=t.flags??uu,this.outputRateHz=t.outputRateHz??200,this.loopMs=t.loopMs??0,this.transitionMs=t.transitionMs??3e3,this.level=t.level??Ma,this.keyframes=t.keyframes??1}pack(){if(this.outputRateHz<cu||this.outputRateHz>hu)throw new Error(`hologram rate ${this.outputRateHz} Hz out of range`);if(this.transitionMs<0||this.transitionMs>rc)throw new Error(`hologram transition ${this.transitionMs} ms out of range`);if(this.level<0||this.level>Ma)throw new Error("hologram level must be 0..128");const t=Math.max(1,Math.min(ks,Math.round(this.keyframes))),e=new Uint8Array(12),n=new DataView(e.buffer);return e[0]=this.version,e[1]=this.flags&15,n.setUint16(2,Math.round(this.outputRateHz),!0),n.setUint16(4,ce(this.loopMs,0,65535),!0),n.setUint16(6,ce(this.transitionMs,0,rc),!0),e[8]=ce(this.level,0,Ma),e[9]=t,e}}function Ef(i){if(i.length!==42)throw new Error(`hologram status length ${i.length}`);const t=new DataView(i.buffer,i.byteOffset,i.byteLength),e=i[0];return{state:e,flags:i[1],outputRateHz:t.getUint16(2,!0),keyframeCount:t.getUint16(4,!0),currentKeyframe:t.getUint16(6,!0),alpha:t.getUint16(8,!0)/1e3,serviceMaxUs:t.getUint16(10,!0),serviceAvgUs:t.getUint16(12,!0),renderMaxUs:t.getUint16(14,!0),renderAvgUs:t.getUint16(16,!0),submitMaxUs:t.getUint16(18,!0),submitAvgUs:t.getUint16(20,!0),frames:t.getUint32(22,!0),skipped:t.getUint32(26,!0),missedDeadlines:t.getUint32(30,!0),frameErrors:t.getUint32(34,!0),fps:t.getUint32(38,!0)/100,stateName:lu[e]??String(e),running:e===2||e===3}}function wf(){const i=Qh|tu|eu|nu|iu;return{model:"UMH-84 demo",firmware:"7.5.1-demo",channelCount:xn.length,carrierHz:4e4,soundSpeedUmS:343e6,capabilityFlags:i,coordinatesUm:xn.map(([t,e])=>[Math.round(t*1e3),Math.round(e*1e3),jr*1e3]),hasDisplay:!0,hasMotion:!0,hasHologram:!0,hasFocusAm:!0,maxPathPoints:1024}}function Tf(i){const t=Math.max(0,Math.min(1,i));return t*t*(3-2*t)}class oc{profile=wf();label="演示设备 · UMH-84";hasHologram=!0;points=[];config=new Br({trapMode:au});targetX=0;targetY=0;level=88;running=!1;hover=!1;pathMode=!1;startedAt=0;phase=0;loopMs=1e3;rateTarget=1;rateInitial=1;rampMs=0;holo=[];holoConfig=new du({keyframes:1,transitionMs:3e3});holoRunning=!1;holoStopping=!1;holoStartedAt=0;holoFrames=0;holoSkipped=0;holoState="off";async systemFlags(){let t=qd|jd;return(this.hover||this.running||this.holoRunning||this.holoStopping)&&(t|=su),t}async motionStatus(){const t=performance.now();let e=this.targetX,n=this.targetY;if(this.pathMode&&this.running&&this.points.length>0){const r=(t-this.startedAt)/1e3,o=this.rampMs/1e3;let a;o>0&&r<o?a=this.rateInitial+(this.rateTarget-this.rateInitial)*Tf(r/o):a=this.rateTarget;const l=Math.max(.005,this.loopMs/1e3);this.phase=(this.phase+a*.001/l)%1;const c=this.points.length,u=this.phase*c,h=Math.floor(u)%c,d=(h+1)%c,p=u-Math.floor(u);e=(this.points[h].xUm*(1-p)+this.points[d].xUm*p)/1e3,n=(this.points[h].yUm*(1-p)+this.points[d].yUm*p)/1e3}return{state:this.running?2:this.hover?1:0,flags:this.pathMode?14:6,outputRateHz:this.config.outputRateHz,pathPoints:this.points.length,loopMs:this.loopMs,xUm:Math.round(e*1e3),yUm:Math.round(n*1e3),zUm:102e3,level:this.level,trapMode:this.config.trapMode,phase:this.phase,serviceMaxUs:42,serviceAvgUs:21,renderMaxUs:61,renderAvgUs:33,submitMaxUs:9,submitAvgUs:4,frames:Math.floor(t/5),missedDeadlines:0,frameErrors:0,fps:this.config.outputRateHz,stateName:this.running?"RUNNING":this.hover?"READY":"OFF",running:this.running}}async upload(t,e=!1){if(t.length>this.profile.maxPathPoints)throw new Error("演示设备路径点数超限");this.points=t.map(n=>new Kr(n.xUm,n.yUm,n.zUm,n.level,n.palette)),this.points.length>0&&(this.targetX=this.points[0].xUm/1e3,this.targetY=this.points[0].yUm/1e3)}async configure(t){this.config=t,this.level=t.level,this.loopMs=t.loopMs,this.rateInitial=t.rateInitial,this.rateTarget=t.rateTarget,this.rampMs=t.rateRampMs,this.pathMode=t.mode===xo,this.running=this.pathMode,this.hover=!0,this.startedAt=performance.now(),this.pathMode&&(this.phase=0)}async target(t){this.targetX=t.xUm/1e3,this.targetY=t.yUm/1e3,this.level=t.level}async rate(t,e){this.rateTarget=t,this.rampMs=e,this.startedAt=performance.now()}async start(){this.running=!0,this.hover=!0,this.startedAt=performance.now(),this.phase=0}async stop(){this.running=!1,this.hover=!1,this.phase=0}async clear(){this.running=!1,this.hover=!1,this.phase=0,this.holoRunning=!1,this.holoStopping=!1,this.holoState!=="off"&&(this.holoState="ready")}async close(){this.running=!1,this.hover=!1,this.holoRunning=!1}async holoUpload(t,e=0){t.forEach((n,s)=>{const r=e+s;if(r>=10)throw new Error("演示设备全息帧槽只有 10 个");this.holo[r]={phase:Uint8Array.from(n.phase),level:Uint8Array.from(n.level)}}),this.holoState==="off"&&(this.holoState="ready")}async holoConfigure(t){this.holoConfig=t,this.holoState==="off"&&(this.holoState="ready")}async holoStart(){if(this.holo.length===0)throw new Error("演示设备还没有全息关键帧");this.holoRunning=!0,this.holoStopping=!1,this.holoState="running",this.holoStartedAt=performance.now(),this.holoFrames=0,this.holoSkipped=0,this.running=!1,this.hover=!1}async holoStop(){this.holoRunning&&(this.holoRunning=!1,this.holoStopping=!0,this.holoState="stopping",setTimeout(()=>{this.holoStopping=!1,this.holoState="ready"},40))}async holoStatus(){const t=Math.max(1,Math.min(10,this.holoConfig.keyframes||this.holo.length||1)),e=Math.max(1,this.holoConfig.transitionMs),n=this.holoConfig.loopMs|0,s=t,r=n>0?n*1e3:s*e*1e3;let o=0,a=0,l=this.holoFrames;if(this.holoState==="running"){const u=(performance.now()-this.holoStartedAt)*1e3,h=n>0?r:s*e*1e3,d=u%Math.max(1,h),p=Math.max(1,e*1e3);o=Math.min(t-1,Math.floor(d/p)),a=Math.min(1,(d-o*p)/p),l=Math.floor(u/(1e6/Math.max(1,this.holoConfig.outputRateHz)));const _=t>1?0:Math.floor(l/2);this.holoSkipped=_}const c=this.holoState==="off"?0:this.holoState==="ready"?1:this.holoState==="running"?2:3;return{state:c,flags:this.holoConfig.flags|(this.holoState==="running"?xf:0)|(t===1?8:0),outputRateHz:this.holoConfig.outputRateHz,keyframeCount:t,currentKeyframe:o,alpha:a,serviceMaxUs:48,serviceAvgUs:24,renderMaxUs:6,renderAvgUs:3,submitMaxUs:11,submitAvgUs:5,frames:l,skipped:this.holoSkipped,missedDeadlines:0,frameErrors:0,fps:this.holoState==="running"?this.holoConfig.outputRateHz:0,stateName:c===0?"OFF":c===1?"READY":c===2?"RUNNING":"STOPPING",running:this.holoState==="running"||this.holoStopping}}}class Af extends Error{constructor(t,e){super(`device rejected 0x${t.toString(16)}: ${$d[e]??String(e)}`),this.messageType=t,this.status=e,this.name="DeviceError"}messageType;status}class vl{constructor(t,e){this.port=t,this.info=t.getInfo(),this.portName=e}port;portName;info;parser=new df;pending=null;queue=Promise.resolve();reader=null;writer=null;transaction=0;closed=!1;timeoutS=1.5;onDisconnect=null;static async open(t){await t.open({baudRate:2e6,bufferSize:65536});const e=t.getInfo(),n=`Web Serial ${e.usbVendorId?.toString(16).padStart(4,"0")??"????"}:${e.usbProductId?.toString(16).padStart(4,"0")??"????"}`,s=new vl(t,n);return s.start(),t.addEventListener("disconnect",s.handleDisconnect),s}start(){if(!this.port.readable)throw new Error("串口不可读");if(this.reader=this.port.readable.getReader(),this.writer=this.port.writable?.getWriter()??null,!this.writer)throw new Error("串口不可写");this.pump()}async pump(){try{for(;!this.closed&&this.reader;){const{value:t,done:e}=await this.reader.read();if(e)break;if(!(!t||t.length===0))for(this.parser.feed(t);;){const n=this.parser.next();if(!n)break;this.dispatch(n)}}}catch(t){this.closed||this.failAll(t instanceof Error?t:new Error(String(t)))}finally{this.closed||this.handleDisconnect()}}dispatch(t){const e=this.pending;if(!(!e||t.transactionId!==e.tid)){if(this.pending=null,window.clearTimeout(e.timer),t.messageType===Wd||(t.flags&Yd)!==0){e.reject(new Af(e.messageType,t.payload[0]??-1));return}if(t.messageType!==e.expect){e.reject(new Error(`0x${e.messageType.toString(16)}: expected 0x${e.expect.toString(16)}, got 0x${t.messageType.toString(16)}`));return}e.resolve(t.payload)}}failAll(t){this.pending&&(window.clearTimeout(this.pending.timer),this.pending.reject(t),this.pending=null)}handleDisconnect=()=>{this.closed||(this.closed=!0,this.failAll(new Error("设备已断开")),this.onDisconnect?.())};request(t,e=new Uint8Array(0),n=Or,s){const r=async()=>{if(this.closed||!this.writer)throw new Error("串口未连接");this.transaction=this.transaction+1>>>0;const a=this.transaction,l=(s??this.timeoutS)*1e3,c=new Promise((h,d)=>{const p=window.setTimeout(()=>{this.pending?.tid===a&&(this.pending=null),d(new Error(`no reply to 0x${t.toString(16)} on ${this.portName}`))},l);this.pending={tid:a,expect:n,messageType:t,resolve:h,reject:d,timer:p}}),u=uf(t,e,a);return await this.writer.write(u),c},o=this.queue.then(r,r);return this.queue=o.then(()=>{},()=>{}),o}async close(){if(!this.closed){this.closed=!0,this.failAll(new Error("连接已关闭"));try{this.port.removeEventListener("disconnect",this.handleDisconnect),await this.reader?.cancel(),this.reader?.releaseLock(),this.writer?.releaseLock(),await this.port.close()}catch{}}}}class Ml{constructor(t,e){this.link=t,this.profile=e,this.label=t.portName}link;profile;label;static async open(t){const e=await vl.open(t);try{const n=vf(await e.request(Pd,new Uint8Array(0),Ld));return new Ml(e,n)}catch(n){throw await e.close(),n}}get portName(){return this.link.portName}set onDisconnect(t){this.link.onDisconnect=t}async close(){await this.link.close()}async systemFlags(){return Mf(await this.link.request(Ud,new Uint8Array(0),Dd))}async motionStatus(){return _f(await this.link.request(Jl,new Uint8Array(0),Jl))}async upload(t,e=!1){if(t.length>this.profile.maxPathPoints)throw new Error(`${t.length} path points, firmware ${this.profile.firmware} holds ${this.profile.maxPathPoints}`);if(t.length<=os){await this.link.request(Zl,ff(t,e));return}for(const n of pf(t,e))await this.link.request(Zl,n)}async configure(t){await this.link.request(Nd,t.pack())}async target(t){await this.link.request(Od,mf(t))}async rate(t,e){await this.link.request(zd,gf(t,e))}async start(){await this.link.request(Fd)}async stop(){await this.link.request(Bd,new Uint8Array(0),Or,2)}async clear(){await this.link.request(Id,new Uint8Array(0),Or,2)}get hasHologram(){return this.profile.hasHologram}requireHologram(){if(!this.profile.hasHologram)throw new Error(`固件 ${this.profile.firmware} 没有全息关键帧引擎（capability bit11），请先烧录新固件`)}async holoUpload(t,e=0){this.requireHologram();for(let n=0;n<t.length;n+=Zr){const s=t.slice(n,n+Zr);await this.link.request(Hd,bf(e+n,s))}}async holoConfigure(t){this.requireHologram(),await this.link.request(kd,t.pack())}async holoStart(){this.requireHologram(),await this.link.request(Gd)}async holoStop(){this.requireHologram(),await this.link.request(Vd,new Uint8Array(0),Or,2)}async holoStatus(){return this.requireHologram(),Ef(await this.link.request(Ql,new Uint8Array(0),Ql))}}const lc=1155,cc=22336;function hc(){return typeof navigator<"u"&&!!navigator.serial}async function Rf(){const i=navigator.serial;if(!i)throw new Error("此浏览器不支持 Web Serial，请使用 Chrome 或 Edge（HTTPS 页面）");const e=(await i.getPorts()).find(n=>{const s=n.getInfo();return s.usbVendorId===lc&&s.usbProductId===cc});return e||i.requestPort({filters:[{usbVendorId:lc,usbProductId:cc}]})}class Cf{demo=new oc;device=this.demo;mode="demo";busy=!1;error="";version=0;listeners=new Set;get current(){return this.device}get isDemo(){return this.mode==="demo"}get state(){return{mode:this.mode,busy:this.busy,device:this.device,label:this.device.label,version:this.version,error:this.error}}get serialAvailable(){return hc()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(){const t=this.state;for(const e of this.listeners)e(t)}async connect(){if(!(this.mode==="serial"||this.busy)){if(!hc())throw new Error("此浏览器不支持 Web Serial，请使用 Chrome 或 Edge");this.busy=!0,this.error="",this.emit();try{const t=await Rf(),e=await Ml.open(t);e.onDisconnect=()=>{this.device===e&&this.fallback("设备已断开，已切换到演示模式")},await this.demo.close(),this.device=e,this.mode="serial",this.version++,this.busy=!1,this.emit()}catch(t){throw this.busy=!1,this.error=t instanceof Error?t.message:String(t),this.emit(),t}}}async disconnect(t="已断开设备，回到演示模式"){if(this.mode!=="serial")return;await this.device.close(),this.fallback(t)}fallback(t){this.demo=new oc,this.device=this.demo,this.mode="demo",this.error=t,this.version++,this.busy=!1,this.emit()}clearError(){this.error="",this.emit()}async dispose(){await this.device.close()}}function Pf(i){return{...i,points:i.points.map(t=>new Kr(t.xUm,t.yUm,t.zUm,t.level,t.palette))}}class Lf{worker;pending=new Map;nextId=1;ready=null;constructor(){this.worker=new Worker(new URL(""+new URL("planWorker-pXpNNMRu.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.addEventListener("message",this.onMessage),this.worker.addEventListener("error",t=>{for(const e of this.pending.values())e.reject(new Error(t.message||"规划线程出错"));this.pending.clear()})}onMessage=t=>{const e=t.data,n=Number(e.id??-1),s=this.pending.get(n);if(s){if(this.pending.delete(n),e.type==="ready"){s.resolve(e.ms);return}if(e.type==="error"){s.reject(new Error(String(e.message??"worker error")));return}e.type==="plan-result"?s.resolve(Pf(e.plan)):s.resolve(e.map??e.ms)}};request(t){const e=this.nextId++;return new Promise((n,s)=>{this.pending.set(e,{resolve:n,reject:s}),this.worker.postMessage({...t,id:e})})}warm(){return this.ready||(this.ready=this.request({type:"warmup"}).then(()=>{})),this.ready}async plan(t,e,n,s){return this.request({type:"plan",cfg:t,name:e,maxPoints:n,periodS:s})}async displayField(t){return this.request({type:"display-field",...t})}dispose(){this.worker.terminate();for(const t of this.pending.values())t.reject(new Error("planning worker disposed"));this.pending.clear()}}function j(i,t={},...e){const n=document.createElement(i);for(const[s,r]of Object.entries(t))if(r!=null)if(s==="class")n.className=String(r);else if(s==="text")n.textContent=String(r);else if(s==="html")n.innerHTML=String(r);else if(s==="style"&&typeof r=="object")Object.assign(n.style,r);else if(s==="dataset"&&typeof r=="object")for(const[o,a]of Object.entries(r))n.dataset[o]=String(a);else if(s==="on"&&typeof r=="object")for(const[o,a]of Object.entries(r))n.addEventListener(o,a);else if(s==="attrs"&&typeof r=="object")for(const[o,a]of Object.entries(r))a===!1||a===null||a===void 0||n.setAttribute(o,a===!0?"":String(a));else s in n?n[s]=r:n.setAttribute(s,String(r));return Uf(n,e),n}function Uf(i,t){for(const e of t)e==null||e===!1||i.appendChild(e instanceof Node?e:document.createTextNode(String(e)))}function Zi(i){for(;i.firstChild;)i.removeChild(i.firstChild)}function ls(i,t=15){const e=document.createElement("i");return e.setAttribute("data-lucide",i),e.style.width=`${t}px`,e.style.height=`${t}px`,e.setAttribute("aria-hidden","true"),e}function Xe(i,t=1){return Number.isFinite(i)?i.toFixed(t):"—"}function uc(i){return`#${i.map(t=>Math.max(0,Math.min(255,Math.round(t))).toString(16).padStart(2,"0")).join("")}`}function Df(i){const t=i.replace("#",""),e=t.length===3?t.split("").map(s=>s+s).join(""):t,n=Number.parseInt(e,16);return[n>>16&255,n>>8&255,n&255]}function If(i,t){let e;const n=((...s)=>{e!==void 0&&window.clearTimeout(e),e=window.setTimeout(()=>i(...s),t)});return n.cancel=()=>{e!==void 0&&window.clearTimeout(e)},n}const _s=1.2,Qn=2*Math.PI*gl/la,dc=2*Math.PI*gl,Nf=la/gl,Ff=.0045,Of=6;function Bf(i){const t=Math.abs(i);if(t<1e-12)return .5*i;if(t<10){const e=i*.5;let n=e,s=e;const r=-e*e;for(let o=1;o<48&&(n*=r/(o*(o+1)),s+=n,!(Math.abs(n)<Math.abs(s)*1e-17));o++);return s}return Math.sqrt(2/(Math.PI*t))*Math.cos(t-3*Math.PI/4)}function zf(i,t,e,n=.002,s=0){const r=e.count,o=new Float64Array(r),a=new Float64Array(r);if(i===Of){for(let m=0;m<r;m++){const f=e.xyz[m*3]-t[0],w=e.xyz[m*3+1]-t[1],E=e.xyz[m*3+2]-t[2],M=Math.atan2(w,f)-Qn*Math.hypot(f,w,E);o[m]=Math.cos(M),a[m]=Math.sin(M)}return{re:o,im:a}}const l=Math.max(n,5e-4),c=s===0?256:s,u=[];for(let m=0;m<8;m++){const f=2*Math.PI*m/8;u.push([l*Math.cos(f),l*Math.sin(f),0])}let h,d;switch(i){case 1:h=[[0,0,l],[0,0,-l]],d=[0,Math.PI];break;case 2:h=[[0,l,0],[0,-l,0]],d=[0,Math.PI];break;case 3:h=u,d=u.map((m,f)=>Math.PI*(f&1));break;case 4:h=u,d=u.map((m,f)=>2*Math.PI*Math.floor(f*c/8)/256);break;case 5:h=[...u.filter((m,f)=>f%2===0).map(([m,f])=>[m,f,.5*l]),...u.filter((m,f)=>f%2===0).map(([m,f])=>[m,f,-.5*l])],d=[0,0,0,0,Math.PI,Math.PI,Math.PI,Math.PI];break;default:h=[[0,0,0]],d=[0]}const p=new Float64Array(r),_=new Float64Array(r),g=1/Math.sqrt(h.length);for(let m=0;m<h.length;m++){const[f,w,E]=h[m],M=d[m];for(let R=0;R<r;R++){const A=e.xyz[R*3]-(t[0]+f),P=e.xyz[R*3+1]-(t[1]+w),D=e.xyz[R*3+2]-(t[2]+E),x=Math.hypot(A,P,D),b=M-Qn*x;p[R]+=Math.cos(b)*g,_[R]+=Math.sin(b)*g}}for(let m=0;m<r;m++){const f=Math.hypot(p[m],_[m]);f>1&&(p[m]/=f,_[m]/=f),o[m]=p[m],a[m]=_[m]}return{re:o,im:a}}function So(i){const t=Qn*Ff*Math.sqrt(pl(1-i*i,0,1));let e=1;return t>1e-9&&(e=2*Bf(t)/t),i>0?e:0}const fu=2;class ca{src;tableZ;trapMode;focus;drive;image;k1;k2;beadRadius;bead;tableDistanceMm;focusOffsetMm;patternRadiusMm;phaseSpan;constructor(t,e,n,s=[0,0],r=0,o,a={}){this.bead={...t},this.tableDistanceMm=e,this.focusOffsetMm=r,this.patternRadiusMm=a.radiusMm??fu,this.phaseSpan=a.phaseSpan??0,this.src=o??_l();let l=0;for(let d=0;d<this.src.count;d++)l+=this.src.xyz[d*3+2];this.tableZ=l/this.src.count+e*.001,this.trapMode=n,this.focus=[s[0]*.001,s[1]*.001,this.tableZ+r*.001],this.drive=zf(n,this.focus,this.src,this.patternRadiusMm*.001,this.phaseSpan),this.image=new Float64Array(this.src.xyz.length);for(let d=0;d<this.src.count;d++)this.image[d*3]=this.src.xyz[d*3],this.image[d*3+1]=this.src.xyz[d*3+1],this.image[d*3+2]=2*this.tableZ-this.src.xyz[d*3+2];const c=t.diameterMm*5e-4,u=4/3*Math.PI*c**3,h=2*(t.densityKgM3-_s)/(2*t.densityKgM3+_s);this.k1=u/(4*_s*la**2),this.k2=3*u*h/(8*_s*dc**2),this.beadRadius=c}zOfHeight(t){return this.tableZ-t}pressure(t){const e=t.length/3,n=new Float64Array(e),s=new Float64Array(e),r=new Float64Array(e*3),o=new Float64Array(e*3);return this.accumulate(t,n,s,r,o),{re:n,im:s,gre:r,gim:o}}potential(t){const e=t.length/3,n=new Float64Array(e),s=new Float64Array(e),r=new Float64Array(e*3),o=new Float64Array(e*3);this.accumulate(t,n,s,r,o);const a=new Float64Array(e);for(let l=0;l<e;l++){const c=n[l]*n[l]+s[l]*s[l];let u=0;for(let h=0;h<3;h++){const d=r[l*3+h],p=o[l*3+h];u+=d*d+p*p}a[l]=this.k1*c-this.k2*u}return a}intensity(t){const{re:e,im:n,gre:s,gim:r}=this.pressure(t),o=e.length,a=new Float64Array(o*3),l=1/(2*dc*_s);for(let c=0;c<o;c++)for(let u=0;u<3;u++)a[c*3+u]=(e[c]*r[c*3+u]-n[c]*s[c*3+u])*l;return a}accumulate(t,e,n,s,r){const o=t.length/3,a=this.src.count,l=this.src.xyz,c=this.image,u=this.drive.re,h=this.drive.im,d=Qn;for(let p=0;p<2;p++){const _=p===0?1:-1,g=p===0?l:c;for(let m=0;m<o;m++){const f=t[m*3],w=t[m*3+1],E=t[m*3+2];let M=e[m],R=n[m],A=s[m*3],P=r[m*3],D=s[m*3+1],x=r[m*3+1],b=s[m*3+2],y=r[m*3+2];for(let U=0;U<a;U++){const N=f-g[U*3],B=w-g[U*3+1],W=E-g[U*3+2],V=Math.sqrt(N*N+B*B+W*W);if(V<1e-12)continue;const Z=So(_*W/V);if(Z===0)continue;const H=d*V,nt=Math.cos(H),ct=Math.sin(H),_t=Z/V,Nt=u[U],ie=h[U],qt=(Nt*nt-ie*ct)*_t,Y=(Nt*ct+ie*nt)*_t;M+=qt,R+=Y;const ot=-1/(V*V),it=d/V,Et=qt*ot-Y*it,wt=qt*it+Y*ot;A+=Et*N,P+=wt*N,D+=Et*B,x+=wt*B,b+=Et*W,y+=wt*W}e[m]=M,n[m]=R,s[m*3]=A,r[m*3]=P,s[m*3+1]=D,r[m*3+1]=x,s[m*3+2]=b,r[m*3+2]=y}}}axialWells(t=30,e=0,n=0){const s=Math.trunc(t*60),r=ma(this.beadRadius,t*.001,s),o=new Float64Array(s),a=new Float64Array(s*3);for(let h=0;h<s;h++)o[h]=this.tableZ-r[h],a[h*3]=e,a[h*3+1]=n,a[h*3+2]=o[h];const l=this.potential(a),c=$l(l,o),u=[];for(let h=1;h<s-1;h++)if(l[h]<l[h-1]&&l[h]<=l[h+1]){let d=h;for(;d>0&&l[d-1]>=l[d];)d--;let p=-1/0;for(let _=d;_<=h;_++)c[_]>p&&(p=c[_]);u.push({heightMm:r[h]*1e3,z:o[h],forceUp:p})}return u}lateralLaw(t,e=9,n=1.2,s=0,r=1){const o=ma(0,e*.001,Math.trunc(e*5)+1),a=new Float64Array(Math.trunc(n*10)*2+1);for(let c=0;c<a.length;c++)a[c]=t+(-n+2*n*c/(a.length-1))*.001;const l=new Float64Array(o.length);for(let c=0;c<o.length;c++){const u=r*o[c]+this.focus[0],h=s+this.focus[1];let d=1/0;for(let p=0;p<a.length;p++){const _=this.potentialPoint(u,h,a[p]);_<d&&(d=_)}l[c]=d}return{xs:o,force:$l(l,o)}}potentialPoint(t,e,n){let s=0,r=0,o=0,a=0,l=0,c=0,u=0,h=0;const d=this.src.count;for(let g=0;g<2;g++){const m=g===0?1:-1,f=g===0?this.src.xyz:this.image;for(let w=0;w<d;w++){const E=t-f[w*3],M=e-f[w*3+1],R=n-f[w*3+2],A=Math.sqrt(E*E+M*M+R*R);if(A<1e-12)continue;const P=So(m*R/A);if(P===0)continue;const D=Qn*A,x=Math.cos(D),b=Math.sin(D),y=P/A,U=this.drive.re[w],N=this.drive.im[w],B=(U*x-N*b)*y,W=(U*b+N*x)*y;s+=B,r+=W;const V=-1/(A*A),Z=Qn/A,H=B*V-W*Z,nt=B*Z+W*V;o+=H*E,a+=nt*E,l+=H*M,c+=nt*M,u+=H*R,h+=nt*R}}const p=s*s+r*r,_=o*o+a*a+l*l+c*c+u*u+h*h;return this.k1*p-this.k2*_}xyGain(t,e=8){const n=new ca(this.bead,this.tableDistanceMm,this.trapMode,[e,0],this.focusOffsetMm,this.src,{radiusMm:this.patternRadiusMm,phaseSpan:this.phaseSpan}),s=ma((e-1.5)*.001,(e+1.5)*.001,301),r=new Float64Array(s.length*3);for(let g=0;g<s.length;g++)r[g*3]=s[g],r[g*3+2]=t;const o=n.potential(r);let a=0;for(let g=1;g<o.length;g++)o[g]<o[a]&&(a=g);const l=Math.min(Math.max(a,1),s.length-2),c=o[l-1],u=o[l],h=o[l+1],d=s[1]-s[0],p=c-2*u+h;return(s[l]+(p!==0?.5*d*((c-h)/p):0))/(e*.001)}}const pu=20;function Hf(i,t,e,n,s,r=pu,o={}){const a=new ca(i,t,e,[r,0],n,void 0,o),l=a.axialWells(12,a.focus[0],a.focus[1]);if(l.length===0||s<=0)return 0;const c=l[0].z;let u=1/0;for(const d of[1,-1]){const{force:p}=a.lateralLaw(c,9,1.2,0,d);let _=-1/0;for(let g=0;g<p.length;g++)p[g]>_&&(_=p[g]);u=Math.min(u,_)}const h=u/s;return h>0&&h<.999?r/Math.sqrt(-Math.log(h)):0}function kf(i,t,e,n,s={}){const r=new ca(i,t,e,[0,0],n,void 0,s),o=r.axialWells(30);if(o.length===0)throw new Error("no stable height on the axis for this field");const a=o[0],{xs:l,force:c}=r.lateralLaw(a.z);let u=l.length-1;for(let A=2;A<c.length;A++)if(c[A]<0){u=A;break}const h=Math.min(u+1,c.length);let d=0;for(let A=1;A<h;A++)c[A]>c[d]&&(d=A);const p=c[d],_=5e-4,g=new Float64Array([_,0,a.z]),m=r.intensity(g)[1],f=Math.PI*r.beadRadius**2*m/la/_,w=_d(_,l,c)/_,E=t*.5,M=r.axialWells(E+Nf*1e3);let R=0;if(M.length>0){let A=M[0];for(const P of M)Math.abs(P.heightMm-E)<Math.abs(A.heightMm-E)&&(A=P);R=A.forceUp}return{trapMode:e,rungHeightsMm:o.map(A=>Math.round(A.heightMm*100)/100),heightMm:a.heightMm,axialForce:a.forceUp,lateralPeak:p,lateralToAxial:p/a.forceUp,peakOffsetMm:l[d]*1e3,basinMm:l[u]*1e3,xyGain:r.xyGain(a.z),pumping:w>0?Math.abs(f)/w:1/0,midForce:R,offaxisR0Mm:Hf(i,t,e,n,p,pu,s)}}const fc=new Map;function Gf(i,t,e,n=0,s={}){const r=[Math.round(i.diameterMm*1e3)/1e3,Math.round(i.densityKgM3*1e3)/1e3,Math.round(t*100)/100,e,Math.round(n*100)/100,Math.round((s.radiusMm??fu)*100)/100,Math.round((s.phaseSpan??0)*100)/100].join("|"),o=fc.get(r);if(o)return o;const a=kf(i,t,e,n,s);return fc.set(r,a),a}const Vf=1.2,Jr=181e-7;function Wf(i){return pl(i,0,255)*128/255}function Os(i){return Math.sin(Math.PI*Wf(i)/256)**2}function Xf(i,t){const e=i.trap,n=t??e.level,s=bd(i.bead.diameterMm,i.bead.densityKgM3),r=Mi(i);let o=3.5,a=7,l=0,c=0,u=0;try{const m=Gf(i.bead,e.tableDistanceMm,r,e.focusOffsetMm,{radiusMm:e.patternRadiusMm,phaseSpan:e.phaseSpan});o=m.peakOffsetMm,a=m.basinMm,l=m.heightMm,c=m.pumping,u=m.offaxisR0Mm}catch{}const h=Os(n),d=Ed(i),p=d?h/Math.max(1e-9,Os(d)):0;let _=0,g=qr(i);return e.mount==="side"&&(_=Yl,g=d?Yl/Math.max(1e-9,Os(d)):qr(i)),{mass:s,radius:i.bead.diameterMm*5e-4,fMax:s*Math.max(g,1e-6)*h,dPk:o*.001,gravityInPlane:_,extraZeta:e.extraDampingRatio,holdRatio:p,basin:a*.001,heightMm:l,pumping:c,offaxisR0:u*.001}}function Yf(i){return i.fMax*.5*Math.PI/i.dPk}function $f(i,t){const e=Math.abs(t),n=Vf*e*2*i.radius/Jr;return 6*Math.PI*Jr*i.radius*e*(1+.15*n**.687)}function qf(i){return 6*Math.PI*Jr*i.radius+2*i.extraZeta*Math.sqrt(Yf(i)*i.mass)}function jf(i,t,e){return i.offaxisR0<=0?1:Math.exp(-(t*t+e*e)/(i.offaxisR0*i.offaxisR0))}function mu(i,t,e,n){const s=jf(i,n,0),r=Math.max(qf(i)-6*Math.PI*Jr*i.radius,0),o=4001;let a=0;for(let l=0;l<o;l++){const c=n+2*i.dPk*l/(o-1),u=e*c,h=i.mass*e*e*c,d=$f(i,u)+r*u,p=Math.hypot(h,d),_=p/(t*s);if(!(_<1)||p<=0)continue;const g=i.dPk*Math.asin(Math.min(_,1))*2/Math.PI,m=Math.hypot(c-g*h/p,g*d/p);m>a&&(a=m)}return a}function Kf(i,t,e,n){const s=2*Math.PI*t;let r=1e-7,o=1;for(let a=0;a<80;a++){const l=Math.sqrt(r*o);mu(i,l,s,e)>=e?o=l:r=l}return o/(i.mass*Math.max(Os(n),1e-9))}function Zf(i,t){let e=.1,n=500;for(let s=0;s<60;s++){const r=Math.sqrt(e*n);mu(i,i.fMax,2*Math.PI*r,t)>=t?e=r:n=r}return e}function gu(i,t){const e=i.length,n=new Float64Array(e);let s=0;for(let a=0;a<e;a++){const l=(a+1)%e;n[a]=Math.hypot(i[l]-i[a],t[l]-t[a]),s+=n[a]}const r=new Float64Array(e);let o=0;for(let a=0;a<e;a++)r[a]=s>0?o/s:0,o+=n[a];return r}function $s(i,t,e,n,s=[]){const r=t.length,o=new Uint8Array(r);for(const a of s)o[a]=1;return{name:i,x:t,y:e,corners:o,hue:gu(t,e),visible:new Uint8Array(r).fill(1)}}function _u(i,t,e){const n=t.length;return{name:i,x:t,y:e,corners:new Uint8Array(n).fill(1),hue:gu(t,e),visible:new Uint8Array(n).fill(1)}}function Jf(i,t,e=[0,0]){const n=i.x.length,s=new Float64Array(n),r=new Float64Array(n),o=new Float64Array(n).fill(NaN);for(let a=0;a<n;a++)s[a]=i.x[a]*(.5*t)+e[0],r[a]=i.y[a]*(.5*t)+e[1];return{name:i.name,xMm:s,yMm:r,corners:i.corners.slice(),hue:i.hue.slice(),visible:i.visible.slice(),radiusMm:o}}function vu(i,t=1,e=0){const n=new Float64Array(i),s=new Float64Array(i);for(let r=0;r<i;r++){const o=e+2*Math.PI*r/i;n[r]=t*Math.cos(o),s[r]=t*Math.sin(o)}return{x:n,y:s}}function Qf(i=360){const{x:t,y:e}=vu(i);return $s("circle",t,e)}function xa(i,t,e){const{x:n,y:s}=vu(i,1,e*Math.PI/180);return _u(t,n,s)}function tp(i=5,t=.42){const e=2*i,n=new Float64Array(e),s=new Float64Array(e);for(let r=0;r<e;r++){const o=Math.PI/2+Math.PI*r/i,a=r%2===0?1:t;n[r]=a*Math.cos(o),s[r]=a*Math.sin(o)}return _u("star",n,s)}function ep(i=400){const t=new Float64Array(i),e=new Float64Array(i);let n=0;for(let l=0;l<i;l++){const c=2*Math.PI*l/i,u=16*Math.sin(c)**3,h=13*Math.cos(c)-5*Math.cos(2*c)-2*Math.cos(3*c)-Math.cos(4*c)-2.5;t[l]=u,e[l]=h,n=Math.max(n,Math.hypot(u,h))}for(let l=0;l<i;l++)t[l]/=n,e[l]/=n;let s=0,r=0,o=1/0,a=1/0;for(let l=0;l<i;l++){const c=2*Math.PI*l/i,u=Math.abs(c),h=Math.abs(c-Math.PI);u<o&&(o=u,s=l),h<a&&(a=h,r=l)}return $s("heart",t,e,void 0,[s,r])}function np(i=3,t=720){const e=new Float64Array(t),n=new Float64Array(t);for(let s=0;s<t;s++){const r=2*Math.PI*s/t,o=Math.cos(i*r);e[s]=o*Math.cos(r),n[s]=o*Math.sin(r)}return $s("rose",e,n)}function ip(i=3,t=2,e=720){const n=new Float64Array(e),s=new Float64Array(e);let r=0;for(let o=0;o<e;o++){const a=2*Math.PI*o/e,l=Math.sin(i*a+Math.PI/2),c=Math.sin(t*a);n[o]=l,s[o]=c,r=Math.max(r,Math.hypot(l,c))}for(let o=0;o<e;o++)n[o]/=r,s[o]/=r;return $s("lissajous",n,s)}function sp(i=480){const t=new Float64Array(i),e=new Float64Array(i);for(let n=0;n<i;n++){const s=2*Math.PI*n/i;t[n]=Math.cos(s),e[n]=.5*Math.sin(2*s)}return $s("infinity",t,e)}const Qr={circle:Qf,square:()=>xa(4,"square",45),triangle:()=>xa(3,"triangle",90),hexagon:()=>xa(6,"hexagon",0),star:tp,heart:ep,rose:np,lissajous:ip,infinity:sp};function rp(i){const t=Qr[i];if(!t)throw new Error(`unknown shape ${JSON.stringify(i)}; choose from ${Object.keys(Qr).join(", ")} or text`);return t()}const pc=new Set(["KeyW","KeyA","KeyS","KeyD"]),ya=.12;function ap(i){return i instanceof HTMLElement&&(i.matches("input, textarea, select")||i.isContentEditable)}class op{constructor(t,e,n=40){this.config=t,this.onMove=e,this.boundsMm=n}config;onMove;x=0;y=0;vx=0;vy=0;raf=0;last=0;lastEmit=0;keys=new Set;running=!1;boundsMm;get position(){return{xMm:this.x,yMm:this.y}}get active(){return this.running}start(t,e){this.stop(),this.x=t,this.y=e,this.vx=0,this.vy=0,this.running=!0,this.last=performance.now(),this.lastEmit=0,window.addEventListener("keydown",this.keyDown),window.addEventListener("keyup",this.keyUp),window.addEventListener("blur",this.clearKeys),this.onMove(this.sample()),this.raf=requestAnimationFrame(this.loop)}stop(){this.running=!1,cancelAnimationFrame(this.raf),this.raf=0,window.removeEventListener("keydown",this.keyDown),window.removeEventListener("keyup",this.keyUp),window.removeEventListener("blur",this.clearKeys),this.keys.clear(),this.vx=0,this.vy=0}setPosition(t,e){this.x=Math.max(-this.boundsMm,Math.min(this.boundsMm,t)),this.y=Math.max(-this.boundsMm,Math.min(this.boundsMm,e)),this.vx=0,this.vy=0,this.running&&this.onMove(this.sample())}sample(){return{xMm:this.x,yMm:this.y,vxMmS:this.vx,vyMmS:this.vy}}keyDown=t=>{!this.running||t.ctrlKey||t.metaKey||t.altKey||ap(t.target)||document.querySelector("dialog[open]")||pc.has(t.code)&&(t.preventDefault(),this.keys.add(t.code))};keyUp=t=>{pc.has(t.code)&&this.keys.delete(t.code)};clearKeys=()=>{this.keys.clear()};gamepad(){if(!navigator.getGamepads)return{x:0,y:0};const t=navigator.getGamepads();for(const e of t){if(!e?.connected)continue;const n=e.axes[0]??0,s=e.axes[1]??0,r=Math.hypot(n,s);if(r<ya)return{x:0,y:0};const o=(r-ya)/((1-ya)*r);return{x:n*o,y:-s*o}}return{x:0,y:0}}loop=t=>{if(!this.running)return;const e=Math.min(.05,Math.max(.001,(t-this.last)/1e3));this.last=t;const n=(this.keys.has("KeyD")?1:0)-(this.keys.has("KeyA")?1:0),s=(this.keys.has("KeyW")?1:0)-(this.keys.has("KeyS")?1:0),r=this.gamepad();let o=n+r.x,a=s+r.y;const l=Math.hypot(o,a);l>1&&(o/=l,a/=l);const{speedMmS:c,accelMmS2:u}=this.config(),h=o*c,d=a*c,p=Math.max(.001,u)*e,_=h-this.vx,g=d-this.vy;this.vx+=Math.max(-p,Math.min(p,_)),this.vy+=Math.max(-p,Math.min(p,g)),Math.abs(this.vx)<1e-5&&(this.vx=0),Math.abs(this.vy)<1e-5&&(this.vy=0);const m=this.x,f=this.y;this.x=Math.max(-this.boundsMm,Math.min(this.boundsMm,this.x+this.vx*e)),this.y=Math.max(-this.boundsMm,Math.min(this.boundsMm,this.y+this.vy*e)),this.x===m&&this.vx!==0&&(this.vx=0),this.y===f&&this.vy!==0&&(this.vy=0),(Math.abs(this.vx)>1e-5||Math.abs(this.vy)>1e-5||this.x!==m||this.y!==f)&&t-this.lastEmit>20&&(this.lastEmit=t,this.onMove(this.sample())),this.raf=requestAnimationFrame(this.loop)}}const mc=6,lp=1.6,Us=1.2,gc=1.6,_c=30,cp=.4,hp=.15,up=15;function ue(i,t,e,n,s,r){const o=Math.max(2,Math.ceil(Math.abs(r-s)/up)),a=[];for(let l=0;l<=o;l++){const c=(s+(r-s)*l/o)*Math.PI/180;a.push([i+e*Math.cos(c),t+n*Math.sin(c)])}return a}function vs(i,t,e=.4){return ue(i,t,e,e,0,360)}function He(...i){const t=[];for(const e of i)t.push(...e);return t}const vc={A:[4,[[[0,0],[2,6],[4,0]],[[.8,2.4],[3.2,2.4]]]],B:[4,[He([[0,3],[2.5,3]],ue(2.5,1.5,1.5,1.5,90,-90),[[0,0],[0,6],[2.3,6]],ue(2.3,4.5,1.5,1.5,90,-90))]],C:[4,[ue(2,3,2,3,50,310)]],D:[4,[He([[0,0],[0,6],[1.5,6]],ue(1.5,3,2.5,3,90,-90),[[0,0]])]],E:[3.5,[[[3.5,6],[0,6],[0,0],[3.5,0]],[[0,3],[2.8,3]]]],F:[3.5,[[[3.5,6],[0,6],[0,0]],[[0,3],[2.8,3]]]],G:[4,[He(ue(2,3,2,3,50,360),[[2.2,3]])]],H:[4,[[[0,0],[0,6]],[[4,0],[4,6]],[[0,3],[4,3]]]],I:[0,[[[0,0],[0,6]]]],J:[3,[He([[3,6]],ue(1.5,1.5,1.5,1.5,0,-180))]],K:[3.5,[[[0,0],[0,6]],[[3.5,6],[0,2.4]],[[1.3,3.74],[3.5,0]]]],L:[3.5,[[[0,6],[0,0],[3.5,0]]]],M:[5,[[[0,0],[0,6],[2.5,2],[5,6],[5,0]]]],N:[4,[[[0,0],[0,6],[4,0],[4,6]]]],O:[4,[ue(2,3,2,3,0,360)]],P:[4,[He([[0,0],[0,6],[2.3,6]],ue(2.3,4.5,1.5,1.5,90,-90),[[0,3]])]],Q:[4.3,[ue(2,3,2,3,0,360),[[2.6,1.3],[4.3,-.4]]]],R:[4,[He([[0,0],[0,6],[2.3,6]],ue(2.3,4.5,1.5,1.5,90,-90),[[0,3]]),[[1.8,3],[4,0]]]],S:[4,[He(ue(2,4.5,2,1.5,20,270),ue(2,1.5,2,1.5,90,-160))]],T:[4,[[[0,6],[4,6]],[[2,6],[2,0]]]],U:[4,[He([[0,6]],ue(2,2,2,2,180,360),[[4,6]])]],V:[4,[[[0,6],[2,0],[4,6]]]],W:[5.5,[[[0,6],[1.3,0],[2.75,4.2],[4.2,0],[5.5,6]]]],X:[4,[[[0,6],[4,0]],[[4,6],[0,0]]]],Y:[4,[[[0,6],[2,3],[4,6]],[[2,3],[2,0]]]],Z:[4,[[[0,6],[4,6],[0,0],[4,0]]]],0:[3.5,[ue(1.75,3,1.75,3,0,360)]],1:[2,[[[0,4.6],[1.5,6],[1.5,0]]]],2:[4,[He(ue(2,4.2,2,1.8,160,-30),[[0,0],[4,0]])]],3:[4,[He(ue(2,4.5,1.8,1.5,150,-90),ue(2,1.5,2,1.5,90,-150))]],4:[4,[[[3,0],[3,6],[0,1.8],[4,1.8]]]],5:[4,[He([[3.8,6],[.6,6]],ue(1.9,1.9,1.9,1.9,145,-145))]],6:[4,[He(ue(2,1.8,2,4.2,70,180),ue(2,1.8,2,1.8,180,540))]],7:[4,[[[0,6],[4,6],[1.2,0]]]],8:[4,[He(ue(2,4.5,1.7,1.5,-90,270),ue(2,1.5,2,1.5,90,-270))]],9:[4,[He(ue(2,4.2,2,1.8,0,-360),[[3.5,0]])]],".":[.8,[vs(.4,.4)]],",":[.8,[[[.6,.6],[.2,-.8]]]],"!":[.8,[[[.4,6],[.4,2]],vs(.4,.4)]],"?":[3.5,[He(ue(1.75,4.4,1.75,1.6,160,-60),[[1.75,1.8]]),vs(1.75,.4)]],"-":[2.5,[[[0,3],[2.5,3]]]],"+":[3.5,[[[0,3],[3.5,3]],[[1.75,1.25],[1.75,4.75]]]],":":[.8,[vs(.4,.4),vs(.4,3.6)]],"'":[.5,[[[.25,6],[.25,4.5]]]],"/":[3,[[[0,0],[3,6]]]],"=":[3,[[[0,2],[3,2]],[[0,4],[3,4]]]]," ":[2.5,[]]},Mc=1,Sa=24;function dp(i){if(i.length===0)return[];const t=[i[0]];for(let e=1;e<i.length;e++){const n=t[t.length-1];Math.hypot(i[e][0]-n[0],i[e][1]-n[1])>1e-6&&t.push(i[e])}return t}function On(i,t){return vd(i,t)}function Bs(i,t){return Md(i[0],i[1],t[0],t[1])}function fp(i){return i.length<=3?!1:Math.hypot(i[0][0]-i[i.length-1][0],i[0][1]-i[i.length-1][1])<1e-6}function pp(i){const t=[];if(fp(i)){const e=i.slice(0,-1);for(let n=0;n<e.length;n++){const s=[...e.slice(n),...e.slice(0,n),e[n]];t.push(s),t.push(s.slice().reverse())}}else t.push(i),i.length>1&&t.push(i.slice().reverse());return t}function mp(i){const t=pp(i);if(t.length>2*Sa){const e=Math.floor(t.length/2),n=[];for(let r=0;r<Sa;r++)n.push(Math.trunc(r*(e-1)/(Sa-1)));const s=[];for(const r of n)t[2*r]&&s.push(t[2*r]),t[2*r+1]&&s.push(t[2*r+1]);return s}return t}function Cn(i,t){const e=On(i[i.length-1][0]-i[i.length-2][0],i[i.length-1][1]-i[i.length-2][1]),n=On(t[1][0]-t[0][0],t[1][1]-t[0][1]),s=t[0][0]-i[i.length-1][0],r=t[0][1]-i[i.length-1][1],o=Math.hypot(s,r);if(o<1e-6)return Mc*Bs(e,n);const a=On(s,r);return o+2*Us+Mc*(Bs(e,a)+Bs(a,n))}function gp(i,t){const e=i.map(mp),n=i.length,s=new Set;for(let a=0;a<n;a++)s.add(a);const r=[];let o=[[t[0]-1,t[1]],[t[0],t[1]]];for(;s.size;){let a=1/0,l=-1,c=null;for(const u of s)for(const h of e[u]){const d=Cn(o,h);d<a&&(a=d,l=u,c=h)}if(!c)break;r.push({stroke:l,path:c}),s.delete(l),o=c}if(n<2)return r.map(a=>a.path);for(let a=0;a<50;a++){let l=!1;for(let c=0;c<n-1;c++)for(let u=c+1;u<n;u++){if(c===0&&u===n-1)continue;const h=r[(c-1+n)%n].path,d=r[(u+1)%n].path,p=Cn(h,r[c].path)+Cn(r[u].path,d);if(Cn(h,r[u].path.slice().reverse())+Cn(r[c].path.slice().reverse(),d)<p-1e-9){const g=r.slice(c,u+1).reverse();r.splice(c,u-c+1,...g.map(m=>({stroke:m.stroke,path:m.path.slice().reverse()}))),l=!0}}for(let c=0;c<n;c++){const u=r[c],h=r[(c-1+n)%n].path,d=r[(c+1)%n].path;let p=Cn(h,u.path)+Cn(u.path,d);for(const _ of e[u.stroke]){const g=Cn(h,_)+Cn(_,d);g<p-1e-9&&(r[c]={stroke:u.stroke,path:_},p=g,l=!0)}}if(!l)break}return r.map(a=>a.path)}function _p(i,t,e=[0,0]){const s=[...i.toUpperCase()].map(y=>y in vc?y:"?");let r=0,o=[];for(const y of s){const[U,N]=vc[y];o.push(N.map(B=>dp(B).map(([W,V])=>[W+r,V]))),r+=U+lp}if(o=o.filter(y=>y.length>0),o.length===0)throw new Error("text has nothing to draw");let a=1/0,l=1/0,c=-1/0,u=-1/0;for(const y of o)for(const U of y)for(const[N,B]of U)N<a&&(a=N),B<l&&(l=B),N>c&&(c=N),B>u&&(u=B);const h=gp(o.flat(),[a-2,.5*mc]),d=[],p=h.length,_=new Array(p).fill(!1);for(let y=0;y<p;y++){const U=h[y],N=h[(y+1)%p],B=On(U[U.length-1][0]-U[U.length-2][0],U[U.length-1][1]-U[U.length-2][1]),W=On(N[1][0]-N[0][0],N[1][1]-N[0][1]);Math.hypot(N[0][0]-U[U.length-1][0],N[0][1]-U[U.length-1][1])<1e-6&&(_[(y+1)%p]=Bs(B,W)*180/Math.PI>_c)}for(let y=0;y<p;y++){const U=h[y],N=h[(y+1)%p];for(let H=0;H<U.length-1;H++){let nt=0;if(H>0){const ct=On(U[H][0]-U[H-1][0],U[H][1]-U[H-1][1]),_t=On(U[H+1][0]-U[H][0],U[H+1][1]-U[H][1]);nt=Bs(ct,_t)*180/Math.PI}d.push({x:U[H][0],y:U[H][1],lit:!0,corner:nt>_c||H===0&&_[y],radius:NaN})}const B=U[U.length-1],W=N[0],V=On(U[U.length-1][0]-U[U.length-2][0],U[U.length-1][1]-U[U.length-2][1]),Z=On(N[1][0]-N[0][0],N[1][1]-N[0][1]);Math.hypot(W[0]-B[0],W[1]-B[1])<1e-6||(d.push({x:B[0],y:B[1],lit:!1,corner:!1,radius:NaN}),d.push({x:B[0]+Us*V[0],y:B[1]+Us*V[1],lit:!1,corner:!0,radius:gc}),d.push({x:W[0]-Us*Z[0],y:W[1]-Us*Z[1],lit:!1,corner:!0,radius:gc}))}const g=d.length,m=new Float64Array(g),f=new Float64Array(g);for(let y=0;y<g;y++)m[y]=d[y].x,f[y]=d[y].y;const w=t/mc,E=.5*(a+c),M=.5*(l+u),R=new Float64Array(g),A=new Float64Array(g),P=new Float64Array(g),D=new Uint8Array(g),x=new Uint8Array(g),b=new Float64Array(g);for(let y=0;y<g;y++)R[y]=(m[y]-E)*w+e[0],A[y]=(f[y]-M)*w+e[1],P[y]=Number.isNaN(d[y].radius)?NaN:d[y].radius*w,D[y]=d[y].corner?1:0,x[y]=d[y].lit?1:0,b[y]=Math.min(.55,Math.max(0,.55*(m[y]-a)/Math.max(1e-9,c-a)));for(let y=0;y<g;y++){const U=m[y]-m[(y-1+g)%g],N=f[y]-f[(y-1+g)%g],B=m[(y+1)%g]-m[y],W=f[(y+1)%g]-f[y],V=Math.max(Math.hypot(U,N)*Math.hypot(B,W),1e-12),Z=(U*B+N*W)/V,H=.5*Math.acos(Math.min(1,Math.max(-1,Z))),nt=cp/Math.max(1/Math.cos(Math.min(H,1.55))-1,1e-6);D[y]&&!Number.isFinite(P[y])&&(P[y]=Math.min(nt,hp*t))}return{name:`text:${i}`,xMm:R,yMm:A,corners:D,hue:b,visible:x,radiusMm:P}}function vp(i){return i==="text"||i.startsWith("text:")}function Mp(i,t){const e=i.display,n=[e.centerXMm,e.centerYMm];return vp(t)?_p(t.startsWith("text:")?t.slice(5):e.text,e.textHeightMm,n):Jf(rp(t),e.sizeMm,n)}function xp(i){const t=Math.trunc(i.planner.drawLevel);return t>0?Math.max(i.trap.level,t):i.trap.level}var Ae=(i=>(i.Idle="idle",i.Hover="hover",i.Running="running",i.Hologram="hologram",i))(Ae||{});class Re extends Error{constructor(t){super(t),this.name="SessionError"}}const oi=i=>new Promise(t=>window.setTimeout(t,i)),yp=8,Sp=.4,bp=2.2,Ms=1,Ep=15,xc=.05,wp=.3;class Tp{constructor(t,e){if(this.dev=t,this.cfg=e,!t.profile.hasDisplay)throw new Re(`firmware ${t.profile.firmware} lacks the MOTION_DISPLAY extension (v7.3+); flash the UMH Controller build first`);this.level=e.trap.level,this.hoverLevel=this.level,this.hoverXUm=e.display.centerXMm*1e3,this.hoverYUm=e.display.centerYMm*1e3}dev;cfg;state="idle";plan=null;level;hoverLevel;hoverXUm;hoverYUm;abort={value:!1};runSince=0;playbackRate=1;liveConfig(t){const e=this.cfg.planner;return new Br({mode:ru,flags:va|this.ulmFlags(),outputRateHz:e.outputRateHz,maxSpeedMmS:Math.trunc(e.seekSpeedMmS),maxAccelMmS2:Math.trunc(e.seekAccelMmS2),level:this.level,...this.patternFields(),...this.ulmFields(),palette:t??[[255,255,255]]})}patternFields(){const t=this.cfg.trap;return{trapMode:Mi(this.cfg),trapRadiusUm:Math.round(t.patternRadiusMm*1e3),trapPhaseSpan:Math.round(t.phaseSpan)}}ulmFlags(){return this.cfg.ulm.enabled?Zd:0}ulmFields(){const t=this.cfg.ulm;if(!t.enabled)return{ulmFrequencyHz:0,ulmAmplitudeUm:0,ulmWaveSpeedMmS:0,ulmAxis:0};const e=t.axis==="x"?Qd:t.axis==="y"?tf:ef;return{ulmFrequencyHz:Math.round(t.frequencyHz),ulmAmplitudeUm:Math.max(0,Math.round(t.amplitudeUm)),ulmWaveSpeedMmS:Math.max(0,Math.round(t.waveSpeedMmS)),ulmAxis:e|(t.sawtooth?nf:0)}}hoverPoint(t,e){const n=Math.round(255*this.cfg.display.hoverBrightness**this.cfg.display.gamma);return new Kr(t,e,_o(this.cfg)*1e3,n,0)}async levitate(){this.abort.value=!1;let t=await this.dev.motionStatus();if((await this.dev.systemFlags()&su)!==0&&!t.running)throw new Re("设备正在执行其他输出（块流 / 全息 / 枪模式），请先在设备上停止");if(t.running){if(t.trapMode!==Mi(this.cfg))throw new Re(`motion trap_mode ${t.trapMode} is running (we want ${Mi(this.cfg)}); stop it first`);return await this.dev.rate(0,this.cfg.planner.rampMs),await oi(this.cfg.planner.rampMs+50),t=await this.dev.motionStatus(),t.outputRateHz===50&&(this.level=t.level),await this.dev.configure(this.liveConfig()),await this.dev.target(this.hoverPoint(t.xUm,t.yUm)),this.hoverXUm=t.xUm,this.hoverYUm=t.yUm,this.state="hover",`已接管悬浮小球，陷阱强度 ${this.level}`}return await this.dev.configure(this.liveConfig()),await this.dev.target(this.hoverPoint(this.hoverXUm,this.hoverYUm)),await this.dev.start(),this.state="hover",`陷阱已打开（强度 ${this.level}）：请把小球放进声场`}async setLevel(t){this.level=Math.max(1,Math.min(255,Math.round(t))),this.state!=="running"&&(this.hoverLevel=this.level),this.state==="hover"&&await this.dev.configure(this.liveConfig())}async liveTarget(t,e,n=this.level){if(this.state==="idle")throw new Re("levitate the bead first");this.state==="running"&&await this.stopDrawing(),this.hoverXUm=t*1e3,this.hoverYUm=e*1e3,await this.dev.target(new Kr(this.hoverXUm,this.hoverYUm,_o(this.cfg)*1e3,n,0))}async moveHover(t,e){if(this.state!=="hover")throw new Re("hover moves need a hovering bead");this.hoverXUm=t*1e3,this.hoverYUm=e*1e3,await this.dev.target(this.hoverPoint(this.hoverXUm,this.hoverYUm))}async waitAt(t,e,n,s=30){const r=performance.now()+n*1e3;let o=0;for(;performance.now()<r;){if(this.abort.value)throw new Re("aborted");const a=await this.dev.motionStatus();if(Math.hypot(a.xUm-t,a.yUm-e)<s){if(o++,o>=3){await oi(150);return}}else o=0;await oi(25)}throw new Re("seek timed out")}pathConfig(t,e,n,s){let r=nc|ic|va;(t.raw||this.cfg.planner.interpolation==="linear")&&(r|=Kd),r|=this.ulmFlags();const o=t.deviceLoopS??t.periodS,a=t.playbackRate??1;return new Br({mode:xo,flags:r,outputRateHz:t.rateHz,loopMs:Math.max(1,Math.min(6e4,Math.round(o*1e3))),maxSpeedMmS:t.raw?1e4:void 0,maxAccelMmS2:t.raw?65535:void 0,level:this.level,...this.patternFields(),...this.ulmFields(),palette:t.palette,paletteSpinX10:t.paletteSpinX10,rateInitial:t.raw?a:e,rateTarget:t.raw?a:n,rateRampMs:t.raw?0:s})}async applyOutputConfig(){this.state==="hover"?await this.dev.configure(this.liveConfig()):this.state==="running"&&this.plan&&await this.dev.configure(this.pathConfig(this.plan,1,1,0))}async holoStart(t,e){if(!this.dev.hasHologram)throw new Re("当前设备固件没有全息关键帧引擎（capability bit11）");if(t.length===0)throw new Re("全息模式至少需要一张关键帧");this.abort.value=!0,await this.dev.holoUpload(t),e.keyframes=t.length,await this.dev.holoConfigure(e),await this.dev.holoStart(),this.state="hologram"}async holoUpdate(t){this.state==="hologram"&&await this.dev.holoConfigure(t)}async holoStop(){this.state==="hologram"&&(await this.dev.holoStop(),this.state="idle")}holoConfig(t){const e=this.cfg.holo;return new du({flags:(e.holdLast?yf:0)|(e.gamma?uu:0),outputRateHz:e.outputRateHz,loopMs:e.loopMs,transitionMs:e.transitionMs,level:e.level,keyframes:t})}async setPlaybackRate(t){if(!this.plan?.raw)throw new Re("playback rate is only adjustable in raw mode");if(this.state!=="running")throw new Re("nothing is running");const e=Math.max(.001,Math.min(1,t));return await this.dev.rate(e,0),this.playbackRate=e,this.plan.playbackRate=e,this.plan.periodS=(this.plan.deviceLoopS??this.plan.periodS)/e,this.plan.periodS}async play(t){if(this.state==="running"&&await this.stopDrawing(),this.state!=="hover")throw new Re("levitate the bead first");this.abort.value=!1,await this.dev.upload(t.points);const e=t.points[0],n=Math.hypot(e.xUm-this.hoverXUm,e.yUm-this.hoverYUm);await this.dev.target(this.hoverPoint(e.xUm,e.yUm)),await this.waitAt(e.xUm,e.yUm,3+n*.001/this.cfg.planner.seekSpeedMmS),this.hoverXUm=e.xUm,this.hoverYUm=e.yUm,this.hoverLevel=this.level,this.level=t.level,this.playbackRate=t.playbackRate??1,await this.dev.configure(this.pathConfig(t,0,1,t.rampMs)),this.plan=t,this.runSince=performance.now()/1e3,this.state="running"}async stopDrawing(){if(this.state!=="running")return;const t=this.plan?.raw?0:this.cfg.planner.rampMs;await this.dev.rate(0,t),await oi(t+80);const e=await this.dev.motionStatus();await this.dev.target(this.hoverPoint(e.xUm,e.yUm)),this.level=this.hoverLevel,await this.dev.configure(this.liveConfig()),this.hoverXUm=e.xUm,this.hoverYUm=e.yUm,this.state="hover"}async recolor(t){if(this.state!=="running"||!this.plan)throw new Re("nothing is running");if(!(t.points.length===this.plan.points.length&&Math.abs(t.periodS-this.plan.periodS)<1e-6&&t.points.every((s,r)=>Math.abs(s.xUm-this.plan.points[r].xUm)<10&&Math.abs(s.yUm-this.plan.points[r].yUm)<10)))throw new Re("geometry changed: stop and play the new plan instead");const n=(this.plan?.raw?0:this.cfg.planner.rampMs)-(performance.now()/1e3-this.runSince)*1e3;n>0&&await oi(n),await this.dev.upload(t.points,!0),await this.dev.configure(this.pathConfig(t,1,1,0)),this.plan=t}async drop(){await this.dev.stop(),this.state="idle"}async emergencyStop(){this.abort.value=!0,await this.dev.clear(),this.state="idle"}async dropTest(t,e=16,n=2,s=.8,r){if(this.state!=="hover")throw new Re("hover the bead first");const o=this.level;let a=o;for(;a>e&&!t.value&&!this.abort.value;){a-=n,await this.setLevel(a),r?.(a);const l=performance.now()+s*1e3;for(;performance.now()<l&&!t.value;)await oi(20)}return t.value?(await this.drop(),this.level=o,Math.min(o,a+2*n)):(await this.setLevel(o),null)}async spinTest(t,e={}){if(this.state!=="hover")throw new Re("hover the bead first");const n=e.radiusMm??yp,s=e.sweepS??Ep,r=this.cfg,o=r.planner,a=xp(r),l=Xf(r,a),c=n*.001,u=Zf(l,c),h=Math.max(5,Math.round(1e3/(bp*u))),d=1e3/h,p=Math.min(Sp*u/d,.5),_=Math.min(256,this.dev.profile.maxPathPoints),g=r.display.centerXMm*1e3,m=r.display.centerYMm*1e3,f=[];for(let x=0;x<_;x++){const b=2*Math.PI*x/_;f.push(this.hoverPoint(g+n*1e3*Math.cos(b),m+n*1e3*Math.sin(b)))}this.abort.value=!1,await this.dev.upload(f);const w=f[0],E=Math.hypot(w.xUm-this.hoverXUm,w.yUm-this.hoverYUm);await this.dev.target(this.hoverPoint(w.xUm,w.yUm)),await this.waitAt(w.xUm,w.yUm,3+E*.001/o.seekSpeedMmS),this.hoverXUm=w.xUm,this.hoverYUm=w.yUm,this.hoverLevel=this.level,this.level=a,await this.dev.configure(new Br({mode:xo,flags:nc|ic|va,outputRateHz:o.outputRateHz,loopMs:h,level:a,trapMode:Mi(r),palette:[[255,255,255]],rateInitial:0,rateTarget:p,rateRampMs:Math.trunc(Ms*1e3)})),this.plan=null,this.runSince=performance.now()/1e3,this.state="running";const M=s/Math.log(1/p),R=[[0,0]],A=performance.now();for(;!t.value&&!this.abort.value;){const x=(performance.now()-A)/1e3;let b;if(x<Ms){const y=x/Ms;b=p*y*y*(3-2*y)}else b=Math.min(p*Math.exp((x-Ms)/M),1),await this.dev.rate(b,Math.trunc(xc*1e3));if(R.push([x,b]),e.report?.(b*d),b>=1&&x>Ms+s+1)break;await oi(xc*1e3)}if(this.abort.value)throw new Re("aborted");if(!t.value)return await this.stopDrawing(),null;const P=Math.max(0,(performance.now()-A)/1e3-wp);let D=0;for(let x=R.length-1;x>=0;x--)if(R[x][0]<=P){D=R[x][1];break}return await this.drop(),this.level=this.hoverLevel,D*d<.2*u?null:Kf(l,D*d,c,a)}}const ta=128,Ds=256;function bo(i){if(i.phase.length!==Qe||i.level.length!==Qe)throw new Error(`hologram frame must carry ${Qe} channels`)}function Ap(i){return(Math.round(i*Ds/(2*Math.PI))%Ds+Ds)%Ds}function Rp(i,t={}){if(i.length===0)throw new Error("hologram synthesis needs at least one target");const e=_l(t.coordinatesUm??null),n=e.count,s=t.levelScale??1,r=new Float64Array(n),o=new Float64Array(n),a=i.map(g=>g.xMm*.001),l=i.map(g=>g.yMm*.001),c=i.map(g=>g.zMm*.001),u=i.map(g=>g.weight===void 0?1:g.weight),h=e.xyz;for(let g=0;g<i.length;g++){const m=u[g];if(m!==0)for(let f=0;f<n;f++){const w=h[f*3]-a[g],E=h[f*3+1]-l[g],M=h[f*3+2]-c[g],R=Math.sqrt(w*w+E*E+M*M);if(R<1e-9)continue;const A=-Qn*R;r[f]+=m*Math.cos(A),o[f]+=m*Math.sin(A)}}const d=new Uint8Array(Qe),p=new Uint8Array(Qe);let _=0;for(let g=0;g<u.length;g++)_+=Math.abs(u[g]);if(!(_>0))throw new Error("hologram synthesis needs a non-zero total weight");for(let g=0;g<n;g++){d[g]=Ap(Math.atan2(o[g],r[g]));const f=Math.hypot(r[g],o[g])/_*ta*s;p[g]=Math.max(0,Math.min(ta,Math.round(f)))}return{frame:{phase:d,level:p},quality:Dp(i,{phase:d,level:p},e)}}function Cp(i,t,e){const n=i.length;if(n===0)return[];const s=new Float64Array(n);let r=0;for(let a=0;a<n;a++){const l=(a+1)%n;s[a]=Math.hypot(i[l]-i[a],t[l]-t[a]),r+=s[a]}if(!(r>0))return[[i[0],t[0]]];const o=[];for(let a=0;a<e;a++){const l=a/e*r;let c=0,u=0;for(;u<n-1&&c+s[u]<l;)c+=s[u],u++;const h=(u+1)%n,d=s[u]>0?Math.min(1,(l-c)/s[u]):0;o.push([i[u]+(i[h]-i[u])*d,t[u]+(t[h]-t[u])*d])}return o}function Pp(i,t,e={}){const n=Mp(i,t),s=Math.max(8,Math.round(e.samples??64)),r=Cp(n.xMm,n.yMm,s),o=e.zMm??_o(i),a=r.map(([l,c])=>({xMm:l,yMm:c,zMm:o}));return Rp(a,e)}function Lp(i,t,e){bo(i),bo(t);const n=Math.max(0,Math.min(1,e)),s=new Uint8Array(Qe),r=new Uint8Array(Qe);for(let o=0;o<Qe;o++){let a=t.phase[o]-i.phase[o]|0;a>127?a-=256:a<-128&&(a+=256),s[o]=i.phase[o]+Math.round(a*n)&255,r[o]=Math.round(i.level[o]+(t.level[o]-i.level[o])*n)}return{phase:s,level:r}}function Up(i){const t=[],e=Math.max(1,Math.floor(i.length/4e3));for(let s=0;s<i.length;s+=e)t.push(i[s]);t.sort((s,r)=>s-r);const n=s=>t[Math.min(t.length-1,Math.max(0,Math.floor(s*(t.length-1))))];return{lo:n(.02),hi:n(.98)}}function Eo(i,t,e,n,s,r){bo(i);const o=e.length,a=t.count,l=t.xyz,c=new Float64Array(o);for(let u=0;u<o;u++){let h=0,d=0;for(let p=0;p<2;p++){const _=p===0?1:-1;for(let g=0;g<a;g++){const m=l[g*3],f=l[g*3+1],w=p===0?l[g*3+2]:2*r-l[g*3+2],E=e[u]-m,M=n[u]-f,R=s-w,A=Math.sqrt(E*E+M*M+R*R);if(A<1e-9)continue;const P=So(_*R/A);if(P===0)continue;const D=i.phase[g]*2*Math.PI/Ds+Qn*A,x=P*i.level[g]/ta/A;h+=x*Math.cos(D),d+=x*Math.sin(D)}}c[u]=Math.hypot(h,d)}return c}function Dp(i,t,e){const n=Math.max(24,Math.min(64,i.length*2)),r=80*.5,o=n*n,a=new Float64Array(o),l=new Float64Array(o);for(let M=0;M<n;M++)for(let R=0;R<n;R++){const A=M*n+R;a[A]=-r+2*r*R/(n-1),l[A]=-r+2*r*M/(n-1)}const c=(i[0]?.zMm??102)*.001,u=Eo(t,e,a,l,c,c);let h=0;for(let M=0;M<o;M++)h+=u[M];const d=h/o;let p=0;for(let M=0;M<o;M++)u[M]>p&&(p=u[M]);const _=Float64Array.from(i,M=>M.xMm*.001),g=Float64Array.from(i,M=>M.yMm*.001),m=Eo(t,e,_,g,c,c);let f=0,w=0;for(let M=0;M<m.length;M++)m[M]>f&&(f=m[M]),w+=m[M]*m[M];w/=Math.max(1,m.length);const E=ta/Math.max(1e-9,c);return{peakToMean:d>0?p/d:0,energy:E>0?w/(E*E):0,sidelobeDb:f>0?20*Math.log10(d/f):-1/0}}function Ip(i,t){const e=Math.max(16,Math.round(t.grid)),n=t.extentMm*.5,s=_l(null),r=t.tableDistanceMm??95,o=jr+r-t.heightMm,a=new Float64Array(e*e),l=new Float64Array(e*e);for(let p=0;p<e;p++)for(let _=0;_<e;_++){const g=p*e+_;a[g]=(-n+2*n*_/(e-1))*.001,l[g]=(-n+2*n*p/(e-1))*.001}const c=Eo(i,s,a,l,o*.001,(jr+r)*.001),u=new Float32Array(e*e);for(let p=0;p<u.length;p++)u[p]=c[p]*c[p];const h=Up(u),d=Math.max(h.hi-h.lo,1e-12);for(let p=0;p<u.length;p++)u[p]=Math.max(0,Math.min(1,(u[p]-h.lo)/d));return{width:e,height:e,values:u,xMin:-n,xMax:n,yMin:-n,yMax:n}}const xl="179",is={ROTATE:0,DOLLY:1,PAN:2},es={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Np=0,yc=1,Fp=2,Mu=1,Op=2,Nn=3,ii=0,$e=1,un=2,ti=0,ss=1,Mn=2,Sc=3,bc=4,Bp=5,mi=100,zp=101,Hp=102,kp=103,Gp=104,Vp=200,Wp=201,Xp=202,Yp=203,wo=204,To=205,$p=206,qp=207,jp=208,Kp=209,Zp=210,Jp=211,Qp=212,tm=213,em=214,Ao=0,Ro=1,Co=2,cs=3,Po=4,Lo=5,Uo=6,Do=7,xu=0,nm=1,im=2,ei=0,sm=1,rm=2,am=3,yu=4,om=5,lm=6,cm=7,Su=300,hs=301,us=302,Io=303,No=304,ha=306,Fo=1e3,xi=1001,Oo=1002,tn=1003,hm=1004,Qs=1005,on=1006,ba=1007,yi=1008,wn=1009,bu=1010,Eu=1011,Gs=1012,yl=1013,bi=1014,Sn=1015,qs=1016,Sl=1017,bl=1018,Vs=1020,wu=35902,Tu=1021,Au=1022,fn=1023,Ws=1026,Xs=1027,El=1028,wl=1029,Ru=1030,Tl=1031,Al=1033,zr=33776,Hr=33777,kr=33778,Gr=33779,Bo=35840,zo=35841,Ho=35842,ko=35843,Go=36196,Vo=37492,Wo=37496,Xo=37808,Yo=37809,$o=37810,qo=37811,jo=37812,Ko=37813,Zo=37814,Jo=37815,Qo=37816,tl=37817,el=37818,nl=37819,il=37820,sl=37821,Vr=36492,rl=36494,al=36495,Cu=36283,ol=36284,ll=36285,cl=36286,um=3200,dm=3201,Pu=0,fm=1,Zn="",Be="srgb",ds="srgb-linear",ea="linear",te="srgb",Ri=7680,Ec=519,pm=512,mm=513,gm=514,Lu=515,_m=516,vm=517,Mm=518,xm=519,hl=35044,wc="300 es",bn=2e3,na=2001;class Ti{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tc=1234567;const zs=Math.PI/180,Ys=180/Math.PI;function Bn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Ut(i,t,e){return Math.max(t,Math.min(e,i))}function Rl(i,t){return(i%t+t)%t}function ym(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Sm(i,t,e){return i!==t?(e-i)/(t-i):0}function Hs(i,t,e){return(1-e)*i+e*t}function bm(i,t,e,n){return Hs(i,t,1-Math.exp(-e*n))}function Em(i,t=1){return t-Math.abs(Rl(i,t*2)-t)}function wm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Tm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Am(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Rm(i,t){return i+Math.random()*(t-i)}function Cm(i){return i*(.5-Math.random())}function Pm(i){i!==void 0&&(Tc=i);let t=Tc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lm(i){return i*zs}function Um(i){return i*Ys}function Dm(i){return(i&i-1)===0&&i!==0}function Im(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Nm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fm(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),_=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*_,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*_,a*c);break;case"ZYZ":i.set(l*_,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function dn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Jt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Uu={DEG2RAD:zs,RAD2DEG:Ys,generateUUID:Bn,clamp:Ut,euclideanModulo:Rl,mapLinear:ym,inverseLerp:Sm,lerp:Hs,damp:bm,pingpong:Em,smoothstep:wm,smootherstep:Tm,randInt:Am,randFloat:Rm,randFloatSpread:Cm,seededRandom:Pm,degToRad:Lm,radToDeg:Um,isPowerOfTwo:Dm,ceilPowerOfTwo:Im,floorPowerOfTwo:Nm,setQuaternionFromProperEuler:Fm,normalize:Jt,denormalize:dn};class bt{constructor(t=0,e=0){bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Ut(this.x,t.x,e.x),this.y=Ut(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Ut(this.x,t,e),this.y=Ut(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ut(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ut(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ei{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],p=r[o+1],_=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=_,t[e+3]=g;return}if(h!==g||l!==d||c!==p||u!==_){let m=1-a;const f=l*d+c*p+u*_+h*g,w=f>=0?1:-1,E=1-f*f;if(E>Number.EPSILON){const R=Math.sqrt(E),A=Math.atan2(R,f*w);m=Math.sin(m*A)/R,a=Math.sin(a*A)/R}const M=a*w;if(l=l*m+d*M,c=c*m+p*M,u=u*m+_*M,h=h*m+g*M,m===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],p=r[o+2],_=r[o+3];return t[e]=a*_+u*h+l*p-c*d,t[e+1]=l*_+u*d+c*h-a*p,t[e+2]=c*_+u*p+a*d-l*h,t[e+3]=u*_-a*h-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),p=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"YXZ":this._x=d*u*h+c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"ZXY":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h-d*p*_;break;case"ZYX":this._x=d*u*h-c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h+d*p*_;break;case"YZX":this._x=d*u*h+c*p*_,this._y=c*p*h+d*u*_,this._z=c*u*_-d*p*h,this._w=c*u*h-d*p*_;break;case"XZY":this._x=d*u*h-c*p*_,this._y=c*p*h-d*u*_,this._z=c*u*_+d*p*h,this._w=c*u*h+d*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>h){const p=2*Math.sqrt(1+n-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-n-h);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ut(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ac.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ac.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Ut(this.x,t.x,e.x),this.y=Ut(this.y,t.y,e.y),this.z=Ut(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Ut(this.x,t,e),this.y=Ut(this.y,t,e),this.z=Ut(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ut(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ea.copy(this).projectOnVector(t),this.sub(Ea)}reflect(t){return this.sub(Ea.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ut(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ea=new C,Ac=new Ei;class Ot{constructor(t,e,n,s,r,o,a,l,c){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],p=n[5],_=n[8],g=s[0],m=s[3],f=s[6],w=s[1],E=s[4],M=s[7],R=s[2],A=s[5],P=s[8];return r[0]=o*g+a*w+l*R,r[3]=o*m+a*E+l*A,r[6]=o*f+a*M+l*P,r[1]=c*g+u*w+h*R,r[4]=c*m+u*E+h*A,r[7]=c*f+u*M+h*P,r[2]=d*g+p*w+_*R,r[5]=d*m+p*E+_*A,r[8]=d*f+p*M+_*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,p=c*r-o*l,_=e*h+n*d+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=h*g,t[1]=(s*c-u*n)*g,t[2]=(a*n-s*o)*g,t[3]=d*g,t[4]=(u*e-s*l)*g,t[5]=(s*r-a*e)*g,t[6]=p*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(wa.makeScale(t,e)),this}rotate(t){return this.premultiply(wa.makeRotation(-t)),this}translate(t,e){return this.premultiply(wa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const wa=new Ot;function Du(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ia(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Om(){const i=ia("canvas");return i.style.display="block",i}const Rc={};function rs(i){i in Rc||(Rc[i]=!0,console.warn(i))}function Bm(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Cc=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pc=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zm(){const i={enabled:!0,workingColorSpace:ds,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===te&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===te&&(s.r=as(s.r),s.g=as(s.g),s.b=as(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Zn?ea:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return rs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return rs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ds]:{primaries:t,whitePoint:n,transfer:ea,toXYZ:Cc,fromXYZ:Pc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:n,transfer:te,toXYZ:Cc,fromXYZ:Pc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),i}const $t=zm();function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function as(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ci;class Hm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ci===void 0&&(Ci=ia("canvas")),Ci.width=t.width,Ci.height=t.height;const s=Ci.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ci}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ia("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=zn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let km=0;class Cl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=Bn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ta(s[o].image)):r.push(Ta(s[o]))}else r=Ta(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hm.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Gm=0;const Aa=new C;class Ie extends Ti{constructor(t=Ie.DEFAULT_IMAGE,e=Ie.DEFAULT_MAPPING,n=xi,s=xi,r=on,o=yi,a=fn,l=wn,c=Ie.DEFAULT_ANISOTROPY,u=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gm++}),this.uuid=Bn(),this.name="",this.source=new Cl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new bt(0,0),this.repeat=new bt(1,1),this.center=new bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Aa).x}get height(){return this.source.getSize(Aa).y}get depth(){return this.source.getSize(Aa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Su)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fo:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case Oo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fo:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case Oo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ie.DEFAULT_IMAGE=null;Ie.DEFAULT_MAPPING=Su;Ie.DEFAULT_ANISOTROPY=1;class Wt{constructor(t=0,e=0,n=0,s=1){Wt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],_=l[9],g=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,M=(p+1)/2,R=(f+1)/2,A=(u+d)/4,P=(h+g)/4,D=(_+m)/4;return E>M&&E>R?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=A/n,r=P/n):M>R?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=A/s,r=D/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=D/r),this.set(n,s,r,e),this}let w=Math.sqrt((m-_)*(m-_)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(m-_)/w,this.y=(h-g)/w,this.z=(d-u)/w,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Ut(this.x,t.x,e.x),this.y=Ut(this.y,t.y,e.y),this.z=Ut(this.z,t.z,e.z),this.w=Ut(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Ut(this.x,t,e),this.y=Ut(this.y,t,e),this.z=Ut(this.z,t,e),this.w=Ut(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ut(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vm extends Ti{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Wt(0,0,t,e),this.scissorTest=!1,this.viewport=new Wt(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ie(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Cl(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class wi extends Vm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Iu extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wm extends Ie{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=tn,this.minFilter=tn,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class An{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ln):ln.fromBufferAttribute(r,o),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),tr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),tr.copy(n.boundingBox)),tr.applyMatrix4(t.matrixWorld),this.union(tr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xs),er.subVectors(this.max,xs),Pi.subVectors(t.a,xs),Li.subVectors(t.b,xs),Ui.subVectors(t.c,xs),Vn.subVectors(Li,Pi),Wn.subVectors(Ui,Li),li.subVectors(Pi,Ui);let e=[0,-Vn.z,Vn.y,0,-Wn.z,Wn.y,0,-li.z,li.y,Vn.z,0,-Vn.x,Wn.z,0,-Wn.x,li.z,0,-li.x,-Vn.y,Vn.x,0,-Wn.y,Wn.x,0,-li.y,li.x,0];return!Ra(e,Pi,Li,Ui,er)||(e=[1,0,0,0,1,0,0,0,1],!Ra(e,Pi,Li,Ui,er))?!1:(nr.crossVectors(Vn,Wn),e=[nr.x,nr.y,nr.z],Ra(e,Pi,Li,Ui,er))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Pn=[new C,new C,new C,new C,new C,new C,new C,new C],ln=new C,tr=new An,Pi=new C,Li=new C,Ui=new C,Vn=new C,Wn=new C,li=new C,xs=new C,er=new C,nr=new C,ci=new C;function Ra(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ci.fromArray(i,r);const a=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),l=t.dot(ci),c=e.dot(ci),u=n.dot(ci);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Xm=new An,ys=new C,Ca=new C;class kn{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Xm.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ys.subVectors(t,this.center);const e=ys.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ys,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ys.copy(t.center).add(Ca)),this.expandByPoint(ys.copy(t.center).sub(Ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ln=new C,Pa=new C,ir=new C,Xn=new C,La=new C,sr=new C,Ua=new C;class ua{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Pa.copy(t).add(e).multiplyScalar(.5),ir.copy(e).sub(t).normalize(),Xn.copy(this.origin).sub(Pa);const r=t.distanceTo(e)*.5,o=-this.direction.dot(ir),a=Xn.dot(this.direction),l=-Xn.dot(ir),c=Xn.lengthSq(),u=Math.abs(1-o*o);let h,d,p,_;if(u>0)if(h=o*l-a,d=o*a-l,_=r*u,h>=0)if(d>=-_)if(d<=_){const g=1/u;h*=g,d*=g,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-_?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c):d<=_?(h=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Pa).addScaledVector(ir,d),p}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);const n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,n,s,r){La.subVectors(e,t),sr.subVectors(n,t),Ua.crossVectors(La,sr);let o=this.direction.dot(Ua),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Xn.subVectors(this.origin,t);const l=a*this.direction.dot(sr.crossVectors(Xn,sr));if(l<0)return null;const c=a*this.direction.dot(La.cross(Xn));if(c<0||l+c>o)return null;const u=-a*Xn.dot(Ua);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt{constructor(t,e,n,s,r,o,a,l,c,u,h,d,p,_,g,m){Zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,d,p,_,g,m)}set(t,e,n,s,r,o,a,l,c,u,h,d,p,_,g,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=_,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Di.setFromMatrixColumn(t,0).length(),r=1/Di.setFromMatrixColumn(t,1).length(),o=1/Di.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=o*u,p=o*h,_=a*u,g=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+_*c,e[5]=d-g*c,e[9]=-a*l,e[2]=g-d*c,e[6]=_+p*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*u,p=l*h,_=c*u,g=c*h;e[0]=d+g*a,e[4]=_*a-p,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=p*a-_,e[6]=g+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*u,p=l*h,_=c*u,g=c*h;e[0]=d-g*a,e[4]=-o*h,e[8]=_+p*a,e[1]=p+_*a,e[5]=o*u,e[9]=g-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*u,p=o*h,_=a*u,g=a*h;e[0]=l*u,e[4]=_*c-p,e[8]=d*c+g,e[1]=l*h,e[5]=g*c+d,e[9]=p*c-_,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,p=o*c,_=a*l,g=a*c;e[0]=l*u,e[4]=g-d*h,e[8]=_*h+p,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=p*h+_,e[10]=d-g*h}else if(t.order==="XZY"){const d=o*l,p=o*c,_=a*l,g=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+g,e[5]=o*u,e[9]=p*h-_,e[2]=_*h-p,e[6]=a*u,e[10]=g*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ym,t,$m)}lookAt(t,e,n){const s=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Yn.crossVectors(n,Ke),Yn.lengthSq()===0&&(Math.abs(n.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Yn.crossVectors(n,Ke)),Yn.normalize(),rr.crossVectors(Ke,Yn),s[0]=Yn.x,s[4]=rr.x,s[8]=Ke.x,s[1]=Yn.y,s[5]=rr.y,s[9]=Ke.y,s[2]=Yn.z,s[6]=rr.z,s[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],p=n[13],_=n[2],g=n[6],m=n[10],f=n[14],w=n[3],E=n[7],M=n[11],R=n[15],A=s[0],P=s[4],D=s[8],x=s[12],b=s[1],y=s[5],U=s[9],N=s[13],B=s[2],W=s[6],V=s[10],Z=s[14],H=s[3],nt=s[7],ct=s[11],_t=s[15];return r[0]=o*A+a*b+l*B+c*H,r[4]=o*P+a*y+l*W+c*nt,r[8]=o*D+a*U+l*V+c*ct,r[12]=o*x+a*N+l*Z+c*_t,r[1]=u*A+h*b+d*B+p*H,r[5]=u*P+h*y+d*W+p*nt,r[9]=u*D+h*U+d*V+p*ct,r[13]=u*x+h*N+d*Z+p*_t,r[2]=_*A+g*b+m*B+f*H,r[6]=_*P+g*y+m*W+f*nt,r[10]=_*D+g*U+m*V+f*ct,r[14]=_*x+g*N+m*Z+f*_t,r[3]=w*A+E*b+M*B+R*H,r[7]=w*P+E*y+M*W+R*nt,r[11]=w*D+E*U+M*V+R*ct,r[15]=w*x+E*N+M*Z+R*_t,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],_=t[3],g=t[7],m=t[11],f=t[15];return _*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*p-n*l*p)+g*(+e*l*p-e*c*d+r*o*d-s*o*p+s*c*u-r*l*u)+m*(+e*c*h-e*a*p-r*o*h+n*o*p+r*a*u-n*c*u)+f*(-s*a*u-e*l*h+e*a*d+s*o*h-n*o*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],_=t[12],g=t[13],m=t[14],f=t[15],w=h*m*c-g*d*c+g*l*p-a*m*p-h*l*f+a*d*f,E=_*d*c-u*m*c-_*l*p+o*m*p+u*l*f-o*d*f,M=u*g*c-_*h*c+_*a*p-o*g*p-u*a*f+o*h*f,R=_*h*l-u*g*l-_*a*d+o*g*d+u*a*m-o*h*m,A=e*w+n*E+s*M+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/A;return t[0]=w*P,t[1]=(g*d*r-h*m*r-g*s*p+n*m*p+h*s*f-n*d*f)*P,t[2]=(a*m*r-g*l*r+g*s*c-n*m*c-a*s*f+n*l*f)*P,t[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*p-n*l*p)*P,t[4]=E*P,t[5]=(u*m*r-_*d*r+_*s*p-e*m*p-u*s*f+e*d*f)*P,t[6]=(_*l*r-o*m*r-_*s*c+e*m*c+o*s*f-e*l*f)*P,t[7]=(o*d*r-u*l*r+u*s*c-e*d*c-o*s*p+e*l*p)*P,t[8]=M*P,t[9]=(_*h*r-u*g*r-_*n*p+e*g*p+u*n*f-e*h*f)*P,t[10]=(o*g*r-_*a*r+_*n*c-e*g*c-o*n*f+e*a*f)*P,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*p-e*a*p)*P,t[12]=R*P,t[13]=(u*g*s-_*h*s+_*n*d-e*g*d-u*n*m+e*h*m)*P,t[14]=(_*a*s-o*g*s-_*n*l+e*g*l+o*n*m-e*a*m)*P,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*d+e*a*d)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,p=r*u,_=r*h,g=o*u,m=o*h,f=a*h,w=l*c,E=l*u,M=l*h,R=n.x,A=n.y,P=n.z;return s[0]=(1-(g+f))*R,s[1]=(p+M)*R,s[2]=(_-E)*R,s[3]=0,s[4]=(p-M)*A,s[5]=(1-(d+f))*A,s[6]=(m+w)*A,s[7]=0,s[8]=(_+E)*P,s[9]=(m-w)*P,s[10]=(1-(d+g))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Di.set(s[0],s[1],s[2]).length();const o=Di.set(s[4],s[5],s[6]).length(),a=Di.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],cn.copy(this);const c=1/r,u=1/o,h=1/a;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=u,cn.elements[5]*=u,cn.elements[6]*=u,cn.elements[8]*=h,cn.elements[9]*=h,cn.elements[10]*=h,e.setFromRotationMatrix(cn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=bn,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s);let _,g;if(l)_=r/(o-r),g=o*r/(o-r);else if(a===bn)_=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===na)_=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=bn,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),p=-(n+s)/(n-s);let _,g;if(l)_=1/(o-r),g=o/(o-r);else if(a===bn)_=-2/(o-r),g=-(o+r)/(o-r);else if(a===na)_=-1/(o-r),g=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=_,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Di=new C,cn=new Zt,Ym=new C(0,0,0),$m=new C(1,1,1),Yn=new C,rr=new C,Ke=new C,Lc=new Zt,Uc=new Ei;class Tn{constructor(t=0,e=0,n=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ut(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ut(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Lc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Lc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Uc.setFromEuler(this),this.setFromQuaternion(Uc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";let Nu=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qm=0;const Dc=new C,Ii=new Ei,Un=new Zt,ar=new C,Ss=new C,jm=new C,Km=new Ei,Ic=new C(1,0,0),Nc=new C(0,1,0),Fc=new C(0,0,1),Oc={type:"added"},Zm={type:"removed"},Ni={type:"childadded",child:null},Da={type:"childremoved",child:null};class xe extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qm++}),this.uuid=Bn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new C,e=new Tn,n=new Ei,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Zt},normalMatrix:{value:new Ot}}),this.matrix=new Zt,this.matrixWorld=new Zt,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.premultiply(Ii),this}rotateX(t){return this.rotateOnAxis(Ic,t)}rotateY(t){return this.rotateOnAxis(Nc,t)}rotateZ(t){return this.rotateOnAxis(Fc,t)}translateOnAxis(t,e){return Dc.copy(t).applyQuaternion(this.quaternion),this.position.add(Dc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ic,t)}translateY(t){return this.translateOnAxis(Nc,t)}translateZ(t){return this.translateOnAxis(Fc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ar.copy(t):ar.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(Ss,ar,this.up):Un.lookAt(ar,Ss,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Ii.setFromRotationMatrix(Un),this.quaternion.premultiply(Ii.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Oc),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Zm),Da.child=t,this.dispatchEvent(Da),Da.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Oc),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,t,jm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ss,Km,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),p=o(t.animations),_=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}xe.DEFAULT_UP=new C(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new C,Dn=new C,Ia=new C,In=new C,Fi=new C,Oi=new C,Bc=new C,Na=new C,Fa=new C,Oa=new C,Ba=new Wt,za=new Wt,Ha=new Wt;let Ji=class Qi{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),hn.subVectors(t,e),s.cross(hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){hn.subVectors(s,e),Dn.subVectors(n,e),Ia.subVectors(t,e);const o=hn.dot(hn),a=hn.dot(Dn),l=hn.dot(Ia),c=Dn.dot(Dn),u=Dn.dot(Ia),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,_=(o*u-a*l)*d;return r.set(1-p-_,_,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(o,In.y),l.addScaledVector(a,In.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Ba.setScalar(0),za.setScalar(0),Ha.setScalar(0),Ba.fromBufferAttribute(t,e),za.fromBufferAttribute(t,n),Ha.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Ba,r.x),o.addScaledVector(za,r.y),o.addScaledVector(Ha,r.z),o}static isFrontFacing(t,e,n,s){return hn.subVectors(n,e),Dn.subVectors(t,e),hn.cross(Dn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),hn.cross(Dn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Qi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Qi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Qi.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Qi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Qi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Fi.subVectors(s,n),Oi.subVectors(r,n),Na.subVectors(t,n);const l=Fi.dot(Na),c=Oi.dot(Na);if(l<=0&&c<=0)return e.copy(n);Fa.subVectors(t,s);const u=Fi.dot(Fa),h=Oi.dot(Fa);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Fi,o);Oa.subVectors(t,r);const p=Fi.dot(Oa),_=Oi.dot(Oa);if(_>=0&&p<=_)return e.copy(r);const g=p*c-l*_;if(g<=0&&c>=0&&_<=0)return a=c/(c-_),e.copy(n).addScaledVector(Oi,a);const m=u*_-p*h;if(m<=0&&h-u>=0&&p-_>=0)return Bc.subVectors(r,s),a=(h-u)/(h-u+(p-_)),e.copy(s).addScaledVector(Bc,a);const f=1/(m+g+d);return o=g*f,a=d*f,e.copy(n).addScaledVector(Fi,o).addScaledVector(Oi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}};const Fu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},or={h:0,s:0,l:0};function ka(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Gt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=$t.workingColorSpace){if(t=Rl(t,1),e=Ut(e,0,1),n=Ut(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ka(o,r,t+1/3),this.g=ka(o,r,t),this.b=ka(o,r,t-1/3)}return $t.colorSpaceToWorking(this,s),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=Fu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=as(t.r),this.g=as(t.g),this.b=as(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return $t.workingToColorSpace(Fe.copy(this),t),Math.round(Ut(Fe.r*255,0,255))*65536+Math.round(Ut(Fe.g*255,0,255))*256+Math.round(Ut(Fe.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.workingToColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=$t.workingColorSpace){return $t.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Be){$t.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($n),this.setHSL($n.h+t,$n.s+e,$n.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($n),t.getHSL(or);const n=Hs($n.h,or.h,e),s=Hs($n.s,or.s,e),r=Hs($n.l,or.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Gt;Gt.NAMES=Fu;let Jm=0;class si extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jm++}),this.uuid=Bn(),this.name="",this.type="Material",this.blending=ss,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wo,this.blendDst=To,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ec,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ss&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wo&&(n.blendSrc=this.blendSrc),this.blendDst!==To&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ec&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class gi extends si{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=xu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new C,lr=new bt;let Qm=0;class De{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=hl,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)lr.fromBufferAttribute(this,e),lr.applyMatrix3(t),this.setXY(e,lr.x,lr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=dn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=dn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=dn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=dn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=dn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==hl&&(t.usage=this.usage),t}}class Ou extends De{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Bu extends De{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends De{constructor(t,e,n){super(new Float32Array(t),e,n)}}let tg=0;const sn=new Zt,Ga=new xe,Bi=new C,Ze=new An,bs=new An,Te=new C;class ee extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tg++}),this.uuid=Bn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Du(t)?Bu:Ou)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Ga.lookAt(t),Ga.updateMatrix(),this.applyMatrix4(Ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new re(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ze.setFromBufferAttribute(r),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];bs.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(Ze.min,bs.min),Ze.expandByPoint(Te),Te.addVectors(Ze.max,bs.max),Ze.expandByPoint(Te)):(Ze.expandByPoint(bs.min),Ze.expandByPoint(bs.max))}Ze.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Te.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Te.fromBufferAttribute(a,c),l&&(Bi.fromBufferAttribute(t,c),Te.add(Bi)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new De(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let D=0;D<n.count;D++)a[D]=new C,l[D]=new C;const c=new C,u=new C,h=new C,d=new bt,p=new bt,_=new bt,g=new C,m=new C;function f(D,x,b){c.fromBufferAttribute(n,D),u.fromBufferAttribute(n,x),h.fromBufferAttribute(n,b),d.fromBufferAttribute(r,D),p.fromBufferAttribute(r,x),_.fromBufferAttribute(r,b),u.sub(c),h.sub(c),p.sub(d),_.sub(d);const y=1/(p.x*_.y-_.x*p.y);isFinite(y)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(y),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(y),a[D].add(g),a[x].add(g),a[b].add(g),l[D].add(m),l[x].add(m),l[b].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let D=0,x=w.length;D<x;++D){const b=w[D],y=b.start,U=b.count;for(let N=y,B=y+U;N<B;N+=3)f(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const E=new C,M=new C,R=new C,A=new C;function P(D){R.fromBufferAttribute(s,D),A.copy(R);const x=a[D];E.copy(x),E.sub(R.multiplyScalar(R.dot(x))).normalize(),M.crossVectors(A,x);const y=M.dot(l[D])<0?-1:1;o.setXYZW(D,E.x,E.y,E.z,y)}for(let D=0,x=w.length;D<x;++D){const b=w[D],y=b.start,U=b.count;for(let N=y,B=y+U;N<B;N+=3)P(t.getX(N+0)),P(t.getX(N+1)),P(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new De(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,u=new C,h=new C;if(t)for(let d=0,p=t.count;d<p;d+=3){const _=t.getX(d+0),g=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,_=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?p=l[g]*a.data.stride+a.offset:p=l[g]*u;for(let f=0;f<u;f++)d[_++]=c[p++]}return new De(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ee,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=t(d,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zc=new Zt,hi=new ua,cr=new kn,Hc=new C,hr=new C,ur=new C,dr=new C,Va=new C,fr=new C,kc=new C,pr=new C;class Se extends xe{constructor(t=new ee,e=new gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){fr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Va.fromBufferAttribute(h,t),o?fr.addScaledVector(Va,u):fr.addScaledVector(Va.sub(e),u))}e.add(fr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(r),hi.copy(t.ray).recast(t.near),!(cr.containsPoint(hi.origin)===!1&&(hi.intersectSphere(cr,Hc)===null||hi.origin.distanceToSquared(Hc)>(t.far-t.near)**2))&&(zc.copy(r).invert(),hi.copy(t.ray).applyMatrix4(zc),!(n.boundingBox!==null&&hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,hi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const m=d[_],f=o[m.materialIndex],w=Math.max(m.start,p.start),E=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=w,R=E;M<R;M+=3){const A=a.getX(M),P=a.getX(M+1),D=a.getX(M+2);s=mr(this,f,t,n,c,u,h,A,P,D),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(a.count,p.start+p.count);for(let m=_,f=g;m<f;m+=3){const w=a.getX(m),E=a.getX(m+1),M=a.getX(m+2);s=mr(this,o,t,n,c,u,h,w,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,g=d.length;_<g;_++){const m=d[_],f=o[m.materialIndex],w=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=w,R=E;M<R;M+=3){const A=M,P=M+1,D=M+2;s=mr(this,f,t,n,c,u,h,A,P,D),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(l.count,p.start+p.count);for(let m=_,f=g;m<f;m+=3){const w=m,E=m+1,M=m+2;s=mr(this,o,t,n,c,u,h,w,E,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function eg(i,t,e,n,s,r,o,a){let l;if(t.side===$e?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ii,a),l===null)return null;pr.copy(a),pr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(pr);return c<e.near||c>e.far?null:{distance:c,point:pr.clone(),object:i}}function mr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,hr),i.getVertexPosition(l,ur),i.getVertexPosition(c,dr);const u=eg(i,t,e,n,hr,ur,dr,kc);if(u){const h=new C;Ji.getBarycoord(kc,hr,ur,dr,h),s&&(u.uv=Ji.getInterpolatedAttribute(s,a,l,c,h,new bt)),r&&(u.uv1=Ji.getInterpolatedAttribute(r,a,l,c,h,new bt)),o&&(u.normal=Ji.getInterpolatedAttribute(o,a,l,c,h,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new C,materialIndex:0};Ji.getNormal(hr,ur,dr,d.normal),u.face=d,u.barycoord=h}return u}class js extends ee{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;_("z","y","x",-1,-1,n,e,t,o,r,0),_("z","y","x",1,-1,n,e,-t,o,r,1),_("x","z","y",1,1,t,n,e,s,o,2),_("x","z","y",1,-1,t,n,-e,s,o,3),_("x","y","z",1,-1,t,e,n,s,r,4),_("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(u,3)),this.setAttribute("uv",new re(h,2));function _(g,m,f,w,E,M,R,A,P,D,x){const b=M/P,y=R/D,U=M/2,N=R/2,B=A/2,W=P+1,V=D+1;let Z=0,H=0;const nt=new C;for(let ct=0;ct<V;ct++){const _t=ct*y-N;for(let Nt=0;Nt<W;Nt++){const ie=Nt*b-U;nt[g]=ie*w,nt[m]=_t*E,nt[f]=B,c.push(nt.x,nt.y,nt.z),nt[g]=0,nt[m]=0,nt[f]=A>0?1:-1,u.push(nt.x,nt.y,nt.z),h.push(Nt/P),h.push(1-ct/D),Z+=1}}for(let ct=0;ct<D;ct++)for(let _t=0;_t<P;_t++){const Nt=d+_t+W*ct,ie=d+_t+W*(ct+1),qt=d+(_t+1)+W*(ct+1),Y=d+(_t+1)+W*ct;l.push(Nt,ie,Y),l.push(ie,qt,Y),H+=6}a.addGroup(p,H,x),p+=H,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new js(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function fs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=fs(i[e]);for(const s in n)t[s]=n[s]}return t}function ng(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function zu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const Pl={clone:fs,merge:Ge};var ig=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hn extends si{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ig,this.fragmentShader=sg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fs(t.uniforms),this.uniformsGroups=ng(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Hu extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Zt,this.projectionMatrix=new Zt,this.projectionMatrixInverse=new Zt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qn=new C,Gc=new bt,Vc=new bt;class Je extends Hu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ys*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(zs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,Gc,Vc),e.subVectors(Vc,Gc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(zs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const zi=-90,Hi=1;class rg extends xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Je(zi,Hi,t,e);s.layers=this.layers,this.add(s);const r=new Je(zi,Hi,t,e);r.layers=this.layers,this.add(r);const o=new Je(zi,Hi,t,e);o.layers=this.layers,this.add(o);const a=new Je(zi,Hi,t,e);a.layers=this.layers,this.add(a);const l=new Je(zi,Hi,t,e);l.layers=this.layers,this.add(l);const c=new Je(zi,Hi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===na)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class ku extends Ie{constructor(t=[],e=hs,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ag extends wi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ku(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new js(5,5,5),r=new Hn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:ti});r.uniforms.tEquirect.value=e;const o=new Se(s,r),a=e.minFilter;return e.minFilter===yi&&(e.minFilter=on),new rg(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Jn extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const og={type:"move"};class Wa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Jn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Jn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Jn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),f=this._getHandJoint(c,g);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,_=.005;c.inputState.pinching&&d>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(og)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Jn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class lg extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Gu{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=hl,this.updateRanges=[],this.version=0,this.uuid=Bn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Bn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ke=new C;class En{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyMatrix4(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.applyNormalMatrix(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ke.fromBufferAttribute(this,e),ke.transformDirection(t),this.setXYZ(e,ke.x,ke.y,ke.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=dn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Jt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=dn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=dn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=dn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=dn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new De(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new En(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Vu extends si{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ki;const Es=new C,Gi=new C,Vi=new C,Wi=new bt,ws=new bt,Wu=new Zt,gr=new C,Ts=new C,_r=new C,Wc=new bt,Xa=new bt,Xc=new bt;class cg extends xe{constructor(t=new Vu){if(super(),this.isSprite=!0,this.type="Sprite",ki===void 0){ki=new ee;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gu(e,5);ki.setIndex([0,1,2,0,2,3]),ki.setAttribute("position",new En(n,3,0,!1)),ki.setAttribute("uv",new En(n,2,3,!1))}this.geometry=ki,this.material=t,this.center=new bt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gi.setFromMatrixScale(this.matrixWorld),Wu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Vi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gi.multiplyScalar(-Vi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;vr(gr.set(-.5,-.5,0),Vi,o,Gi,s,r),vr(Ts.set(.5,-.5,0),Vi,o,Gi,s,r),vr(_r.set(.5,.5,0),Vi,o,Gi,s,r),Wc.set(0,0),Xa.set(1,0),Xc.set(1,1);let a=t.ray.intersectTriangle(gr,Ts,_r,!1,Es);if(a===null&&(vr(Ts.set(-.5,.5,0),Vi,o,Gi,s,r),Xa.set(0,1),a=t.ray.intersectTriangle(gr,_r,Ts,!1,Es),a===null))return;const l=t.ray.origin.distanceTo(Es);l<t.near||l>t.far||e.push({distance:l,point:Es.clone(),uv:Ji.getInterpolation(Es,gr,Ts,_r,Wc,Xa,Xc,new bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function vr(i,t,e,n,s,r){Wi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ws.x=r*Wi.x-s*Wi.y,ws.y=s*Wi.x+r*Wi.y):ws.copy(Wi),i.copy(t),i.x+=ws.x,i.y+=ws.y,i.applyMatrix4(Wu)}class hg extends Ie{constructor(t=null,e=1,n=1,s,r,o,a,l,c=tn,u=tn,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yc extends De{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Xi=new Zt,$c=new Zt,Mr=[],qc=new An,ug=new Zt,As=new Se,Rs=new kn;class dg extends Se{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Yc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ug)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new An),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Xi),qc.copy(t.boundingBox).applyMatrix4(Xi),this.boundingBox.union(qc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Xi),Rs.copy(t.boundingSphere).applyMatrix4(Xi),this.boundingSphere.union(Rs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(As.geometry=this.geometry,As.material=this.material,As.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Rs.copy(this.boundingSphere),Rs.applyMatrix4(n),t.ray.intersectsSphere(Rs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Xi),$c.multiplyMatrices(n,Xi),As.matrixWorld=$c,As.raycast(t,Mr);for(let o=0,a=Mr.length;o<a;o++){const l=Mr[o];l.instanceId=r,l.object=this,e.push(l)}Mr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Yc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new hg(new Float32Array(s*this.count),s,this.count,El,Sn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ya=new C,fg=new C,pg=new Ot;class Kn{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ya.subVectors(n,e).cross(fg.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ya),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||pg.getNormalMatrix(t),s=this.coplanarPoint(Ya).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new kn,mg=new bt(.5,.5),xr=new C;class Ll{constructor(t=new Kn,e=new Kn,n=new Kn,s=new Kn,r=new Kn,o=new Kn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],p=r[7],_=r[8],g=r[9],m=r[10],f=r[11],w=r[12],E=r[13],M=r[14],R=r[15];if(s[0].setComponents(c-o,p-u,f-_,R-w).normalize(),s[1].setComponents(c+o,p+u,f+_,R+w).normalize(),s[2].setComponents(c+a,p+h,f+g,R+E).normalize(),s[3].setComponents(c-a,p-h,f-g,R-E).normalize(),n)s[4].setComponents(l,d,m,M).normalize(),s[5].setComponents(c-l,p-d,f-m,R-M).normalize();else if(s[4].setComponents(c-l,p-d,f-m,R-M).normalize(),e===bn)s[5].setComponents(c+l,p+d,f+m,R+M).normalize();else if(e===na)s[5].setComponents(l,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(t){ui.center.set(0,0,0);const e=mg.distanceTo(t.center);return ui.radius=.7071067811865476+e,ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(xr.x=s.normal.x>0?t.max.x:t.min.x,xr.y=s.normal.y>0?t.max.y:t.min.y,xr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(xr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class _i extends si{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Gt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const sa=new C,ra=new C,jc=new Zt,Cs=new ua,yr=new kn,$a=new C,Kc=new C;class Is extends xe{constructor(t=new ee,e=new _i){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)sa.fromBufferAttribute(e,s-1),ra.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=sa.distanceTo(ra);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(s),yr.radius+=r,t.ray.intersectsSphere(yr)===!1)return;jc.copy(s).invert(),Cs.copy(t.ray).applyMatrix4(jc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const p=Math.max(0,o.start),_=Math.min(u.count,o.start+o.count);for(let g=p,m=_-1;g<m;g+=c){const f=u.getX(g),w=u.getX(g+1),E=Sr(this,t,Cs,l,f,w,g);E&&e.push(E)}if(this.isLineLoop){const g=u.getX(_-1),m=u.getX(p),f=Sr(this,t,Cs,l,g,m,_-1);f&&e.push(f)}}else{const p=Math.max(0,o.start),_=Math.min(d.count,o.start+o.count);for(let g=p,m=_-1;g<m;g+=c){const f=Sr(this,t,Cs,l,g,g+1,g);f&&e.push(f)}if(this.isLineLoop){const g=Sr(this,t,Cs,l,_-1,p,_-1);g&&e.push(g)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Sr(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(sa.fromBufferAttribute(a,s),ra.fromBufferAttribute(a,r),e.distanceSqToSegment(sa,ra,$a,Kc)>n)return;$a.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo($a);if(!(c<t.near||c>t.far))return{distance:c,point:Kc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const Zc=new C,Jc=new C;class qa extends Is{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Zc.fromBufferAttribute(e,s),Jc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Zc.distanceTo(Jc);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ns extends si{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Qc=new Zt,ul=new ua,br=new kn,Er=new C;class wr extends xe{constructor(t=new ee,e=new Ns){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),br.copy(n.boundingSphere),br.applyMatrix4(s),br.radius+=r,t.ray.intersectsSphere(br)===!1)return;Qc.copy(s).invert(),ul.copy(t.ray).applyMatrix4(Qc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let _=d,g=p;_<g;_++){const m=c.getX(_);Er.fromBufferAttribute(h,m),th(Er,m,l,s,t,e,this)}}else{const d=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=d,g=p;_<g;_++)Er.fromBufferAttribute(h,_),th(Er,_,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function th(i,t,e,n,s,r,o){const a=ul.distanceSqToPoint(i);if(a<e){const l=new C;ul.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Ul extends Ie{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Xu extends Ie{constructor(t,e,n=bi,s,r,o,a=tn,l=tn,c,u=Ws,h=1){if(u!==Ws&&u!==Xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Cl(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Dl extends ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new C,u=new bt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const p=n+h/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(a,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dl(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class aa extends ee{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],p=[];let _=0;const g=[],m=n/2;let f=0;w(),o===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new re(h,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(p,2));function w(){const M=new C,R=new C;let A=0;const P=(e-t)/n;for(let D=0;D<=r;D++){const x=[],b=D/r,y=b*(e-t)+t;for(let U=0;U<=s;U++){const N=U/s,B=N*l+a,W=Math.sin(B),V=Math.cos(B);R.x=y*W,R.y=-b*n+m,R.z=y*V,h.push(R.x,R.y,R.z),M.set(W,P,V).normalize(),d.push(M.x,M.y,M.z),p.push(N,1-b),x.push(_++)}g.push(x)}for(let D=0;D<s;D++)for(let x=0;x<r;x++){const b=g[x][D],y=g[x+1][D],U=g[x+1][D+1],N=g[x][D+1];(t>0||x!==0)&&(u.push(b,y,N),A+=3),(e>0||x!==r-1)&&(u.push(y,U,N),A+=3)}c.addGroup(f,A,0),f+=A}function E(M){const R=_,A=new bt,P=new C;let D=0;const x=M===!0?t:e,b=M===!0?1:-1;for(let U=1;U<=s;U++)h.push(0,m*b,0),d.push(0,b,0),p.push(.5,.5),_++;const y=_;for(let U=0;U<=s;U++){const B=U/s*l+a,W=Math.cos(B),V=Math.sin(B);P.x=x*V,P.y=m*b,P.z=x*W,h.push(P.x,P.y,P.z),d.push(0,b,0),A.x=W*.5+.5,A.y=V*.5*b+.5,p.push(A.x,A.y),_++}for(let U=0;U<s;U++){const N=R+U,B=y+U;M===!0?u.push(B,B+1,N):u.push(B+1,B,N),D+=3}c.addGroup(f,D,M===!0?1:2),f+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new aa(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ks extends ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,d=e/l,p=[],_=[],g=[],m=[];for(let f=0;f<u;f++){const w=f*d-o;for(let E=0;E<c;E++){const M=E*h-r;_.push(M,-w,0),g.push(0,0,1),m.push(E/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let w=0;w<a;w++){const E=w+c*f,M=w+c*(f+1),R=w+1+c*(f+1),A=w+1+c*f;p.push(E,M,A),p.push(M,R,A)}this.setIndex(p),this.setAttribute("position",new re(_,3)),this.setAttribute("normal",new re(g,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ks(t.width,t.height,t.widthSegments,t.heightSegments)}}class Il extends ee{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],u=[];let h=t;const d=(e-t)/s,p=new C,_=new bt;for(let g=0;g<=s;g++){for(let m=0;m<=n;m++){const f=r+m/n*o;p.x=h*Math.cos(f),p.y=h*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),_.x=(p.x/e+1)/2,_.y=(p.y/e+1)/2,u.push(_.x,_.y)}h+=d}for(let g=0;g<s;g++){const m=g*(n+1);for(let f=0;f<n;f++){const w=f+m,E=w,M=w+n+1,R=w+n+2,A=w+1;a.push(E,M,A),a.push(M,R,A)}}this.setIndex(a),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Il(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Nl extends ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new C,d=new C,p=[],_=[],g=[],m=[];for(let f=0;f<=n;f++){const w=[],E=f/n;let M=0;f===0&&o===0?M=.5/e:f===n&&l===Math.PI&&(M=-.5/e);for(let R=0;R<=e;R++){const A=R/e;h.x=-t*Math.cos(s+A*r)*Math.sin(o+E*a),h.y=t*Math.cos(o+E*a),h.z=t*Math.sin(s+A*r)*Math.sin(o+E*a),_.push(h.x,h.y,h.z),d.copy(h).normalize(),g.push(d.x,d.y,d.z),m.push(A+M,1-E),w.push(c++)}u.push(w)}for(let f=0;f<n;f++)for(let w=0;w<e;w++){const E=u[f][w+1],M=u[f][w],R=u[f+1][w],A=u[f+1][w+1];(f!==0||o>0)&&p.push(E,M,A),(f!==n-1||l<Math.PI)&&p.push(M,R,A)}this.setIndex(p),this.setAttribute("position",new re(_,3)),this.setAttribute("normal",new re(g,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Nl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class oa extends ee{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],u=new C,h=new C,d=new C;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const g=_/s*r,m=p/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(g),h.y=(t+e*Math.cos(m))*Math.sin(g),h.z=e*Math.sin(m),a.push(h.x,h.y,h.z),u.x=t*Math.cos(g),u.y=t*Math.sin(g),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(_/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const g=(s+1)*p+_-1,m=(s+1)*(p-1)+_-1,f=(s+1)*(p-1)+_,w=(s+1)*p+_;o.push(g,m,w),o.push(m,f,w)}this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new oa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class gg extends ee{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new C,r=new C;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){const h=l[c],d=h.start,p=h.count;for(let _=d,g=d+p;_<g;_+=3)for(let m=0;m<3;m++){const f=a.getX(_+m),w=a.getX(_+(m+1)%3);s.fromBufferAttribute(o,f),r.fromBufferAttribute(o,w),eh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const u=3*a+c,h=3*a+(c+1)%3;s.fromBufferAttribute(o,u),r.fromBufferAttribute(o,h),eh(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new re(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function eh(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class ja extends si{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pu,this.normalScale=new bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class _g extends si{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=um,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class vg extends si{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Mg extends _i{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class Fl extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class xg extends Fl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ka=new Zt,nh=new C,ih=new C;class Yu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new bt(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new Zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ll,this._frameExtents=new bt(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;nh.setFromMatrixPosition(t.matrixWorld),e.position.copy(nh),ih.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ih),e.updateMatrixWorld(),Ka.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ka,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ka)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const sh=new Zt,Ps=new C,Za=new C;class yg extends Yu{constructor(){super(new Je(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new bt(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ps.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ps),Za.copy(n.position),Za.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Za),n.updateMatrixWorld(),s.makeTranslation(-Ps.x,-Ps.y,-Ps.z),sh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sh,n.coordinateSystem,n.reversedDepth)}}class Ja extends Fl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new yg}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class $u extends Hu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Sg extends Yu{constructor(){super(new $u(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class bg extends Fl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new Sg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Eg extends ee{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class wg extends Je{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class dl extends Gu{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class rh{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Ut(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ut(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const ah=new C,Tr=new C,Yi=new C,$i=new C,Qa=new C,Tg=new C,Ag=new C;class Rg{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){ah.subVectors(t,this.start),Tr.subVectors(this.end,this.start);const n=Tr.dot(Tr);let r=Tr.dot(ah)/n;return e&&(r=Ut(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=Tg,n=Ag){const s=10000000000000001e-32;let r,o;const a=this.start,l=t.start,c=this.end,u=t.end;Yi.subVectors(c,a),$i.subVectors(u,l),Qa.subVectors(a,l);const h=Yi.dot(Yi),d=$i.dot($i),p=$i.dot(Qa);if(h<=s&&d<=s)return e.copy(a),n.copy(l),e.sub(n),e.dot(e);if(h<=s)r=0,o=p/d,o=Ut(o,0,1);else{const _=Yi.dot(Qa);if(d<=s)o=0,r=Ut(-_/h,0,1);else{const g=Yi.dot($i),m=h*d-g*g;m!==0?r=Ut((g*p-_*d)/m,0,1):r=0,o=(g*r+p)/d,o<0?(o=0,r=Ut(-_/h,0,1)):o>1&&(o=1,r=Ut((g-_)/h,0,1))}}return e.copy(a).add(Yi.multiplyScalar(r)),n.copy(l).add($i.multiplyScalar(o)),e.sub(n),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class Cg extends Ti{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function oh(i,t,e,n){const s=Pg(n);switch(e){case Tu:return i*t;case El:return i*t/s.components*s.byteLength;case wl:return i*t/s.components*s.byteLength;case Ru:return i*t*2/s.components*s.byteLength;case Tl:return i*t*2/s.components*s.byteLength;case Au:return i*t*3/s.components*s.byteLength;case fn:return i*t*4/s.components*s.byteLength;case Al:return i*t*4/s.components*s.byteLength;case zr:case Hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case kr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case zo:case ko:return Math.max(i,16)*Math.max(t,8)/4;case Bo:case Ho:return Math.max(i,8)*Math.max(t,8)/2;case Go:case Vo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Wo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case $o:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case qo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case jo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ko:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Qo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case tl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case el:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case nl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case il:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case sl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Vr:case rl:case al:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Cu:case ol:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ll:case cl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Pg(i){switch(i){case wn:case bu:return{byteLength:1,components:1};case Gs:case Eu:case qs:return{byteLength:2,components:1};case Sl:case bl:return{byteLength:2,components:4};case bi:case yl:case Sn:return{byteLength:4,components:1};case wu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xl);function qu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Lg(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((p,_)=>p.start-_.start);let d=0;for(let p=1;p<h.length;p++){const _=h[d],g=h[p];g.start<=_.start+_.count+1?_.count=Math.max(_.count,g.start+g.count-_.start):(++d,h[d]=g)}h.length=d+1;for(let p=0,_=h.length;p<_;p++){const g=h[p];i.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Ug=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Dg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ig=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ng=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Og=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,zg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Hg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,kg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Xg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Yg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,$g=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,t0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,e0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,n0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,i0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,s0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,r0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,a0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,l0="gl_FragColor = linearToOutputTexel( gl_FragColor );",c0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,h0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,u0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,d0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,p0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,m0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,g0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,v0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,M0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,x0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,y0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,S0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,b0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,E0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,w0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,T0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,A0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,R0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,C0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,P0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,L0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,U0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,D0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,I0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,N0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,F0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,O0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,B0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,z0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,H0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,k0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,G0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,V0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,W0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,X0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Y0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,q0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,j0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,K0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Q0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,t_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,e_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,n_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,i_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,s_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,r_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,a_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,o_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,l_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,c_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,h_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,u_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,d_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,f_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,p_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,m_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,g_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,__=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,v_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,M_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,x_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,y_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,S_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,E_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,w_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,T_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,A_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,C_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,P_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const L_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,U_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,D_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,I_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,F_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,O_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,B_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,z_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,H_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,k_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,G_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,V_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,W_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,X_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Y_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,q_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,K_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,J_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Q_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ev=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,av=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ov=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,cv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Bt={alphahash_fragment:Ug,alphahash_pars_fragment:Dg,alphamap_fragment:Ig,alphamap_pars_fragment:Ng,alphatest_fragment:Fg,alphatest_pars_fragment:Og,aomap_fragment:Bg,aomap_pars_fragment:zg,batching_pars_vertex:Hg,batching_vertex:kg,begin_vertex:Gg,beginnormal_vertex:Vg,bsdfs:Wg,iridescence_fragment:Xg,bumpmap_pars_fragment:Yg,clipping_planes_fragment:$g,clipping_planes_pars_fragment:qg,clipping_planes_pars_vertex:jg,clipping_planes_vertex:Kg,color_fragment:Zg,color_pars_fragment:Jg,color_pars_vertex:Qg,color_vertex:t0,common:e0,cube_uv_reflection_fragment:n0,defaultnormal_vertex:i0,displacementmap_pars_vertex:s0,displacementmap_vertex:r0,emissivemap_fragment:a0,emissivemap_pars_fragment:o0,colorspace_fragment:l0,colorspace_pars_fragment:c0,envmap_fragment:h0,envmap_common_pars_fragment:u0,envmap_pars_fragment:d0,envmap_pars_vertex:f0,envmap_physical_pars_fragment:E0,envmap_vertex:p0,fog_vertex:m0,fog_pars_vertex:g0,fog_fragment:_0,fog_pars_fragment:v0,gradientmap_pars_fragment:M0,lightmap_pars_fragment:x0,lights_lambert_fragment:y0,lights_lambert_pars_fragment:S0,lights_pars_begin:b0,lights_toon_fragment:w0,lights_toon_pars_fragment:T0,lights_phong_fragment:A0,lights_phong_pars_fragment:R0,lights_physical_fragment:C0,lights_physical_pars_fragment:P0,lights_fragment_begin:L0,lights_fragment_maps:U0,lights_fragment_end:D0,logdepthbuf_fragment:I0,logdepthbuf_pars_fragment:N0,logdepthbuf_pars_vertex:F0,logdepthbuf_vertex:O0,map_fragment:B0,map_pars_fragment:z0,map_particle_fragment:H0,map_particle_pars_fragment:k0,metalnessmap_fragment:G0,metalnessmap_pars_fragment:V0,morphinstance_vertex:W0,morphcolor_vertex:X0,morphnormal_vertex:Y0,morphtarget_pars_vertex:$0,morphtarget_vertex:q0,normal_fragment_begin:j0,normal_fragment_maps:K0,normal_pars_fragment:Z0,normal_pars_vertex:J0,normal_vertex:Q0,normalmap_pars_fragment:t_,clearcoat_normal_fragment_begin:e_,clearcoat_normal_fragment_maps:n_,clearcoat_pars_fragment:i_,iridescence_pars_fragment:s_,opaque_fragment:r_,packing:a_,premultiplied_alpha_fragment:o_,project_vertex:l_,dithering_fragment:c_,dithering_pars_fragment:h_,roughnessmap_fragment:u_,roughnessmap_pars_fragment:d_,shadowmap_pars_fragment:f_,shadowmap_pars_vertex:p_,shadowmap_vertex:m_,shadowmask_pars_fragment:g_,skinbase_vertex:__,skinning_pars_vertex:v_,skinning_vertex:M_,skinnormal_vertex:x_,specularmap_fragment:y_,specularmap_pars_fragment:S_,tonemapping_fragment:b_,tonemapping_pars_fragment:E_,transmission_fragment:w_,transmission_pars_fragment:T_,uv_pars_fragment:A_,uv_pars_vertex:R_,uv_vertex:C_,worldpos_vertex:P_,background_vert:L_,background_frag:U_,backgroundCube_vert:D_,backgroundCube_frag:I_,cube_vert:N_,cube_frag:F_,depth_vert:O_,depth_frag:B_,distanceRGBA_vert:z_,distanceRGBA_frag:H_,equirect_vert:k_,equirect_frag:G_,linedashed_vert:V_,linedashed_frag:W_,meshbasic_vert:X_,meshbasic_frag:Y_,meshlambert_vert:$_,meshlambert_frag:q_,meshmatcap_vert:j_,meshmatcap_frag:K_,meshnormal_vert:Z_,meshnormal_frag:J_,meshphong_vert:Q_,meshphong_frag:tv,meshphysical_vert:ev,meshphysical_frag:nv,meshtoon_vert:iv,meshtoon_frag:sv,points_vert:rv,points_frag:av,shadow_vert:ov,shadow_frag:lv,sprite_vert:cv,sprite_frag:hv},at={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Ye={basic:{uniforms:Ge([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:Ge([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:Ge([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:Ge([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:Ge([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:Ge([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:Ge([at.points,at.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:Ge([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:Ge([at.common,at.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:Ge([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:Ge([at.sprite,at.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distanceRGBA:{uniforms:Ge([at.common,at.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distanceRGBA_vert,fragmentShader:Bt.distanceRGBA_frag},shadow:{uniforms:Ge([at.lights,at.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};Ye.physical={uniforms:Ge([Ye.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const Ar={r:0,b:0,g:0},di=new Tn,uv=new Zt;function dv(i,t,e,n,s,r,o){const a=new Gt(0);let l=r===!0?0:1,c,u,h=null,d=0,p=null;function _(E){let M=E.isScene===!0?E.background:null;return M&&M.isTexture&&(M=(E.backgroundBlurriness>0?e:t).get(M)),M}function g(E){let M=!1;const R=_(E);R===null?f(a,l):R&&R.isColor&&(f(R,1),M=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,M){const R=_(M);R&&(R.isCubeTexture||R.mapping===ha)?(u===void 0&&(u=new Se(new js(1,1,1),new Hn({name:"BackgroundCubeMaterial",uniforms:fs(Ye.backgroundCube.uniforms),vertexShader:Ye.backgroundCube.vertexShader,fragmentShader:Ye.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),di.copy(M.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),u.material.uniforms.envMap.value=R,u.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(uv.makeRotationFromEuler(di)),u.material.toneMapped=$t.getTransfer(R.colorSpace)!==te,(h!==R||d!==R.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=R,d=R.version,p=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new Se(new Ks(2,2),new Hn({name:"BackgroundMaterial",uniforms:fs(Ye.background.uniforms),vertexShader:Ye.background.vertexShader,fragmentShader:Ye.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=$t.getTransfer(R.colorSpace)!==te,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(h!==R||d!==R.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=R,d=R.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,M){E.getRGB(Ar,zu(i)),n.buffers.color.setClear(Ar.r,Ar.g,Ar.b,M,o)}function w(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,M=1){a.set(E),l=M,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(a,l)},render:g,addToRenderList:m,dispose:w}}function fv(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(b,y,U,N,B){let W=!1;const V=h(N,U,y);r!==V&&(r=V,c(r.object)),W=p(b,N,U,B),W&&_(b,N,U,B),B!==null&&t.update(B,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,M(b,y,U,N),B!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function u(b){return i.deleteVertexArray(b)}function h(b,y,U){const N=U.wireframe===!0;let B=n[b.id];B===void 0&&(B={},n[b.id]=B);let W=B[y.id];W===void 0&&(W={},B[y.id]=W);let V=W[N];return V===void 0&&(V=d(l()),W[N]=V),V}function d(b){const y=[],U=[],N=[];for(let B=0;B<e;B++)y[B]=0,U[B]=0,N[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:y,enabledAttributes:U,attributeDivisors:N,object:b,attributes:{},index:null}}function p(b,y,U,N){const B=r.attributes,W=y.attributes;let V=0;const Z=U.getAttributes();for(const H in Z)if(Z[H].location>=0){const ct=B[H];let _t=W[H];if(_t===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(_t=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(_t=b.instanceColor)),ct===void 0||ct.attribute!==_t||_t&&ct.data!==_t.data)return!0;V++}return r.attributesNum!==V||r.index!==N}function _(b,y,U,N){const B={},W=y.attributes;let V=0;const Z=U.getAttributes();for(const H in Z)if(Z[H].location>=0){let ct=W[H];ct===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(ct=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(ct=b.instanceColor));const _t={};_t.attribute=ct,ct&&ct.data&&(_t.data=ct.data),B[H]=_t,V++}r.attributes=B,r.attributesNum=V,r.index=N}function g(){const b=r.newAttributes;for(let y=0,U=b.length;y<U;y++)b[y]=0}function m(b){f(b,0)}function f(b,y){const U=r.newAttributes,N=r.enabledAttributes,B=r.attributeDivisors;U[b]=1,N[b]===0&&(i.enableVertexAttribArray(b),N[b]=1),B[b]!==y&&(i.vertexAttribDivisor(b,y),B[b]=y)}function w(){const b=r.newAttributes,y=r.enabledAttributes;for(let U=0,N=y.length;U<N;U++)y[U]!==b[U]&&(i.disableVertexAttribArray(U),y[U]=0)}function E(b,y,U,N,B,W,V){V===!0?i.vertexAttribIPointer(b,y,U,B,W):i.vertexAttribPointer(b,y,U,N,B,W)}function M(b,y,U,N){g();const B=N.attributes,W=U.getAttributes(),V=y.defaultAttributeValues;for(const Z in W){const H=W[Z];if(H.location>=0){let nt=B[Z];if(nt===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(nt=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(nt=b.instanceColor)),nt!==void 0){const ct=nt.normalized,_t=nt.itemSize,Nt=t.get(nt);if(Nt===void 0)continue;const ie=Nt.buffer,qt=Nt.type,Y=Nt.bytesPerElement,ot=qt===i.INT||qt===i.UNSIGNED_INT||nt.gpuType===yl;if(nt.isInterleavedBufferAttribute){const it=nt.data,Et=it.stride,wt=nt.offset;if(it.isInstancedInterleavedBuffer){for(let Dt=0;Dt<H.locationSize;Dt++)f(H.location+Dt,it.meshPerAttribute);b.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Dt=0;Dt<H.locationSize;Dt++)m(H.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Dt=0;Dt<H.locationSize;Dt++)E(H.location+Dt,_t/H.locationSize,qt,ct,Et*Y,(wt+_t/H.locationSize*Dt)*Y,ot)}else{if(nt.isInstancedBufferAttribute){for(let it=0;it<H.locationSize;it++)f(H.location+it,nt.meshPerAttribute);b.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let it=0;it<H.locationSize;it++)m(H.location+it);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let it=0;it<H.locationSize;it++)E(H.location+it,_t/H.locationSize,qt,ct,_t*Y,_t/H.locationSize*it*Y,ot)}}else if(V!==void 0){const ct=V[Z];if(ct!==void 0)switch(ct.length){case 2:i.vertexAttrib2fv(H.location,ct);break;case 3:i.vertexAttrib3fv(H.location,ct);break;case 4:i.vertexAttrib4fv(H.location,ct);break;default:i.vertexAttrib1fv(H.location,ct)}}}}w()}function R(){D();for(const b in n){const y=n[b];for(const U in y){const N=y[U];for(const B in N)u(N[B].object),delete N[B];delete y[U]}delete n[b]}}function A(b){if(n[b.id]===void 0)return;const y=n[b.id];for(const U in y){const N=y[U];for(const B in N)u(N[B].object),delete N[B];delete y[U]}delete n[b.id]}function P(b){for(const y in n){const U=n[y];if(U[b.id]===void 0)continue;const N=U[b.id];for(const B in N)u(N[B].object),delete N[B];delete U[b.id]}}function D(){x(),o=!0,r!==s&&(r=s,c(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:D,resetDefaultState:x,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:g,enableAttribute:m,disableUnusedAttributes:w}}function pv(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function a(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let _=0;_<h;_++)p+=u[_];e.update(p,n,1)}function l(c,u,h,d){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],u[_],d[_]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let _=0;for(let g=0;g<h;g++)_+=u[g]*d[g];e.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function mv(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==fn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){const D=P===qs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==wn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Sn&&!D)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=_>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:_,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:M,vertexTextures:R,maxSamples:A}}function gv(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Kn,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||n!==0||s;return s=d,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){const _=h.clippingPlanes,g=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||_===null||_.length===0||r&&!m)r?u(null):c();else{const w=r?0:n,E=w*4;let M=f.clippingState||null;l.value=M,M=u(_,d,E,p);for(let R=0;R!==E;++R)M[R]=e[R];f.clippingState=M,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,p,_){const g=h!==null?h.length:0;let m=null;if(g!==0){if(m=l.value,_!==!0||m===null){const f=p+g*4,w=d.matrixWorldInverse;a.getNormalMatrix(w),(m===null||m.length<f)&&(m=new Float32Array(f));for(let E=0,M=p;E!==g;++E,M+=4)o.copy(h[E]).applyMatrix4(w,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function _v(i){let t=new WeakMap;function e(o,a){return a===Io?o.mapping=hs:a===No&&(o.mapping=us),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Io||a===No)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new ag(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const ns=4,lh=[.125,.215,.35,.446,.526,.582],vi=20,to=new $u,ch=new Gt;let eo=null,no=0,io=0,so=!1;const pi=(1+Math.sqrt(5))/2,qi=1/pi,hh=[new C(-pi,qi,0),new C(pi,qi,0),new C(-qi,0,pi),new C(qi,0,pi),new C(0,pi,-qi),new C(0,pi,qi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],vv=new C;class uh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=vv}=r;eo=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ph(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(eo,no,io),this._renderer.xr.enabled=so,t.scissorTest=!1,Rr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===hs||t.mapping===us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),eo=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),io=this._renderer.getActiveMipmapLevel(),so=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:qs,format:fn,colorSpace:ds,depthBuffer:!1},s=dh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Mv(r)),this._blurMaterial=xv(r,t,e)}return s}_compileMaterial(t){const e=new Se(this._lodPlanes[0],t);this._renderer.compile(e,to)}_sceneToCubeUV(t,e,n,s,r){const l=new Je(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(ch),h.toneMapping=ei,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const g=new gi({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),m=new Se(new js,g);let f=!1;const w=t.background;w?w.isColor&&(g.color.copy(w),t.background=null,f=!0):(g.color.copy(ch),f=!0);for(let E=0;E<6;E++){const M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));const R=this._cubeSize;Rr(s,M*R,E>2?R:0,R,R),h.setRenderTarget(s),f&&h.render(m,l),h.render(t,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=d,t.background=w}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===hs||t.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ph()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Se(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Rr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,to)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=hh[(s-r-1)%hh.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Se(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*vi-1),g=r/_,m=isFinite(r)?1+Math.floor(u*g):vi;m>vi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vi}`);const f=[];let w=0;for(let P=0;P<vi;++P){const D=P/g,x=Math.exp(-D*D/2);f.push(x),P===0?w+=x:P<m&&(w+=2*x)}for(let P=0;P<f.length;P++)f[P]=f[P]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:E}=this;d.dTheta.value=_,d.mipInt.value=E-n;const M=this._sizeLods[s],R=3*M*(s>E-ns?s-E+ns:0),A=4*(this._cubeSize-M);Rr(e,R,A,3*M,2*M),l.setRenderTarget(e),l.render(h,to)}}function Mv(i){const t=[],e=[],n=[];let s=i;const r=i-ns+1+lh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-ns?l=lh[o-i+ns-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,_=6,g=3,m=2,f=1,w=new Float32Array(g*_*p),E=new Float32Array(m*_*p),M=new Float32Array(f*_*p);for(let A=0;A<p;A++){const P=A%3*2/3-1,D=A>2?0:-1,x=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];w.set(x,g*_*A),E.set(d,m*_*A);const b=[A,A,A,A,A,A];M.set(b,f*_*A)}const R=new ee;R.setAttribute("position",new De(w,g)),R.setAttribute("uv",new De(E,m)),R.setAttribute("faceIndex",new De(M,f)),t.push(R),s>ns&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function dh(i,t,e){const n=new wi(i,t,e);return n.texture.mapping=ha,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Rr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function xv(i,t,e){const n=new Float32Array(vi),s=new C(0,1,0);return new Hn({name:"SphericalGaussianBlur",defines:{n:vi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function fh(){return new Hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function ph(){return new Hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function Ol(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Io||l===No,u=l===hs||l===us;if(c||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new uh(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new uh(i)),h=c?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Sv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&rs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function bv(i,t,e,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);d.removeEventListener("dispose",o),delete s[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const p in d)t.update(d[p],i.ARRAY_BUFFER)}function c(h){const d=[],p=h.index,_=h.attributes.position;let g=0;if(p!==null){const w=p.array;g=p.version;for(let E=0,M=w.length;E<M;E+=3){const R=w[E+0],A=w[E+1],P=w[E+2];d.push(R,A,A,P,P,R)}}else if(_!==void 0){const w=_.array;g=_.version;for(let E=0,M=w.length/3-1;E<M;E+=3){const R=E+0,A=E+1,P=E+2;d.push(R,A,A,P,P,R)}}else return;const m=new(Du(d)?Bu:Ou)(d,1);m.version=g;const f=r.get(h);f&&t.remove(f),r.set(h,m)}function u(h){const d=r.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Ev(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),e.update(p,n,1)}function c(d,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,d*o,_),e.update(p,n,_))}function u(d,p,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,_);let m=0;for(let f=0;f<_;f++)m+=p[f];e.update(m,n,1)}function h(d,p,_,g){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,g,0,_);let f=0;for(let w=0;w<_;w++)f+=p[w]*g[w];e.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function wv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Tv(i,t,e){const n=new WeakMap,s=new Wt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let x=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let E=0;p===!0&&(E=1),_===!0&&(E=2),g===!0&&(E=3);let M=a.attributes.position.count*E,R=1;M>t.maxTextureSize&&(R=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const A=new Float32Array(M*R*4*h),P=new Iu(A,M,R,h);P.type=Sn,P.needsUpdate=!0;const D=E*4;for(let b=0;b<h;b++){const y=m[b],U=f[b],N=w[b],B=M*R*4*b;for(let W=0;W<y.count;W++){const V=W*D;p===!0&&(s.fromBufferAttribute(y,W),A[B+V+0]=s.x,A[B+V+1]=s.y,A[B+V+2]=s.z,A[B+V+3]=0),_===!0&&(s.fromBufferAttribute(U,W),A[B+V+4]=s.x,A[B+V+5]=s.y,A[B+V+6]=s.z,A[B+V+7]=0),g===!0&&(s.fromBufferAttribute(N,W),A[B+V+8]=s.x,A[B+V+9]=s.y,A[B+V+10]=s.z,A[B+V+11]=N.itemSize===4?s.w:1)}}d={count:h,texture:P,size:new bt(M,R)},n.set(a,d),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Av(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}const ju=new Ie,mh=new Xu(1,1),Ku=new Iu,Zu=new Wm,Ju=new ku,gh=[],_h=[],vh=new Float32Array(16),Mh=new Float32Array(9),xh=new Float32Array(4);function ps(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=gh[s];if(r===void 0&&(r=new Float32Array(s),gh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function da(i,t){let e=_h[t];e===void 0&&(e=new Int32Array(t),_h[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Rv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Cv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function Pv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function Lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function Uv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;xh.set(n),i.uniformMatrix2fv(this.addr,!1,xh),Ee(e,n)}}function Dv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Mh.set(n),i.uniformMatrix3fv(this.addr,!1,Mh),Ee(e,n)}}function Iv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;vh.set(n),i.uniformMatrix4fv(this.addr,!1,vh),Ee(e,n)}}function Nv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Fv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function Ov(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function Bv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function zv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Hv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function kv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function Gv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function Vv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(mh.compareFunction=Lu,r=mh):r=ju,e.setTexture2D(t||r,s)}function Wv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Zu,s)}function Xv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ju,s)}function Yv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ku,s)}function $v(i){switch(i){case 5126:return Rv;case 35664:return Cv;case 35665:return Pv;case 35666:return Lv;case 35674:return Uv;case 35675:return Dv;case 35676:return Iv;case 5124:case 35670:return Nv;case 35667:case 35671:return Fv;case 35668:case 35672:return Ov;case 35669:case 35673:return Bv;case 5125:return zv;case 36294:return Hv;case 36295:return kv;case 36296:return Gv;case 35678:case 36198:case 36298:case 36306:case 35682:return Vv;case 35679:case 36299:case 36307:return Wv;case 35680:case 36300:case 36308:case 36293:return Xv;case 36289:case 36303:case 36311:case 36292:return Yv}}function qv(i,t){i.uniform1fv(this.addr,t)}function jv(i,t){const e=ps(t,this.size,2);i.uniform2fv(this.addr,e)}function Kv(i,t){const e=ps(t,this.size,3);i.uniform3fv(this.addr,e)}function Zv(i,t){const e=ps(t,this.size,4);i.uniform4fv(this.addr,e)}function Jv(i,t){const e=ps(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Qv(i,t){const e=ps(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function tM(i,t){const e=ps(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function eM(i,t){i.uniform1iv(this.addr,t)}function nM(i,t){i.uniform2iv(this.addr,t)}function iM(i,t){i.uniform3iv(this.addr,t)}function sM(i,t){i.uniform4iv(this.addr,t)}function rM(i,t){i.uniform1uiv(this.addr,t)}function aM(i,t){i.uniform2uiv(this.addr,t)}function oM(i,t){i.uniform3uiv(this.addr,t)}function lM(i,t){i.uniform4uiv(this.addr,t)}function cM(i,t,e){const n=this.cache,s=t.length,r=da(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ju,r[o])}function hM(i,t,e){const n=this.cache,s=t.length,r=da(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Zu,r[o])}function uM(i,t,e){const n=this.cache,s=t.length,r=da(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Ju,r[o])}function dM(i,t,e){const n=this.cache,s=t.length,r=da(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ku,r[o])}function fM(i){switch(i){case 5126:return qv;case 35664:return jv;case 35665:return Kv;case 35666:return Zv;case 35674:return Jv;case 35675:return Qv;case 35676:return tM;case 5124:case 35670:return eM;case 35667:case 35671:return nM;case 35668:case 35672:return iM;case 35669:case 35673:return sM;case 5125:return rM;case 36294:return aM;case 36295:return oM;case 36296:return lM;case 35678:case 36198:case 36298:case 36306:case 35682:return cM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return uM;case 36289:case 36303:case 36311:case 36292:return dM}}class pM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=$v(e.type)}}class mM{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=fM(e.type)}}class gM{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const ro=/(\w+)(\])?(\[|\.)?/g;function yh(i,t){i.seq.push(t),i.map[t.id]=t}function _M(i,t,e){const n=i.name,s=n.length;for(ro.lastIndex=0;;){const r=ro.exec(n),o=ro.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){yh(e,c===void 0?new pM(a,i,t):new mM(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new gM(a),yh(e,h)),e=h}}}class Wr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);_M(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Sh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const vM=37297;let MM=0;function xM(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const bh=new Ot;function yM(i){$t._getMatrix(bh,$t.workingColorSpace,i);const t=`mat3( ${bh.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(i)){case ea:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Eh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+xM(i.getShaderSource(t),a)}else return r}function SM(i,t){const e=yM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function bM(i,t){let e;switch(t){case sm:e="Linear";break;case rm:e="Reinhard";break;case am:e="Cineon";break;case yu:e="ACESFilmic";break;case lm:e="AgX";break;case cm:e="Neutral";break;case om:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Cr=new C;function EM(){$t.getLuminanceCoefficients(Cr);const i=Cr.x.toFixed(4),t=Cr.y.toFixed(4),e=Cr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function wM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fs).join(`
`)}function TM(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function AM(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Fs(i){return i!==""}function wh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Th(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const RM=/^[ \t]*#include +<([\w\d./]+)>/gm;function fl(i){return i.replace(RM,PM)}const CM=new Map;function PM(i,t){let e=Bt[t];if(e===void 0){const n=CM.get(t);if(n!==void 0)e=Bt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return fl(e)}const LM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ah(i){return i.replace(LM,UM)}function UM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Rh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function DM(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Mu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Op?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Nn&&(t="SHADOWMAP_TYPE_VSM"),t}function IM(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case hs:case us:t="ENVMAP_TYPE_CUBE";break;case ha:t="ENVMAP_TYPE_CUBE_UV";break}return t}function NM(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===us&&(t="ENVMAP_MODE_REFRACTION"),t}function FM(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case xu:t="ENVMAP_BLENDING_MULTIPLY";break;case nm:t="ENVMAP_BLENDING_MIX";break;case im:t="ENVMAP_BLENDING_ADD";break}return t}function OM(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function BM(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=DM(e),c=IM(e),u=NM(e),h=FM(e),d=OM(e),p=wM(e),_=TM(r),g=s.createProgram();let m,f,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Fs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Fs).join(`
`),f.length>0&&(f+=`
`)):(m=[Rh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fs).join(`
`),f=[Rh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?Bt.tonemapping_pars_fragment:"",e.toneMapping!==ei?bM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,SM("linearToOutputTexel",e.outputColorSpace),EM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fs).join(`
`)),o=fl(o),o=wh(o,e),o=Th(o,e),a=fl(a),a=wh(a,e),a=Th(a,e),o=Ah(o),a=Ah(a),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===wc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=w+m+o,M=w+f+a,R=Sh(s,s.VERTEX_SHADER,E),A=Sh(s,s.FRAGMENT_SHADER,M);s.attachShader(g,R),s.attachShader(g,A),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function P(y){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(g)||"",N=s.getShaderInfoLog(R)||"",B=s.getShaderInfoLog(A)||"",W=U.trim(),V=N.trim(),Z=B.trim();let H=!0,nt=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,R,A);else{const ct=Eh(s,R,"vertex"),_t=Eh(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+y.name+`
Material Type: `+y.type+`

Program Info Log: `+W+`
`+ct+`
`+_t)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(V===""||Z==="")&&(nt=!1);nt&&(y.diagnostics={runnable:H,programLog:W,vertexShader:{log:V,prefix:m},fragmentShader:{log:Z,prefix:f}})}s.deleteShader(R),s.deleteShader(A),D=new Wr(s,g),x=AM(s,g)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let x;this.getAttributes=function(){return x===void 0&&P(this),x};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(g,vM)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=MM++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=A,this}let zM=0;class HM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new kM(t),e.set(t,n)),n}}class kM{constructor(t){this.id=zM++,this.code=t,this.usedTimes=0}}function GM(i,t,e,n,s,r,o){const a=new Nu,l=new HM,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,b,y,U,N){const B=U.fog,W=N.geometry,V=x.isMeshStandardMaterial?U.environment:null,Z=(x.isMeshStandardMaterial?e:t).get(x.envMap||V),H=Z&&Z.mapping===ha?Z.image.height:null,nt=_[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const ct=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,_t=ct!==void 0?ct.length:0;let Nt=0;W.morphAttributes.position!==void 0&&(Nt=1),W.morphAttributes.normal!==void 0&&(Nt=2),W.morphAttributes.color!==void 0&&(Nt=3);let ie,qt,Y,ot;if(nt){const Kt=Ye[nt];ie=Kt.vertexShader,qt=Kt.fragmentShader}else ie=x.vertexShader,qt=x.fragmentShader,l.update(x),Y=l.getVertexShaderID(x),ot=l.getFragmentShaderID(x);const it=i.getRenderTarget(),Et=i.state.buffers.depth.getReversed(),wt=N.isInstancedMesh===!0,Dt=N.isBatchedMesh===!0,_e=!!x.map,Vt=!!x.matcap,L=!!Z,ae=!!x.aoMap,At=!!x.lightMap,jt=!!x.bumpMap,St=!!x.normalMap,de=!!x.displacementMap,pt=!!x.emissiveMap,zt=!!x.metalnessMap,we=!!x.roughnessMap,ve=x.anisotropy>0,T=x.clearcoat>0,v=x.dispersion>0,z=x.iridescence>0,$=x.sheen>0,K=x.transmission>0,X=ve&&!!x.anisotropyMap,yt=T&&!!x.clearcoatMap,st=T&&!!x.clearcoatNormalMap,vt=T&&!!x.clearcoatRoughnessMap,Mt=z&&!!x.iridescenceMap,tt=z&&!!x.iridescenceThicknessMap,ut=$&&!!x.sheenColorMap,Pt=$&&!!x.sheenRoughnessMap,xt=!!x.specularMap,lt=!!x.specularColorMap,Ft=!!x.specularIntensityMap,I=K&&!!x.transmissionMap,et=K&&!!x.thicknessMap,rt=!!x.gradientMap,ft=!!x.alphaMap,J=x.alphaTest>0,q=!!x.alphaHash,gt=!!x.extensions;let It=ei;x.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(It=i.toneMapping);const oe={shaderID:nt,shaderType:x.type,shaderName:x.name,vertexShader:ie,fragmentShader:qt,defines:x.defines,customVertexShaderID:Y,customFragmentShaderID:ot,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Dt,batchingColor:Dt&&N._colorsTexture!==null,instancing:wt,instancingColor:wt&&N.instanceColor!==null,instancingMorph:wt&&N.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:it===null?i.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:ds,alphaToCoverage:!!x.alphaToCoverage,map:_e,matcap:Vt,envMap:L,envMapMode:L&&Z.mapping,envMapCubeUVHeight:H,aoMap:ae,lightMap:At,bumpMap:jt,normalMap:St,displacementMap:d&&de,emissiveMap:pt,normalMapObjectSpace:St&&x.normalMapType===fm,normalMapTangentSpace:St&&x.normalMapType===Pu,metalnessMap:zt,roughnessMap:we,anisotropy:ve,anisotropyMap:X,clearcoat:T,clearcoatMap:yt,clearcoatNormalMap:st,clearcoatRoughnessMap:vt,dispersion:v,iridescence:z,iridescenceMap:Mt,iridescenceThicknessMap:tt,sheen:$,sheenColorMap:ut,sheenRoughnessMap:Pt,specularMap:xt,specularColorMap:lt,specularIntensityMap:Ft,transmission:K,transmissionMap:I,thicknessMap:et,gradientMap:rt,opaque:x.transparent===!1&&x.blending===ss&&x.alphaToCoverage===!1,alphaMap:ft,alphaTest:J,alphaHash:q,combine:x.combine,mapUv:_e&&g(x.map.channel),aoMapUv:ae&&g(x.aoMap.channel),lightMapUv:At&&g(x.lightMap.channel),bumpMapUv:jt&&g(x.bumpMap.channel),normalMapUv:St&&g(x.normalMap.channel),displacementMapUv:de&&g(x.displacementMap.channel),emissiveMapUv:pt&&g(x.emissiveMap.channel),metalnessMapUv:zt&&g(x.metalnessMap.channel),roughnessMapUv:we&&g(x.roughnessMap.channel),anisotropyMapUv:X&&g(x.anisotropyMap.channel),clearcoatMapUv:yt&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:st&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:tt&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&g(x.sheenRoughnessMap.channel),specularMapUv:xt&&g(x.specularMap.channel),specularColorMapUv:lt&&g(x.specularColorMap.channel),specularIntensityMapUv:Ft&&g(x.specularIntensityMap.channel),transmissionMapUv:I&&g(x.transmissionMap.channel),thicknessMapUv:et&&g(x.thicknessMap.channel),alphaMapUv:ft&&g(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(St||ve),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!W.attributes.uv&&(_e||ft),fog:!!B,useFog:x.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Et,skinning:N.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:_t,morphTextureStride:Nt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&y.length>0,shadowMapType:i.shadowMap.type,toneMapping:It,decodeVideoTexture:_e&&x.map.isVideoTexture===!0&&$t.getTransfer(x.map.colorSpace)===te,decodeVideoTextureEmissive:pt&&x.emissiveMap.isVideoTexture===!0&&$t.getTransfer(x.emissiveMap.colorSpace)===te,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===un,flipSided:x.side===$e,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:gt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&x.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function f(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const y in x.defines)b.push(y),b.push(x.defines[y]);return x.isRawShaderMaterial===!1&&(w(b,x),E(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function w(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function E(x,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),x.push(a.mask)}function M(x){const b=_[x.type];let y;if(b){const U=Ye[b];y=Pl.clone(U.uniforms)}else y=x.uniforms;return y}function R(x,b){let y;for(let U=0,N=u.length;U<N;U++){const B=u[U];if(B.cacheKey===b){y=B,++y.usedTimes;break}}return y===void 0&&(y=new BM(i,b,x,r),u.push(y)),y}function A(x){if(--x.usedTimes===0){const b=u.indexOf(x);u[b]=u[u.length-1],u.pop(),x.destroy()}}function P(x){l.remove(x)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:R,releaseProgram:A,releaseShaderCache:P,programs:u,dispose:D}}function VM(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function WM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ch(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ph(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,p,_,g,m){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:_,renderOrder:h.renderOrder,z:g,group:m},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=_,f.renderOrder=h.renderOrder,f.z=g,f.group=m),t++,f}function a(h,d,p,_,g,m){const f=o(h,d,p,_,g,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(h,d,p,_,g,m){const f=o(h,d,p,_,g,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(h,d){e.length>1&&e.sort(h||WM),n.length>1&&n.sort(d||Ch),s.length>1&&s.sort(d||Ch)}function u(){for(let h=t,d=i.length;h<d;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function XM(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Ph,i.set(n,[o])):s>=r.length?(o=new Ph,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function YM(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Gt};break;case"SpotLight":e={position:new C,direction:new C,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function $M(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let qM=0;function jM(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function KM(i){const t=new YM,e=$M(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const s=new C,r=new Zt,o=new Zt;function a(c){let u=0,h=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let p=0,_=0,g=0,m=0,f=0,w=0,E=0,M=0,R=0,A=0,P=0;c.sort(jM);for(let x=0,b=c.length;x<b;x++){const y=c[x],U=y.color,N=y.intensity,B=y.distance,W=y.shadow&&y.shadow.map?y.shadow.map.texture:null;if(y.isAmbientLight)u+=U.r*N,h+=U.g*N,d+=U.b*N;else if(y.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(y.sh.coefficients[V],N);P++}else if(y.isDirectionalLight){const V=t.get(y);if(V.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){const Z=y.shadow,H=e.get(y);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.directionalShadow[p]=H,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=y.shadow.matrix,w++}n.directional[p]=V,p++}else if(y.isSpotLight){const V=t.get(y);V.position.setFromMatrixPosition(y.matrixWorld),V.color.copy(U).multiplyScalar(N),V.distance=B,V.coneCos=Math.cos(y.angle),V.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),V.decay=y.decay,n.spot[g]=V;const Z=y.shadow;if(y.map&&(n.spotLightMap[R]=y.map,R++,Z.updateMatrices(y),y.castShadow&&A++),n.spotLightMatrix[g]=Z.matrix,y.castShadow){const H=e.get(y);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.spotShadow[g]=H,n.spotShadowMap[g]=W,M++}g++}else if(y.isRectAreaLight){const V=t.get(y);V.color.copy(U).multiplyScalar(N),V.halfWidth.set(y.width*.5,0,0),V.halfHeight.set(0,y.height*.5,0),n.rectArea[m]=V,m++}else if(y.isPointLight){const V=t.get(y);if(V.color.copy(y.color).multiplyScalar(y.intensity),V.distance=y.distance,V.decay=y.decay,y.castShadow){const Z=y.shadow,H=e.get(y);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,n.pointShadow[_]=H,n.pointShadowMap[_]=W,n.pointShadowMatrix[_]=y.shadow.matrix,E++}n.point[_]=V,_++}else if(y.isHemisphereLight){const V=t.get(y);V.skyColor.copy(y.color).multiplyScalar(N),V.groundColor.copy(y.groundColor).multiplyScalar(N),n.hemi[f]=V,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const D=n.hash;(D.directionalLength!==p||D.pointLength!==_||D.spotLength!==g||D.rectAreaLength!==m||D.hemiLength!==f||D.numDirectionalShadows!==w||D.numPointShadows!==E||D.numSpotShadows!==M||D.numSpotMaps!==R||D.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=g,n.rectArea.length=m,n.point.length=_,n.hemi.length=f,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,D.directionalLength=p,D.pointLength=_,D.spotLength=g,D.rectAreaLength=m,D.hemiLength=f,D.numDirectionalShadows=w,D.numPointShadows=E,D.numSpotShadows=M,D.numSpotMaps=R,D.numLightProbes=P,n.version=qM++)}function l(c,u){let h=0,d=0,p=0,_=0,g=0;const m=u.matrixWorldInverse;for(let f=0,w=c.length;f<w;f++){const E=c[f];if(E.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),h++}else if(E.isSpotLight){const M=n.spot[p];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const M=n.rectArea[_];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),_++}else if(E.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const M=n.hemi[g];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Lh(i){const t=new KM(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function ZM(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Lh(i),t.set(s,[a])):r>=o.length?(a=new Lh(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const JM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,QM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tx(i,t,e){let n=new Ll;const s=new bt,r=new bt,o=new Wt,a=new _g({depthPacking:dm}),l=new vg,c={},u=e.maxTextureSize,h={[ii]:$e,[$e]:ii,[un]:un},d=new Hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bt},radius:{value:4}},vertexShader:JM,fragmentShader:QM}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const _=new ee;_.setAttribute("position",new De(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Se(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mu;let f=this.type;this.render=function(A,P,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const x=i.getRenderTarget(),b=i.getActiveCubeFace(),y=i.getActiveMipmapLevel(),U=i.state;U.setBlending(ti),U.buffers.depth.getReversed()?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const N=f!==Nn&&this.type===Nn,B=f===Nn&&this.type!==Nn;for(let W=0,V=A.length;W<V;W++){const Z=A[W],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const nt=H.getFrameExtents();if(s.multiply(nt),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/nt.x),s.x=r.x*nt.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/nt.y),s.y=r.y*nt.y,H.mapSize.y=r.y)),H.map===null||N===!0||B===!0){const _t=this.type!==Nn?{minFilter:tn,magFilter:tn}:{};H.map!==null&&H.map.dispose(),H.map=new wi(s.x,s.y,_t),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const ct=H.getViewportCount();for(let _t=0;_t<ct;_t++){const Nt=H.getViewport(_t);o.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),U.viewport(o),H.updateMatrices(Z,_t),n=H.getFrustum(),M(P,D,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===Nn&&w(H,D),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(x,b,y)};function w(A,P){const D=t.update(g);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new wi(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(P,null,D,d,g,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(P,null,D,p,g,null)}function E(A,P,D,x){let b=null;const y=D.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(y!==void 0)b=y;else if(b=D.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const U=b.uuid,N=P.uuid;let B=c[U];B===void 0&&(B={},c[U]=B);let W=B[N];W===void 0&&(W=b.clone(),B[N]=W,P.addEventListener("dispose",R)),b=W}if(b.visible=P.visible,b.wireframe=P.wireframe,x===Nn?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:h[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,D.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const U=i.properties.get(b);U.light=D}return b}function M(A,P,D,x,b){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Nn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,A.matrixWorld);const N=t.update(A),B=A.material;if(Array.isArray(B)){const W=N.groups;for(let V=0,Z=W.length;V<Z;V++){const H=W[V],nt=B[H.materialIndex];if(nt&&nt.visible){const ct=E(A,nt,x,b);A.onBeforeShadow(i,A,P,D,N,ct,H),i.renderBufferDirect(D,null,N,ct,A,H),A.onAfterShadow(i,A,P,D,N,ct,H)}}}else if(B.visible){const W=E(A,B,x,b);A.onBeforeShadow(i,A,P,D,N,W,null),i.renderBufferDirect(D,null,N,W,A,null),A.onAfterShadow(i,A,P,D,N,W,null)}}const U=A.children;for(let N=0,B=U.length;N<B;N++)M(U[N],P,D,x,b)}function R(A){A.target.removeEventListener("dispose",R);for(const D in c){const x=c[D],b=A.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const ex={[Ao]:Ro,[Co]:Uo,[Po]:Do,[cs]:Lo,[Ro]:Ao,[Uo]:Co,[Do]:Po,[Lo]:cs};function nx(i,t){function e(){let I=!1;const et=new Wt;let rt=null;const ft=new Wt(0,0,0,0);return{setMask:function(J){rt!==J&&!I&&(i.colorMask(J,J,J,J),rt=J)},setLocked:function(J){I=J},setClear:function(J,q,gt,It,oe){oe===!0&&(J*=It,q*=It,gt*=It),et.set(J,q,gt,It),ft.equals(et)===!1&&(i.clearColor(J,q,gt,It),ft.copy(et))},reset:function(){I=!1,rt=null,ft.set(-1,0,0,0)}}}function n(){let I=!1,et=!1,rt=null,ft=null,J=null;return{setReversed:function(q){if(et!==q){const gt=t.get("EXT_clip_control");q?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),et=q;const It=J;J=null,this.setClear(It)}},getReversed:function(){return et},setTest:function(q){q?it(i.DEPTH_TEST):Et(i.DEPTH_TEST)},setMask:function(q){rt!==q&&!I&&(i.depthMask(q),rt=q)},setFunc:function(q){if(et&&(q=ex[q]),ft!==q){switch(q){case Ao:i.depthFunc(i.NEVER);break;case Ro:i.depthFunc(i.ALWAYS);break;case Co:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case Po:i.depthFunc(i.EQUAL);break;case Lo:i.depthFunc(i.GEQUAL);break;case Uo:i.depthFunc(i.GREATER);break;case Do:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=q}},setLocked:function(q){I=q},setClear:function(q){J!==q&&(et&&(q=1-q),i.clearDepth(q),J=q)},reset:function(){I=!1,rt=null,ft=null,J=null,et=!1}}}function s(){let I=!1,et=null,rt=null,ft=null,J=null,q=null,gt=null,It=null,oe=null;return{setTest:function(Kt){I||(Kt?it(i.STENCIL_TEST):Et(i.STENCIL_TEST))},setMask:function(Kt){et!==Kt&&!I&&(i.stencilMask(Kt),et=Kt)},setFunc:function(Kt,Rn,pn){(rt!==Kt||ft!==Rn||J!==pn)&&(i.stencilFunc(Kt,Rn,pn),rt=Kt,ft=Rn,J=pn)},setOp:function(Kt,Rn,pn){(q!==Kt||gt!==Rn||It!==pn)&&(i.stencilOp(Kt,Rn,pn),q=Kt,gt=Rn,It=pn)},setLocked:function(Kt){I=Kt},setClear:function(Kt){oe!==Kt&&(i.clearStencil(Kt),oe=Kt)},reset:function(){I=!1,et=null,rt=null,ft=null,J=null,q=null,gt=null,It=null,oe=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],_=null,g=!1,m=null,f=null,w=null,E=null,M=null,R=null,A=null,P=new Gt(0,0,0),D=0,x=!1,b=null,y=null,U=null,N=null,B=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,Z=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),V=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),V=Z>=2);let nt=null,ct={};const _t=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),ie=new Wt().fromArray(_t),qt=new Wt().fromArray(Nt);function Y(I,et,rt,ft){const J=new Uint8Array(4),q=i.createTexture();i.bindTexture(I,q),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let gt=0;gt<rt;gt++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(et,0,i.RGBA,1,1,ft,0,i.RGBA,i.UNSIGNED_BYTE,J):i.texImage2D(et+gt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,J);return q}const ot={};ot[i.TEXTURE_2D]=Y(i.TEXTURE_2D,i.TEXTURE_2D,1),ot[i.TEXTURE_CUBE_MAP]=Y(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[i.TEXTURE_2D_ARRAY]=Y(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ot[i.TEXTURE_3D]=Y(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),it(i.DEPTH_TEST),o.setFunc(cs),jt(!1),St(yc),it(i.CULL_FACE),ae(ti);function it(I){u[I]!==!0&&(i.enable(I),u[I]=!0)}function Et(I){u[I]!==!1&&(i.disable(I),u[I]=!1)}function wt(I,et){return h[I]!==et?(i.bindFramebuffer(I,et),h[I]=et,I===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=et),I===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=et),!0):!1}function Dt(I,et){let rt=p,ft=!1;if(I){rt=d.get(et),rt===void 0&&(rt=[],d.set(et,rt));const J=I.textures;if(rt.length!==J.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let q=0,gt=J.length;q<gt;q++)rt[q]=i.COLOR_ATTACHMENT0+q;rt.length=J.length,ft=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,ft=!0);ft&&i.drawBuffers(rt)}function _e(I){return _!==I?(i.useProgram(I),_=I,!0):!1}const Vt={[mi]:i.FUNC_ADD,[zp]:i.FUNC_SUBTRACT,[Hp]:i.FUNC_REVERSE_SUBTRACT};Vt[kp]=i.MIN,Vt[Gp]=i.MAX;const L={[Vp]:i.ZERO,[Wp]:i.ONE,[Xp]:i.SRC_COLOR,[wo]:i.SRC_ALPHA,[Zp]:i.SRC_ALPHA_SATURATE,[jp]:i.DST_COLOR,[$p]:i.DST_ALPHA,[Yp]:i.ONE_MINUS_SRC_COLOR,[To]:i.ONE_MINUS_SRC_ALPHA,[Kp]:i.ONE_MINUS_DST_COLOR,[qp]:i.ONE_MINUS_DST_ALPHA,[Jp]:i.CONSTANT_COLOR,[Qp]:i.ONE_MINUS_CONSTANT_COLOR,[tm]:i.CONSTANT_ALPHA,[em]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(I,et,rt,ft,J,q,gt,It,oe,Kt){if(I===ti){g===!0&&(Et(i.BLEND),g=!1);return}if(g===!1&&(it(i.BLEND),g=!0),I!==Bp){if(I!==m||Kt!==x){if((f!==mi||M!==mi)&&(i.blendEquation(i.FUNC_ADD),f=mi,M=mi),Kt)switch(I){case ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFunc(i.ONE,i.ONE);break;case Sc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Mn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Sc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,E=null,R=null,A=null,P.set(0,0,0),D=0,m=I,x=Kt}return}J=J||et,q=q||rt,gt=gt||ft,(et!==f||J!==M)&&(i.blendEquationSeparate(Vt[et],Vt[J]),f=et,M=J),(rt!==w||ft!==E||q!==R||gt!==A)&&(i.blendFuncSeparate(L[rt],L[ft],L[q],L[gt]),w=rt,E=ft,R=q,A=gt),(It.equals(P)===!1||oe!==D)&&(i.blendColor(It.r,It.g,It.b,oe),P.copy(It),D=oe),m=I,x=!1}function At(I,et){I.side===un?Et(i.CULL_FACE):it(i.CULL_FACE);let rt=I.side===$e;et&&(rt=!rt),jt(rt),I.blending===ss&&I.transparent===!1?ae(ti):ae(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const ft=I.stencilWrite;a.setTest(ft),ft&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),pt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?it(i.SAMPLE_ALPHA_TO_COVERAGE):Et(i.SAMPLE_ALPHA_TO_COVERAGE)}function jt(I){b!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),b=I)}function St(I){I!==Np?(it(i.CULL_FACE),I!==y&&(I===yc?i.cullFace(i.BACK):I===Fp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Et(i.CULL_FACE),y=I}function de(I){I!==U&&(V&&i.lineWidth(I),U=I)}function pt(I,et,rt){I?(it(i.POLYGON_OFFSET_FILL),(N!==et||B!==rt)&&(i.polygonOffset(et,rt),N=et,B=rt)):Et(i.POLYGON_OFFSET_FILL)}function zt(I){I?it(i.SCISSOR_TEST):Et(i.SCISSOR_TEST)}function we(I){I===void 0&&(I=i.TEXTURE0+W-1),nt!==I&&(i.activeTexture(I),nt=I)}function ve(I,et,rt){rt===void 0&&(nt===null?rt=i.TEXTURE0+W-1:rt=nt);let ft=ct[rt];ft===void 0&&(ft={type:void 0,texture:void 0},ct[rt]=ft),(ft.type!==I||ft.texture!==et)&&(nt!==rt&&(i.activeTexture(rt),nt=rt),i.bindTexture(I,et||ot[I]),ft.type=I,ft.texture=et)}function T(){const I=ct[nt];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{i.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{i.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function yt(){try{i.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function st(){try{i.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function vt(){try{i.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Mt(){try{i.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ut(I){ie.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),ie.copy(I))}function Pt(I){qt.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),qt.copy(I))}function xt(I,et){let rt=c.get(et);rt===void 0&&(rt=new WeakMap,c.set(et,rt));let ft=rt.get(I);ft===void 0&&(ft=i.getUniformBlockIndex(et,I.name),rt.set(I,ft))}function lt(I,et){const ft=c.get(et).get(I);l.get(et)!==ft&&(i.uniformBlockBinding(et,ft,I.__bindingPointIndex),l.set(et,ft))}function Ft(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},nt=null,ct={},h={},d=new WeakMap,p=[],_=null,g=!1,m=null,f=null,w=null,E=null,M=null,R=null,A=null,P=new Gt(0,0,0),D=0,x=!1,b=null,y=null,U=null,N=null,B=null,ie.set(0,0,i.canvas.width,i.canvas.height),qt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:it,disable:Et,bindFramebuffer:wt,drawBuffers:Dt,useProgram:_e,setBlending:ae,setMaterial:At,setFlipSided:jt,setCullFace:St,setLineWidth:de,setPolygonOffset:pt,setScissorTest:zt,activeTexture:we,bindTexture:ve,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:z,texImage2D:Mt,texImage3D:tt,updateUBOMapping:xt,uniformBlockBinding:lt,texStorage2D:st,texStorage3D:vt,texSubImage2D:$,texSubImage3D:K,compressedTexSubImage2D:X,compressedTexSubImage3D:yt,scissor:ut,viewport:Pt,reset:Ft}}function ix(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new bt,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,v){return p?new OffscreenCanvas(T,v):ia("canvas")}function g(T,v,z){let $=1;const K=ve(T);if((K.width>z||K.height>z)&&($=z/Math.max(K.width,K.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const X=Math.floor($*K.width),yt=Math.floor($*K.height);h===void 0&&(h=_(X,yt));const st=v?_(X,yt):h;return st.width=X,st.height=yt,st.getContext("2d").drawImage(T,0,0,X,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+X+"x"+yt+")."),st}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function w(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,v,z,$,K=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=v;if(v===i.RED&&(z===i.FLOAT&&(X=i.R32F),z===i.HALF_FLOAT&&(X=i.R16F),z===i.UNSIGNED_BYTE&&(X=i.R8)),v===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(X=i.R8UI),z===i.UNSIGNED_SHORT&&(X=i.R16UI),z===i.UNSIGNED_INT&&(X=i.R32UI),z===i.BYTE&&(X=i.R8I),z===i.SHORT&&(X=i.R16I),z===i.INT&&(X=i.R32I)),v===i.RG&&(z===i.FLOAT&&(X=i.RG32F),z===i.HALF_FLOAT&&(X=i.RG16F),z===i.UNSIGNED_BYTE&&(X=i.RG8)),v===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(X=i.RG8UI),z===i.UNSIGNED_SHORT&&(X=i.RG16UI),z===i.UNSIGNED_INT&&(X=i.RG32UI),z===i.BYTE&&(X=i.RG8I),z===i.SHORT&&(X=i.RG16I),z===i.INT&&(X=i.RG32I)),v===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(X=i.RGB8UI),z===i.UNSIGNED_SHORT&&(X=i.RGB16UI),z===i.UNSIGNED_INT&&(X=i.RGB32UI),z===i.BYTE&&(X=i.RGB8I),z===i.SHORT&&(X=i.RGB16I),z===i.INT&&(X=i.RGB32I)),v===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),z===i.UNSIGNED_INT&&(X=i.RGBA32UI),z===i.BYTE&&(X=i.RGBA8I),z===i.SHORT&&(X=i.RGBA16I),z===i.INT&&(X=i.RGBA32I)),v===i.RGB&&z===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),v===i.RGBA){const yt=K?ea:$t.getTransfer($);z===i.FLOAT&&(X=i.RGBA32F),z===i.HALF_FLOAT&&(X=i.RGBA16F),z===i.UNSIGNED_BYTE&&(X=yt===te?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function M(T,v){let z;return T?v===null||v===bi||v===Vs?z=i.DEPTH24_STENCIL8:v===Sn?z=i.DEPTH32F_STENCIL8:v===Gs&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===bi||v===Vs?z=i.DEPTH_COMPONENT24:v===Sn?z=i.DEPTH_COMPONENT32F:v===Gs&&(z=i.DEPTH_COMPONENT16),z}function R(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==tn&&T.minFilter!==on?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function A(T){const v=T.target;v.removeEventListener("dispose",A),D(v),v.isVideoTexture&&u.delete(v)}function P(T){const v=T.target;v.removeEventListener("dispose",P),b(v)}function D(T){const v=n.get(T);if(v.__webglInit===void 0)return;const z=T.source,$=d.get(z);if($){const K=$[v.__cacheKey];K.usedTimes--,K.usedTimes===0&&x(T),Object.keys($).length===0&&d.delete(z)}n.remove(T)}function x(T){const v=n.get(T);i.deleteTexture(v.__webglTexture);const z=T.source,$=d.get(z);delete $[v.__cacheKey],o.memory.textures--}function b(T){const v=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let K=0;K<v.__webglFramebuffer[$].length;K++)i.deleteFramebuffer(v.__webglFramebuffer[$][K]);else i.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)i.deleteFramebuffer(v.__webglFramebuffer[$]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const z=T.textures;for(let $=0,K=z.length;$<K;$++){const X=n.get(z[$]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),o.memory.textures--),n.remove(z[$])}n.remove(T)}let y=0;function U(){y=0}function N(){const T=y;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),y+=1,T}function B(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function W(T,v){const z=n.get(T);if(T.isVideoTexture&&zt(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&z.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ot(z,T,v);return}}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+v)}function V(T,v){const z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){ot(z,T,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+v)}function Z(T,v){const z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){ot(z,T,v);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+v)}function H(T,v){const z=n.get(T);if(T.version>0&&z.__version!==T.version){it(z,T,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+v)}const nt={[Fo]:i.REPEAT,[xi]:i.CLAMP_TO_EDGE,[Oo]:i.MIRRORED_REPEAT},ct={[tn]:i.NEAREST,[hm]:i.NEAREST_MIPMAP_NEAREST,[Qs]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[ba]:i.LINEAR_MIPMAP_NEAREST,[yi]:i.LINEAR_MIPMAP_LINEAR},_t={[pm]:i.NEVER,[xm]:i.ALWAYS,[mm]:i.LESS,[Lu]:i.LEQUAL,[gm]:i.EQUAL,[Mm]:i.GEQUAL,[_m]:i.GREATER,[vm]:i.NOTEQUAL};function Nt(T,v){if(v.type===Sn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===on||v.magFilter===ba||v.magFilter===Qs||v.magFilter===yi||v.minFilter===on||v.minFilter===ba||v.minFilter===Qs||v.minFilter===yi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,nt[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,nt[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,nt[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ct[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ct[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,_t[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===tn||v.minFilter!==Qs&&v.minFilter!==yi||v.type===Sn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ie(T,v){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",A));const $=v.source;let K=d.get($);K===void 0&&(K={},d.set($,K));const X=B(v);if(X!==T.__cacheKey){K[X]===void 0&&(K[X]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),K[X].usedTimes++;const yt=K[T.__cacheKey];yt!==void 0&&(K[T.__cacheKey].usedTimes--,yt.usedTimes===0&&x(v)),T.__cacheKey=X,T.__webglTexture=K[X].texture}return z}function qt(T,v,z){return Math.floor(Math.floor(T/z)/v)}function Y(T,v,z,$){const X=T.updateRanges;if(X.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,z,$,v.data);else{X.sort((tt,ut)=>tt.start-ut.start);let yt=0;for(let tt=1;tt<X.length;tt++){const ut=X[yt],Pt=X[tt],xt=ut.start+ut.count,lt=qt(Pt.start,v.width,4),Ft=qt(ut.start,v.width,4);Pt.start<=xt+1&&lt===Ft&&qt(Pt.start+Pt.count-1,v.width,4)===lt?ut.count=Math.max(ut.count,Pt.start+Pt.count-ut.start):(++yt,X[yt]=Pt)}X.length=yt+1;const st=i.getParameter(i.UNPACK_ROW_LENGTH),vt=i.getParameter(i.UNPACK_SKIP_PIXELS),Mt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let tt=0,ut=X.length;tt<ut;tt++){const Pt=X[tt],xt=Math.floor(Pt.start/4),lt=Math.ceil(Pt.count/4),Ft=xt%v.width,I=Math.floor(xt/v.width),et=lt,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ft),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),e.texSubImage2D(i.TEXTURE_2D,0,Ft,I,et,rt,z,$,v.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,st),i.pixelStorei(i.UNPACK_SKIP_PIXELS,vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Mt)}}function ot(T,v,z){let $=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=i.TEXTURE_3D);const K=ie(T,v),X=v.source;e.bindTexture($,T.__webglTexture,i.TEXTURE0+z);const yt=n.get(X);if(X.version!==yt.__version||K===!0){e.activeTexture(i.TEXTURE0+z);const st=$t.getPrimaries($t.workingColorSpace),vt=v.colorSpace===Zn?null:$t.getPrimaries(v.colorSpace),Mt=v.colorSpace===Zn||st===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let tt=g(v.image,!1,s.maxTextureSize);tt=we(v,tt);const ut=r.convert(v.format,v.colorSpace),Pt=r.convert(v.type);let xt=E(v.internalFormat,ut,Pt,v.colorSpace,v.isVideoTexture);Nt($,v);let lt;const Ft=v.mipmaps,I=v.isVideoTexture!==!0,et=yt.__version===void 0||K===!0,rt=X.dataReady,ft=R(v,tt);if(v.isDepthTexture)xt=M(v.format===Xs,v.type),et&&(I?e.texStorage2D(i.TEXTURE_2D,1,xt,tt.width,tt.height):e.texImage2D(i.TEXTURE_2D,0,xt,tt.width,tt.height,0,ut,Pt,null));else if(v.isDataTexture)if(Ft.length>0){I&&et&&e.texStorage2D(i.TEXTURE_2D,ft,xt,Ft[0].width,Ft[0].height);for(let J=0,q=Ft.length;J<q;J++)lt=Ft[J],I?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,lt.width,lt.height,ut,Pt,lt.data):e.texImage2D(i.TEXTURE_2D,J,xt,lt.width,lt.height,0,ut,Pt,lt.data);v.generateMipmaps=!1}else I?(et&&e.texStorage2D(i.TEXTURE_2D,ft,xt,tt.width,tt.height),rt&&Y(v,tt,ut,Pt)):e.texImage2D(i.TEXTURE_2D,0,xt,tt.width,tt.height,0,ut,Pt,tt.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){I&&et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,xt,Ft[0].width,Ft[0].height,tt.depth);for(let J=0,q=Ft.length;J<q;J++)if(lt=Ft[J],v.format!==fn)if(ut!==null)if(I){if(rt)if(v.layerUpdates.size>0){const gt=oh(lt.width,lt.height,v.format,v.type);for(const It of v.layerUpdates){const oe=lt.data.subarray(It*gt/lt.data.BYTES_PER_ELEMENT,(It+1)*gt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,It,lt.width,lt.height,1,ut,oe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,lt.width,lt.height,tt.depth,ut,lt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,xt,lt.width,lt.height,tt.depth,0,lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,lt.width,lt.height,tt.depth,ut,Pt,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,J,xt,lt.width,lt.height,tt.depth,0,ut,Pt,lt.data)}else{I&&et&&e.texStorage2D(i.TEXTURE_2D,ft,xt,Ft[0].width,Ft[0].height);for(let J=0,q=Ft.length;J<q;J++)lt=Ft[J],v.format!==fn?ut!==null?I?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,lt.width,lt.height,ut,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,J,xt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,lt.width,lt.height,ut,Pt,lt.data):e.texImage2D(i.TEXTURE_2D,J,xt,lt.width,lt.height,0,ut,Pt,lt.data)}else if(v.isDataArrayTexture)if(I){if(et&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,xt,tt.width,tt.height,tt.depth),rt)if(v.layerUpdates.size>0){const J=oh(tt.width,tt.height,v.format,v.type);for(const q of v.layerUpdates){const gt=tt.data.subarray(q*J/tt.data.BYTES_PER_ELEMENT,(q+1)*J/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,q,tt.width,tt.height,1,ut,Pt,gt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,ut,Pt,tt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,xt,tt.width,tt.height,tt.depth,0,ut,Pt,tt.data);else if(v.isData3DTexture)I?(et&&e.texStorage3D(i.TEXTURE_3D,ft,xt,tt.width,tt.height,tt.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,ut,Pt,tt.data)):e.texImage3D(i.TEXTURE_3D,0,xt,tt.width,tt.height,tt.depth,0,ut,Pt,tt.data);else if(v.isFramebufferTexture){if(et)if(I)e.texStorage2D(i.TEXTURE_2D,ft,xt,tt.width,tt.height);else{let J=tt.width,q=tt.height;for(let gt=0;gt<ft;gt++)e.texImage2D(i.TEXTURE_2D,gt,xt,J,q,0,ut,Pt,null),J>>=1,q>>=1}}else if(Ft.length>0){if(I&&et){const J=ve(Ft[0]);e.texStorage2D(i.TEXTURE_2D,ft,xt,J.width,J.height)}for(let J=0,q=Ft.length;J<q;J++)lt=Ft[J],I?rt&&e.texSubImage2D(i.TEXTURE_2D,J,0,0,ut,Pt,lt):e.texImage2D(i.TEXTURE_2D,J,xt,ut,Pt,lt);v.generateMipmaps=!1}else if(I){if(et){const J=ve(tt);e.texStorage2D(i.TEXTURE_2D,ft,xt,J.width,J.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ut,Pt,tt)}else e.texImage2D(i.TEXTURE_2D,0,xt,ut,Pt,tt);m(v)&&f($),yt.__version=X.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function it(T,v,z){if(v.image.length!==6)return;const $=ie(T,v),K=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);const X=n.get(K);if(K.version!==X.__version||$===!0){e.activeTexture(i.TEXTURE0+z);const yt=$t.getPrimaries($t.workingColorSpace),st=v.colorSpace===Zn?null:$t.getPrimaries(v.colorSpace),vt=v.colorSpace===Zn||yt===st?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Mt=v.isCompressedTexture||v.image[0].isCompressedTexture,tt=v.image[0]&&v.image[0].isDataTexture,ut=[];for(let q=0;q<6;q++)!Mt&&!tt?ut[q]=g(v.image[q],!0,s.maxCubemapSize):ut[q]=tt?v.image[q].image:v.image[q],ut[q]=we(v,ut[q]);const Pt=ut[0],xt=r.convert(v.format,v.colorSpace),lt=r.convert(v.type),Ft=E(v.internalFormat,xt,lt,v.colorSpace),I=v.isVideoTexture!==!0,et=X.__version===void 0||$===!0,rt=K.dataReady;let ft=R(v,Pt);Nt(i.TEXTURE_CUBE_MAP,v);let J;if(Mt){I&&et&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Ft,Pt.width,Pt.height);for(let q=0;q<6;q++){J=ut[q].mipmaps;for(let gt=0;gt<J.length;gt++){const It=J[gt];v.format!==fn?xt!==null?I?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt,0,0,It.width,It.height,xt,It.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt,Ft,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt,0,0,It.width,It.height,xt,lt,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt,Ft,It.width,It.height,0,xt,lt,It.data)}}}else{if(J=v.mipmaps,I&&et){J.length>0&&ft++;const q=ve(ut[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Ft,q.width,q.height)}for(let q=0;q<6;q++)if(tt){I?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ut[q].width,ut[q].height,xt,lt,ut[q].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ft,ut[q].width,ut[q].height,0,xt,lt,ut[q].data);for(let gt=0;gt<J.length;gt++){const oe=J[gt].image[q].image;I?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt+1,0,0,oe.width,oe.height,xt,lt,oe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt+1,Ft,oe.width,oe.height,0,xt,lt,oe.data)}}else{I?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,xt,lt,ut[q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ft,xt,lt,ut[q]);for(let gt=0;gt<J.length;gt++){const It=J[gt];I?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt+1,0,0,xt,lt,It.image[q]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,gt+1,Ft,xt,lt,It.image[q])}}}m(v)&&f(i.TEXTURE_CUBE_MAP),X.__version=K.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function Et(T,v,z,$,K,X){const yt=r.convert(z.format,z.colorSpace),st=r.convert(z.type),vt=E(z.internalFormat,yt,st,z.colorSpace),Mt=n.get(v),tt=n.get(z);if(tt.__renderTarget=v,!Mt.__hasExternalTextures){const ut=Math.max(1,v.width>>X),Pt=Math.max(1,v.height>>X);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,X,vt,ut,Pt,v.depth,0,yt,st,null):e.texImage2D(K,X,vt,ut,Pt,0,yt,st,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,K,tt.__webglTexture,0,de(v)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,K,tt.__webglTexture,X),e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(T,v,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){const $=v.depthTexture,K=$&&$.isDepthTexture?$.type:null,X=M(v.stencilBuffer,K),yt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=de(v);pt(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,X,v.width,v.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,st,X,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,X,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,T)}else{const $=v.textures;for(let K=0;K<$.length;K++){const X=$[K],yt=r.convert(X.format,X.colorSpace),st=r.convert(X.type),vt=E(X.internalFormat,yt,st,X.colorSpace),Mt=de(v);z&&pt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,vt,v.width,v.height):pt(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,vt,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,vt,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(v.depthTexture);$.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),W(v.depthTexture,0);const K=$.__webglTexture,X=de(v);if(v.depthTexture.format===Ws)pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(v.depthTexture.format===Xs)pt(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function _e(T){const v=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const K=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",K)};$.addEventListener("dispose",K),v.__depthDisposeCallback=K}v.__boundDepthTexture=$}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const $=T.texture.mipmaps;$&&$.length>0?Dt(v.__webglFramebuffer[0],T):Dt(v.__webglFramebuffer,T)}else if(z){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=i.createRenderbuffer(),wt(v.__webglDepthbuffer[$],T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}else{const $=T.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),wt(v.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(T,v,z){const $=n.get(T);v!==void 0&&Et($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&_e(T)}function L(T){const v=T.texture,z=n.get(T),$=n.get(v);T.addEventListener("dispose",P);const K=T.textures,X=T.isWebGLCubeRenderTarget===!0,yt=K.length>1;if(yt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=v.version,o.memory.textures++),X){z.__webglFramebuffer=[];for(let st=0;st<6;st++)if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer[st]=[];for(let vt=0;vt<v.mipmaps.length;vt++)z.__webglFramebuffer[st][vt]=i.createFramebuffer()}else z.__webglFramebuffer[st]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){z.__webglFramebuffer=[];for(let st=0;st<v.mipmaps.length;st++)z.__webglFramebuffer[st]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(yt)for(let st=0,vt=K.length;st<vt;st++){const Mt=n.get(K[st]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&pt(T)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let st=0;st<K.length;st++){const vt=K[st];z.__webglColorRenderbuffer[st]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[st]);const Mt=r.convert(vt.format,vt.colorSpace),tt=r.convert(vt.type),ut=E(vt.internalFormat,Mt,tt,vt.colorSpace,T.isXRRenderTarget===!0),Pt=de(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,ut,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.RENDERBUFFER,z.__webglColorRenderbuffer[st])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),wt(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,v);for(let st=0;st<6;st++)if(v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)Et(z.__webglFramebuffer[st][vt],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+st,vt);else Et(z.__webglFramebuffer[st],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0);m(v)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let st=0,vt=K.length;st<vt;st++){const Mt=K[st],tt=n.get(Mt);let ut=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ut=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,tt.__webglTexture),Nt(ut,Mt),Et(z.__webglFramebuffer,T,Mt,i.COLOR_ATTACHMENT0+st,ut,0),m(Mt)&&f(ut)}e.unbindTexture()}else{let st=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(st=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(st,$.__webglTexture),Nt(st,v),v.mipmaps&&v.mipmaps.length>0)for(let vt=0;vt<v.mipmaps.length;vt++)Et(z.__webglFramebuffer[vt],T,v,i.COLOR_ATTACHMENT0,st,vt);else Et(z.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,st,0);m(v)&&f(st),e.unbindTexture()}T.depthBuffer&&_e(T)}function ae(T){const v=T.textures;for(let z=0,$=v.length;z<$;z++){const K=v[z];if(m(K)){const X=w(T),yt=n.get(K).__webglTexture;e.bindTexture(X,yt),f(X),e.unbindTexture()}}}const At=[],jt=[];function St(T){if(T.samples>0){if(pt(T)===!1){const v=T.textures,z=T.width,$=T.height;let K=i.COLOR_BUFFER_BIT;const X=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(T),st=v.length>1;if(st)for(let Mt=0;Mt<v.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer);const vt=T.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Mt=0;Mt<v.length;Mt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),st){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Mt]);const tt=n.get(v[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,tt,0)}i.blitFramebuffer(0,0,z,$,0,0,z,$,K,i.NEAREST),l===!0&&(At.length=0,jt.length=0,At.push(i.COLOR_ATTACHMENT0+Mt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(At.push(X),jt.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,jt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,At))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),st)for(let Mt=0;Mt<v.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Mt]);const tt=n.get(v[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,tt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function de(T){return Math.min(s.maxSamples,T.samples)}function pt(T){const v=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function zt(T){const v=o.render.frame;u.get(T)!==v&&(u.set(T,v),T.update())}function we(T,v){const z=T.colorSpace,$=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==ds&&z!==Zn&&($t.getTransfer(z)===te?($!==fn||K!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),v}function ve(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=U,this.setTexture2D=W,this.setTexture2DArray=V,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=Vt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=St,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=pt}function sx(i,t){function e(n,s=Zn){let r;const o=$t.getTransfer(s);if(n===wn)return i.UNSIGNED_BYTE;if(n===Sl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===wu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===bu)return i.BYTE;if(n===Eu)return i.SHORT;if(n===Gs)return i.UNSIGNED_SHORT;if(n===yl)return i.INT;if(n===bi)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===qs)return i.HALF_FLOAT;if(n===Tu)return i.ALPHA;if(n===Au)return i.RGB;if(n===fn)return i.RGBA;if(n===Ws)return i.DEPTH_COMPONENT;if(n===Xs)return i.DEPTH_STENCIL;if(n===El)return i.RED;if(n===wl)return i.RED_INTEGER;if(n===Ru)return i.RG;if(n===Tl)return i.RG_INTEGER;if(n===Al)return i.RGBA_INTEGER;if(n===zr||n===Hr||n===kr||n===Gr)if(o===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Bo||n===zo||n===Ho||n===ko)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Bo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===zo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ho)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ko)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Go||n===Vo||n===Wo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Go||n===Vo)return o===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xo||n===Yo||n===$o||n===qo||n===jo||n===Ko||n===Zo||n===Jo||n===Qo||n===tl||n===el||n===nl||n===il||n===sl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Yo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$o)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===jo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ko)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Jo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qo)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===tl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===el)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===il)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sl)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vr||n===rl||n===al)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Vr)return o===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===rl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===al)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Cu||n===ol||n===ll||n===cl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ol)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ll)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===cl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Vs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Qu extends Ie{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const rx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ax=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class ox{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Qu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Hn({vertexShader:rx,fragmentShader:ax,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Se(new Ks(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lx extends Ti{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,_=null;const g=new ox,m={},f=e.getContextAttributes();let w=null,E=null;const M=[],R=[],A=new bt;let P=null;const D=new Je;D.viewport=new Wt;const x=new Je;x.viewport=new Wt;const b=[D,x],y=new wg;let U=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ot=M[Y];return ot===void 0&&(ot=new Wa,M[Y]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(Y){let ot=M[Y];return ot===void 0&&(ot=new Wa,M[Y]=ot),ot.getGripSpace()},this.getHand=function(Y){let ot=M[Y];return ot===void 0&&(ot=new Wa,M[Y]=ot),ot.getHandSpace()};function B(Y){const ot=R.indexOf(Y.inputSource);if(ot===-1)return;const it=M[ot];it!==void 0&&(it.update(Y.inputSource,Y.frame,c||o),it.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",B),s.removeEventListener("selectstart",B),s.removeEventListener("selectend",B),s.removeEventListener("squeeze",B),s.removeEventListener("squeezestart",B),s.removeEventListener("squeezeend",B),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",V);for(let Y=0;Y<M.length;Y++){const ot=R[Y];ot!==null&&(R[Y]=null,M[Y].disconnect(ot))}U=null,N=null,g.reset();for(const Y in m)delete m[Y];t.setRenderTarget(w),p=null,d=null,h=null,s=null,E=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",B),s.addEventListener("selectstart",B),s.addEventListener("selectend",B),s.addEventListener("squeeze",B),s.addEventListener("squeezestart",B),s.addEventListener("squeezeend",B),s.addEventListener("end",W),s.addEventListener("inputsourceschange",V),f.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(A),typeof XRWebGLBinding<"u"&&(h=new XRWebGLBinding(s,e)),h!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let it=null,Et=null,wt=null;f.depth&&(wt=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,it=f.stencil?Xs:Ws,Et=f.stencil?Vs:bi);const Dt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};d=h.createProjectionLayer(Dt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),E=new wi(d.textureWidth,d.textureHeight,{format:fn,type:wn,depthTexture:new Xu(d.textureWidth,d.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,it),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const it={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,it),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new wi(p.framebufferWidth,p.framebufferHeight,{format:fn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function V(Y){for(let ot=0;ot<Y.removed.length;ot++){const it=Y.removed[ot],Et=R.indexOf(it);Et>=0&&(R[Et]=null,M[Et].disconnect(it))}for(let ot=0;ot<Y.added.length;ot++){const it=Y.added[ot];let Et=R.indexOf(it);if(Et===-1){for(let Dt=0;Dt<M.length;Dt++)if(Dt>=R.length){R.push(it),Et=Dt;break}else if(R[Dt]===null){R[Dt]=it,Et=Dt;break}if(Et===-1)break}const wt=M[Et];wt&&wt.connect(it)}}const Z=new C,H=new C;function nt(Y,ot,it){Z.setFromMatrixPosition(ot.matrixWorld),H.setFromMatrixPosition(it.matrixWorld);const Et=Z.distanceTo(H),wt=ot.projectionMatrix.elements,Dt=it.projectionMatrix.elements,_e=wt[14]/(wt[10]-1),Vt=wt[14]/(wt[10]+1),L=(wt[9]+1)/wt[5],ae=(wt[9]-1)/wt[5],At=(wt[8]-1)/wt[0],jt=(Dt[8]+1)/Dt[0],St=_e*At,de=_e*jt,pt=Et/(-At+jt),zt=pt*-At;if(ot.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(zt),Y.translateZ(pt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),wt[10]===-1)Y.projectionMatrix.copy(ot.projectionMatrix),Y.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const we=_e+pt,ve=Vt+pt,T=St-zt,v=de+(Et-zt),z=L*Vt/ve*we,$=ae*Vt/ve*we;Y.projectionMatrix.makePerspective(T,v,z,$,we,ve),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ct(Y,ot){ot===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ot.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ot=Y.near,it=Y.far;g.texture!==null&&(g.depthNear>0&&(ot=g.depthNear),g.depthFar>0&&(it=g.depthFar)),y.near=x.near=D.near=ot,y.far=x.far=D.far=it,(U!==y.near||N!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),U=y.near,N=y.far),y.layers.mask=Y.layers.mask|6,D.layers.mask=y.layers.mask&3,x.layers.mask=y.layers.mask&5;const Et=Y.parent,wt=y.cameras;ct(y,Et);for(let Dt=0;Dt<wt.length;Dt++)ct(wt[Dt],Et);wt.length===2?nt(y,D,x):y.projectionMatrix.copy(D.projectionMatrix),_t(Y,y,Et)};function _t(Y,ot,it){it===null?Y.matrix.copy(ot.matrixWorld):(Y.matrix.copy(it.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ot.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ot.projectionMatrix),Y.projectionMatrixInverse.copy(ot.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ys*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)},this.getCameraTexture=function(Y){return m[Y]};let Nt=null;function ie(Y,ot){if(u=ot.getViewerPose(c||o),_=ot,u!==null){const it=u.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let Et=!1;it.length!==y.cameras.length&&(y.cameras.length=0,Et=!0);for(let Vt=0;Vt<it.length;Vt++){const L=it[Vt];let ae=null;if(p!==null)ae=p.getViewport(L);else{const jt=h.getViewSubImage(d,L);ae=jt.viewport,Vt===0&&(t.setRenderTargetTextures(E,jt.colorTexture,jt.depthStencilTexture),t.setRenderTarget(E))}let At=b[Vt];At===void 0&&(At=new Je,At.layers.enable(Vt),At.viewport=new Wt,b[Vt]=At),At.matrix.fromArray(L.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(L.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(ae.x,ae.y,ae.width,ae.height),Vt===0&&(y.matrix.copy(At.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Et===!0&&y.cameras.push(At)}const wt=s.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const Vt=h.getDepthInformation(it[0]);Vt&&Vt.isValid&&Vt.texture&&g.init(Vt,s.renderState)}if(wt&&wt.includes("camera-access")&&(t.state.unbindTexture(),h))for(let Vt=0;Vt<it.length;Vt++){const L=it[Vt].camera;if(L){let ae=m[L];ae||(ae=new Qu,m[L]=ae);const At=h.getCameraImage(L);ae.sourceTexture=At}}}for(let it=0;it<M.length;it++){const Et=R[it],wt=M[it];Et!==null&&wt!==void 0&&wt.update(Et,ot,c||o)}Nt&&Nt(Y,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),_=null}const qt=new qu;qt.setAnimationLoop(ie),this.setAnimationLoop=function(Y){Nt=Y},this.dispose=function(){}}}const fi=new Tn,cx=new Zt;function hx(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,zu(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,w,E,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),_(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),g(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,w,E):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===$e&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===$e&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const w=t.get(f),E=w.envMap,M=w.envMapRotation;E&&(m.envMap.value=E,fi.copy(M),fi.x*=-1,fi.y*=-1,fi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),m.envMapRotation.value.setFromMatrix4(cx.makeRotationFromEuler(fi)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,w,E){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=E*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,w){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===$e&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){const w=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ux(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,E){const M=E.program;n.uniformBlockBinding(w,M)}function c(w,E){let M=s[w.id];M===void 0&&(_(w),M=u(w),s[w.id]=M,w.addEventListener("dispose",m));const R=E.program;n.updateUBOMapping(w,R);const A=t.render.frame;r[w.id]!==A&&(d(w),r[w.id]=A)}function u(w){const E=h();w.__bindingPointIndex=E;const M=i.createBuffer(),R=w.__size,A=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,M),M}function h(){for(let w=0;w<a;w++)if(o.indexOf(w)===-1)return o.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const E=s[w.id],M=w.uniforms,R=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let A=0,P=M.length;A<P;A++){const D=Array.isArray(M[A])?M[A]:[M[A]];for(let x=0,b=D.length;x<b;x++){const y=D[x];if(p(y,A,x,R)===!0){const U=y.__offset,N=Array.isArray(y.value)?y.value:[y.value];let B=0;for(let W=0;W<N.length;W++){const V=N[W],Z=g(V);typeof V=="number"||typeof V=="boolean"?(y.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,U+B,y.__data)):V.isMatrix3?(y.__data[0]=V.elements[0],y.__data[1]=V.elements[1],y.__data[2]=V.elements[2],y.__data[3]=0,y.__data[4]=V.elements[3],y.__data[5]=V.elements[4],y.__data[6]=V.elements[5],y.__data[7]=0,y.__data[8]=V.elements[6],y.__data[9]=V.elements[7],y.__data[10]=V.elements[8],y.__data[11]=0):(V.toArray(y.__data,B),B+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,y.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(w,E,M,R){const A=w.value,P=E+"_"+M;if(R[P]===void 0)return typeof A=="number"||typeof A=="boolean"?R[P]=A:R[P]=A.clone(),!0;{const D=R[P];if(typeof A=="number"||typeof A=="boolean"){if(D!==A)return R[P]=A,!0}else if(D.equals(A)===!1)return D.copy(A),!0}return!1}function _(w){const E=w.uniforms;let M=0;const R=16;for(let P=0,D=E.length;P<D;P++){const x=Array.isArray(E[P])?E[P]:[E[P]];for(let b=0,y=x.length;b<y;b++){const U=x[b],N=Array.isArray(U.value)?U.value:[U.value];for(let B=0,W=N.length;B<W;B++){const V=N[B],Z=g(V),H=M%R,nt=H%Z.boundary,ct=H+nt;M+=nt,ct!==0&&R-ct<Z.storage&&(M+=R-ct),U.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=Z.storage}}}const A=M%R;return A>0&&(M+=R-A),w.__size=M,w.__cache={},this}function g(w){const E={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(E.boundary=4,E.storage=4):w.isVector2?(E.boundary=8,E.storage=8):w.isVector3||w.isColor?(E.boundary=16,E.storage=12):w.isVector4?(E.boundary=16,E.storage=16):w.isMatrix3?(E.boundary=48,E.storage=48):w.isMatrix4?(E.boundary=64,E.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),E}function m(w){const E=w.target;E.removeEventListener("dispose",m);const M=o.indexOf(E.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function f(){for(const w in s)i.deleteBuffer(s[w]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class dx{constructor(t={}){const{canvas:e=Om(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const _=new Uint32Array(4),g=new Int32Array(4);let m=null,f=null;const w=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let R=!1;this._outputColorSpace=Be;let A=0,P=0,D=null,x=-1,b=null;const y=new Wt,U=new Wt;let N=null;const B=new Gt(0);let W=0,V=e.width,Z=e.height,H=1,nt=null,ct=null;const _t=new Wt(0,0,V,Z),Nt=new Wt(0,0,V,Z);let ie=!1;const qt=new Ll;let Y=!1,ot=!1;const it=new Zt,Et=new C,wt=new Wt,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _e=!1;function Vt(){return D===null?H:1}let L=n;function ae(S,F){return e.getContext(S,F)}try{const S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${xl}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",J,!1),L===null){const F="webgl2";if(L=ae(F,S),L===null)throw ae(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let At,jt,St,de,pt,zt,we,ve,T,v,z,$,K,X,yt,st,vt,Mt,tt,ut,Pt,xt,lt,Ft;function I(){At=new Sv(L),At.init(),xt=new sx(L,At),jt=new mv(L,At,t,xt),St=new nx(L,At),jt.reversedDepthBuffer&&d&&St.buffers.depth.setReversed(!0),de=new wv(L),pt=new VM,zt=new ix(L,At,St,pt,jt,xt,de),we=new _v(M),ve=new yv(M),T=new Lg(L),lt=new fv(L,T),v=new bv(L,T,de,lt),z=new Av(L,v,T,de),tt=new Tv(L,jt,zt),st=new gv(pt),$=new GM(M,we,ve,At,jt,lt,st),K=new hx(M,pt),X=new XM,yt=new ZM(At),Mt=new dv(M,we,ve,St,z,p,l),vt=new tx(M,z,jt),Ft=new ux(L,de,jt,St),ut=new pv(L,At,de),Pt=new Ev(L,At,de),de.programs=$.programs,M.capabilities=jt,M.extensions=At,M.properties=pt,M.renderLists=X,M.shadowMap=vt,M.state=St,M.info=de}I();const et=new lx(M,L);this.xr=et,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const S=At.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=At.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(S){S!==void 0&&(H=S,this.setSize(V,Z,!1))},this.getSize=function(S){return S.set(V,Z)},this.setSize=function(S,F,k=!0){if(et.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=S,Z=F,e.width=Math.floor(S*H),e.height=Math.floor(F*H),k===!0&&(e.style.width=S+"px",e.style.height=F+"px"),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(V*H,Z*H).floor()},this.setDrawingBufferSize=function(S,F,k){V=S,Z=F,H=k,e.width=Math.floor(S*k),e.height=Math.floor(F*k),this.setViewport(0,0,S,F)},this.getCurrentViewport=function(S){return S.copy(y)},this.getViewport=function(S){return S.copy(_t)},this.setViewport=function(S,F,k,G){S.isVector4?_t.set(S.x,S.y,S.z,S.w):_t.set(S,F,k,G),St.viewport(y.copy(_t).multiplyScalar(H).round())},this.getScissor=function(S){return S.copy(Nt)},this.setScissor=function(S,F,k,G){S.isVector4?Nt.set(S.x,S.y,S.z,S.w):Nt.set(S,F,k,G),St.scissor(U.copy(Nt).multiplyScalar(H).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(S){St.setScissorTest(ie=S)},this.setOpaqueSort=function(S){nt=S},this.setTransparentSort=function(S){ct=S},this.getClearColor=function(S){return S.copy(Mt.getClearColor())},this.setClearColor=function(){Mt.setClearColor(...arguments)},this.getClearAlpha=function(){return Mt.getClearAlpha()},this.setClearAlpha=function(){Mt.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,k=!0){let G=0;if(S){let O=!1;if(D!==null){const Q=D.texture.format;O=Q===Al||Q===Tl||Q===wl}if(O){const Q=D.texture.type,ht=Q===wn||Q===bi||Q===Gs||Q===Vs||Q===Sl||Q===bl,mt=Mt.getClearColor(),dt=Mt.getClearAlpha(),Ct=mt.r,Lt=mt.g,Tt=mt.b;ht?(_[0]=Ct,_[1]=Lt,_[2]=Tt,_[3]=dt,L.clearBufferuiv(L.COLOR,0,_)):(g[0]=Ct,g[1]=Lt,g[2]=Tt,g[3]=dt,L.clearBufferiv(L.COLOR,0,g))}else G|=L.COLOR_BUFFER_BIT}F&&(G|=L.DEPTH_BUFFER_BIT),k&&(G|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",J,!1),Mt.dispose(),X.dispose(),yt.dispose(),pt.dispose(),we.dispose(),ve.dispose(),z.dispose(),lt.dispose(),Ft.dispose(),$.dispose(),et.dispose(),et.removeEventListener("sessionstart",pn),et.removeEventListener("sessionend",Hl),ri.stop()};function rt(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const S=de.autoReset,F=vt.enabled,k=vt.autoUpdate,G=vt.needsUpdate,O=vt.type;I(),de.autoReset=S,vt.enabled=F,vt.autoUpdate=k,vt.needsUpdate=G,vt.type=O}function J(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function q(S){const F=S.target;F.removeEventListener("dispose",q),gt(F)}function gt(S){It(S),pt.remove(S)}function It(S){const F=pt.get(S).programs;F!==void 0&&(F.forEach(function(k){$.releaseProgram(k)}),S.isShaderMaterial&&$.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,k,G,O,Q){F===null&&(F=Dt);const ht=O.isMesh&&O.matrixWorld.determinant()<0,mt=hd(S,F,k,G,O);St.setMaterial(G,ht);let dt=k.index,Ct=1;if(G.wireframe===!0){if(dt=v.getWireframeAttribute(k),dt===void 0)return;Ct=2}const Lt=k.drawRange,Tt=k.attributes.position;let kt=Lt.start*Ct,Qt=(Lt.start+Lt.count)*Ct;Q!==null&&(kt=Math.max(kt,Q.start*Ct),Qt=Math.min(Qt,(Q.start+Q.count)*Ct)),dt!==null?(kt=Math.max(kt,0),Qt=Math.min(Qt,dt.count)):Tt!=null&&(kt=Math.max(kt,0),Qt=Math.min(Qt,Tt.count));const me=Qt-kt;if(me<0||me===1/0)return;lt.setup(O,G,mt,k,dt);let he,se=ut;if(dt!==null&&(he=T.get(dt),se=Pt,se.setIndex(he)),O.isMesh)G.wireframe===!0?(St.setLineWidth(G.wireframeLinewidth*Vt()),se.setMode(L.LINES)):se.setMode(L.TRIANGLES);else if(O.isLine){let Rt=G.linewidth;Rt===void 0&&(Rt=1),St.setLineWidth(Rt*Vt()),O.isLineSegments?se.setMode(L.LINES):O.isLineLoop?se.setMode(L.LINE_LOOP):se.setMode(L.LINE_STRIP)}else O.isPoints?se.setMode(L.POINTS):O.isSprite&&se.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)rs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),se.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(At.get("WEBGL_multi_draw"))se.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Rt=O._multiDrawStarts,fe=O._multiDrawCounts,Xt=O._multiDrawCount,qe=dt?T.get(dt).bytesPerElement:1,Ai=pt.get(G).currentProgram.getUniforms();for(let je=0;je<Xt;je++)Ai.setValue(L,"_gl_DrawID",je),se.render(Rt[je]/qe,fe[je])}else if(O.isInstancedMesh)se.renderInstances(kt,me,O.count);else if(k.isInstancedBufferGeometry){const Rt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,fe=Math.min(k.instanceCount,Rt);se.renderInstances(kt,me,fe)}else se.render(kt,me)};function oe(S,F,k){S.transparent===!0&&S.side===un&&S.forceSinglePass===!1?(S.side=$e,S.needsUpdate=!0,Js(S,F,k),S.side=ii,S.needsUpdate=!0,Js(S,F,k),S.side=un):Js(S,F,k)}this.compile=function(S,F,k=null){k===null&&(k=S),f=yt.get(k),f.init(F),E.push(f),k.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),S!==k&&S.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();const G=new Set;return S.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const Q=O.material;if(Q)if(Array.isArray(Q))for(let ht=0;ht<Q.length;ht++){const mt=Q[ht];oe(mt,k,O),G.add(mt)}else oe(Q,k,O),G.add(Q)}),f=E.pop(),G},this.compileAsync=function(S,F,k=null){const G=this.compile(S,F,k);return new Promise(O=>{function Q(){if(G.forEach(function(ht){pt.get(ht).currentProgram.isReady()&&G.delete(ht)}),G.size===0){O(S);return}setTimeout(Q,10)}At.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Kt=null;function Rn(S){Kt&&Kt(S)}function pn(){ri.stop()}function Hl(){ri.start()}const ri=new qu;ri.setAnimationLoop(Rn),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(S){Kt=S,et.setAnimationLoop(S),S===null?ri.stop():ri.start()},et.addEventListener("sessionstart",pn),et.addEventListener("sessionend",Hl),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(et.cameraAutoUpdate===!0&&et.updateCamera(F),F=et.getCamera()),S.isScene===!0&&S.onBeforeRender(M,S,F,D),f=yt.get(S,E.length),f.init(F),E.push(f),it.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),qt.setFromProjectionMatrix(it,bn,F.reversedDepth),ot=this.localClippingEnabled,Y=st.init(this.clippingPlanes,ot),m=X.get(S,w.length),m.init(),w.push(m),et.enabled===!0&&et.isPresenting===!0){const Q=M.xr.getDepthSensingMesh();Q!==null&&fa(Q,F,-1/0,M.sortObjects)}fa(S,F,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(nt,ct),_e=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,_e&&Mt.addToRenderList(m,S),this.info.render.frame++,Y===!0&&st.beginShadows();const k=f.state.shadowsArray;vt.render(k,S,F),Y===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,O=m.transmissive;if(f.setupLights(),F.isArrayCamera){const Q=F.cameras;if(O.length>0)for(let ht=0,mt=Q.length;ht<mt;ht++){const dt=Q[ht];Gl(G,O,S,dt)}_e&&Mt.render(S);for(let ht=0,mt=Q.length;ht<mt;ht++){const dt=Q[ht];kl(m,S,dt,dt.viewport)}}else O.length>0&&Gl(G,O,S,F),_e&&Mt.render(S),kl(m,S,F);D!==null&&P===0&&(zt.updateMultisampleRenderTarget(D),zt.updateRenderTargetMipmap(D)),S.isScene===!0&&S.onAfterRender(M,S,F),lt.resetDefaultState(),x=-1,b=null,E.pop(),E.length>0?(f=E[E.length-1],Y===!0&&st.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function fa(S,F,k,G){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)k=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||qt.intersectsSprite(S)){G&&wt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(it);const ht=z.update(S),mt=S.material;mt.visible&&m.push(S,ht,mt,k,wt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||qt.intersectsObject(S))){const ht=z.update(S),mt=S.material;if(G&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),wt.copy(S.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),wt.copy(ht.boundingSphere.center)),wt.applyMatrix4(S.matrixWorld).applyMatrix4(it)),Array.isArray(mt)){const dt=ht.groups;for(let Ct=0,Lt=dt.length;Ct<Lt;Ct++){const Tt=dt[Ct],kt=mt[Tt.materialIndex];kt&&kt.visible&&m.push(S,ht,kt,k,wt.z,Tt)}}else mt.visible&&m.push(S,ht,mt,k,wt.z,null)}}const Q=S.children;for(let ht=0,mt=Q.length;ht<mt;ht++)fa(Q[ht],F,k,G)}function kl(S,F,k,G){const O=S.opaque,Q=S.transmissive,ht=S.transparent;f.setupLightsView(k),Y===!0&&st.setGlobalState(M.clippingPlanes,k),G&&St.viewport(y.copy(G)),O.length>0&&Zs(O,F,k),Q.length>0&&Zs(Q,F,k),ht.length>0&&Zs(ht,F,k),St.buffers.depth.setTest(!0),St.buffers.depth.setMask(!0),St.buffers.color.setMask(!0),St.setPolygonOffset(!1)}function Gl(S,F,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[G.id]===void 0&&(f.state.transmissionRenderTarget[G.id]=new wi(1,1,{generateMipmaps:!0,type:At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float")?qs:wn,minFilter:yi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const Q=f.state.transmissionRenderTarget[G.id],ht=G.viewport||y;Q.setSize(ht.z*M.transmissionResolutionScale,ht.w*M.transmissionResolutionScale);const mt=M.getRenderTarget(),dt=M.getActiveCubeFace(),Ct=M.getActiveMipmapLevel();M.setRenderTarget(Q),M.getClearColor(B),W=M.getClearAlpha(),W<1&&M.setClearColor(16777215,.5),M.clear(),_e&&Mt.render(k);const Lt=M.toneMapping;M.toneMapping=ei;const Tt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),f.setupLightsView(G),Y===!0&&st.setGlobalState(M.clippingPlanes,G),Zs(S,k,G),zt.updateMultisampleRenderTarget(Q),zt.updateRenderTargetMipmap(Q),At.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let Qt=0,me=F.length;Qt<me;Qt++){const he=F[Qt],se=he.object,Rt=he.geometry,fe=he.material,Xt=he.group;if(fe.side===un&&se.layers.test(G.layers)){const qe=fe.side;fe.side=$e,fe.needsUpdate=!0,Vl(se,k,G,Rt,fe,Xt),fe.side=qe,fe.needsUpdate=!0,kt=!0}}kt===!0&&(zt.updateMultisampleRenderTarget(Q),zt.updateRenderTargetMipmap(Q))}M.setRenderTarget(mt,dt,Ct),M.setClearColor(B,W),Tt!==void 0&&(G.viewport=Tt),M.toneMapping=Lt}function Zs(S,F,k){const G=F.isScene===!0?F.overrideMaterial:null;for(let O=0,Q=S.length;O<Q;O++){const ht=S[O],mt=ht.object,dt=ht.geometry,Ct=ht.group;let Lt=ht.material;Lt.allowOverride===!0&&G!==null&&(Lt=G),mt.layers.test(k.layers)&&Vl(mt,F,k,dt,Lt,Ct)}}function Vl(S,F,k,G,O,Q){S.onBeforeRender(M,F,k,G,O,Q),S.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),O.onBeforeRender(M,F,k,G,S,Q),O.transparent===!0&&O.side===un&&O.forceSinglePass===!1?(O.side=$e,O.needsUpdate=!0,M.renderBufferDirect(k,F,G,O,S,Q),O.side=ii,O.needsUpdate=!0,M.renderBufferDirect(k,F,G,O,S,Q),O.side=un):M.renderBufferDirect(k,F,G,O,S,Q),S.onAfterRender(M,F,k,G,O,Q)}function Js(S,F,k){F.isScene!==!0&&(F=Dt);const G=pt.get(S),O=f.state.lights,Q=f.state.shadowsArray,ht=O.state.version,mt=$.getParameters(S,O.state,Q,F,k),dt=$.getProgramCacheKey(mt);let Ct=G.programs;G.environment=S.isMeshStandardMaterial?F.environment:null,G.fog=F.fog,G.envMap=(S.isMeshStandardMaterial?ve:we).get(S.envMap||G.environment),G.envMapRotation=G.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Ct===void 0&&(S.addEventListener("dispose",q),Ct=new Map,G.programs=Ct);let Lt=Ct.get(dt);if(Lt!==void 0){if(G.currentProgram===Lt&&G.lightsStateVersion===ht)return Xl(S,mt),Lt}else mt.uniforms=$.getUniforms(S),S.onBeforeCompile(mt,M),Lt=$.acquireProgram(mt,dt),Ct.set(dt,Lt),G.uniforms=mt.uniforms;const Tt=G.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Tt.clippingPlanes=st.uniform),Xl(S,mt),G.needsLights=dd(S),G.lightsStateVersion=ht,G.needsLights&&(Tt.ambientLightColor.value=O.state.ambient,Tt.lightProbe.value=O.state.probe,Tt.directionalLights.value=O.state.directional,Tt.directionalLightShadows.value=O.state.directionalShadow,Tt.spotLights.value=O.state.spot,Tt.spotLightShadows.value=O.state.spotShadow,Tt.rectAreaLights.value=O.state.rectArea,Tt.ltc_1.value=O.state.rectAreaLTC1,Tt.ltc_2.value=O.state.rectAreaLTC2,Tt.pointLights.value=O.state.point,Tt.pointLightShadows.value=O.state.pointShadow,Tt.hemisphereLights.value=O.state.hemi,Tt.directionalShadowMap.value=O.state.directionalShadowMap,Tt.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Tt.spotShadowMap.value=O.state.spotShadowMap,Tt.spotLightMatrix.value=O.state.spotLightMatrix,Tt.spotLightMap.value=O.state.spotLightMap,Tt.pointShadowMap.value=O.state.pointShadowMap,Tt.pointShadowMatrix.value=O.state.pointShadowMatrix),G.currentProgram=Lt,G.uniformsList=null,Lt}function Wl(S){if(S.uniformsList===null){const F=S.currentProgram.getUniforms();S.uniformsList=Wr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function Xl(S,F){const k=pt.get(S);k.outputColorSpace=F.outputColorSpace,k.batching=F.batching,k.batchingColor=F.batchingColor,k.instancing=F.instancing,k.instancingColor=F.instancingColor,k.instancingMorph=F.instancingMorph,k.skinning=F.skinning,k.morphTargets=F.morphTargets,k.morphNormals=F.morphNormals,k.morphColors=F.morphColors,k.morphTargetsCount=F.morphTargetsCount,k.numClippingPlanes=F.numClippingPlanes,k.numIntersection=F.numClipIntersection,k.vertexAlphas=F.vertexAlphas,k.vertexTangents=F.vertexTangents,k.toneMapping=F.toneMapping}function hd(S,F,k,G,O){F.isScene!==!0&&(F=Dt),zt.resetTextureUnits();const Q=F.fog,ht=G.isMeshStandardMaterial?F.environment:null,mt=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:ds,dt=(G.isMeshStandardMaterial?ve:we).get(G.envMap||ht),Ct=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Lt=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Tt=!!k.morphAttributes.position,kt=!!k.morphAttributes.normal,Qt=!!k.morphAttributes.color;let me=ei;G.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(me=M.toneMapping);const he=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,se=he!==void 0?he.length:0,Rt=pt.get(G),fe=f.state.lights;if(Y===!0&&(ot===!0||S!==b)){const ze=S===b&&G.id===x;st.setState(G,S,ze)}let Xt=!1;G.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==fe.state.version||Rt.outputColorSpace!==mt||O.isBatchedMesh&&Rt.batching===!1||!O.isBatchedMesh&&Rt.batching===!0||O.isBatchedMesh&&Rt.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Rt.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Rt.instancing===!1||!O.isInstancedMesh&&Rt.instancing===!0||O.isSkinnedMesh&&Rt.skinning===!1||!O.isSkinnedMesh&&Rt.skinning===!0||O.isInstancedMesh&&Rt.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Rt.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Rt.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Rt.instancingMorph===!1&&O.morphTexture!==null||Rt.envMap!==dt||G.fog===!0&&Rt.fog!==Q||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==st.numPlanes||Rt.numIntersection!==st.numIntersection)||Rt.vertexAlphas!==Ct||Rt.vertexTangents!==Lt||Rt.morphTargets!==Tt||Rt.morphNormals!==kt||Rt.morphColors!==Qt||Rt.toneMapping!==me||Rt.morphTargetsCount!==se)&&(Xt=!0):(Xt=!0,Rt.__version=G.version);let qe=Rt.currentProgram;Xt===!0&&(qe=Js(G,F,O));let Ai=!1,je=!1,ms=!1;const pe=qe.getUniforms(),en=Rt.uniforms;if(St.useProgram(qe.program)&&(Ai=!0,je=!0,ms=!0),G.id!==x&&(x=G.id,je=!0),Ai||b!==S){St.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),pe.setValue(L,"projectionMatrix",S.projectionMatrix),pe.setValue(L,"viewMatrix",S.matrixWorldInverse);const Ve=pe.map.cameraPosition;Ve!==void 0&&Ve.setValue(L,Et.setFromMatrixPosition(S.matrixWorld)),jt.logarithmicDepthBuffer&&pe.setValue(L,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&pe.setValue(L,"isOrthographic",S.isOrthographicCamera===!0),b!==S&&(b=S,je=!0,ms=!0)}if(O.isSkinnedMesh){pe.setOptional(L,O,"bindMatrix"),pe.setOptional(L,O,"bindMatrixInverse");const ze=O.skeleton;ze&&(ze.boneTexture===null&&ze.computeBoneTexture(),pe.setValue(L,"boneTexture",ze.boneTexture,zt))}O.isBatchedMesh&&(pe.setOptional(L,O,"batchingTexture"),pe.setValue(L,"batchingTexture",O._matricesTexture,zt),pe.setOptional(L,O,"batchingIdTexture"),pe.setValue(L,"batchingIdTexture",O._indirectTexture,zt),pe.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&pe.setValue(L,"batchingColorTexture",O._colorsTexture,zt));const nn=k.morphAttributes;if((nn.position!==void 0||nn.normal!==void 0||nn.color!==void 0)&&tt.update(O,k,qe),(je||Rt.receiveShadow!==O.receiveShadow)&&(Rt.receiveShadow=O.receiveShadow,pe.setValue(L,"receiveShadow",O.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(en.envMap.value=dt,en.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&F.environment!==null&&(en.envMapIntensity.value=F.environmentIntensity),je&&(pe.setValue(L,"toneMappingExposure",M.toneMappingExposure),Rt.needsLights&&ud(en,ms),Q&&G.fog===!0&&K.refreshFogUniforms(en,Q),K.refreshMaterialUniforms(en,G,H,Z,f.state.transmissionRenderTarget[S.id]),Wr.upload(L,Wl(Rt),en,zt)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Wr.upload(L,Wl(Rt),en,zt),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&pe.setValue(L,"center",O.center),pe.setValue(L,"modelViewMatrix",O.modelViewMatrix),pe.setValue(L,"normalMatrix",O.normalMatrix),pe.setValue(L,"modelMatrix",O.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const ze=G.uniformsGroups;for(let Ve=0,pa=ze.length;Ve<pa;Ve++){const ai=ze[Ve];Ft.update(ai,qe),Ft.bind(ai,qe)}}return qe}function ud(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function dd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(S,F,k){const G=pt.get(S);G.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),pt.get(S.texture).__webglTexture=F,pt.get(S.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:k,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){const k=pt.get(S);k.__webglFramebuffer=F,k.__useDefaultFramebuffer=F===void 0};const fd=L.createFramebuffer();this.setRenderTarget=function(S,F=0,k=0){D=S,A=F,P=k;let G=!0,O=null,Q=!1,ht=!1;if(S){const dt=pt.get(S);if(dt.__useDefaultFramebuffer!==void 0)St.bindFramebuffer(L.FRAMEBUFFER,null),G=!1;else if(dt.__webglFramebuffer===void 0)zt.setupRenderTarget(S);else if(dt.__hasExternalTextures)zt.rebindTextures(S,pt.get(S.texture).__webglTexture,pt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Tt=S.depthTexture;if(dt.__boundDepthTexture!==Tt){if(Tt!==null&&pt.has(Tt)&&(S.width!==Tt.image.width||S.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");zt.setupDepthRenderbuffer(S)}}const Ct=S.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(ht=!0);const Lt=pt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Lt[F])?O=Lt[F][k]:O=Lt[F],Q=!0):S.samples>0&&zt.useMultisampledRTT(S)===!1?O=pt.get(S).__webglMultisampledFramebuffer:Array.isArray(Lt)?O=Lt[k]:O=Lt,y.copy(S.viewport),U.copy(S.scissor),N=S.scissorTest}else y.copy(_t).multiplyScalar(H).floor(),U.copy(Nt).multiplyScalar(H).floor(),N=ie;if(k!==0&&(O=fd),St.bindFramebuffer(L.FRAMEBUFFER,O)&&G&&St.drawBuffers(S,O),St.viewport(y),St.scissor(U),St.setScissorTest(N),Q){const dt=pt.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,dt.__webglTexture,k)}else if(ht){const dt=F;for(let Ct=0;Ct<S.textures.length;Ct++){const Lt=pt.get(S.textures[Ct]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ct,Lt.__webglTexture,k,dt)}}else if(S!==null&&k!==0){const dt=pt.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,dt.__webglTexture,k)}x=-1},this.readRenderTargetPixels=function(S,F,k,G,O,Q,ht,mt=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=pt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ht!==void 0&&(dt=dt[ht]),dt){St.bindFramebuffer(L.FRAMEBUFFER,dt);try{const Ct=S.textures[mt],Lt=Ct.format,Tt=Ct.type;if(!jt.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!jt.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-G&&k>=0&&k<=S.height-O&&(S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt),L.readPixels(F,k,G,O,xt.convert(Lt),xt.convert(Tt),Q))}finally{const Ct=D!==null?pt.get(D).__webglFramebuffer:null;St.bindFramebuffer(L.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(S,F,k,G,O,Q,ht,mt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=pt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ht!==void 0&&(dt=dt[ht]),dt)if(F>=0&&F<=S.width-G&&k>=0&&k<=S.height-O){St.bindFramebuffer(L.FRAMEBUFFER,dt);const Ct=S.textures[mt],Lt=Ct.format,Tt=Ct.type;if(!jt.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!jt.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const kt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,kt),L.bufferData(L.PIXEL_PACK_BUFFER,Q.byteLength,L.STREAM_READ),S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+mt),L.readPixels(F,k,G,O,xt.convert(Lt),xt.convert(Tt),0);const Qt=D!==null?pt.get(D).__webglFramebuffer:null;St.bindFramebuffer(L.FRAMEBUFFER,Qt);const me=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Bm(L,me,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,kt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Q),L.deleteBuffer(kt),L.deleteSync(me),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,k=0){const G=Math.pow(2,-k),O=Math.floor(S.image.width*G),Q=Math.floor(S.image.height*G),ht=F!==null?F.x:0,mt=F!==null?F.y:0;zt.setTexture2D(S,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,ht,mt,O,Q),St.unbindTexture()};const pd=L.createFramebuffer(),md=L.createFramebuffer();this.copyTextureToTexture=function(S,F,k=null,G=null,O=0,Q=null){Q===null&&(O!==0?(rs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Q=O,O=0):Q=0);let ht,mt,dt,Ct,Lt,Tt,kt,Qt,me;const he=S.isCompressedTexture?S.mipmaps[Q]:S.image;if(k!==null)ht=k.max.x-k.min.x,mt=k.max.y-k.min.y,dt=k.isBox3?k.max.z-k.min.z:1,Ct=k.min.x,Lt=k.min.y,Tt=k.isBox3?k.min.z:0;else{const nn=Math.pow(2,-O);ht=Math.floor(he.width*nn),mt=Math.floor(he.height*nn),S.isDataArrayTexture?dt=he.depth:S.isData3DTexture?dt=Math.floor(he.depth*nn):dt=1,Ct=0,Lt=0,Tt=0}G!==null?(kt=G.x,Qt=G.y,me=G.z):(kt=0,Qt=0,me=0);const se=xt.convert(F.format),Rt=xt.convert(F.type);let fe;F.isData3DTexture?(zt.setTexture3D(F,0),fe=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(zt.setTexture2DArray(F,0),fe=L.TEXTURE_2D_ARRAY):(zt.setTexture2D(F,0),fe=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);const Xt=L.getParameter(L.UNPACK_ROW_LENGTH),qe=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ai=L.getParameter(L.UNPACK_SKIP_PIXELS),je=L.getParameter(L.UNPACK_SKIP_ROWS),ms=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,he.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,he.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ct),L.pixelStorei(L.UNPACK_SKIP_ROWS,Lt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Tt);const pe=S.isDataArrayTexture||S.isData3DTexture,en=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){const nn=pt.get(S),ze=pt.get(F),Ve=pt.get(nn.__renderTarget),pa=pt.get(ze.__renderTarget);St.bindFramebuffer(L.READ_FRAMEBUFFER,Ve.__webglFramebuffer),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,pa.__webglFramebuffer);for(let ai=0;ai<dt;ai++)pe&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pt.get(S).__webglTexture,O,Tt+ai),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pt.get(F).__webglTexture,Q,me+ai)),L.blitFramebuffer(Ct,Lt,ht,mt,kt,Qt,ht,mt,L.DEPTH_BUFFER_BIT,L.NEAREST);St.bindFramebuffer(L.READ_FRAMEBUFFER,null),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(O!==0||S.isRenderTargetTexture||pt.has(S)){const nn=pt.get(S),ze=pt.get(F);St.bindFramebuffer(L.READ_FRAMEBUFFER,pd),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,md);for(let Ve=0;Ve<dt;Ve++)pe?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,nn.__webglTexture,O,Tt+Ve):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,nn.__webglTexture,O),en?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,ze.__webglTexture,Q,me+Ve):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ze.__webglTexture,Q),O!==0?L.blitFramebuffer(Ct,Lt,ht,mt,kt,Qt,ht,mt,L.COLOR_BUFFER_BIT,L.NEAREST):en?L.copyTexSubImage3D(fe,Q,kt,Qt,me+Ve,Ct,Lt,ht,mt):L.copyTexSubImage2D(fe,Q,kt,Qt,Ct,Lt,ht,mt);St.bindFramebuffer(L.READ_FRAMEBUFFER,null),St.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else en?S.isDataTexture||S.isData3DTexture?L.texSubImage3D(fe,Q,kt,Qt,me,ht,mt,dt,se,Rt,he.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(fe,Q,kt,Qt,me,ht,mt,dt,se,he.data):L.texSubImage3D(fe,Q,kt,Qt,me,ht,mt,dt,se,Rt,he):S.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Q,kt,Qt,ht,mt,se,Rt,he.data):S.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Q,kt,Qt,he.width,he.height,se,he.data):L.texSubImage2D(L.TEXTURE_2D,Q,kt,Qt,ht,mt,se,Rt,he);L.pixelStorei(L.UNPACK_ROW_LENGTH,Xt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,qe),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ai),L.pixelStorei(L.UNPACK_SKIP_ROWS,je),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ms),Q===0&&F.generateMipmaps&&L.generateMipmap(fe),St.unbindTexture()},this.copyTextureToTexture3D=function(S,F,k=null,G=null,O=0){return rs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,F,k,G,O)},this.initRenderTarget=function(S){pt.get(S).__webglFramebuffer===void 0&&zt.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?zt.setTextureCube(S,0):S.isData3DTexture?zt.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?zt.setTexture2DArray(S,0):zt.setTexture2D(S,0),St.unbindTexture()},this.resetState=function(){A=0,P=0,D=null,St.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}const Uh={type:"change"},Bl={type:"start"},td={type:"end"},Pr=new ua,Dh=new Kn,fx=Math.cos(70*Uu.DEG2RAD),ye=new C,We=2*Math.PI,ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ao=1e-6;class px extends Cg{constructor(t,e=null){super(t,e),this.state=ne.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:is.ROTATE,MIDDLE:is.DOLLY,RIGHT:is.PAN},this.touches={ONE:es.ROTATE,TWO:es.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Ei,this._lastTargetPosition=new C,this._quat=new Ei().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rh,this._sphericalDelta=new rh,this._scale=1,this._panOffset=new C,this._rotateStart=new bt,this._rotateEnd=new bt,this._rotateDelta=new bt,this._panStart=new bt,this._panEnd=new bt,this._panDelta=new bt,this._dollyStart=new bt,this._dollyEnd=new bt,this._dollyDelta=new bt,this._dollyDirection=new C,this._mouse=new bt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=gx.bind(this),this._onPointerDown=mx.bind(this),this._onPointerUp=_x.bind(this),this._onContextMenu=Ex.bind(this),this._onMouseWheel=xx.bind(this),this._onKeyDown=yx.bind(this),this._onTouchStart=Sx.bind(this),this._onTouchMove=bx.bind(this),this._onMouseDown=vx.bind(this),this._onMouseMove=Mx.bind(this),this._interceptControlDown=wx.bind(this),this._interceptControlUp=Tx.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Uh),this.update(),this.state=ne.NONE}update(t=null){const e=this.object.position;ye.copy(e).sub(this.target),ye.applyQuaternion(this._quat),this._spherical.setFromVector3(ye),this.autoRotate&&this.state===ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=We:n>Math.PI&&(n-=We),s<-Math.PI?s+=We:s>Math.PI&&(s-=We),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ye.setFromSpherical(this._spherical),ye.applyQuaternion(this._quatInverse),e.copy(this.target).add(ye),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=ye.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new C(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=ye.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Pr.origin.copy(this.object.position),Pr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Pr.direction))<fx?this.object.lookAt(this.target):(Dh.setFromNormalAndCoplanarPoint(this.object.up,this.target),Pr.intersectPlane(Dh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ao||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ao||this._lastTargetPosition.distanceToSquared(this.target)>ao?(this.dispatchEvent(Uh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?We/60*this.autoRotateSpeed*t:We/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ye.setFromMatrixColumn(e,0),ye.multiplyScalar(-t),this._panOffset.add(ye)}_panUp(t,e){this.screenSpacePanning===!0?ye.setFromMatrixColumn(e,1):(ye.setFromMatrixColumn(e,0),ye.crossVectors(this.object.up,ye)),ye.multiplyScalar(t),this._panOffset.add(ye)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ye.copy(s).sub(this.target);let r=ye.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(We*this._rotateDelta.x/e.clientHeight),this._rotateUp(We*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(We*this._rotateDelta.x/e.clientHeight),this._rotateUp(We*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new bt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function mx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function gx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function _x(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(td),this.state=ne.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function vx(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case is.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ne.DOLLY;break;case is.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}break;case is.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(Bl)}function Mx(i){switch(this.state){case ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function xx(i){this.enabled===!1||this.enableZoom===!1||this.state!==ne.NONE||(i.preventDefault(),this.dispatchEvent(Bl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(td))}function yx(i){this.enabled!==!1&&this._handleKeyDown(i)}function Sx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case es.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ne.TOUCH_ROTATE;break;case es.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ne.TOUCH_PAN;break;default:this.state=ne.NONE}break;case 2:switch(this.touches.TWO){case es.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ne.TOUCH_DOLLY_PAN;break;case es.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ne.TOUCH_DOLLY_ROTATE;break;default:this.state=ne.NONE}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(Bl)}function bx(i){switch(this._trackPointer(i),this.state){case ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ne.NONE}}function Ex(i){this.enabled!==!1&&i.preventDefault()}function wx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Tx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Ih=new An,Lr=new C;class ed extends Eg{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new re(t,3)),this.setAttribute("uv",new re(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new dl(e,6,1);return this.setAttribute("instanceStart",new En(n,3,0)),this.setAttribute("instanceEnd",new En(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new dl(e,6,1);return this.setAttribute("instanceColorStart",new En(n,3,0)),this.setAttribute("instanceColorEnd",new En(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new gg(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Ih.setFromBufferAttribute(e),this.boundingBox.union(Ih))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Lr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Lr)),Lr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Lr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}at.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new bt(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Ye.line={uniforms:Pl.merge([at.common,at.fog,at.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class zl extends Hn{constructor(t){super({type:"LineMaterial",uniforms:Pl.clone(Ye.line.uniforms),vertexShader:Ye.line.vertexShader,fragmentShader:Ye.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const oo=new Wt,Nh=new C,Fh=new C,Ce=new Wt,Pe=new Wt,mn=new Wt,lo=new C,co=new Zt,Ue=new Rg,Oh=new C,Ur=new An,Dr=new kn,gn=new Wt;let yn,Si;function Bh(i,t,e){return gn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),gn.multiplyScalar(1/gn.w),gn.x=Si/e.width,gn.y=Si/e.height,gn.applyMatrix4(i.projectionMatrixInverse),gn.multiplyScalar(1/gn.w),Math.abs(Math.max(gn.x,gn.y))}function Ax(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){Ue.start.fromBufferAttribute(s,a),Ue.end.fromBufferAttribute(r,a),Ue.applyMatrix4(e);const c=new C,u=new C;yn.distanceSqToSegment(Ue.start,Ue.end,u,c),u.distanceTo(c)<Si*.5&&t.push({point:u,pointOnLine:c,distance:yn.origin.distanceTo(u),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function Rx(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,u=Math.min(a.instanceCount,l.count),h=-t.near;yn.at(1,mn),mn.w=1,mn.applyMatrix4(t.matrixWorldInverse),mn.applyMatrix4(n),mn.multiplyScalar(1/mn.w),mn.x*=r.x/2,mn.y*=r.y/2,mn.z=0,lo.copy(mn),co.multiplyMatrices(t.matrixWorldInverse,o);for(let d=0,p=u;d<p;d++){if(Ce.fromBufferAttribute(l,d),Pe.fromBufferAttribute(c,d),Ce.w=1,Pe.w=1,Ce.applyMatrix4(co),Pe.applyMatrix4(co),Ce.z>h&&Pe.z>h)continue;if(Ce.z>h){const E=Ce.z-Pe.z,M=(Ce.z-h)/E;Ce.lerp(Pe,M)}else if(Pe.z>h){const E=Pe.z-Ce.z,M=(Pe.z-h)/E;Pe.lerp(Ce,M)}Ce.applyMatrix4(n),Pe.applyMatrix4(n),Ce.multiplyScalar(1/Ce.w),Pe.multiplyScalar(1/Pe.w),Ce.x*=r.x/2,Ce.y*=r.y/2,Pe.x*=r.x/2,Pe.y*=r.y/2,Ue.start.copy(Ce),Ue.start.z=0,Ue.end.copy(Pe),Ue.end.z=0;const g=Ue.closestPointToPointParameter(lo,!0);Ue.at(g,Oh);const m=Uu.lerp(Ce.z,Pe.z,g),f=m>=-1&&m<=1,w=lo.distanceTo(Oh)<Si*.5;if(f&&w){Ue.start.fromBufferAttribute(l,d),Ue.end.fromBufferAttribute(c,d),Ue.start.applyMatrix4(o),Ue.end.applyMatrix4(o);const E=new C,M=new C;yn.distanceSqToSegment(Ue.start,Ue.end,M,E),e.push({point:M,pointOnLine:E,distance:yn.origin.distanceTo(M),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}class Cx extends Se{constructor(t=new ed,e=new zl({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)Nh.fromBufferAttribute(e,o),Fh.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Nh.distanceTo(Fh);const r=new dl(s,2,1);return t.setAttribute("instanceDistanceStart",new En(r,1,0)),t.setAttribute("instanceDistanceEnd",new En(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;yn=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;Si=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),Dr.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=Si*.5;else{const h=Math.max(s.near,Dr.distanceToPoint(yn.origin));c=Bh(s,h,l.resolution)}if(Dr.radius+=c,yn.intersectsSphere(Dr)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Ur.copy(a.boundingBox).applyMatrix4(o);let u;if(n)u=Si*.5;else{const h=Math.max(s.near,Ur.distanceToPoint(yn.origin));u=Bh(s,h,l.resolution)}Ur.expandByScalar(u),yn.intersectsBox(Ur)!==!1&&(n?Ax(this,e):Rx(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(oo),this.material.uniforms.resolution.value.set(oo.z,oo.w))}}class nd extends ed{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}setFromPoints(t){const e=t.length-1,n=new Float32Array(6*e);for(let s=0;s<e;s++)n[6*s]=t[s].x,n[6*s+1]=t[s].y,n[6*s+2]=t[s].z||0,n[6*s+3]=t[s+1].x,n[6*s+4]=t[s+1].y,n[6*s+5]=t[s+1].z||0;return super.setPositions(n),this}fromLine(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}}class Px extends Cx{constructor(t=new nd,e=new zl({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}}let ho=null;function uo(){if(ho)return ho;const i=128,t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.18,"rgba(255,235,190,0.95)"),n.addColorStop(.45,"rgba(255,182,72,0.35)"),n.addColorStop(.75,"rgba(255,140,40,0.08)"),n.addColorStop(1,"rgba(255,120,20,0)"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new Ul(t);return s.colorSpace=Be,ho=s,s}let fo=null;function Lx(){if(fo)return fo;const i=512,t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,i*.05,i/2,i/2,i*.5);n.addColorStop(0,"#111a23"),n.addColorStop(.55,"#0b1118"),n.addColorStop(.9,"#070b10"),n.addColorStop(1,"#05080b"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new Ul(t);return s.colorSpace=Be,fo=s,s}const ji=[[0,[3,6,10]],[.22,[10,38,54]],[.48,[40,140,160]],[.7,[255,166,60]],[.88,[255,214,140]],[1,[255,248,230]]];function Ux(i){const t=Math.max(0,Math.min(1,i));for(let e=1;e<ji.length;e++)if(t<=ji[e][0]){const[n,s]=ji[e-1],[r,o]=ji[e],a=(t-n)/(r-n);return[s[0]+(o[0]-s[0])*a,s[1]+(o[1]-s[1])*a,s[2]+(o[2]-s[2])*a]}return ji[ji.length-1][1]}function zh(i){i.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const n=e.material;if(Array.isArray(n))n.forEach(s=>s.dispose());else if(n){for(const s of Object.values(n))s instanceof Ie&&s.dispose();n.dispose()}})}const _n=64,Hh=95,rn=2.6,Ir={scene:{position:new C(66,56,86),target:new C(0,3,0)},plan:{position:new C(0,84,.01),target:new C(0,0,0)},field:{position:new C(0,132,.01),target:new C(0,0,0)}};class Dx{constructor(t,e){this.canvas=t,this.stage=e,this.renderer=new dx({canvas:t,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.outputColorSpace=Be,this.renderer.toneMapping=yu,this.renderer.toneMappingExposure=1.12,this.camera=new Je(42,1,1,2400),this.camera.position.copy(Ir.scene.position),this.controls=new px(this.camera,t),this.controls.target.copy(Ir.scene.target),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.minDistance=45,this.controls.maxDistance=460,this.controls.maxPolarAngle=Math.PI*.495,this.controls.enablePan=!0,this.controls.update(),this.scene.add(new xg(12376319,1708552,1));const n=new bg(16773596,1.7);n.position.set(80,150,90),this.scene.add(n);const s=new Ja(4106440,220,220,2);s.position.set(-50,40,-40),this.scene.add(s),this.beadLight=new Ja(16758344,0,90,2),this.beadLight.position.set(0,12,0),this.scene.add(this.beadLight),this.buildTable(),this.buildArray(),this.scene.add(this.table,this.arrayGroup,this.painting,this.beams);const r=64;this.tailPositions=new Float32Array(r*3),this.tailColors=new Float32Array(r*3);const o=new ee;o.setAttribute("position",new De(this.tailPositions,3)),o.setAttribute("color",new De(this.tailColors,3)),this.tail=new wr(o,new Ns({size:5.2,map:uo(),vertexColors:!0,transparent:!0,opacity:.95,blending:Mn,depthWrite:!1,sizeAttenuation:!0})),this.tail.frustumCulled=!1,this.tail.visible=!1,this.scene.add(this.tail),this.bead=new cg(new Vu({map:uo(),color:16765578,transparent:!0,blending:Mn,depthWrite:!1})),this.bead.scale.setScalar(9),this.bead.visible=!1,this.scene.add(this.bead),this.fieldPlane=new Se(new Ks(126,126),new gi({transparent:!0,opacity:.82,blending:Mn,depthWrite:!1,side:un})),this.fieldPlane.rotation.x=-Math.PI/2,this.fieldPlane.position.y=.32,this.fieldPlane.visible=!1,this.scene.add(this.fieldPlane);const a=new ee,l=new Float32Array(260*3);for(let u=0;u<260;u++){const h=20+Math.random()*95,d=Math.random()*Math.PI*2;l[u*3]=Math.cos(d)*h,l[u*3+1]=8+Math.random()*110,l[u*3+2]=Math.sin(d)*h}a.setAttribute("position",new De(l,3)),this.atmosphere=new wr(a,new Ns({color:16761963,size:.5,transparent:!0,opacity:.34,blending:Mn,depthWrite:!1})),this.scene.add(this.atmosphere),this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),new ResizeObserver(()=>this.resize()).observe(e),this.resize(),this.lastTime=performance.now(),this.animate=this.animate.bind(this),this.frameHandle=requestAnimationFrame(this.animate)}canvas;stage;renderer;scene=new lg;camera;controls;table=new Jn;arrayGroup=new Jn;painting=new Jn;beams=new Jn;atmosphere;bead;beadLight;fieldPlane;fieldTexture=null;figureLine=null;trapLine=null;devicePoints=null;simLine=null;targetLine=null;tail;tailPositions;tailColors;plan=null;view="scene";cameraTween=null;onResize;frameHandle=0;visible=!0;lastTime=0;fps=0;fpsAccum=0;fpsFrames=0;onStats=null;buildTable(){const t=new Se(new Dl(_n,128),new ja({map:Lx(),roughness:.82,metalness:.18}));t.rotation.x=-Math.PI/2,this.table.add(t);const e=new Se(new Il(_n-.7,_n+.2,160),new gi({color:16758344,transparent:!0,opacity:.18,side:un}));e.rotation.x=-Math.PI/2,e.position.y=.15,this.table.add(e);const n=new _i({color:2899275,transparent:!0,opacity:.36});for(let o=10;o<_n;o+=10){const a=[];for(let l=0;l<=128;l++){const c=l/128*Math.PI*2;a.push(new C(Math.cos(c)*o,.18,Math.sin(c)*o))}this.table.add(new Is(new ee().setFromPoints(a),n))}const s=[];for(let o=0;o<24;o++){const a=o/24*Math.PI*2;s.push(new C(0,.18,0),new C(Math.cos(a)*_n,.18,Math.sin(a)*_n))}this.table.add(new qa(new ee().setFromPoints(s),n));const r=new _i({color:16758344,transparent:!0,opacity:.18});this.table.add(new qa(new ee().setFromPoints([new C(-_n,.2,0),new C(_n,.2,0),new C(0,.2,-_n),new C(0,.2,_n)]),r))}buildArray(){this.arrayGroup.position.y=Hh;const t=new Se(new aa(52,52,3.2,96),new ja({color:1055525,metalness:.72,roughness:.34,transparent:!0,opacity:.86,emissive:463644,emissiveIntensity:1}));t.position.y=4,this.arrayGroup.add(t);const e=new Se(new oa(52,.55,8,160),new gi({color:16758344,transparent:!0,opacity:.7}));e.rotation.x=Math.PI/2,e.position.y=2.4,this.arrayGroup.add(e);const n=new Se(new oa(34,.22,6,128),new gi({color:6674663,transparent:!0,opacity:.35}));n.rotation.x=Math.PI/2,n.position.y=2.3,this.arrayGroup.add(n);const s=new aa(2.1,2.1,3.4,14),r=new ja({color:3359826,metalness:.85,roughness:.3}),o=new dg(s,r,xn.length),a=new Zt;xn.forEach(([p,_],g)=>{a.makeTranslation(p,.6,_),o.setMatrixAt(g,a)}),o.instanceMatrix.needsUpdate=!0,this.arrayGroup.add(o);const l=new Float32Array(xn.length*3);xn.forEach(([p,_],g)=>{l[g*3]=p,l[g*3+1]=0,l[g*3+2]=_});const c=new ee;c.setAttribute("position",new De(l,3)),this.arrayGroup.add(new wr(c,new Ns({color:6674663,size:3.1,map:uo(),transparent:!0,opacity:.8,blending:Mn,depthWrite:!1}))),[16724e3,2162528,2117887,16769216].forEach((p,_)=>{const g=new Se(new Nl(1.5,16,12),new gi({color:p})),m=_/4*Math.PI*2+Math.PI/4;g.position.set(Math.cos(m)*47,2.3,Math.sin(m)*47),this.arrayGroup.add(g),this.arrayGroup.add(new Ja(p,6,22,2).translateX(g.position.x).translateZ(g.position.z))});const h=new _i({color:16761963,transparent:!0,opacity:.02,blending:Mn,depthWrite:!1}),d=[];for(const[p,_]of xn)d.push(new C(p,0,_),new C(p*.25,-rn-40,_*.25));this.beams.add(new qa(new ee().setFromPoints(d),h)),this.beams.position.y=Hh-2}setPlan(t){if(this.plan=t,this.clearPlanObjects(),!t){this.bead.visible=!1,this.tail.visible=!1;return}const e=t.beadX.length,n=new Float32Array((e+1)*3),s=new Float32Array((e+1)*3);for(let d=0;d<e;d++){n[d*3]=t.beadX[d]*1e3,n[d*3+1]=rn,n[d*3+2]=t.beadY[d]*1e3;const p=t.ledR[d]+t.ledG[d]+t.ledB[d]>6;s[d*3]=(p?t.ledR[d]/255:.35)**1.1,s[d*3+1]=(p?t.ledG[d]/255:.38)**1.1,s[d*3+2]=(p?t.ledB[d]/255:.42)**1.1}n[e*3]=n[0],n[e*3+1]=rn,n[e*3+2]=n[2],s[e*3]=s[0],s[e*3+1]=s[1],s[e*3+2]=s[2];const r=new nd;r.setPositions(n),r.setColors(s);const o=new zl({vertexColors:!0,linewidth:2.9,transparent:!0,opacity:.72,blending:Mn,depthWrite:!1});o.resolution.set(this.canvas.clientWidth||1,this.canvas.clientHeight||1),this.figureLine=new Px(r,o),this.figureLine.frustumCulled=!1,this.painting.add(this.figureLine);const a=[];for(let d=0;d<t.trapX.length;d+=2)a.push(new C(t.trapX[d]*1e3,rn-1.2,t.trapY[d]*1e3));a.push(a[0]?.clone()??new C);const l=new ee().setFromPoints(a);this.trapLine=new Is(l,new Mg({color:11122627,dashSize:1.7,gapSize:1.4,transparent:!0,opacity:.34,depthWrite:!1})),this.trapLine.computeLineDistances(),this.painting.add(this.trapLine);const c=new Float32Array(t.points.length*3);t.points.forEach((d,p)=>{c[p*3]=d.xUm/1e3,c[p*3+1]=rn+.4,c[p*3+2]=d.yUm/1e3});const u=new ee;if(u.setAttribute("position",new De(c,3)),this.devicePoints=new wr(u,new Ns({color:16758344,size:1.5,transparent:!0,opacity:.55,blending:Mn,depthWrite:!1})),this.painting.add(this.devicePoints),t.simBeadX&&t.simBeadY){const d=[];for(let p=0;p<t.simBeadX.length;p+=3)d.push(new C(t.simBeadX[p]*1e3,rn+.9,t.simBeadY[p]*1e3));this.simLine=new Is(new ee().setFromPoints(d),new _i({color:16777215,transparent:!0,opacity:.42,depthWrite:!1})),this.painting.add(this.simLine)}const h=[];for(let d=0;d<t.targetX.length;d++)h.push(new C(t.targetX[d]*1e3,rn+1.4,t.targetY[d]*1e3));h.length>1&&(h.push(h[0].clone()),this.targetLine=new Is(new ee().setFromPoints(h),new _i({color:6674663,transparent:!0,opacity:.16,depthWrite:!1})),this.painting.add(this.targetLine)),this.setProgress(0,!1)}clearPlanObjects(){for(const t of[this.figureLine,this.trapLine,this.devicePoints,this.simLine,this.targetLine])t&&(t.parent?.remove(t),zh(t));this.figureLine=null,this.trapLine=null,this.devicePoints=null,this.simLine=null,this.targetLine=null}setLiveTarget(t,e,n=!0){this.bead.position.set(t,rn+.6,e),this.bead.visible=n,this.beadLight.position.set(t,rn+4,e),this.beadLight.intensity=n?26:0,this.beadLight.color.setRGB(1,.72,.3)}setProgress(t,e){if(!this.plan)return;const n=this.plan.beadX.length;if(n===0)return;const s=Math.max(0,Math.min(n-1,Math.floor(t*n))),r=this.plan.beadX[s]*1e3,o=this.plan.beadY[s]*1e3;this.bead.position.set(r,rn+.6,o),this.bead.visible=e||t>0,this.beadLight.position.set(r,rn+4,o),this.beadLight.intensity=e?26:8,this.beadLight.color.setRGB(1,.72,.3);const a=this.tailPositions.length/3;if(!e){this.tail.visible=!1;return}this.tail.visible=!0;for(let c=0;c<a;c++){const u=(s-c*2+n*2)%n;this.tailPositions[c*3]=this.plan.beadX[u]*1e3,this.tailPositions[c*3+1]=rn+.7,this.tailPositions[c*3+2]=this.plan.beadY[u]*1e3;const h=(1-c/a)**1.7,d=this.plan.ledR[u]/255,p=this.plan.ledG[u]/255,_=this.plan.ledB[u]/255;this.tailColors[c*3]=(d*.8+.2)*h,this.tailColors[c*3+1]=(p*.8+.2)*h,this.tailColors[c*3+2]=(_*.8+.2)*h}const l=this.tail.geometry;l.getAttribute("position").needsUpdate=!0,l.getAttribute("color").needsUpdate=!0}setField(t){if(this.fieldTexture&&(this.fieldTexture.dispose(),this.fieldTexture=null),!t){this.fieldPlane.visible=!1;return}const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d"),s=n.createImageData(t.width,t.height);for(let a=0;a<t.height;a++)for(let l=0;l<t.width;l++){const c=t.values[(t.height-1-a)*t.width+l],[u,h,d]=Ux(c),p=(a*t.width+l)*4;s.data[p]=u,s.data[p+1]=h,s.data[p+2]=d,s.data[p+3]=255}n.putImageData(s,0,0);const r=new Ul(e);r.colorSpace=Be,r.minFilter=on,r.magFilter=on;const o=this.fieldPlane.material;o.map=r,o.needsUpdate=!0,this.fieldTexture=r,this.fieldPlane.visible=this.view==="field"}setView(t){this.view=t,this.arrayGroup.visible=t==="scene",this.beams.visible=t==="scene",this.fieldPlane.visible=t==="field"&&!!this.fieldTexture,this.figureLine&&(this.figureLine.material.opacity=t==="field"?.44:.62),this.startCameraTween(Ir[t]),t!=="scene"?this.controls.enableRotate=!1:this.controls.enableRotate=!0}startCameraTween(t){this.cameraTween={from:{position:this.camera.position.clone(),target:this.controls.target.clone()},to:{position:t.position.clone(),target:t.target.clone()},t:0}}resetView(){this.setView(this.view==="field"||this.view==="plan"?"scene":this.view),this.startCameraTween(Ir[this.view])}setVisible(t){this.visible!==t&&(this.visible=t,cancelAnimationFrame(this.frameHandle),t&&(this.lastTime=performance.now(),this.frameHandle=requestAnimationFrame(this.animate)))}resize(){const t=this.stage.clientWidth,e=this.stage.clientHeight;t===0||e===0||(this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.figureLine&&this.figureLine.material.resolution.set(t,e))}animate(t){const e=Math.min(.05,(t-this.lastTime)/1e3);if(this.lastTime=t,this.fpsAccum+=e,this.fpsFrames++,this.fpsAccum>=.5&&(this.fps=this.fpsFrames/this.fpsAccum,this.fpsAccum=0,this.fpsFrames=0,this.onStats?.(this.fps)),this.cameraTween){this.cameraTween.t=Math.min(1,this.cameraTween.t+e*1.9);const n=this.cameraTween.t,s=1-(1-n)**3;this.camera.position.lerpVectors(this.cameraTween.from.position,this.cameraTween.to.position,s),this.controls.target.lerpVectors(this.cameraTween.from.target,this.cameraTween.to.target,s),n>=1&&(this.cameraTween=null)}this.view==="scene"&&(this.atmosphere.rotation.y+=e*.014),this.controls.update(),this.visible&&(this.renderer.render(this.scene,this.camera),this.frameHandle=requestAnimationFrame(this.animate))}dispose(){cancelAnimationFrame(this.frameHandle),window.removeEventListener("resize",this.onResize),this.controls.dispose(),this.renderer.dispose(),zh(this.scene)}}const id={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};const sd=([i,t,e])=>{const n=document.createElementNS("http://www.w3.org/2000/svg",i);return Object.keys(t).forEach(s=>{n.setAttribute(s,String(t[s]))}),e?.length&&e.forEach(s=>{const r=sd(s);n.appendChild(r)}),n},Ix=(i,t={})=>{const n={...id,...t};return sd(["svg",n,i])};const Nx=(...i)=>i.filter((t,e,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===e).join(" ").trim();const Fx=i=>{for(const t in i)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};const Ox=i=>{let t="",e=!1;for(const n of i){if(n==="-"||n==="_"||n<=" "){e=t.length>0;continue}t.length===0?t+=n.toLowerCase():t+=e?n.toUpperCase():n,e=!1}return t};const Bx=i=>{const t=Ox(i);return t.charAt(0).toUpperCase()+t.slice(1)};const zx=i=>Array.from(i.attributes).reduce((t,e)=>(t[e.name]=e.value,t),{}),kh=i=>typeof i=="string"?i:!i||!i.class?"":i.class&&typeof i.class=="string"?i.class.split(" "):i.class&&Array.isArray(i.class)?i.class:"",Gh=(i,{nameAttr:t,icons:e,attrs:n})=>{const s=i.getAttribute(t);if(s==null)return;const r=Bx(s),o=e[r];if(!o)return console.warn(`${i.outerHTML} icon name was not found in the provided icons object.`);const a=zx(i),l=Fx(a)?{}:{"aria-hidden":"true"},c={...id,"data-lucide":s,...l,...n,...a},u=kh(a),h=kh(n),d=Nx("lucide",`lucide-${s}`,...u,...h);d&&Object.assign(c,{class:d});const p=Ix(o,c);return i.parentNode?.replaceChild(p,i)};const Hx=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]];const kx=[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]];const Gx=[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]];const Vx=[["path",{d:"M2 10v3"}],["path",{d:"M6 6v11"}],["path",{d:"M10 3v18"}],["path",{d:"M14 8v7"}],["path",{d:"M18 5v13"}],["path",{d:"M22 10v3"}]];const Wx=[["path",{d:"M12 5v16"}],["path",{d:"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]];const Xx=[["path",{d:"M20 6 9 17l-5-5"}]];const Yx=[["circle",{cx:"12",cy:"12",r:"1"}],["circle",{cx:"12",cy:"12",r:"10"}]];const $x=[["path",{d:"M15.6 2.7a10 10 0 1 0 5.7 5.7"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M13.4 10.6 19 5"}]];const qx=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}],["path",{d:"M12 17h.01"}]];const jx=[["circle",{cx:"12",cy:"12",r:"10"}]];const Kx=[["path",{d:"M12 20v2"}],["path",{d:"M12 2v2"}],["path",{d:"M17 20v2"}],["path",{d:"M17 2v2"}],["path",{d:"M2 12h2"}],["path",{d:"M2 17h2"}],["path",{d:"M2 7h2"}],["path",{d:"M20 12h2"}],["path",{d:"M20 17h2"}],["path",{d:"M20 7h2"}],["path",{d:"M7 20v2"}],["path",{d:"M7 2v2"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1"}]];const Zx=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];const Jx=[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]];const Qx=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]];const ty=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]];const ey=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"}],["circle",{cx:"12",cy:"8",r:"2"}],["path",{d:"M12 10v12"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"}]];const ny=[["circle",{cx:"12",cy:"12",r:"3"}],["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]];const iy=[["path",{d:"m12 14 4-4"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0"}]];const sy=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"}]];const ry=[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}]];const ay=[["path",{d:"M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8"}]];const oy=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];const ly=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]];const cy=[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12"}]];const hy=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]];const uy=[["path",{d:"M15 3h6v6"}],["path",{d:"m21 3-7 7"}],["path",{d:"m3 21 7-7"}],["path",{d:"M9 21H3v-6"}]];const dy=[["path",{d:"M5 12h14"}]];const fy=[["path",{d:"m14.622 17.897-10.68-2.913"}],["path",{d:"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"}],["path",{d:"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"}]];const py=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor"}]];const my=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}],["path",{d:"m16 15-3-3 3-3"}]];const gy=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}],["path",{d:"m14 9 3 3-3 3"}]];const _y=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1"}]];const vy=[["path",{d:"M13 21h8"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}]];const My=[["path",{d:"m18 13-.654-4.736a4 4 0 00-2.756-3.266l-9.163-2.9a2 2 0 00-2.017.493l-.82.819a2 2 0 00-.492 2.017l2.9 9.163a4 4 0 003.266 2.756L13 18"}],["path",{d:"M18.648 12.352a1.205 1.205 0 011.704 0l1.296 1.296a1.205 1.205 0 010 1.704l-6.296 6.296a1.205 1.205 0 01-1.704 0l-1.296-1.296a1.205 1.205 0 010-1.704z"}],["path",{d:"m3 3 6.586 6.586"}],["circle",{cx:"11",cy:"11",r:"2"}]];const xy=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];const yy=[["path",{d:"M12 22v-5"}],["path",{d:"M15 8V2"}],["path",{d:"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"}],["path",{d:"M9 8V2"}]];const Sy=[["path",{d:"M12 2v10"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04"}]];const by=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478"}],["circle",{cx:"12",cy:"12",r:"2"}]];const Ey=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]];const wy=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]];const Ty=[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"}],["path",{d:"m14.5 12.5 2-2"}],["path",{d:"m11.5 9.5 2-2"}],["path",{d:"m8.5 6.5 2-2"}],["path",{d:"m17.5 15.5 2-2"}]];const Ay=[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}],["path",{d:"M7 12h10"}]];const Ry=[["path",{d:"M14 17H5"}],["path",{d:"M19 7h-9"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]];const Cy=[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]];const Py=[["path",{d:"M10 5H3"}],["path",{d:"M12 19H3"}],["path",{d:"M14 3v4"}],["path",{d:"M16 17v4"}],["path",{d:"M21 12h-9"}],["path",{d:"M21 19h-5"}],["path",{d:"M21 5h-7"}],["path",{d:"M8 10v4"}],["path",{d:"M8 12H3"}]];const Ly=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];const Uy=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];const Dy=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}]];const Iy=[["line",{x1:"10",x2:"14",y1:"2",y2:"2"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11"}],["circle",{cx:"12",cy:"14",r:"8"}]];const Ny=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];const Fy=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"}]];const Oy=[["path",{d:"M12 4v16"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"}],["path",{d:"M9 20h6"}]];const By=[["path",{d:"m19 5 3-3"}],["path",{d:"m2 22 3-3"}],["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"}],["path",{d:"M7.5 13.5 10 11"}],["path",{d:"M10.5 16.5 13 14"}],["path",{d:"m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"}]];const zy=[["path",{d:"M12 3v12"}],["path",{d:"m17 8-5-5-5 5"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]];const Hy=[["circle",{cx:"10",cy:"7",r:"1"}],["circle",{cx:"4",cy:"20",r:"1"}],["path",{d:"M4.7 19.3 19 5"}],["path",{d:"m21 3-3 1 2 2Z"}],["path",{d:"M9.26 7.68 5 12l2 5"}],["path",{d:"m10 14 5 2 3.5-3.5"}],["path",{d:"m18 12 1-1 1 1-1 1Z"}]];const ky=[["path",{d:"M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z"}],["path",{d:"m16.5 14.5 5-5"}],["path",{d:"m16.5 9.5 5 5"}]];const Gy=[["path",{d:"M2 12q2.5 2 5 0t5 0 5 0 5 0"}],["path",{d:"M2 19q2.5 2 5 0t5 0 5 0 5 0"}],["path",{d:"M2 5q2.5 2 5 0t5 0 5 0 5 0"}]];const Vy=[["path",{d:"M12 20h.01"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764"}],["path",{d:"m2 2 20 20"}]];const Wy=[["path",{d:"M12 20h.01"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0"}]];const Xy=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];const Yy=[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]];const rd=({icons:i={},nameAttr:t="data-lucide",attrs:e={},root:n=document,inTemplates:s}={})=>{if(!Object.values(i).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof n>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(n.querySelectorAll(`[${t}]`)).forEach(o=>Gh(o,{nameAttr:t,icons:i,attrs:e})),s&&Array.from(n.querySelectorAll("template")).forEach(a=>rd({icons:i,nameAttr:t,attrs:e,root:a.content,inTemplates:s})),t==="data-lucide"){const o=n.querySelectorAll("[icon-name]");o.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(o).forEach(a=>Gh(a,{nameAttr:"icon-name",icons:i,attrs:e})))}},$y={Activity:Hx,ArrowDown:kx,ArrowUp:Gx,AudioLines:Vx,BookOpen:Wx,Check:Xx,Circle:jx,CircleDot:Yx,CircleGauge:$x,CircleHelp:qx,Cpu:Kx,Download:Zx,ExternalLink:Jx,Eye:ty,EyeOff:Qx,Flower2:ey,Focus:ny,Gauge:iy,Heart:sy,Hexagon:ry,Infinity:ay,Info:oy,Layers:ly,Link2:cy,Loader2:hy,Maximize2:uy,Minus:dy,Paintbrush:fy,Palette:py,PanelLeftClose:my,PanelLeftOpen:gy,Pause:_y,PenLine:vy,PenTool:My,Play:xy,Plug:yy,Power:Sy,Radio:by,RefreshCw:Ey,RotateCcw:wy,Ruler:Ty,ScanLine:Ay,Settings2:Ry,Shapes:Cy,SlidersHorizontal:Py,Sparkles:Ly,Square:Uy,Star:Dy,Timer:Iy,Triangle:Fy,TriangleAlert:Ny,Type:Oy,Unplug:By,Upload:zy,Usb:Hy,VolumeX:ky,Waves:Gy,Wifi:Wy,WifiOff:Vy,X:Xy,Zap:Yy};function ni(i=document){rd({icons:$y,root:i,attrs:{"stroke-width":"1.7"}})}function le(i){const t=i.format??(o=>String(Math.round(o*100)/100)),e=j("span",{class:"control-value"}),n=j("input",{type:"range",min:String(i.min),max:String(i.max),step:String(i.step),value:String(i.value),attrs:{"aria-label":i.label}}),s=(o,a=!1)=>{const l=(o-i.min)/(i.max-i.min)*100;if(n.style.setProperty("--fill",`${Math.max(0,Math.min(100,l))}%`),Zi(e),e.append(t(o)),i.unit&&e.append(j("span",{text:i.unit})),!a){const c=Number(n.value);i.onInput?.(c)}};n.addEventListener("input",()=>s(Number(n.value))),n.addEventListener("change",()=>i.onChange?.(Number(n.value)));const r=j("div",{class:"control"},j("div",{class:"control-head"},j("label",{class:"control-label",text:i.label}),e),n,i.hint?j("p",{class:"section-note",text:i.hint}):null);return s(i.value,!0),{root:r,input:n,setValue(o,a=!0){n.value=String(o),s(o,a)},setDisabled(o){n.disabled=o,r.classList.toggle("is-disabled",o)}}}function Ls(i){const t=j("input",{type:"checkbox",class:"switch-input",attrs:{"aria-label":i.label}});return t.checked=i.checked,t.addEventListener("change",()=>i.onChange(t.checked)),{root:j("div",{class:"control switch-control"},j("div",{class:"switch-copy"},j("span",{class:"control-label",text:i.label}),i.hint?j("p",{class:"section-note",text:i.hint}):null),j("label",{class:"switch"},t,j("span",{class:"switch-track"}))),input:t,setChecked(n){t.checked=n}}}function Nr(i,t,e,n=""){const s=j("div",{class:`segmented ${n}`.trim(),attrs:{role:"group"}}),r=i.map(a=>{const l=j("button",{type:"button",text:a.label,title:a.title??a.label,class:a.value===t?"is-active":""});return l.addEventListener("click",()=>{l.classList.contains("is-active")||(o(a.value),e(a.value))}),s.append(l),{option:a,button:l}}),o=a=>{for(const{option:l,button:c}of r)c.classList.toggle("is-active",l.value===a)};return{root:s,setValue:o}}function jn(i,...t){return j("section",{class:`control-section ${i.className??""}`.trim()},j("div",{class:"section-head"},j("h2",{text:i.title}),i.actions??j("span",{class:"eyebrow",text:i.eyebrow??""})),...t)}function Le(i,t={}){const e=["btn"];t.variant==="primary"?e.push("btn-primary"):t.variant==="danger"?e.push("btn-danger"):t.variant==="ghost"?e.push("btn-ghost"):t.variant==="small"?e.push("btn-small"):t.variant==="small-primary"&&e.push("btn-small","btn-primary"),t.block&&e.push("btn-block");const n=j("button",{type:"button",class:e.join(" "),title:t.title??i,attrs:t.disabled?{disabled:!0}:{}},t.icon?ls(t.icon,14):null,j("span",{text:i}));return t.onClick&&n.addEventListener("click",t.onClick),n}const qy={circle:{icon:"circle",label:"圆"},square:{icon:"square",label:"方"},triangle:{icon:"triangle",label:"三角"},hexagon:{icon:"hexagon",label:"六边"},star:{icon:"star",label:"星"},heart:{icon:"heart",label:"心"},rose:{icon:"flower-2",label:"玫瑰"},lissajous:{icon:"waves",label:"李萨如"},infinity:{icon:"infinity",label:"无穷"},text:{icon:"type",label:"文字"}};function jy(i,t,e){const n=j("div",{class:"shape-grid",attrs:{role:"group","aria-label":"图形"}}),s=new Map;for(const r of i){const o=qy[r]??{icon:"circle-dot",label:r},a=j("button",{type:"button",class:r===t?"shape-btn is-active":"shape-btn",title:o.label},ls(o.icon,17),j("span",{text:o.label}));a.addEventListener("click",()=>e(r)),s.set(r,a),n.append(a)}return{root:n,setActive(r){for(const[o,a]of s)a.classList.toggle("is-active",o===r)}}}function Vh(i,t,e){const n=j("input",{type:"color",value:uc(t),attrs:{"aria-label":i}}),s=j("span",{class:"mono",text:uc(t).toUpperCase()});return n.addEventListener("input",()=>{const r=Df(n.value);s.textContent=n.value.toUpperCase(),e(r)}),j("label",{class:"swatch-input",title:`${i} 颜色`},n,`${i} `,s)}function Ky(i,t={}){const e=j("input",{class:"text-input",type:"text",value:i,placeholder:t.placeholder??"",spellcheck:!1,autocomplete:"off",attrs:{maxlength:t.maxLength??24,"aria-label":t.ariaLabel??"文字"}});return e.addEventListener("change",()=>t.onCommit?.(e.value)),e.addEventListener("keydown",n=>{n.key==="Enter"&&(e.blur(),t.onCommit?.(e.value))}),e}class Wh{values=new Map;constructor(t,e){t.innerHTML="";for(const n of e){const s=document.createTextNode("—"),r=j("small",{text:n.unit??""}),o=j("span",{class:"metric-value"},s,r),a=j("div",{class:`metric-card${n.accent?" is-accent":""}`},j("span",{class:"metric-label",text:n.label}),o);t.append(a),this.values.set(n.key,{text:s,unit:r,card:a,def:n})}}update(t,e=[],n=[]){for(const[s,r]of this.values){const o=t[s],a=r.def.digits??(typeof o=="number"?Math.abs(o)>=100?0:Math.abs(o)>=10?1:2:0);r.text.textContent=typeof o=="number"?Xe(o,a):o??"—",r.unit.textContent=r.def.unit??"",r.card.classList.toggle("is-warn",e.includes(s)),r.card.classList.toggle("is-danger",n.includes(s))}}}function Zy(i,t){i.innerHTML="";for(const e of t){const n=j("dl",{class:"readout-grid"});for(const s of e.rows)n.append(j("dt",{text:s.label}),j("dd",{class:s.state?`is-${s.state}`:"",text:s.value}));i.append(j("div",{class:"readout-section"},j("div",{class:"readout-title"},j("span",{text:e.title}),e.meta?j("em",{text:e.meta}):null),n))}}function Jy(i){const t=[[/^needs (\d+)% of the modelled trap force at ([\d.]+) Hz:.*$/,"$2 Hz 时模型需要 $1% 的陷阱力：前导饱和，小球会滞后或甩出。降低刷新率、提高绘制强度，或先做 Spin 标定。"],[/^LOST: at the modelled lateral strength the simulated bead lags the trap by ([\d.]+) mm \(> ([\d.]+) mm, the escape radius\).*$/,"LOST：仿真小球滞后陷阱 $1 mm（逃逸半径 $2 mm），会掉球。降低刷新率、提高绘制强度，或提高横向强度。"],[/^at risk: the bead escapes in the simulation if the trap is (\d+)% weaker than modelled.*$/,"风险：如果实际陷阱比模型弱 $1%，仿真小球会逃出。建议做 Spin 标定或留出刷新率余量。"],[/^simulated bead is pushed ([\d.]+) mm off the trap, near the force peak \(([\d.]+) mm\) where it slips and bends the trail.*$/,"仿真小球被推离陷阱 $1 mm，接近力峰（$2 mm），会打滑并弯折轨迹。降低刷新率或提高绘制强度。"],[/^shape distortion up to ([\d.]+) mm if the lateral strength is (\d+)% off; the spin test calibrates it$/,"横向强度偏差 $2% 时形状误差可达 $1 mm；Spin 标定可以校准。"],[/^device interpolation error ([\d.]+) mm: the path needs more than (\d+) points - slow it down or shrink it$/,"设备插值误差 $1 mm：路径需要多于 $2 个点。放慢刷新或缩小图形。"],[/^refresh ([\d.]+) Hz is below persistence of vision; use a long camera exposure or a smaller shape$/,"刷新率 $1 Hz 低于视觉暂留阈值；请用长曝光拍摄，或缩小图形。"],[/^the figure reaches ([\d.]+) mm off the array axis, where the trap keeps only (\d+)% of its force; centre or shrink it to draw faster$/,"图形最远到达距阵列轴 $1 mm，那里陷阱只剩 $2% 的力；把图形移到中心或缩小可以画得更快。"],[/^the trap is too weak for motion at this level \(model\): raise the draw level or the lateral strength$/,"这个强度下模型认为陷阱不足以运动：提高绘制强度或横向强度。"]];for(const[e,n]of t)if(e.test(i))return i.replace(e,n);return i}function po(i,t,e="模型检查通过：轨迹在陷阱能力范围内"){if(i.innerHTML="",t.length===0){i.append(j("div",{class:"warning-empty"},ls("check",13),j("span",{text:e}))),ni(i);return}for(const n of t){const s=/^(LOST|at risk)/i.test(n);i.append(j("div",{class:`warning-item${s?" is-bad":""}`},j("span",{text:Jy(n)})))}}class Qy{constructor(t,e=60){this.container=t,this.limit=e}container;limit;lines=[];add(t,e="info"){const n=new Date,s=`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`;this.lines.push({time:s,text:t,kind:e}),this.lines.length>this.limit&&this.lines.shift(),this.render()}clear(){this.lines.length=0,this.render()}render(){this.container.innerHTML="";for(const t of[...this.lines].reverse())this.container.append(j("div",{class:`log-line is-${t.kind}`},j("time",{text:t.time}),j("span",{text:t.text})))}}function Fr(i,t,e,n){i.hidden=!e,t&&n&&(t.textContent=n)}const tS="#65d8e7",eS="#ffb648",nS="rgba(255,255,255,0.075)",Xr="rgba(183,196,207,0.62)",ad="rgba(127,142,156,0.8)",od="10px ui-monospace, SFMono-Regular, Consolas, monospace";function ld(i){const t=i.clientWidth,e=i.clientHeight;if(t<8||e<8)return null;const n=Math.min(window.devicePixelRatio||1,2),s=Math.round(t*n),r=Math.round(e*n);(i.width!==s||i.height!==r)&&(i.width=s,i.height=r);const o=i.getContext("2d");return o?(o.setTransform(n,0,0,n,0,0),o.clearRect(0,0,t,e),{ctx:o,width:t,height:e}):null}function Xh(i,t,e,n,s=1.2){if(t.length!==0){i.beginPath(),i.strokeStyle=n,i.lineWidth=s,i.lineJoin="round";for(let r=0;r<t.length;r++)r===0?i.moveTo(e[r],t[r]):i.lineTo(e[r],t[r]);i.stroke()}}function iS(i,t,e=0){const n=ld(i);if(!n)return;const{ctx:s,width:r,height:o}=n,a=34,l=30,c=10,u=17,h=r-a-l,d=o-c-u;if(h<10||d<10)return;s.fillStyle="rgba(255,255,255,0.018)",s.fillRect(a,c,h,d),s.strokeStyle=nS,s.lineWidth=1,s.fillStyle=Xr,s.font=od,s.textAlign="right",s.textBaseline="middle";for(let x=0;x<=4;x++){const b=c+d*x/4;s.beginPath(),s.moveTo(a,b),s.lineTo(a+h,b),s.stroke()}if(!t||t.speed.length===0){s.fillStyle=ad,s.textAlign="center",s.fillText("无规划数据",a+h/2,c+d/2);return}let p=0,_=0;for(let x=0;x<t.speed.length;x++)t.speed[x]>p&&(p=t.speed[x]),t.accel[x]>_&&(_=t.accel[x]);const g=t.raw?1e-9:1;p=Math.max(p*1e3*1.12,g),_=Math.max(_*1.12,g);const m=t.speed.length,f=t.periodS*1e3,w=new Float64Array(m),E=new Float64Array(m),M=new Float64Array(m);for(let x=0;x<m;x++)w[x]=a+h*x/(m-1||1),E[x]=c+d-t.speed[x]*1e3*d/p,M[x]=c+d-t.accel[x]*d/_;const R=s.createLinearGradient(0,c,0,c+d);R.addColorStop(0,"rgba(101,216,231,0.22)"),R.addColorStop(1,"rgba(101,216,231,0)"),s.beginPath(),s.moveTo(w[0],c+d);for(let x=0;x<m;x++)s.lineTo(w[x],E[x]);s.lineTo(w[m-1],c+d),s.closePath(),s.fillStyle=R,s.fill(),Xh(s,M,w,"rgba(255,182,72,0.72)",1),Xh(s,E,w,tS,1.6),s.fillStyle=Xr,s.textAlign="right",s.textBaseline="top";const A=p>=10?p.toFixed(0):p>=.1?p.toFixed(2):p.toExponential(1);s.fillText(A,a-6,c),s.fillStyle="rgba(101,216,231,0.75)",s.fillText("mm/s",a-6,c+11),s.textAlign="left",s.fillStyle="rgba(255,182,72,0.78)";const P=t.raw?"0":_>=1?_.toFixed(0):_.toExponential(1);s.fillText(t.raw?"a 0":`${P} m/s²`,a+h+5,c),s.fillStyle=Xr,s.textAlign="center",s.textBaseline="top",s.fillText("0",a,c+d+4),s.fillText(t.raw?an(f/2):`${(f/2).toFixed(0)}`,a+h/2,c+d+4),s.fillText(t.raw?an(f):`${f.toFixed(0)} ms`,a+h,c+d+4);const D=a+h*Math.max(0,Math.min(1,e));s.strokeStyle="rgba(255,255,255,0.36)",s.setLineDash([2,3]),s.beginPath(),s.moveTo(D,c),s.lineTo(D,c+d),s.stroke(),s.setLineDash([]),s.fillStyle=eS,s.beginPath(),s.arc(D,c+d-t.accel[Math.min(m-1,Math.floor(e*m))]/_*d,2,0,Math.PI*2),s.fill()}function sS(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;const r=(a,l,c=1)=>{for(let u=0;u<a.length;u+=c){const h=a[u]*1e3,d=l[u]*1e3;h<t&&(t=h),h>e&&(e=h),d<n&&(n=d),d>s&&(s=d)}};if(r(i.targetX,i.targetY),r(i.trapX,i.trapY,2),r(i.beadX,i.beadY,2),!Number.isFinite(t))return{minX:-10,maxX:10,minY:-10,maxY:10};const o=Math.max(2,(e-t)*.08,(s-n)*.08);return{minX:t-o,maxX:e+o,minY:n-o,maxY:s+o}}function rS(i,t,e=0){const n=ld(i);if(!n)return;const{ctx:s,width:r,height:o}=n,a=16,l=14,c=r-a*2,u=o-a*2-l;if(c<10||u<10)return;if(s.fillStyle="rgba(255,255,255,0.016)",s.fillRect(a,a,c,u),!t){s.fillStyle=ad,s.textAlign="center",s.textBaseline="middle",s.fillText("无规划数据",r/2,o/2);return}const h=sS(t),d=Math.min(c/(h.maxX-h.minX),u/(h.maxY-h.minY)),p=a+c/2,_=a+u/2,g=(h.minX+h.maxX)/2,m=(h.minY+h.maxY)/2,f=y=>p+(y-g)*d,w=y=>_-(y-m)*d,E=Math.max(h.maxX-h.minX,h.maxY-h.minY),M=E>60?20:E>30?10:5;s.strokeStyle="rgba(255,255,255,0.05)",s.lineWidth=1;for(let y=Math.ceil(h.minX/M)*M;y<=h.maxX;y+=M)s.beginPath(),s.moveTo(f(y),w(h.minY)),s.lineTo(f(y),w(h.maxY)),s.stroke();for(let y=Math.ceil(h.minY/M)*M;y<=h.maxY;y+=M)s.beginPath(),s.moveTo(f(h.minX),w(y)),s.lineTo(f(h.maxX),w(y)),s.stroke();const R=t.beadX.length;s.lineWidth=3.4,s.lineCap="round";for(let y=0;y<R;y++){const U=(y+1)%R;if(t.ledR[y]+t.ledG[y]+t.ledB[y]<6)continue;const N=.34;s.strokeStyle=`rgba(${Math.round(t.ledR[y])},${Math.round(t.ledG[y])},${Math.round(t.ledB[y])},${N})`,s.beginPath(),s.moveTo(f(t.beadX[y]*1e3),w(t.beadY[y]*1e3)),s.lineTo(f(t.beadX[U]*1e3),w(t.beadY[U]*1e3)),s.stroke()}const A=Math.floor(e*R),P=Math.max(6,Math.floor(R*.12));s.lineWidth=2.2;for(let y=0;y<P;y++){const U=(A-y+R*2)%R,N=(U+1)%R;t.ledR[U]+t.ledG[U]+t.ledB[U]<6||(s.strokeStyle=`rgb(${Math.round(t.ledR[U])},${Math.round(t.ledG[U])},${Math.round(t.ledB[U])})`,s.beginPath(),s.moveTo(f(t.beadX[U]*1e3),w(t.beadY[U]*1e3)),s.lineTo(f(t.beadX[N]*1e3),w(t.beadY[N]*1e3)),s.stroke())}s.strokeStyle="rgba(170,184,196,0.42)",s.lineWidth=1,s.setLineDash([3,4]),s.beginPath();for(let y=0;y<t.trapX.length;y+=2){const U=f(t.trapX[y]*1e3),N=w(t.trapY[y]*1e3);y===0?s.moveTo(U,N):s.lineTo(U,N)}s.closePath(),s.stroke(),s.setLineDash([]),s.fillStyle="rgba(255,182,72,0.5)";for(const y of t.points)s.fillRect(f(y.xUm/1e3)-.8,w(y.yUm/1e3)-.8,1.6,1.6);if(t.simBeadX&&t.simBeadY){s.strokeStyle="rgba(255,255,255,0.6)",s.lineWidth=.8,s.beginPath();for(let y=0;y<t.simBeadX.length;y+=2){const U=f(t.simBeadX[y]*1e3),N=w(t.simBeadY[y]*1e3);y===0?s.moveTo(U,N):s.lineTo(U,N)}s.stroke()}if(R>0){const y=Math.min(R-1,Math.max(0,Math.floor(e*R))),U=f(t.beadX[y]*1e3),N=w(t.beadY[y]*1e3),B=s.createRadialGradient(U,N,0,U,N,9);B.addColorStop(0,"rgba(255,255,255,0.95)"),B.addColorStop(.3,"rgba(255,214,138,0.7)"),B.addColorStop(1,"rgba(255,182,72,0)"),s.fillStyle=B,s.beginPath(),s.arc(U,N,9,0,Math.PI*2),s.fill()}const D=M,x=D*d,b=o-7;s.strokeStyle="rgba(255,255,255,0.4)",s.lineWidth=1,s.beginPath(),s.moveTo(r-a-x,b),s.lineTo(r-a,b),s.stroke(),s.fillStyle=Xr,s.font=od,s.textAlign="center",s.textBaseline="bottom",s.fillText(`${D} mm`,r-a-x/2,b-2)}let Ki=null;function aS(){return Ki||(Ki=document.getElementById("toastStack")),Ki||(Ki=j("div",{class:"toast-stack",id:"toastStack"}),document.body.append(Ki)),Ki}function ge(i,t="info",e=2800){const n=aS(),s=t==="ok"?"check":t==="error"?"triangle-alert":"info",r=j("div",{class:`toast is-${t}`,attrs:{role:"status"}},ls(s,14),j("span",{text:i}));for(n.append(r),ni(r);n.children.length>4;)n.firstElementChild?.remove();window.setTimeout(()=>{r.classList.add("is-leaving"),window.setTimeout(()=>r.remove(),260)},e)}const Yh=[...Object.keys(Qr),"text"],mo={circle:"圆",square:"方",triangle:"三角",hexagon:"六边",star:"五角星",heart:"心形",rose:"玫瑰线",lissajous:"李萨如",infinity:"无穷",text:"文字"};function Ht(i){const t=document.getElementById(i);if(!t)throw new Error(`missing element #${i}`);return t}class oS{constructor(t,e,n,s){this.host=t,this.devices=e,this.client=n,this.ui=s,this.cfg=t.cfg,this.selectedShape=Yh.includes(s.displayShape)?s.displayShape:"circle",this.view=s.displayView,this.speed=s.speed||1,this.log=new Qy(Ht("displayLog")),this.metrics=this.createMetrics(),this.scene=new Dx(Ht("displayCanvas"),Ht("displayStage")),this.scene.onStats=m=>this.host.setFps(m),this.levelFill=j("i"),this.levelCaption=j("div",{class:"level-caption"}),this.loading=Ht("displayLoading"),this.loadingText=Ht("displayLoadingText"),this.stageError=Ht("displayStageError"),this.loopFill=Ht("displayLoopFill"),this.clock=Ht("displayClock"),this.paletteStrip=j("div",{class:"palette-strip"}),this.resizeObserver=new ResizeObserver(()=>this.drawCharts(this.phase)),this.resizeObserver.observe(Ht("displayMetrics")),this.resizeObserver.observe(Ht("speedChart").parentElement);const r=this.buildModeSection(),o=this.buildTrapSection(),a=this.buildShapeSection(),l=this.buildColourSection(),c=this.buildMotionSection(),u=this.buildHoloSection(),h=this.buildUlmSection(),d=this.buildConfigSection();Ht("displayControls").append(r.root,o.root,a.root,l.root,c.root,u,h,d),ni(Ht("displayControls")),this.levelSlider=o.level,this.lateralSlider=c.lateral,this.refreshSlider=c.refresh,this.cxSlider=a.cx,this.cySlider=a.cy,this.normalMotion=c.normal,this.motionRoot=c.root,this.rawMotion=r.raw,this.liveX=r.liveX,this.liveY=r.liveY,this.liveSpeed=r.liveSpeed,this.liveAccel=r.liveAccel,this.rawActual=r.rawActual,this.unlimitedToggle=r.toggle,this.spanEl=a.span,this.textRow=a.textRow,this.textField=a.textField,this.shapeGridHandle=a.grid,this.spinButton=o.spin,this.playButton=Ht("displayPlay");const p=Le("规划",{icon:"scan-line",variant:"primary",onClick:()=>{this.replan(!0)}});this.stickyPlay=Le("播放",{icon:"play",onClick:()=>{this.togglePlayback()}});const _=Le("停止",{icon:"square",onClick:()=>{this.stopPlayback()}}),g=Ht("displayRail");g.insertBefore(j("div",{class:"rail-actions"},p,this.stickyPlay,_),g.querySelector(".rail-foot")),this.syncUnlimitedUi(),this.syncPatternUi(),this.bindHud(),this.bindPlayback(),this.syncShapeUi(),this.updateLevelMeter(),this.syncSpeedSelect(),this.applyView(this.view,!1),this.log.add("工作区就绪 · 规则来自原 Python 实现","ok"),this.log.add(this.devices.isDemo?"演示硬件已加载（未连接真实设备）":`已连接 ${this.devices.state.label}`,"info"),this.pollTimer=window.setInterval(()=>{this.pollStatus()},700)}host;devices;client;ui;cfg;log;metrics;scene;plan=null;session=null;sessionVersion=-1;selectedShape;view;playing=!1;phase=0;speed;lastFrame=0;raf=0;lastChart=0;planSeq=0;planning=!1;pendingPlan=!1;lastStatus=null;pollTimer=0;pollBusy=!1;fieldCache=new Map;fieldSeq=0;spinArmed=!1;lastDeviceVersion=-1;visible=!1;levelSlider;lateralSlider;refreshSlider;cxSlider;cySlider;liveLevel=255;liveSpeedNow=0;realtime=!1;autoLevitated=!1;liveSending=!1;livePending=!1;liveSaveTimer=0;liveHudAt=0;live=new op(()=>({speedMmS:this.cfg.unlimited.speedMmS,accelMmS2:this.cfg.unlimited.accelMmS2}),t=>this.onLiveMove(t),35);normalMotion;motionRoot;rawMotion;liveX;liveY;liveSpeed;liveAccel;rawActual;unlimitedToggle;spanEl;textRow;textField;shapeGridHandle;levelFill;levelCaption;spinButton;playButton;stickyPlay;loading;loadingText;stageError;loopFill;clock;paletteStrip;resizeObserver;patternSeg=null;patternRadiusSlider=null;patternSpanSlider=null;patternCaption=null;holoStatusEl=null;holoListEl=null;holoFrames=[];lastHolo=null;holoPreviewAt=0;lastFlags=0;buildTrapSection(){const t=this.cfg,e=le({label:"悬停强度",min:20,max:255,step:1,value:t.trap.level,unit:"/255",onInput:_=>{t.trap.level=Math.round(_),this.updateLevelMeter(),this.host.saveConfig()},onChange:_=>{const g=Math.round(_);t.trap.level=g,this.updateLevelMeter(),this.host.saveConfig(),this.session?.state===Ae.Hover&&this.session.setLevel(g).catch(m=>this.fail(m)),this.cfg.unlimited.enabled&&(this.liveLevel=g,this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi())}}),n=le({label:"绘制强度",min:0,max:255,step:1,value:t.planner.drawLevel,unit:"/255",hint:"0 = 沿用悬停强度；255 是满功率。",onInput:_=>{t.planner.drawLevel=Math.round(_)},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),s=j("div",{class:"level-meter"},this.levelFill),r=Nr(Object.keys(Yr).map(_=>({value:_,label:ga[_]??_,title:`${ga[_]??_} · trap_mode ${Yr[_]}`})),t.trap.field,_=>{t.trap.field=_,this.host.saveConfig(),this.syncPatternUi(),this.schedulePlan(!0),this.applyOutputConfig()},"segmented-wrap"),o=j("p",{class:"section-note"}),a=le({label:"图案半径",min:.5,max:20,step:.1,value:t.trap.patternRadiusMm,unit:"mm",hint:"环形 / 涡旋 / 双环的中心半径，双焦的间距；固件下限 0.5 mm。",onInput:_=>{t.trap.patternRadiusMm=_},onChange:()=>{this.host.saveConfig(),this.schedulePlan(!0),this.applyOutputConfig()}}),l=le({label:"涡旋相位跨度",min:0,max:255,step:1,value:t.trap.phaseSpan,unit:"/256",hint:"0 = 一整圈；只在涡旋（mode 4）下有效。",onInput:_=>{t.trap.phaseSpan=Math.round(_)},onChange:()=>{this.host.saveConfig(),this.schedulePlan(!0),this.applyOutputConfig()}});this.patternSeg=r,this.patternRadiusSlider=a,this.patternSpanSlider=l,this.patternCaption=o;const c=Le("起浮 / 接管",{icon:"power",variant:"primary",block:!0,onClick:()=>{this.levitate()}}),u=Le("落球",{icon:"arrow-down",onClick:()=>{this.dropBead()}}),h=Le("Spin 标定",{icon:"gauge",onClick:()=>{this.onSpin()}}),d=Le("急停",{icon:"zap",variant:"danger",title:"立即关场（E-STOP）",onClick:()=>{this.emergencyStop()}});return{root:jn({title:"声场与强度",eyebrow:"TRAP",actions:j("span",{class:"eyebrow",text:"MOTION v7.5"})},r.root,o,a.root,l.root,e.root,n.root,s,this.levelCaption,j("div",{class:"btn-row"},d),j("div",{class:"btn-row"},c),j("div",{class:"btn-row"},u,h),j("p",{class:"section-note",text:"先打开陷阱，再把泡沫小球放进声场。Spin 标定把横向强度写进配置。"})),level:e,drawLevel:n,spin:h}}buildShapeSection(){const t=this.cfg,e=jy(Yh,this.selectedShape,h=>this.selectShape(h)),n=Ky(t.display.text,{placeholder:"输入英文、数字或符号",ariaLabel:"文字内容",onCommit:h=>{t.display.text=h.toUpperCase(),this.selectedShape="text",this.ui.displayShape="text",this.shapeGridHandle.setActive("text"),this.syncShapeUi(),this.schedulePlan(!0)}}),s=j("div",{class:"inline-row"},n,Le("绘制",{variant:"small",onClick:()=>this.textField.blur()})),r=le({label:"图形尺寸",min:2,max:60,step:.5,value:t.display.sizeMm,unit:"mm",onInput:h=>{t.display.sizeMm=h},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),o=le({label:"文字高度",min:2,max:30,step:.5,value:t.display.textHeightMm,unit:"mm",onInput:h=>{t.display.textHeightMm=h},onChange:()=>{this.host.saveConfig(),this.selectedShape==="text"&&this.schedulePlan()}}),a=le({label:"中心 X",min:-35,max:35,step:.5,value:t.display.centerXMm,unit:"mm",onInput:h=>{t.display.centerXMm=h,t.unlimited.enabled&&this.applyLiveCenter()},onChange:()=>{this.host.saveConfig(),t.unlimited.enabled||this.schedulePlan()}}),l=le({label:"中心 Y",min:-35,max:35,step:.5,value:t.display.centerYMm,unit:"mm",onInput:h=>{t.display.centerYMm=h,t.unlimited.enabled&&this.applyLiveCenter()},onChange:()=>{this.host.saveConfig(),t.unlimited.enabled||this.schedulePlan()}});a.root.classList.add("center-duplicate"),l.root.classList.add("center-duplicate");const c=j("span",{class:"eyebrow",text:"SHAPE"});return{root:jn({title:"图形与摆放",eyebrow:"SHAPE",actions:c},e.root,s,r.root,o.root,a.root,l.root,j("p",{class:"section-note",text:"小图形画得更快；图形离阵列轴心越远，陷阱越弱。"})),grid:e,textRow:s,textField:n,span:c,cx:a,cy:l}}buildColourSection(){const t=this.cfg,e=Nr([{value:"wheel",label:"色轮"},{value:"gradient",label:"渐变"},{value:"solid",label:"单色"}],t.display.colorScheme,c=>{t.display.colorScheme=c,this.host.saveConfig(),this.schedulePlan()},"seg-wide"),n=j("div",{class:"swatch-row"},Vh("A",t.display.colorA,c=>{t.display.colorA=c,this.host.saveConfig()}),Vh("B",t.display.colorB,c=>{t.display.colorB=c,this.host.saveConfig()})),s=le({label:"颜色流动",min:0,max:1.55,step:.05,value:t.display.hueSpinRevS,unit:"rev/s",onInput:c=>{t.display.hueSpinRevS=c},onChange:()=>this.host.saveConfig()}),r=le({label:"亮度",min:0,max:1,step:.02,value:t.display.brightness,format:c=>`${Math.round(c*100)}`,unit:"%",onInput:c=>{t.display.brightness=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),o=le({label:"慢处调暗",min:0,max:1,step:.05,value:t.display.evenLines,format:c=>`${Math.round(c*100)}`,unit:"%",hint:"让拐角与笔画端点不过曝，整条线曝光一致。",onInput:c=>{t.display.evenLines=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),a=Le("实时上色",{icon:"palette",onClick:()=>{this.recolor()}});return{root:jn({title:"颜色与光",eyebrow:"COLOUR"},e.root,n,this.paletteStrip,s.root,r.root,o.root,j("div",{class:"btn-row"},a))}}buildModeSection(){const t=this.cfg,e=Ls({label:"解除所有限制",checked:t.unlimited.enabled,hint:"开启后自动起浮，中心 X/Y、手柄左摇杆与 WASD 直接实时下发，不走规划和播放。",onChange:u=>{this.setUnlimited(u).catch(h=>this.fail(h))}});e.input.id="unlimitedToggle";const n=j("div",{class:"raw-summary"}),s=le({label:"中心 X",min:-35,max:35,step:.1,value:t.display.centerXMm,unit:"mm",onInput:u=>{t.display.centerXMm=u,this.applyLiveCenter()},onChange:()=>this.host.saveConfig()});s.input.id="liveX";const r=le({label:"中心 Y",min:-35,max:35,step:.1,value:t.display.centerYMm,unit:"mm",onInput:u=>{t.display.centerYMm=u,this.applyLiveCenter()},onChange:()=>this.host.saveConfig()});r.input.id="liveY";const o=le({label:"移动速度",min:.01,max:50,step:.01,value:t.unlimited.speedMmS,unit:"mm/s",hint:"手柄左摇杆 / WASD 的目标速度；可播放中实时改。",onInput:u=>{t.unlimited.speedMmS=u,this.updateRawSummary()},onChange:()=>{this.host.saveConfig(),this.updateRawSummary(),this.realtime&&this.updateLiveUi()}});o.input.id="liveSpeed";const a=le({label:"加速度",min:.1,max:500,step:.1,value:t.unlimited.accelMmS2,unit:"mm/s²",hint:"速度向目标值逼近的加速度；越小越柔和。",onInput:u=>{t.unlimited.accelMmS2=u,this.updateRawSummary()},onChange:()=>{this.host.saveConfig(),this.updateRawSummary(),this.realtime&&this.updateLiveUi()}});a.input.id="liveAccel";const l=j("div",{class:"raw-group"},s.root,r.root,o.root,a.root,n,j("p",{class:"section-note",text:"开启即自动打开声场：修改中心 X/Y 会立即下发；Xbox 左摇杆或 WASD 以设定的速度/加速度连续移动。不生成路径、不需要规划或播放。"}));return{root:jn({title:"模式",eyebrow:"MODE"},e.root,l),raw:l,liveX:s,liveY:r,liveSpeed:o,liveAccel:a,rawActual:n,toggle:e}}buildMotionSection(){const t=this.cfg,e=le({label:"刷新率",min:0,max:100,step:.5,value:t.display.refreshHz,unit:"Hz",hint:"0 = 自动：在模型力用 60% 内取最快循环。",onInput:c=>{t.display.refreshHz=c},onChange:c=>{t.display.refreshHz=c,this.host.saveConfig(),this.schedulePlan()}}),n=le({label:"横向陷阱强度",min:5,max:3e3,step:1,value:qr(t),unit:"m/s²",hint:"255 级时测得的横向加速度；Spin 标定会自动写入。",onInput:c=>{ql(t,c)},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),s=le({label:"jerk 平滑窗口",min:0,max:30,step:.5,value:t.planner.jerkTimeMs,unit:"ms",onInput:c=>{t.planner.jerkTimeMs=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),r=le({label:"拐角圆角",min:0,max:6,step:.1,value:t.planner.cornerRadiusMm,unit:"mm",onInput:c=>{t.planner.cornerRadiusMm=c===0?.01:c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),o=Nr([{value:"catmull",label:"Catmull-Rom"},{value:"linear",label:"线性"}],t.planner.interpolation,c=>{t.planner.interpolation=c,this.host.saveConfig()},"seg-wide"),a=j("div",{class:"normal-motion"},e.root,n.root,s.root,r.root,o.root,j("p",{class:"section-note",text:"规划器做时间最优速度、抗共振滤波与前馈；仿真只给提示，不限制播放。"}));return{root:jn({title:"运动与预览",eyebrow:"MOTION"},a),lateral:n,refresh:e,normal:a}}syncPatternUi(){const t=Mi(this.cfg);if(this.patternSeg?.setValue(this.cfg.trap.field),this.patternSpanSlider?.setDisabled(t!==4),this.patternRadiusSlider?.setDisabled(t===0),this.patternCaption){const e=ga[this.cfg.trap.field]??this.cfg.trap.field,n=this.cfg.trap.phaseSpan===0?"整圈":`${this.cfg.trap.phaseSpan}/256`;this.patternCaption.textContent=t===0?`${e} · 固件 trap_mode 0（无图案偏移）`:`${e} · 固件 trap_mode ${t} · 半径 ${this.cfg.trap.patternRadiusMm.toFixed(1)} mm · 跨度 ${n}`}}async applyOutputConfig(){if(this.session)try{await this.session.applyOutputConfig()}catch(t){this.log.add(`声场参数下发失败：${String(t)}`,"warn")}}buildHoloSection(){const t=this.cfg,e=j("p",{class:"section-note"});this.holoStatusEl=e;const n=j("div",{class:"holo-list"});this.holoListEl=n;const s=j("select",{class:"mini-select holo-picker",attrs:{"aria-label":"添加全息关键帧"}});for(const m of[...Object.keys(Qr),"text"]){const f=document.createElement("option");f.value=m,f.textContent=mo[m]??m,s.append(f)}const r=Le("添加关键帧",{variant:"small",onClick:()=>{if(t.holo.shapes.length>=ks){ge(`两次上传之间最多 ${ks} 帧`,"info");return}t.holo.shapes=[...t.holo.shapes,s.value],this.host.saveConfig(),this.renderHoloList(),this.holoFrames=[]}}),o=Le("清空",{variant:"small",onClick:()=>{t.holo.shapes=[],this.host.saveConfig(),this.renderHoloList(),this.holoFrames=[]}}),a=le({label:"形变时间",min:50,max:1e4,step:50,value:t.holo.transitionMs,unit:"ms",hint:"相邻关键帧之间在设备端插值的时长。",onInput:m=>{t.holo.transitionMs=Math.round(m)},onChange:()=>{this.host.saveConfig(),this.applyHoloConfig()}}),l=le({label:"全息帧率",min:cu,max:hu,step:10,value:t.holo.outputRateHz,unit:"Hz",onInput:m=>{t.holo.outputRateHz=Math.round(m)},onChange:()=>{this.host.saveConfig(),this.applyHoloConfig()}}),c=le({label:"全息幅度",min:0,max:128,step:1,value:t.holo.level,unit:"/128",hint:"线性幅度：128 就是 50% 占空比的满幅度。",onInput:m=>{t.holo.level=Math.round(m)},onChange:()=>{this.host.saveConfig(),this.applyHoloConfig()}}),u=le({label:"循环周期",min:0,max:2e4,step:100,value:t.holo.loopMs,unit:"ms",hint:"0 = 由帧数 × 形变时间推导。",onInput:m=>{t.holo.loopMs=Math.round(m)},onChange:()=>{this.host.saveConfig(),this.applyHoloConfig()}}),h=Ls({label:"停在最后一帧",checked:t.holo.holdLast,hint:"关闭则回卷到第 0 帧继续循环。",onChange:m=>{t.holo.holdLast=m,this.host.saveConfig(),this.applyHoloConfig()}}),d=Ls({label:"幅度 γ 校正",checked:t.holo.gamma,hint:"把线性幅度经 sin(π·l/256) 反查成占空比，低声压更细腻。",onChange:m=>{t.holo.gamma=m,this.host.saveConfig(),this.applyHoloConfig()}}),p=Le("上传并开始",{icon:"layers",variant:"primary",block:!0,onClick:()=>{this.holoRun()}}),_=Le("场图预览",{icon:"waves",onClick:()=>{this.holoPreviewNow()}}),g=Le("停止形变",{icon:"square",onClick:()=>{this.holoHalt()}});return this.renderHoloList(),this.updateHoloStatus(),jn({title:"全息变形",eyebrow:"HOLOGRAM",actions:j("span",{class:"eyebrow",text:"0xA0..0xA5"})},j("p",{class:"section-note",text:"把多个图形上传成 84 路相位关键帧，由设备端按自己的帧时钟插值 —— USB 抖动不会让声场跳变。"}),j("p",{class:"section-note",text:"40 kHz 在 100 mm 处的焦斑约 20 mm：比这更小的图形会糊成一团。想看清晰的形变，先把「图形尺寸」调到 30 mm 以上。"}),n,j("div",{class:"inline-row"},s,r,o),a.root,l.root,c.root,u.root,h.root,d.root,j("div",{class:"btn-row"},p),j("div",{class:"btn-row"},_,g),e)}renderHoloList(){const t=this.holoListEl;if(!t)return;Zi(t);const e=this.cfg.holo.shapes;if(e.length===0){t.append(j("p",{class:"section-note",text:"还没有关键帧：先添加至少一帧。"}));return}e.forEach((n,s)=>{const r=j("span",{class:"holo-chip"},j("b",{text:String(s)}),j("span",{text:mo[n]??n}),j("button",{type:"button",class:"chip-x",text:"×",title:`移除第 ${s} 帧`,attrs:{"aria-label":`移除第 ${s} 帧`}}));r.querySelector("button")?.addEventListener("click",()=>{this.cfg.holo.shapes=this.cfg.holo.shapes.filter((o,a)=>a!==s),this.host.saveConfig(),this.renderHoloList(),this.holoFrames=[]}),t.append(r)})}updateHoloStatus(){const t=this.holoStatusEl;if(!t)return;const e=this.lastHolo;if(!e){t.textContent=this.devices.current.profile.hasHologram?"全息引擎待命（capability bit11 已就绪）。":"当前固件没有全息引擎：请烧录 v7.5+ 固件。";return}const n=`${e.stateName} · 第 ${e.currentKeyframe+1}/${e.keyframeCount} 帧 · α ${(e.alpha*100).toFixed(0)}% · ${e.fps.toFixed(0)} fps · 服务 ${e.serviceAvgUs}/${e.serviceMaxUs} µs · 丢帧 ${e.missedDeadlines}`;t.textContent=n}async applyHoloConfig(){if(!(!this.session||this.session.state!==Ae.Hologram))try{await this.session.holoUpdate(this.session.holoConfig(this.holoFrames.length||this.cfg.holo.shapes.length))}catch(t){this.log.add(`全息配置下发失败：${String(t)}`,"warn")}}holoFrameList(){return this.cfg.holo.shapes.map(t=>Pp(this.cfg,t,{samples:56}).frame)}async holoRun(){try{if(!this.devices.current.hasHologram){ge("当前设备固件没有全息关键帧引擎","error");return}if(this.cfg.holo.shapes.length===0){ge("先添加至少一个关键帧","info");return}this.stopPlaybackLocal();const t=this.ensureSession();this.holoFrames=this.holoFrameList(),await t.holoStart(this.holoFrames,t.holoConfig(this.holoFrames.length)),this.lastHolo=await this.devices.current.holoStatus(),this.updateHoloStatus(),this.log.add(`全息形变接管输出：${this.holoFrames.length} 帧 × ${this.cfg.holo.transitionMs} ms`,"ok"),ge("全息形变已开始","ok"),this.holoPreviewNow()}catch(t){this.fail(t)}}async holoHalt(){try{await this.ensureSession().holoStop(),this.lastHolo=await this.devices.current.holoStatus().catch(()=>null),this.updateHoloStatus(),this.log.add("全息形变已停止","info")}catch(t){this.fail(t)}}async holoPreviewNow(){if(this.holoFrames.length===0&&(this.holoFrames=this.holoFrameList()),this.holoFrames.length===0){ge("先添加关键帧再预览","info");return}this.view!=="field"&&this.applyView("field",!1),this.holoPreviewAt=0,await this.holoPreviewFrame()}buildUlmSection(){const t=this.cfg,e=Ls({label:"ULM 触觉调制",checked:t.ulm.enabled,hint:"焦点在路径上宏观移动的同时以触觉频率横向振荡（固件 flag bit7）。",onChange:l=>{t.ulm.enabled=l,this.host.saveConfig(),this.applyOutputConfig()}}),n=le({label:"调制频率",min:1,max:1e3,step:1,value:t.ulm.frequencyHz,unit:"Hz",hint:"皮肤最敏感的 100–300 Hz 区间。",onInput:l=>{t.ulm.frequencyHz=Math.round(l)},onChange:()=>{this.host.saveConfig(),this.applyOutputConfig()}}),s=le({label:"振幅",min:0,max:5e4,step:10,value:t.ulm.amplitudeUm,unit:"µm",hint:"0 = 由波速与频率推导（A = v / 2πf）。",onInput:l=>{t.ulm.amplitudeUm=Math.round(l)},onChange:()=>{this.host.saveConfig(),this.applyOutputConfig()}}),r=le({label:"波速",min:0,max:1e4,step:50,value:t.ulm.waveSpeedMmS,unit:"mm/s",hint:"0 = 固件默认 5000 mm/s；只在振幅为 0 时参与推导。",onInput:l=>{t.ulm.waveSpeedMmS=Math.round(l)},onChange:()=>{this.host.saveConfig(),this.applyOutputConfig()}}),o=Nr([{value:"x",label:"X 轴"},{value:"y",label:"Y 轴"},{value:"ring",label:"环形"}],t.ulm.axis,l=>{t.ulm.axis=l,this.host.saveConfig(),this.applyOutputConfig()}),a=Ls({label:"单向锯齿",checked:t.ulm.sawtooth,hint:"锯齿每秒产生一次从 +A 到 −A 的跳变，用于单向扫掠触感。",onChange:l=>{t.ulm.sawtooth=l,this.host.saveConfig(),this.applyOutputConfig()}});return jn({title:"触觉 ULM",eyebrow:"ULM",actions:j("span",{class:"eyebrow",text:"MOTION_CONFIG 69..75"})},e.root,n.root,s.root,r.root,o.root,a.root,j("p",{class:"section-note",text:"ULM 与光绘路径同时生效：位模式仍按规划播放，焦点在每个输出帧被横向偏移。先低幅度试手感。"}))}createMetrics(){return this.cfg.unlimited.enabled?new Wh(Ht("displayMetrics"),[{key:"x",label:"中心 X",unit:"mm",digits:2,accent:!0},{key:"y",label:"中心 Y",unit:"mm",digits:2},{key:"speed",label:"速度",unit:"mm/s",digits:2},{key:"accel",label:"加速度",unit:"mm/s²",digits:1},{key:"level",label:"电平",unit:"/255",digits:0},{key:"mode",label:"输出",digits:0}]):new Wh(Ht("displayMetrics"),[{key:"refresh",label:"刷新率",unit:"Hz",digits:1,accent:!0},{key:"speed",label:"峰值速度",unit:"mm/s",digits:0},{key:"accel",label:"峰值加速度",unit:"m/s²",digits:0},{key:"force",label:"力用",unit:"%",digits:0},{key:"lead",label:"前馈前导",unit:"mm",digits:2},{key:"points",label:"设备点",unit:"pts",digits:0}])}syncUnlimitedUi(){const t=this.cfg.unlimited.enabled;this.normalMotion.hidden=t,this.motionRoot.hidden=t,this.rawMotion.hidden=!t,this.unlimitedToggle.setChecked(t),this.liveX.setValue(this.cfg.display.centerXMm,!0),this.liveY.setValue(this.cfg.display.centerYMm,!0),this.liveSpeed.setValue(this.cfg.unlimited.speedMmS,!0),this.liveAccel.setValue(this.cfg.unlimited.accelMmS2,!0),this.metrics=this.createMetrics(),Ht("displayHudEyebrow").textContent=t?"LIGHT PAINTING · LIVE TARGET":"LIGHT PAINTING · STANDING WAVE",this.updateRawSummary()}updateRawSummary(){if(!this.rawActual)return;const t=this.realtime?this.live.position:{xMm:this.cfg.display.centerXMm,yMm:this.cfg.display.centerYMm};Zi(this.rawActual),this.rawActual.append(j("span",{text:"实时目标 "}),j("strong",{text:`X ${Xe(t.xMm,2)} / Y ${Xe(t.yMm,2)} mm`}),j("span",{text:` · ${Xe(this.cfg.unlimited.speedMmS,2)} mm/s · `}),j("strong",{text:`${Xe(this.cfg.unlimited.accelMmS2,1)} mm/s²`}))}async setUnlimited(t){if(t!==this.cfg.unlimited.enabled){if(this.playing&&await this.stopPlayback(),t){this.cfg.unlimited.enabled=!0,this.host.saveConfig(),this.syncUnlimitedUi(),this.log.add("已解除限制：实时 XY 输出","warn"),await this.startRealtime()||(this.cfg.unlimited.enabled=!1,this.host.saveConfig(),this.syncUnlimitedUi(),await this.replan(!0));return}this.cfg.unlimited.enabled=!1,this.host.saveConfig(),await this.stopRealtime(),this.syncUnlimitedUi(),this.log.add("已恢复速度规划与动力学校验","warn"),this.host.setHint("规划模式：时间最优速度、抗共振滤波与仿真校验"),await this.replan(!0)}}async startRealtime(){if(this.realtime)return!0;this.plan=null,this.scene.setPlan(null),this.scene.setLiveTarget(0,0,!1),this.drawCharts(0);try{const t=this.ensureSession();if(t.state===Ae.Running&&await t.stopDrawing(),t.state===Ae.Idle){const s=await t.levitate();this.autoLevitated=!0,this.log.add(s,"ok")}this.liveLevel=Math.max(1,Math.min(255,Math.round(this.cfg.trap.level))),await t.setLevel(this.liveLevel);const e=this.cfg.display.centerXMm,n=this.cfg.display.centerYMm;return this.realtime=!0,document.body.classList.add("is-realtime"),this.live.start(e,n),this.scene.setLiveTarget(e,n,!0),this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi(!0),this.log.add(`实时输出已启动：X ${e.toFixed(2)} / Y ${n.toFixed(2)} mm`,"ok"),ge("实时输出：左摇杆 / WASD 移动，中心 X/Y 直接下发","ok",3500),!0}catch(t){return this.realtime=!1,this.live.stop(),document.body.classList.remove("is-realtime"),this.scene.setLiveTarget(0,0,!1),this.autoLevitated&&this.session&&this.session.state!==Ae.Idle&&(await this.session.drop().catch(()=>{}),this.autoLevitated=!1),this.fail(t),!1}}async stopRealtime(){if(!this.realtime)return;this.realtime=!1,this.live.stop(),this.livePending=!1,window.clearTimeout(this.liveSaveTimer),this.liveSaveTimer=0,document.body.classList.remove("is-realtime"),this.scene.setLiveTarget(0,0,!1),this.host.saveConfig();const t=this.session;this.autoLevitated&&t&&t.state!==Ae.Idle&&await t.drop().catch(()=>{}),this.autoLevitated=!1}applyLiveCenter(){const t=this.cfg.display.centerXMm,e=this.cfg.display.centerYMm;if(this.cxSlider.setValue(t,!0),this.cySlider.setValue(e,!0),this.liveX.setValue(t,!0),this.liveY.setValue(e,!0),this.liveX.setValue(t,!0),this.liveY.setValue(e,!0),this.realtime){this.live.setPosition(t,e);return}this.scene.setLiveTarget(t,e,!0),this.updateRawSummary()}onLiveMove(t){if(!this.realtime)return;const e=Math.max(-35,Math.min(35,t.xMm)),n=Math.max(-35,Math.min(35,t.yMm));this.cfg.display.centerXMm=e,this.cfg.display.centerYMm=n,this.cxSlider.setValue(e,!0),this.cySlider.setValue(n,!0),this.liveX.setValue(e,!0),this.liveY.setValue(n,!0),this.liveSpeedNow=Math.hypot(t.vxMmS,t.vyMmS),this.scene.setLiveTarget(e,n,!0),this.livePending=!0,this.flushLiveTarget(),this.scheduleLiveSave();const s=performance.now();s-this.liveHudAt>100&&(this.liveHudAt=s,this.updateLiveUi())}async flushLiveTarget(){if(this.liveSending||!this.realtime)return;const t=this.session;if(!(!t||t.state!==Ae.Hover)){this.liveSending=!0;try{for(;this.livePending&&this.realtime&&(this.livePending=!1,this.session?.state===Ae.Hover);){const{xMm:e,yMm:n}=this.live.position;await t.liveTarget(e,n,this.liveLevel)}}catch(e){this.fail(e)}finally{this.liveSending=!1}}}scheduleLiveSave(){window.clearTimeout(this.liveSaveTimer),this.liveSaveTimer=window.setTimeout(()=>{this.liveSaveTimer=0,this.host.saveConfig()},500)}updateLiveUi(t=!1){const{xMm:e,yMm:n}=this.live.position,s=this.session?.state===Ae.Hover;this.metrics.update({x:e,y:n,speed:this.liveSpeedNow,accel:this.cfg.unlimited.accelMmS2,level:this.liveLevel,mode:s?"LIVE":"IDLE"}),Ht("displayPlanTitle").textContent="实时输出";const r=Ht("displayRefreshBadge");r.textContent=s?"LIVE":"IDLE",r.style.borderColor=s?"rgba(101,216,231,.42)":"rgba(255,182,72,.32)",r.style.color=s?"#9be7f0":"#ffc46b",Ht("displayPlanSub").textContent=`X ${Xe(e,2)} · Y ${Xe(n,2)} mm · ${Xe(this.liveSpeedNow,2)} mm/s · a ${Xe(this.cfg.unlimited.accelMmS2,1)} mm/s²`,Ht("planChartNote").textContent="实时坐标",this.host.setHint(`实时输出 · X ${Xe(e,2)} / Y ${Xe(n,2)} mm · ${Xe(this.liveSpeedNow,2)} mm/s`),t&&(Ht("displayHudEyebrow").textContent="LIGHT PAINTING · LIVE TARGET",po(Ht("displayWarnings"),[],"实时模式：无规划、无播放；中心坐标直接下发设备")),this.updateRawSummary(),this.renderReadout()}buildConfigSection(){const t=j("input",{type:"file",accept:"application/json,.json",style:{display:"none"}});t.addEventListener("change",()=>{const r=t.files?.[0];r&&Ad(r).then(o=>{vo(o),ge("配置已导入，正在重载…","ok"),window.setTimeout(()=>window.location.reload(),450)}).catch(o=>this.fail(o))});const e=Le("导出 JSON",{icon:"download",onClick:()=>Rd(this.cfg)}),n=Le("导入 JSON",{icon:"upload",onClick:()=>t.click()}),s=Le("恢复默认",{icon:"rotate-ccw",variant:"small",onClick:()=>{window.confirm("恢复默认配置并重载？当前参数与会话设置会丢失。")&&(Td(),window.location.reload())}});return jn({title:"配置",eyebrow:"CONFIG"},j("div",{class:"btn-row"},e,n),j("div",{class:"btn-row"},s),t,j("p",{class:"section-note",text:"配置保存在浏览器 localStorage，可导出备份；也可以直接导入原 Python 程序的 ~/.umh_display.json。"}))}bindHud(){for(const t of document.querySelectorAll("[data-display-view]"))t.addEventListener("click",()=>{const e=t.dataset.displayView;this.applyView(e,!0)});Ht("displayResetView").addEventListener("click",()=>this.scene.resetView()),Ht("displayClearLog").addEventListener("click",()=>this.log.clear()),this.refreshSlider.setValue(this.cfg.display.refreshHz),this.lateralSlider.setValue(qr(this.cfg)),this.updateLevelMeter()}bindPlayback(){this.playButton.addEventListener("click",()=>{this.togglePlayback()}),Ht("displaySpeed").addEventListener("change",t=>{this.speed=Number(t.target.value),this.ui.speed=this.speed,this.host.saveUiState()})}syncSpeedSelect(){const t=Ht("displaySpeed");t.value=String(this.speed)}selectShape(t){if(this.selectedShape=t,this.ui.displayShape=t,this.host.saveUiState(),this.shapeGridHandle.setActive(t),this.syncShapeUi(),t==="text"&&(this.textField.focus(),this.textField.select()),this.playing){ge("绘制中：停止后可重新规划","info");return}this.schedulePlan(!0)}syncShapeUi(){const t=this.selectedShape==="text";this.textRow.hidden=!t,this.spanEl.textContent=t?"TEXT":"SHAPE",this.textField.value=this.cfg.display.text}updateLevelMeter(){const t=this.cfg.trap.level,e=Os(t);this.levelFill.style.width=`${Math.max(2,t/255*100)}%`,this.levelCaption.innerHTML="",this.levelCaption.append(j("span",{text:`声功率 ${Math.round(e*100)}%`}),j("span",{text:`duty ${Math.round(t*128/255)}/128`}))}applyView(t,e){this.view=t,this.ui.displayView=t,this.host.saveUiState();for(const n of document.querySelectorAll("[data-display-view]"))n.classList.toggle("is-active",n.dataset.displayView===t);this.scene.setView(t),t==="field"&&e&&this.requestField()}shapeName(){return this.selectedShape==="text"?`text:${this.cfg.display.text}`:this.selectedShape}schedulePlan(t=!1){if(this.cfg.unlimited.enabled||this.playing)return;if(this.planning){this.pendingPlan=!0;return}const e=t?0:240;this.planTimer!==null&&window.clearTimeout(this.planTimer),this.planTimer=window.setTimeout(()=>{this.planTimer=null,this.replan(!1)},e)}planTimer=null;async replan(t){if(this.cfg.unlimited.enabled)return null;if(this.planning)return this.pendingPlan=!0,this.plan;this.planning=!0,this.pendingPlan=!1;const e=++this.planSeq;Fr(this.loading,this.loadingText,!0,this.cfg.unlimited.enabled?"正在生成原始轨迹…":"正在规划：速度 / 滤波 / 前馈…"),this.stageError.hidden=!0;try{const n=await this.client.plan(this.cfg,this.shapeName(),this.devices.current.profile.maxPathPoints);return e!==this.planSeq?null:(this.applyPlan(n),t&&this.log.add(n.raw?`原始轨迹 ${n.name}: 一圈 ${an(n.metrics.periodMs)} · ${n.points.length} 点`:`规划 ${n.name}: ${n.metrics.refreshHz.toFixed(1)} Hz · ${n.points.length} 点`,"ok"),n)}catch(n){return this.stageError.hidden=!1,this.stageError.textContent=`规划失败：${n instanceof Error?n.message:String(n)}`,this.log.add(`规划失败：${String(n)}`,"error"),null}finally{this.planning=!1,Fr(this.loading,this.loadingText,!1),this.pendingPlan&&(this.pendingPlan=!1,this.schedulePlan(!0))}}applyPlan(t){this.plan=t,this.phase=0,this.scene.setPlan(t),this.scene.setProgress(0,!1);const e=Ht("displayRefreshBadge");if(t.raw){const n=t.metrics;this.metrics.update({period:an(n.periodMs),speed:n.vMaxMmS,length:n.lengthMm,loop:an(n.deviceLoopMs),rate:n.playbackRate,points:t.points.length}),e.textContent="原始轨迹",e.style.borderColor="rgba(101,216,231,.42)",e.style.color="#9be7f0",Ht("displayPlanSub").textContent=`一圈 ${an(n.periodMs)} · ${t.points.length} 点 · 平均 ${Xe(n.vMaxMmS,n.vMaxMmS<1?4:2)} mm/s`,Ht("planChartNote").textContent=`${an(n.periodMs)} · ${t.points.length} pts`,po(Ht("displayWarnings"),t.warnings,"原始轨迹：无前馈、无速度/加速度约束、无共振滤波、无仿真校验"),this.host.setHint(`原始轨迹 · 一圈 ${an(n.periodMs)} · 速度倍率 ${n.playbackRate.toFixed(3)}×`)}else this.metrics.update({refresh:t.metrics.refreshHz,speed:t.metrics.vMaxMmS,accel:t.metrics.aMaxMS2,force:t.metrics.forceUse*100,lead:t.metrics.leadMaxMm,points:t.points.length},t.metrics.forceUse>.85?["force"]:[],t.metrics.forceUse>1?["force"]:[]),e.textContent=t.warnings.some(n=>n.startsWith("LOST"))?"LOST":`${t.metrics.refreshHz.toFixed(1)} Hz`,e.style.borderColor=t.warnings.some(n=>n.startsWith("LOST"))?"rgba(255,93,108,.5)":"",e.style.color=t.warnings.some(n=>n.startsWith("LOST"))?"#ff8d96":"",Ht("displayPlanSub").textContent=`周期 ${t.metrics.periodMs.toFixed(0)} ms · 力用 ${Math.round(t.metrics.forceUse*100)}% · 形状误差 ${t.metrics.shapeErrMm.toFixed(2)} mm · 前导 ${t.metrics.leadMaxMm.toFixed(2)} mm`,Ht("planChartNote").textContent=`${t.metrics.periodMs.toFixed(0)} ms · ${t.points.length} pts`,po(Ht("displayWarnings"),t.warnings);Ht("displayPlanTitle").textContent=t.name.startsWith("text:")?`文字 · ${t.name.slice(5)}`:`${mo[t.name]??t.name}`,this.renderPalette(t),this.updateRawSummary(),this.renderReadout(),this.drawCharts(0),this.view==="field"&&this.requestField()}renderPalette(t){Zi(this.paletteStrip);for(const[e,n,s]of t.palette)this.paletteStrip.append(j("span",{style:{background:`rgb(${e},${n},${s})`}}))}drawCharts(t){iS(Ht("speedChart"),this.plan,t),rS(Ht("planChart"),this.plan,t)}async requestField(){const t=Mi(this.cfg),e=this.plan?.trapModel.heightMm??2.26,n=this.cfg.trap.patternRadiusMm,s=this.cfg.trap.phaseSpan,r=`${t}|${n.toFixed(1)}|${s}|${e.toFixed(2)}|${this.cfg.trap.tableDistanceMm}|${this.cfg.bead.diameterMm}|${this.cfg.bead.densityKgM3}`,o=this.fieldCache.get(r);if(o){this.scene.setField(o),this.scene.setView("field");return}const a=++this.fieldSeq;Fr(this.loading,this.loadingText,!0,"正在计算桌面上方声场…");try{const l=await this.client.displayField({mode:t,tableDistanceMm:this.cfg.trap.tableDistanceMm,focusOffsetMm:this.cfg.trap.focusOffsetMm,radiusMm:n,phaseSpan:s,heightMm:e,extentMm:60,grid:96,bead:{diameterMm:this.cfg.bead.diameterMm,densityKgM3:this.cfg.bead.densityKgM3}});if(a!==this.fieldSeq)return;this.fieldCache.set(r,l),this.scene.setField(l),this.scene.setView("field")}catch(l){this.log.add(`声场计算失败：${String(l)}`,"error")}finally{a===this.fieldSeq&&Fr(this.loading,this.loadingText,!1)}}ensureSession(){const t=this.devices.state;return(!this.session||this.sessionVersion!==t.version)&&(this.session=new Tp(t.device,this.cfg),this.sessionVersion=t.version),this.session}async levitate(){try{const t=this.ensureSession(),e=await t.levitate();this.cfg.trap.level=t.level,this.levelSlider.setValue(t.level),this.updateLevelMeter(),this.host.saveConfig(),this.log.add(e,"ok"),ge(e,"ok"),this.renderReadout(),this.cfg.unlimited.enabled&&(this.liveLevel=Math.max(1,Math.min(255,Math.round(t.level))),this.realtime?(await t.setLevel(this.liveLevel),this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi()):await this.startRealtime())}catch(t){this.fail(t)}}async dropBead(){this.stopPlaybackLocal();try{await this.ensureSession().drop(),this.log.add("声场关闭，小球落下","info"),this.liveSpeedNow=0,this.realtime&&this.updateLiveUi(),this.renderReadout()}catch(t){this.fail(t)}}async emergencyStop(){this.stopPlaybackLocal();try{await this.session?.emergencyStop(),await this.devices.current.clear(),this.log.add("E-STOP 已发送：立即关场","error"),ge("E-STOP：声场立即关闭","error"),this.liveSpeedNow=0,this.realtime&&this.updateLiveUi()}catch(t){this.fail(t)}}async recolor(){if(this.cfg.unlimited.enabled){ge("实时模式没有路径颜色；关闭限制后再使用实时上色","info");return}if(this.session?.state===Ae.Running&&this.session.plan){const t=this.session.plan,e=await this.client.plan(this.cfg,t.name,t.points.length,t.periodS);await this.session.recolor(e),this.applyPlan(e),this.log.add("颜色已实时更新（路径几何不变）","ok"),ge("颜色已实时更新","ok");return}await this.replan(!0)}async togglePlayback(){if(this.cfg.unlimited.enabled){ge("实时模式不需要播放：用中心 X/Y、左摇杆或 WASD 直接移动","info");return}if(this.playing){await this.stopPlayback();return}try{const t=this.ensureSession();if(t.state===Ae.Idle){const n=await t.levitate();this.log.add(n,"ok"),ge("陷阱已打开：确保小球在声场里，再播放","info")}const e=await this.replan(!1)??this.plan;if(!e)return;await t.play(e),this.playing=!0,this.phase=0,this.lastFrame=performance.now(),this.lastChart=0,this.setPlayIcon(!0),this.updatePlayUi(),this.log.add(e.raw?`开始原始轨迹 ${e.name}：一圈 ${an(e.metrics.periodMs)}`:`开始绘制 ${e.name} @ ${e.metrics.refreshHz.toFixed(1)} Hz`,"ok"),this.animate()}catch(t){this.fail(t)}}async stopPlayback(){this.stopPlaybackLocal();try{this.session?.state===Ae.Running&&(await this.session.stopDrawing(),this.log.add(this.plan?.raw?"原始轨迹已停止，停在当前位置悬停":"沿路径减速，停在当前位置悬停","info")),this.updatePlayUi(),this.renderReadout()}catch(t){this.fail(t)}}stopPlaybackLocal(){this.playing=!1,cancelAnimationFrame(this.raf),this.phase=0,this.loopFill.style.width="0%",this.clock.textContent="0.0 ms",this.plan&&this.scene.setProgress(0,!1),this.setPlayIcon(!1),this.updatePlayUi()}animate=()=>{if(!this.playing||!this.plan)return;const t=performance.now(),e=Math.min(.06,(t-this.lastFrame)/1e3);this.lastFrame=t,this.phase=(this.phase+e*this.speed/this.plan.periodS)%1,this.scene.setProgress(this.phase,!0),this.loopFill.style.width=`${this.phase*100}%`,this.clock.textContent=an(this.phase*this.plan.periodS*1e3),t-this.lastChart>120&&(this.lastChart=t,this.drawCharts(this.phase)),this.raf=requestAnimationFrame(this.animate)};setPlayIcon(t){Zi(this.playButton),this.playButton.append(ls(t?"pause":"play",15)),ni(this.playButton),this.playButton.setAttribute("aria-label",t?"暂停绘制":"播放")}updatePlayUi(){this.playButton.classList.toggle("is-live",this.playing),this.stickyPlay&&(Zi(this.stickyPlay),this.stickyPlay.append(ls(this.playing?"pause":"play",14),j("span",{text:this.playing?"暂停":"播放"})),ni(this.stickyPlay),this.stickyPlay.classList.toggle("is-live",this.playing))}async onSpin(){if(this.spinArmed){this.spinArmed=!1,this.spinButton.classList.remove("is-armed"),this.spinButton.querySelector("span").textContent="标定中…",this.fell.value=!0;return}const t=this.session;if(!t||t.state!==Ae.Hover){ge("先起浮小球，再做 Spin 标定","error");return}if(window.confirm("Spin 标定：小球会在 8 mm 圆上越转越快约 15 秒。跳出场或掉下时点「它甩出了！」，程序会反解 255 级的横向陷阱强度。是否开始？")){this.fell.value=!1,this.spinArmed=!0,this.spinButton.classList.add("is-armed"),this.spinButton.querySelector("span").textContent="它甩出了！",this.log.add("Spin 标定开始：8 mm 圆，指数扫频","info");try{const e=await t.spinTest(this.fell,{report:n=>this.host.setHint(`Spin 标定：${n.toFixed(1)} Hz`)});if(e===null||!Number.isFinite(e)){ge("未观察到甩出（或一开始就掉下）：未保存，可调高横向强度后重试","error"),this.log.add("Spin 标定无有效折点","warn");return}ql(this.cfg,Math.round(e)),this.lateralSlider.setValue(Math.round(e)),vo(this.cfg),this.log.add(`横向强度 ${e.toFixed(0)} m/s² @255 已保存`,"ok"),ge(`横向强度 ${e.toFixed(0)} m/s² 已保存，重新规划`,"ok"),await this.replan(!0)}catch(e){this.fail(e)}finally{this.spinArmed=!1,this.spinButton.classList.remove("is-armed"),this.spinButton.querySelector("span").textContent="Spin 标定"}}}fell={value:!1};async pollStatus(){if(!(!this.session||this.pollBusy)){this.pollBusy=!0;try{const t=await this.session.dev.motionStatus();this.lastStatus=t,this.lastFlags=await this.session.dev.systemFlags().catch(()=>this.lastFlags);const e=this.session.state===Ae.Hologram;if(e&&this.devices.current.hasHologram?(this.lastHolo=await this.devices.current.holoStatus().catch(()=>this.lastHolo),this.updateHoloStatus(),this.visible&&this.view==="field"&&this.holoPreviewFrame()):this.lastHolo&&!e&&(this.lastHolo=null,this.updateHoloStatus()),this.renderReadout(),this.visible){const n=(this.lastFlags&_a)!==0?" · 扳机按下":"";this.host.setHint(`${this.realtime?"实时":"规划"} · ${t.stateName} · (${(t.xUm/1e3).toFixed(2)}, ${(t.yUm/1e3).toFixed(2)}) mm · ${t.fps.toFixed(0)} fps · 服务 ${t.serviceAvgUs}/${t.serviceMaxUs} µs${n}`)}}catch{}finally{this.pollBusy=!1}}}async holoPreviewFrame(){if(performance.now()-this.holoPreviewAt<500||(this.holoPreviewAt=performance.now(),this.holoFrames.length===0&&(this.holoFrames=this.holoFrameList()),this.holoFrames.length===0))return;const t=this.lastHolo,e=t?Math.min(t.currentKeyframe,this.holoFrames.length-1):0,n=Math.min(e+1,this.holoFrames.length-1),s=Lp(this.holoFrames[e],this.holoFrames[n],t?t.alpha:0);this.scene.setField(Ip(s,{heightMm:-this.cfg.trap.focusOffsetMm,extentMm:60,grid:64,tableDistanceMm:this.cfg.trap.tableDistanceMm}))}renderReadout(){const t=this.plan,e=this.lastStatus,n=t?.trapModel,s=(a,l=1)=>a===void 0||!Number.isFinite(a)?"—":Xe(a,l),r=[];if(this.realtime){const a=this.live.position;r.push({title:"实时输出",meta:this.session?.state===Ae.Hover?"LIVE":"IDLE",rows:[{label:"中心 X",value:`${s(a.xMm,2)} mm`},{label:"中心 Y",value:`${s(a.yMm,2)} mm`},{label:"当前速度",value:`${s(this.liveSpeedNow,2)} mm/s`},{label:"加速度",value:`${s(this.cfg.unlimited.accelMmS2,1)} mm/s²`},{label:"目标速度",value:`${s(this.cfg.unlimited.speedMmS,2)} mm/s`},{label:"电平",value:`${this.liveLevel}/255`},{label:"控制器",value:"左摇杆 / WASD · 直接下发",state:"good"}]})}else if(t?.raw){const a=t.metrics;r.push({title:"原始轨迹",meta:"NO LIMITS",rows:[{label:"一圈用时",value:an(a.periodMs)},{label:"基础周期",value:an(a.deviceLoopMs)},{label:"速度倍率",value:`${a.playbackRate.toFixed(3)}×`},{label:"平均速度",value:`${s(a.vMaxMmS,a.vMaxMmS<1?4:2)} mm/s`},{label:"路径总长",value:`${s(a.lengthMm,1)} mm`},{label:"点亮长度",value:`${s(a.litMm,1)} mm`},{label:"设备点",value:`${a.points}`},{label:"路径采样",value:`${a.pathSamples}`},{label:"控制器",value:"线性插值 · 循环",state:"good"}]})}else if(t){const a=t.metrics;r.push({title:"规划",meta:`${a.refreshHz.toFixed(1)} Hz`,rows:[{label:"周期",value:`${s(a.periodMs,0)} ms`},{label:"TOPP 周期",value:`${s(a.toppPeriodMs,1)} ms`},{label:"路径总长",value:`${s(a.lengthMm,1)} mm`},{label:"点亮长度",value:`${s(a.litMm,1)} mm`},{label:"峰值速度",value:`${s(a.vMaxMmS,0)} mm/s`},{label:"点亮平均速度",value:`${s(a.vLitMeanMmS,0)} mm/s`},{label:"峰值加速度",value:`${s(a.aMaxMS2,0)} m/s²`},{label:"峰值 jerk",value:`${s(a.jerkMaxMS3/1e3,1)} k m/s³`},{label:"模型力用",value:`${s(a.forceUse*100,0)}%`,state:a.forceUse>1?"bad":a.forceUse>.85?"warn":"good"},{label:"最大前导",value:`${s(a.leadMaxMm,2)} mm`},{label:"离轴力保留",value:`${s(a.offaxisForceMin*100,0)}%`},{label:"参考误差",value:`${s(a.refErrMm,3)} mm`}]}),r.push({title:"仿真验证",meta:`±${(this.cfg.planner.robustForceError*100).toFixed(0)}% 力`,rows:[{label:"跟踪误差 max",value:`${s(a.trackErrMm,2)} mm`},{label:"跟踪误差 RMS",value:`${s(a.trackRmsMm,2)} mm`},{label:"形状误差",value:`${s(a.shapeErrMm,2)} mm`,state:a.shapeErrMm>this.cfg.planner.maxTrackingErrorMm?"warn":"good"},{label:"形状误差 (worst)",value:`${s(a.shapeErrWorstMm,2)} mm`},{label:"稳态偏移",value:`${s(a.offsetSteadyMm,2)} mm`},{label:"逃逸半径",value:`${s(a.offsetLimitMm,1)} mm`},{label:"设备重构误差",value:`${s(a.reconErrMm,3)} mm`,state:a.reconErrMm>.15?"warn":"good"},{label:"每帧步长",value:`${s(a.frameStepMm,3)} mm`},{label:"每帧相位步长",value:`${s(a.phaseStepDeg,2)}°`}]})}n&&r.push({title:"陷阱模型",meta:t?.name,rows:[{label:"小球质量",value:`${s(n.mass*1e6,3)} mg`},{label:"峰值力",value:`${s(n.fMax*1e6,1)} µN`},{label:"力峰偏移 d_pk",value:`${s(n.dPk*1e3,2)} mm`},{label:"逃逸半径",value:`${s(n.basin*1e3,1)} mm`},{label:"离轴尺度 r0",value:`${s(n.offaxisR0*1e3,1)} mm`},{label:"固有频率",value:`${s(Math.sqrt(n.fMax*Math.PI/(2*n.dPk)/n.mass)/(2*Math.PI),1)} Hz`},{label:"悬停高度",value:`${s(n.heightMm,2)} mm`}]}),r.push({title:"设备与链路",meta:this.devices.state.label,rows:e?[{label:"状态",value:e.stateName,state:e.running?"good":"dim"},{label:"陷阱位置",value:`${(e.xUm/1e3).toFixed(2)}, ${(e.yUm/1e3).toFixed(2)} mm`},{label:"输出帧率",value:`${e.fps.toFixed(0)} fps`},{label:"路径点",value:`${e.pathPoints}`},{label:"循环",value:`${e.loopMs} ms`},{label:"服务耗时",value:`${e.serviceAvgUs}/${e.serviceMaxUs} µs`},{label:"空间合成",value:`${e.renderAvgUs}/${e.renderMaxUs} µs`},{label:"FPGA 帧事务",value:`${e.submitAvgUs}/${e.submitMaxUs} µs`},{label:"丢帧 / 错误",value:`${e.missedDeadlines} / ${e.frameErrors}`},{label:"链路",value:this.devices.isDemo?"演示（无硬件）":this.devices.state.label,state:this.devices.isDemo?"dim":"good"}]:[{label:"状态",value:"未连接/未起浮",state:"dim"},{label:"链路",value:this.devices.isDemo?"演示（无硬件）":this.devices.state.label}]});const o=this.lastFlags;if(r.push({title:"固件能力",meta:`${this.devices.current.profile.model} · ${this.devices.current.profile.firmware}`,rows:[{label:"光绘扩展",value:this.devices.current.profile.hasDisplay?"v7.3 DISPLAY":"不支持",state:this.devices.current.profile.hasDisplay?"good":"bad"},{label:"长路径 1024",value:this.devices.current.profile.maxPathPoints>255?`${this.devices.current.profile.maxPathPoints} 点`:"255 点",state:this.devices.current.profile.maxPathPoints>255?"good":"dim"},{label:"全息引擎",value:this.devices.current.profile.hasHologram?"bit11 HOLOGRAM":"不支持",state:this.devices.current.profile.hasHologram?"good":"bad"},{label:"超声枪扳机",value:(o&_a)!==0?"按下（正在发射）":"松开",state:(o&_a)!==0?"warn":"dim"},{label:"语音 / USB 音频",value:(o&tc)!==0?"录音中":(o&ec)!==0?"USB 音频":"空闲",state:(o&(tc|ec))!==0?"good":"dim"}]}),this.lastHolo){const a=this.lastHolo;r.push({title:"全息引擎",meta:a.stateName,rows:[{label:"当前帧",value:`${a.currentKeyframe+1} / ${a.keyframeCount}`},{label:"段内进度",value:`${(a.alpha*100).toFixed(0)} %`},{label:"提交帧率",value:`${a.fps.toFixed(0)} / ${a.outputRateHz} Hz`,state:a.fps>=a.outputRateHz*.9?"good":"warn"},{label:"换算耗时",value:`${a.serviceAvgUs}/${a.serviceMaxUs} µs`},{label:"提交事务",value:`${a.submitAvgUs}/${a.submitMaxUs} µs`},{label:"已提交 / 跳过",value:`${a.frames} / ${a.skipped}`},{label:"丢帧 / 错误",value:`${a.missedDeadlines} / ${a.frameErrors}`,state:a.frameErrors>0?"bad":"good"}]})}Zy(Ht("displayReadout"),r)}fail(t){const e=t instanceof Error?t.message:String(t);this.log.add(e,"error"),ge(e,"error",4200),this.host.setHint(e)}onDeviceChanged(){const t=this.devices.state;t.version!==this.lastDeviceVersion&&(this.lastDeviceVersion=t.version,this.session=null,this.sessionVersion=-1,this.lastStatus=null,this.stopPlaybackLocal(),this.log.add(this.devices.isDemo?`硬件已断开或未连接：使用演示设备（${t.error||"演示模式"}）`:`已连接 ${t.label} · ${t.device.profile.firmware}`,this.devices.isDemo?"warn":"ok"),this.pollStatusSoon(),this.cfg.unlimited.enabled?(this.realtime=!1,this.live.stop(),document.body.classList.remove("is-realtime"),this.startRealtime()):this.replan(!1))}pollStatusSoon(){window.setTimeout(()=>{this.pollStatus()},150)}activate(){this.visible=!0,this.scene.setVisible(!0),this.scene.resize(),this.drawCharts(this.phase)}deactivate(){this.visible=!1,this.stopPlaybackLocal(),this.scene.setVisible(!1);const t=this.session;t&&t.state!==Ae.Idle&&t.drop().then(()=>this.log.add("工作区隐藏：光绘声场已关闭","info")).catch(()=>{})}async start(){this.lastDeviceVersion=this.devices.state.version,this.cfg.unlimited.enabled?await this.startRealtime():await this.replan(!1),this.drawCharts(0),this.updatePlayUi()}isFieldActive(){return this.playing||this.session!==null&&this.session.state!==Ae.Idle}setFpsListener(){this.scene.onStats=t=>this.host.setFps(t)}dispose(){window.clearInterval(this.pollTimer),this.resizeObserver.disconnect(),cancelAnimationFrame(this.raf),this.live.stop(),this.scene.dispose(),this.session?.emergencyStop()}}const $h=i=>new Promise(t=>window.setTimeout(t,i)),go=()=>new Promise(i=>requestAnimationFrame(()=>i()));function lS(){try{const i=localStorage.getItem(jh);if(i){const t=JSON.parse(i);return{displayShape:typeof t.displayShape=="string"?t.displayShape:"circle",displayView:t.displayView==="plan"||t.displayView==="field"?t.displayView:"scene",speed:[1e4,1e3,100,10,1,.5,.25].includes(Number(t.speed))?Number(t.speed):1}}}catch{}return{displayShape:"circle",displayView:"scene",speed:1}}class cS{cfg;devices=new Cf;client=new Lf;ui;display;lastLinkVersion=-1;saveUi=If(()=>{try{localStorage.setItem(jh,JSON.stringify(this.ui))}catch{}},160);constructor(){this.cfg=wd(),this.ui=lS()}async boot(){const t=document.getElementById("boot"),e=document.getElementById("bootText"),n=document.getElementById("bootBar"),s=(r,o)=>{n&&(n.style.width=`${r}%`),e&&(e.textContent=o)};try{ni(document),s(8,"读取配置与界面状态"),await go(),s(22,"装配光绘工作区"),this.display=new oS(this,this.devices,this.client,this.ui),ni(document),await go(),s(38,"预热声场模型（Gor′kov 势）");const r=this.client.warm();await Promise.race([r,$h(8e3)]),s(58,"规划初始图形"),await this.display.start(),s(94,"就绪"),await go(),this.display.activate(),this.bindShell(),this.devices.subscribe(o=>this.onLink(o)),this.onLink(this.devices.state),this.setHint(this.cfg.unlimited.enabled?"实时输出：左摇杆 / WASD 连续移动 · 中心 X/Y 直接下发":"规划在 Web Worker 中运行 · 拖动三维视图可旋转"),await $h(260),t?.classList.add("is-done"),window.setTimeout(()=>t?.remove(),700)}catch(r){console.error(r),e&&(e.textContent=`启动失败：${r instanceof Error?r.message:String(r)}`),n&&(n.style.width="100%"),ge(`启动失败：${r instanceof Error?r.message:String(r)}`,"error",8e3)}}get config(){return this.cfg}setFps(t){const e=document.getElementById("statusFps");e&&(e.textContent=`${Math.max(0,Math.round(t))} fps`)}setHint(t){const e=document.getElementById("statusHint");e&&(e.textContent=t)}notifyLink(t){this.onLink(t)}saveConfig(){vo(this.cfg)}saveUiState(){this.saveUi()}bindShell(){document.getElementById("connectBtn")?.addEventListener("click",()=>{this.toggleConnection()});const e=document.getElementById("helpDialog");document.getElementById("helpBtn")?.addEventListener("click",()=>{e&&!e.open&&e.showModal()}),document.querySelectorAll("[data-close-help]").forEach(n=>n.addEventListener("click",()=>e?.close())),e?.addEventListener("click",n=>{n.target===e&&e.close()});for(const n of document.querySelectorAll("[data-open-rail]"))n.addEventListener("click",()=>document.getElementById("displayRail")?.classList.add("is-open"));for(const n of document.querySelectorAll("[data-close-rail]"))n.addEventListener("click",()=>n.closest(".rail")?.classList.remove("is-open"));for(const n of document.querySelectorAll("[data-open-inspector]"))n.addEventListener("click",()=>document.getElementById("displayInspector")?.classList.add("is-open"));for(const n of document.querySelectorAll("[data-close-inspector]"))n.addEventListener("click",()=>n.closest(".inspector")?.classList.remove("is-open"));document.addEventListener("keydown",n=>{const s=n.target;s instanceof HTMLElement&&["INPUT","TEXTAREA","SELECT"].includes(s.tagName)||document.querySelector("dialog[open]")||(n.key==="?"||n.key==="h"&&!n.ctrlKey&&!n.metaKey?e&&!e.open&&e.showModal():n.key==="Escape"&&document.querySelectorAll(".rail.is-open, .inspector.is-open").forEach(r=>r.classList.remove("is-open")))}),window.addEventListener("beforeunload",n=>{this.devices.isDemo||(n.preventDefault(),n.returnValue=""),this.saveUi()}),window.addEventListener("pagehide",()=>{this.saveUi()})}onLink(t){const e=document.getElementById("linkChip"),n=document.getElementById("linkLabel"),s=document.getElementById("connectLabel"),r=document.getElementById("statusMode");if(e&&(e.dataset.state=t.busy?"busy":t.mode==="demo"?"demo":"connected"),n&&(n.textContent=t.busy?"正在连接…":t.mode==="demo"?"演示模式":"已连接"),s&&(s.textContent=t.mode==="demo"?"连接设备":"断开设备"),r){r.classList.toggle("is-connected",t.mode==="serial");const o=r.querySelector("span");o&&(o.textContent=t.mode==="serial"?`真实设备 · ${t.label}`:"演示模式")}t.version!==this.lastLinkVersion&&(this.lastLinkVersion=t.version,this.display?.onDeviceChanged(),t.mode==="serial"?(ge(`已连接 ${t.device.profile.model} · ${t.device.profile.firmware}`,"ok"),this.setHint("设备已连接 · Web Serial 2 Mbaud")):t.error&&(ge(t.error,"error",4500),this.devices.clearError(),this.setHint("演示模式：可规划、预览与学习，不起浮真实硬件")))}async toggleConnection(){if(this.devices.state.busy)return;if(this.devices.isDemo){try{await this.devices.connect()}catch(e){ge(`连接失败：${e instanceof Error?e.message:String(e)}`,"error",6e3)}return}this.display.isFieldActive()&&!window.confirm("声场正在运行。断开设备后阵列会保持最后一帧，可能需要先在设备上急停。确定断开？")||await this.devices.disconnect()}async dispose(){this.display?.dispose(),this.client.dispose(),await this.devices.dispose()}}function hS(){return new cS}const cd=hS();ni(document);cd.boot();window.__UMH_DISPLAY__=cd;
