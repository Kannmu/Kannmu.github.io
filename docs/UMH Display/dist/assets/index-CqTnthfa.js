(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Ml=9.81;function mh(i,t,e){return i<t?t:i>e?e:i}function Au(i){const t=Math.floor(i),e=i-t;return e>.5?t+1:e<.5||t%2===0?t:t+1}function Qr(i,t,e){const n=new Float64Array(e);if(e===1)return n[0]=i,n;const s=(t-i)/(e-1);for(let r=0;r<e;r++)n[r]=i+s*r;return n}function Ru(i,t,e){const n=t.length;if(n===0)return NaN;if(n===1||i<=t[0])return e[0];if(i>=t[n-1])return e[n-1];let s=0,r=n-1;for(;r-s>1;){const o=s+r>>1;t[o]<=i?s=o:r=o}const a=t[r]-t[s];return a<=0?e[s]:e[s]+(e[r]-e[s])*(i-t[s])/a}function yl(i,t){const e=i.length,n=new Float64Array(e);if(e<2)return n;n[0]=(i[1]-i[0])/(t[1]-t[0]),n[e-1]=(i[e-1]-i[e-2])/(t[e-1]-t[e-2]);for(let s=1;s<e-1;s++)n[s]=(i[s+1]-i[s-1])/(t[s+1]-t[s-1]);return n}function sn(i){return!Number.isFinite(i)||i<0?"—":i<1e3?`${i<10?i.toFixed(2):i.toFixed(0)} ms`:i<6e4?`${(i/1e3).toFixed(i<1e4?2:1)} s`:i<36e5?`${(i/6e4).toFixed(2)} min`:`${(i/36e5).toFixed(2)} h`}const gh=3,Wo="umh-display.config.v3",_h="umh-display.ui.v1",Cu=7,Pu={focus:0,vortex:6};function Lu(){return[255,40,0]}function Du(){return[0,90,255]}function Nr(){return{port:"",configVersion:gh,bead:{diameterMm:3,densityKgM3:25},trap:{field:"focus",level:88,tableDistanceMm:95,focusOffsetMm:0,mount:"down",lateralAccels:{focus:200,vortex:40},dropLevels:{},extraDampingRatio:.02},planner:{outputRateHz:2e3,accelFraction:.6,maxSpeedMmS:5e3,drawLevel:255,jerkTimeMs:8,cornerRadiusMm:1.2,cornerMode:"round",sampleStepMm:.05,maxPoints:1024,interpolation:"catmull",rampMs:600,seekSpeedMmS:40,seekAccelMmS2:400,robustForceError:.2,maxTrackingErrorMm:1.2,minPeriodMs:5},display:{sizeMm:16,centerXMm:0,centerYMm:0,text:"HI",textHeightMm:8,refreshHz:0,colorScheme:"wheel",colorA:Lu(),colorB:Du(),hueSpinRevS:.25,brightness:1,gamma:2.2,evenLines:.8,hoverBrightness:.15},unlimited:{enabled:!1,loopMs:2e3,rate:1,speedMmS:2,accelMmS2:5}}}function Uu(i,t){const e=i*5e-4;return t*4/3*Math.PI*e**3}function hi(i){return Pu[i.trap.field]??0}function Fr(i){return i.trap.lateralAccels[i.trap.field]??200}function Sl(i,t){i.trap.lateralAccels={...i.trap.lateralAccels,[i.trap.field]:t}}function bl(i){return Cu+i.trap.tableDistanceMm+i.trap.focusOffsetMm}function Iu(i){const t=i.trap.dropLevels[i.trap.field];return typeof t=="number"&&Number.isFinite(t)?t:null}function Wn(i){return typeof i=="object"&&i!==null&&!Array.isArray(i)}function Zt(i,t,e=-1/0,n=1/0){const s=typeof i=="number"?i:Number(i);return Number.isFinite(s)?Math.min(n,Math.max(e,s)):t}function _n(i,t,e,n){return Math.round(Zt(i,t,e,n))}function ei(i,t){return typeof i=="string"?i:t}function Nu(i,t){return typeof i=="boolean"?i:t}function El(i,t){return Array.isArray(i)&&i.length>=3?[_n(i[0],t[0],0,255),_n(i[1],t[1],0,255),_n(i[2],t[2],0,255)]:[...t]}function wl(i){const t={};if(Wn(i))for(const[e,n]of Object.entries(i)){const s=Number(n);Number.isFinite(s)&&(t[e]=s)}return t}function vh(i){const t=Nr();if(!Wn(i))return t;t.port=ei(i.port,t.port);const e=Wn(i.bead)?i.bead:{};t.bead.diameterMm=Zt(e.diameter_mm??e.diameterMm,t.bead.diameterMm,.5,20),t.bead.densityKgM3=Zt(e.density_kg_m3??e.densityKgM3,t.bead.densityKgM3,1,500);const n=Wn(i.trap)?i.trap:{},s=ei(n.field,t.trap.field);t.trap.field=s==="vortex"?"vortex":"focus",t.trap.level=_n(n.level,t.trap.level,1,255),t.trap.tableDistanceMm=Zt(n.table_distance_mm??n.tableDistanceMm,t.trap.tableDistanceMm,10,400),t.trap.focusOffsetMm=Zt(n.focus_offset_mm??n.focusOffsetMm,t.trap.focusOffsetMm,-95,95),t.trap.mount=ei(n.mount,t.trap.mount)==="side"?"side":"down",t.trap.lateralAccels={...t.trap.lateralAccels,...wl(n.lateral_accels??n.lateralAccels)},t.trap.dropLevels={...t.trap.dropLevels,...wl(n.drop_levels??n.dropLevels)},t.trap.extraDampingRatio=Zt(n.extra_damping_ratio??n.extraDampingRatio,t.trap.extraDampingRatio,0,.5);const r=Wn(i.planner)?i.planner:{};t.planner.outputRateHz=_n(r.output_rate_hz??r.outputRateHz,t.planner.outputRateHz,50,2e3),t.planner.accelFraction=Zt(r.accel_fraction??r.accelFraction,t.planner.accelFraction,.01,2),t.planner.maxSpeedMmS=Zt(r.max_speed_mm_s??r.maxSpeedMmS,t.planner.maxSpeedMmS,1,2e4),t.planner.drawLevel=_n(r.draw_level??r.drawLevel,t.planner.drawLevel,0,255),t.planner.jerkTimeMs=Zt(r.jerk_time_ms??r.jerkTimeMs,t.planner.jerkTimeMs,0,100),t.planner.cornerRadiusMm=Zt(r.corner_radius_mm??r.cornerRadiusMm,t.planner.cornerRadiusMm,0,20);const a=ei(r.corner_mode??r.cornerMode,t.planner.cornerMode);t.planner.cornerMode=a==="stop"?"stop":"round",t.planner.sampleStepMm=Zt(r.sample_step_mm??r.sampleStepMm,t.planner.sampleStepMm,.01,1),t.planner.maxPoints=_n(r.max_points??r.maxPoints,t.planner.maxPoints,32,1024);const o=ei(r.interpolation,t.planner.interpolation);t.planner.interpolation=o==="linear"?"linear":"catmull",t.planner.rampMs=_n(r.ramp_ms??r.rampMs,t.planner.rampMs,0,1e4),t.planner.seekSpeedMmS=Zt(r.seek_speed_mm_s??r.seekSpeedMmS,t.planner.seekSpeedMmS,1,500),t.planner.seekAccelMmS2=Zt(r.seek_accel_mm_s2??r.seekAccelMmS2,t.planner.seekAccelMmS2,10,1e4),t.planner.robustForceError=Zt(r.robust_force_error??r.robustForceError,t.planner.robustForceError,0,.9),t.planner.maxTrackingErrorMm=Zt(r.max_tracking_error_mm??r.maxTrackingErrorMm,t.planner.maxTrackingErrorMm,.1,20),t.planner.minPeriodMs=Zt(r.min_period_ms??r.minPeriodMs,t.planner.minPeriodMs,1,1e3);const l=Wn(i.display)?i.display:{};t.display.sizeMm=Zt(l.size_mm??l.sizeMm,t.display.sizeMm,2,80),t.display.centerXMm=Zt(l.center_x_mm??l.centerXMm,t.display.centerXMm,-40,40),t.display.centerYMm=Zt(l.center_y_mm??l.centerYMm,t.display.centerYMm,-40,40),t.display.text=ei(l.text,t.display.text).slice(0,24),t.display.textHeightMm=Zt(l.text_height_mm??l.textHeightMm,t.display.textHeightMm,2,40),t.display.refreshHz=Zt(l.refresh_hz??l.refreshHz,t.display.refreshHz,0,200);const c=ei(l.color_scheme??l.colorScheme,t.display.colorScheme);t.display.colorScheme=["wheel","gradient","solid"].includes(c)?c:"wheel",t.display.colorA=El(l.color_a??l.colorA,t.display.colorA),t.display.colorB=El(l.color_b??l.colorB,t.display.colorB),t.display.hueSpinRevS=Zt(l.hue_spin_rev_s??l.hueSpinRevS,t.display.hueSpinRevS,0,1.55),t.display.brightness=Zt(l.brightness,t.display.brightness,0,1),t.display.gamma=Zt(l.gamma,t.display.gamma,.5,4),t.display.evenLines=Zt(l.even_lines??l.evenLines,t.display.evenLines,0,1),t.display.hoverBrightness=Zt(l.hover_brightness??l.hoverBrightness,t.display.hoverBrightness,0,1);const u=Wn(i.unlimited)?i.unlimited:{};t.unlimited.enabled=Nu(u.enabled,t.unlimited.enabled),t.unlimited.loopMs=_n(u.loop_ms??u.loopMs,t.unlimited.loopMs,1,6e4),t.unlimited.rate=Zt(u.rate,t.unlimited.rate,.001,1),t.unlimited.speedMmS=Zt(u.speed_mm_s??u.speedMmS,t.unlimited.speedMmS,.01,50),t.unlimited.accelMmS2=Zt(u.accel_mm_s2??u.accelMmS2,t.unlimited.accelMmS2,.01,500);const h=_n(i.config_version??i.configVersion,1,1,999);if(h<2){const d={outputRateHz:[1500,2e3],maxPoints:[255,1024],minPeriodMs:[60,20]};for(const[p,[g,_]]of Object.entries(d))t.planner[p]===g&&(t.planner[p]=_)}if(h<3){const d=Nr(),p=["accelFraction","maxSpeedMmS","jerkTimeMs","robustForceError","outputRateHz","cornerMode","minPeriodMs"];for(const _ of p)t.planner[_]=d.planner[_];const g=Number((Wn(i.display)?i.display.period_ms:0)??0);t.display.refreshHz=g>0?1e3/g:0,t.bead.diameterMm===3.5&&(t.bead.diameterMm=3)}return t.configVersion=gh,t}function Fu(){try{const i=localStorage.getItem(Wo);return i?vh(JSON.parse(i)):Nr()}catch{return Nr()}}function ja(i){try{localStorage.setItem(Wo,JSON.stringify(i))}catch{}}function Ou(){try{localStorage.removeItem(Wo)}catch{}}async function Bu(i){const t=await i.text();return vh(JSON.parse(t))}function zu(i){const t=new Blob([JSON.stringify(i,null,2)],{type:"application/json"}),e=document.createElement("a");e.href=URL.createObjectURL(t),e.download="umh-display-config.json",e.click(),setTimeout(()=>URL.revokeObjectURL(e.href),1e3)}const xh=7,Xo=4e4,Yr=343,vn=[[-26,-35],[-43.3,-15],[8.6,-45],[-0,-30],[-26,-25],[-0,-10],[-26,-5],[-0,-40],[-17.4,-30],[-17.4,-20],[-17.3,-10],[-43.3,-5],[-8.7,-35],[-34.7,-30],[-34.7,-20],[-8.7,-25],[-8.7,-15],[-26,-15],[-34.7,-10],[-34.7,0],[-8.7,-5],[0,10],[-17.3,0],[0,30],[-8.7,25],[-8.7,5],[-34.7,10],[-26,25],[-8.7,45],[-17.3,40],[-26,5],[-43.3,15],[-26,35],[-8.7,35],[-8.7,15],[-34.7,20],[-17.3,30],[-17.3,20],[-26,15],[-17.3,10],[-43.3,5],[-34.6,30],[0,20],[43.3,15],[0,40],[17.4,40],[26,35],[8.7,45],[8.7,25],[17.3,30],[8.7,5],[34.7,-0],[34.7,10],[8.7,35],[17.3,20],[8.7,15],[17.3,10],[17.4,-0],[34.7,30],[26,25],[34.7,20],[26,15],[26,5],[8.6,-35],[26,-25],[-0,-20],[26,-15],[17.3,-20],[43.3,-15],[26,-5],[-8.7,-45],[26,-35],[43.3,5],[-17.4,-40],[17.3,-30],[17.3,-40],[34.7,-30],[34.7,-20],[17.4,-10],[43.3,-5],[8.6,-25],[8.6,-15],[34.7,-10],[8.7,-5]];function ku(i){const t=vn.length,e=new Float64Array(t*3);for(let n=0;n<t;n++)e[n*3]=vn[n][0]*.001,e[n*3+1]=vn[n][1]*.001,e[n*3+2]=xh*.001;return{xyz:e,count:t}}const Mh=85,yh=170,Hu=7,Un=16,Ka=2048,Vu=1,Gu=2,Wu=3,Xu=4,Yu=35,Tl=98,qu=99,$u=100,ju=101,Ku=102,Al=103,Zu=104,Za=112,Ju=113,Qu=1,td=16,ed={0:"OK",1:"BAD_HEADER",2:"BAD_LENGTH",3:"BAD_SEQUENCE",4:"NO_MEMORY",5:"UNSUPPORTED",6:"INVALID_STATE",7:"BUSY",8:"IO",9:"CRC"},Sh=4096,bh=8192,nd=4,id=128,sd=256,rd=512,Ja=0,Eh=1,Rl=2,ta=4,Cl=8,ad=16,od=6,ld=1,cd=2,wh=1,hd=2,ud={0:"OFF",1:"READY",2:"RUNNING",3:"STOPPING",4:"FAULT"},is=255,Qa=1024,dd=16,ji=1e3,fd=50,pd=2e3;function md(i,t=new Uint8Array(0),e,n=0,s=Qu){const r=t instanceof Uint8Array?t:Uint8Array.from(t);if(r.length>Ka)throw new Error(`payload ${r.length} > ${Ka}`);const a=new Uint8Array(Un+r.length),o=new DataView(a.buffer);return a[0]=Mh,a[1]=yh,a[2]=Hu,a[3]=i&255,a[4]=s&255,a[5]=Un,o.setUint16(6,r.length,!0),o.setUint32(8,e>>>0,!0),o.setUint32(12,n>>>0,!0),a.set(r,Un),a}class gd{buffer=new Uint8Array(0);feed(t){if(t.length===0)return;const e=new Uint8Array(this.buffer.length+t.length);e.set(this.buffer,0),e.set(t,this.buffer.length),this.buffer=e}next(){for(;this.buffer.length>=Un;){if(this.buffer[0]!==Mh||this.buffer[1]!==yh||this.buffer[5]!==Un){this.buffer=this.buffer.subarray(1);continue}const t=new DataView(this.buffer.buffer,this.buffer.byteOffset,this.buffer.byteLength),e=t.getUint16(6,!0);if(e>Ka){this.buffer=this.buffer.subarray(1);continue}if(this.buffer.length<Un+e)return null;const n={messageType:this.buffer[3],flags:this.buffer[4],transactionId:t.getUint32(8,!0),streamSequence:t.getUint32(12,!0),payload:this.buffer.slice(Un,Un+e)};return this.buffer=this.buffer.subarray(Un+e),n}return null}reset(){this.buffer=new Uint8Array(0)}}function _e(i,t,e){return Math.max(t,Math.min(e,Au(i)))}class Or{constructor(t,e,n,s=255,r=0){this.xUm=t,this.yUm=e,this.zUm=n,this.level=s,this.palette=r}xUm;yUm;zUm;level;palette;pack(){const t=new Uint8Array(8),e=new DataView(t.buffer);return e.setInt16(0,_e(this.xUm/10,-32767,32767),!0),e.setInt16(2,_e(this.yUm/10,-32767,32767),!0),e.setInt16(4,_e(this.zUm/10,-32767,32767),!0),t[6]=_e(this.level,0,255),t[7]=_e(this.palette,0,255),t}}function _d(i,t=!1){if(i.length>is)throw new Error(`${i.length} points > ${is}`);const e=new Uint8Array(8+i.length*8),n=new DataView(e.buffer);return e[0]=1,e[1]=t?wh:0,n.setUint16(2,i.length,!0),i.forEach((s,r)=>e.set(s.pack(),8+r*8)),e}function vd(i,t=!1){const e=i.length;if(e>Qa)throw new Error(`${e} points > ${Qa}`);const n=hd|(t?wh:0),s=[];for(let r=0;r<Math.max(e,1);r+=is){const a=i.slice(r,r+is),o=new Uint8Array(8+a.length*8),l=new DataView(o.buffer);o[0]=1,o[1]=n,l.setUint16(2,a.length,!0),l.setUint16(4,r,!0),l.setUint16(6,e,!0),a.forEach((c,u)=>o.set(c.pack(),8+u*8)),s.push(o)}return s}function xd(i){return i.pack()}function Md(i,t){const e=new Uint8Array(4),n=new DataView(e.buffer);return n.setUint16(0,_e(i*ji,0,ji),!0),n.setUint16(2,_e(t,0,65535),!0),e}class Ar{mode;flags;outputRateHz;loopMs;maxSpeedMmS;maxAccelMmS2;zOffsetUm;level;trapMode;trapRadiusUm;trapPhaseSpan;palette;paletteSpinX10;pathSpinMradS;displayFlags;rateInitial;rateTarget;rateRampMs;constructor(t={}){this.mode=t.mode??Eh,this.flags=t.flags??0,this.outputRateHz=t.outputRateHz??1e3,this.loopMs=t.loopMs??1e3,this.maxSpeedMmS=t.maxSpeedMmS??60,this.maxAccelMmS2=t.maxAccelMmS2??600,this.zOffsetUm=t.zOffsetUm??0,this.level=t.level??111,this.trapMode=t.trapMode??od,this.trapRadiusUm=t.trapRadiusUm??0,this.trapPhaseSpan=t.trapPhaseSpan??0,this.palette=t.palette??[[255,255,255]],this.paletteSpinX10=t.paletteSpinX10??0,this.pathSpinMradS=t.pathSpinMradS??0,this.displayFlags=t.displayFlags??ld|cd,this.rateInitial=t.rateInitial??1,this.rateTarget=t.rateTarget??1,this.rateRampMs=t.rateRampMs??0}pack(){if(this.outputRateHz<fd||this.outputRateHz>pd)throw new Error(`output rate ${this.outputRateHz} Hz out of range`);if(this.loopMs<1||this.loopMs>6e4)throw new Error(`loop_ms ${this.loopMs} out of range`);if(this.palette.length<1||this.palette.length>dd)throw new Error("palette needs 1..16 colours");const t=new Uint8Array(84),e=new DataView(t.buffer);return t[0]=this.mode,t[1]=this.flags&255,e.setUint16(2,this.outputRateHz,!0),e.setUint16(4,this.loopMs,!0),e.setUint16(6,_e(this.maxSpeedMmS,0,1e4),!0),e.setUint16(8,_e(this.maxAccelMmS2,0,65535),!0),e.setInt16(10,_e(this.zOffsetUm/10,-32767,32767),!0),t[12]=_e(this.level,0,255),t[13]=this.trapMode,e.setUint16(14,_e(this.trapRadiusUm/10,0,5e3),!0),t[16]=this.trapPhaseSpan&255,t[17]=this.palette.length,this.palette.forEach(([n,s,r],a)=>{t[18+3*a]=_e(n,0,255),t[19+3*a]=_e(s,0,255),t[20+3*a]=_e(r,0,255)}),t[66]=_e(this.paletteSpinX10,0,250),e.setInt16(67,_e(this.pathSpinMradS,-32767,32767),!0),t[76]=this.displayFlags&255,e.setUint16(78,_e(this.rateInitial*ji,0,ji),!0),e.setUint16(80,_e(this.rateTarget*ji,0,ji),!0),e.setUint16(82,_e(this.rateRampMs,0,65535),!0),t}}function yd(i){if(i.length!==52)throw new Error(`motion status length ${i.length}`);const t=new DataView(i.buffer,i.byteOffset,i.byteLength),e=i[0];return{state:e,flags:i[1],outputRateHz:t.getUint16(2,!0),pathPoints:t.getUint16(4,!0),loopMs:t.getUint16(6,!0),xUm:t.getInt32(8,!0),yUm:t.getInt32(12,!0),zUm:t.getInt32(16,!0),level:i[20],trapMode:i[21],phase:t.getUint16(22,!0)/65536,serviceMaxUs:t.getUint16(24,!0),serviceAvgUs:t.getUint16(26,!0),renderMaxUs:t.getUint16(28,!0),renderAvgUs:t.getUint16(30,!0),submitMaxUs:t.getUint16(32,!0),submitAvgUs:t.getUint16(34,!0),frames:t.getUint32(36,!0),missedDeadlines:t.getUint32(40,!0),frameErrors:t.getUint32(44,!0),fps:t.getUint32(48,!0)/100,stateName:ud[e]??String(e),running:e===2||e===3}}function Pl(i,t,e){const n=i.subarray(t,e),s=n.indexOf(0),r=s>=0?n.subarray(0,s):n;return new TextDecoder("ascii").decode(r)}function Sd(i){if(i.length!==1118)throw new Error(`profile length ${i.length}`);const t=new DataView(i.buffer,i.byteOffset,i.byteLength),e=t.getUint16(64,!0),n=t.getUint32(80,!0),s=t.getUint32(84,!0),r=t.getUint32(106,!0),a=[];for(let o=0;o<e;o++){const l=110+12*o;a.push([t.getInt32(l,!0),t.getInt32(l+4,!0),t.getInt32(l+8,!0)])}return{model:Pl(i,0,16),firmware:Pl(i,16,32),channelCount:e,carrierHz:n,soundSpeedUmS:s,capabilityFlags:r,coordinatesUm:a,hasDisplay:(r&Sh)!==0,maxPathPoints:r&bh?Qa:is}}function bd(i){if(i.length!==8)throw new Error(`status length ${i.length}`);return new DataView(i.buffer,i.byteOffset,i.byteLength).getUint32(0,!0)}function Ed(){return{model:"UMH-84 demo",firmware:"7.4.0-demo",channelCount:vn.length,carrierHz:4e4,soundSpeedUmS:343e6,capabilityFlags:Sh|bh,coordinatesUm:vn.map(([i,t])=>[Math.round(i*1e3),Math.round(t*1e3),xh*1e3]),hasDisplay:!0,maxPathPoints:1024}}function wd(i){const t=Math.max(0,Math.min(1,i));return t*t*(3-2*t)}class Ll{profile=Ed();label="演示设备 · UMH-84";points=[];config=new Ar;targetX=0;targetY=0;level=88;running=!1;hover=!1;pathMode=!1;startedAt=0;phase=0;loopMs=1e3;rateTarget=1;rateInitial=1;rampMs=0;async systemFlags(){let t=nd;return(this.hover||this.running)&&(t|=id),t}async motionStatus(){const t=performance.now();let e=this.targetX,n=this.targetY;if(this.pathMode&&this.running&&this.points.length>0){const r=(t-this.startedAt)/1e3,a=this.rampMs/1e3;let o;a>0&&r<a?o=this.rateInitial+(this.rateTarget-this.rateInitial)*wd(r/a):o=this.rateTarget;const l=Math.max(.005,this.loopMs/1e3);this.phase=(this.phase+o*.001/l)%1;const c=this.points.length,u=this.phase*c,h=Math.floor(u)%c,d=(h+1)%c,p=u-Math.floor(u);e=(this.points[h].xUm*(1-p)+this.points[d].xUm*p)/1e3,n=(this.points[h].yUm*(1-p)+this.points[d].yUm*p)/1e3}return{state:this.running?2:this.hover?1:0,flags:this.pathMode?14:6,outputRateHz:this.config.outputRateHz,pathPoints:this.points.length,loopMs:this.loopMs,xUm:Math.round(e*1e3),yUm:Math.round(n*1e3),zUm:102e3,level:this.level,trapMode:this.config.trapMode,phase:this.phase,serviceMaxUs:42,serviceAvgUs:21,renderMaxUs:61,renderAvgUs:33,submitMaxUs:9,submitAvgUs:4,frames:Math.floor(t/5),missedDeadlines:0,frameErrors:0,fps:2e3,stateName:this.running?"RUNNING":this.hover?"READY":"OFF",running:this.running}}async upload(t,e=!1){if(t.length>this.profile.maxPathPoints)throw new Error("演示设备路径点数超限");this.points=t.map(n=>new Or(n.xUm,n.yUm,n.zUm,n.level,n.palette)),this.points.length>0&&(this.targetX=this.points[0].xUm/1e3,this.targetY=this.points[0].yUm/1e3)}async configure(t){this.config=t,this.level=t.level,this.loopMs=t.loopMs,this.rateInitial=t.rateInitial,this.rateTarget=t.rateTarget,this.rampMs=t.rateRampMs,this.pathMode=t.mode===Ja,this.running=this.pathMode,this.hover=!0,this.startedAt=performance.now(),this.pathMode&&(this.phase=0)}async target(t){this.targetX=t.xUm/1e3,this.targetY=t.yUm/1e3,this.level=t.level}async rate(t,e){this.rateTarget=t,this.rampMs=e,this.startedAt=performance.now()}async start(){this.running=!0,this.hover=!0,this.startedAt=performance.now(),this.phase=0}async stop(){this.running=!1,this.hover=!1,this.phase=0}async clear(){this.running=!1,this.hover=!1,this.phase=0}async close(){this.running=!1,this.hover=!1}}class Td extends Error{constructor(t,e){super(`device rejected 0x${t.toString(16)}: ${ed[e]??String(e)}`),this.messageType=t,this.status=e,this.name="DeviceError"}messageType;status}class Yo{constructor(t,e){this.port=t,this.info=t.getInfo(),this.portName=e}port;portName;info;parser=new gd;pending=null;queue=Promise.resolve();reader=null;writer=null;transaction=0;closed=!1;timeoutS=1.5;onDisconnect=null;static async open(t){await t.open({baudRate:2e6,bufferSize:65536});const e=t.getInfo(),n=`Web Serial ${e.usbVendorId?.toString(16).padStart(4,"0")??"????"}:${e.usbProductId?.toString(16).padStart(4,"0")??"????"}`,s=new Yo(t,n);return s.start(),t.addEventListener("disconnect",s.handleDisconnect),s}start(){if(!this.port.readable)throw new Error("串口不可读");if(this.reader=this.port.readable.getReader(),this.writer=this.port.writable?.getWriter()??null,!this.writer)throw new Error("串口不可写");this.pump()}async pump(){try{for(;!this.closed&&this.reader;){const{value:t,done:e}=await this.reader.read();if(e)break;if(!(!t||t.length===0))for(this.parser.feed(t);;){const n=this.parser.next();if(!n)break;this.dispatch(n)}}}catch(t){this.closed||this.failAll(t instanceof Error?t:new Error(String(t)))}finally{this.closed||this.handleDisconnect()}}dispatch(t){const e=this.pending;if(!(!e||t.transactionId!==e.tid)){if(this.pending=null,window.clearTimeout(e.timer),t.messageType===Ju||(t.flags&td)!==0){e.reject(new Td(e.messageType,t.payload[0]??-1));return}if(t.messageType!==e.expect){e.reject(new Error(`0x${e.messageType.toString(16)}: expected 0x${e.expect.toString(16)}, got 0x${t.messageType.toString(16)}`));return}e.resolve(t.payload)}}failAll(t){this.pending&&(window.clearTimeout(this.pending.timer),this.pending.reject(t),this.pending=null)}handleDisconnect=()=>{this.closed||(this.closed=!0,this.failAll(new Error("设备已断开")),this.onDisconnect?.())};request(t,e=new Uint8Array(0),n=Za,s){const r=async()=>{if(this.closed||!this.writer)throw new Error("串口未连接");this.transaction=this.transaction+1>>>0;const o=this.transaction,l=(s??this.timeoutS)*1e3,c=new Promise((h,d)=>{const p=window.setTimeout(()=>{this.pending?.tid===o&&(this.pending=null),d(new Error(`no reply to 0x${t.toString(16)} on ${this.portName}`))},l);this.pending={tid:o,expect:n,messageType:t,resolve:h,reject:d,timer:p}}),u=md(t,e,o);return await this.writer.write(u),c},a=this.queue.then(r,r);return this.queue=a.then(()=>{},()=>{}),a}async close(){if(!this.closed){this.closed=!0,this.failAll(new Error("连接已关闭"));try{this.port.removeEventListener("disconnect",this.handleDisconnect),await this.reader?.cancel(),this.reader?.releaseLock(),this.writer?.releaseLock(),await this.port.close()}catch{}}}}class qo{constructor(t,e){this.link=t,this.profile=e,this.label=t.portName}link;profile;label;static async open(t){const e=await Yo.open(t);try{const n=Sd(await e.request(Vu,new Uint8Array(0),Gu));return new qo(e,n)}catch(n){throw await e.close(),n}}get portName(){return this.link.portName}set onDisconnect(t){this.link.onDisconnect=t}async close(){await this.link.close()}async systemFlags(){return bd(await this.link.request(Wu,new Uint8Array(0),Xu))}async motionStatus(){return yd(await this.link.request(Al,new Uint8Array(0),Al))}async upload(t,e=!1){if(t.length>this.profile.maxPathPoints)throw new Error(`${t.length} path points, firmware ${this.profile.firmware} holds ${this.profile.maxPathPoints}`);if(t.length<=is){await this.link.request(Tl,_d(t,e));return}for(const n of vd(t,e))await this.link.request(Tl,n)}async configure(t){await this.link.request(qu,t.pack())}async target(t){await this.link.request(ju,xd(t))}async rate(t,e){await this.link.request(Zu,Md(t,e))}async start(){await this.link.request($u)}async stop(){await this.link.request(Ku,new Uint8Array(0),Za,2)}async clear(){await this.link.request(Yu,new Uint8Array(0),Za,2)}}const Dl=1155,Ul=22336;function Il(){return typeof navigator<"u"&&!!navigator.serial}async function Ad(){const i=navigator.serial;if(!i)throw new Error("此浏览器不支持 Web Serial，请使用 Chrome 或 Edge（HTTPS 页面）");const e=(await i.getPorts()).find(n=>{const s=n.getInfo();return s.usbVendorId===Dl&&s.usbProductId===Ul});return e||i.requestPort({filters:[{usbVendorId:Dl,usbProductId:Ul}]})}class Rd{demo=new Ll;device=this.demo;mode="demo";busy=!1;error="";version=0;listeners=new Set;get current(){return this.device}get isDemo(){return this.mode==="demo"}get state(){return{mode:this.mode,busy:this.busy,device:this.device,label:this.device.label,version:this.version,error:this.error}}get serialAvailable(){return Il()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(){const t=this.state;for(const e of this.listeners)e(t)}async connect(){if(!(this.mode==="serial"||this.busy)){if(!Il())throw new Error("此浏览器不支持 Web Serial，请使用 Chrome 或 Edge");this.busy=!0,this.error="",this.emit();try{const t=await Ad(),e=await qo.open(t);e.onDisconnect=()=>{this.device===e&&this.fallback("设备已断开，已切换到演示模式")},await this.demo.close(),this.device=e,this.mode="serial",this.version++,this.busy=!1,this.emit()}catch(t){throw this.busy=!1,this.error=t instanceof Error?t.message:String(t),this.emit(),t}}}async disconnect(t="已断开设备，回到演示模式"){if(this.mode!=="serial")return;await this.device.close(),this.fallback(t)}fallback(t){this.demo=new Ll,this.device=this.demo,this.mode="demo",this.error=t,this.version++,this.busy=!1,this.emit()}clearError(){this.error="",this.emit()}async dispose(){await this.device.close()}}function Cd(i){return{...i,points:i.points.map(t=>new Or(t.xUm,t.yUm,t.zUm,t.level,t.palette))}}class Pd{worker;pending=new Map;nextId=1;ready=null;constructor(){this.worker=new Worker(new URL(""+new URL("planWorker-CeSh72Lz.js",import.meta.url).href,import.meta.url),{type:"module"}),this.worker.addEventListener("message",this.onMessage),this.worker.addEventListener("error",t=>{for(const e of this.pending.values())e.reject(new Error(t.message||"规划线程出错"));this.pending.clear()})}onMessage=t=>{const e=t.data,n=Number(e.id??-1),s=this.pending.get(n);if(s){if(this.pending.delete(n),e.type==="ready"){s.resolve(e.ms);return}if(e.type==="error"){s.reject(new Error(String(e.message??"worker error")));return}e.type==="plan-result"?s.resolve(Cd(e.plan)):s.resolve(e.map??e.ms)}};request(t){const e=this.nextId++;return new Promise((n,s)=>{this.pending.set(e,{resolve:n,reject:s}),this.worker.postMessage({...t,id:e})})}warm(){return this.ready||(this.ready=this.request({type:"warmup"}).then(()=>{})),this.ready}async plan(t,e,n,s){return this.request({type:"plan",cfg:t,name:e,maxPoints:n,periodS:s})}async displayField(t){return this.request({type:"display-field",...t})}dispose(){this.worker.terminate();for(const t of this.pending.values())t.reject(new Error("planning worker disposed"));this.pending.clear()}}function it(i,t={},...e){const n=document.createElement(i);for(const[s,r]of Object.entries(t))if(r!=null)if(s==="class")n.className=String(r);else if(s==="text")n.textContent=String(r);else if(s==="html")n.innerHTML=String(r);else if(s==="style"&&typeof r=="object")Object.assign(n.style,r);else if(s==="dataset"&&typeof r=="object")for(const[a,o]of Object.entries(r))n.dataset[a]=String(o);else if(s==="on"&&typeof r=="object")for(const[a,o]of Object.entries(r))n.addEventListener(a,o);else if(s==="attrs"&&typeof r=="object")for(const[a,o]of Object.entries(r))o===!1||o===null||o===void 0||n.setAttribute(a,o===!0?"":String(o));else s in n?n[s]=r:n.setAttribute(s,String(r));return Ld(n,e),n}function Ld(i,t){for(const e of t)e==null||e===!1||i.appendChild(e instanceof Node?e:document.createTextNode(String(e)))}function Ts(i){for(;i.firstChild;)i.removeChild(i.firstChild)}function ss(i,t=15){const e=document.createElement("i");return e.setAttribute("data-lucide",i),e.style.width=`${t}px`,e.style.height=`${t}px`,e.setAttribute("aria-hidden","true"),e}function Ge(i,t=1){return Number.isFinite(i)?i.toFixed(t):"—"}function Nl(i){return`#${i.map(t=>Math.max(0,Math.min(255,Math.round(t))).toString(16).padStart(2,"0")).join("")}`}function Dd(i){const t=i.replace("#",""),e=t.length===3?t.split("").map(s=>s+s).join(""):t,n=Number.parseInt(e,16);return[n>>16&255,n>>8&255,n&255]}function Ud(i,t){let e;const n=((...s)=>{e!==void 0&&window.clearTimeout(e),e=window.setTimeout(()=>i(...s),t)});return n.cancel=()=>{e!==void 0&&window.clearTimeout(e)},n}const ds=1.2,Ji=2*Math.PI*Xo/Yr,Fl=2*Math.PI*Xo,Id=Yr/Xo,Nd=.0045,Fd=6;function Od(i){const t=Math.abs(i);if(t<1e-12)return .5*i;if(t<10){const e=i*.5;let n=e,s=e;const r=-e*e;for(let a=1;a<48&&(n*=r/(a*(a+1)),s+=n,!(Math.abs(n)<Math.abs(s)*1e-17));a++);return s}return Math.sqrt(2/(Math.PI*t))*Math.cos(t-3*Math.PI/4)}function Bd(i,t,e,n=.002,s=0){const r=e.count,a=new Float64Array(r),o=new Float64Array(r);if(i===Fd){for(let m=0;m<r;m++){const f=e.xyz[m*3]-t[0],w=e.xyz[m*3+1]-t[1],E=e.xyz[m*3+2]-t[2],y=Math.atan2(w,f)-Ji*Math.hypot(f,w,E);a[m]=Math.cos(y),o[m]=Math.sin(y)}return{re:a,im:o}}const l=Math.max(n,5e-4),c=s===0?256:s,u=[];for(let m=0;m<8;m++){const f=2*Math.PI*m/8;u.push([l*Math.cos(f),l*Math.sin(f),0])}let h,d;switch(i){case 1:h=[[0,0,l],[0,0,-l]],d=[0,Math.PI];break;case 2:h=[[0,l,0],[0,-l,0]],d=[0,Math.PI];break;case 3:h=u,d=u.map((m,f)=>Math.PI*(f&1));break;case 4:h=u,d=u.map((m,f)=>2*Math.PI*Math.floor(f*c/8)/256);break;case 5:h=[...u.filter((m,f)=>f%2===0).map(([m,f])=>[m,f,.5*l]),...u.filter((m,f)=>f%2===0).map(([m,f])=>[m,f,-.5*l])],d=[0,0,0,0,Math.PI,Math.PI,Math.PI,Math.PI];break;default:h=[[0,0,0]],d=[0]}const p=new Float64Array(r),g=new Float64Array(r),_=1/Math.sqrt(h.length);for(let m=0;m<h.length;m++){const[f,w,E]=h[m],y=d[m];for(let A=0;A<r;A++){const C=e.xyz[A*3]-(t[0]+f),L=e.xyz[A*3+1]-(t[1]+w),U=e.xyz[A*3+2]-(t[2]+E),x=Math.hypot(C,L,U),S=y-Ji*x;p[A]+=Math.cos(S)*_,g[A]+=Math.sin(S)*_}}for(let m=0;m<r;m++){const f=Math.hypot(p[m],g[m]);f>1&&(p[m]/=f,g[m]/=f),a[m]=p[m],o[m]=g[m]}return{re:a,im:o}}function Ol(i){const t=Ji*Nd*Math.sqrt(mh(1-i*i,0,1));let e=1;return t>1e-9&&(e=2*Od(t)/t),i>0?e:0}class qr{src;tableZ;trapMode;focus;drive;image;k1;k2;beadRadius;bead;tableDistanceMm;focusOffsetMm;constructor(t,e,n,s=[0,0],r=0,a){this.bead={...t},this.tableDistanceMm=e,this.focusOffsetMm=r,this.src=a??ku();let o=0;for(let h=0;h<this.src.count;h++)o+=this.src.xyz[h*3+2];this.tableZ=o/this.src.count+e*.001,this.trapMode=n,this.focus=[s[0]*.001,s[1]*.001,this.tableZ+r*.001],this.drive=Bd(n,this.focus,this.src),this.image=new Float64Array(this.src.xyz.length);for(let h=0;h<this.src.count;h++)this.image[h*3]=this.src.xyz[h*3],this.image[h*3+1]=this.src.xyz[h*3+1],this.image[h*3+2]=2*this.tableZ-this.src.xyz[h*3+2];const l=t.diameterMm*5e-4,c=4/3*Math.PI*l**3,u=2*(t.densityKgM3-ds)/(2*t.densityKgM3+ds);this.k1=c/(4*ds*Yr**2),this.k2=3*c*u/(8*ds*Fl**2),this.beadRadius=l}zOfHeight(t){return this.tableZ-t}pressure(t){const e=t.length/3,n=new Float64Array(e),s=new Float64Array(e),r=new Float64Array(e*3),a=new Float64Array(e*3);return this.accumulate(t,n,s,r,a),{re:n,im:s,gre:r,gim:a}}potential(t){const e=t.length/3,n=new Float64Array(e),s=new Float64Array(e),r=new Float64Array(e*3),a=new Float64Array(e*3);this.accumulate(t,n,s,r,a);const o=new Float64Array(e);for(let l=0;l<e;l++){const c=n[l]*n[l]+s[l]*s[l];let u=0;for(let h=0;h<3;h++){const d=r[l*3+h],p=a[l*3+h];u+=d*d+p*p}o[l]=this.k1*c-this.k2*u}return o}intensity(t){const{re:e,im:n,gre:s,gim:r}=this.pressure(t),a=e.length,o=new Float64Array(a*3),l=1/(2*Fl*ds);for(let c=0;c<a;c++)for(let u=0;u<3;u++)o[c*3+u]=(e[c]*r[c*3+u]-n[c]*s[c*3+u])*l;return o}accumulate(t,e,n,s,r){const a=t.length/3,o=this.src.count,l=this.src.xyz,c=this.image,u=this.drive.re,h=this.drive.im,d=Ji;for(let p=0;p<2;p++){const g=p===0?1:-1,_=p===0?l:c;for(let m=0;m<a;m++){const f=t[m*3],w=t[m*3+1],E=t[m*3+2];let y=e[m],A=n[m],C=s[m*3],L=r[m*3],U=s[m*3+1],x=r[m*3+1],S=s[m*3+2],b=r[m*3+2];for(let F=0;F<o;F++){const B=f-_[F*3],z=w-_[F*3+1],q=E-_[F*3+2],G=Math.sqrt(B*B+z*z+q*q);if(G<1e-12)continue;const Z=Ol(g*q/G);if(Z===0)continue;const V=d*G,st=Math.cos(V),ut=Math.sin(V),Mt=Z/G,Nt=u[F],ie=h[F],qt=(Nt*st-ie*ut)*Mt,X=(Nt*ut+ie*st)*Mt;y+=qt,A+=X;const ot=-1/(G*G),et=d/G,Et=qt*ot-X*et,wt=qt*et+X*ot;C+=Et*B,L+=wt*B,U+=Et*z,x+=wt*z,S+=Et*q,b+=wt*q}e[m]=y,n[m]=A,s[m*3]=C,r[m*3]=L,s[m*3+1]=U,r[m*3+1]=x,s[m*3+2]=S,r[m*3+2]=b}}}axialWells(t=30,e=0,n=0){const s=Math.trunc(t*60),r=Qr(this.beadRadius,t*.001,s),a=new Float64Array(s),o=new Float64Array(s*3);for(let h=0;h<s;h++)a[h]=this.tableZ-r[h],o[h*3]=e,o[h*3+1]=n,o[h*3+2]=a[h];const l=this.potential(o),c=yl(l,a),u=[];for(let h=1;h<s-1;h++)if(l[h]<l[h-1]&&l[h]<=l[h+1]){let d=h;for(;d>0&&l[d-1]>=l[d];)d--;let p=-1/0;for(let g=d;g<=h;g++)c[g]>p&&(p=c[g]);u.push({heightMm:r[h]*1e3,z:a[h],forceUp:p})}return u}lateralLaw(t,e=9,n=1.2,s=0,r=1){const a=Qr(0,e*.001,Math.trunc(e*5)+1),o=new Float64Array(Math.trunc(n*10)*2+1);for(let c=0;c<o.length;c++)o[c]=t+(-n+2*n*c/(o.length-1))*.001;const l=new Float64Array(a.length);for(let c=0;c<a.length;c++){const u=r*a[c]+this.focus[0],h=s+this.focus[1];let d=1/0;for(let p=0;p<o.length;p++){const g=this.potentialPoint(u,h,o[p]);g<d&&(d=g)}l[c]=d}return{xs:a,force:yl(l,a)}}potentialPoint(t,e,n){let s=0,r=0,a=0,o=0,l=0,c=0,u=0,h=0;const d=this.src.count;for(let _=0;_<2;_++){const m=_===0?1:-1,f=_===0?this.src.xyz:this.image;for(let w=0;w<d;w++){const E=t-f[w*3],y=e-f[w*3+1],A=n-f[w*3+2],C=Math.sqrt(E*E+y*y+A*A);if(C<1e-12)continue;const L=Ol(m*A/C);if(L===0)continue;const U=Ji*C,x=Math.cos(U),S=Math.sin(U),b=L/C,F=this.drive.re[w],B=this.drive.im[w],z=(F*x-B*S)*b,q=(F*S+B*x)*b;s+=z,r+=q;const G=-1/(C*C),Z=Ji/C,V=z*G-q*Z,st=z*Z+q*G;a+=V*E,o+=st*E,l+=V*y,c+=st*y,u+=V*A,h+=st*A}}const p=s*s+r*r,g=a*a+o*o+l*l+c*c+u*u+h*h;return this.k1*p-this.k2*g}xyGain(t,e=8){const n=new qr(this.bead,this.tableDistanceMm,this.trapMode,[e,0],this.focusOffsetMm),s=Qr((e-1.5)*.001,(e+1.5)*.001,301),r=new Float64Array(s.length*3);for(let _=0;_<s.length;_++)r[_*3]=s[_],r[_*3+2]=t;const a=n.potential(r);let o=0;for(let _=1;_<a.length;_++)a[_]<a[o]&&(o=_);const l=Math.min(Math.max(o,1),s.length-2),c=a[l-1],u=a[l],h=a[l+1],d=s[1]-s[0],p=c-2*u+h;return(s[l]+(p!==0?.5*d*((c-h)/p):0))/(e*.001)}}const zd=20;function kd(i,t,e,n,s,r=zd){const a=new qr(i,t,e,[r,0],n),o=a.axialWells(12,a.focus[0],a.focus[1]);if(o.length===0||s<=0)return 0;const l=o[0].z;let c=1/0;for(const h of[1,-1]){const{force:d}=a.lateralLaw(l,9,1.2,0,h);let p=-1/0;for(let g=0;g<d.length;g++)d[g]>p&&(p=d[g]);c=Math.min(c,p)}const u=c/s;return u>0&&u<.999?r/Math.sqrt(-Math.log(u)):0}function Hd(i,t,e,n){const s=new qr(i,t,e,[0,0],n),r=s.axialWells(30);if(r.length===0)throw new Error("no stable height on the axis for this field");const a=r[0],{xs:o,force:l}=s.lateralLaw(a.z);let c=o.length-1;for(let A=2;A<l.length;A++)if(l[A]<0){c=A;break}const u=Math.min(c+1,l.length);let h=0;for(let A=1;A<u;A++)l[A]>l[h]&&(h=A);const d=l[h],p=5e-4,g=new Float64Array([p,0,a.z]),_=s.intensity(g)[1],m=Math.PI*s.beadRadius**2*_/Yr/p,f=Ru(p,o,l)/p,w=t*.5,E=s.axialWells(w+Id*1e3);let y=0;if(E.length>0){let A=E[0];for(const C of E)Math.abs(C.heightMm-w)<Math.abs(A.heightMm-w)&&(A=C);y=A.forceUp}return{trapMode:e,rungHeightsMm:r.map(A=>Math.round(A.heightMm*100)/100),heightMm:a.heightMm,axialForce:a.forceUp,lateralPeak:d,lateralToAxial:d/a.forceUp,peakOffsetMm:o[h]*1e3,basinMm:o[c]*1e3,xyGain:s.xyGain(a.z),pumping:f>0?Math.abs(m)/f:1/0,midForce:y,offaxisR0Mm:kd(i,t,e,n,d)}}const Bl=new Map;function Vd(i,t,e,n=0){const s=[Math.round(i.diameterMm*1e3)/1e3,Math.round(i.densityKgM3*1e3)/1e3,Math.round(t*100)/100,e,Math.round(n*100)/100].join("|"),r=Bl.get(s);if(r)return r;const a=Hd(i,t,e,n);return Bl.set(s,a),a}const Gd=1.2,Br=181e-7;function Wd(i){return mh(i,0,255)*128/255}function Ps(i){return Math.sin(Math.PI*Wd(i)/256)**2}function Xd(i,t){const e=i.trap,n=t??e.level,s=Uu(i.bead.diameterMm,i.bead.densityKgM3),r=hi(i);let a=3.5,o=7,l=0,c=0,u=0;try{const m=Vd(i.bead,e.tableDistanceMm,r,e.focusOffsetMm);a=m.peakOffsetMm,o=m.basinMm,l=m.heightMm,c=m.pumping,u=m.offaxisR0Mm}catch{}const h=Ps(n),d=Iu(i),p=d?h/Math.max(1e-9,Ps(d)):0;let g=0,_=Fr(i);return e.mount==="side"&&(g=Ml,_=d?Ml/Math.max(1e-9,Ps(d)):Fr(i)),{mass:s,radius:i.bead.diameterMm*5e-4,fMax:s*Math.max(_,1e-6)*h,dPk:a*.001,gravityInPlane:g,extraZeta:e.extraDampingRatio,holdRatio:p,basin:o*.001,heightMm:l,pumping:c,offaxisR0:u*.001}}function Yd(i){return i.fMax*.5*Math.PI/i.dPk}function qd(i,t){const e=Math.abs(t),n=Gd*e*2*i.radius/Br;return 6*Math.PI*Br*i.radius*e*(1+.15*n**.687)}function $d(i){return 6*Math.PI*Br*i.radius+2*i.extraZeta*Math.sqrt(Yd(i)*i.mass)}function jd(i,t,e){return i.offaxisR0<=0?1:Math.exp(-(t*t+e*e)/(i.offaxisR0*i.offaxisR0))}function Th(i,t,e,n){const s=jd(i,n,0),r=Math.max($d(i)-6*Math.PI*Br*i.radius,0),a=4001;let o=0;for(let l=0;l<a;l++){const c=n+2*i.dPk*l/(a-1),u=e*c,h=i.mass*e*e*c,d=qd(i,u)+r*u,p=Math.hypot(h,d),g=p/(t*s);if(!(g<1)||p<=0)continue;const _=i.dPk*Math.asin(Math.min(g,1))*2/Math.PI,m=Math.hypot(c-_*h/p,_*d/p);m>o&&(o=m)}return o}function Kd(i,t,e,n){const s=2*Math.PI*t;let r=1e-7,a=1;for(let o=0;o<80;o++){const l=Math.sqrt(r*a);Th(i,l,s,e)>=e?a=l:r=l}return a/(i.mass*Math.max(Ps(n),1e-9))}function Zd(i,t){let e=.1,n=500;for(let s=0;s<60;s++){const r=Math.sqrt(e*n);Th(i,i.fMax,2*Math.PI*r,t)>=t?e=r:n=r}return e}function Ah(i,t){const e=i.length,n=new Float64Array(e);let s=0;for(let o=0;o<e;o++){const l=(o+1)%e;n[o]=Math.hypot(i[l]-i[o],t[l]-t[o]),s+=n[o]}const r=new Float64Array(e);let a=0;for(let o=0;o<e;o++)r[o]=s>0?a/s:0,a+=n[o];return r}function Bs(i,t,e,n,s=[]){const r=t.length,a=new Uint8Array(r);for(const o of s)a[o]=1;return{name:i,x:t,y:e,corners:a,hue:Ah(t,e),visible:new Uint8Array(r).fill(1)}}function Rh(i,t,e){const n=t.length;return{name:i,x:t,y:e,corners:new Uint8Array(n).fill(1),hue:Ah(t,e),visible:new Uint8Array(n).fill(1)}}function Ch(i,t=1,e=0){const n=new Float64Array(i),s=new Float64Array(i);for(let r=0;r<i;r++){const a=e+2*Math.PI*r/i;n[r]=t*Math.cos(a),s[r]=t*Math.sin(a)}return{x:n,y:s}}function Jd(i=360){const{x:t,y:e}=Ch(i);return Bs("circle",t,e)}function ea(i,t,e){const{x:n,y:s}=Ch(i,1,e*Math.PI/180);return Rh(t,n,s)}function Qd(i=5,t=.42){const e=2*i,n=new Float64Array(e),s=new Float64Array(e);for(let r=0;r<e;r++){const a=Math.PI/2+Math.PI*r/i,o=r%2===0?1:t;n[r]=o*Math.cos(a),s[r]=o*Math.sin(a)}return Rh("star",n,s)}function tf(i=400){const t=new Float64Array(i),e=new Float64Array(i);let n=0;for(let l=0;l<i;l++){const c=2*Math.PI*l/i,u=16*Math.sin(c)**3,h=13*Math.cos(c)-5*Math.cos(2*c)-2*Math.cos(3*c)-Math.cos(4*c)-2.5;t[l]=u,e[l]=h,n=Math.max(n,Math.hypot(u,h))}for(let l=0;l<i;l++)t[l]/=n,e[l]/=n;let s=0,r=0,a=1/0,o=1/0;for(let l=0;l<i;l++){const c=2*Math.PI*l/i,u=Math.abs(c),h=Math.abs(c-Math.PI);u<a&&(a=u,s=l),h<o&&(o=h,r=l)}return Bs("heart",t,e,void 0,[s,r])}function ef(i=3,t=720){const e=new Float64Array(t),n=new Float64Array(t);for(let s=0;s<t;s++){const r=2*Math.PI*s/t,a=Math.cos(i*r);e[s]=a*Math.cos(r),n[s]=a*Math.sin(r)}return Bs("rose",e,n)}function nf(i=3,t=2,e=720){const n=new Float64Array(e),s=new Float64Array(e);let r=0;for(let a=0;a<e;a++){const o=2*Math.PI*a/e,l=Math.sin(i*o+Math.PI/2),c=Math.sin(t*o);n[a]=l,s[a]=c,r=Math.max(r,Math.hypot(l,c))}for(let a=0;a<e;a++)n[a]/=r,s[a]/=r;return Bs("lissajous",n,s)}function sf(i=480){const t=new Float64Array(i),e=new Float64Array(i);for(let n=0;n<i;n++){const s=2*Math.PI*n/i;t[n]=Math.cos(s),e[n]=.5*Math.sin(2*s)}return Bs("infinity",t,e)}const rf={circle:Jd,square:()=>ea(4,"square",45),triangle:()=>ea(3,"triangle",90),hexagon:()=>ea(6,"hexagon",0),star:Qd,heart:tf,rose:ef,lissajous:nf,infinity:sf},zl=new Set(["KeyW","KeyA","KeyS","KeyD"]),na=.12;function af(i){return i instanceof HTMLElement&&(i.matches("input, textarea, select")||i.isContentEditable)}class of{constructor(t,e,n=40){this.config=t,this.onMove=e,this.boundsMm=n}config;onMove;x=0;y=0;vx=0;vy=0;raf=0;last=0;lastEmit=0;keys=new Set;running=!1;boundsMm;get position(){return{xMm:this.x,yMm:this.y}}get active(){return this.running}start(t,e){this.stop(),this.x=t,this.y=e,this.vx=0,this.vy=0,this.running=!0,this.last=performance.now(),this.lastEmit=0,window.addEventListener("keydown",this.keyDown),window.addEventListener("keyup",this.keyUp),window.addEventListener("blur",this.clearKeys),this.onMove(this.sample()),this.raf=requestAnimationFrame(this.loop)}stop(){this.running=!1,cancelAnimationFrame(this.raf),this.raf=0,window.removeEventListener("keydown",this.keyDown),window.removeEventListener("keyup",this.keyUp),window.removeEventListener("blur",this.clearKeys),this.keys.clear(),this.vx=0,this.vy=0}setPosition(t,e){this.x=Math.max(-this.boundsMm,Math.min(this.boundsMm,t)),this.y=Math.max(-this.boundsMm,Math.min(this.boundsMm,e)),this.vx=0,this.vy=0,this.running&&this.onMove(this.sample())}sample(){return{xMm:this.x,yMm:this.y,vxMmS:this.vx,vyMmS:this.vy}}keyDown=t=>{!this.running||t.ctrlKey||t.metaKey||t.altKey||af(t.target)||document.querySelector("dialog[open]")||zl.has(t.code)&&(t.preventDefault(),this.keys.add(t.code))};keyUp=t=>{zl.has(t.code)&&this.keys.delete(t.code)};clearKeys=()=>{this.keys.clear()};gamepad(){if(!navigator.getGamepads)return{x:0,y:0};const t=navigator.getGamepads();for(const e of t){if(!e?.connected)continue;const n=e.axes[0]??0,s=e.axes[1]??0,r=Math.hypot(n,s);if(r<na)return{x:0,y:0};const a=(r-na)/((1-na)*r);return{x:n*a,y:-s*a}}return{x:0,y:0}}loop=t=>{if(!this.running)return;const e=Math.min(.05,Math.max(.001,(t-this.last)/1e3));this.last=t;const n=(this.keys.has("KeyD")?1:0)-(this.keys.has("KeyA")?1:0),s=(this.keys.has("KeyW")?1:0)-(this.keys.has("KeyS")?1:0),r=this.gamepad();let a=n+r.x,o=s+r.y;const l=Math.hypot(a,o);l>1&&(a/=l,o/=l);const{speedMmS:c,accelMmS2:u}=this.config(),h=a*c,d=o*c,p=Math.max(.001,u)*e,g=h-this.vx,_=d-this.vy;this.vx+=Math.max(-p,Math.min(p,g)),this.vy+=Math.max(-p,Math.min(p,_)),Math.abs(this.vx)<1e-5&&(this.vx=0),Math.abs(this.vy)<1e-5&&(this.vy=0);const m=this.x,f=this.y;this.x=Math.max(-this.boundsMm,Math.min(this.boundsMm,this.x+this.vx*e)),this.y=Math.max(-this.boundsMm,Math.min(this.boundsMm,this.y+this.vy*e)),this.x===m&&this.vx!==0&&(this.vx=0),this.y===f&&this.vy!==0&&(this.vy=0),(Math.abs(this.vx)>1e-5||Math.abs(this.vy)>1e-5||this.x!==m||this.y!==f)&&t-this.lastEmit>20&&(this.lastEmit=t,this.onMove(this.sample())),this.raf=requestAnimationFrame(this.loop)}}const lf=15;function ce(i,t,e,n,s,r){const a=Math.max(2,Math.ceil(Math.abs(r-s)/lf)),o=[];for(let l=0;l<=a;l++){const c=(s+(r-s)*l/a)*Math.PI/180;o.push([i+e*Math.cos(c),t+n*Math.sin(c)])}return o}function fs(i,t,e=.4){return ce(i,t,e,e,0,360)}function Oe(...i){const t=[];for(const e of i)t.push(...e);return t}Oe([[0,3],[2.5,3]],ce(2.5,1.5,1.5,1.5,90,-90),[[0,0],[0,6],[2.3,6]],ce(2.3,4.5,1.5,1.5,90,-90)),ce(2,3,2,3,50,310),Oe([[0,0],[0,6],[1.5,6]],ce(1.5,3,2.5,3,90,-90),[[0,0]]),Oe(ce(2,3,2,3,50,360),[[2.2,3]]),Oe([[3,6]],ce(1.5,1.5,1.5,1.5,0,-180)),ce(2,3,2,3,0,360),Oe([[0,0],[0,6],[2.3,6]],ce(2.3,4.5,1.5,1.5,90,-90),[[0,3]]),ce(2,3,2,3,0,360),Oe([[0,0],[0,6],[2.3,6]],ce(2.3,4.5,1.5,1.5,90,-90),[[0,3]]),Oe(ce(2,4.5,2,1.5,20,270),ce(2,1.5,2,1.5,90,-160)),Oe([[0,6]],ce(2,2,2,2,180,360),[[4,6]]),ce(1.75,3,1.75,3,0,360),Oe(ce(2,4.2,2,1.8,160,-30),[[0,0],[4,0]]),Oe(ce(2,4.5,1.8,1.5,150,-90),ce(2,1.5,2,1.5,90,-150)),Oe([[3.8,6],[.6,6]],ce(1.9,1.9,1.9,1.9,145,-145)),Oe(ce(2,1.8,2,4.2,70,180),ce(2,1.8,2,1.8,180,540)),Oe(ce(2,4.5,1.7,1.5,-90,270),ce(2,1.5,2,1.5,90,-270)),Oe(ce(2,4.2,2,1.8,0,-360),[[3.5,0]]),fs(.4,.4),fs(.4,.4),Oe(ce(1.75,4.4,1.75,1.6,160,-60),[[1.75,1.8]]),fs(1.75,.4),fs(.4,.4),fs(.4,3.6);function cf(i){const t=Math.trunc(i.planner.drawLevel);return t>0?Math.max(i.trap.level,t):i.trap.level}var Ie=(i=>(i.Idle="idle",i.Hover="hover",i.Running="running",i))(Ie||{});class Be extends Error{constructor(t){super(t),this.name="SessionError"}}const ni=i=>new Promise(t=>window.setTimeout(t,i)),hf=8,uf=.4,df=2.2,ps=1,ff=15,kl=.05,pf=.3;class mf{constructor(t,e){if(this.dev=t,this.cfg=e,!t.profile.hasDisplay)throw new Be(`firmware ${t.profile.firmware} lacks the MOTION_DISPLAY extension (v7.3+); flash the UMH Controller build first`);this.level=e.trap.level,this.hoverLevel=this.level,this.hoverXUm=e.display.centerXMm*1e3,this.hoverYUm=e.display.centerYMm*1e3}dev;cfg;state="idle";plan=null;level;hoverLevel;hoverXUm;hoverYUm;abort={value:!1};runSince=0;playbackRate=1;liveConfig(t){const e=this.cfg.planner;return new Ar({mode:Eh,flags:ta,outputRateHz:e.outputRateHz,maxSpeedMmS:Math.trunc(e.seekSpeedMmS),maxAccelMmS2:Math.trunc(e.seekAccelMmS2),level:this.level,trapMode:hi(this.cfg),palette:t??[[255,255,255]]})}hoverPoint(t,e){const n=Math.round(255*this.cfg.display.hoverBrightness**this.cfg.display.gamma);return new Or(t,e,bl(this.cfg)*1e3,n,0)}async levitate(){this.abort.value=!1;let t=await this.dev.motionStatus();if(await this.dev.systemFlags()&(sd|rd))throw new Be("a defoam vortex program is running; stop it on the device first");if(t.running){if(t.trapMode!==hi(this.cfg))throw new Be(`motion trap_mode ${t.trapMode} is running (we want ${hi(this.cfg)}); stop it first`);return await this.dev.rate(0,this.cfg.planner.rampMs),await ni(this.cfg.planner.rampMs+50),t=await this.dev.motionStatus(),t.outputRateHz===50&&(this.level=t.level),await this.dev.configure(this.liveConfig()),await this.dev.target(this.hoverPoint(t.xUm,t.yUm)),this.hoverXUm=t.xUm,this.hoverYUm=t.yUm,this.state="hover",`已接管悬浮小球，陷阱强度 ${this.level}`}return await this.dev.configure(this.liveConfig()),await this.dev.target(this.hoverPoint(this.hoverXUm,this.hoverYUm)),await this.dev.start(),this.state="hover",`陷阱已打开（强度 ${this.level}）：请把小球放进声场`}async setLevel(t){this.level=Math.max(1,Math.min(255,Math.round(t))),this.state!=="running"&&(this.hoverLevel=this.level),this.state==="hover"&&await this.dev.configure(this.liveConfig())}async liveTarget(t,e,n=this.level){if(this.state==="idle")throw new Be("levitate the bead first");this.state==="running"&&await this.stopDrawing(),this.hoverXUm=t*1e3,this.hoverYUm=e*1e3,await this.dev.target(new Or(this.hoverXUm,this.hoverYUm,bl(this.cfg)*1e3,n,0))}async moveHover(t,e){if(this.state!=="hover")throw new Be("hover moves need a hovering bead");this.hoverXUm=t*1e3,this.hoverYUm=e*1e3,await this.dev.target(this.hoverPoint(this.hoverXUm,this.hoverYUm))}async waitAt(t,e,n,s=30){const r=performance.now()+n*1e3;let a=0;for(;performance.now()<r;){if(this.abort.value)throw new Be("aborted");const o=await this.dev.motionStatus();if(Math.hypot(o.xUm-t,o.yUm-e)<s){if(a++,a>=3){await ni(150);return}}else a=0;await ni(25)}throw new Be("seek timed out")}pathConfig(t,e,n,s){let r=Rl|Cl|ta;(t.raw||this.cfg.planner.interpolation==="linear")&&(r|=ad);const a=t.deviceLoopS??t.periodS,o=t.playbackRate??1;return new Ar({mode:Ja,flags:r,outputRateHz:t.rateHz,loopMs:Math.max(1,Math.min(6e4,Math.round(a*1e3))),maxSpeedMmS:t.raw?1e4:void 0,maxAccelMmS2:t.raw?65535:void 0,level:this.level,trapMode:hi(this.cfg),palette:t.palette,paletteSpinX10:t.paletteSpinX10,rateInitial:t.raw?o:e,rateTarget:t.raw?o:n,rateRampMs:t.raw?0:s})}async setPlaybackRate(t){if(!this.plan?.raw)throw new Be("playback rate is only adjustable in raw mode");if(this.state!=="running")throw new Be("nothing is running");const e=Math.max(.001,Math.min(1,t));return await this.dev.rate(e,0),this.playbackRate=e,this.plan.playbackRate=e,this.plan.periodS=(this.plan.deviceLoopS??this.plan.periodS)/e,this.plan.periodS}async play(t){if(this.state==="running"&&await this.stopDrawing(),this.state!=="hover")throw new Be("levitate the bead first");this.abort.value=!1,await this.dev.upload(t.points);const e=t.points[0],n=Math.hypot(e.xUm-this.hoverXUm,e.yUm-this.hoverYUm);await this.dev.target(this.hoverPoint(e.xUm,e.yUm)),await this.waitAt(e.xUm,e.yUm,3+n*.001/this.cfg.planner.seekSpeedMmS),this.hoverXUm=e.xUm,this.hoverYUm=e.yUm,this.hoverLevel=this.level,this.level=t.level,this.playbackRate=t.playbackRate??1,await this.dev.configure(this.pathConfig(t,0,1,t.rampMs)),this.plan=t,this.runSince=performance.now()/1e3,this.state="running"}async stopDrawing(){if(this.state!=="running")return;const t=this.plan?.raw?0:this.cfg.planner.rampMs;await this.dev.rate(0,t),await ni(t+80);const e=await this.dev.motionStatus();await this.dev.target(this.hoverPoint(e.xUm,e.yUm)),this.level=this.hoverLevel,await this.dev.configure(this.liveConfig()),this.hoverXUm=e.xUm,this.hoverYUm=e.yUm,this.state="hover"}async recolor(t){if(this.state!=="running"||!this.plan)throw new Be("nothing is running");if(!(t.points.length===this.plan.points.length&&Math.abs(t.periodS-this.plan.periodS)<1e-6&&t.points.every((s,r)=>Math.abs(s.xUm-this.plan.points[r].xUm)<10&&Math.abs(s.yUm-this.plan.points[r].yUm)<10)))throw new Be("geometry changed: stop and play the new plan instead");const n=(this.plan?.raw?0:this.cfg.planner.rampMs)-(performance.now()/1e3-this.runSince)*1e3;n>0&&await ni(n),await this.dev.upload(t.points,!0),await this.dev.configure(this.pathConfig(t,1,1,0)),this.plan=t}async drop(){await this.dev.stop(),this.state="idle"}async emergencyStop(){this.abort.value=!0,await this.dev.clear(),this.state="idle"}async dropTest(t,e=16,n=2,s=.8,r){if(this.state!=="hover")throw new Be("hover the bead first");const a=this.level;let o=a;for(;o>e&&!t.value&&!this.abort.value;){o-=n,await this.setLevel(o),r?.(o);const l=performance.now()+s*1e3;for(;performance.now()<l&&!t.value;)await ni(20)}return t.value?(await this.drop(),this.level=a,Math.min(a,o+2*n)):(await this.setLevel(a),null)}async spinTest(t,e={}){if(this.state!=="hover")throw new Be("hover the bead first");const n=e.radiusMm??hf,s=e.sweepS??ff,r=this.cfg,a=r.planner,o=cf(r),l=Xd(r,o),c=n*.001,u=Zd(l,c),h=Math.max(5,Math.round(1e3/(df*u))),d=1e3/h,p=Math.min(uf*u/d,.5),g=Math.min(256,this.dev.profile.maxPathPoints),_=r.display.centerXMm*1e3,m=r.display.centerYMm*1e3,f=[];for(let x=0;x<g;x++){const S=2*Math.PI*x/g;f.push(this.hoverPoint(_+n*1e3*Math.cos(S),m+n*1e3*Math.sin(S)))}this.abort.value=!1,await this.dev.upload(f);const w=f[0],E=Math.hypot(w.xUm-this.hoverXUm,w.yUm-this.hoverYUm);await this.dev.target(this.hoverPoint(w.xUm,w.yUm)),await this.waitAt(w.xUm,w.yUm,3+E*.001/a.seekSpeedMmS),this.hoverXUm=w.xUm,this.hoverYUm=w.yUm,this.hoverLevel=this.level,this.level=o,await this.dev.configure(new Ar({mode:Ja,flags:Rl|Cl|ta,outputRateHz:a.outputRateHz,loopMs:h,level:o,trapMode:hi(r),palette:[[255,255,255]],rateInitial:0,rateTarget:p,rateRampMs:Math.trunc(ps*1e3)})),this.plan=null,this.runSince=performance.now()/1e3,this.state="running";const y=s/Math.log(1/p),A=[[0,0]],C=performance.now();for(;!t.value&&!this.abort.value;){const x=(performance.now()-C)/1e3;let S;if(x<ps){const b=x/ps;S=p*b*b*(3-2*b)}else S=Math.min(p*Math.exp((x-ps)/y),1),await this.dev.rate(S,Math.trunc(kl*1e3));if(A.push([x,S]),e.report?.(S*d),S>=1&&x>ps+s+1)break;await ni(kl*1e3)}if(this.abort.value)throw new Be("aborted");if(!t.value)return await this.stopDrawing(),null;const L=Math.max(0,(performance.now()-C)/1e3-pf);let U=0;for(let x=A.length-1;x>=0;x--)if(A[x][0]<=L){U=A[x][1];break}return await this.drop(),this.level=this.hoverLevel,U*d<.2*u?null:Kd(l,U*d,c,o)}}const $o="179",Qi={ROTATE:0,DOLLY:1,PAN:2},Ki={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},gf=0,Hl=1,_f=2,Ph=1,vf=2,Dn=3,Zn=0,Xe=1,cn=2,$n=0,ts=1,gn=2,Vl=3,Gl=4,xf=5,ui=100,Mf=101,yf=102,Sf=103,bf=104,Ef=200,wf=201,Tf=202,Af=203,to=204,eo=205,Rf=206,Cf=207,Pf=208,Lf=209,Df=210,Uf=211,If=212,Nf=213,Ff=214,no=0,io=1,so=2,rs=3,ro=4,ao=5,oo=6,lo=7,Lh=0,Of=1,Bf=2,jn=0,zf=1,kf=2,Hf=3,Dh=4,Vf=5,Gf=6,Wf=7,Uh=300,as=301,os=302,co=303,ho=304,$r=306,uo=1e3,mi=1001,fo=1002,Ze=1003,Xf=1004,Ws=1005,rn=1006,ia=1007,gi=1008,bn=1009,Ih=1010,Nh=1011,Us=1012,jo=1013,vi=1014,Mn=1015,zs=1016,Ko=1017,Zo=1018,Is=1020,Fh=35902,Oh=1021,Bh=1022,un=1023,Ns=1026,Fs=1027,Jo=1028,Qo=1029,zh=1030,tl=1031,el=1033,Rr=33776,Cr=33777,Pr=33778,Lr=33779,po=35840,mo=35841,go=35842,_o=35843,vo=36196,xo=37492,Mo=37496,yo=37808,So=37809,bo=37810,Eo=37811,wo=37812,To=37813,Ao=37814,Ro=37815,Co=37816,Po=37817,Lo=37818,Do=37819,Uo=37820,Io=37821,Dr=36492,No=36494,Fo=36495,kh=36283,Oo=36284,Bo=36285,zo=36286,Yf=3200,qf=3201,Hh=0,$f=1,Yn="",Ne="srgb",ls="srgb-linear",zr="linear",te="srgb",bi=7680,Wl=519,jf=512,Kf=513,Zf=514,Vh=515,Jf=516,Qf=517,tp=518,ep=519,ko=35044,Xl="300 es",yn=2e3,kr=2001;class yi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yl=1234567;const Ls=Math.PI/180,Os=180/Math.PI;function In(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Dt(i,t,e){return Math.max(t,Math.min(e,i))}function nl(i,t){return(i%t+t)%t}function np(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function ip(i,t,e){return i!==t?(e-i)/(t-i):0}function Ds(i,t,e){return(1-e)*i+e*t}function sp(i,t,e,n){return Ds(i,t,1-Math.exp(-e*n))}function rp(i,t=1){return t-Math.abs(nl(i,t*2)-t)}function ap(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function op(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function lp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function cp(i,t){return i+Math.random()*(t-i)}function hp(i){return i*(.5-Math.random())}function up(i){i!==void 0&&(Yl=i);let t=Yl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function dp(i){return i*Ls}function fp(i){return i*Os}function pp(i){return(i&i-1)===0&&i!==0}function mp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function gp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function _p(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),u=a((t+n)/2),h=r((t-n)/2),d=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*u,l*h,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Jt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Gh={DEG2RAD:Ls,RAD2DEG:Os,generateUUID:In,clamp:Dt,euclideanModulo:nl,mapLinear:np,inverseLerp:ip,lerp:Ds,damp:sp,pingpong:rp,smoothstep:ap,smootherstep:op,randInt:lp,randFloat:cp,randFloatSpread:hp,seededRandom:up,degToRad:dp,radToDeg:fp,isPowerOfTwo:pp,ceilPowerOfTwo:mp,floorPowerOfTwo:gp,setQuaternionFromProperEuler:_p,normalize:Jt,denormalize:hn};class bt{constructor(t=0,e=0){bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Dt(this.x,t.x,e.x),this.y=Dt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Dt(this.x,t,e),this.y=Dt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Dt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Dt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class xi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(o===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==d||c!==p||u!==g){let m=1-o;const f=l*d+c*p+u*g+h*_,w=f>=0?1:-1,E=1-f*f;if(E>Number.EPSILON){const A=Math.sqrt(E),C=Math.atan2(A,f*w);m=Math.sin(m*C)/A,o=Math.sin(o*C)/A}const y=o*w;if(l=l*m+d*y,c=c*m+p*y,u=u*m+g*y,h=h*m+_*y,m===1-o){const A=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=A,c*=A,u*=A,h*=A}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[a],d=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+u*h+l*p-c*d,t[e+1]=l*g+u*d+c*h-o*p,t[e+2]=c*g+u*p+o*d-l*h,t[e+3]=u*g-o*h-l*d-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),h=o(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+o+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Dt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ql.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ql.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),u=2*(o*e-r*s),h=2*(r*n-a*e);return this.x=e+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Dt(this.x,t.x,e.x),this.y=Dt(this.y,t.y,e.y),this.z=Dt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Dt(this.x,t,e),this.y=Dt(this.y,t,e),this.z=Dt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Dt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return sa.copy(this).projectOnVector(t),this.sub(sa)}reflect(t){return this.sub(sa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Dt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const sa=new R,ql=new xi;class Ot{constructor(t,e,n,s,r,a,o,l,c){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],w=s[1],E=s[4],y=s[7],A=s[2],C=s[5],L=s[8];return r[0]=a*_+o*w+l*A,r[3]=a*m+o*E+l*C,r[6]=a*f+o*y+l*L,r[1]=c*_+u*w+h*A,r[4]=c*m+u*E+h*C,r[7]=c*f+u*y+h*L,r[2]=d*_+p*w+g*A,r[5]=d*m+p*E+g*C,r[8]=d*f+p*y+g*L,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*a-o*c,d=o*l-u*r,p=c*r-a*l,g=e*h+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(s*c-u*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(ra.makeScale(t,e)),this}rotate(t){return this.premultiply(ra.makeRotation(-t)),this}translate(t,e){return this.premultiply(ra.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ra=new Ot;function Wh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function vp(){const i=Hr("canvas");return i.style.display="block",i}const $l={};function es(i){i in $l||($l[i]=!0,console.warn(i))}function xp(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const jl=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kl=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mp(){const i={enabled:!0,workingColorSpace:ls,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===te&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===te&&(s.r=ns(s.r),s.g=ns(s.g),s.b=ns(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Yn?zr:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return es("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return es("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ls]:{primaries:t,whitePoint:n,transfer:zr,toXYZ:jl,fromXYZ:Kl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ne},outputColorSpaceConfig:{drawingBufferColorSpace:Ne}},[Ne]:{primaries:t,whitePoint:n,transfer:te,toXYZ:jl,fromXYZ:Kl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ne}}}),i}const Yt=Mp();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ns(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ei;class yp{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ei===void 0&&(Ei=Hr("canvas")),Ei.width=t.width,Ei.height=t.height;const s=Ei.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ei}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Hr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Nn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Nn(e[n]/255)*255):e[n]=Nn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Sp=0;class il{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=In(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(aa(s[a].image)):r.push(aa(s[a]))}else r=aa(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function aa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?yp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bp=0;const oa=new R;class Le extends yi{constructor(t=Le.DEFAULT_IMAGE,e=Le.DEFAULT_MAPPING,n=mi,s=mi,r=rn,a=gi,o=un,l=bn,c=Le.DEFAULT_ANISOTROPY,u=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=In(),this.name="",this.source=new il(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new bt(0,0),this.repeat=new bt(1,1),this.center=new bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oa).x}get height(){return this.source.getSize(oa).y}get depth(){return this.source.getSize(oa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case uo:t.x=t.x-Math.floor(t.x);break;case mi:t.x=t.x<0?0:1;break;case fo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case uo:t.y=t.y-Math.floor(t.y);break;case mi:t.y=t.y<0?0:1;break;case fo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=Uh;Le.DEFAULT_ANISOTROPY=1;class Wt{constructor(t=0,e=0,n=0,s=1){Wt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const E=(c+1)/2,y=(p+1)/2,A=(f+1)/2,C=(u+d)/4,L=(h+_)/4,U=(g+m)/4;return E>y&&E>A?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=C/n,r=L/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=C/s,r=U/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=L/r,s=U/r),this.set(n,s,r,e),this}let w=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(h-_)/w,this.z=(d-u)/w,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Dt(this.x,t.x,e.x),this.y=Dt(this.y,t.y,e.y),this.z=Dt(this.z,t.z,e.z),this.w=Dt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Dt(this.x,t,e),this.y=Dt(this.y,t,e),this.z=Dt(this.z,t,e),this.w=Dt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Dt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ep extends yi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Wt(0,0,t,e),this.scissorTest=!1,this.viewport=new Wt(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Le(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:rn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new il(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mi extends Ep{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Xh extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class wp extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ze,this.minFilter=Ze,this.wrapR=mi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class wn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xs.copy(n.boundingBox)),Xs.applyMatrix4(t.matrixWorld),this.union(Xs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ms),Ys.subVectors(this.max,ms),wi.subVectors(t.a,ms),Ti.subVectors(t.b,ms),Ai.subVectors(t.c,ms),Bn.subVectors(Ti,wi),zn.subVectors(Ai,Ti),ii.subVectors(wi,Ai);let e=[0,-Bn.z,Bn.y,0,-zn.z,zn.y,0,-ii.z,ii.y,Bn.z,0,-Bn.x,zn.z,0,-zn.x,ii.z,0,-ii.x,-Bn.y,Bn.x,0,-zn.y,zn.x,0,-ii.y,ii.x,0];return!la(e,wi,Ti,Ai,Ys)||(e=[1,0,0,0,1,0,0,0,1],!la(e,wi,Ti,Ai,Ys))?!1:(qs.crossVectors(Bn,zn),e=[qs.x,qs.y,qs.z],la(e,wi,Ti,Ai,Ys))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(An),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const An=[new R,new R,new R,new R,new R,new R,new R,new R],an=new R,Xs=new wn,wi=new R,Ti=new R,Ai=new R,Bn=new R,zn=new R,ii=new R,ms=new R,Ys=new R,qs=new R,si=new R;function la(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){si.fromArray(i,r);const o=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=t.dot(si),c=e.dot(si),u=n.dot(si);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Tp=new wn,gs=new R,ca=new R;class On{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Tp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);const e=gs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(gs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(ca)),this.expandByPoint(gs.copy(t.center).sub(ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Rn=new R,ha=new R,$s=new R,kn=new R,ua=new R,js=new R,da=new R;class jr{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Rn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Rn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Rn.copy(this.origin).addScaledVector(this.direction,e),Rn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ha.copy(t).add(e).multiplyScalar(.5),$s.copy(e).sub(t).normalize(),kn.copy(this.origin).sub(ha);const r=t.distanceTo(e)*.5,a=-this.direction.dot($s),o=kn.dot(this.direction),l=-kn.dot($s),c=kn.lengthSq(),u=Math.abs(1-a*a);let h,d,p,g;if(u>0)if(h=a*l-o,d=a*o-l,g=r*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,p=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),p=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(ha).addScaledVector($s,d),p}intersectSphere(t,e){Rn.subVectors(t.center,this.origin);const n=Rn.dot(this.direction),s=Rn.dot(Rn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Rn)!==null}intersectTriangle(t,e,n,s,r){ua.subVectors(e,t),js.subVectors(n,t),da.crossVectors(ua,js);let a=this.direction.dot(da),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;kn.subVectors(this.origin,t);const l=o*this.direction.dot(js.crossVectors(kn,js));if(l<0)return null;const c=o*this.direction.dot(ua.cross(kn));if(c<0||l+c>a)return null;const u=-o*kn.dot(da);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,s,r,a,o,l,c,u,h,d,p,g,_,m){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,u,h,d,p,g,_,m)}set(t,e,n,s,r,a,o,l,c,u,h,d,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ri.setFromMatrixColumn(t,0).length(),r=1/Ri.setFromMatrixColumn(t,1).length(),a=1/Ri.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=a*u,p=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=p+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*u,p=l*h,g=c*u,_=c*h;e[0]=d+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=p*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*u,p=l*h,g=c*u,_=c*h;e[0]=d-_*o,e[4]=-a*h,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*u,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*u,p=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=g*c-p,e[8]=d*c+_,e[1]=l*h,e[5]=_*c+d,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=_-d*h,e[8]=g*h+p,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=p*h+g,e[10]=d-_*h}else if(t.order==="XZY"){const d=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+_,e[5]=a*u,e[9]=p*h-g,e[2]=g*h-p,e[6]=o*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ap,t,Rp)}lookAt(t,e,n){const s=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Hn.crossVectors(n,$e),Hn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Hn.crossVectors(n,$e)),Hn.normalize(),Ks.crossVectors($e,Hn),s[0]=Hn.x,s[4]=Ks.x,s[8]=$e.x,s[1]=Hn.y,s[5]=Ks.y,s[9]=$e.y,s[2]=Hn.z,s[6]=Ks.z,s[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],w=n[3],E=n[7],y=n[11],A=n[15],C=s[0],L=s[4],U=s[8],x=s[12],S=s[1],b=s[5],F=s[9],B=s[13],z=s[2],q=s[6],G=s[10],Z=s[14],V=s[3],st=s[7],ut=s[11],Mt=s[15];return r[0]=a*C+o*S+l*z+c*V,r[4]=a*L+o*b+l*q+c*st,r[8]=a*U+o*F+l*G+c*ut,r[12]=a*x+o*B+l*Z+c*Mt,r[1]=u*C+h*S+d*z+p*V,r[5]=u*L+h*b+d*q+p*st,r[9]=u*U+h*F+d*G+p*ut,r[13]=u*x+h*B+d*Z+p*Mt,r[2]=g*C+_*S+m*z+f*V,r[6]=g*L+_*b+m*q+f*st,r[10]=g*U+_*F+m*G+f*ut,r[14]=g*x+_*B+m*Z+f*Mt,r[3]=w*C+E*S+y*z+A*V,r[7]=w*L+E*b+y*q+A*st,r[11]=w*U+E*F+y*G+A*ut,r[15]=w*x+E*B+y*Z+A*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+r*l*h-s*c*h-r*o*d+n*c*d+s*o*p-n*l*p)+_*(+e*l*p-e*c*d+r*a*d-s*a*p+s*c*u-r*l*u)+m*(+e*c*h-e*o*p-r*a*h+n*a*p+r*o*u-n*c*u)+f*(-s*o*u-e*l*h+e*o*d+s*a*h-n*a*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],w=h*m*c-_*d*c+_*l*p-o*m*p-h*l*f+o*d*f,E=g*d*c-u*m*c-g*l*p+a*m*p+u*l*f-a*d*f,y=u*_*c-g*h*c+g*o*p-a*_*p-u*o*f+a*h*f,A=g*h*l-u*_*l-g*o*d+a*_*d+u*o*m-a*h*m,C=e*w+n*E+s*y+r*A;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/C;return t[0]=w*L,t[1]=(_*d*r-h*m*r-_*s*p+n*m*p+h*s*f-n*d*f)*L,t[2]=(o*m*r-_*l*r+_*s*c-n*m*c-o*s*f+n*l*f)*L,t[3]=(h*l*r-o*d*r-h*s*c+n*d*c+o*s*p-n*l*p)*L,t[4]=E*L,t[5]=(u*m*r-g*d*r+g*s*p-e*m*p-u*s*f+e*d*f)*L,t[6]=(g*l*r-a*m*r-g*s*c+e*m*c+a*s*f-e*l*f)*L,t[7]=(a*d*r-u*l*r+u*s*c-e*d*c-a*s*p+e*l*p)*L,t[8]=y*L,t[9]=(g*h*r-u*_*r-g*n*p+e*_*p+u*n*f-e*h*f)*L,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*f+e*o*f)*L,t[11]=(u*o*r-a*h*r-u*n*c+e*h*c+a*n*p-e*o*p)*L,t[12]=A*L,t[13]=(u*_*s-g*h*s+g*n*d-e*_*d-u*n*m+e*h*m)*L,t[14]=(g*o*s-a*_*s-g*n*l+e*_*l+a*n*m-e*o*m)*L,t[15]=(a*h*s-u*o*s+u*n*l-e*h*l-a*n*d+e*o*d)*L,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,h=o+o,d=r*c,p=r*u,g=r*h,_=a*u,m=a*h,f=o*h,w=l*c,E=l*u,y=l*h,A=n.x,C=n.y,L=n.z;return s[0]=(1-(_+f))*A,s[1]=(p+y)*A,s[2]=(g-E)*A,s[3]=0,s[4]=(p-y)*C,s[5]=(1-(d+f))*C,s[6]=(m+w)*C,s[7]=0,s[8]=(g+E)*L,s[9]=(m-w)*L,s[10]=(1-(d+_))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ri.set(s[0],s[1],s[2]).length();const a=Ri.set(s[4],s[5],s[6]).length(),o=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],on.copy(this);const c=1/r,u=1/a,h=1/o;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=u,on.elements[5]*=u,on.elements[6]*=u,on.elements[8]*=h,on.elements[9]*=h,on.elements[10]*=h,e.setFromRotationMatrix(on),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=yn,l=!1){const c=this.elements,u=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),p=(n+s)/(n-s);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===yn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===kr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=yn,l=!1){const c=this.elements,u=2/(e-t),h=2/(n-s),d=-(e+t)/(e-t),p=-(n+s)/(n-s);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===yn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===kr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ri=new R,on=new Kt,Ap=new R(0,0,0),Rp=new R(1,1,1),Hn=new R,Ks=new R,$e=new R,Zl=new Kt,Jl=new xi;class En{constructor(t=0,e=0,n=0,s=En.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Dt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Dt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Dt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Dt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Dt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Dt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Zl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Zl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Jl.setFromEuler(this),this.setFromQuaternion(Jl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}En.DEFAULT_ORDER="XYZ";let Yh=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Cp=0;const Ql=new R,Ci=new xi,Cn=new Kt,Zs=new R,_s=new R,Pp=new R,Lp=new xi,tc=new R(1,0,0),ec=new R(0,1,0),nc=new R(0,0,1),ic={type:"added"},Dp={type:"removed"},Pi={type:"childadded",child:null},fa={type:"childremoved",child:null};class ve extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cp++}),this.uuid=In(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new R,e=new En,n=new xi,s=new R(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Ot}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(tc,t)}rotateY(t){return this.rotateOnAxis(ec,t)}rotateZ(t){return this.rotateOnAxis(nc,t)}translateOnAxis(t,e){return Ql.copy(t).applyQuaternion(this.quaternion),this.position.add(Ql.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(tc,t)}translateY(t){return this.translateOnAxis(ec,t)}translateZ(t){return this.translateOnAxis(nc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Zs.copy(t):Zs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(_s,Zs,this.up):Cn.lookAt(Zs,_s,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ic),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Dp),fa.child=t,this.dispatchEvent(fa),fa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ic),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,t,Pp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,Lp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ve.DEFAULT_UP=new R(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new R,Pn=new R,pa=new R,Ln=new R,Li=new R,Di=new R,sc=new R,ma=new R,ga=new R,_a=new R,va=new Wt,xa=new Wt,Ma=new Wt;let qi=class $i{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ln.subVectors(t,e),s.cross(ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ln.subVectors(s,e),Pn.subVectors(n,e),pa.subVectors(t,e);const a=ln.dot(ln),o=ln.dot(Pn),l=ln.dot(pa),c=Pn.dot(Pn),u=Pn.dot(pa),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,p=(c*l-o*u)*d,g=(a*u-o*l)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return va.setScalar(0),xa.setScalar(0),Ma.setScalar(0),va.fromBufferAttribute(t,e),xa.fromBufferAttribute(t,n),Ma.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(va,r.x),a.addScaledVector(xa,r.y),a.addScaledVector(Ma,r.z),a}static isFrontFacing(t,e,n,s){return ln.subVectors(n,e),Pn.subVectors(t,e),ln.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),ln.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return $i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return $i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return $i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return $i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return $i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Li.subVectors(s,n),Di.subVectors(r,n),ma.subVectors(t,n);const l=Li.dot(ma),c=Di.dot(ma);if(l<=0&&c<=0)return e.copy(n);ga.subVectors(t,s);const u=Li.dot(ga),h=Di.dot(ga);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(Li,a);_a.subVectors(t,r);const p=Li.dot(_a),g=Di.dot(_a);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Di,o);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return sc.subVectors(r,s),o=(h-u)/(h-u+(p-g)),e.copy(s).addScaledVector(sc,o);const f=1/(m+_+d);return a=_*f,o=d*f,e.copy(n).addScaledVector(Li,a).addScaledVector(Di,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}};const qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function ya(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ne){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=nl(t,1),e=Dt(e,0,1),n=Dt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ya(a,r,t+1/3),this.g=ya(a,r,t),this.b=ya(a,r,t-1/3)}return Yt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ne){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ne){const n=qh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Nn(t.r),this.g=Nn(t.g),this.b=Nn(t.b),this}copyLinearToSRGB(t){return this.r=ns(t.r),this.g=ns(t.g),this.b=ns(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ne){return Yt.workingToColorSpace(Ue.copy(this),t),Math.round(Dt(Ue.r*255,0,255))*65536+Math.round(Dt(Ue.g*255,0,255))*256+Math.round(Dt(Ue.b*255,0,255))}getHexString(t=Ne){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.workingToColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,r=Ue.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.workingToColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Ne){Yt.workingToColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==Ne?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vn),this.setHSL(Vn.h+t,Vn.s+e,Vn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vn),t.getHSL(Js);const n=Ds(Vn.h,Js.h,e),s=Ds(Vn.s,Js.s,e),r=Ds(Vn.l,Js.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Vt;Vt.NAMES=qh;let Up=0;class Jn extends yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Up++}),this.uuid=In(),this.name="",this.type="Material",this.blending=ts,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=to,this.blendDst=eo,this.blendEquation=ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=bi,this.stencilZFail=bi,this.stencilZPass=bi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ts&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==to&&(n.blendSrc=this.blendSrc),this.blendDst!==eo&&(n.blendDst=this.blendDst),this.blendEquation!==ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==rs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==bi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==bi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==bi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class di extends Jn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.combine=Lh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new R,Qs=new bt;let Ip=0;class Pe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ip++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ko,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qs.fromBufferAttribute(this,e),Qs.applyMatrix3(t),this.setXY(e,Qs.x,Qs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Jt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hn(e,this.array)),e}setX(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hn(e,this.array)),e}setY(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hn(e,this.array)),e}setW(t,e){return this.normalized&&(e=Jt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ko&&(t.usage=this.usage),t}}class $h extends Pe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class jh extends Pe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends Pe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Np=0;const tn=new Kt,Sa=new ve,Ui=new R,je=new wn,vs=new wn,Ee=new R;class ee extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=In(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wh(t)?jh:$h)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return Sa.lookAt(t),Sa.updateMatrix(),this.applyMatrix4(Sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ui).negate(),this.translate(Ui.x,Ui.y,Ui.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];je.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new On);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ee.addVectors(je.min,vs.min),je.expandByPoint(Ee),Ee.addVectors(je.max,vs.max),je.expandByPoint(Ee)):(je.expandByPoint(vs.min),je.expandByPoint(vs.max))}je.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ee.fromBufferAttribute(o,c),l&&(Ui.fromBufferAttribute(t,c),Ee.add(Ui)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<n.count;U++)o[U]=new R,l[U]=new R;const c=new R,u=new R,h=new R,d=new bt,p=new bt,g=new bt,_=new R,m=new R;function f(U,x,S){c.fromBufferAttribute(n,U),u.fromBufferAttribute(n,x),h.fromBufferAttribute(n,S),d.fromBufferAttribute(r,U),p.fromBufferAttribute(r,x),g.fromBufferAttribute(r,S),u.sub(c),h.sub(c),p.sub(d),g.sub(d);const b=1/(p.x*g.y-g.x*p.y);isFinite(b)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(b),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(b),o[U].add(_),o[x].add(_),o[S].add(_),l[U].add(m),l[x].add(m),l[S].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let U=0,x=w.length;U<x;++U){const S=w[U],b=S.start,F=S.count;for(let B=b,z=b+F;B<z;B+=3)f(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const E=new R,y=new R,A=new R,C=new R;function L(U){A.fromBufferAttribute(s,U),C.copy(A);const x=o[U];E.copy(x),E.sub(A.multiplyScalar(A.dot(x))).normalize(),y.crossVectors(C,x);const b=y.dot(l[U])<0?-1:1;a.setXYZW(U,E.x,E.y,E.z,b)}for(let U=0,x=w.length;U<x;++U){const S=w[U],b=S.start,F=S.count;for(let B=b,z=b+F;B<z;B+=3)L(t.getX(B+0)),L(t.getX(B+1)),L(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Pe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new R,r=new R,a=new R,o=new R,l=new R,c=new R,u=new R,h=new R;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*u;for(let f=0;f<u;f++)d[g++]=c[p++]}return new Pe(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ee,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=t(d,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rc=new Kt,ri=new jr,tr=new On,ac=new R,er=new R,nr=new R,ir=new R,ba=new R,sr=new R,oc=new R,rr=new R;class Me extends ve{constructor(t=new ee,e=new di){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){sr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(ba.fromBufferAttribute(h,t),a?sr.addScaledVector(ba,u):sr.addScaledVector(ba.sub(e),u))}e.add(sr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(r),ri.copy(t.ray).recast(t.near),!(tr.containsPoint(ri.origin)===!1&&(ri.intersectSphere(tr,ac)===null||ri.origin.distanceToSquared(ac)>(t.far-t.near)**2))&&(rc.copy(r).invert(),ri.copy(t.ray).applyMatrix4(rc),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ri)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),E=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=w,A=E;y<A;y+=3){const C=o.getX(y),L=o.getX(y+1),U=o.getX(y+2);s=ar(this,f,t,n,c,u,h,C,L,U),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const w=o.getX(m),E=o.getX(m+1),y=o.getX(m+2);s=ar(this,a,t,n,c,u,h,w,E,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),E=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=w,A=E;y<A;y+=3){const C=y,L=y+1,U=y+2;s=ar(this,f,t,n,c,u,h,C,L,U),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const w=m,E=m+1,y=m+2;s=ar(this,a,t,n,c,u,h,w,E,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Fp(i,t,e,n,s,r,a,o){let l;if(t.side===Xe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Zn,o),l===null)return null;rr.copy(o),rr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(rr);return c<e.near||c>e.far?null:{distance:c,point:rr.clone(),object:i}}function ar(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,er),i.getVertexPosition(l,nr),i.getVertexPosition(c,ir);const u=Fp(i,t,e,n,er,nr,ir,oc);if(u){const h=new R;qi.getBarycoord(oc,er,nr,ir,h),s&&(u.uv=qi.getInterpolatedAttribute(s,o,l,c,h,new bt)),r&&(u.uv1=qi.getInterpolatedAttribute(r,o,l,c,h,new bt)),a&&(u.normal=qi.getInterpolatedAttribute(a,o,l,c,h,new R),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new R,materialIndex:0};qi.getNormal(er,nr,ir,d.normal),u.face=d,u.barycoord=h}return u}class ks extends ee{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(u,3)),this.setAttribute("uv",new re(h,2));function g(_,m,f,w,E,y,A,C,L,U,x){const S=y/L,b=A/U,F=y/2,B=A/2,z=C/2,q=L+1,G=U+1;let Z=0,V=0;const st=new R;for(let ut=0;ut<G;ut++){const Mt=ut*b-B;for(let Nt=0;Nt<q;Nt++){const ie=Nt*S-F;st[_]=ie*w,st[m]=Mt*E,st[f]=z,c.push(st.x,st.y,st.z),st[_]=0,st[m]=0,st[f]=C>0?1:-1,u.push(st.x,st.y,st.z),h.push(Nt/L),h.push(1-ut/U),Z+=1}}for(let ut=0;ut<U;ut++)for(let Mt=0;Mt<L;Mt++){const Nt=d+Mt+q*ut,ie=d+Mt+q*(ut+1),qt=d+(Mt+1)+q*(ut+1),X=d+(Mt+1)+q*ut;l.push(Nt,ie,X),l.push(ie,qt,X),V+=6}o.addGroup(p,V,x),p+=V,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ks(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function cs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ke(i){const t={};for(let e=0;e<i.length;e++){const n=cs(i[e]);for(const s in n)t[s]=n[s]}return t}function Op(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Kh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const sl={clone:cs,merge:ke};var Bp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends Jn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bp,this.fragmentShader=zp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=cs(t.uniforms),this.uniformsGroups=Op(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Zh extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gn=new R,lc=new bt,cc=new bt;class Ke extends Zh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Os*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Os*2*Math.atan(Math.tan(Ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Gn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Gn.x,Gn.y).multiplyScalar(-t/Gn.z),Gn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gn.x,Gn.y).multiplyScalar(-t/Gn.z)}getViewSize(t,e){return this.getViewBounds(t,lc,cc),e.subVectors(cc,lc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ls*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ii=-90,Ni=1;class kp extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ke(Ii,Ni,t,e);s.layers=this.layers,this.add(s);const r=new Ke(Ii,Ni,t,e);r.layers=this.layers,this.add(r);const a=new Ke(Ii,Ni,t,e);a.layers=this.layers,this.add(a);const o=new Ke(Ii,Ni,t,e);o.layers=this.layers,this.add(o);const l=new Ke(Ii,Ni,t,e);l.layers=this.layers,this.add(l);const c=new Ke(Ii,Ni,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===kr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Jh extends Le{constructor(t=[],e=as,n,s,r,a,o,l,c,u){super(t,e,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Hp extends Mi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Jh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ks(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xe,blending:$n});r.uniforms.tEquirect.value=e;const a=new Me(s,r),o=e.minFilter;return e.minFilter===gi&&(e.minFilter=rn),new kp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class qn extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vp={type:"move"};class Ea{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vp)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new qn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Gp extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new En,this.environmentIntensity=1,this.environmentRotation=new En,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Qh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=ko,this.updateRanges=[],this.version=0,this.uuid=In()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=In()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=In()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ze=new R;class Sn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Jt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=hn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=hn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=hn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=hn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Jt(e,this.array),n=Jt(n,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Pe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Sn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class tu extends Jn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Fi;const xs=new R,Oi=new R,Bi=new R,zi=new bt,Ms=new bt,eu=new Kt,or=new R,ys=new R,lr=new R,hc=new bt,wa=new bt,uc=new bt;class Wp extends ve{constructor(t=new tu){if(super(),this.isSprite=!0,this.type="Sprite",Fi===void 0){Fi=new ee;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Qh(e,5);Fi.setIndex([0,1,2,0,2,3]),Fi.setAttribute("position",new Sn(n,3,0,!1)),Fi.setAttribute("uv",new Sn(n,2,3,!1))}this.geometry=Fi,this.material=t,this.center=new bt(.5,.5),this.count=1}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Oi.setFromMatrixScale(this.matrixWorld),eu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Bi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Oi.multiplyScalar(-Bi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;cr(or.set(-.5,-.5,0),Bi,a,Oi,s,r),cr(ys.set(.5,-.5,0),Bi,a,Oi,s,r),cr(lr.set(.5,.5,0),Bi,a,Oi,s,r),hc.set(0,0),wa.set(1,0),uc.set(1,1);let o=t.ray.intersectTriangle(or,ys,lr,!1,xs);if(o===null&&(cr(ys.set(-.5,.5,0),Bi,a,Oi,s,r),wa.set(0,1),o=t.ray.intersectTriangle(or,lr,ys,!1,xs),o===null))return;const l=t.ray.origin.distanceTo(xs);l<t.near||l>t.far||e.push({distance:l,point:xs.clone(),uv:qi.getInterpolation(xs,or,ys,lr,hc,wa,uc,new bt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function cr(i,t,e,n,s,r){zi.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(Ms.x=r*zi.x-s*zi.y,Ms.y=s*zi.x+r*zi.y):Ms.copy(zi),i.copy(t),i.x+=Ms.x,i.y+=Ms.y,i.applyMatrix4(eu)}class Xp extends Le{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Ze,u=Ze,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class dc extends Pe{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ki=new Kt,fc=new Kt,hr=[],pc=new wn,Yp=new Kt,Ss=new Me,bs=new On;class qp extends Me{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new dc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Yp)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new wn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),pc.copy(t.boundingBox).applyMatrix4(ki),this.boundingBox.union(pc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new On),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ki),bs.copy(t.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(bs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ss.geometry=this.geometry,Ss.material=this.material,Ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bs.copy(this.boundingSphere),bs.applyMatrix4(n),t.ray.intersectsSphere(bs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ki),fc.multiplyMatrices(n,ki),Ss.matrixWorld=fc,Ss.raycast(t,hr);for(let a=0,o=hr.length;a<o;a++){const l=hr[a];l.instanceId=r,l.object=this,e.push(l)}hr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new dc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Xp(new Float32Array(s*this.count),s,this.count,Jo,Mn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ta=new R,$p=new R,jp=new Ot;class Xn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ta.subVectors(n,e).cross($p.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ta),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||jp.getNormalMatrix(t),s=this.coplanarPoint(Ta).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new On,Kp=new bt(.5,.5),ur=new R;class rl{constructor(t=new Xn,e=new Xn,n=new Xn,s=new Xn,r=new Xn,a=new Xn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=yn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],p=r[7],g=r[8],_=r[9],m=r[10],f=r[11],w=r[12],E=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,p-u,f-g,A-w).normalize(),s[1].setComponents(c+a,p+u,f+g,A+w).normalize(),s[2].setComponents(c+o,p+h,f+_,A+E).normalize(),s[3].setComponents(c-o,p-h,f-_,A-E).normalize(),n)s[4].setComponents(l,d,m,y).normalize(),s[5].setComponents(c-l,p-d,f-m,A-y).normalize();else if(s[4].setComponents(c-l,p-d,f-m,A-y).normalize(),e===yn)s[5].setComponents(c+l,p+d,f+m,A+y).normalize();else if(e===kr)s[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(t){ai.center.set(0,0,0);const e=Kp.distanceTo(t.center);return ai.radius=.7071067811865476+e,ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ur.x=s.normal.x>0?t.max.x:t.min.x,ur.y=s.normal.y>0?t.max.y:t.min.y,ur.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class fi extends Jn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Vt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Vr=new R,Gr=new R,mc=new Kt,Es=new jr,dr=new On,Aa=new R,gc=new R;class As extends ve{constructor(t=new ee,e=new fi){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Vr.fromBufferAttribute(e,s-1),Gr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Vr.distanceTo(Gr);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(s),dr.radius+=r,t.ray.intersectsSphere(dr)===!1)return;mc.copy(s).invert(),Es.copy(t.ray).applyMatrix4(mc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=u.getX(_),w=u.getX(_+1),E=fr(this,t,Es,l,f,w,_);E&&e.push(E)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(p),f=fr(this,t,Es,l,_,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=fr(this,t,Es,l,_,_+1,_);f&&e.push(f)}if(this.isLineLoop){const _=fr(this,t,Es,l,g-1,p,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function fr(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(Vr.fromBufferAttribute(o,s),Gr.fromBufferAttribute(o,r),e.distanceSqToSegment(Vr,Gr,Aa,gc)>n)return;Aa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Aa);if(!(c<t.near||c>t.far))return{distance:c,point:gc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const _c=new R,vc=new R;class Ra extends As{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)_c.fromBufferAttribute(e,s),vc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+_c.distanceTo(vc);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rs extends Jn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Vt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const xc=new Kt,Ho=new jr,pr=new On,mr=new R;class gr extends ve{constructor(t=new ee,e=new Rs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(s),pr.radius+=r,t.ray.intersectsSphere(pr)===!1)return;xc.copy(s).invert(),Ho.copy(t.ray).applyMatrix4(xc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=d,_=p;g<_;g++){const m=c.getX(g);mr.fromBufferAttribute(h,m),Mc(mr,m,l,s,t,e,this)}}else{const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=d,_=p;g<_;g++)mr.fromBufferAttribute(h,g),Mc(mr,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Mc(i,t,e,n,s,r,a){const o=Ho.distanceSqToPoint(i);if(o<e){const l=new R;Ho.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class al extends Le{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class nu extends Le{constructor(t,e,n=vi,s,r,a,o=Ze,l=Ze,c,u=Ns,h=1){if(u!==Ns&&u!==Fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:h};super(d,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new il(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ol extends ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new R,u=new bt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const p=n+h/e*s;c.x=t*Math.cos(p),c.y=t*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ol(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Wr extends ee{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],p=[];let g=0;const _=[],m=n/2;let f=0;w(),a===!1&&(t>0&&E(!0),e>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new re(h,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(p,2));function w(){const y=new R,A=new R;let C=0;const L=(e-t)/n;for(let U=0;U<=r;U++){const x=[],S=U/r,b=S*(e-t)+t;for(let F=0;F<=s;F++){const B=F/s,z=B*l+o,q=Math.sin(z),G=Math.cos(z);A.x=b*q,A.y=-S*n+m,A.z=b*G,h.push(A.x,A.y,A.z),y.set(q,L,G).normalize(),d.push(y.x,y.y,y.z),p.push(B,1-S),x.push(g++)}_.push(x)}for(let U=0;U<s;U++)for(let x=0;x<r;x++){const S=_[x][U],b=_[x+1][U],F=_[x+1][U+1],B=_[x][U+1];(t>0||x!==0)&&(u.push(S,b,B),C+=3),(e>0||x!==r-1)&&(u.push(b,F,B),C+=3)}c.addGroup(f,C,0),f+=C}function E(y){const A=g,C=new bt,L=new R;let U=0;const x=y===!0?t:e,S=y===!0?1:-1;for(let F=1;F<=s;F++)h.push(0,m*S,0),d.push(0,S,0),p.push(.5,.5),g++;const b=g;for(let F=0;F<=s;F++){const z=F/s*l+o,q=Math.cos(z),G=Math.sin(z);L.x=x*G,L.y=m*S,L.z=x*q,h.push(L.x,L.y,L.z),d.push(0,S,0),C.x=q*.5+.5,C.y=G*.5*S+.5,p.push(C.x,C.y),g++}for(let F=0;F<s;F++){const B=A+F,z=b+F;y===!0?u.push(z,z+1,B):u.push(z+1,z,B),U+=3}c.addGroup(f,U,y===!0?1:2),f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wr(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Hs extends ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,h=t/o,d=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<u;f++){const w=f*d-a;for(let E=0;E<c;E++){const y=E*h-r;g.push(y,-w,0),_.push(0,0,1),m.push(E/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let w=0;w<o;w++){const E=w+c*f,y=w+c*(f+1),A=w+1+c*(f+1),C=w+1+c*f;p.push(E,y,C),p.push(y,A,C)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.width,t.height,t.widthSegments,t.heightSegments)}}class ll extends ee{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],l=[],c=[],u=[];let h=t;const d=(e-t)/s,p=new R,g=new bt;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const f=r+m/n*a;p.x=h*Math.cos(f),p.y=h*Math.sin(f),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,u.push(g.x,g.y)}h+=d}for(let _=0;_<s;_++){const m=_*(n+1);for(let f=0;f<n;f++){const w=f+m,E=w,y=w+n+1,A=w+n+2,C=w+1;o.push(E,y,C),o.push(y,A,C)}}this.setIndex(o),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ll(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class cl extends ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new R,d=new R,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const w=[],E=f/n;let y=0;f===0&&a===0?y=.5/e:f===n&&l===Math.PI&&(y=-.5/e);for(let A=0;A<=e;A++){const C=A/e;h.x=-t*Math.cos(s+C*r)*Math.sin(a+E*o),h.y=t*Math.cos(a+E*o),h.z=t*Math.sin(s+C*r)*Math.sin(a+E*o),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(C+y,1-E),w.push(c++)}u.push(w)}for(let f=0;f<n;f++)for(let w=0;w<e;w++){const E=u[f][w+1],y=u[f][w],A=u[f+1][w],C=u[f+1][w+1];(f!==0||a>0)&&p.push(E,y,C),(f!==n-1||l<Math.PI)&&p.push(y,A,C)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xr extends ee{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new R,h=new R,d=new R;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const _=g/s*r,m=p/n*Math.PI*2;h.x=(t+e*Math.cos(m))*Math.cos(_),h.y=(t+e*Math.cos(m))*Math.sin(_),h.z=e*Math.sin(m),o.push(h.x,h.y,h.z),u.x=t*Math.cos(_),u.y=t*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const _=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,w=(s+1)*p+g;a.push(_,m,w),a.push(m,f,w)}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Zp extends ee{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new R,r=new R;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){const h=l[c],d=h.start,p=h.count;for(let g=d,_=d+p;g<_;g+=3)for(let m=0;m<3;m++){const f=o.getX(g+m),w=o.getX(g+(m+1)%3);s.fromBufferAttribute(a,f),r.fromBufferAttribute(a,w),yc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const u=3*o+c,h=3*o+(c+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,h),yc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new re(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function yc(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Ca extends Jn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new En,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Jp extends Jn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Qp extends Jn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class tm extends fi{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class hl extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class em extends hl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Pa=new Kt,Sc=new R,bc=new R;class iu{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new bt(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new Kt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rl,this._frameExtents=new bt(1,1),this._viewportCount=1,this._viewports=[new Wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Sc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Sc),bc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(bc),e.updateMatrixWorld(),Pa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Pa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ec=new Kt,ws=new R,La=new R;class nm extends iu{constructor(){super(new Ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new bt(4,2),this._viewportCount=6,this._viewports=[new Wt(2,1,1,1),new Wt(0,1,1,1),new Wt(3,1,1,1),new Wt(1,1,1,1),new Wt(3,0,1,1),new Wt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ws.setFromMatrixPosition(t.matrixWorld),n.position.copy(ws),La.copy(n.position),La.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(La),n.updateMatrixWorld(),s.makeTranslation(-ws.x,-ws.y,-ws.z),Ec.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ec,n.coordinateSystem,n.reversedDepth)}}class Da extends hl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new nm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class su extends Zh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class im extends iu{constructor(){super(new su(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sm extends hl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new im}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class rm extends ee{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class am extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Vo extends Qh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class wc{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Dt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Dt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Tc=new R,_r=new R,Hi=new R,Vi=new R,Ua=new R,om=new R,lm=new R;class cm{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Tc.subVectors(t,this.start),_r.subVectors(this.end,this.start);const n=_r.dot(_r);let r=_r.dot(Tc)/n;return e&&(r=Dt(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=om,n=lm){const s=10000000000000001e-32;let r,a;const o=this.start,l=t.start,c=this.end,u=t.end;Hi.subVectors(c,o),Vi.subVectors(u,l),Ua.subVectors(o,l);const h=Hi.dot(Hi),d=Vi.dot(Vi),p=Vi.dot(Ua);if(h<=s&&d<=s)return e.copy(o),n.copy(l),e.sub(n),e.dot(e);if(h<=s)r=0,a=p/d,a=Dt(a,0,1);else{const g=Hi.dot(Ua);if(d<=s)a=0,r=Dt(-g/h,0,1);else{const _=Hi.dot(Vi),m=h*d-_*_;m!==0?r=Dt((_*p-g*d)/m,0,1):r=0,a=(_*r+p)/d,a<0?(a=0,r=Dt(-g/h,0,1)):a>1&&(a=1,r=Dt((_-g)/h,0,1))}}return e.copy(o).add(Hi.multiplyScalar(r)),n.copy(l).add(Vi.multiplyScalar(a)),e.sub(n),e.dot(e)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}class hm extends yi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Ac(i,t,e,n){const s=um(n);switch(e){case Oh:return i*t;case Jo:return i*t/s.components*s.byteLength;case Qo:return i*t/s.components*s.byteLength;case zh:return i*t*2/s.components*s.byteLength;case tl:return i*t*2/s.components*s.byteLength;case Bh:return i*t*3/s.components*s.byteLength;case un:return i*t*4/s.components*s.byteLength;case el:return i*t*4/s.components*s.byteLength;case Rr:case Cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Pr:case Lr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case mo:case _o:return Math.max(i,16)*Math.max(t,8)/4;case po:case go:return Math.max(i,8)*Math.max(t,8)/2;case vo:case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case yo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case So:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case bo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case wo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case To:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ro:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Co:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Po:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Lo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Do:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Uo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Io:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Dr:case No:case Fo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case kh:case Oo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Bo:case zo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function um(i){switch(i){case bn:case Ih:return{byteLength:1,components:1};case Us:case Nh:case zs:return{byteLength:2,components:1};case Ko:case Zo:return{byteLength:2,components:4};case vi:case jo:case Mn:return{byteLength:4,components:1};case Fh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$o}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$o);function ru(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function dm(i){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<h.length;p++){const g=h[d],_=h[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let p=0,g=h.length;p<g;p++){const _=h[p];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var fm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pm=`#ifdef USE_ALPHAHASH
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
#endif`,mm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_m=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xm=`#ifdef USE_AOMAP
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
#endif`,Mm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ym=`#ifdef USE_BATCHING
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
#endif`,Sm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Em=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tm=`#ifdef USE_IRIDESCENCE
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
#endif`,Am=`#ifdef USE_BUMPMAP
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
#endif`,Rm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Cm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Lm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Um=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Im=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Nm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Fm=`#define PI 3.141592653589793
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
} // validated`,Om=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bm=`vec3 transformedNormal = objectNormal;
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
#endif`,zm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,km=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Xm=`#ifdef USE_ENVMAP
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
#endif`,Ym=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qm=`#ifdef USE_ENVMAP
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
#endif`,$m=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jm=`#ifdef USE_ENVMAP
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
#endif`,Km=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tg=`#ifdef USE_GRADIENTMAP
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
}`,eg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ng=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ig=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sg=`uniform bool receiveShadow;
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
#endif`,rg=`#ifdef USE_ENVMAP
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
#endif`,ag=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,og=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hg=`PhysicalMaterial material;
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
#endif`,ug=`struct PhysicalMaterial {
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
}`,dg=`
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
#endif`,fg=`#if defined( RE_IndirectDiffuse )
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
#endif`,pg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_g=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Mg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Sg=`#if defined( USE_POINTS_UV )
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
#endif`,bg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ag=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rg=`#ifdef USE_MORPHTARGETS
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
#endif`,Cg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Dg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ug=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ig=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ng=`#ifdef USE_NORMALMAP
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
#endif`,Fg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Og=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Zg=`float getShadowMask() {
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
}`,Jg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qg=`#ifdef USE_SKINNING
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
#endif`,t0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,e0=`#ifdef USE_SKINNING
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
#endif`,n0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,i0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,s0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,r0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,a0=`#ifdef USE_TRANSMISSION
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
#endif`,o0=`#ifdef USE_TRANSMISSION
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
#endif`,l0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,h0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,u0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const d0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,f0=`uniform sampler2D t2D;
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
}`,p0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,g0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,v0=`#include <common>
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
}`,x0=`#if DEPTH_PACKING == 3200
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
}`,M0=`#define DISTANCE
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
}`,y0=`#define DISTANCE
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
}`,S0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,b0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,E0=`uniform float scale;
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
}`,w0=`uniform vec3 diffuse;
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
}`,T0=`#include <common>
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
}`,A0=`uniform vec3 diffuse;
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
}`,R0=`#define LAMBERT
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
}`,C0=`#define LAMBERT
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
}`,P0=`#define MATCAP
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
}`,L0=`#define MATCAP
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
}`,D0=`#define NORMAL
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
}`,U0=`#define NORMAL
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
}`,I0=`#define PHONG
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
}`,N0=`#define PHONG
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
}`,F0=`#define STANDARD
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
}`,O0=`#define STANDARD
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
}`,B0=`#define TOON
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
}`,z0=`#define TOON
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
}`,k0=`uniform float size;
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
}`,H0=`uniform vec3 diffuse;
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
}`,V0=`#include <common>
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
}`,G0=`uniform vec3 color;
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
}`,W0=`uniform float rotation;
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
}`,X0=`uniform vec3 diffuse;
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
}`,Bt={alphahash_fragment:fm,alphahash_pars_fragment:pm,alphamap_fragment:mm,alphamap_pars_fragment:gm,alphatest_fragment:_m,alphatest_pars_fragment:vm,aomap_fragment:xm,aomap_pars_fragment:Mm,batching_pars_vertex:ym,batching_vertex:Sm,begin_vertex:bm,beginnormal_vertex:Em,bsdfs:wm,iridescence_fragment:Tm,bumpmap_pars_fragment:Am,clipping_planes_fragment:Rm,clipping_planes_pars_fragment:Cm,clipping_planes_pars_vertex:Pm,clipping_planes_vertex:Lm,color_fragment:Dm,color_pars_fragment:Um,color_pars_vertex:Im,color_vertex:Nm,common:Fm,cube_uv_reflection_fragment:Om,defaultnormal_vertex:Bm,displacementmap_pars_vertex:zm,displacementmap_vertex:km,emissivemap_fragment:Hm,emissivemap_pars_fragment:Vm,colorspace_fragment:Gm,colorspace_pars_fragment:Wm,envmap_fragment:Xm,envmap_common_pars_fragment:Ym,envmap_pars_fragment:qm,envmap_pars_vertex:$m,envmap_physical_pars_fragment:rg,envmap_vertex:jm,fog_vertex:Km,fog_pars_vertex:Zm,fog_fragment:Jm,fog_pars_fragment:Qm,gradientmap_pars_fragment:tg,lightmap_pars_fragment:eg,lights_lambert_fragment:ng,lights_lambert_pars_fragment:ig,lights_pars_begin:sg,lights_toon_fragment:ag,lights_toon_pars_fragment:og,lights_phong_fragment:lg,lights_phong_pars_fragment:cg,lights_physical_fragment:hg,lights_physical_pars_fragment:ug,lights_fragment_begin:dg,lights_fragment_maps:fg,lights_fragment_end:pg,logdepthbuf_fragment:mg,logdepthbuf_pars_fragment:gg,logdepthbuf_pars_vertex:_g,logdepthbuf_vertex:vg,map_fragment:xg,map_pars_fragment:Mg,map_particle_fragment:yg,map_particle_pars_fragment:Sg,metalnessmap_fragment:bg,metalnessmap_pars_fragment:Eg,morphinstance_vertex:wg,morphcolor_vertex:Tg,morphnormal_vertex:Ag,morphtarget_pars_vertex:Rg,morphtarget_vertex:Cg,normal_fragment_begin:Pg,normal_fragment_maps:Lg,normal_pars_fragment:Dg,normal_pars_vertex:Ug,normal_vertex:Ig,normalmap_pars_fragment:Ng,clearcoat_normal_fragment_begin:Fg,clearcoat_normal_fragment_maps:Og,clearcoat_pars_fragment:Bg,iridescence_pars_fragment:zg,opaque_fragment:kg,packing:Hg,premultiplied_alpha_fragment:Vg,project_vertex:Gg,dithering_fragment:Wg,dithering_pars_fragment:Xg,roughnessmap_fragment:Yg,roughnessmap_pars_fragment:qg,shadowmap_pars_fragment:$g,shadowmap_pars_vertex:jg,shadowmap_vertex:Kg,shadowmask_pars_fragment:Zg,skinbase_vertex:Jg,skinning_pars_vertex:Qg,skinning_vertex:t0,skinnormal_vertex:e0,specularmap_fragment:n0,specularmap_pars_fragment:i0,tonemapping_fragment:s0,tonemapping_pars_fragment:r0,transmission_fragment:a0,transmission_pars_fragment:o0,uv_pars_fragment:l0,uv_pars_vertex:c0,uv_vertex:h0,worldpos_vertex:u0,background_vert:d0,background_frag:f0,backgroundCube_vert:p0,backgroundCube_frag:m0,cube_vert:g0,cube_frag:_0,depth_vert:v0,depth_frag:x0,distanceRGBA_vert:M0,distanceRGBA_frag:y0,equirect_vert:S0,equirect_frag:b0,linedashed_vert:E0,linedashed_frag:w0,meshbasic_vert:T0,meshbasic_frag:A0,meshlambert_vert:R0,meshlambert_frag:C0,meshmatcap_vert:P0,meshmatcap_frag:L0,meshnormal_vert:D0,meshnormal_frag:U0,meshphong_vert:I0,meshphong_frag:N0,meshphysical_vert:F0,meshphysical_frag:O0,meshtoon_vert:B0,meshtoon_frag:z0,points_vert:k0,points_frag:H0,shadow_vert:V0,shadow_frag:G0,sprite_vert:W0,sprite_frag:X0},at={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},We={basic:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:ke([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:ke([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:ke([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new Vt(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:ke([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:ke([at.points,at.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:ke([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:ke([at.common,at.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:ke([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:ke([at.sprite,at.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distanceRGBA:{uniforms:ke([at.common,at.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distanceRGBA_vert,fragmentShader:Bt.distanceRGBA_frag},shadow:{uniforms:ke([at.lights,at.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};We.physical={uniforms:ke([We.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const vr={r:0,b:0,g:0},oi=new En,Y0=new Kt;function q0(i,t,e,n,s,r,a){const o=new Vt(0);let l=r===!0?0:1,c,u,h=null,d=0,p=null;function g(E){let y=E.isScene===!0?E.background:null;return y&&y.isTexture&&(y=(E.backgroundBlurriness>0?e:t).get(y)),y}function _(E){let y=!1;const A=g(E);A===null?f(o,l):A&&A.isColor&&(f(A,1),y=!0);const C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,y){const A=g(y);A&&(A.isCubeTexture||A.mapping===$r)?(u===void 0&&(u=new Me(new ks(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:cs(We.backgroundCube.uniforms),vertexShader:We.backgroundCube.vertexShader,fragmentShader:We.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(C,L,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),oi.copy(y.backgroundRotation),oi.x*=-1,oi.y*=-1,oi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Y0.makeRotationFromEuler(oi)),u.material.toneMapped=Yt.getTransfer(A.colorSpace)!==te,(h!==A||d!==A.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=A,d=A.version,p=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Me(new Hs(2,2),new Fn({name:"BackgroundMaterial",uniforms:cs(We.background.uniforms),vertexShader:We.background.vertexShader,fragmentShader:We.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(A.colorSpace)!==te,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||d!==A.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=A,d=A.version,p=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function f(E,y){E.getRGB(vr,Kh(i)),n.buffers.color.setClear(vr.r,vr.g,vr.b,y,a)}function w(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(E,y=1){o.set(E),l=y,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,f(o,l)},render:_,addToRenderList:m,dispose:w}}function $0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(S,b,F,B,z){let q=!1;const G=h(B,F,b);r!==G&&(r=G,c(r.object)),q=p(S,B,F,z),q&&g(S,B,F,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(S,b,F,B),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function u(S){return i.deleteVertexArray(S)}function h(S,b,F){const B=F.wireframe===!0;let z=n[S.id];z===void 0&&(z={},n[S.id]=z);let q=z[b.id];q===void 0&&(q={},z[b.id]=q);let G=q[B];return G===void 0&&(G=d(l()),q[B]=G),G}function d(S){const b=[],F=[],B=[];for(let z=0;z<e;z++)b[z]=0,F[z]=0,B[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:F,attributeDivisors:B,object:S,attributes:{},index:null}}function p(S,b,F,B){const z=r.attributes,q=b.attributes;let G=0;const Z=F.getAttributes();for(const V in Z)if(Z[V].location>=0){const ut=z[V];let Mt=q[V];if(Mt===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(Mt=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(Mt=S.instanceColor)),ut===void 0||ut.attribute!==Mt||Mt&&ut.data!==Mt.data)return!0;G++}return r.attributesNum!==G||r.index!==B}function g(S,b,F,B){const z={},q=b.attributes;let G=0;const Z=F.getAttributes();for(const V in Z)if(Z[V].location>=0){let ut=q[V];ut===void 0&&(V==="instanceMatrix"&&S.instanceMatrix&&(ut=S.instanceMatrix),V==="instanceColor"&&S.instanceColor&&(ut=S.instanceColor));const Mt={};Mt.attribute=ut,ut&&ut.data&&(Mt.data=ut.data),z[V]=Mt,G++}r.attributes=z,r.attributesNum=G,r.index=B}function _(){const S=r.newAttributes;for(let b=0,F=S.length;b<F;b++)S[b]=0}function m(S){f(S,0)}function f(S,b){const F=r.newAttributes,B=r.enabledAttributes,z=r.attributeDivisors;F[S]=1,B[S]===0&&(i.enableVertexAttribArray(S),B[S]=1),z[S]!==b&&(i.vertexAttribDivisor(S,b),z[S]=b)}function w(){const S=r.newAttributes,b=r.enabledAttributes;for(let F=0,B=b.length;F<B;F++)b[F]!==S[F]&&(i.disableVertexAttribArray(F),b[F]=0)}function E(S,b,F,B,z,q,G){G===!0?i.vertexAttribIPointer(S,b,F,z,q):i.vertexAttribPointer(S,b,F,B,z,q)}function y(S,b,F,B){_();const z=B.attributes,q=F.getAttributes(),G=b.defaultAttributeValues;for(const Z in q){const V=q[Z];if(V.location>=0){let st=z[Z];if(st===void 0&&(Z==="instanceMatrix"&&S.instanceMatrix&&(st=S.instanceMatrix),Z==="instanceColor"&&S.instanceColor&&(st=S.instanceColor)),st!==void 0){const ut=st.normalized,Mt=st.itemSize,Nt=t.get(st);if(Nt===void 0)continue;const ie=Nt.buffer,qt=Nt.type,X=Nt.bytesPerElement,ot=qt===i.INT||qt===i.UNSIGNED_INT||st.gpuType===jo;if(st.isInterleavedBufferAttribute){const et=st.data,Et=et.stride,wt=st.offset;if(et.isInstancedInterleavedBuffer){for(let Ut=0;Ut<V.locationSize;Ut++)f(V.location+Ut,et.meshPerAttribute);S.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Ut=0;Ut<V.locationSize;Ut++)m(V.location+Ut);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Ut=0;Ut<V.locationSize;Ut++)E(V.location+Ut,Mt/V.locationSize,qt,ut,Et*X,(wt+Mt/V.locationSize*Ut)*X,ot)}else{if(st.isInstancedBufferAttribute){for(let et=0;et<V.locationSize;et++)f(V.location+et,st.meshPerAttribute);S.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let et=0;et<V.locationSize;et++)m(V.location+et);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let et=0;et<V.locationSize;et++)E(V.location+et,Mt/V.locationSize,qt,ut,Mt*X,Mt/V.locationSize*et*X,ot)}}else if(G!==void 0){const ut=G[Z];if(ut!==void 0)switch(ut.length){case 2:i.vertexAttrib2fv(V.location,ut);break;case 3:i.vertexAttrib3fv(V.location,ut);break;case 4:i.vertexAttrib4fv(V.location,ut);break;default:i.vertexAttrib1fv(V.location,ut)}}}}w()}function A(){U();for(const S in n){const b=n[S];for(const F in b){const B=b[F];for(const z in B)u(B[z].object),delete B[z];delete b[F]}delete n[S]}}function C(S){if(n[S.id]===void 0)return;const b=n[S.id];for(const F in b){const B=b[F];for(const z in B)u(B[z].object),delete B[z];delete b[F]}delete n[S.id]}function L(S){for(const b in n){const F=n[b];if(F[S.id]===void 0)continue;const B=F[S.id];for(const z in B)u(B[z].object),delete B[z];delete F[S.id]}}function U(){x(),a=!0,r!==s&&(r=s,c(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:U,resetDefaultState:x,dispose:A,releaseStatesOfGeometry:C,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:m,disableUnusedAttributes:w}}function j0(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];e.update(p,n,1)}function l(c,u,h,d){if(h===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function K0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const L=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(L){return!(L!==un&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const U=L===zs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==bn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==Mn&&!U)}function l(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,C=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:y,vertexTextures:A,maxSamples:C}}function Z0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Xn,o=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||n!==0||s;return s=d,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,p){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const w=r?0:n,E=w*4;let y=f.clippingState||null;l.value=y,y=u(g,d,E,p);for(let A=0;A!==E;++A)y[A]=e[A];f.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,p,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,w=d.matrixWorldInverse;o.getNormalMatrix(w),(m===null||m.length<f)&&(m=new Float32Array(f));for(let E=0,y=p;E!==_;++E,y+=4)a.copy(h[E]).applyMatrix4(w,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function J0(i){let t=new WeakMap;function e(a,o){return o===co?a.mapping=as:o===ho&&(a.mapping=os),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===co||o===ho)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Hp(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Zi=4,Rc=[.125,.215,.35,.446,.526,.582],pi=20,Ia=new su,Cc=new Vt;let Na=null,Fa=0,Oa=0,Ba=!1;const ci=(1+Math.sqrt(5))/2,Gi=1/ci,Pc=[new R(-ci,Gi,0),new R(ci,Gi,0),new R(-Gi,0,ci),new R(Gi,0,ci),new R(0,ci,-Gi),new R(0,ci,Gi),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],Q0=new R;class Lc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Q0}=r;Na=this._renderer.getRenderTarget(),Fa=this._renderer.getActiveCubeFace(),Oa=this._renderer.getActiveMipmapLevel(),Ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ic(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Na,Fa,Oa),this._renderer.xr.enabled=Ba,t.scissorTest=!1,xr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===as||t.mapping===os?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Na=this._renderer.getRenderTarget(),Fa=this._renderer.getActiveCubeFace(),Oa=this._renderer.getActiveMipmapLevel(),Ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:zs,format:un,colorSpace:ls,depthBuffer:!1},s=Dc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Dc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=t_(r)),this._blurMaterial=e_(r,t,e)}return s}_compileMaterial(t){const e=new Me(this._lodPlanes[0],t);this._renderer.compile(e,Ia)}_sceneToCubeUV(t,e,n,s,r){const l=new Ke(90,1,e,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,p=h.toneMapping;h.getClearColor(Cc),h.toneMapping=jn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const _=new di({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),m=new Me(new ks,_);let f=!1;const w=t.background;w?w.isColor&&(_.color.copy(w),t.background=null,f=!0):(_.color.copy(Cc),f=!0);for(let E=0;E<6;E++){const y=E%3;y===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):y===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));const A=this._cubeSize;xr(s,y*A,E>2?A:0,A,A),h.setRenderTarget(s),f&&h.render(m,l),h.render(t,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=d,t.background=w}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===as||t.mapping===os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ic()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Uc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Me(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;xr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Ia)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Pc[(s-r-1)%Pc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Me(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*pi-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):pi;m>pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`);const f=[];let w=0;for(let L=0;L<pi;++L){const U=L/_,x=Math.exp(-U*U/2);f.push(x),L===0?w+=x:L<m&&(w+=2*x)}for(let L=0;L<f.length;L++)f[L]=f[L]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const y=this._sizeLods[s],A=3*y*(s>E-Zi?s-E+Zi:0),C=4*(this._cubeSize-y);xr(e,A,C,3*y,2*y),l.setRenderTarget(e),l.render(h,Ia)}}function t_(i){const t=[],e=[],n=[];let s=i;const r=i-Zi+1+Rc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Zi?l=Rc[a-i+Zi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,_=3,m=2,f=1,w=new Float32Array(_*g*p),E=new Float32Array(m*g*p),y=new Float32Array(f*g*p);for(let C=0;C<p;C++){const L=C%3*2/3-1,U=C>2?0:-1,x=[L,U,0,L+2/3,U,0,L+2/3,U+1,0,L,U,0,L+2/3,U+1,0,L,U+1,0];w.set(x,_*g*C),E.set(d,m*g*C);const S=[C,C,C,C,C,C];y.set(S,f*g*C)}const A=new ee;A.setAttribute("position",new Pe(w,_)),A.setAttribute("uv",new Pe(E,m)),A.setAttribute("faceIndex",new Pe(y,f)),t.push(A),s>Zi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Dc(i,t,e){const n=new Mi(i,t,e);return n.texture.mapping=$r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function e_(i,t,e){const n=new Float32Array(pi),s=new R(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ul(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Uc(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ul(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Ic(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function ul(){return`

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
	`}function n_(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===co||l===ho,u=l===as||l===os;if(c||u){let h=t.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new Lc(i)),h=c?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&s(p)?(e===null&&(e=new Lc(i)),h=c?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function i_(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&es("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function s_(i,t,e,n){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const p in d)t.update(d[p],i.ARRAY_BUFFER)}function c(h){const d=[],p=h.index,g=h.attributes.position;let _=0;if(p!==null){const w=p.array;_=p.version;for(let E=0,y=w.length;E<y;E+=3){const A=w[E+0],C=w[E+1],L=w[E+2];d.push(A,C,C,L,L,A)}}else if(g!==void 0){const w=g.array;_=g.version;for(let E=0,y=w.length/3-1;E<y;E+=3){const A=E+0,C=E+1,L=E+2;d.push(A,C,C,L,L,A)}}else return;const m=new(Wh(d)?jh:$h)(d,1);m.version=_;const f=r.get(h);f&&t.remove(f),r.set(h,m)}function u(h){const d=r.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function r_(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*a),e.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*a,g),e.update(p,n,g))}function u(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function h(d,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,_,0,g);let f=0;for(let w=0;w<g;w++)f+=p[w]*_[w];e.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function a_(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function o_(i,t,e){const n=new WeakMap,s=new Wt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let x=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",x)};d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let E=0;p===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let y=o.attributes.position.count*E,A=1;y>t.maxTextureSize&&(A=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const C=new Float32Array(y*A*4*h),L=new Xh(C,y,A,h);L.type=Mn,L.needsUpdate=!0;const U=E*4;for(let S=0;S<h;S++){const b=m[S],F=f[S],B=w[S],z=y*A*4*S;for(let q=0;q<b.count;q++){const G=q*U;p===!0&&(s.fromBufferAttribute(b,q),C[z+G+0]=s.x,C[z+G+1]=s.y,C[z+G+2]=s.z,C[z+G+3]=0),g===!0&&(s.fromBufferAttribute(F,q),C[z+G+4]=s.x,C[z+G+5]=s.y,C[z+G+6]=s.z,C[z+G+7]=0),_===!0&&(s.fromBufferAttribute(B,q),C[z+G+8]=s.x,C[z+G+9]=s.y,C[z+G+10]=s.z,C[z+G+11]=B.itemSize===4?s.w:1)}}d={count:h,texture:L,size:new bt(y,A)},n.set(o,d),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];const g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function l_(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}const au=new Le,Nc=new nu(1,1),ou=new Xh,lu=new wp,cu=new Jh,Fc=[],Oc=[],Bc=new Float32Array(16),zc=new Float32Array(9),kc=new Float32Array(4);function hs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Fc[s];if(r===void 0&&(r=new Float32Array(s),Fc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Se(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Kr(i,t){let e=Oc[t];e===void 0&&(e=new Int32Array(t),Oc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function c_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function h_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2fv(this.addr,t),Se(e,t)}}function u_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;i.uniform3fv(this.addr,t),Se(e,t)}}function d_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4fv(this.addr,t),Se(e,t)}}function f_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;kc.set(n),i.uniformMatrix2fv(this.addr,!1,kc),Se(e,n)}}function p_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;zc.set(n),i.uniformMatrix3fv(this.addr,!1,zc),Se(e,n)}}function m_(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;Bc.set(n),i.uniformMatrix4fv(this.addr,!1,Bc),Se(e,n)}}function g_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function __(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2iv(this.addr,t),Se(e,t)}}function v_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3iv(this.addr,t),Se(e,t)}}function x_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4iv(this.addr,t),Se(e,t)}}function M_(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function y_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2uiv(this.addr,t),Se(e,t)}}function S_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3uiv(this.addr,t),Se(e,t)}}function b_(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4uiv(this.addr,t),Se(e,t)}}function E_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Nc.compareFunction=Vh,r=Nc):r=au,e.setTexture2D(t||r,s)}function w_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||lu,s)}function T_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||cu,s)}function A_(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ou,s)}function R_(i){switch(i){case 5126:return c_;case 35664:return h_;case 35665:return u_;case 35666:return d_;case 35674:return f_;case 35675:return p_;case 35676:return m_;case 5124:case 35670:return g_;case 35667:case 35671:return __;case 35668:case 35672:return v_;case 35669:case 35673:return x_;case 5125:return M_;case 36294:return y_;case 36295:return S_;case 36296:return b_;case 35678:case 36198:case 36298:case 36306:case 35682:return E_;case 35679:case 36299:case 36307:return w_;case 35680:case 36300:case 36308:case 36293:return T_;case 36289:case 36303:case 36311:case 36292:return A_}}function C_(i,t){i.uniform1fv(this.addr,t)}function P_(i,t){const e=hs(t,this.size,2);i.uniform2fv(this.addr,e)}function L_(i,t){const e=hs(t,this.size,3);i.uniform3fv(this.addr,e)}function D_(i,t){const e=hs(t,this.size,4);i.uniform4fv(this.addr,e)}function U_(i,t){const e=hs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function I_(i,t){const e=hs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function N_(i,t){const e=hs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function F_(i,t){i.uniform1iv(this.addr,t)}function O_(i,t){i.uniform2iv(this.addr,t)}function B_(i,t){i.uniform3iv(this.addr,t)}function z_(i,t){i.uniform4iv(this.addr,t)}function k_(i,t){i.uniform1uiv(this.addr,t)}function H_(i,t){i.uniform2uiv(this.addr,t)}function V_(i,t){i.uniform3uiv(this.addr,t)}function G_(i,t){i.uniform4uiv(this.addr,t)}function W_(i,t,e){const n=this.cache,s=t.length,r=Kr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||au,r[a])}function X_(i,t,e){const n=this.cache,s=t.length,r=Kr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||lu,r[a])}function Y_(i,t,e){const n=this.cache,s=t.length,r=Kr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||cu,r[a])}function q_(i,t,e){const n=this.cache,s=t.length,r=Kr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||ou,r[a])}function $_(i){switch(i){case 5126:return C_;case 35664:return P_;case 35665:return L_;case 35666:return D_;case 35674:return U_;case 35675:return I_;case 35676:return N_;case 5124:case 35670:return F_;case 35667:case 35671:return O_;case 35668:case 35672:return B_;case 35669:case 35673:return z_;case 5125:return k_;case 36294:return H_;case 36295:return V_;case 36296:return G_;case 35678:case 36198:case 36298:case 36306:case 35682:return W_;case 35679:case 36299:case 36307:return X_;case 35680:case 36300:case 36308:case 36293:return Y_;case 36289:case 36303:case 36311:case 36292:return q_}}class j_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=R_(e.type)}}class K_{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$_(e.type)}}class Z_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const za=/(\w+)(\])?(\[|\.)?/g;function Hc(i,t){i.seq.push(t),i.map[t.id]=t}function J_(i,t,e){const n=i.name,s=n.length;for(za.lastIndex=0;;){const r=za.exec(n),a=za.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Hc(e,c===void 0?new j_(o,i,t):new K_(o,i,t));break}else{let h=e.map[o];h===void 0&&(h=new Z_(o),Hc(e,h)),e=h}}}class Ur{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);J_(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Vc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Q_=37297;let tv=0;function ev(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Gc=new Ot;function nv(i){Yt._getMatrix(Gc,Yt.workingColorSpace,i);const t=`mat3( ${Gc.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(i)){case zr:return[t,"LinearTransferOETF"];case te:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Wc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+ev(i.getShaderSource(t),o)}else return r}function iv(i,t){const e=nv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function sv(i,t){let e;switch(t){case zf:e="Linear";break;case kf:e="Reinhard";break;case Hf:e="Cineon";break;case Dh:e="ACESFilmic";break;case Gf:e="AgX";break;case Wf:e="Neutral";break;case Vf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Mr=new R;function rv(){Yt.getLuminanceCoefficients(Mr);const i=Mr.x.toFixed(4),t=Mr.y.toFixed(4),e=Mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function av(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Cs).join(`
`)}function ov(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function lv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Cs(i){return i!==""}function Xc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Yc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const cv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(i){return i.replace(cv,uv)}const hv=new Map;function uv(i,t){let e=Bt[t];if(e===void 0){const n=hv.get(t);if(n!==void 0)e=Bt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Go(e)}const dv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qc(i){return i.replace(dv,fv)}function fv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $c(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function pv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ph?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===vf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(t="SHADOWMAP_TYPE_VSM"),t}function mv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case as:case os:t="ENVMAP_TYPE_CUBE";break;case $r:t="ENVMAP_TYPE_CUBE_UV";break}return t}function gv(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===os&&(t="ENVMAP_MODE_REFRACTION"),t}function _v(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Lh:t="ENVMAP_BLENDING_MULTIPLY";break;case Of:t="ENVMAP_BLENDING_MIX";break;case Bf:t="ENVMAP_BLENDING_ADD";break}return t}function vv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function xv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=pv(e),c=mv(e),u=gv(e),h=_v(e),d=vv(e),p=av(e),g=ov(r),_=s.createProgram();let m,f,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),f.length>0&&(f+=`
`)):(m=[$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),f=[$c(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==jn?"#define TONE_MAPPING":"",e.toneMapping!==jn?Bt.tonemapping_pars_fragment:"",e.toneMapping!==jn?sv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,iv("linearToOutputTexel",e.outputColorSpace),rv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Cs).join(`
`)),a=Go(a),a=Xc(a,e),a=Yc(a,e),o=Go(o),o=Xc(o,e),o=Yc(o,e),a=qc(a),o=qc(o),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Xl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Xl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const E=w+m+a,y=w+f+o,A=Vc(s,s.VERTEX_SHADER,E),C=Vc(s,s.FRAGMENT_SHADER,y);s.attachShader(_,A),s.attachShader(_,C),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function L(b){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(A)||"",z=s.getShaderInfoLog(C)||"",q=F.trim(),G=B.trim(),Z=z.trim();let V=!0,st=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,A,C);else{const ut=Wc(s,A,"vertex"),Mt=Wc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+q+`
`+ut+`
`+Mt)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(G===""||Z==="")&&(st=!1);st&&(b.diagnostics={runnable:V,programLog:q,vertexShader:{log:G,prefix:m},fragmentShader:{log:Z,prefix:f}})}s.deleteShader(A),s.deleteShader(C),U=new Ur(s,_),x=lv(s,_)}let U;this.getUniforms=function(){return U===void 0&&L(this),U};let x;this.getAttributes=function(){return x===void 0&&L(this),x};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,Q_)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=tv++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=C,this}let Mv=0;class yv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Sv(t),e.set(t,n)),n}}class Sv{constructor(t){this.id=Mv++,this.code=t,this.usedTimes=0}}function bv(i,t,e,n,s,r,a){const o=new Yh,l=new yv,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,S,b,F,B){const z=F.fog,q=B.geometry,G=x.isMeshStandardMaterial?F.environment:null,Z=(x.isMeshStandardMaterial?e:t).get(x.envMap||G),V=Z&&Z.mapping===$r?Z.image.height:null,st=g[x.type];x.precision!==null&&(p=s.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const ut=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Mt=ut!==void 0?ut.length:0;let Nt=0;q.morphAttributes.position!==void 0&&(Nt=1),q.morphAttributes.normal!==void 0&&(Nt=2),q.morphAttributes.color!==void 0&&(Nt=3);let ie,qt,X,ot;if(st){const jt=We[st];ie=jt.vertexShader,qt=jt.fragmentShader}else ie=x.vertexShader,qt=x.fragmentShader,l.update(x),X=l.getVertexShaderID(x),ot=l.getFragmentShaderID(x);const et=i.getRenderTarget(),Et=i.state.buffers.depth.getReversed(),wt=B.isInstancedMesh===!0,Ut=B.isBatchedMesh===!0,pe=!!x.map,Gt=!!x.matcap,P=!!Z,ae=!!x.aoMap,At=!!x.lightMap,$t=!!x.bumpMap,St=!!x.normalMap,he=!!x.displacementMap,pt=!!x.emissiveMap,zt=!!x.metalnessMap,be=!!x.roughnessMap,me=x.anisotropy>0,T=x.clearcoat>0,v=x.dispersion>0,O=x.iridescence>0,Y=x.sheen>0,j=x.transmission>0,W=me&&!!x.anisotropyMap,yt=T&&!!x.clearcoatMap,nt=T&&!!x.clearcoatNormalMap,_t=T&&!!x.clearcoatRoughnessMap,vt=O&&!!x.iridescenceMap,Q=O&&!!x.iridescenceThicknessMap,ht=Y&&!!x.sheenColorMap,Pt=Y&&!!x.sheenRoughnessMap,xt=!!x.specularMap,lt=!!x.specularColorMap,Ft=!!x.specularIntensityMap,D=j&&!!x.transmissionMap,tt=j&&!!x.thicknessMap,rt=!!x.gradientMap,ft=!!x.alphaMap,K=x.alphaTest>0,$=!!x.alphaHash,gt=!!x.extensions;let It=jn;x.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(It=i.toneMapping);const oe={shaderID:st,shaderType:x.type,shaderName:x.name,vertexShader:ie,fragmentShader:qt,defines:x.defines,customVertexShaderID:X,customFragmentShaderID:ot,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:Ut,batchingColor:Ut&&B._colorsTexture!==null,instancing:wt,instancingColor:wt&&B.instanceColor!==null,instancingMorph:wt&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:ls,alphaToCoverage:!!x.alphaToCoverage,map:pe,matcap:Gt,envMap:P,envMapMode:P&&Z.mapping,envMapCubeUVHeight:V,aoMap:ae,lightMap:At,bumpMap:$t,normalMap:St,displacementMap:d&&he,emissiveMap:pt,normalMapObjectSpace:St&&x.normalMapType===$f,normalMapTangentSpace:St&&x.normalMapType===Hh,metalnessMap:zt,roughnessMap:be,anisotropy:me,anisotropyMap:W,clearcoat:T,clearcoatMap:yt,clearcoatNormalMap:nt,clearcoatRoughnessMap:_t,dispersion:v,iridescence:O,iridescenceMap:vt,iridescenceThicknessMap:Q,sheen:Y,sheenColorMap:ht,sheenRoughnessMap:Pt,specularMap:xt,specularColorMap:lt,specularIntensityMap:Ft,transmission:j,transmissionMap:D,thicknessMap:tt,gradientMap:rt,opaque:x.transparent===!1&&x.blending===ts&&x.alphaToCoverage===!1,alphaMap:ft,alphaTest:K,alphaHash:$,combine:x.combine,mapUv:pe&&_(x.map.channel),aoMapUv:ae&&_(x.aoMap.channel),lightMapUv:At&&_(x.lightMap.channel),bumpMapUv:$t&&_(x.bumpMap.channel),normalMapUv:St&&_(x.normalMap.channel),displacementMapUv:he&&_(x.displacementMap.channel),emissiveMapUv:pt&&_(x.emissiveMap.channel),metalnessMapUv:zt&&_(x.metalnessMap.channel),roughnessMapUv:be&&_(x.roughnessMap.channel),anisotropyMapUv:W&&_(x.anisotropyMap.channel),clearcoatMapUv:yt&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:nt&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_t&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&_(x.sheenRoughnessMap.channel),specularMapUv:xt&&_(x.specularMap.channel),specularColorMapUv:lt&&_(x.specularColorMap.channel),specularIntensityMapUv:Ft&&_(x.specularIntensityMap.channel),transmissionMapUv:D&&_(x.transmissionMap.channel),thicknessMapUv:tt&&_(x.thicknessMap.channel),alphaMapUv:ft&&_(x.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(St||me),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!q.attributes.uv&&(pe||ft),fog:!!z,useFog:x.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Et,skinning:B.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:Nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&b.length>0,shadowMapType:i.shadowMap.type,toneMapping:It,decodeVideoTexture:pe&&x.map.isVideoTexture===!0&&Yt.getTransfer(x.map.colorSpace)===te,decodeVideoTextureEmissive:pt&&x.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(x.emissiveMap.colorSpace)===te,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===cn,flipSided:x.side===Xe,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:gt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&x.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return oe.vertexUv1s=c.has(1),oe.vertexUv2s=c.has(2),oe.vertexUv3s=c.has(3),c.clear(),oe}function f(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const b in x.defines)S.push(b),S.push(x.defines[b]);return x.isRawShaderMaterial===!1&&(w(S,x),E(S,x),S.push(i.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function w(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function E(x,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),x.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),x.push(o.mask)}function y(x){const S=g[x.type];let b;if(S){const F=We[S];b=sl.clone(F.uniforms)}else b=x.uniforms;return b}function A(x,S){let b;for(let F=0,B=u.length;F<B;F++){const z=u[F];if(z.cacheKey===S){b=z,++b.usedTimes;break}}return b===void 0&&(b=new xv(i,S,x,r),u.push(b)),b}function C(x){if(--x.usedTimes===0){const S=u.indexOf(x);u[S]=u[u.length-1],u.pop(),x.destroy()}}function L(x){l.remove(x)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:y,acquireProgram:A,releaseProgram:C,releaseShaderCache:L,programs:u,dispose:U}}function Ev(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function wv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function jc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Kc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h,d,p,g,_,m){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=_,f.group=m),t++,f}function o(h,d,p,g,_,m){const f=a(h,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):e.push(f)}function l(h,d,p,g,_,m){const f=a(h,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function c(h,d){e.length>1&&e.sort(h||wv),n.length>1&&n.sort(d||jc),s.length>1&&s.sort(d||jc)}function u(){for(let h=t,d=i.length;h<d;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function Tv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Kc,i.set(n,[a])):s>=r.length?(a=new Kc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Av(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Vt};break;case"SpotLight":e={position:new R,direction:new R,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function Rv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Cv=0;function Pv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Lv(i){const t=new Av,e=Rv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new R);const s=new R,r=new Kt,a=new Kt;function o(c){let u=0,h=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,w=0,E=0,y=0,A=0,C=0,L=0;c.sort(Pv);for(let x=0,S=c.length;x<S;x++){const b=c[x],F=b.color,B=b.intensity,z=b.distance,q=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)u+=F.r*B,h+=F.g*B,d+=F.b*B;else if(b.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(b.sh.coefficients[G],B);L++}else if(b.isDirectionalLight){const G=t.get(b);if(G.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const Z=b.shadow,V=e.get(b);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=b.shadow.matrix,w++}n.directional[p]=G,p++}else if(b.isSpotLight){const G=t.get(b);G.position.setFromMatrixPosition(b.matrixWorld),G.color.copy(F).multiplyScalar(B),G.distance=z,G.coneCos=Math.cos(b.angle),G.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),G.decay=b.decay,n.spot[_]=G;const Z=b.shadow;if(b.map&&(n.spotLightMap[A]=b.map,A++,Z.updateMatrices(b),b.castShadow&&C++),n.spotLightMatrix[_]=Z.matrix,b.castShadow){const V=e.get(b);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=q,y++}_++}else if(b.isRectAreaLight){const G=t.get(b);G.color.copy(F).multiplyScalar(B),G.halfWidth.set(b.width*.5,0,0),G.halfHeight.set(0,b.height*.5,0),n.rectArea[m]=G,m++}else if(b.isPointLight){const G=t.get(b);if(G.color.copy(b.color).multiplyScalar(b.intensity),G.distance=b.distance,G.decay=b.decay,b.castShadow){const Z=b.shadow,V=e.get(b);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=b.shadow.matrix,E++}n.point[g]=G,g++}else if(b.isHemisphereLight){const G=t.get(b);G.skyColor.copy(b.color).multiplyScalar(B),G.groundColor.copy(b.groundColor).multiplyScalar(B),n.hemi[f]=G,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const U=n.hash;(U.directionalLength!==p||U.pointLength!==g||U.spotLength!==_||U.rectAreaLength!==m||U.hemiLength!==f||U.numDirectionalShadows!==w||U.numPointShadows!==E||U.numSpotShadows!==y||U.numSpotMaps!==A||U.numLightProbes!==L)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=y+A-C,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=L,U.directionalLength=p,U.pointLength=g,U.spotLength=_,U.rectAreaLength=m,U.hemiLength=f,U.numDirectionalShadows=w,U.numPointShadows=E,U.numSpotShadows=y,U.numSpotMaps=A,U.numLightProbes=L,n.version=Cv++)}function l(c,u){let h=0,d=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let f=0,w=c.length;f<w;f++){const E=c[f];if(E.isDirectionalLight){const y=n.directional[h];y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),h++}else if(E.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(E.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Zc(i){const t=new Lv(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function a(u){n.push(u)}function o(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Dv(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Zc(i),t.set(s,[o])):r>=a.length?(o=new Zc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Uv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Iv=`uniform sampler2D shadow_pass;
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
}`;function Nv(i,t,e){let n=new rl;const s=new bt,r=new bt,a=new Wt,o=new Jp({depthPacking:qf}),l=new Qp,c={},u=e.maxTextureSize,h={[Zn]:Xe,[Xe]:Zn,[cn]:cn},d=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bt},radius:{value:4}},vertexShader:Uv,fragmentShader:Iv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new ee;g.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Me(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ph;let f=this.type;this.render=function(C,L,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const x=i.getRenderTarget(),S=i.getActiveCubeFace(),b=i.getActiveMipmapLevel(),F=i.state;F.setBlending($n),F.buffers.depth.getReversed()?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const B=f!==Dn&&this.type===Dn,z=f===Dn&&this.type!==Dn;for(let q=0,G=C.length;q<G;q++){const Z=C[q],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const st=V.getFrameExtents();if(s.multiply(st),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/st.x),s.x=r.x*st.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/st.y),s.y=r.y*st.y,V.mapSize.y=r.y)),V.map===null||B===!0||z===!0){const Mt=this.type!==Dn?{minFilter:Ze,magFilter:Ze}:{};V.map!==null&&V.map.dispose(),V.map=new Mi(s.x,s.y,Mt),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ut=V.getViewportCount();for(let Mt=0;Mt<ut;Mt++){const Nt=V.getViewport(Mt);a.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),F.viewport(a),V.updateMatrices(Z,Mt),n=V.getFrustum(),y(L,U,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Dn&&w(V,U),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(x,S,b)};function w(C,L){const U=t.update(_);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Mi(s.x,s.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,i.setRenderTarget(C.mapPass),i.clear(),i.renderBufferDirect(L,null,U,d,_,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,i.setRenderTarget(C.map),i.clear(),i.renderBufferDirect(L,null,U,p,_,null)}function E(C,L,U,x){let S=null;const b=U.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(b!==void 0)S=b;else if(S=U.isPointLight===!0?l:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const F=S.uuid,B=L.uuid;let z=c[F];z===void 0&&(z={},c[F]=z);let q=z[B];q===void 0&&(q=S.clone(),z[B]=q,L.addEventListener("dispose",A)),S=q}if(S.visible=L.visible,S.wireframe=L.wireframe,x===Dn?S.side=L.shadowSide!==null?L.shadowSide:L.side:S.side=L.shadowSide!==null?L.shadowSide:h[L.side],S.alphaMap=L.alphaMap,S.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,S.map=L.map,S.clipShadows=L.clipShadows,S.clippingPlanes=L.clippingPlanes,S.clipIntersection=L.clipIntersection,S.displacementMap=L.displacementMap,S.displacementScale=L.displacementScale,S.displacementBias=L.displacementBias,S.wireframeLinewidth=L.wireframeLinewidth,S.linewidth=L.linewidth,U.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const F=i.properties.get(S);F.light=U}return S}function y(C,L,U,x,S){if(C.visible===!1)return;if(C.layers.test(L.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&S===Dn)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,C.matrixWorld);const B=t.update(C),z=C.material;if(Array.isArray(z)){const q=B.groups;for(let G=0,Z=q.length;G<Z;G++){const V=q[G],st=z[V.materialIndex];if(st&&st.visible){const ut=E(C,st,x,S);C.onBeforeShadow(i,C,L,U,B,ut,V),i.renderBufferDirect(U,null,B,ut,C,V),C.onAfterShadow(i,C,L,U,B,ut,V)}}}else if(z.visible){const q=E(C,z,x,S);C.onBeforeShadow(i,C,L,U,B,q,null),i.renderBufferDirect(U,null,B,q,C,null),C.onAfterShadow(i,C,L,U,B,q,null)}}const F=C.children;for(let B=0,z=F.length;B<z;B++)y(F[B],L,U,x,S)}function A(C){C.target.removeEventListener("dispose",A);for(const U in c){const x=c[U],S=C.target.uuid;S in x&&(x[S].dispose(),delete x[S])}}}const Fv={[no]:io,[so]:oo,[ro]:lo,[rs]:ao,[io]:no,[oo]:so,[lo]:ro,[ao]:rs};function Ov(i,t){function e(){let D=!1;const tt=new Wt;let rt=null;const ft=new Wt(0,0,0,0);return{setMask:function(K){rt!==K&&!D&&(i.colorMask(K,K,K,K),rt=K)},setLocked:function(K){D=K},setClear:function(K,$,gt,It,oe){oe===!0&&(K*=It,$*=It,gt*=It),tt.set(K,$,gt,It),ft.equals(tt)===!1&&(i.clearColor(K,$,gt,It),ft.copy(tt))},reset:function(){D=!1,rt=null,ft.set(-1,0,0,0)}}}function n(){let D=!1,tt=!1,rt=null,ft=null,K=null;return{setReversed:function($){if(tt!==$){const gt=t.get("EXT_clip_control");$?gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.ZERO_TO_ONE_EXT):gt.clipControlEXT(gt.LOWER_LEFT_EXT,gt.NEGATIVE_ONE_TO_ONE_EXT),tt=$;const It=K;K=null,this.setClear(It)}},getReversed:function(){return tt},setTest:function($){$?et(i.DEPTH_TEST):Et(i.DEPTH_TEST)},setMask:function($){rt!==$&&!D&&(i.depthMask($),rt=$)},setFunc:function($){if(tt&&($=Fv[$]),ft!==$){switch($){case no:i.depthFunc(i.NEVER);break;case io:i.depthFunc(i.ALWAYS);break;case so:i.depthFunc(i.LESS);break;case rs:i.depthFunc(i.LEQUAL);break;case ro:i.depthFunc(i.EQUAL);break;case ao:i.depthFunc(i.GEQUAL);break;case oo:i.depthFunc(i.GREATER);break;case lo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=$}},setLocked:function($){D=$},setClear:function($){K!==$&&(tt&&($=1-$),i.clearDepth($),K=$)},reset:function(){D=!1,rt=null,ft=null,K=null,tt=!1}}}function s(){let D=!1,tt=null,rt=null,ft=null,K=null,$=null,gt=null,It=null,oe=null;return{setTest:function(jt){D||(jt?et(i.STENCIL_TEST):Et(i.STENCIL_TEST))},setMask:function(jt){tt!==jt&&!D&&(i.stencilMask(jt),tt=jt)},setFunc:function(jt,Tn,dn){(rt!==jt||ft!==Tn||K!==dn)&&(i.stencilFunc(jt,Tn,dn),rt=jt,ft=Tn,K=dn)},setOp:function(jt,Tn,dn){($!==jt||gt!==Tn||It!==dn)&&(i.stencilOp(jt,Tn,dn),$=jt,gt=Tn,It=dn)},setLocked:function(jt){D=jt},setClear:function(jt){oe!==jt&&(i.clearStencil(jt),oe=jt)},reset:function(){D=!1,tt=null,rt=null,ft=null,K=null,$=null,gt=null,It=null,oe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,w=null,E=null,y=null,A=null,C=null,L=new Vt(0,0,0),U=0,x=!1,S=null,b=null,F=null,B=null,z=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=Z>=2);let st=null,ut={};const Mt=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),ie=new Wt().fromArray(Mt),qt=new Wt().fromArray(Nt);function X(D,tt,rt,ft){const K=new Uint8Array(4),$=i.createTexture();i.bindTexture(D,$),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let gt=0;gt<rt;gt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(tt,0,i.RGBA,1,1,ft,0,i.RGBA,i.UNSIGNED_BYTE,K):i.texImage2D(tt+gt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,K);return $}const ot={};ot[i.TEXTURE_2D]=X(i.TEXTURE_2D,i.TEXTURE_2D,1),ot[i.TEXTURE_CUBE_MAP]=X(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ot[i.TEXTURE_2D_ARRAY]=X(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ot[i.TEXTURE_3D]=X(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(rs),$t(!1),St(Hl),et(i.CULL_FACE),ae($n);function et(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function Et(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function wt(D,tt){return h[D]!==tt?(i.bindFramebuffer(D,tt),h[D]=tt,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=tt),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=tt),!0):!1}function Ut(D,tt){let rt=p,ft=!1;if(D){rt=d.get(tt),rt===void 0&&(rt=[],d.set(tt,rt));const K=D.textures;if(rt.length!==K.length||rt[0]!==i.COLOR_ATTACHMENT0){for(let $=0,gt=K.length;$<gt;$++)rt[$]=i.COLOR_ATTACHMENT0+$;rt.length=K.length,ft=!0}}else rt[0]!==i.BACK&&(rt[0]=i.BACK,ft=!0);ft&&i.drawBuffers(rt)}function pe(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Gt={[ui]:i.FUNC_ADD,[Mf]:i.FUNC_SUBTRACT,[yf]:i.FUNC_REVERSE_SUBTRACT};Gt[Sf]=i.MIN,Gt[bf]=i.MAX;const P={[Ef]:i.ZERO,[wf]:i.ONE,[Tf]:i.SRC_COLOR,[to]:i.SRC_ALPHA,[Df]:i.SRC_ALPHA_SATURATE,[Pf]:i.DST_COLOR,[Rf]:i.DST_ALPHA,[Af]:i.ONE_MINUS_SRC_COLOR,[eo]:i.ONE_MINUS_SRC_ALPHA,[Lf]:i.ONE_MINUS_DST_COLOR,[Cf]:i.ONE_MINUS_DST_ALPHA,[Uf]:i.CONSTANT_COLOR,[If]:i.ONE_MINUS_CONSTANT_COLOR,[Nf]:i.CONSTANT_ALPHA,[Ff]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(D,tt,rt,ft,K,$,gt,It,oe,jt){if(D===$n){_===!0&&(Et(i.BLEND),_=!1);return}if(_===!1&&(et(i.BLEND),_=!0),D!==xf){if(D!==m||jt!==x){if((f!==ui||y!==ui)&&(i.blendEquation(i.FUNC_ADD),f=ui,y=ui),jt)switch(D){case ts:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gn:i.blendFunc(i.ONE,i.ONE);break;case Vl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Gl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ts:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Vl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Gl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}w=null,E=null,A=null,C=null,L.set(0,0,0),U=0,m=D,x=jt}return}K=K||tt,$=$||rt,gt=gt||ft,(tt!==f||K!==y)&&(i.blendEquationSeparate(Gt[tt],Gt[K]),f=tt,y=K),(rt!==w||ft!==E||$!==A||gt!==C)&&(i.blendFuncSeparate(P[rt],P[ft],P[$],P[gt]),w=rt,E=ft,A=$,C=gt),(It.equals(L)===!1||oe!==U)&&(i.blendColor(It.r,It.g,It.b,oe),L.copy(It),U=oe),m=D,x=!1}function At(D,tt){D.side===cn?Et(i.CULL_FACE):et(i.CULL_FACE);let rt=D.side===Xe;tt&&(rt=!rt),$t(rt),D.blending===ts&&D.transparent===!1?ae($n):ae(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const ft=D.stencilWrite;o.setTest(ft),ft&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),pt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):Et(i.SAMPLE_ALPHA_TO_COVERAGE)}function $t(D){S!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),S=D)}function St(D){D!==gf?(et(i.CULL_FACE),D!==b&&(D===Hl?i.cullFace(i.BACK):D===_f?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Et(i.CULL_FACE),b=D}function he(D){D!==F&&(G&&i.lineWidth(D),F=D)}function pt(D,tt,rt){D?(et(i.POLYGON_OFFSET_FILL),(B!==tt||z!==rt)&&(i.polygonOffset(tt,rt),B=tt,z=rt)):Et(i.POLYGON_OFFSET_FILL)}function zt(D){D?et(i.SCISSOR_TEST):Et(i.SCISSOR_TEST)}function be(D){D===void 0&&(D=i.TEXTURE0+q-1),st!==D&&(i.activeTexture(D),st=D)}function me(D,tt,rt){rt===void 0&&(st===null?rt=i.TEXTURE0+q-1:rt=st);let ft=ut[rt];ft===void 0&&(ft={type:void 0,texture:void 0},ut[rt]=ft),(ft.type!==D||ft.texture!==tt)&&(st!==rt&&(i.activeTexture(rt),st=rt),i.bindTexture(D,tt||ot[D]),ft.type=D,ft.texture=tt)}function T(){const D=ut[st];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{i.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{i.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function yt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _t(){try{i.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function vt(){try{i.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{i.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ht(D){ie.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),ie.copy(D))}function Pt(D){qt.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),qt.copy(D))}function xt(D,tt){let rt=c.get(tt);rt===void 0&&(rt=new WeakMap,c.set(tt,rt));let ft=rt.get(D);ft===void 0&&(ft=i.getUniformBlockIndex(tt,D.name),rt.set(D,ft))}function lt(D,tt){const ft=c.get(tt).get(D);l.get(tt)!==ft&&(i.uniformBlockBinding(tt,ft,D.__bindingPointIndex),l.set(tt,ft))}function Ft(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},st=null,ut={},h={},d=new WeakMap,p=[],g=null,_=!1,m=null,f=null,w=null,E=null,y=null,A=null,C=null,L=new Vt(0,0,0),U=0,x=!1,S=null,b=null,F=null,B=null,z=null,ie.set(0,0,i.canvas.width,i.canvas.height),qt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:Et,bindFramebuffer:wt,drawBuffers:Ut,useProgram:pe,setBlending:ae,setMaterial:At,setFlipSided:$t,setCullFace:St,setLineWidth:he,setPolygonOffset:pt,setScissorTest:zt,activeTexture:be,bindTexture:me,unbindTexture:T,compressedTexImage2D:v,compressedTexImage3D:O,texImage2D:vt,texImage3D:Q,updateUBOMapping:xt,uniformBlockBinding:lt,texStorage2D:nt,texStorage3D:_t,texSubImage2D:Y,texSubImage3D:j,compressedTexSubImage2D:W,compressedTexSubImage3D:yt,scissor:ht,viewport:Pt,reset:Ft}}function Bv(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new bt,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return p?new OffscreenCanvas(T,v):Hr("canvas")}function _(T,v,O){let Y=1;const j=me(T);if((j.width>O||j.height>O)&&(Y=O/Math.max(j.width,j.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const W=Math.floor(Y*j.width),yt=Math.floor(Y*j.height);h===void 0&&(h=g(W,yt));const nt=v?g(W,yt):h;return nt.width=W,nt.height=yt,nt.getContext("2d").drawImage(T,0,0,W,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+W+"x"+yt+")."),nt}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function w(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,v,O,Y,j=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let W=v;if(v===i.RED&&(O===i.FLOAT&&(W=i.R32F),O===i.HALF_FLOAT&&(W=i.R16F),O===i.UNSIGNED_BYTE&&(W=i.R8)),v===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.R8UI),O===i.UNSIGNED_SHORT&&(W=i.R16UI),O===i.UNSIGNED_INT&&(W=i.R32UI),O===i.BYTE&&(W=i.R8I),O===i.SHORT&&(W=i.R16I),O===i.INT&&(W=i.R32I)),v===i.RG&&(O===i.FLOAT&&(W=i.RG32F),O===i.HALF_FLOAT&&(W=i.RG16F),O===i.UNSIGNED_BYTE&&(W=i.RG8)),v===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RG8UI),O===i.UNSIGNED_SHORT&&(W=i.RG16UI),O===i.UNSIGNED_INT&&(W=i.RG32UI),O===i.BYTE&&(W=i.RG8I),O===i.SHORT&&(W=i.RG16I),O===i.INT&&(W=i.RG32I)),v===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGB8UI),O===i.UNSIGNED_SHORT&&(W=i.RGB16UI),O===i.UNSIGNED_INT&&(W=i.RGB32UI),O===i.BYTE&&(W=i.RGB8I),O===i.SHORT&&(W=i.RGB16I),O===i.INT&&(W=i.RGB32I)),v===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),O===i.UNSIGNED_INT&&(W=i.RGBA32UI),O===i.BYTE&&(W=i.RGBA8I),O===i.SHORT&&(W=i.RGBA16I),O===i.INT&&(W=i.RGBA32I)),v===i.RGB&&O===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),v===i.RGBA){const yt=j?zr:Yt.getTransfer(Y);O===i.FLOAT&&(W=i.RGBA32F),O===i.HALF_FLOAT&&(W=i.RGBA16F),O===i.UNSIGNED_BYTE&&(W=yt===te?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function y(T,v){let O;return T?v===null||v===vi||v===Is?O=i.DEPTH24_STENCIL8:v===Mn?O=i.DEPTH32F_STENCIL8:v===Us&&(O=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===vi||v===Is?O=i.DEPTH_COMPONENT24:v===Mn?O=i.DEPTH_COMPONENT32F:v===Us&&(O=i.DEPTH_COMPONENT16),O}function A(T,v){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ze&&T.minFilter!==rn?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function C(T){const v=T.target;v.removeEventListener("dispose",C),U(v),v.isVideoTexture&&u.delete(v)}function L(T){const v=T.target;v.removeEventListener("dispose",L),S(v)}function U(T){const v=n.get(T);if(v.__webglInit===void 0)return;const O=T.source,Y=d.get(O);if(Y){const j=Y[v.__cacheKey];j.usedTimes--,j.usedTimes===0&&x(T),Object.keys(Y).length===0&&d.delete(O)}n.remove(T)}function x(T){const v=n.get(T);i.deleteTexture(v.__webglTexture);const O=T.source,Y=d.get(O);delete Y[v.__cacheKey],a.memory.textures--}function S(T){const v=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let j=0;j<v.__webglFramebuffer[Y].length;j++)i.deleteFramebuffer(v.__webglFramebuffer[Y][j]);else i.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)i.deleteFramebuffer(v.__webglFramebuffer[Y]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=T.textures;for(let Y=0,j=O.length;Y<j;Y++){const W=n.get(O[Y]);W.__webglTexture&&(i.deleteTexture(W.__webglTexture),a.memory.textures--),n.remove(O[Y])}n.remove(T)}let b=0;function F(){b=0}function B(){const T=b;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),b+=1,T}function z(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function q(T,v){const O=n.get(T);if(T.isVideoTexture&&zt(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const Y=T.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ot(O,T,v);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+v)}function G(T,v){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){ot(O,T,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+v)}function Z(T,v){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){ot(O,T,v);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+v)}function V(T,v){const O=n.get(T);if(T.version>0&&O.__version!==T.version){et(O,T,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+v)}const st={[uo]:i.REPEAT,[mi]:i.CLAMP_TO_EDGE,[fo]:i.MIRRORED_REPEAT},ut={[Ze]:i.NEAREST,[Xf]:i.NEAREST_MIPMAP_NEAREST,[Ws]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[ia]:i.LINEAR_MIPMAP_NEAREST,[gi]:i.LINEAR_MIPMAP_LINEAR},Mt={[jf]:i.NEVER,[ep]:i.ALWAYS,[Kf]:i.LESS,[Vh]:i.LEQUAL,[Zf]:i.EQUAL,[tp]:i.GEQUAL,[Jf]:i.GREATER,[Qf]:i.NOTEQUAL};function Nt(T,v){if(v.type===Mn&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===rn||v.magFilter===ia||v.magFilter===Ws||v.magFilter===gi||v.minFilter===rn||v.minFilter===ia||v.minFilter===Ws||v.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,st[v.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,st[v.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,st[v.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ut[v.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ut[v.minFilter]),v.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,Mt[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Ze||v.minFilter!==Ws&&v.minFilter!==gi||v.type===Mn&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ie(T,v){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",C));const Y=v.source;let j=d.get(Y);j===void 0&&(j={},d.set(Y,j));const W=z(v);if(W!==T.__cacheKey){j[W]===void 0&&(j[W]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),j[W].usedTimes++;const yt=j[T.__cacheKey];yt!==void 0&&(j[T.__cacheKey].usedTimes--,yt.usedTimes===0&&x(v)),T.__cacheKey=W,T.__webglTexture=j[W].texture}return O}function qt(T,v,O){return Math.floor(Math.floor(T/O)/v)}function X(T,v,O,Y){const W=T.updateRanges;if(W.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,O,Y,v.data);else{W.sort((Q,ht)=>Q.start-ht.start);let yt=0;for(let Q=1;Q<W.length;Q++){const ht=W[yt],Pt=W[Q],xt=ht.start+ht.count,lt=qt(Pt.start,v.width,4),Ft=qt(ht.start,v.width,4);Pt.start<=xt+1&&lt===Ft&&qt(Pt.start+Pt.count-1,v.width,4)===lt?ht.count=Math.max(ht.count,Pt.start+Pt.count-ht.start):(++yt,W[yt]=Pt)}W.length=yt+1;const nt=i.getParameter(i.UNPACK_ROW_LENGTH),_t=i.getParameter(i.UNPACK_SKIP_PIXELS),vt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let Q=0,ht=W.length;Q<ht;Q++){const Pt=W[Q],xt=Math.floor(Pt.start/4),lt=Math.ceil(Pt.count/4),Ft=xt%v.width,D=Math.floor(xt/v.width),tt=lt,rt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ft),i.pixelStorei(i.UNPACK_SKIP_ROWS,D),e.texSubImage2D(i.TEXTURE_2D,0,Ft,D,tt,rt,O,Y,v.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,nt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,_t),i.pixelStorei(i.UNPACK_SKIP_ROWS,vt)}}function ot(T,v,O){let Y=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=i.TEXTURE_3D);const j=ie(T,v),W=v.source;e.bindTexture(Y,T.__webglTexture,i.TEXTURE0+O);const yt=n.get(W);if(W.version!==yt.__version||j===!0){e.activeTexture(i.TEXTURE0+O);const nt=Yt.getPrimaries(Yt.workingColorSpace),_t=v.colorSpace===Yn?null:Yt.getPrimaries(v.colorSpace),vt=v.colorSpace===Yn||nt===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Q=_(v.image,!1,s.maxTextureSize);Q=be(v,Q);const ht=r.convert(v.format,v.colorSpace),Pt=r.convert(v.type);let xt=E(v.internalFormat,ht,Pt,v.colorSpace,v.isVideoTexture);Nt(Y,v);let lt;const Ft=v.mipmaps,D=v.isVideoTexture!==!0,tt=yt.__version===void 0||j===!0,rt=W.dataReady,ft=A(v,Q);if(v.isDepthTexture)xt=y(v.format===Fs,v.type),tt&&(D?e.texStorage2D(i.TEXTURE_2D,1,xt,Q.width,Q.height):e.texImage2D(i.TEXTURE_2D,0,xt,Q.width,Q.height,0,ht,Pt,null));else if(v.isDataTexture)if(Ft.length>0){D&&tt&&e.texStorage2D(i.TEXTURE_2D,ft,xt,Ft[0].width,Ft[0].height);for(let K=0,$=Ft.length;K<$;K++)lt=Ft[K],D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ht,Pt,lt.data):e.texImage2D(i.TEXTURE_2D,K,xt,lt.width,lt.height,0,ht,Pt,lt.data);v.generateMipmaps=!1}else D?(tt&&e.texStorage2D(i.TEXTURE_2D,ft,xt,Q.width,Q.height),rt&&X(v,Q,ht,Pt)):e.texImage2D(i.TEXTURE_2D,0,xt,Q.width,Q.height,0,ht,Pt,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){D&&tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,xt,Ft[0].width,Ft[0].height,Q.depth);for(let K=0,$=Ft.length;K<$;K++)if(lt=Ft[K],v.format!==un)if(ht!==null)if(D){if(rt)if(v.layerUpdates.size>0){const gt=Ac(lt.width,lt.height,v.format,v.type);for(const It of v.layerUpdates){const oe=lt.data.subarray(It*gt/lt.data.BYTES_PER_ELEMENT,(It+1)*gt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,It,lt.width,lt.height,1,ht,oe)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Q.depth,ht,lt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,xt,lt.width,lt.height,Q.depth,0,lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Q.depth,ht,Pt,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,xt,lt.width,lt.height,Q.depth,0,ht,Pt,lt.data)}else{D&&tt&&e.texStorage2D(i.TEXTURE_2D,ft,xt,Ft[0].width,Ft[0].height);for(let K=0,$=Ft.length;K<$;K++)lt=Ft[K],v.format!==un?ht!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ht,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,xt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ht,Pt,lt.data):e.texImage2D(i.TEXTURE_2D,K,xt,lt.width,lt.height,0,ht,Pt,lt.data)}else if(v.isDataArrayTexture)if(D){if(tt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,xt,Q.width,Q.height,Q.depth),rt)if(v.layerUpdates.size>0){const K=Ac(Q.width,Q.height,v.format,v.type);for(const $ of v.layerUpdates){const gt=Q.data.subarray($*K/Q.data.BYTES_PER_ELEMENT,($+1)*K/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,Q.width,Q.height,1,ht,Pt,gt)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ht,Pt,Q.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,xt,Q.width,Q.height,Q.depth,0,ht,Pt,Q.data);else if(v.isData3DTexture)D?(tt&&e.texStorage3D(i.TEXTURE_3D,ft,xt,Q.width,Q.height,Q.depth),rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ht,Pt,Q.data)):e.texImage3D(i.TEXTURE_3D,0,xt,Q.width,Q.height,Q.depth,0,ht,Pt,Q.data);else if(v.isFramebufferTexture){if(tt)if(D)e.texStorage2D(i.TEXTURE_2D,ft,xt,Q.width,Q.height);else{let K=Q.width,$=Q.height;for(let gt=0;gt<ft;gt++)e.texImage2D(i.TEXTURE_2D,gt,xt,K,$,0,ht,Pt,null),K>>=1,$>>=1}}else if(Ft.length>0){if(D&&tt){const K=me(Ft[0]);e.texStorage2D(i.TEXTURE_2D,ft,xt,K.width,K.height)}for(let K=0,$=Ft.length;K<$;K++)lt=Ft[K],D?rt&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,ht,Pt,lt):e.texImage2D(i.TEXTURE_2D,K,xt,ht,Pt,lt);v.generateMipmaps=!1}else if(D){if(tt){const K=me(Q);e.texStorage2D(i.TEXTURE_2D,ft,xt,K.width,K.height)}rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ht,Pt,Q)}else e.texImage2D(i.TEXTURE_2D,0,xt,ht,Pt,Q);m(v)&&f(Y),yt.__version=W.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function et(T,v,O){if(v.image.length!==6)return;const Y=ie(T,v),j=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const W=n.get(j);if(j.version!==W.__version||Y===!0){e.activeTexture(i.TEXTURE0+O);const yt=Yt.getPrimaries(Yt.workingColorSpace),nt=v.colorSpace===Yn?null:Yt.getPrimaries(v.colorSpace),_t=v.colorSpace===Yn||yt===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const vt=v.isCompressedTexture||v.image[0].isCompressedTexture,Q=v.image[0]&&v.image[0].isDataTexture,ht=[];for(let $=0;$<6;$++)!vt&&!Q?ht[$]=_(v.image[$],!0,s.maxCubemapSize):ht[$]=Q?v.image[$].image:v.image[$],ht[$]=be(v,ht[$]);const Pt=ht[0],xt=r.convert(v.format,v.colorSpace),lt=r.convert(v.type),Ft=E(v.internalFormat,xt,lt,v.colorSpace),D=v.isVideoTexture!==!0,tt=W.__version===void 0||Y===!0,rt=j.dataReady;let ft=A(v,Pt);Nt(i.TEXTURE_CUBE_MAP,v);let K;if(vt){D&&tt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Ft,Pt.width,Pt.height);for(let $=0;$<6;$++){K=ht[$].mipmaps;for(let gt=0;gt<K.length;gt++){const It=K[gt];v.format!==un?xt!==null?D?rt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt,0,0,It.width,It.height,xt,It.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt,Ft,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt,0,0,It.width,It.height,xt,lt,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt,Ft,It.width,It.height,0,xt,lt,It.data)}}}else{if(K=v.mipmaps,D&&tt){K.length>0&&ft++;const $=me(ht[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Ft,$.width,$.height)}for(let $=0;$<6;$++)if(Q){D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ht[$].width,ht[$].height,xt,lt,ht[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ft,ht[$].width,ht[$].height,0,xt,lt,ht[$].data);for(let gt=0;gt<K.length;gt++){const oe=K[gt].image[$].image;D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt+1,0,0,oe.width,oe.height,xt,lt,oe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt+1,Ft,oe.width,oe.height,0,xt,lt,oe.data)}}else{D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,xt,lt,ht[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ft,xt,lt,ht[$]);for(let gt=0;gt<K.length;gt++){const It=K[gt];D?rt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt+1,0,0,xt,lt,It.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,gt+1,Ft,xt,lt,It.image[$])}}}m(v)&&f(i.TEXTURE_CUBE_MAP),W.__version=j.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function Et(T,v,O,Y,j,W){const yt=r.convert(O.format,O.colorSpace),nt=r.convert(O.type),_t=E(O.internalFormat,yt,nt,O.colorSpace),vt=n.get(v),Q=n.get(O);if(Q.__renderTarget=v,!vt.__hasExternalTextures){const ht=Math.max(1,v.width>>W),Pt=Math.max(1,v.height>>W);j===i.TEXTURE_3D||j===i.TEXTURE_2D_ARRAY?e.texImage3D(j,W,_t,ht,Pt,v.depth,0,yt,nt,null):e.texImage2D(j,W,_t,ht,Pt,0,yt,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),pt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,j,Q.__webglTexture,0,he(v)):(j===i.TEXTURE_2D||j>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,j,Q.__webglTexture,W),e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(T,v,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),v.depthBuffer){const Y=v.depthTexture,j=Y&&Y.isDepthTexture?Y.type:null,W=y(v.stencilBuffer,j),yt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=he(v);pt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,W,v.width,v.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,W,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,W,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,yt,i.RENDERBUFFER,T)}else{const Y=v.textures;for(let j=0;j<Y.length;j++){const W=Y[j],yt=r.convert(W.format,W.colorSpace),nt=r.convert(W.type),_t=E(W.internalFormat,yt,nt,W.colorSpace),vt=he(v);O&&pt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,vt,_t,v.width,v.height):pt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,vt,_t,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,_t,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(v.depthTexture);Y.__renderTarget=v,(!Y.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),q(v.depthTexture,0);const j=Y.__webglTexture,W=he(v);if(v.depthTexture.format===Ns)pt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,j,0);else if(v.depthTexture.format===Fs)pt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function pe(T){const v=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const Y=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){const j=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",j)};Y.addEventListener("dispose",j),v.__depthDisposeCallback=j}v.__boundDepthTexture=Y}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const Y=T.texture.mipmaps;Y&&Y.length>0?Ut(v.__webglFramebuffer[0],T):Ut(v.__webglFramebuffer,T)}else if(O){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=i.createRenderbuffer(),wt(v.__webglDepthbuffer[Y],T,!1);else{const j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,W)}}else{const Y=T.texture.mipmaps;if(Y&&Y.length>0?e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),wt(v.__webglDepthbuffer,T,!1);else{const j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,W)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(T,v,O){const Y=n.get(T);v!==void 0&&Et(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&pe(T)}function P(T){const v=T.texture,O=n.get(T),Y=n.get(v);T.addEventListener("dispose",L);const j=T.textures,W=T.isWebGLCubeRenderTarget===!0,yt=j.length>1;if(yt||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=v.version,a.memory.textures++),W){O.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[nt]=[];for(let _t=0;_t<v.mipmaps.length;_t++)O.__webglFramebuffer[nt][_t]=i.createFramebuffer()}else O.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let nt=0;nt<v.mipmaps.length;nt++)O.__webglFramebuffer[nt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(yt)for(let nt=0,_t=j.length;nt<_t;nt++){const vt=n.get(j[nt]);vt.__webglTexture===void 0&&(vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&pt(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let nt=0;nt<j.length;nt++){const _t=j[nt];O.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[nt]);const vt=r.convert(_t.format,_t.colorSpace),Q=r.convert(_t.type),ht=E(_t.internalFormat,vt,Q,_t.colorSpace,T.isXRRenderTarget===!0),Pt=he(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Pt,ht,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,O.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),wt(O.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(W){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,v);for(let nt=0;nt<6;nt++)if(v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)Et(O.__webglFramebuffer[nt][_t],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,_t);else Et(O.__webglFramebuffer[nt],T,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);m(v)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let nt=0,_t=j.length;nt<_t;nt++){const vt=j[nt],Q=n.get(vt);let ht=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ht=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,Q.__webglTexture),Nt(ht,vt),Et(O.__webglFramebuffer,T,vt,i.COLOR_ATTACHMENT0+nt,ht,0),m(vt)&&f(ht)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(nt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,Y.__webglTexture),Nt(nt,v),v.mipmaps&&v.mipmaps.length>0)for(let _t=0;_t<v.mipmaps.length;_t++)Et(O.__webglFramebuffer[_t],T,v,i.COLOR_ATTACHMENT0,nt,_t);else Et(O.__webglFramebuffer,T,v,i.COLOR_ATTACHMENT0,nt,0);m(v)&&f(nt),e.unbindTexture()}T.depthBuffer&&pe(T)}function ae(T){const v=T.textures;for(let O=0,Y=v.length;O<Y;O++){const j=v[O];if(m(j)){const W=w(T),yt=n.get(j).__webglTexture;e.bindTexture(W,yt),f(W),e.unbindTexture()}}}const At=[],$t=[];function St(T){if(T.samples>0){if(pt(T)===!1){const v=T.textures,O=T.width,Y=T.height;let j=i.COLOR_BUFFER_BIT;const W=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(T),nt=v.length>1;if(nt)for(let vt=0;vt<v.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer);const _t=T.texture.mipmaps;_t&&_t.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let vt=0;vt<v.length;vt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(j|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(j|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[vt]);const Q=n.get(v[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,O,Y,0,0,O,Y,j,i.NEAREST),l===!0&&(At.length=0,$t.length=0,At.push(i.COLOR_ATTACHMENT0+vt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(At.push(W),$t.push(W),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,$t)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,At))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let vt=0;vt<v.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,yt.__webglColorRenderbuffer[vt]);const Q=n.get(v[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,Q,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function he(T){return Math.min(s.maxSamples,T.samples)}function pt(T){const v=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function zt(T){const v=a.render.frame;u.get(T)!==v&&(u.set(T,v),T.update())}function be(T,v){const O=T.colorSpace,Y=T.format,j=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==ls&&O!==Yn&&(Yt.getTransfer(O)===te?(Y!==un||j!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function me(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=Gt,this.setupRenderTarget=P,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=St,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=pt}function zv(i,t){function e(n,s=Yn){let r;const a=Yt.getTransfer(s);if(n===bn)return i.UNSIGNED_BYTE;if(n===Ko)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Zo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Fh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ih)return i.BYTE;if(n===Nh)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===jo)return i.INT;if(n===vi)return i.UNSIGNED_INT;if(n===Mn)return i.FLOAT;if(n===zs)return i.HALF_FLOAT;if(n===Oh)return i.ALPHA;if(n===Bh)return i.RGB;if(n===un)return i.RGBA;if(n===Ns)return i.DEPTH_COMPONENT;if(n===Fs)return i.DEPTH_STENCIL;if(n===Jo)return i.RED;if(n===Qo)return i.RED_INTEGER;if(n===zh)return i.RG;if(n===tl)return i.RG_INTEGER;if(n===el)return i.RGBA_INTEGER;if(n===Rr||n===Cr||n===Pr||n===Lr)if(a===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Rr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Rr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Pr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===po||n===mo||n===go||n===_o)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===po)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===mo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===go)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_o)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===vo||n===xo||n===Mo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===vo||n===xo)return a===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Mo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===yo||n===So||n===bo||n===Eo||n===wo||n===To||n===Ao||n===Ro||n===Co||n===Po||n===Lo||n===Do||n===Uo||n===Io)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===yo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===So)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===bo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Eo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===To)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ao)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ro)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Co)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Po)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Lo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Do)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Uo)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Io)return a===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Dr||n===No||n===Fo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Dr)return a===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===No)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===kh||n===Oo||n===Bo||n===zo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Dr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Oo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Bo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===zo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Is?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class hu extends Le{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const kv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hv=`
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

}`;class Vv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new hu(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Fn({vertexShader:kv,fragmentShader:Hv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Me(new Hs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Gv extends yi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null;const _=new Vv,m={},f=e.getContextAttributes();let w=null,E=null;const y=[],A=[],C=new bt;let L=null;const U=new Ke;U.viewport=new Wt;const x=new Ke;x.viewport=new Wt;const S=[U,x],b=new am;let F=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ot=y[X];return ot===void 0&&(ot=new Ea,y[X]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(X){let ot=y[X];return ot===void 0&&(ot=new Ea,y[X]=ot),ot.getGripSpace()},this.getHand=function(X){let ot=y[X];return ot===void 0&&(ot=new Ea,y[X]=ot),ot.getHandSpace()};function z(X){const ot=A.indexOf(X.inputSource);if(ot===-1)return;const et=y[ot];et!==void 0&&(et.update(X.inputSource,X.frame,c||a),et.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",G);for(let X=0;X<y.length;X++){const ot=A[X];ot!==null&&(A[X]=null,y[X].disconnect(ot))}F=null,B=null,_.reset();for(const X in m)delete m[X];t.setRenderTarget(w),p=null,d=null,h=null,s=null,E=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(L),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",q),s.addEventListener("inputsourceschange",G),f.xrCompatible!==!0&&await e.makeXRCompatible(),L=t.getPixelRatio(),t.getSize(C),typeof XRWebGLBinding<"u"&&(h=new XRWebGLBinding(s,e)),h!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let et=null,Et=null,wt=null;f.depth&&(wt=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=f.stencil?Fs:Ns,Et=f.stencil?Is:vi);const Ut={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:r};d=h.createProjectionLayer(Ut),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),E=new Mi(d.textureWidth,d.textureHeight,{format:un,type:bn,depthTexture:new nu(d.textureWidth,d.textureHeight,Et,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const et={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),E=new Mi(p.framebufferWidth,p.framebufferHeight,{format:un,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),qt.setContext(s),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function G(X){for(let ot=0;ot<X.removed.length;ot++){const et=X.removed[ot],Et=A.indexOf(et);Et>=0&&(A[Et]=null,y[Et].disconnect(et))}for(let ot=0;ot<X.added.length;ot++){const et=X.added[ot];let Et=A.indexOf(et);if(Et===-1){for(let Ut=0;Ut<y.length;Ut++)if(Ut>=A.length){A.push(et),Et=Ut;break}else if(A[Ut]===null){A[Ut]=et,Et=Ut;break}if(Et===-1)break}const wt=y[Et];wt&&wt.connect(et)}}const Z=new R,V=new R;function st(X,ot,et){Z.setFromMatrixPosition(ot.matrixWorld),V.setFromMatrixPosition(et.matrixWorld);const Et=Z.distanceTo(V),wt=ot.projectionMatrix.elements,Ut=et.projectionMatrix.elements,pe=wt[14]/(wt[10]-1),Gt=wt[14]/(wt[10]+1),P=(wt[9]+1)/wt[5],ae=(wt[9]-1)/wt[5],At=(wt[8]-1)/wt[0],$t=(Ut[8]+1)/Ut[0],St=pe*At,he=pe*$t,pt=Et/(-At+$t),zt=pt*-At;if(ot.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(zt),X.translateZ(pt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),wt[10]===-1)X.projectionMatrix.copy(ot.projectionMatrix),X.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const be=pe+pt,me=Gt+pt,T=St-zt,v=he+(Et-zt),O=P*Gt/me*be,Y=ae*Gt/me*be;X.projectionMatrix.makePerspective(T,v,O,Y,be,me),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ut(X,ot){ot===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ot.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let ot=X.near,et=X.far;_.texture!==null&&(_.depthNear>0&&(ot=_.depthNear),_.depthFar>0&&(et=_.depthFar)),b.near=x.near=U.near=ot,b.far=x.far=U.far=et,(F!==b.near||B!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),F=b.near,B=b.far),b.layers.mask=X.layers.mask|6,U.layers.mask=b.layers.mask&3,x.layers.mask=b.layers.mask&5;const Et=X.parent,wt=b.cameras;ut(b,Et);for(let Ut=0;Ut<wt.length;Ut++)ut(wt[Ut],Et);wt.length===2?st(b,U,x):b.projectionMatrix.copy(U.projectionMatrix),Mt(X,b,Et)};function Mt(X,ot,et){et===null?X.matrix.copy(ot.matrixWorld):(X.matrix.copy(et.matrixWorld),X.matrix.invert(),X.matrix.multiply(ot.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ot.projectionMatrix),X.projectionMatrixInverse.copy(ot.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Os*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)},this.getCameraTexture=function(X){return m[X]};let Nt=null;function ie(X,ot){if(u=ot.getViewerPose(c||a),g=ot,u!==null){const et=u.views;p!==null&&(t.setRenderTargetFramebuffer(E,p.framebuffer),t.setRenderTarget(E));let Et=!1;et.length!==b.cameras.length&&(b.cameras.length=0,Et=!0);for(let Gt=0;Gt<et.length;Gt++){const P=et[Gt];let ae=null;if(p!==null)ae=p.getViewport(P);else{const $t=h.getViewSubImage(d,P);ae=$t.viewport,Gt===0&&(t.setRenderTargetTextures(E,$t.colorTexture,$t.depthStencilTexture),t.setRenderTarget(E))}let At=S[Gt];At===void 0&&(At=new Ke,At.layers.enable(Gt),At.viewport=new Wt,S[Gt]=At),At.matrix.fromArray(P.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(P.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(ae.x,ae.y,ae.width,ae.height),Gt===0&&(b.matrix.copy(At.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Et===!0&&b.cameras.push(At)}const wt=s.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&h){const Gt=h.getDepthInformation(et[0]);Gt&&Gt.isValid&&Gt.texture&&_.init(Gt,s.renderState)}if(wt&&wt.includes("camera-access")&&(t.state.unbindTexture(),h))for(let Gt=0;Gt<et.length;Gt++){const P=et[Gt].camera;if(P){let ae=m[P];ae||(ae=new hu,m[P]=ae);const At=h.getCameraImage(P);ae.sourceTexture=At}}}for(let et=0;et<y.length;et++){const Et=A[et],wt=y[et];Et!==null&&wt!==void 0&&wt.update(Et,ot,c||a)}Nt&&Nt(X,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}const qt=new ru;qt.setAnimationLoop(ie),this.setAnimationLoop=function(X){Nt=X},this.dispose=function(){}}}const li=new En,Wv=new Kt;function Xv(i,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Kh(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,w,E,y){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,y)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,w,E):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Xe&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Xe&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const w=t.get(f),E=w.envMap,y=w.envMapRotation;E&&(m.envMap.value=E,li.copy(y),li.x*=-1,li.y*=-1,li.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),m.envMapRotation.value.setFromMatrix4(Wv.makeRotationFromEuler(li)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,w,E){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=E*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,w){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Xe&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const w=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Yv(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,E){const y=E.program;n.uniformBlockBinding(w,y)}function c(w,E){let y=s[w.id];y===void 0&&(g(w),y=u(w),s[w.id]=y,w.addEventListener("dispose",m));const A=E.program;n.updateUBOMapping(w,A);const C=t.render.frame;r[w.id]!==C&&(d(w),r[w.id]=C)}function u(w){const E=h();w.__bindingPointIndex=E;const y=i.createBuffer(),A=w.__size,C=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,A,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,y),y}function h(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const E=s[w.id],y=w.uniforms,A=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let C=0,L=y.length;C<L;C++){const U=Array.isArray(y[C])?y[C]:[y[C]];for(let x=0,S=U.length;x<S;x++){const b=U[x];if(p(b,C,x,A)===!0){const F=b.__offset,B=Array.isArray(b.value)?b.value:[b.value];let z=0;for(let q=0;q<B.length;q++){const G=B[q],Z=_(G);typeof G=="number"||typeof G=="boolean"?(b.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,F+z,b.__data)):G.isMatrix3?(b.__data[0]=G.elements[0],b.__data[1]=G.elements[1],b.__data[2]=G.elements[2],b.__data[3]=0,b.__data[4]=G.elements[3],b.__data[5]=G.elements[4],b.__data[6]=G.elements[5],b.__data[7]=0,b.__data[8]=G.elements[6],b.__data[9]=G.elements[7],b.__data[10]=G.elements[8],b.__data[11]=0):(G.toArray(b.__data,z),z+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,b.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(w,E,y,A){const C=w.value,L=E+"_"+y;if(A[L]===void 0)return typeof C=="number"||typeof C=="boolean"?A[L]=C:A[L]=C.clone(),!0;{const U=A[L];if(typeof C=="number"||typeof C=="boolean"){if(U!==C)return A[L]=C,!0}else if(U.equals(C)===!1)return U.copy(C),!0}return!1}function g(w){const E=w.uniforms;let y=0;const A=16;for(let L=0,U=E.length;L<U;L++){const x=Array.isArray(E[L])?E[L]:[E[L]];for(let S=0,b=x.length;S<b;S++){const F=x[S],B=Array.isArray(F.value)?F.value:[F.value];for(let z=0,q=B.length;z<q;z++){const G=B[z],Z=_(G),V=y%A,st=V%Z.boundary,ut=V+st;y+=st,ut!==0&&A-ut<Z.storage&&(y+=A-ut),F.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=Z.storage}}}const C=y%A;return C>0&&(y+=A-C),w.__size=y,w.__cache={},this}function _(w){const E={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(E.boundary=4,E.storage=4):w.isVector2?(E.boundary=8,E.storage=8):w.isVector3||w.isColor?(E.boundary=16,E.storage=12):w.isVector4?(E.boundary=16,E.storage=16):w.isMatrix3?(E.boundary=48,E.storage=48):w.isMatrix4?(E.boundary=64,E.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),E}function m(w){const E=w.target;E.removeEventListener("dispose",m);const y=a.indexOf(E.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function f(){for(const w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class qv{constructor(t={}){const{canvas:e=vp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const w=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let A=!1;this._outputColorSpace=Ne;let C=0,L=0,U=null,x=-1,S=null;const b=new Wt,F=new Wt;let B=null;const z=new Vt(0);let q=0,G=e.width,Z=e.height,V=1,st=null,ut=null;const Mt=new Wt(0,0,G,Z),Nt=new Wt(0,0,G,Z);let ie=!1;const qt=new rl;let X=!1,ot=!1;const et=new Kt,Et=new R,wt=new Wt,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function Gt(){return U===null?V:1}let P=n;function ae(M,I){return e.getContext(M,I)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$o}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",K,!1),P===null){const I="webgl2";if(P=ae(I,M),P===null)throw ae(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let At,$t,St,he,pt,zt,be,me,T,v,O,Y,j,W,yt,nt,_t,vt,Q,ht,Pt,xt,lt,Ft;function D(){At=new i_(P),At.init(),xt=new zv(P,At),$t=new K0(P,At,t,xt),St=new Ov(P,At),$t.reversedDepthBuffer&&d&&St.buffers.depth.setReversed(!0),he=new a_(P),pt=new Ev,zt=new Bv(P,At,St,pt,$t,xt,he),be=new J0(y),me=new n_(y),T=new dm(P),lt=new $0(P,T),v=new s_(P,T,he,lt),O=new l_(P,v,T,he),Q=new o_(P,$t,zt),nt=new Z0(pt),Y=new bv(y,be,me,At,$t,lt,nt),j=new Xv(y,pt),W=new Tv,yt=new Dv(At),vt=new q0(y,be,me,St,O,p,l),_t=new Nv(y,O,$t),Ft=new Yv(P,he,$t,St),ht=new j0(P,At,he),Pt=new r_(P,At,he),he.programs=Y.programs,y.capabilities=$t,y.extensions=At,y.properties=pt,y.renderLists=W,y.shadowMap=_t,y.state=St,y.info=he}D();const tt=new Gv(y,P);this.xr=tt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const M=At.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=At.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(M){M!==void 0&&(V=M,this.setSize(G,Z,!1))},this.getSize=function(M){return M.set(G,Z)},this.setSize=function(M,I,k=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=M,Z=I,e.width=Math.floor(M*V),e.height=Math.floor(I*V),k===!0&&(e.style.width=M+"px",e.style.height=I+"px"),this.setViewport(0,0,M,I)},this.getDrawingBufferSize=function(M){return M.set(G*V,Z*V).floor()},this.setDrawingBufferSize=function(M,I,k){G=M,Z=I,V=k,e.width=Math.floor(M*k),e.height=Math.floor(I*k),this.setViewport(0,0,M,I)},this.getCurrentViewport=function(M){return M.copy(b)},this.getViewport=function(M){return M.copy(Mt)},this.setViewport=function(M,I,k,H){M.isVector4?Mt.set(M.x,M.y,M.z,M.w):Mt.set(M,I,k,H),St.viewport(b.copy(Mt).multiplyScalar(V).round())},this.getScissor=function(M){return M.copy(Nt)},this.setScissor=function(M,I,k,H){M.isVector4?Nt.set(M.x,M.y,M.z,M.w):Nt.set(M,I,k,H),St.scissor(F.copy(Nt).multiplyScalar(V).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(M){St.setScissorTest(ie=M)},this.setOpaqueSort=function(M){st=M},this.setTransparentSort=function(M){ut=M},this.getClearColor=function(M){return M.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(M=!0,I=!0,k=!0){let H=0;if(M){let N=!1;if(U!==null){const J=U.texture.format;N=J===el||J===tl||J===Qo}if(N){const J=U.texture.type,ct=J===bn||J===vi||J===Us||J===Is||J===Ko||J===Zo,mt=vt.getClearColor(),dt=vt.getClearAlpha(),Ct=mt.r,Lt=mt.g,Tt=mt.b;ct?(g[0]=Ct,g[1]=Lt,g[2]=Tt,g[3]=dt,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Ct,_[1]=Lt,_[2]=Tt,_[3]=dt,P.clearBufferiv(P.COLOR,0,_))}else H|=P.COLOR_BUFFER_BIT}I&&(H|=P.DEPTH_BUFFER_BIT),k&&(H|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",K,!1),vt.dispose(),W.dispose(),yt.dispose(),pt.dispose(),be.dispose(),me.dispose(),O.dispose(),lt.dispose(),Ft.dispose(),Y.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",dn),tt.removeEventListener("sessionend",pl),Qn.stop()};function rt(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const M=he.autoReset,I=_t.enabled,k=_t.autoUpdate,H=_t.needsUpdate,N=_t.type;D(),he.autoReset=M,_t.enabled=I,_t.autoUpdate=k,_t.needsUpdate=H,_t.type=N}function K(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function $(M){const I=M.target;I.removeEventListener("dispose",$),gt(I)}function gt(M){It(M),pt.remove(M)}function It(M){const I=pt.get(M).programs;I!==void 0&&(I.forEach(function(k){Y.releaseProgram(k)}),M.isShaderMaterial&&Y.releaseShaderCache(M))}this.renderBufferDirect=function(M,I,k,H,N,J){I===null&&(I=Ut);const ct=N.isMesh&&N.matrixWorld.determinant()<0,mt=yu(M,I,k,H,N);St.setMaterial(H,ct);let dt=k.index,Ct=1;if(H.wireframe===!0){if(dt=v.getWireframeAttribute(k),dt===void 0)return;Ct=2}const Lt=k.drawRange,Tt=k.attributes.position;let Ht=Lt.start*Ct,Qt=(Lt.start+Lt.count)*Ct;J!==null&&(Ht=Math.max(Ht,J.start*Ct),Qt=Math.min(Qt,(J.start+J.count)*Ct)),dt!==null?(Ht=Math.max(Ht,0),Qt=Math.min(Qt,dt.count)):Tt!=null&&(Ht=Math.max(Ht,0),Qt=Math.min(Qt,Tt.count));const fe=Qt-Ht;if(fe<0||fe===1/0)return;lt.setup(N,H,mt,k,dt);let le,se=ht;if(dt!==null&&(le=T.get(dt),se=Pt,se.setIndex(le)),N.isMesh)H.wireframe===!0?(St.setLineWidth(H.wireframeLinewidth*Gt()),se.setMode(P.LINES)):se.setMode(P.TRIANGLES);else if(N.isLine){let Rt=H.linewidth;Rt===void 0&&(Rt=1),St.setLineWidth(Rt*Gt()),N.isLineSegments?se.setMode(P.LINES):N.isLineLoop?se.setMode(P.LINE_LOOP):se.setMode(P.LINE_STRIP)}else N.isPoints?se.setMode(P.POINTS):N.isSprite&&se.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)es("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),se.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(At.get("WEBGL_multi_draw"))se.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Rt=N._multiDrawStarts,ue=N._multiDrawCounts,Xt=N._multiDrawCount,Ye=dt?T.get(dt).bytesPerElement:1,Si=pt.get(H).currentProgram.getUniforms();for(let qe=0;qe<Xt;qe++)Si.setValue(P,"_gl_DrawID",qe),se.render(Rt[qe]/Ye,ue[qe])}else if(N.isInstancedMesh)se.renderInstances(Ht,fe,N.count);else if(k.isInstancedBufferGeometry){const Rt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ue=Math.min(k.instanceCount,Rt);se.renderInstances(Ht,fe,ue)}else se.render(Ht,fe)};function oe(M,I,k){M.transparent===!0&&M.side===cn&&M.forceSinglePass===!1?(M.side=Xe,M.needsUpdate=!0,Gs(M,I,k),M.side=Zn,M.needsUpdate=!0,Gs(M,I,k),M.side=cn):Gs(M,I,k)}this.compile=function(M,I,k=null){k===null&&(k=M),f=yt.get(k),f.init(I),E.push(f),k.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==k&&M.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const H=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const J=N.material;if(J)if(Array.isArray(J))for(let ct=0;ct<J.length;ct++){const mt=J[ct];oe(mt,k,N),H.add(mt)}else oe(J,k,N),H.add(J)}),f=E.pop(),H},this.compileAsync=function(M,I,k=null){const H=this.compile(M,I,k);return new Promise(N=>{function J(){if(H.forEach(function(ct){pt.get(ct).currentProgram.isReady()&&H.delete(ct)}),H.size===0){N(M);return}setTimeout(J,10)}At.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let jt=null;function Tn(M){jt&&jt(M)}function dn(){Qn.stop()}function pl(){Qn.start()}const Qn=new ru;Qn.setAnimationLoop(Tn),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(M){jt=M,tt.setAnimationLoop(M),M===null?Qn.stop():Qn.start()},tt.addEventListener("sessionstart",dn),tt.addEventListener("sessionend",pl),this.render=function(M,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(I),I=tt.getCamera()),M.isScene===!0&&M.onBeforeRender(y,M,I,U),f=yt.get(M,E.length),f.init(I),E.push(f),et.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),qt.setFromProjectionMatrix(et,yn,I.reversedDepth),ot=this.localClippingEnabled,X=nt.init(this.clippingPlanes,ot),m=W.get(M,w.length),m.init(),w.push(m),tt.enabled===!0&&tt.isPresenting===!0){const J=y.xr.getDepthSensingMesh();J!==null&&Zr(J,I,-1/0,y.sortObjects)}Zr(M,I,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(st,ut),pe=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,pe&&vt.addToRenderList(m,M),this.info.render.frame++,X===!0&&nt.beginShadows();const k=f.state.shadowsArray;_t.render(k,M,I),X===!0&&nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,N=m.transmissive;if(f.setupLights(),I.isArrayCamera){const J=I.cameras;if(N.length>0)for(let ct=0,mt=J.length;ct<mt;ct++){const dt=J[ct];gl(H,N,M,dt)}pe&&vt.render(M);for(let ct=0,mt=J.length;ct<mt;ct++){const dt=J[ct];ml(m,M,dt,dt.viewport)}}else N.length>0&&gl(H,N,M,I),pe&&vt.render(M),ml(m,M,I);U!==null&&L===0&&(zt.updateMultisampleRenderTarget(U),zt.updateRenderTargetMipmap(U)),M.isScene===!0&&M.onAfterRender(y,M,I),lt.resetDefaultState(),x=-1,S=null,E.pop(),E.length>0?(f=E[E.length-1],X===!0&&nt.setGlobalState(y.clippingPlanes,f.state.camera)):f=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function Zr(M,I,k,H){if(M.visible===!1)return;if(M.layers.test(I.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(I);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||qt.intersectsSprite(M)){H&&wt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(et);const ct=O.update(M),mt=M.material;mt.visible&&m.push(M,ct,mt,k,wt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||qt.intersectsObject(M))){const ct=O.update(M),mt=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),wt.copy(M.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),wt.copy(ct.boundingSphere.center)),wt.applyMatrix4(M.matrixWorld).applyMatrix4(et)),Array.isArray(mt)){const dt=ct.groups;for(let Ct=0,Lt=dt.length;Ct<Lt;Ct++){const Tt=dt[Ct],Ht=mt[Tt.materialIndex];Ht&&Ht.visible&&m.push(M,ct,Ht,k,wt.z,Tt)}}else mt.visible&&m.push(M,ct,mt,k,wt.z,null)}}const J=M.children;for(let ct=0,mt=J.length;ct<mt;ct++)Zr(J[ct],I,k,H)}function ml(M,I,k,H){const N=M.opaque,J=M.transmissive,ct=M.transparent;f.setupLightsView(k),X===!0&&nt.setGlobalState(y.clippingPlanes,k),H&&St.viewport(b.copy(H)),N.length>0&&Vs(N,I,k),J.length>0&&Vs(J,I,k),ct.length>0&&Vs(ct,I,k),St.buffers.depth.setTest(!0),St.buffers.depth.setMask(!0),St.buffers.color.setMask(!0),St.setPolygonOffset(!1)}function gl(M,I,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new Mi(1,1,{generateMipmaps:!0,type:At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float")?zs:bn,minFilter:gi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const J=f.state.transmissionRenderTarget[H.id],ct=H.viewport||b;J.setSize(ct.z*y.transmissionResolutionScale,ct.w*y.transmissionResolutionScale);const mt=y.getRenderTarget(),dt=y.getActiveCubeFace(),Ct=y.getActiveMipmapLevel();y.setRenderTarget(J),y.getClearColor(z),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),y.clear(),pe&&vt.render(k);const Lt=y.toneMapping;y.toneMapping=jn;const Tt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),X===!0&&nt.setGlobalState(y.clippingPlanes,H),Vs(M,k,H),zt.updateMultisampleRenderTarget(J),zt.updateRenderTargetMipmap(J),At.has("WEBGL_multisampled_render_to_texture")===!1){let Ht=!1;for(let Qt=0,fe=I.length;Qt<fe;Qt++){const le=I[Qt],se=le.object,Rt=le.geometry,ue=le.material,Xt=le.group;if(ue.side===cn&&se.layers.test(H.layers)){const Ye=ue.side;ue.side=Xe,ue.needsUpdate=!0,_l(se,k,H,Rt,ue,Xt),ue.side=Ye,ue.needsUpdate=!0,Ht=!0}}Ht===!0&&(zt.updateMultisampleRenderTarget(J),zt.updateRenderTargetMipmap(J))}y.setRenderTarget(mt,dt,Ct),y.setClearColor(z,q),Tt!==void 0&&(H.viewport=Tt),y.toneMapping=Lt}function Vs(M,I,k){const H=I.isScene===!0?I.overrideMaterial:null;for(let N=0,J=M.length;N<J;N++){const ct=M[N],mt=ct.object,dt=ct.geometry,Ct=ct.group;let Lt=ct.material;Lt.allowOverride===!0&&H!==null&&(Lt=H),mt.layers.test(k.layers)&&_l(mt,I,k,dt,Lt,Ct)}}function _l(M,I,k,H,N,J){M.onBeforeRender(y,I,k,H,N,J),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(y,I,k,H,M,J),N.transparent===!0&&N.side===cn&&N.forceSinglePass===!1?(N.side=Xe,N.needsUpdate=!0,y.renderBufferDirect(k,I,H,N,M,J),N.side=Zn,N.needsUpdate=!0,y.renderBufferDirect(k,I,H,N,M,J),N.side=cn):y.renderBufferDirect(k,I,H,N,M,J),M.onAfterRender(y,I,k,H,N,J)}function Gs(M,I,k){I.isScene!==!0&&(I=Ut);const H=pt.get(M),N=f.state.lights,J=f.state.shadowsArray,ct=N.state.version,mt=Y.getParameters(M,N.state,J,I,k),dt=Y.getProgramCacheKey(mt);let Ct=H.programs;H.environment=M.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(M.isMeshStandardMaterial?me:be).get(M.envMap||H.environment),H.envMapRotation=H.environment!==null&&M.envMap===null?I.environmentRotation:M.envMapRotation,Ct===void 0&&(M.addEventListener("dispose",$),Ct=new Map,H.programs=Ct);let Lt=Ct.get(dt);if(Lt!==void 0){if(H.currentProgram===Lt&&H.lightsStateVersion===ct)return xl(M,mt),Lt}else mt.uniforms=Y.getUniforms(M),M.onBeforeCompile(mt,y),Lt=Y.acquireProgram(mt,dt),Ct.set(dt,Lt),H.uniforms=mt.uniforms;const Tt=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Tt.clippingPlanes=nt.uniform),xl(M,mt),H.needsLights=bu(M),H.lightsStateVersion=ct,H.needsLights&&(Tt.ambientLightColor.value=N.state.ambient,Tt.lightProbe.value=N.state.probe,Tt.directionalLights.value=N.state.directional,Tt.directionalLightShadows.value=N.state.directionalShadow,Tt.spotLights.value=N.state.spot,Tt.spotLightShadows.value=N.state.spotShadow,Tt.rectAreaLights.value=N.state.rectArea,Tt.ltc_1.value=N.state.rectAreaLTC1,Tt.ltc_2.value=N.state.rectAreaLTC2,Tt.pointLights.value=N.state.point,Tt.pointLightShadows.value=N.state.pointShadow,Tt.hemisphereLights.value=N.state.hemi,Tt.directionalShadowMap.value=N.state.directionalShadowMap,Tt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Tt.spotShadowMap.value=N.state.spotShadowMap,Tt.spotLightMatrix.value=N.state.spotLightMatrix,Tt.spotLightMap.value=N.state.spotLightMap,Tt.pointShadowMap.value=N.state.pointShadowMap,Tt.pointShadowMatrix.value=N.state.pointShadowMatrix),H.currentProgram=Lt,H.uniformsList=null,Lt}function vl(M){if(M.uniformsList===null){const I=M.currentProgram.getUniforms();M.uniformsList=Ur.seqWithValue(I.seq,M.uniforms)}return M.uniformsList}function xl(M,I){const k=pt.get(M);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function yu(M,I,k,H,N){I.isScene!==!0&&(I=Ut),zt.resetTextureUnits();const J=I.fog,ct=H.isMeshStandardMaterial?I.environment:null,mt=U===null?y.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:ls,dt=(H.isMeshStandardMaterial?me:be).get(H.envMap||ct),Ct=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Lt=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Tt=!!k.morphAttributes.position,Ht=!!k.morphAttributes.normal,Qt=!!k.morphAttributes.color;let fe=jn;H.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(fe=y.toneMapping);const le=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,se=le!==void 0?le.length:0,Rt=pt.get(H),ue=f.state.lights;if(X===!0&&(ot===!0||M!==S)){const Fe=M===S&&H.id===x;nt.setState(H,M,Fe)}let Xt=!1;H.version===Rt.__version?(Rt.needsLights&&Rt.lightsStateVersion!==ue.state.version||Rt.outputColorSpace!==mt||N.isBatchedMesh&&Rt.batching===!1||!N.isBatchedMesh&&Rt.batching===!0||N.isBatchedMesh&&Rt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Rt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Rt.instancing===!1||!N.isInstancedMesh&&Rt.instancing===!0||N.isSkinnedMesh&&Rt.skinning===!1||!N.isSkinnedMesh&&Rt.skinning===!0||N.isInstancedMesh&&Rt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Rt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Rt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Rt.instancingMorph===!1&&N.morphTexture!==null||Rt.envMap!==dt||H.fog===!0&&Rt.fog!==J||Rt.numClippingPlanes!==void 0&&(Rt.numClippingPlanes!==nt.numPlanes||Rt.numIntersection!==nt.numIntersection)||Rt.vertexAlphas!==Ct||Rt.vertexTangents!==Lt||Rt.morphTargets!==Tt||Rt.morphNormals!==Ht||Rt.morphColors!==Qt||Rt.toneMapping!==fe||Rt.morphTargetsCount!==se)&&(Xt=!0):(Xt=!0,Rt.__version=H.version);let Ye=Rt.currentProgram;Xt===!0&&(Ye=Gs(H,I,N));let Si=!1,qe=!1,us=!1;const de=Ye.getUniforms(),Je=Rt.uniforms;if(St.useProgram(Ye.program)&&(Si=!0,qe=!0,us=!0),H.id!==x&&(x=H.id,qe=!0),Si||S!==M){St.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),de.setValue(P,"projectionMatrix",M.projectionMatrix),de.setValue(P,"viewMatrix",M.matrixWorldInverse);const He=de.map.cameraPosition;He!==void 0&&He.setValue(P,Et.setFromMatrixPosition(M.matrixWorld)),$t.logarithmicDepthBuffer&&de.setValue(P,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&de.setValue(P,"isOrthographic",M.isOrthographicCamera===!0),S!==M&&(S=M,qe=!0,us=!0)}if(N.isSkinnedMesh){de.setOptional(P,N,"bindMatrix"),de.setOptional(P,N,"bindMatrixInverse");const Fe=N.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),de.setValue(P,"boneTexture",Fe.boneTexture,zt))}N.isBatchedMesh&&(de.setOptional(P,N,"batchingTexture"),de.setValue(P,"batchingTexture",N._matricesTexture,zt),de.setOptional(P,N,"batchingIdTexture"),de.setValue(P,"batchingIdTexture",N._indirectTexture,zt),de.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&de.setValue(P,"batchingColorTexture",N._colorsTexture,zt));const Qe=k.morphAttributes;if((Qe.position!==void 0||Qe.normal!==void 0||Qe.color!==void 0)&&Q.update(N,k,Ye),(qe||Rt.receiveShadow!==N.receiveShadow)&&(Rt.receiveShadow=N.receiveShadow,de.setValue(P,"receiveShadow",N.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Je.envMap.value=dt,Je.flipEnvMap.value=dt.isCubeTexture&&dt.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&I.environment!==null&&(Je.envMapIntensity.value=I.environmentIntensity),qe&&(de.setValue(P,"toneMappingExposure",y.toneMappingExposure),Rt.needsLights&&Su(Je,us),J&&H.fog===!0&&j.refreshFogUniforms(Je,J),j.refreshMaterialUniforms(Je,H,V,Z,f.state.transmissionRenderTarget[M.id]),Ur.upload(P,vl(Rt),Je,zt)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ur.upload(P,vl(Rt),Je,zt),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&de.setValue(P,"center",N.center),de.setValue(P,"modelViewMatrix",N.modelViewMatrix),de.setValue(P,"normalMatrix",N.normalMatrix),de.setValue(P,"modelMatrix",N.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Fe=H.uniformsGroups;for(let He=0,Jr=Fe.length;He<Jr;He++){const ti=Fe[He];Ft.update(ti,Ye),Ft.bind(ti,Ye)}}return Ye}function Su(M,I){M.ambientLightColor.needsUpdate=I,M.lightProbe.needsUpdate=I,M.directionalLights.needsUpdate=I,M.directionalLightShadows.needsUpdate=I,M.pointLights.needsUpdate=I,M.pointLightShadows.needsUpdate=I,M.spotLights.needsUpdate=I,M.spotLightShadows.needsUpdate=I,M.rectAreaLights.needsUpdate=I,M.hemisphereLights.needsUpdate=I}function bu(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(M,I,k){const H=pt.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),pt.get(M.texture).__webglTexture=I,pt.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,I){const k=pt.get(M);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0};const Eu=P.createFramebuffer();this.setRenderTarget=function(M,I=0,k=0){U=M,C=I,L=k;let H=!0,N=null,J=!1,ct=!1;if(M){const dt=pt.get(M);if(dt.__useDefaultFramebuffer!==void 0)St.bindFramebuffer(P.FRAMEBUFFER,null),H=!1;else if(dt.__webglFramebuffer===void 0)zt.setupRenderTarget(M);else if(dt.__hasExternalTextures)zt.rebindTextures(M,pt.get(M.texture).__webglTexture,pt.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Tt=M.depthTexture;if(dt.__boundDepthTexture!==Tt){if(Tt!==null&&pt.has(Tt)&&(M.width!==Tt.image.width||M.height!==Tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");zt.setupDepthRenderbuffer(M)}}const Ct=M.texture;(Ct.isData3DTexture||Ct.isDataArrayTexture||Ct.isCompressedArrayTexture)&&(ct=!0);const Lt=pt.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Lt[I])?N=Lt[I][k]:N=Lt[I],J=!0):M.samples>0&&zt.useMultisampledRTT(M)===!1?N=pt.get(M).__webglMultisampledFramebuffer:Array.isArray(Lt)?N=Lt[k]:N=Lt,b.copy(M.viewport),F.copy(M.scissor),B=M.scissorTest}else b.copy(Mt).multiplyScalar(V).floor(),F.copy(Nt).multiplyScalar(V).floor(),B=ie;if(k!==0&&(N=Eu),St.bindFramebuffer(P.FRAMEBUFFER,N)&&H&&St.drawBuffers(M,N),St.viewport(b),St.scissor(F),St.setScissorTest(B),J){const dt=pt.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+I,dt.__webglTexture,k)}else if(ct){const dt=I;for(let Ct=0;Ct<M.textures.length;Ct++){const Lt=pt.get(M.textures[Ct]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+Ct,Lt.__webglTexture,k,dt)}}else if(M!==null&&k!==0){const dt=pt.get(M.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,dt.__webglTexture,k)}x=-1},this.readRenderTargetPixels=function(M,I,k,H,N,J,ct,mt=0){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=pt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(dt=dt[ct]),dt){St.bindFramebuffer(P.FRAMEBUFFER,dt);try{const Ct=M.textures[mt],Lt=Ct.format,Tt=Ct.type;if(!$t.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$t.textureTypeReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=M.width-H&&k>=0&&k<=M.height-N&&(M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+mt),P.readPixels(I,k,H,N,xt.convert(Lt),xt.convert(Tt),J))}finally{const Ct=U!==null?pt.get(U).__webglFramebuffer:null;St.bindFramebuffer(P.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(M,I,k,H,N,J,ct,mt=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=pt.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ct!==void 0&&(dt=dt[ct]),dt)if(I>=0&&I<=M.width-H&&k>=0&&k<=M.height-N){St.bindFramebuffer(P.FRAMEBUFFER,dt);const Ct=M.textures[mt],Lt=Ct.format,Tt=Ct.type;if(!$t.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$t.textureTypeReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ht=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Ht),P.bufferData(P.PIXEL_PACK_BUFFER,J.byteLength,P.STREAM_READ),M.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+mt),P.readPixels(I,k,H,N,xt.convert(Lt),xt.convert(Tt),0);const Qt=U!==null?pt.get(U).__webglFramebuffer:null;St.bindFramebuffer(P.FRAMEBUFFER,Qt);const fe=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await xp(P,fe,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Ht),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,J),P.deleteBuffer(Ht),P.deleteSync(fe),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,I=null,k=0){const H=Math.pow(2,-k),N=Math.floor(M.image.width*H),J=Math.floor(M.image.height*H),ct=I!==null?I.x:0,mt=I!==null?I.y:0;zt.setTexture2D(M,0),P.copyTexSubImage2D(P.TEXTURE_2D,k,0,0,ct,mt,N,J),St.unbindTexture()};const wu=P.createFramebuffer(),Tu=P.createFramebuffer();this.copyTextureToTexture=function(M,I,k=null,H=null,N=0,J=null){J===null&&(N!==0?(es("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=N,N=0):J=0);let ct,mt,dt,Ct,Lt,Tt,Ht,Qt,fe;const le=M.isCompressedTexture?M.mipmaps[J]:M.image;if(k!==null)ct=k.max.x-k.min.x,mt=k.max.y-k.min.y,dt=k.isBox3?k.max.z-k.min.z:1,Ct=k.min.x,Lt=k.min.y,Tt=k.isBox3?k.min.z:0;else{const Qe=Math.pow(2,-N);ct=Math.floor(le.width*Qe),mt=Math.floor(le.height*Qe),M.isDataArrayTexture?dt=le.depth:M.isData3DTexture?dt=Math.floor(le.depth*Qe):dt=1,Ct=0,Lt=0,Tt=0}H!==null?(Ht=H.x,Qt=H.y,fe=H.z):(Ht=0,Qt=0,fe=0);const se=xt.convert(I.format),Rt=xt.convert(I.type);let ue;I.isData3DTexture?(zt.setTexture3D(I,0),ue=P.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(zt.setTexture2DArray(I,0),ue=P.TEXTURE_2D_ARRAY):(zt.setTexture2D(I,0),ue=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,I.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,I.unpackAlignment);const Xt=P.getParameter(P.UNPACK_ROW_LENGTH),Ye=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Si=P.getParameter(P.UNPACK_SKIP_PIXELS),qe=P.getParameter(P.UNPACK_SKIP_ROWS),us=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,le.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,le.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Ct),P.pixelStorei(P.UNPACK_SKIP_ROWS,Lt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Tt);const de=M.isDataArrayTexture||M.isData3DTexture,Je=I.isDataArrayTexture||I.isData3DTexture;if(M.isDepthTexture){const Qe=pt.get(M),Fe=pt.get(I),He=pt.get(Qe.__renderTarget),Jr=pt.get(Fe.__renderTarget);St.bindFramebuffer(P.READ_FRAMEBUFFER,He.__webglFramebuffer),St.bindFramebuffer(P.DRAW_FRAMEBUFFER,Jr.__webglFramebuffer);for(let ti=0;ti<dt;ti++)de&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pt.get(M).__webglTexture,N,Tt+ti),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,pt.get(I).__webglTexture,J,fe+ti)),P.blitFramebuffer(Ct,Lt,ct,mt,Ht,Qt,ct,mt,P.DEPTH_BUFFER_BIT,P.NEAREST);St.bindFramebuffer(P.READ_FRAMEBUFFER,null),St.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(N!==0||M.isRenderTargetTexture||pt.has(M)){const Qe=pt.get(M),Fe=pt.get(I);St.bindFramebuffer(P.READ_FRAMEBUFFER,wu),St.bindFramebuffer(P.DRAW_FRAMEBUFFER,Tu);for(let He=0;He<dt;He++)de?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Qe.__webglTexture,N,Tt+He):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Qe.__webglTexture,N),Je?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Fe.__webglTexture,J,fe+He):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Fe.__webglTexture,J),N!==0?P.blitFramebuffer(Ct,Lt,ct,mt,Ht,Qt,ct,mt,P.COLOR_BUFFER_BIT,P.NEAREST):Je?P.copyTexSubImage3D(ue,J,Ht,Qt,fe+He,Ct,Lt,ct,mt):P.copyTexSubImage2D(ue,J,Ht,Qt,Ct,Lt,ct,mt);St.bindFramebuffer(P.READ_FRAMEBUFFER,null),St.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else Je?M.isDataTexture||M.isData3DTexture?P.texSubImage3D(ue,J,Ht,Qt,fe,ct,mt,dt,se,Rt,le.data):I.isCompressedArrayTexture?P.compressedTexSubImage3D(ue,J,Ht,Qt,fe,ct,mt,dt,se,le.data):P.texSubImage3D(ue,J,Ht,Qt,fe,ct,mt,dt,se,Rt,le):M.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,J,Ht,Qt,ct,mt,se,Rt,le.data):M.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,J,Ht,Qt,le.width,le.height,se,le.data):P.texSubImage2D(P.TEXTURE_2D,J,Ht,Qt,ct,mt,se,Rt,le);P.pixelStorei(P.UNPACK_ROW_LENGTH,Xt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ye),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Si),P.pixelStorei(P.UNPACK_SKIP_ROWS,qe),P.pixelStorei(P.UNPACK_SKIP_IMAGES,us),J===0&&I.generateMipmaps&&P.generateMipmap(ue),St.unbindTexture()},this.copyTextureToTexture3D=function(M,I,k=null,H=null,N=0){return es('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,I,k,H,N)},this.initRenderTarget=function(M){pt.get(M).__webglFramebuffer===void 0&&zt.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?zt.setTextureCube(M,0):M.isData3DTexture?zt.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?zt.setTexture2DArray(M,0):zt.setTexture2D(M,0),St.unbindTexture()},this.resetState=function(){C=0,L=0,U=null,St.reset(),lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}const Jc={type:"change"},dl={type:"start"},uu={type:"end"},yr=new jr,Qc=new Xn,$v=Math.cos(70*Gh.DEG2RAD),xe=new R,Ve=2*Math.PI,ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ka=1e-6;class jv extends hm{constructor(t,e=null){super(t,e),this.state=ne.NONE,this.target=new R,this.cursor=new R,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Qi.ROTATE,MIDDLE:Qi.DOLLY,RIGHT:Qi.PAN},this.touches={ONE:Ki.ROTATE,TWO:Ki.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new R,this._lastQuaternion=new xi,this._lastTargetPosition=new R,this._quat=new xi().setFromUnitVectors(t.up,new R(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new wc,this._sphericalDelta=new wc,this._scale=1,this._panOffset=new R,this._rotateStart=new bt,this._rotateEnd=new bt,this._rotateDelta=new bt,this._panStart=new bt,this._panEnd=new bt,this._panDelta=new bt,this._dollyStart=new bt,this._dollyEnd=new bt,this._dollyDelta=new bt,this._dollyDirection=new R,this._mouse=new bt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Zv.bind(this),this._onPointerDown=Kv.bind(this),this._onPointerUp=Jv.bind(this),this._onContextMenu=rx.bind(this),this._onMouseWheel=ex.bind(this),this._onKeyDown=nx.bind(this),this._onTouchStart=ix.bind(this),this._onTouchMove=sx.bind(this),this._onMouseDown=Qv.bind(this),this._onMouseMove=tx.bind(this),this._interceptControlDown=ax.bind(this),this._interceptControlUp=ox.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Jc),this.update(),this.state=ne.NONE}update(t=null){const e=this.object.position;xe.copy(e).sub(this.target),xe.applyQuaternion(this._quat),this._spherical.setFromVector3(xe),this.autoRotate&&this.state===ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ve:n>Math.PI&&(n-=Ve),s<-Math.PI?s+=Ve:s>Math.PI&&(s-=Ve),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(xe.setFromSpherical(this._spherical),xe.applyQuaternion(this._quatInverse),e.copy(this.target).add(xe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=xe.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new R(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new R(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=xe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(yr.origin.copy(this.object.position),yr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yr.direction))<$v?this.object.lookAt(this.target):(Qc.setFromNormalAndCoplanarPoint(this.object.up,this.target),yr.intersectPlane(Qc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ka||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ka||this._lastTargetPosition.distanceToSquared(this.target)>ka?(this.dispatchEvent(Jc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ve/60*this.autoRotateSpeed*t:Ve/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){xe.setFromMatrixColumn(e,0),xe.multiplyScalar(-t),this._panOffset.add(xe)}_panUp(t,e){this.screenSpacePanning===!0?xe.setFromMatrixColumn(e,1):(xe.setFromMatrixColumn(e,0),xe.crossVectors(this.object.up,xe)),xe.multiplyScalar(t),this._panOffset.add(xe)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;xe.copy(s).sub(this.target);let r=xe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ve*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ve*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Ve*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Ve*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Ve*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Ve*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(Ve*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ve*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new bt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Kv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Zv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Jv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(uu),this.state=ne.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Qv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Qi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ne.DOLLY;break;case Qi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}break;case Qi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ne.PAN}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(dl)}function tx(i){switch(this.state){case ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function ex(i){this.enabled===!1||this.enableZoom===!1||this.state!==ne.NONE||(i.preventDefault(),this.dispatchEvent(dl),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(uu))}function nx(i){this.enabled!==!1&&this._handleKeyDown(i)}function ix(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ki.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ne.TOUCH_ROTATE;break;case Ki.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ne.TOUCH_PAN;break;default:this.state=ne.NONE}break;case 2:switch(this.touches.TWO){case Ki.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ne.TOUCH_DOLLY_PAN;break;case Ki.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ne.TOUCH_DOLLY_ROTATE;break;default:this.state=ne.NONE}break;default:this.state=ne.NONE}this.state!==ne.NONE&&this.dispatchEvent(dl)}function sx(i){switch(this._trackPointer(i),this.state){case ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ne.NONE}}function rx(i){this.enabled!==!1&&i.preventDefault()}function ax(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function ox(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const th=new wn,Sr=new R;class du extends rm{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new re(t,3)),this.setAttribute("uv",new re(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Vo(e,6,1);return this.setAttribute("instanceStart",new Sn(n,3,0)),this.setAttribute("instanceEnd",new Sn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Vo(e,6,1);return this.setAttribute("instanceColorStart",new Sn(n,3,0)),this.setAttribute("instanceColorEnd",new Sn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Zp(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),th.setFromBufferAttribute(e),this.boundingBox.union(th))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new On),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Sr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Sr)),Sr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Sr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}at.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new bt(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};We.line={uniforms:sl.merge([at.common,at.fog,at.line]),vertexShader:`
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
		`};class fl extends Fn{constructor(t){super({type:"LineMaterial",uniforms:sl.clone(We.line.uniforms),vertexShader:We.line.vertexShader,fragmentShader:We.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Ha=new Wt,eh=new R,nh=new R,we=new Wt,Te=new Wt,fn=new Wt,Va=new R,Ga=new Kt,Ce=new cm,ih=new R,br=new wn,Er=new On,pn=new Wt;let xn,_i;function sh(i,t,e){return pn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),pn.multiplyScalar(1/pn.w),pn.x=_i/e.width,pn.y=_i/e.height,pn.applyMatrix4(i.projectionMatrixInverse),pn.multiplyScalar(1/pn.w),Math.abs(Math.max(pn.x,pn.y))}function lx(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){Ce.start.fromBufferAttribute(s,o),Ce.end.fromBufferAttribute(r,o),Ce.applyMatrix4(e);const c=new R,u=new R;xn.distanceSqToSegment(Ce.start,Ce.end,u,c),u.distanceTo(c)<_i*.5&&t.push({point:u,pointOnLine:c,distance:xn.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function cx(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),h=-t.near;xn.at(1,fn),fn.w=1,fn.applyMatrix4(t.matrixWorldInverse),fn.applyMatrix4(n),fn.multiplyScalar(1/fn.w),fn.x*=r.x/2,fn.y*=r.y/2,fn.z=0,Va.copy(fn),Ga.multiplyMatrices(t.matrixWorldInverse,a);for(let d=0,p=u;d<p;d++){if(we.fromBufferAttribute(l,d),Te.fromBufferAttribute(c,d),we.w=1,Te.w=1,we.applyMatrix4(Ga),Te.applyMatrix4(Ga),we.z>h&&Te.z>h)continue;if(we.z>h){const E=we.z-Te.z,y=(we.z-h)/E;we.lerp(Te,y)}else if(Te.z>h){const E=Te.z-we.z,y=(Te.z-h)/E;Te.lerp(we,y)}we.applyMatrix4(n),Te.applyMatrix4(n),we.multiplyScalar(1/we.w),Te.multiplyScalar(1/Te.w),we.x*=r.x/2,we.y*=r.y/2,Te.x*=r.x/2,Te.y*=r.y/2,Ce.start.copy(we),Ce.start.z=0,Ce.end.copy(Te),Ce.end.z=0;const _=Ce.closestPointToPointParameter(Va,!0);Ce.at(_,ih);const m=Gh.lerp(we.z,Te.z,_),f=m>=-1&&m<=1,w=Va.distanceTo(ih)<_i*.5;if(f&&w){Ce.start.fromBufferAttribute(l,d),Ce.end.fromBufferAttribute(c,d),Ce.start.applyMatrix4(a),Ce.end.applyMatrix4(a);const E=new R,y=new R;xn.distanceSqToSegment(Ce.start,Ce.end,y,E),e.push({point:y,pointOnLine:E,distance:xn.origin.distanceTo(y),object:i,face:null,faceIndex:d,uv:null,uv1:null})}}}class hx extends Me{constructor(t=new du,e=new fl({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)eh.fromBufferAttribute(e,a),nh.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+eh.distanceTo(nh);const r=new Vo(s,2,1);return t.setAttribute("instanceDistanceStart",new Sn(r,1,0)),t.setAttribute("instanceDistanceEnd",new Sn(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;xn=t.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;_i=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),Er.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=_i*.5;else{const h=Math.max(s.near,Er.distanceToPoint(xn.origin));c=sh(s,h,l.resolution)}if(Er.radius+=c,xn.intersectsSphere(Er)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),br.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=_i*.5;else{const h=Math.max(s.near,br.distanceToPoint(xn.origin));u=sh(s,h,l.resolution)}br.expandByScalar(u),xn.intersectsBox(br)!==!1&&(n?lx(this,e):cx(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Ha),this.material.uniforms.resolution.value.set(Ha.z,Ha.w))}}class fu extends du{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){const e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}setFromPoints(t){const e=t.length-1,n=new Float32Array(6*e);for(let s=0;s<e;s++)n[6*s]=t[s].x,n[6*s+1]=t[s].y,n[6*s+2]=t[s].z||0,n[6*s+3]=t[s+1].x,n[6*s+4]=t[s+1].y,n[6*s+5]=t[s+1].z||0;return super.setPositions(n),this}fromLine(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}}class ux extends hx{constructor(t=new fu,e=new fl({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}}let Wa=null;function Xa(){if(Wa)return Wa;const i=128,t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.18,"rgba(255,235,190,0.95)"),n.addColorStop(.45,"rgba(255,182,72,0.35)"),n.addColorStop(.75,"rgba(255,140,40,0.08)"),n.addColorStop(1,"rgba(255,120,20,0)"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new al(t);return s.colorSpace=Ne,Wa=s,s}let Ya=null;function dx(){if(Ya)return Ya;const i=512,t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,i*.05,i/2,i/2,i*.5);n.addColorStop(0,"#111a23"),n.addColorStop(.55,"#0b1118"),n.addColorStop(.9,"#070b10"),n.addColorStop(1,"#05080b"),e.fillStyle=n,e.fillRect(0,0,i,i);const s=new al(t);return s.colorSpace=Ne,Ya=s,s}const Wi=[[0,[3,6,10]],[.22,[10,38,54]],[.48,[40,140,160]],[.7,[255,166,60]],[.88,[255,214,140]],[1,[255,248,230]]];function fx(i){const t=Math.max(0,Math.min(1,i));for(let e=1;e<Wi.length;e++)if(t<=Wi[e][0]){const[n,s]=Wi[e-1],[r,a]=Wi[e],o=(t-n)/(r-n);return[s[0]+(a[0]-s[0])*o,s[1]+(a[1]-s[1])*o,s[2]+(a[2]-s[2])*o]}return Wi[Wi.length-1][1]}function rh(i){i.traverse(t=>{const e=t;e.geometry&&e.geometry.dispose();const n=e.material;if(Array.isArray(n))n.forEach(s=>s.dispose());else if(n){for(const s of Object.values(n))s instanceof Le&&s.dispose();n.dispose()}})}const mn=64,ah=95,en=2.6,wr={scene:{position:new R(66,56,86),target:new R(0,3,0)},plan:{position:new R(0,84,.01),target:new R(0,0,0)},field:{position:new R(0,132,.01),target:new R(0,0,0)}};class px{constructor(t,e){this.canvas=t,this.stage=e,this.renderer=new qv({canvas:t,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.outputColorSpace=Ne,this.renderer.toneMapping=Dh,this.renderer.toneMappingExposure=1.12,this.camera=new Ke(42,1,1,2400),this.camera.position.copy(wr.scene.position),this.controls=new jv(this.camera,t),this.controls.target.copy(wr.scene.target),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.minDistance=45,this.controls.maxDistance=460,this.controls.maxPolarAngle=Math.PI*.495,this.controls.enablePan=!0,this.controls.update(),this.scene.add(new em(12376319,1708552,1));const n=new sm(16773596,1.7);n.position.set(80,150,90),this.scene.add(n);const s=new Da(4106440,220,220,2);s.position.set(-50,40,-40),this.scene.add(s),this.beadLight=new Da(16758344,0,90,2),this.beadLight.position.set(0,12,0),this.scene.add(this.beadLight),this.buildTable(),this.buildArray(),this.scene.add(this.table,this.arrayGroup,this.painting,this.beams);const r=64;this.tailPositions=new Float32Array(r*3),this.tailColors=new Float32Array(r*3);const a=new ee;a.setAttribute("position",new Pe(this.tailPositions,3)),a.setAttribute("color",new Pe(this.tailColors,3)),this.tail=new gr(a,new Rs({size:5.2,map:Xa(),vertexColors:!0,transparent:!0,opacity:.95,blending:gn,depthWrite:!1,sizeAttenuation:!0})),this.tail.frustumCulled=!1,this.tail.visible=!1,this.scene.add(this.tail),this.bead=new Wp(new tu({map:Xa(),color:16765578,transparent:!0,blending:gn,depthWrite:!1})),this.bead.scale.setScalar(9),this.bead.visible=!1,this.scene.add(this.bead),this.fieldPlane=new Me(new Hs(126,126),new di({transparent:!0,opacity:.82,blending:gn,depthWrite:!1,side:cn})),this.fieldPlane.rotation.x=-Math.PI/2,this.fieldPlane.position.y=.32,this.fieldPlane.visible=!1,this.scene.add(this.fieldPlane);const o=new ee,l=new Float32Array(260*3);for(let u=0;u<260;u++){const h=20+Math.random()*95,d=Math.random()*Math.PI*2;l[u*3]=Math.cos(d)*h,l[u*3+1]=8+Math.random()*110,l[u*3+2]=Math.sin(d)*h}o.setAttribute("position",new Pe(l,3)),this.atmosphere=new gr(o,new Rs({color:16761963,size:.5,transparent:!0,opacity:.34,blending:gn,depthWrite:!1})),this.scene.add(this.atmosphere),this.onResize=()=>this.resize(),window.addEventListener("resize",this.onResize),new ResizeObserver(()=>this.resize()).observe(e),this.resize(),this.lastTime=performance.now(),this.animate=this.animate.bind(this),this.frameHandle=requestAnimationFrame(this.animate)}canvas;stage;renderer;scene=new Gp;camera;controls;table=new qn;arrayGroup=new qn;painting=new qn;beams=new qn;atmosphere;bead;beadLight;fieldPlane;fieldTexture=null;figureLine=null;trapLine=null;devicePoints=null;simLine=null;targetLine=null;tail;tailPositions;tailColors;plan=null;view="scene";cameraTween=null;onResize;frameHandle=0;visible=!0;lastTime=0;fps=0;fpsAccum=0;fpsFrames=0;onStats=null;buildTable(){const t=new Me(new ol(mn,128),new Ca({map:dx(),roughness:.82,metalness:.18}));t.rotation.x=-Math.PI/2,this.table.add(t);const e=new Me(new ll(mn-.7,mn+.2,160),new di({color:16758344,transparent:!0,opacity:.18,side:cn}));e.rotation.x=-Math.PI/2,e.position.y=.15,this.table.add(e);const n=new fi({color:2899275,transparent:!0,opacity:.36});for(let a=10;a<mn;a+=10){const o=[];for(let l=0;l<=128;l++){const c=l/128*Math.PI*2;o.push(new R(Math.cos(c)*a,.18,Math.sin(c)*a))}this.table.add(new As(new ee().setFromPoints(o),n))}const s=[];for(let a=0;a<24;a++){const o=a/24*Math.PI*2;s.push(new R(0,.18,0),new R(Math.cos(o)*mn,.18,Math.sin(o)*mn))}this.table.add(new Ra(new ee().setFromPoints(s),n));const r=new fi({color:16758344,transparent:!0,opacity:.18});this.table.add(new Ra(new ee().setFromPoints([new R(-mn,.2,0),new R(mn,.2,0),new R(0,.2,-mn),new R(0,.2,mn)]),r))}buildArray(){this.arrayGroup.position.y=ah;const t=new Me(new Wr(52,52,3.2,96),new Ca({color:1055525,metalness:.72,roughness:.34,transparent:!0,opacity:.86,emissive:463644,emissiveIntensity:1}));t.position.y=4,this.arrayGroup.add(t);const e=new Me(new Xr(52,.55,8,160),new di({color:16758344,transparent:!0,opacity:.7}));e.rotation.x=Math.PI/2,e.position.y=2.4,this.arrayGroup.add(e);const n=new Me(new Xr(34,.22,6,128),new di({color:6674663,transparent:!0,opacity:.35}));n.rotation.x=Math.PI/2,n.position.y=2.3,this.arrayGroup.add(n);const s=new Wr(2.1,2.1,3.4,14),r=new Ca({color:3359826,metalness:.85,roughness:.3}),a=new qp(s,r,vn.length),o=new Kt;vn.forEach(([p,g],_)=>{o.makeTranslation(p,.6,g),a.setMatrixAt(_,o)}),a.instanceMatrix.needsUpdate=!0,this.arrayGroup.add(a);const l=new Float32Array(vn.length*3);vn.forEach(([p,g],_)=>{l[_*3]=p,l[_*3+1]=0,l[_*3+2]=g});const c=new ee;c.setAttribute("position",new Pe(l,3)),this.arrayGroup.add(new gr(c,new Rs({color:6674663,size:3.1,map:Xa(),transparent:!0,opacity:.8,blending:gn,depthWrite:!1}))),[16724e3,2162528,2117887,16769216].forEach((p,g)=>{const _=new Me(new cl(1.5,16,12),new di({color:p})),m=g/4*Math.PI*2+Math.PI/4;_.position.set(Math.cos(m)*47,2.3,Math.sin(m)*47),this.arrayGroup.add(_),this.arrayGroup.add(new Da(p,6,22,2).translateX(_.position.x).translateZ(_.position.z))});const h=new fi({color:16761963,transparent:!0,opacity:.02,blending:gn,depthWrite:!1}),d=[];for(const[p,g]of vn)d.push(new R(p,0,g),new R(p*.25,-en-40,g*.25));this.beams.add(new Ra(new ee().setFromPoints(d),h)),this.beams.position.y=ah-2}setPlan(t){if(this.plan=t,this.clearPlanObjects(),!t){this.bead.visible=!1,this.tail.visible=!1;return}const e=t.beadX.length,n=new Float32Array((e+1)*3),s=new Float32Array((e+1)*3);for(let d=0;d<e;d++){n[d*3]=t.beadX[d]*1e3,n[d*3+1]=en,n[d*3+2]=t.beadY[d]*1e3;const p=t.ledR[d]+t.ledG[d]+t.ledB[d]>6;s[d*3]=(p?t.ledR[d]/255:.35)**1.1,s[d*3+1]=(p?t.ledG[d]/255:.38)**1.1,s[d*3+2]=(p?t.ledB[d]/255:.42)**1.1}n[e*3]=n[0],n[e*3+1]=en,n[e*3+2]=n[2],s[e*3]=s[0],s[e*3+1]=s[1],s[e*3+2]=s[2];const r=new fu;r.setPositions(n),r.setColors(s);const a=new fl({vertexColors:!0,linewidth:2.9,transparent:!0,opacity:.72,blending:gn,depthWrite:!1});a.resolution.set(this.canvas.clientWidth||1,this.canvas.clientHeight||1),this.figureLine=new ux(r,a),this.figureLine.frustumCulled=!1,this.painting.add(this.figureLine);const o=[];for(let d=0;d<t.trapX.length;d+=2)o.push(new R(t.trapX[d]*1e3,en-1.2,t.trapY[d]*1e3));o.push(o[0]?.clone()??new R);const l=new ee().setFromPoints(o);this.trapLine=new As(l,new tm({color:11122627,dashSize:1.7,gapSize:1.4,transparent:!0,opacity:.34,depthWrite:!1})),this.trapLine.computeLineDistances(),this.painting.add(this.trapLine);const c=new Float32Array(t.points.length*3);t.points.forEach((d,p)=>{c[p*3]=d.xUm/1e3,c[p*3+1]=en+.4,c[p*3+2]=d.yUm/1e3});const u=new ee;if(u.setAttribute("position",new Pe(c,3)),this.devicePoints=new gr(u,new Rs({color:16758344,size:1.5,transparent:!0,opacity:.55,blending:gn,depthWrite:!1})),this.painting.add(this.devicePoints),t.simBeadX&&t.simBeadY){const d=[];for(let p=0;p<t.simBeadX.length;p+=3)d.push(new R(t.simBeadX[p]*1e3,en+.9,t.simBeadY[p]*1e3));this.simLine=new As(new ee().setFromPoints(d),new fi({color:16777215,transparent:!0,opacity:.42,depthWrite:!1})),this.painting.add(this.simLine)}const h=[];for(let d=0;d<t.targetX.length;d++)h.push(new R(t.targetX[d]*1e3,en+1.4,t.targetY[d]*1e3));h.length>1&&(h.push(h[0].clone()),this.targetLine=new As(new ee().setFromPoints(h),new fi({color:6674663,transparent:!0,opacity:.16,depthWrite:!1})),this.painting.add(this.targetLine)),this.setProgress(0,!1)}clearPlanObjects(){for(const t of[this.figureLine,this.trapLine,this.devicePoints,this.simLine,this.targetLine])t&&(t.parent?.remove(t),rh(t));this.figureLine=null,this.trapLine=null,this.devicePoints=null,this.simLine=null,this.targetLine=null}setLiveTarget(t,e,n=!0){this.bead.position.set(t,en+.6,e),this.bead.visible=n,this.beadLight.position.set(t,en+4,e),this.beadLight.intensity=n?26:0,this.beadLight.color.setRGB(1,.72,.3)}setProgress(t,e){if(!this.plan)return;const n=this.plan.beadX.length;if(n===0)return;const s=Math.max(0,Math.min(n-1,Math.floor(t*n))),r=this.plan.beadX[s]*1e3,a=this.plan.beadY[s]*1e3;this.bead.position.set(r,en+.6,a),this.bead.visible=e||t>0,this.beadLight.position.set(r,en+4,a),this.beadLight.intensity=e?26:8,this.beadLight.color.setRGB(1,.72,.3);const o=this.tailPositions.length/3;if(!e){this.tail.visible=!1;return}this.tail.visible=!0;for(let c=0;c<o;c++){const u=(s-c*2+n*2)%n;this.tailPositions[c*3]=this.plan.beadX[u]*1e3,this.tailPositions[c*3+1]=en+.7,this.tailPositions[c*3+2]=this.plan.beadY[u]*1e3;const h=(1-c/o)**1.7,d=this.plan.ledR[u]/255,p=this.plan.ledG[u]/255,g=this.plan.ledB[u]/255;this.tailColors[c*3]=(d*.8+.2)*h,this.tailColors[c*3+1]=(p*.8+.2)*h,this.tailColors[c*3+2]=(g*.8+.2)*h}const l=this.tail.geometry;l.getAttribute("position").needsUpdate=!0,l.getAttribute("color").needsUpdate=!0}setField(t){if(this.fieldTexture&&(this.fieldTexture.dispose(),this.fieldTexture=null),!t){this.fieldPlane.visible=!1;return}const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d"),s=n.createImageData(t.width,t.height);for(let o=0;o<t.height;o++)for(let l=0;l<t.width;l++){const c=t.values[(t.height-1-o)*t.width+l],[u,h,d]=fx(c),p=(o*t.width+l)*4;s.data[p]=u,s.data[p+1]=h,s.data[p+2]=d,s.data[p+3]=255}n.putImageData(s,0,0);const r=new al(e);r.colorSpace=Ne,r.minFilter=rn,r.magFilter=rn;const a=this.fieldPlane.material;a.map=r,a.needsUpdate=!0,this.fieldTexture=r,this.fieldPlane.visible=this.view==="field"}setView(t){this.view=t,this.arrayGroup.visible=t==="scene",this.beams.visible=t==="scene",this.fieldPlane.visible=t==="field"&&!!this.fieldTexture,this.figureLine&&(this.figureLine.material.opacity=t==="field"?.44:.62),this.startCameraTween(wr[t]),t!=="scene"?this.controls.enableRotate=!1:this.controls.enableRotate=!0}startCameraTween(t){this.cameraTween={from:{position:this.camera.position.clone(),target:this.controls.target.clone()},to:{position:t.position.clone(),target:t.target.clone()},t:0}}resetView(){this.setView(this.view==="field"||this.view==="plan"?"scene":this.view),this.startCameraTween(wr[this.view])}setVisible(t){this.visible!==t&&(this.visible=t,cancelAnimationFrame(this.frameHandle),t&&(this.lastTime=performance.now(),this.frameHandle=requestAnimationFrame(this.animate)))}resize(){const t=this.stage.clientWidth,e=this.stage.clientHeight;t===0||e===0||(this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.figureLine&&this.figureLine.material.resolution.set(t,e))}animate(t){const e=Math.min(.05,(t-this.lastTime)/1e3);if(this.lastTime=t,this.fpsAccum+=e,this.fpsFrames++,this.fpsAccum>=.5&&(this.fps=this.fpsFrames/this.fpsAccum,this.fpsAccum=0,this.fpsFrames=0,this.onStats?.(this.fps)),this.cameraTween){this.cameraTween.t=Math.min(1,this.cameraTween.t+e*1.9);const n=this.cameraTween.t,s=1-(1-n)**3;this.camera.position.lerpVectors(this.cameraTween.from.position,this.cameraTween.to.position,s),this.controls.target.lerpVectors(this.cameraTween.from.target,this.cameraTween.to.target,s),n>=1&&(this.cameraTween=null)}this.view==="scene"&&(this.atmosphere.rotation.y+=e*.014),this.controls.update(),this.visible&&(this.renderer.render(this.scene,this.camera),this.frameHandle=requestAnimationFrame(this.animate))}dispose(){cancelAnimationFrame(this.frameHandle),window.removeEventListener("resize",this.onResize),this.controls.dispose(),this.renderer.dispose(),rh(this.scene)}}const pu={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};const mu=([i,t,e])=>{const n=document.createElementNS("http://www.w3.org/2000/svg",i);return Object.keys(t).forEach(s=>{n.setAttribute(s,String(t[s]))}),e?.length&&e.forEach(s=>{const r=mu(s);n.appendChild(r)}),n},mx=(i,t={})=>{const n={...pu,...t};return mu(["svg",n,i])};const gx=(...i)=>i.filter((t,e,n)=>!!t&&t.trim()!==""&&n.indexOf(t)===e).join(" ").trim();const _x=i=>{for(const t in i)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};const vx=i=>{let t="",e=!1;for(const n of i){if(n==="-"||n==="_"||n<=" "){e=t.length>0;continue}t.length===0?t+=n.toLowerCase():t+=e?n.toUpperCase():n,e=!1}return t};const xx=i=>{const t=vx(i);return t.charAt(0).toUpperCase()+t.slice(1)};const Mx=i=>Array.from(i.attributes).reduce((t,e)=>(t[e.name]=e.value,t),{}),oh=i=>typeof i=="string"?i:!i||!i.class?"":i.class&&typeof i.class=="string"?i.class.split(" "):i.class&&Array.isArray(i.class)?i.class:"",lh=(i,{nameAttr:t,icons:e,attrs:n})=>{const s=i.getAttribute(t);if(s==null)return;const r=xx(s),a=e[r];if(!a)return console.warn(`${i.outerHTML} icon name was not found in the provided icons object.`);const o=Mx(i),l=_x(o)?{}:{"aria-hidden":"true"},c={...pu,"data-lucide":s,...l,...n,...o},u=oh(o),h=oh(n),d=gx("lucide",`lucide-${s}`,...u,...h);d&&Object.assign(c,{class:d});const p=mx(a,c);return i.parentNode?.replaceChild(p,i)};const yx=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]];const Sx=[["path",{d:"M12 5v14"}],["path",{d:"m19 12-7 7-7-7"}]];const bx=[["path",{d:"m5 12 7-7 7 7"}],["path",{d:"M12 19V5"}]];const Ex=[["path",{d:"M2 10v3"}],["path",{d:"M6 6v11"}],["path",{d:"M10 3v18"}],["path",{d:"M14 8v7"}],["path",{d:"M18 5v13"}],["path",{d:"M22 10v3"}]];const wx=[["path",{d:"M12 5v16"}],["path",{d:"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"}]];const Tx=[["path",{d:"M20 6 9 17l-5-5"}]];const Ax=[["circle",{cx:"12",cy:"12",r:"1"}],["circle",{cx:"12",cy:"12",r:"10"}]];const Rx=[["path",{d:"M15.6 2.7a10 10 0 1 0 5.7 5.7"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M13.4 10.6 19 5"}]];const Cx=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}],["path",{d:"M12 17h.01"}]];const Px=[["circle",{cx:"12",cy:"12",r:"10"}]];const Lx=[["path",{d:"M12 20v2"}],["path",{d:"M12 2v2"}],["path",{d:"M17 20v2"}],["path",{d:"M17 2v2"}],["path",{d:"M2 12h2"}],["path",{d:"M2 17h2"}],["path",{d:"M2 7h2"}],["path",{d:"M20 12h2"}],["path",{d:"M20 17h2"}],["path",{d:"M20 7h2"}],["path",{d:"M7 20v2"}],["path",{d:"M7 2v2"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1"}]];const Dx=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];const Ux=[["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]];const Ix=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"}],["path",{d:"m2 2 20 20"}]];const Nx=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"}],["circle",{cx:"12",cy:"12",r:"3"}]];const Fx=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"}],["circle",{cx:"12",cy:"8",r:"2"}],["path",{d:"M12 10v12"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"}]];const Ox=[["circle",{cx:"12",cy:"12",r:"3"}],["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]];const Bx=[["path",{d:"m12 14 4-4"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0"}]];const zx=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"}]];const kx=[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"}]];const Hx=[["path",{d:"M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8"}]];const Vx=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];const Gx=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"}]];const Wx=[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12"}]];const Xx=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56"}]];const Yx=[["path",{d:"M15 3h6v6"}],["path",{d:"m21 3-7 7"}],["path",{d:"m3 21 7-7"}],["path",{d:"M9 21H3v-6"}]];const qx=[["path",{d:"M5 12h14"}]];const $x=[["path",{d:"m14.622 17.897-10.68-2.913"}],["path",{d:"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"}],["path",{d:"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"}]];const jx=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor"}]];const Kx=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}],["path",{d:"m16 15-3-3 3-3"}]];const Zx=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}],["path",{d:"m14 9 3 3-3 3"}]];const Jx=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1"}]];const Qx=[["path",{d:"M13 21h8"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}]];const tM=[["path",{d:"m18 13-.654-4.736a4 4 0 00-2.756-3.266l-9.163-2.9a2 2 0 00-2.017.493l-.82.819a2 2 0 00-.492 2.017l2.9 9.163a4 4 0 003.266 2.756L13 18"}],["path",{d:"M18.648 12.352a1.205 1.205 0 011.704 0l1.296 1.296a1.205 1.205 0 010 1.704l-6.296 6.296a1.205 1.205 0 01-1.704 0l-1.296-1.296a1.205 1.205 0 010-1.704z"}],["path",{d:"m3 3 6.586 6.586"}],["circle",{cx:"11",cy:"11",r:"2"}]];const eM=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];const nM=[["path",{d:"M12 22v-5"}],["path",{d:"M15 8V2"}],["path",{d:"M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"}],["path",{d:"M9 8V2"}]];const iM=[["path",{d:"M12 2v10"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04"}]];const sM=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478"}],["circle",{cx:"12",cy:"12",r:"2"}]];const rM=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]];const aM=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]];const oM=[["path",{d:"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"}],["path",{d:"m14.5 12.5 2-2"}],["path",{d:"m11.5 9.5 2-2"}],["path",{d:"m8.5 6.5 2-2"}],["path",{d:"m17.5 15.5 2-2"}]];const lM=[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}],["path",{d:"M7 12h10"}]];const cM=[["path",{d:"M14 17H5"}],["path",{d:"M19 7h-9"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]];const hM=[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]];const uM=[["path",{d:"M10 5H3"}],["path",{d:"M12 19H3"}],["path",{d:"M14 3v4"}],["path",{d:"M16 17v4"}],["path",{d:"M21 12h-9"}],["path",{d:"M21 19h-5"}],["path",{d:"M21 5h-7"}],["path",{d:"M8 10v4"}],["path",{d:"M8 12H3"}]];const dM=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];const fM=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];const pM=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}]];const mM=[["line",{x1:"10",x2:"14",y1:"2",y2:"2"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11"}],["circle",{cx:"12",cy:"14",r:"8"}]];const gM=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];const _M=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"}]];const vM=[["path",{d:"M12 4v16"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"}],["path",{d:"M9 20h6"}]];const xM=[["path",{d:"m19 5 3-3"}],["path",{d:"m2 22 3-3"}],["path",{d:"M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"}],["path",{d:"M7.5 13.5 10 11"}],["path",{d:"M10.5 16.5 13 14"}],["path",{d:"m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"}]];const MM=[["path",{d:"M12 3v12"}],["path",{d:"m17 8-5-5-5 5"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}]];const yM=[["circle",{cx:"10",cy:"7",r:"1"}],["circle",{cx:"4",cy:"20",r:"1"}],["path",{d:"M4.7 19.3 19 5"}],["path",{d:"m21 3-3 1 2 2Z"}],["path",{d:"M9.26 7.68 5 12l2 5"}],["path",{d:"m10 14 5 2 3.5-3.5"}],["path",{d:"m18 12 1-1 1 1-1 1Z"}]];const SM=[["path",{d:"M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z"}],["path",{d:"m16.5 14.5 5-5"}],["path",{d:"m16.5 9.5 5 5"}]];const bM=[["path",{d:"M2 12q2.5 2 5 0t5 0 5 0 5 0"}],["path",{d:"M2 19q2.5 2 5 0t5 0 5 0 5 0"}],["path",{d:"M2 5q2.5 2 5 0t5 0 5 0 5 0"}]];const EM=[["path",{d:"M12 20h.01"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764"}],["path",{d:"m2 2 20 20"}]];const wM=[["path",{d:"M12 20h.01"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0"}]];const TM=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];const AM=[["path",{d:"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"}]];const gu=({icons:i={},nameAttr:t="data-lucide",attrs:e={},root:n=document,inTemplates:s}={})=>{if(!Object.values(i).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof n>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(n.querySelectorAll(`[${t}]`)).forEach(a=>lh(a,{nameAttr:t,icons:i,attrs:e})),s&&Array.from(n.querySelectorAll("template")).forEach(o=>gu({icons:i,nameAttr:t,attrs:e,root:o.content,inTemplates:s})),t==="data-lucide"){const a=n.querySelectorAll("[icon-name]");a.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(a).forEach(o=>lh(o,{nameAttr:"icon-name",icons:i,attrs:e})))}},RM={Activity:yx,ArrowDown:Sx,ArrowUp:bx,AudioLines:Ex,BookOpen:wx,Check:Tx,Circle:Px,CircleDot:Ax,CircleGauge:Rx,CircleHelp:Cx,Cpu:Lx,Download:Dx,ExternalLink:Ux,Eye:Nx,EyeOff:Ix,Flower2:Fx,Focus:Ox,Gauge:Bx,Heart:zx,Hexagon:kx,Infinity:Hx,Info:Vx,Layers:Gx,Link2:Wx,Loader2:Xx,Maximize2:Yx,Minus:qx,Paintbrush:$x,Palette:jx,PanelLeftClose:Kx,PanelLeftOpen:Zx,Pause:Jx,PenLine:Qx,PenTool:tM,Play:eM,Plug:nM,Power:iM,Radio:sM,RefreshCw:rM,RotateCcw:aM,Ruler:oM,ScanLine:lM,Settings2:cM,Shapes:hM,SlidersHorizontal:uM,Sparkles:dM,Square:fM,Star:pM,Timer:mM,Triangle:_M,TriangleAlert:gM,Type:vM,Unplug:xM,Upload:MM,Usb:yM,VolumeX:SM,Waves:bM,Wifi:wM,WifiOff:EM,X:TM,Zap:AM};function Kn(i=document){gu({icons:RM,root:i,attrs:{"stroke-width":"1.7"}})}function Ae(i){const t=i.format??(a=>String(Math.round(a*100)/100)),e=it("span",{class:"control-value"}),n=it("input",{type:"range",min:String(i.min),max:String(i.max),step:String(i.step),value:String(i.value),attrs:{"aria-label":i.label}}),s=(a,o=!1)=>{const l=(a-i.min)/(i.max-i.min)*100;if(n.style.setProperty("--fill",`${Math.max(0,Math.min(100,l))}%`),Ts(e),e.append(t(a)),i.unit&&e.append(it("span",{text:i.unit})),!o){const c=Number(n.value);i.onInput?.(c)}};n.addEventListener("input",()=>s(Number(n.value))),n.addEventListener("change",()=>i.onChange?.(Number(n.value)));const r=it("div",{class:"control"},it("div",{class:"control-head"},it("label",{class:"control-label",text:i.label}),e),n,i.hint?it("p",{class:"section-note",text:i.hint}):null);return s(i.value,!0),{root:r,input:n,setValue(a,o=!0){n.value=String(a),s(a,o)},setDisabled(a){n.disabled=a,r.classList.toggle("is-disabled",a)}}}function CM(i){const t=it("input",{type:"checkbox",class:"switch-input",attrs:{"aria-label":i.label}});return t.checked=i.checked,t.addEventListener("change",()=>i.onChange(t.checked)),{root:it("div",{class:"control switch-control"},it("div",{class:"switch-copy"},it("span",{class:"control-label",text:i.label}),i.hint?it("p",{class:"section-note",text:i.hint}):null),it("label",{class:"switch"},t,it("span",{class:"switch-track"}))),input:t,setChecked(n){t.checked=n}}}function ch(i,t,e,n=""){const s=it("div",{class:`segmented ${n}`.trim(),attrs:{role:"group"}}),r=i.map(o=>{const l=it("button",{type:"button",text:o.label,title:o.title??o.label,class:o.value===t?"is-active":""});return l.addEventListener("click",()=>{l.classList.contains("is-active")||(a(o.value),e(o.value))}),s.append(l),{option:o,button:l}}),a=o=>{for(const{option:l,button:c}of r)c.classList.toggle("is-active",l.value===o)};return{root:s,setValue:a}}function Xi(i,...t){return it("section",{class:`control-section ${i.className??""}`.trim()},it("div",{class:"section-head"},it("h2",{text:i.title}),i.actions??it("span",{class:"eyebrow",text:i.eyebrow??""})),...t)}function nn(i,t={}){const e=["btn"];t.variant==="primary"?e.push("btn-primary"):t.variant==="danger"?e.push("btn-danger"):t.variant==="ghost"?e.push("btn-ghost"):t.variant==="small"?e.push("btn-small"):t.variant==="small-primary"&&e.push("btn-small","btn-primary"),t.block&&e.push("btn-block");const n=it("button",{type:"button",class:e.join(" "),title:t.title??i,attrs:t.disabled?{disabled:!0}:{}},t.icon?ss(t.icon,14):null,it("span",{text:i}));return t.onClick&&n.addEventListener("click",t.onClick),n}const PM={circle:{icon:"circle",label:"圆"},square:{icon:"square",label:"方"},triangle:{icon:"triangle",label:"三角"},hexagon:{icon:"hexagon",label:"六边"},star:{icon:"star",label:"星"},heart:{icon:"heart",label:"心"},rose:{icon:"flower-2",label:"玫瑰"},lissajous:{icon:"waves",label:"李萨如"},infinity:{icon:"infinity",label:"无穷"},text:{icon:"type",label:"文字"}};function LM(i,t,e){const n=it("div",{class:"shape-grid",attrs:{role:"group","aria-label":"图形"}}),s=new Map;for(const r of i){const a=PM[r]??{icon:"circle-dot",label:r},o=it("button",{type:"button",class:r===t?"shape-btn is-active":"shape-btn",title:a.label},ss(a.icon,17),it("span",{text:a.label}));o.addEventListener("click",()=>e(r)),s.set(r,o),n.append(o)}return{root:n,setActive(r){for(const[a,o]of s)o.classList.toggle("is-active",a===r)}}}function hh(i,t,e){const n=it("input",{type:"color",value:Nl(t),attrs:{"aria-label":i}}),s=it("span",{class:"mono",text:Nl(t).toUpperCase()});return n.addEventListener("input",()=>{const r=Dd(n.value);s.textContent=n.value.toUpperCase(),e(r)}),it("label",{class:"swatch-input",title:`${i} 颜色`},n,`${i} `,s)}function DM(i,t={}){const e=it("input",{class:"text-input",type:"text",value:i,placeholder:t.placeholder??"",spellcheck:!1,autocomplete:"off",attrs:{maxlength:t.maxLength??24,"aria-label":t.ariaLabel??"文字"}});return e.addEventListener("change",()=>t.onCommit?.(e.value)),e.addEventListener("keydown",n=>{n.key==="Enter"&&(e.blur(),t.onCommit?.(e.value))}),e}class uh{values=new Map;constructor(t,e){t.innerHTML="";for(const n of e){const s=document.createTextNode("—"),r=it("small",{text:n.unit??""}),a=it("span",{class:"metric-value"},s,r),o=it("div",{class:`metric-card${n.accent?" is-accent":""}`},it("span",{class:"metric-label",text:n.label}),a);t.append(o),this.values.set(n.key,{text:s,unit:r,card:o,def:n})}}update(t,e=[],n=[]){for(const[s,r]of this.values){const a=t[s],o=r.def.digits??(typeof a=="number"?Math.abs(a)>=100?0:Math.abs(a)>=10?1:2:0);r.text.textContent=typeof a=="number"?Ge(a,o):a??"—",r.unit.textContent=r.def.unit??"",r.card.classList.toggle("is-warn",e.includes(s)),r.card.classList.toggle("is-danger",n.includes(s))}}}function UM(i,t){i.innerHTML="";for(const e of t){const n=it("dl",{class:"readout-grid"});for(const s of e.rows)n.append(it("dt",{text:s.label}),it("dd",{class:s.state?`is-${s.state}`:"",text:s.value}));i.append(it("div",{class:"readout-section"},it("div",{class:"readout-title"},it("span",{text:e.title}),e.meta?it("em",{text:e.meta}):null),n))}}function IM(i){const t=[[/^needs (\d+)% of the modelled trap force at ([\d.]+) Hz:.*$/,"$2 Hz 时模型需要 $1% 的陷阱力：前导饱和，小球会滞后或甩出。降低刷新率、提高绘制强度，或先做 Spin 标定。"],[/^LOST: at the modelled lateral strength the simulated bead lags the trap by ([\d.]+) mm \(> ([\d.]+) mm, the escape radius\).*$/,"LOST：仿真小球滞后陷阱 $1 mm（逃逸半径 $2 mm），会掉球。降低刷新率、提高绘制强度，或提高横向强度。"],[/^at risk: the bead escapes in the simulation if the trap is (\d+)% weaker than modelled.*$/,"风险：如果实际陷阱比模型弱 $1%，仿真小球会逃出。建议做 Spin 标定或留出刷新率余量。"],[/^simulated bead is pushed ([\d.]+) mm off the trap, near the force peak \(([\d.]+) mm\) where it slips and bends the trail.*$/,"仿真小球被推离陷阱 $1 mm，接近力峰（$2 mm），会打滑并弯折轨迹。降低刷新率或提高绘制强度。"],[/^shape distortion up to ([\d.]+) mm if the lateral strength is (\d+)% off; the spin test calibrates it$/,"横向强度偏差 $2% 时形状误差可达 $1 mm；Spin 标定可以校准。"],[/^device interpolation error ([\d.]+) mm: the path needs more than (\d+) points - slow it down or shrink it$/,"设备插值误差 $1 mm：路径需要多于 $2 个点。放慢刷新或缩小图形。"],[/^refresh ([\d.]+) Hz is below persistence of vision; use a long camera exposure or a smaller shape$/,"刷新率 $1 Hz 低于视觉暂留阈值；请用长曝光拍摄，或缩小图形。"],[/^the figure reaches ([\d.]+) mm off the array axis, where the trap keeps only (\d+)% of its force; centre or shrink it to draw faster$/,"图形最远到达距阵列轴 $1 mm，那里陷阱只剩 $2% 的力；把图形移到中心或缩小可以画得更快。"],[/^the trap is too weak for motion at this level \(model\): raise the draw level or the lateral strength$/,"这个强度下模型认为陷阱不足以运动：提高绘制强度或横向强度。"]];for(const[e,n]of t)if(e.test(i))return i.replace(e,n);return i}function qa(i,t,e="模型检查通过：轨迹在陷阱能力范围内"){if(i.innerHTML="",t.length===0){i.append(it("div",{class:"warning-empty"},ss("check",13),it("span",{text:e}))),Kn(i);return}for(const n of t){const s=/^(LOST|at risk)/i.test(n);i.append(it("div",{class:`warning-item${s?" is-bad":""}`},it("span",{text:IM(n)})))}}class NM{constructor(t,e=60){this.container=t,this.limit=e}container;limit;lines=[];add(t,e="info"){const n=new Date,s=`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`;this.lines.push({time:s,text:t,kind:e}),this.lines.length>this.limit&&this.lines.shift(),this.render()}clear(){this.lines.length=0,this.render()}render(){this.container.innerHTML="";for(const t of[...this.lines].reverse())this.container.append(it("div",{class:`log-line is-${t.kind}`},it("time",{text:t.time}),it("span",{text:t.text})))}}function Tr(i,t,e,n){i.hidden=!e,t&&n&&(t.textContent=n)}const FM="#65d8e7",OM="#ffb648",BM="rgba(255,255,255,0.075)",Ir="rgba(183,196,207,0.62)",_u="rgba(127,142,156,0.8)",vu="10px ui-monospace, SFMono-Regular, Consolas, monospace";function xu(i){const t=i.clientWidth,e=i.clientHeight;if(t<8||e<8)return null;const n=Math.min(window.devicePixelRatio||1,2),s=Math.round(t*n),r=Math.round(e*n);(i.width!==s||i.height!==r)&&(i.width=s,i.height=r);const a=i.getContext("2d");return a?(a.setTransform(n,0,0,n,0,0),a.clearRect(0,0,t,e),{ctx:a,width:t,height:e}):null}function dh(i,t,e,n,s=1.2){if(t.length!==0){i.beginPath(),i.strokeStyle=n,i.lineWidth=s,i.lineJoin="round";for(let r=0;r<t.length;r++)r===0?i.moveTo(e[r],t[r]):i.lineTo(e[r],t[r]);i.stroke()}}function zM(i,t,e=0){const n=xu(i);if(!n)return;const{ctx:s,width:r,height:a}=n,o=34,l=30,c=10,u=17,h=r-o-l,d=a-c-u;if(h<10||d<10)return;s.fillStyle="rgba(255,255,255,0.018)",s.fillRect(o,c,h,d),s.strokeStyle=BM,s.lineWidth=1,s.fillStyle=Ir,s.font=vu,s.textAlign="right",s.textBaseline="middle";for(let x=0;x<=4;x++){const S=c+d*x/4;s.beginPath(),s.moveTo(o,S),s.lineTo(o+h,S),s.stroke()}if(!t||t.speed.length===0){s.fillStyle=_u,s.textAlign="center",s.fillText("无规划数据",o+h/2,c+d/2);return}let p=0,g=0;for(let x=0;x<t.speed.length;x++)t.speed[x]>p&&(p=t.speed[x]),t.accel[x]>g&&(g=t.accel[x]);const _=t.raw?1e-9:1;p=Math.max(p*1e3*1.12,_),g=Math.max(g*1.12,_);const m=t.speed.length,f=t.periodS*1e3,w=new Float64Array(m),E=new Float64Array(m),y=new Float64Array(m);for(let x=0;x<m;x++)w[x]=o+h*x/(m-1||1),E[x]=c+d-t.speed[x]*1e3*d/p,y[x]=c+d-t.accel[x]*d/g;const A=s.createLinearGradient(0,c,0,c+d);A.addColorStop(0,"rgba(101,216,231,0.22)"),A.addColorStop(1,"rgba(101,216,231,0)"),s.beginPath(),s.moveTo(w[0],c+d);for(let x=0;x<m;x++)s.lineTo(w[x],E[x]);s.lineTo(w[m-1],c+d),s.closePath(),s.fillStyle=A,s.fill(),dh(s,y,w,"rgba(255,182,72,0.72)",1),dh(s,E,w,FM,1.6),s.fillStyle=Ir,s.textAlign="right",s.textBaseline="top";const C=p>=10?p.toFixed(0):p>=.1?p.toFixed(2):p.toExponential(1);s.fillText(C,o-6,c),s.fillStyle="rgba(101,216,231,0.75)",s.fillText("mm/s",o-6,c+11),s.textAlign="left",s.fillStyle="rgba(255,182,72,0.78)";const L=t.raw?"0":g>=1?g.toFixed(0):g.toExponential(1);s.fillText(t.raw?"a 0":`${L} m/s²`,o+h+5,c),s.fillStyle=Ir,s.textAlign="center",s.textBaseline="top",s.fillText("0",o,c+d+4),s.fillText(t.raw?sn(f/2):`${(f/2).toFixed(0)}`,o+h/2,c+d+4),s.fillText(t.raw?sn(f):`${f.toFixed(0)} ms`,o+h,c+d+4);const U=o+h*Math.max(0,Math.min(1,e));s.strokeStyle="rgba(255,255,255,0.36)",s.setLineDash([2,3]),s.beginPath(),s.moveTo(U,c),s.lineTo(U,c+d),s.stroke(),s.setLineDash([]),s.fillStyle=OM,s.beginPath(),s.arc(U,c+d-t.accel[Math.min(m-1,Math.floor(e*m))]/g*d,2,0,Math.PI*2),s.fill()}function kM(i){let t=1/0,e=-1/0,n=1/0,s=-1/0;const r=(o,l,c=1)=>{for(let u=0;u<o.length;u+=c){const h=o[u]*1e3,d=l[u]*1e3;h<t&&(t=h),h>e&&(e=h),d<n&&(n=d),d>s&&(s=d)}};if(r(i.targetX,i.targetY),r(i.trapX,i.trapY,2),r(i.beadX,i.beadY,2),!Number.isFinite(t))return{minX:-10,maxX:10,minY:-10,maxY:10};const a=Math.max(2,(e-t)*.08,(s-n)*.08);return{minX:t-a,maxX:e+a,minY:n-a,maxY:s+a}}function HM(i,t,e=0){const n=xu(i);if(!n)return;const{ctx:s,width:r,height:a}=n,o=16,l=14,c=r-o*2,u=a-o*2-l;if(c<10||u<10)return;if(s.fillStyle="rgba(255,255,255,0.016)",s.fillRect(o,o,c,u),!t){s.fillStyle=_u,s.textAlign="center",s.textBaseline="middle",s.fillText("无规划数据",r/2,a/2);return}const h=kM(t),d=Math.min(c/(h.maxX-h.minX),u/(h.maxY-h.minY)),p=o+c/2,g=o+u/2,_=(h.minX+h.maxX)/2,m=(h.minY+h.maxY)/2,f=b=>p+(b-_)*d,w=b=>g-(b-m)*d,E=Math.max(h.maxX-h.minX,h.maxY-h.minY),y=E>60?20:E>30?10:5;s.strokeStyle="rgba(255,255,255,0.05)",s.lineWidth=1;for(let b=Math.ceil(h.minX/y)*y;b<=h.maxX;b+=y)s.beginPath(),s.moveTo(f(b),w(h.minY)),s.lineTo(f(b),w(h.maxY)),s.stroke();for(let b=Math.ceil(h.minY/y)*y;b<=h.maxY;b+=y)s.beginPath(),s.moveTo(f(h.minX),w(b)),s.lineTo(f(h.maxX),w(b)),s.stroke();const A=t.beadX.length;s.lineWidth=3.4,s.lineCap="round";for(let b=0;b<A;b++){const F=(b+1)%A;if(t.ledR[b]+t.ledG[b]+t.ledB[b]<6)continue;const B=.34;s.strokeStyle=`rgba(${Math.round(t.ledR[b])},${Math.round(t.ledG[b])},${Math.round(t.ledB[b])},${B})`,s.beginPath(),s.moveTo(f(t.beadX[b]*1e3),w(t.beadY[b]*1e3)),s.lineTo(f(t.beadX[F]*1e3),w(t.beadY[F]*1e3)),s.stroke()}const C=Math.floor(e*A),L=Math.max(6,Math.floor(A*.12));s.lineWidth=2.2;for(let b=0;b<L;b++){const F=(C-b+A*2)%A,B=(F+1)%A;t.ledR[F]+t.ledG[F]+t.ledB[F]<6||(s.strokeStyle=`rgb(${Math.round(t.ledR[F])},${Math.round(t.ledG[F])},${Math.round(t.ledB[F])})`,s.beginPath(),s.moveTo(f(t.beadX[F]*1e3),w(t.beadY[F]*1e3)),s.lineTo(f(t.beadX[B]*1e3),w(t.beadY[B]*1e3)),s.stroke())}s.strokeStyle="rgba(170,184,196,0.42)",s.lineWidth=1,s.setLineDash([3,4]),s.beginPath();for(let b=0;b<t.trapX.length;b+=2){const F=f(t.trapX[b]*1e3),B=w(t.trapY[b]*1e3);b===0?s.moveTo(F,B):s.lineTo(F,B)}s.closePath(),s.stroke(),s.setLineDash([]),s.fillStyle="rgba(255,182,72,0.5)";for(const b of t.points)s.fillRect(f(b.xUm/1e3)-.8,w(b.yUm/1e3)-.8,1.6,1.6);if(t.simBeadX&&t.simBeadY){s.strokeStyle="rgba(255,255,255,0.6)",s.lineWidth=.8,s.beginPath();for(let b=0;b<t.simBeadX.length;b+=2){const F=f(t.simBeadX[b]*1e3),B=w(t.simBeadY[b]*1e3);b===0?s.moveTo(F,B):s.lineTo(F,B)}s.stroke()}if(A>0){const b=Math.min(A-1,Math.max(0,Math.floor(e*A))),F=f(t.beadX[b]*1e3),B=w(t.beadY[b]*1e3),z=s.createRadialGradient(F,B,0,F,B,9);z.addColorStop(0,"rgba(255,255,255,0.95)"),z.addColorStop(.3,"rgba(255,214,138,0.7)"),z.addColorStop(1,"rgba(255,182,72,0)"),s.fillStyle=z,s.beginPath(),s.arc(F,B,9,0,Math.PI*2),s.fill()}const U=y,x=U*d,S=a-7;s.strokeStyle="rgba(255,255,255,0.4)",s.lineWidth=1,s.beginPath(),s.moveTo(r-o-x,S),s.lineTo(r-o,S),s.stroke(),s.fillStyle=Ir,s.font=vu,s.textAlign="center",s.textBaseline="bottom",s.fillText(`${U} mm`,r-o-x/2,S-2)}let Yi=null;function VM(){return Yi||(Yi=document.getElementById("toastStack")),Yi||(Yi=it("div",{class:"toast-stack",id:"toastStack"}),document.body.append(Yi)),Yi}function Re(i,t="info",e=2800){const n=VM(),s=t==="ok"?"check":t==="error"?"triangle-alert":"info",r=it("div",{class:`toast is-${t}`,attrs:{role:"status"}},ss(s,14),it("span",{text:i}));for(n.append(r),Kn(r);n.children.length>4;)n.firstElementChild?.remove();window.setTimeout(()=>{r.classList.add("is-leaving"),window.setTimeout(()=>r.remove(),260)},e)}const fh=[...Object.keys(rf),"text"],GM={circle:"圆",square:"方",triangle:"三角",hexagon:"六边",star:"五角星",heart:"心形",rose:"玫瑰线",lissajous:"李萨如",infinity:"无穷",text:"文字"};function kt(i){const t=document.getElementById(i);if(!t)throw new Error(`missing element #${i}`);return t}class WM{constructor(t,e,n,s){this.host=t,this.devices=e,this.client=n,this.ui=s,this.cfg=t.cfg,this.selectedShape=fh.includes(s.displayShape)?s.displayShape:"circle",this.view=s.displayView,this.speed=s.speed||1,this.log=new NM(kt("displayLog")),this.metrics=this.createMetrics(),this.scene=new px(kt("displayCanvas"),kt("displayStage")),this.scene.onStats=g=>this.host.setFps(g),this.levelFill=it("i"),this.levelCaption=it("div",{class:"level-caption"}),this.loading=kt("displayLoading"),this.loadingText=kt("displayLoadingText"),this.stageError=kt("displayStageError"),this.loopFill=kt("displayLoopFill"),this.clock=kt("displayClock"),this.paletteStrip=it("div",{class:"palette-strip"}),this.resizeObserver=new ResizeObserver(()=>this.drawCharts(this.phase)),this.resizeObserver.observe(kt("displayMetrics")),this.resizeObserver.observe(kt("speedChart").parentElement);const r=this.buildModeSection(),a=this.buildTrapSection(),o=this.buildShapeSection(),l=this.buildColourSection(),c=this.buildMotionSection(),u=this.buildConfigSection();kt("displayControls").append(r.root,a.root,o.root,l.root,c.root,u),Kn(kt("displayControls")),this.levelSlider=a.level,this.lateralSlider=c.lateral,this.refreshSlider=c.refresh,this.cxSlider=o.cx,this.cySlider=o.cy,this.normalMotion=c.normal,this.motionRoot=c.root,this.rawMotion=r.raw,this.liveX=r.liveX,this.liveY=r.liveY,this.liveSpeed=r.liveSpeed,this.liveAccel=r.liveAccel,this.rawActual=r.rawActual,this.unlimitedToggle=r.toggle,this.spanEl=o.span,this.textRow=o.textRow,this.textField=o.textField,this.shapeGridHandle=o.grid,this.spinButton=a.spin,this.playButton=kt("displayPlay");const h=nn("规划",{icon:"scan-line",variant:"primary",onClick:()=>{this.replan(!0)}});this.stickyPlay=nn("播放",{icon:"play",onClick:()=>{this.togglePlayback()}});const d=nn("停止",{icon:"square",onClick:()=>{this.stopPlayback()}}),p=kt("displayRail");p.insertBefore(it("div",{class:"rail-actions"},h,this.stickyPlay,d),p.querySelector(".rail-foot")),this.syncUnlimitedUi(),this.bindHud(),this.bindPlayback(),this.syncShapeUi(),this.updateLevelMeter(),this.syncSpeedSelect(),this.applyView(this.view,!1),this.log.add("工作区就绪 · 规则来自原 Python 实现","ok"),this.log.add(this.devices.isDemo?"演示硬件已加载（未连接真实设备）":`已连接 ${this.devices.state.label}`,"info"),this.pollTimer=window.setInterval(()=>{this.pollStatus()},700)}host;devices;client;ui;cfg;log;metrics;scene;plan=null;session=null;sessionVersion=-1;selectedShape;view;playing=!1;phase=0;speed;lastFrame=0;raf=0;lastChart=0;planSeq=0;planning=!1;pendingPlan=!1;lastStatus=null;pollTimer=0;pollBusy=!1;fieldCache=new Map;fieldSeq=0;spinArmed=!1;lastDeviceVersion=-1;visible=!1;levelSlider;lateralSlider;refreshSlider;cxSlider;cySlider;liveLevel=255;liveSpeedNow=0;realtime=!1;autoLevitated=!1;liveSending=!1;livePending=!1;liveSaveTimer=0;liveHudAt=0;live=new of(()=>({speedMmS:this.cfg.unlimited.speedMmS,accelMmS2:this.cfg.unlimited.accelMmS2}),t=>this.onLiveMove(t),35);normalMotion;motionRoot;rawMotion;liveX;liveY;liveSpeed;liveAccel;rawActual;unlimitedToggle;spanEl;textRow;textField;shapeGridHandle;levelFill;levelCaption;spinButton;playButton;stickyPlay;loading;loadingText;stageError;loopFill;clock;paletteStrip;resizeObserver;buildTrapSection(){const t=this.cfg,e=Ae({label:"悬停强度",min:20,max:255,step:1,value:t.trap.level,unit:"/255",onInput:u=>{t.trap.level=Math.round(u),this.updateLevelMeter(),this.host.saveConfig()},onChange:u=>{const h=Math.round(u);t.trap.level=h,this.updateLevelMeter(),this.host.saveConfig(),this.session?.state===Ie.Hover&&this.session.setLevel(h).catch(d=>this.fail(d)),this.cfg.unlimited.enabled&&(this.liveLevel=h,this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi())}}),n=Ae({label:"绘制强度",min:0,max:255,step:1,value:t.planner.drawLevel,unit:"/255",hint:"0 = 沿用悬停强度；255 是满功率。",onInput:u=>{t.planner.drawLevel=Math.round(u)},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),s=it("div",{class:"level-meter"},this.levelFill),r=nn("起浮 / 接管",{icon:"power",variant:"primary",block:!0,onClick:()=>{this.levitate()}}),a=nn("落球",{icon:"arrow-down",onClick:()=>{this.dropBead()}}),o=nn("Spin 标定",{icon:"gauge",onClick:()=>{this.onSpin()}}),l=nn("急停",{icon:"zap",variant:"danger",title:"立即关场（E-STOP）",onClick:()=>{this.emergencyStop()}});return{root:Xi({title:"声场与强度",eyebrow:"TRAP",actions:it("span",{class:"eyebrow",text:"MOTION v7"})},e.root,n.root,s,this.levelCaption,it("div",{class:"btn-row"},l),it("div",{class:"btn-row"},r),it("div",{class:"btn-row"},a,o),it("p",{class:"section-note",text:"先打开陷阱，再把泡沫小球放进声场。Spin 标定把横向强度写进配置。"})),level:e,drawLevel:n,spin:o}}buildShapeSection(){const t=this.cfg,e=LM(fh,this.selectedShape,h=>this.selectShape(h)),n=DM(t.display.text,{placeholder:"输入英文、数字或符号",ariaLabel:"文字内容",onCommit:h=>{t.display.text=h.toUpperCase(),this.selectedShape="text",this.ui.displayShape="text",this.shapeGridHandle.setActive("text"),this.syncShapeUi(),this.schedulePlan(!0)}}),s=it("div",{class:"inline-row"},n,nn("绘制",{variant:"small",onClick:()=>this.textField.blur()})),r=Ae({label:"图形尺寸",min:2,max:60,step:.5,value:t.display.sizeMm,unit:"mm",onInput:h=>{t.display.sizeMm=h},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),a=Ae({label:"文字高度",min:2,max:30,step:.5,value:t.display.textHeightMm,unit:"mm",onInput:h=>{t.display.textHeightMm=h},onChange:()=>{this.host.saveConfig(),this.selectedShape==="text"&&this.schedulePlan()}}),o=Ae({label:"中心 X",min:-35,max:35,step:.5,value:t.display.centerXMm,unit:"mm",onInput:h=>{t.display.centerXMm=h,t.unlimited.enabled&&this.applyLiveCenter()},onChange:()=>{this.host.saveConfig(),t.unlimited.enabled||this.schedulePlan()}}),l=Ae({label:"中心 Y",min:-35,max:35,step:.5,value:t.display.centerYMm,unit:"mm",onInput:h=>{t.display.centerYMm=h,t.unlimited.enabled&&this.applyLiveCenter()},onChange:()=>{this.host.saveConfig(),t.unlimited.enabled||this.schedulePlan()}});o.root.classList.add("center-duplicate"),l.root.classList.add("center-duplicate");const c=it("span",{class:"eyebrow",text:"SHAPE"});return{root:Xi({title:"图形与摆放",eyebrow:"SHAPE",actions:c},e.root,s,r.root,a.root,o.root,l.root,it("p",{class:"section-note",text:"小图形画得更快；图形离阵列轴心越远，陷阱越弱。"})),grid:e,textRow:s,textField:n,span:c,cx:o,cy:l}}buildColourSection(){const t=this.cfg,e=ch([{value:"wheel",label:"色轮"},{value:"gradient",label:"渐变"},{value:"solid",label:"单色"}],t.display.colorScheme,c=>{t.display.colorScheme=c,this.host.saveConfig(),this.schedulePlan()},"seg-wide"),n=it("div",{class:"swatch-row"},hh("A",t.display.colorA,c=>{t.display.colorA=c,this.host.saveConfig()}),hh("B",t.display.colorB,c=>{t.display.colorB=c,this.host.saveConfig()})),s=Ae({label:"颜色流动",min:0,max:1.55,step:.05,value:t.display.hueSpinRevS,unit:"rev/s",onInput:c=>{t.display.hueSpinRevS=c},onChange:()=>this.host.saveConfig()}),r=Ae({label:"亮度",min:0,max:1,step:.02,value:t.display.brightness,format:c=>`${Math.round(c*100)}`,unit:"%",onInput:c=>{t.display.brightness=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),a=Ae({label:"慢处调暗",min:0,max:1,step:.05,value:t.display.evenLines,format:c=>`${Math.round(c*100)}`,unit:"%",hint:"让拐角与笔画端点不过曝，整条线曝光一致。",onInput:c=>{t.display.evenLines=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),o=nn("实时上色",{icon:"palette",onClick:()=>{this.recolor()}});return{root:Xi({title:"颜色与光",eyebrow:"COLOUR"},e.root,n,this.paletteStrip,s.root,r.root,a.root,it("div",{class:"btn-row"},o))}}buildModeSection(){const t=this.cfg,e=CM({label:"解除所有限制",checked:t.unlimited.enabled,hint:"开启后自动起浮，中心 X/Y、手柄左摇杆与 WASD 直接实时下发，不走规划和播放。",onChange:u=>{this.setUnlimited(u).catch(h=>this.fail(h))}});e.input.id="unlimitedToggle";const n=it("div",{class:"raw-summary"}),s=Ae({label:"中心 X",min:-35,max:35,step:.1,value:t.display.centerXMm,unit:"mm",onInput:u=>{t.display.centerXMm=u,this.applyLiveCenter()},onChange:()=>this.host.saveConfig()});s.input.id="liveX";const r=Ae({label:"中心 Y",min:-35,max:35,step:.1,value:t.display.centerYMm,unit:"mm",onInput:u=>{t.display.centerYMm=u,this.applyLiveCenter()},onChange:()=>this.host.saveConfig()});r.input.id="liveY";const a=Ae({label:"移动速度",min:.01,max:50,step:.01,value:t.unlimited.speedMmS,unit:"mm/s",hint:"手柄左摇杆 / WASD 的目标速度；可播放中实时改。",onInput:u=>{t.unlimited.speedMmS=u,this.updateRawSummary()},onChange:()=>{this.host.saveConfig(),this.updateRawSummary(),this.realtime&&this.updateLiveUi()}});a.input.id="liveSpeed";const o=Ae({label:"加速度",min:.1,max:500,step:.1,value:t.unlimited.accelMmS2,unit:"mm/s²",hint:"速度向目标值逼近的加速度；越小越柔和。",onInput:u=>{t.unlimited.accelMmS2=u,this.updateRawSummary()},onChange:()=>{this.host.saveConfig(),this.updateRawSummary(),this.realtime&&this.updateLiveUi()}});o.input.id="liveAccel";const l=it("div",{class:"raw-group"},s.root,r.root,a.root,o.root,n,it("p",{class:"section-note",text:"开启即自动打开声场：修改中心 X/Y 会立即下发；Xbox 左摇杆或 WASD 以设定的速度/加速度连续移动。不生成路径、不需要规划或播放。"}));return{root:Xi({title:"模式",eyebrow:"MODE"},e.root,l),raw:l,liveX:s,liveY:r,liveSpeed:a,liveAccel:o,rawActual:n,toggle:e}}buildMotionSection(){const t=this.cfg,e=Ae({label:"刷新率",min:0,max:100,step:.5,value:t.display.refreshHz,unit:"Hz",hint:"0 = 自动：在模型力用 60% 内取最快循环。",onInput:c=>{t.display.refreshHz=c},onChange:c=>{t.display.refreshHz=c,this.host.saveConfig(),this.schedulePlan()}}),n=Ae({label:"横向陷阱强度",min:5,max:3e3,step:1,value:Fr(t),unit:"m/s²",hint:"255 级时测得的横向加速度；Spin 标定会自动写入。",onInput:c=>{Sl(t,c)},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),s=Ae({label:"jerk 平滑窗口",min:0,max:30,step:.5,value:t.planner.jerkTimeMs,unit:"ms",onInput:c=>{t.planner.jerkTimeMs=c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),r=Ae({label:"拐角圆角",min:0,max:6,step:.1,value:t.planner.cornerRadiusMm,unit:"mm",onInput:c=>{t.planner.cornerRadiusMm=c===0?.01:c},onChange:()=>{this.host.saveConfig(),this.schedulePlan()}}),a=ch([{value:"catmull",label:"Catmull-Rom"},{value:"linear",label:"线性"}],t.planner.interpolation,c=>{t.planner.interpolation=c,this.host.saveConfig()},"seg-wide"),o=it("div",{class:"normal-motion"},e.root,n.root,s.root,r.root,a.root,it("p",{class:"section-note",text:"规划器做时间最优速度、抗共振滤波与前馈；仿真只给提示，不限制播放。"}));return{root:Xi({title:"运动与预览",eyebrow:"MOTION"},o),lateral:n,refresh:e,normal:o}}createMetrics(){return this.cfg.unlimited.enabled?new uh(kt("displayMetrics"),[{key:"x",label:"中心 X",unit:"mm",digits:2,accent:!0},{key:"y",label:"中心 Y",unit:"mm",digits:2},{key:"speed",label:"速度",unit:"mm/s",digits:2},{key:"accel",label:"加速度",unit:"mm/s²",digits:1},{key:"level",label:"电平",unit:"/255",digits:0},{key:"mode",label:"输出",digits:0}]):new uh(kt("displayMetrics"),[{key:"refresh",label:"刷新率",unit:"Hz",digits:1,accent:!0},{key:"speed",label:"峰值速度",unit:"mm/s",digits:0},{key:"accel",label:"峰值加速度",unit:"m/s²",digits:0},{key:"force",label:"力用",unit:"%",digits:0},{key:"lead",label:"前馈前导",unit:"mm",digits:2},{key:"points",label:"设备点",unit:"pts",digits:0}])}syncUnlimitedUi(){const t=this.cfg.unlimited.enabled;this.normalMotion.hidden=t,this.motionRoot.hidden=t,this.rawMotion.hidden=!t,this.unlimitedToggle.setChecked(t),this.liveX.setValue(this.cfg.display.centerXMm,!0),this.liveY.setValue(this.cfg.display.centerYMm,!0),this.liveSpeed.setValue(this.cfg.unlimited.speedMmS,!0),this.liveAccel.setValue(this.cfg.unlimited.accelMmS2,!0),this.metrics=this.createMetrics(),kt("displayHudEyebrow").textContent=t?"LIGHT PAINTING · LIVE TARGET":"LIGHT PAINTING · STANDING WAVE",this.updateRawSummary()}updateRawSummary(){if(!this.rawActual)return;const t=this.realtime?this.live.position:{xMm:this.cfg.display.centerXMm,yMm:this.cfg.display.centerYMm};Ts(this.rawActual),this.rawActual.append(it("span",{text:"实时目标 "}),it("strong",{text:`X ${Ge(t.xMm,2)} / Y ${Ge(t.yMm,2)} mm`}),it("span",{text:` · ${Ge(this.cfg.unlimited.speedMmS,2)} mm/s · `}),it("strong",{text:`${Ge(this.cfg.unlimited.accelMmS2,1)} mm/s²`}))}async setUnlimited(t){if(t!==this.cfg.unlimited.enabled){if(this.playing&&await this.stopPlayback(),t){this.cfg.unlimited.enabled=!0,this.host.saveConfig(),this.syncUnlimitedUi(),this.log.add("已解除限制：实时 XY 输出","warn"),await this.startRealtime()||(this.cfg.unlimited.enabled=!1,this.host.saveConfig(),this.syncUnlimitedUi(),await this.replan(!0));return}this.cfg.unlimited.enabled=!1,this.host.saveConfig(),await this.stopRealtime(),this.syncUnlimitedUi(),this.log.add("已恢复速度规划与动力学校验","warn"),this.host.setHint("规划模式：时间最优速度、抗共振滤波与仿真校验"),await this.replan(!0)}}async startRealtime(){if(this.realtime)return!0;this.plan=null,this.scene.setPlan(null),this.scene.setLiveTarget(0,0,!1),this.drawCharts(0);try{const t=this.ensureSession();if(t.state===Ie.Running&&await t.stopDrawing(),t.state===Ie.Idle){const s=await t.levitate();this.autoLevitated=!0,this.log.add(s,"ok")}this.liveLevel=Math.max(1,Math.min(255,Math.round(this.cfg.trap.level))),await t.setLevel(this.liveLevel);const e=this.cfg.display.centerXMm,n=this.cfg.display.centerYMm;return this.realtime=!0,document.body.classList.add("is-realtime"),this.live.start(e,n),this.scene.setLiveTarget(e,n,!0),this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi(!0),this.log.add(`实时输出已启动：X ${e.toFixed(2)} / Y ${n.toFixed(2)} mm`,"ok"),Re("实时输出：左摇杆 / WASD 移动，中心 X/Y 直接下发","ok",3500),!0}catch(t){return this.realtime=!1,this.live.stop(),document.body.classList.remove("is-realtime"),this.scene.setLiveTarget(0,0,!1),this.autoLevitated&&this.session&&this.session.state!==Ie.Idle&&(await this.session.drop().catch(()=>{}),this.autoLevitated=!1),this.fail(t),!1}}async stopRealtime(){if(!this.realtime)return;this.realtime=!1,this.live.stop(),this.livePending=!1,window.clearTimeout(this.liveSaveTimer),this.liveSaveTimer=0,document.body.classList.remove("is-realtime"),this.scene.setLiveTarget(0,0,!1),this.host.saveConfig();const t=this.session;this.autoLevitated&&t&&t.state!==Ie.Idle&&await t.drop().catch(()=>{}),this.autoLevitated=!1}applyLiveCenter(){const t=this.cfg.display.centerXMm,e=this.cfg.display.centerYMm;if(this.cxSlider.setValue(t,!0),this.cySlider.setValue(e,!0),this.liveX.setValue(t,!0),this.liveY.setValue(e,!0),this.liveX.setValue(t,!0),this.liveY.setValue(e,!0),this.realtime){this.live.setPosition(t,e);return}this.scene.setLiveTarget(t,e,!0),this.updateRawSummary()}onLiveMove(t){if(!this.realtime)return;const e=Math.max(-35,Math.min(35,t.xMm)),n=Math.max(-35,Math.min(35,t.yMm));this.cfg.display.centerXMm=e,this.cfg.display.centerYMm=n,this.cxSlider.setValue(e,!0),this.cySlider.setValue(n,!0),this.liveX.setValue(e,!0),this.liveY.setValue(n,!0),this.liveSpeedNow=Math.hypot(t.vxMmS,t.vyMmS),this.scene.setLiveTarget(e,n,!0),this.livePending=!0,this.flushLiveTarget(),this.scheduleLiveSave();const s=performance.now();s-this.liveHudAt>100&&(this.liveHudAt=s,this.updateLiveUi())}async flushLiveTarget(){if(this.liveSending||!this.realtime)return;const t=this.session;if(!(!t||t.state!==Ie.Hover)){this.liveSending=!0;try{for(;this.livePending&&this.realtime&&(this.livePending=!1,this.session?.state===Ie.Hover);){const{xMm:e,yMm:n}=this.live.position;await t.liveTarget(e,n,this.liveLevel)}}catch(e){this.fail(e)}finally{this.liveSending=!1}}}scheduleLiveSave(){window.clearTimeout(this.liveSaveTimer),this.liveSaveTimer=window.setTimeout(()=>{this.liveSaveTimer=0,this.host.saveConfig()},500)}updateLiveUi(t=!1){const{xMm:e,yMm:n}=this.live.position,s=this.session?.state===Ie.Hover;this.metrics.update({x:e,y:n,speed:this.liveSpeedNow,accel:this.cfg.unlimited.accelMmS2,level:this.liveLevel,mode:s?"LIVE":"IDLE"}),kt("displayPlanTitle").textContent="实时输出";const r=kt("displayRefreshBadge");r.textContent=s?"LIVE":"IDLE",r.style.borderColor=s?"rgba(101,216,231,.42)":"rgba(255,182,72,.32)",r.style.color=s?"#9be7f0":"#ffc46b",kt("displayPlanSub").textContent=`X ${Ge(e,2)} · Y ${Ge(n,2)} mm · ${Ge(this.liveSpeedNow,2)} mm/s · a ${Ge(this.cfg.unlimited.accelMmS2,1)} mm/s²`,kt("planChartNote").textContent="实时坐标",this.host.setHint(`实时输出 · X ${Ge(e,2)} / Y ${Ge(n,2)} mm · ${Ge(this.liveSpeedNow,2)} mm/s`),t&&(kt("displayHudEyebrow").textContent="LIGHT PAINTING · LIVE TARGET",qa(kt("displayWarnings"),[],"实时模式：无规划、无播放；中心坐标直接下发设备")),this.updateRawSummary(),this.renderReadout()}buildConfigSection(){const t=it("input",{type:"file",accept:"application/json,.json",style:{display:"none"}});t.addEventListener("change",()=>{const r=t.files?.[0];r&&Bu(r).then(a=>{ja(a),Re("配置已导入，正在重载…","ok"),window.setTimeout(()=>window.location.reload(),450)}).catch(a=>this.fail(a))});const e=nn("导出 JSON",{icon:"download",onClick:()=>zu(this.cfg)}),n=nn("导入 JSON",{icon:"upload",onClick:()=>t.click()}),s=nn("恢复默认",{icon:"rotate-ccw",variant:"small",onClick:()=>{window.confirm("恢复默认配置并重载？当前参数与会话设置会丢失。")&&(Ou(),window.location.reload())}});return Xi({title:"配置",eyebrow:"CONFIG"},it("div",{class:"btn-row"},e,n),it("div",{class:"btn-row"},s),t,it("p",{class:"section-note",text:"配置保存在浏览器 localStorage，可导出备份；也可以直接导入原 Python 程序的 ~/.umh_display.json。"}))}bindHud(){for(const t of document.querySelectorAll("[data-display-view]"))t.addEventListener("click",()=>{const e=t.dataset.displayView;this.applyView(e,!0)});kt("displayResetView").addEventListener("click",()=>this.scene.resetView()),kt("displayClearLog").addEventListener("click",()=>this.log.clear()),this.refreshSlider.setValue(this.cfg.display.refreshHz),this.lateralSlider.setValue(Fr(this.cfg)),this.updateLevelMeter()}bindPlayback(){this.playButton.addEventListener("click",()=>{this.togglePlayback()}),kt("displaySpeed").addEventListener("change",t=>{this.speed=Number(t.target.value),this.ui.speed=this.speed,this.host.saveUiState()})}syncSpeedSelect(){const t=kt("displaySpeed");t.value=String(this.speed)}selectShape(t){if(this.selectedShape=t,this.ui.displayShape=t,this.host.saveUiState(),this.shapeGridHandle.setActive(t),this.syncShapeUi(),t==="text"&&(this.textField.focus(),this.textField.select()),this.playing){Re("绘制中：停止后可重新规划","info");return}this.schedulePlan(!0)}syncShapeUi(){const t=this.selectedShape==="text";this.textRow.hidden=!t,this.spanEl.textContent=t?"TEXT":"SHAPE",this.textField.value=this.cfg.display.text}updateLevelMeter(){const t=this.cfg.trap.level,e=Ps(t);this.levelFill.style.width=`${Math.max(2,t/255*100)}%`,this.levelCaption.innerHTML="",this.levelCaption.append(it("span",{text:`声功率 ${Math.round(e*100)}%`}),it("span",{text:`duty ${Math.round(t*128/255)}/128`}))}applyView(t,e){this.view=t,this.ui.displayView=t,this.host.saveUiState();for(const n of document.querySelectorAll("[data-display-view]"))n.classList.toggle("is-active",n.dataset.displayView===t);this.scene.setView(t),t==="field"&&e&&this.requestField()}shapeName(){return this.selectedShape==="text"?`text:${this.cfg.display.text}`:this.selectedShape}schedulePlan(t=!1){if(this.cfg.unlimited.enabled||this.playing)return;if(this.planning){this.pendingPlan=!0;return}const e=t?0:240;this.planTimer!==null&&window.clearTimeout(this.planTimer),this.planTimer=window.setTimeout(()=>{this.planTimer=null,this.replan(!1)},e)}planTimer=null;async replan(t){if(this.cfg.unlimited.enabled)return null;if(this.planning)return this.pendingPlan=!0,this.plan;this.planning=!0,this.pendingPlan=!1;const e=++this.planSeq;Tr(this.loading,this.loadingText,!0,this.cfg.unlimited.enabled?"正在生成原始轨迹…":"正在规划：速度 / 滤波 / 前馈…"),this.stageError.hidden=!0;try{const n=await this.client.plan(this.cfg,this.shapeName(),this.devices.current.profile.maxPathPoints);return e!==this.planSeq?null:(this.applyPlan(n),t&&this.log.add(n.raw?`原始轨迹 ${n.name}: 一圈 ${sn(n.metrics.periodMs)} · ${n.points.length} 点`:`规划 ${n.name}: ${n.metrics.refreshHz.toFixed(1)} Hz · ${n.points.length} 点`,"ok"),n)}catch(n){return this.stageError.hidden=!1,this.stageError.textContent=`规划失败：${n instanceof Error?n.message:String(n)}`,this.log.add(`规划失败：${String(n)}`,"error"),null}finally{this.planning=!1,Tr(this.loading,this.loadingText,!1),this.pendingPlan&&(this.pendingPlan=!1,this.schedulePlan(!0))}}applyPlan(t){this.plan=t,this.phase=0,this.scene.setPlan(t),this.scene.setProgress(0,!1);const e=kt("displayRefreshBadge");if(t.raw){const n=t.metrics;this.metrics.update({period:sn(n.periodMs),speed:n.vMaxMmS,length:n.lengthMm,loop:sn(n.deviceLoopMs),rate:n.playbackRate,points:t.points.length}),e.textContent="原始轨迹",e.style.borderColor="rgba(101,216,231,.42)",e.style.color="#9be7f0",kt("displayPlanSub").textContent=`一圈 ${sn(n.periodMs)} · ${t.points.length} 点 · 平均 ${Ge(n.vMaxMmS,n.vMaxMmS<1?4:2)} mm/s`,kt("planChartNote").textContent=`${sn(n.periodMs)} · ${t.points.length} pts`,qa(kt("displayWarnings"),t.warnings,"原始轨迹：无前馈、无速度/加速度约束、无共振滤波、无仿真校验"),this.host.setHint(`原始轨迹 · 一圈 ${sn(n.periodMs)} · 速度倍率 ${n.playbackRate.toFixed(3)}×`)}else this.metrics.update({refresh:t.metrics.refreshHz,speed:t.metrics.vMaxMmS,accel:t.metrics.aMaxMS2,force:t.metrics.forceUse*100,lead:t.metrics.leadMaxMm,points:t.points.length},t.metrics.forceUse>.85?["force"]:[],t.metrics.forceUse>1?["force"]:[]),e.textContent=t.warnings.some(n=>n.startsWith("LOST"))?"LOST":`${t.metrics.refreshHz.toFixed(1)} Hz`,e.style.borderColor=t.warnings.some(n=>n.startsWith("LOST"))?"rgba(255,93,108,.5)":"",e.style.color=t.warnings.some(n=>n.startsWith("LOST"))?"#ff8d96":"",kt("displayPlanSub").textContent=`周期 ${t.metrics.periodMs.toFixed(0)} ms · 力用 ${Math.round(t.metrics.forceUse*100)}% · 形状误差 ${t.metrics.shapeErrMm.toFixed(2)} mm · 前导 ${t.metrics.leadMaxMm.toFixed(2)} mm`,kt("planChartNote").textContent=`${t.metrics.periodMs.toFixed(0)} ms · ${t.points.length} pts`,qa(kt("displayWarnings"),t.warnings);kt("displayPlanTitle").textContent=t.name.startsWith("text:")?`文字 · ${t.name.slice(5)}`:`${GM[t.name]??t.name}`,this.renderPalette(t),this.updateRawSummary(),this.renderReadout(),this.drawCharts(0),this.view==="field"&&this.requestField()}renderPalette(t){Ts(this.paletteStrip);for(const[e,n,s]of t.palette)this.paletteStrip.append(it("span",{style:{background:`rgb(${e},${n},${s})`}}))}drawCharts(t){zM(kt("speedChart"),this.plan,t),HM(kt("planChart"),this.plan,t)}async requestField(){const t=hi(this.cfg),e=this.plan?.trapModel.heightMm??2.26,n=`${t}|${e.toFixed(2)}|${this.cfg.trap.tableDistanceMm}|${this.cfg.bead.diameterMm}|${this.cfg.bead.densityKgM3}`,s=this.fieldCache.get(n);if(s){this.scene.setField(s),this.scene.setView("field");return}const r=++this.fieldSeq;Tr(this.loading,this.loadingText,!0,"正在计算桌面上方声场…");try{const a=await this.client.displayField({mode:t,tableDistanceMm:this.cfg.trap.tableDistanceMm,focusOffsetMm:this.cfg.trap.focusOffsetMm,heightMm:e,extentMm:60,grid:96,bead:{diameterMm:this.cfg.bead.diameterMm,densityKgM3:this.cfg.bead.densityKgM3}});if(r!==this.fieldSeq)return;this.fieldCache.set(n,a),this.scene.setField(a),this.scene.setView("field")}catch(a){this.log.add(`声场计算失败：${String(a)}`,"error")}finally{r===this.fieldSeq&&Tr(this.loading,this.loadingText,!1)}}ensureSession(){const t=this.devices.state;return(!this.session||this.sessionVersion!==t.version)&&(this.session=new mf(t.device,this.cfg),this.sessionVersion=t.version),this.session}async levitate(){try{const t=this.ensureSession(),e=await t.levitate();this.cfg.trap.level=t.level,this.levelSlider.setValue(t.level),this.updateLevelMeter(),this.host.saveConfig(),this.log.add(e,"ok"),Re(e,"ok"),this.renderReadout(),this.cfg.unlimited.enabled&&(this.liveLevel=Math.max(1,Math.min(255,Math.round(t.level))),this.realtime?(await t.setLevel(this.liveLevel),this.livePending=!0,this.flushLiveTarget(),this.updateLiveUi()):await this.startRealtime())}catch(t){this.fail(t)}}async dropBead(){this.stopPlaybackLocal();try{await this.ensureSession().drop(),this.log.add("声场关闭，小球落下","info"),this.liveSpeedNow=0,this.realtime&&this.updateLiveUi(),this.renderReadout()}catch(t){this.fail(t)}}async emergencyStop(){this.stopPlaybackLocal();try{await this.session?.emergencyStop(),await this.devices.current.clear(),this.log.add("E-STOP 已发送：立即关场","error"),Re("E-STOP：声场立即关闭","error"),this.liveSpeedNow=0,this.realtime&&this.updateLiveUi()}catch(t){this.fail(t)}}async recolor(){if(this.cfg.unlimited.enabled){Re("实时模式没有路径颜色；关闭限制后再使用实时上色","info");return}if(this.session?.state===Ie.Running&&this.session.plan){const t=this.session.plan,e=await this.client.plan(this.cfg,t.name,t.points.length,t.periodS);await this.session.recolor(e),this.applyPlan(e),this.log.add("颜色已实时更新（路径几何不变）","ok"),Re("颜色已实时更新","ok");return}await this.replan(!0)}async togglePlayback(){if(this.cfg.unlimited.enabled){Re("实时模式不需要播放：用中心 X/Y、左摇杆或 WASD 直接移动","info");return}if(this.playing){await this.stopPlayback();return}try{const t=this.ensureSession();if(t.state===Ie.Idle){const n=await t.levitate();this.log.add(n,"ok"),Re("陷阱已打开：确保小球在声场里，再播放","info")}const e=await this.replan(!1)??this.plan;if(!e)return;await t.play(e),this.playing=!0,this.phase=0,this.lastFrame=performance.now(),this.lastChart=0,this.setPlayIcon(!0),this.updatePlayUi(),this.log.add(e.raw?`开始原始轨迹 ${e.name}：一圈 ${sn(e.metrics.periodMs)}`:`开始绘制 ${e.name} @ ${e.metrics.refreshHz.toFixed(1)} Hz`,"ok"),this.animate()}catch(t){this.fail(t)}}async stopPlayback(){this.stopPlaybackLocal();try{this.session?.state===Ie.Running&&(await this.session.stopDrawing(),this.log.add(this.plan?.raw?"原始轨迹已停止，停在当前位置悬停":"沿路径减速，停在当前位置悬停","info")),this.updatePlayUi(),this.renderReadout()}catch(t){this.fail(t)}}stopPlaybackLocal(){this.playing=!1,cancelAnimationFrame(this.raf),this.phase=0,this.loopFill.style.width="0%",this.clock.textContent="0.0 ms",this.plan&&this.scene.setProgress(0,!1),this.setPlayIcon(!1),this.updatePlayUi()}animate=()=>{if(!this.playing||!this.plan)return;const t=performance.now(),e=Math.min(.06,(t-this.lastFrame)/1e3);this.lastFrame=t,this.phase=(this.phase+e*this.speed/this.plan.periodS)%1,this.scene.setProgress(this.phase,!0),this.loopFill.style.width=`${this.phase*100}%`,this.clock.textContent=sn(this.phase*this.plan.periodS*1e3),t-this.lastChart>120&&(this.lastChart=t,this.drawCharts(this.phase)),this.raf=requestAnimationFrame(this.animate)};setPlayIcon(t){Ts(this.playButton),this.playButton.append(ss(t?"pause":"play",15)),Kn(this.playButton),this.playButton.setAttribute("aria-label",t?"暂停绘制":"播放")}updatePlayUi(){this.playButton.classList.toggle("is-live",this.playing),this.stickyPlay&&(Ts(this.stickyPlay),this.stickyPlay.append(ss(this.playing?"pause":"play",14),it("span",{text:this.playing?"暂停":"播放"})),Kn(this.stickyPlay),this.stickyPlay.classList.toggle("is-live",this.playing))}async onSpin(){if(this.spinArmed){this.spinArmed=!1,this.spinButton.classList.remove("is-armed"),this.spinButton.querySelector("span").textContent="标定中…",this.fell.value=!0;return}const t=this.session;if(!t||t.state!==Ie.Hover){Re("先起浮小球，再做 Spin 标定","error");return}if(window.confirm("Spin 标定：小球会在 8 mm 圆上越转越快约 15 秒。跳出场或掉下时点「它甩出了！」，程序会反解 255 级的横向陷阱强度。是否开始？")){this.fell.value=!1,this.spinArmed=!0,this.spinButton.classList.add("is-armed"),this.spinButton.querySelector("span").textContent="它甩出了！",this.log.add("Spin 标定开始：8 mm 圆，指数扫频","info");try{const e=await t.spinTest(this.fell,{report:n=>this.host.setHint(`Spin 标定：${n.toFixed(1)} Hz`)});if(e===null||!Number.isFinite(e)){Re("未观察到甩出（或一开始就掉下）：未保存，可调高横向强度后重试","error"),this.log.add("Spin 标定无有效折点","warn");return}Sl(this.cfg,Math.round(e)),this.lateralSlider.setValue(Math.round(e)),ja(this.cfg),this.log.add(`横向强度 ${e.toFixed(0)} m/s² @255 已保存`,"ok"),Re(`横向强度 ${e.toFixed(0)} m/s² 已保存，重新规划`,"ok"),await this.replan(!0)}catch(e){this.fail(e)}finally{this.spinArmed=!1,this.spinButton.classList.remove("is-armed"),this.spinButton.querySelector("span").textContent="Spin 标定"}}}fell={value:!1};async pollStatus(){if(!(!this.session||this.pollBusy)){this.pollBusy=!0;try{const t=await this.session.dev.motionStatus();this.lastStatus=t,this.renderReadout(),this.visible&&this.host.setHint(`${this.realtime?"实时":"规划"} · ${t.stateName} · (${(t.xUm/1e3).toFixed(2)}, ${(t.yUm/1e3).toFixed(2)}) mm · ${t.fps.toFixed(0)} fps · 服务 ${t.serviceAvgUs}/${t.serviceMaxUs} µs`)}catch{}finally{this.pollBusy=!1}}}renderReadout(){const t=this.plan,e=this.lastStatus,n=t?.trapModel,s=(a,o=1)=>a===void 0||!Number.isFinite(a)?"—":Ge(a,o),r=[];if(this.realtime){const a=this.live.position;r.push({title:"实时输出",meta:this.session?.state===Ie.Hover?"LIVE":"IDLE",rows:[{label:"中心 X",value:`${s(a.xMm,2)} mm`},{label:"中心 Y",value:`${s(a.yMm,2)} mm`},{label:"当前速度",value:`${s(this.liveSpeedNow,2)} mm/s`},{label:"加速度",value:`${s(this.cfg.unlimited.accelMmS2,1)} mm/s²`},{label:"目标速度",value:`${s(this.cfg.unlimited.speedMmS,2)} mm/s`},{label:"电平",value:`${this.liveLevel}/255`},{label:"控制器",value:"左摇杆 / WASD · 直接下发",state:"good"}]})}else if(t?.raw){const a=t.metrics;r.push({title:"原始轨迹",meta:"NO LIMITS",rows:[{label:"一圈用时",value:sn(a.periodMs)},{label:"基础周期",value:sn(a.deviceLoopMs)},{label:"速度倍率",value:`${a.playbackRate.toFixed(3)}×`},{label:"平均速度",value:`${s(a.vMaxMmS,a.vMaxMmS<1?4:2)} mm/s`},{label:"路径总长",value:`${s(a.lengthMm,1)} mm`},{label:"点亮长度",value:`${s(a.litMm,1)} mm`},{label:"设备点",value:`${a.points}`},{label:"路径采样",value:`${a.pathSamples}`},{label:"控制器",value:"线性插值 · 循环",state:"good"}]})}else if(t){const a=t.metrics;r.push({title:"规划",meta:`${a.refreshHz.toFixed(1)} Hz`,rows:[{label:"周期",value:`${s(a.periodMs,0)} ms`},{label:"TOPP 周期",value:`${s(a.toppPeriodMs,1)} ms`},{label:"路径总长",value:`${s(a.lengthMm,1)} mm`},{label:"点亮长度",value:`${s(a.litMm,1)} mm`},{label:"峰值速度",value:`${s(a.vMaxMmS,0)} mm/s`},{label:"点亮平均速度",value:`${s(a.vLitMeanMmS,0)} mm/s`},{label:"峰值加速度",value:`${s(a.aMaxMS2,0)} m/s²`},{label:"峰值 jerk",value:`${s(a.jerkMaxMS3/1e3,1)} k m/s³`},{label:"模型力用",value:`${s(a.forceUse*100,0)}%`,state:a.forceUse>1?"bad":a.forceUse>.85?"warn":"good"},{label:"最大前导",value:`${s(a.leadMaxMm,2)} mm`},{label:"离轴力保留",value:`${s(a.offaxisForceMin*100,0)}%`},{label:"参考误差",value:`${s(a.refErrMm,3)} mm`}]}),r.push({title:"仿真验证",meta:`±${(this.cfg.planner.robustForceError*100).toFixed(0)}% 力`,rows:[{label:"跟踪误差 max",value:`${s(a.trackErrMm,2)} mm`},{label:"跟踪误差 RMS",value:`${s(a.trackRmsMm,2)} mm`},{label:"形状误差",value:`${s(a.shapeErrMm,2)} mm`,state:a.shapeErrMm>this.cfg.planner.maxTrackingErrorMm?"warn":"good"},{label:"形状误差 (worst)",value:`${s(a.shapeErrWorstMm,2)} mm`},{label:"稳态偏移",value:`${s(a.offsetSteadyMm,2)} mm`},{label:"逃逸半径",value:`${s(a.offsetLimitMm,1)} mm`},{label:"设备重构误差",value:`${s(a.reconErrMm,3)} mm`,state:a.reconErrMm>.15?"warn":"good"},{label:"每帧步长",value:`${s(a.frameStepMm,3)} mm`},{label:"每帧相位步长",value:`${s(a.phaseStepDeg,2)}°`}]})}n&&r.push({title:"陷阱模型",meta:t?.name,rows:[{label:"小球质量",value:`${s(n.mass*1e6,3)} mg`},{label:"峰值力",value:`${s(n.fMax*1e6,1)} µN`},{label:"力峰偏移 d_pk",value:`${s(n.dPk*1e3,2)} mm`},{label:"逃逸半径",value:`${s(n.basin*1e3,1)} mm`},{label:"离轴尺度 r0",value:`${s(n.offaxisR0*1e3,1)} mm`},{label:"固有频率",value:`${s(Math.sqrt(n.fMax*Math.PI/(2*n.dPk)/n.mass)/(2*Math.PI),1)} Hz`},{label:"悬停高度",value:`${s(n.heightMm,2)} mm`}]}),r.push({title:"设备与链路",meta:this.devices.state.label,rows:e?[{label:"状态",value:e.stateName,state:e.running?"good":"dim"},{label:"陷阱位置",value:`${(e.xUm/1e3).toFixed(2)}, ${(e.yUm/1e3).toFixed(2)} mm`},{label:"输出帧率",value:`${e.fps.toFixed(0)} fps`},{label:"路径点",value:`${e.pathPoints}`},{label:"循环",value:`${e.loopMs} ms`},{label:"服务耗时",value:`${e.serviceAvgUs}/${e.serviceMaxUs} µs`},{label:"丢帧 / 错误",value:`${e.missedDeadlines} / ${e.frameErrors}`},{label:"链路",value:this.devices.isDemo?"演示（无硬件）":this.devices.state.label,state:this.devices.isDemo?"dim":"good"}]:[{label:"状态",value:"未连接/未起浮",state:"dim"},{label:"链路",value:this.devices.isDemo?"演示（无硬件）":this.devices.state.label}]}),UM(kt("displayReadout"),r)}fail(t){const e=t instanceof Error?t.message:String(t);this.log.add(e,"error"),Re(e,"error",4200),this.host.setHint(e)}onDeviceChanged(){const t=this.devices.state;t.version!==this.lastDeviceVersion&&(this.lastDeviceVersion=t.version,this.session=null,this.sessionVersion=-1,this.lastStatus=null,this.stopPlaybackLocal(),this.log.add(this.devices.isDemo?`硬件已断开或未连接：使用演示设备（${t.error||"演示模式"}）`:`已连接 ${t.label} · ${t.device.profile.firmware}`,this.devices.isDemo?"warn":"ok"),this.pollStatusSoon(),this.cfg.unlimited.enabled?(this.realtime=!1,this.live.stop(),document.body.classList.remove("is-realtime"),this.startRealtime()):this.replan(!1))}pollStatusSoon(){window.setTimeout(()=>{this.pollStatus()},150)}activate(){this.visible=!0,this.scene.setVisible(!0),this.scene.resize(),this.drawCharts(this.phase)}deactivate(){this.visible=!1,this.stopPlaybackLocal(),this.scene.setVisible(!1);const t=this.session;t&&t.state!==Ie.Idle&&t.drop().then(()=>this.log.add("工作区隐藏：光绘声场已关闭","info")).catch(()=>{})}async start(){this.lastDeviceVersion=this.devices.state.version,this.cfg.unlimited.enabled?await this.startRealtime():await this.replan(!1),this.drawCharts(0),this.updatePlayUi()}isFieldActive(){return this.playing||this.session!==null&&this.session.state!==Ie.Idle}setFpsListener(){this.scene.onStats=t=>this.host.setFps(t)}dispose(){window.clearInterval(this.pollTimer),this.resizeObserver.disconnect(),cancelAnimationFrame(this.raf),this.live.stop(),this.scene.dispose(),this.session?.emergencyStop()}}const ph=i=>new Promise(t=>window.setTimeout(t,i)),$a=()=>new Promise(i=>requestAnimationFrame(()=>i()));function XM(){try{const i=localStorage.getItem(_h);if(i){const t=JSON.parse(i);return{displayShape:typeof t.displayShape=="string"?t.displayShape:"circle",displayView:t.displayView==="plan"||t.displayView==="field"?t.displayView:"scene",speed:[1e4,1e3,100,10,1,.5,.25].includes(Number(t.speed))?Number(t.speed):1}}}catch{}return{displayShape:"circle",displayView:"scene",speed:1}}class YM{cfg;devices=new Rd;client=new Pd;ui;display;lastLinkVersion=-1;saveUi=Ud(()=>{try{localStorage.setItem(_h,JSON.stringify(this.ui))}catch{}},160);constructor(){this.cfg=Fu(),this.ui=XM()}async boot(){const t=document.getElementById("boot"),e=document.getElementById("bootText"),n=document.getElementById("bootBar"),s=(r,a)=>{n&&(n.style.width=`${r}%`),e&&(e.textContent=a)};try{Kn(document),s(8,"读取配置与界面状态"),await $a(),s(22,"装配光绘工作区"),this.display=new WM(this,this.devices,this.client,this.ui),Kn(document),await $a(),s(38,"预热声场模型（Gor′kov 势）");const r=this.client.warm();await Promise.race([r,ph(8e3)]),s(58,"规划初始图形"),await this.display.start(),s(94,"就绪"),await $a(),this.display.activate(),this.bindShell(),this.devices.subscribe(a=>this.onLink(a)),this.onLink(this.devices.state),this.setHint(this.cfg.unlimited.enabled?"实时输出：左摇杆 / WASD 连续移动 · 中心 X/Y 直接下发":"规划在 Web Worker 中运行 · 拖动三维视图可旋转"),await ph(260),t?.classList.add("is-done"),window.setTimeout(()=>t?.remove(),700)}catch(r){console.error(r),e&&(e.textContent=`启动失败：${r instanceof Error?r.message:String(r)}`),n&&(n.style.width="100%"),Re(`启动失败：${r instanceof Error?r.message:String(r)}`,"error",8e3)}}get config(){return this.cfg}setFps(t){const e=document.getElementById("statusFps");e&&(e.textContent=`${Math.max(0,Math.round(t))} fps`)}setHint(t){const e=document.getElementById("statusHint");e&&(e.textContent=t)}notifyLink(t){this.onLink(t)}saveConfig(){ja(this.cfg)}saveUiState(){this.saveUi()}bindShell(){document.getElementById("connectBtn")?.addEventListener("click",()=>{this.toggleConnection()});const e=document.getElementById("helpDialog");document.getElementById("helpBtn")?.addEventListener("click",()=>{e&&!e.open&&e.showModal()}),document.querySelectorAll("[data-close-help]").forEach(n=>n.addEventListener("click",()=>e?.close())),e?.addEventListener("click",n=>{n.target===e&&e.close()});for(const n of document.querySelectorAll("[data-open-rail]"))n.addEventListener("click",()=>document.getElementById("displayRail")?.classList.add("is-open"));for(const n of document.querySelectorAll("[data-close-rail]"))n.addEventListener("click",()=>n.closest(".rail")?.classList.remove("is-open"));for(const n of document.querySelectorAll("[data-open-inspector]"))n.addEventListener("click",()=>document.getElementById("displayInspector")?.classList.add("is-open"));for(const n of document.querySelectorAll("[data-close-inspector]"))n.addEventListener("click",()=>n.closest(".inspector")?.classList.remove("is-open"));document.addEventListener("keydown",n=>{const s=n.target;s instanceof HTMLElement&&["INPUT","TEXTAREA","SELECT"].includes(s.tagName)||document.querySelector("dialog[open]")||(n.key==="?"||n.key==="h"&&!n.ctrlKey&&!n.metaKey?e&&!e.open&&e.showModal():n.key==="Escape"&&document.querySelectorAll(".rail.is-open, .inspector.is-open").forEach(r=>r.classList.remove("is-open")))}),window.addEventListener("beforeunload",n=>{this.devices.isDemo||(n.preventDefault(),n.returnValue=""),this.saveUi()}),window.addEventListener("pagehide",()=>{this.saveUi()})}onLink(t){const e=document.getElementById("linkChip"),n=document.getElementById("linkLabel"),s=document.getElementById("connectLabel"),r=document.getElementById("statusMode");if(e&&(e.dataset.state=t.busy?"busy":t.mode==="demo"?"demo":"connected"),n&&(n.textContent=t.busy?"正在连接…":t.mode==="demo"?"演示模式":"已连接"),s&&(s.textContent=t.mode==="demo"?"连接设备":"断开设备"),r){r.classList.toggle("is-connected",t.mode==="serial");const a=r.querySelector("span");a&&(a.textContent=t.mode==="serial"?`真实设备 · ${t.label}`:"演示模式")}t.version!==this.lastLinkVersion&&(this.lastLinkVersion=t.version,this.display?.onDeviceChanged(),t.mode==="serial"?(Re(`已连接 ${t.device.profile.model} · ${t.device.profile.firmware}`,"ok"),this.setHint("设备已连接 · Web Serial 2 Mbaud")):t.error&&(Re(t.error,"error",4500),this.devices.clearError(),this.setHint("演示模式：可规划、预览与学习，不起浮真实硬件")))}async toggleConnection(){if(this.devices.state.busy)return;if(this.devices.isDemo){try{await this.devices.connect()}catch(e){Re(`连接失败：${e instanceof Error?e.message:String(e)}`,"error",6e3)}return}this.display.isFieldActive()&&!window.confirm("声场正在运行。断开设备后阵列会保持最后一帧，可能需要先在设备上急停。确定断开？")||await this.devices.disconnect()}async dispose(){this.display?.dispose(),this.client.dispose(),await this.devices.dispose()}}function qM(){return new YM}const Mu=qM();Kn(document);Mu.boot();window.__UMH_DISPLAY__=Mu;
