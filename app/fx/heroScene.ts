/**
 * heroScene — the WebGL piece behind the hero.
 *
 * A live "power core": a noise-displaced sphere shaded in the logo's blues
 * with moving contour lines, wrapped in a wireframe cage and three orbiting
 * rings (one per "three"), each carrying a bright node like current running
 * down a cable, all inside a slow particle field. It leans toward the
 * pointer and, as the hero scrolls away, swells and turns.
 *
 * This module is the only place the hero imports three.js, and it is loaded
 * with a dynamic import() from HeroCanvas, so three stays out of the first
 * bundle entirely.
 */

import * as THREE from "three";

// Simplex 3D noise — Ian McEwan / Ashima Arts (MIT).
const SNOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vViewPos;
varying float vNoise;
${SNOISE}
void main(){
  vec3 dir=normalize(position);
  float n=snoise(dir*1.3+vec3(0.0,uTime*0.16,uTime*0.11));
  float n2=snoise(dir*3.4-vec3(uTime*0.2));
  vNoise=n;
  vec3 p=position+normal*(n*0.22+n2*0.05)*uAmp;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  vViewPos=mv.xyz;
  gl_Position=projectionMatrix*mv;
}`;

const CORE_FRAG = /* glsl */ `
uniform float uTime;
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uHi;
varying vec3 vViewPos;
varying float vNoise;
void main(){
  // Screen-space derivatives give the true normal of the displaced surface.
  vec3 N=normalize(cross(dFdx(vViewPos),dFdy(vViewPos)));
  vec3 V=normalize(-vViewPos);
  float fres=pow(1.0-max(dot(N,V),0.0),2.4);
  vec3 L=normalize(vec3(-0.45,0.75,0.6));
  float diff=max(dot(N,L),0.0);
  float spec=pow(max(dot(reflect(-L,N),V),0.0),56.0);
  // Contour lines riding the noise field — reads as live circuitry.
  float band=abs(fract(vNoise*4.5+uTime*0.04)-0.5);
  float line=1.0-smoothstep(0.0,0.045,band);
  vec3 col=mix(uDeep,uMid,diff*0.72+0.04);
  col+=uHi*fres*1.05;
  col+=uHi*line*(0.3+fres*0.9);
  col+=vec3(1.0)*spec*0.5;
  gl_FragColor=vec4(col,1.0);
}`;

export type HeroScene = {
  resize: (width: number, height: number) => void;
  /** Pointer position normalised to -1…1 on each axis. */
  setPointer: (x: number, y: number) => void;
  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  setScroll: (progress: number) => void;
  start: () => void;
  stop: () => void;
  renderOnce: () => void;
  dispose: () => void;
};

function radialTexture(inner: string, outer: string) {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHeroScene(canvas: HTMLCanvasElement): HeroScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  // rig: placed by layout + pointer + scroll. Everything hangs off it.
  const rig = new THREE.Group();
  scene.add(rig);

  // ── Halo behind the core ──
  const haloTex = keep(radialTexture("rgba(20,150,235,0.6)", "rgba(10,144,216,0)"));
  const halo = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending })));
  halo.scale.setScalar(8.5);
  halo.renderOrder = -1;
  rig.add(halo);

  // ── Core ──
  const coreUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 1 },
    uDeep: { value: new THREE.Vector3(0.004, 0.035, 0.11) },
    uMid: { value: new THREE.Vector3(0.02, 0.3, 0.62) },
    uHi: { value: new THREE.Vector3(0.25, 0.85, 1.0) },
  };
  const core = new THREE.Mesh(
    keep(new THREE.IcosahedronGeometry(1.3, 40)),
    keep(new THREE.ShaderMaterial({ uniforms: coreUniforms, vertexShader: CORE_VERT, fragmentShader: CORE_FRAG })),
  );
  rig.add(core);

  // ── Wire cage ──
  const cageBase = new THREE.IcosahedronGeometry(1.78, 1);
  const cage = new THREE.LineSegments(
    keep(new THREE.EdgesGeometry(cageBase)),
    keep(new THREE.LineBasicMaterial({ color: 0x40d8ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false })),
  );
  cageBase.dispose();
  rig.add(cage);

  // ── Three rings, each with a travelling node ──
  const nodeTex = keep(radialTexture("rgba(190,240,255,1)", "rgba(64,216,255,0)"));
  const ringMat = keep(new THREE.MeshBasicMaterial({ color: 0x40d8ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
  const nodeMat = keep(new THREE.SpriteMaterial({ map: nodeTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const RINGS = [
    { r: 2.05, tilt: [1.15, 0.2, 0], speed: 0.42 },
    { r: 2.5, tilt: [-0.75, 0.55, 0.3], speed: -0.3 },
    { r: 2.98, tilt: [0.35, -0.9, 0.6], speed: 0.22 },
  ];
  const rings = RINGS.map((cfg, i) => {
    const group = new THREE.Group();
    group.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
    const mesh = new THREE.Mesh(keep(new THREE.TorusGeometry(cfg.r, 0.0075, 6, 220)), ringMat);
    const node = new THREE.Sprite(nodeMat);
    node.scale.setScalar(0.34);
    group.add(mesh, node);
    rig.add(group);
    return { ...cfg, group, node, phase: i * 2.1 };
  });

  // ── Particle field ──
  const COUNT = 1500;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 3.4 + Math.pow(Math.random(), 1.6) * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pointsGeo = keep(new THREE.BufferGeometry());
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    pointsGeo,
    keep(new THREE.PointsMaterial({ map: nodeTex, size: 0.07, sizeAttenuation: true, color: 0x9fdcff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })),
  );
  scene.add(points);

  // ── State ──
  const base = { x: 0, y: 0, s: 1 };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scroll = { v: 0, t: 0 };
  let intro = 0;
  let elapsed = 0;
  let last = 0;
  let raf = 0;
  let running = false;

  const resize = (width: number, height: number) => {
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // World-space size of the view at the rig's depth.
    const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const viewW = viewH * camera.aspect;
    const wide = width >= 900 && camera.aspect > 1.05;
    if (wide) {
      // Desktop: the core sits right of the headline and bleeds off the edge.
      base.x = viewW * 0.25;
      base.y = viewH * 0.02;
      base.s = Math.min(1.08, viewW / 10.5);
    } else {
      // Phones and portrait tablets: centred high, behind the headline.
      base.x = 0;
      base.y = viewH * 0.17;
      base.s = Math.min(0.92, viewW / 4.4);
    }
  };

  const draw = (dt: number) => {
    elapsed += dt;
    const t = elapsed;
    intro = Math.min(1, intro + dt / 2.2);
    const settle = 1 - Math.pow(1 - intro, 3);

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    scroll.v += (scroll.t - scroll.v) * 0.09;
    const s = scroll.v;

    coreUniforms.uTime.value = t;
    coreUniforms.uAmp.value = 1 + (1 - settle) * 1.6 + s * 0.9;

    core.rotation.set(t * 0.07, t * 0.12, 0);
    cage.rotation.set(-t * 0.05, -t * 0.08, t * 0.03);
    rings.forEach((ring) => {
      const a = t * ring.speed + ring.phase;
      ring.node.position.set(Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0);
      ring.group.rotation.z = ring.tilt[2] + t * ring.speed * 0.25;
    });

    rig.position.set(base.x + pointer.x * 0.28, base.y - pointer.y * 0.2 + s * 1.5, 0);
    rig.rotation.set(-pointer.y * 0.22 + s * 0.6, pointer.x * 0.32 + s * 1.1, 0);
    rig.scale.setScalar(base.s * (0.7 + 0.3 * settle) * (1 + s * 0.5));

    points.rotation.set(pointer.y * 0.05, t * 0.018 + pointer.x * 0.08, 0);
    points.position.y = s * 2.2;

    renderer.render(scene, camera);
  };

  const loop = (now: number) => {
    if (!running) return;
    // Clamp the step so a backgrounded tab doesn't jump the animation on return.
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    draw(dt);
    raf = requestAnimationFrame(loop);
  };

  return {
    resize,
    setPointer: (x, y) => { pointer.tx = x; pointer.ty = y; },
    setScroll: (p) => { scroll.t = Math.max(0, Math.min(1, p)); },
    start: () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    stop: () => {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderOnce: () => {
      // A settled still frame for prefers-reduced-motion.
      intro = 1;
      elapsed = 6;
      scroll.v = scroll.t;
      draw(0);
    },
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
