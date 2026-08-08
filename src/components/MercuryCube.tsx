"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* ---------- flow / noise shader strings (verbatim from the original cube) ---------- */
const NOISE = `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}`;

const FLOW = `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
float flowField(vec3 p){
  float t = uTime;
  float n = snoise(p * uFreq + vec3(0.0, 0.0, t * 0.55));
  n += 0.50 * snoise(p * (uFreq * 2.0) + vec3(t * 0.45, 0.0, 0.0));
  n += 0.25 * snoise(p * (uFreq * 4.0) + vec3(0.0, t * 0.9, 0.0));
  return max(n * uAmp, -0.09);
}
vec3 displacePos(vec3 p, vec3 nrm){
  return p + nrm * flowField(p);
}`;

const BEGINNORMAL = `
vec3 objectNormal;
{
  vec3 n0 = normal;
  float eps = 0.02;
  float f0 = flowField(position);
  vec3 grad = vec3(
    flowField(position + vec3(eps, 0.0, 0.0)) - f0,
    flowField(position + vec3(0.0, eps, 0.0)) - f0,
    flowField(position + vec3(0.0, 0.0, eps)) - f0) / eps;
  objectNormal = normalize(n0 - (grad - dot(grad, n0) * n0));
}`;

const BEGINVERTEX = `vec3 transformed = displacePos(position, normal);`;

/* ---------- the four corner drops: text + link + flight style ---------- */
const ITEMS = [
  { id: "tl", k: "УСЛУГИ", s: "разработка", href: "/uslugi", size: 0.45, dur: 1.75, lift: 0.9, spin: 0, wob: 0 },
  { id: "tr", k: "КЕЙСЫ", s: "работы", href: "/keysy", size: 0.36, dur: 1.95, lift: 0.45, spin: 2, wob: 0 },
  { id: "br", k: "КОМАНДА", s: "команда", href: "/team", size: 0.52, dur: 1.43, lift: 0.12, spin: 0, wob: 0.3 },
  { id: "bl", k: "КОНТАКТЫ", s: "связь", href: "/contacts", size: 0.4, dur: 2.2, lift: 1.4, spin: 1, wob: 0.15 },
] as const;

type Drop = {
  id: string;
  size: number;
  dur: number;
  lift: number;
  spin: number;
  wob: number;
  seg0: number;
  start: THREE.Vector3;
  ctrl: THREE.Vector3;
  end: THREE.Vector3;
  side: THREE.Vector3;
  up2: THREE.Vector3;
  prevT: number;
  landed: boolean;
  ft: number;
  card: HTMLElement | null;
};

export default function MercuryCube() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const mount = mountRef.current!;
    if (!sectionRef.current || !mountRef.current) return;

    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = () => mount.clientWidth;
    const H = () => mount.clientHeight;

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvasEl = renderer.domElement;
    canvasEl.style.width = "100%";
    canvasEl.style.height = "100%";
    canvasEl.style.touchAction = "pan-y";
    mount.appendChild(canvasEl);

    const scene = new THREE.Scene();
    {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 512;
      const cx = cv.getContext("2d")!;
      const g = cx.createRadialGradient(256, 215, 40, 256, 256, 380);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.55, "#f7f9fb");
      g.addColorStop(1, "#edf0f4");
      cx.fillStyle = g;
      cx.fillRect(0, 0, 512, 512);
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      scene.background = t;
    }

    const camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
    camera.position.set(0, 0.4, 8.5);

    /* ---------- environment ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    function makeEnv() {
      const cv = document.createElement("canvas");
      cv.width = 4;
      cv.height = 512;
      const cx = cv.getContext("2d")!;
      const g = cx.createLinearGradient(0, 0, 0, 512);
      g.addColorStop(0.0, "#ffffff");
      g.addColorStop(0.5, "#eef1f5");
      g.addColorStop(1.0, "#f4f6f8");
      cx.fillStyle = g;
      cx.fillRect(0, 0, 4, 512);
      const t = new THREE.CanvasTexture(cv);
      t.mapping = THREE.EquirectangularReflectionMapping;
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const envTex = pmrem.fromEquirectangular(makeEnv()).texture;
    scene.environment = envTex;

    /* ---------- controls ---------- */
    const controls = new OrbitControls(camera, canvasEl);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 16;
    controls.enableZoom = false;

    /* ---------- soft cube geometry ---------- */
    function softCube(e: number, size: number, segs: number): THREE.BufferGeometry {
      const r = 2 / e;
      const half = size / 2;
      let g: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1, segs, segs, segs);
      g.deleteAttribute("uv");
      g.deleteAttribute("normal");
      g = mergeVertices(g);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i) * 2;
        const y = pos.getY(i) * 2;
        const z = pos.getZ(i) * 2;
        const n = Math.pow(
          Math.pow(Math.abs(x), r) + Math.pow(Math.abs(y), r) + Math.pow(Math.abs(z), r),
          1 / r
        );
        pos.setXYZ(i, (half * x) / n, (half * y) / n, (half * z) / n);
      }
      g.computeVertexNormals();
      return g;
    }
    const geo = softCube(0.42, 2.6, 96);

    /* ---------- cube material (liquid water-glass shell) ---------- */
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xeef1f5,
      metalness: 0.0,
      roughness: 0.07,
      transmission: 1.0,
      thickness: 0.5,
      ior: 1.35,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      reflectivity: 0.5,
      envMapIntensity: 1.0,
    });

    let shaderRef: { uniforms: Record<string, THREE.IUniform> } | null = null;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uAmp = { value: 0.12 };
      shader.uniforms.uFreq = { value: 0.35 };
      shader.vertexShader = shader.vertexShader
        .replace("#include <beginnormal_vertex>", BEGINNORMAL)
        .replace("#include <begin_vertex>", BEGINVERTEX)
        .replace("void main() {", NOISE + FLOW + "\nvoid main() {");
      shaderRef = shader as unknown as { uniforms: Record<string, THREE.IUniform> };
    };

    const shape = new THREE.Mesh(geo, material);
    shape.scale.setScalar(0.95);
    shape.rotation.z = 0.32;
    scene.add(shape);

    /* ---------- photos under the waves ---------- */
    const salt = Math.random().toString(36).slice(2, 7);
    const PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `https://picsum.photos/seed/${salt}${n}/512`);
    const texLoader = new THREE.TextureLoader();
    const photoMats = PHOTOS.map((u) => {
      const t = texLoader.load(u);
      t.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
    });
    const photoBox = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.95, 1.95), photoMats);
    shape.add(photoBox);

    /* ---------- card backgrounds (random morph) ---------- */
    const rnd = (a: number, b: number) => Math.round(a + Math.random() * (b - a));
    const blobR = () =>
      `${rnd(36, 64)}% ${rnd(36, 64)}% ${rnd(36, 64)}% ${rnd(36, 64)}% / ` +
      `${rnd(36, 64)}% ${rnd(36, 64)}% ${rnd(36, 64)}% ${rnd(36, 64)}%`;

    const cardEls: Record<string, HTMLElement> = {};
    section.querySelectorAll<HTMLElement>("[data-card-id]").forEach((el) => {
      cardEls[el.dataset.cardId as string] = el;
    });
    ITEMS.forEach((it, i) => {
      const card = cardEls[it.id];
      if (!card) return;
      const m = card.querySelector<HTMLElement>(".mc-m");
      if (m) {
        m.style.background =
          `radial-gradient(circle at 32% 28%, rgba(255,255,255,.72), rgba(238,240,244,.42) 38%, ` +
          `rgba(204,210,218,.22) 68%, rgba(134,142,154,.38) 100%), url(${PHOTOS[i]}) center/cover`;
        m.style.setProperty("--r1", blobR());
        m.style.setProperty("--r2", blobR());
        m.style.setProperty("--r3", blobR());
        m.style.setProperty("--md", (7 + Math.random() * 5).toFixed(1) + "s");
      }
    });

    /* ---------- lights ---------- */
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.07);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0x9fb6ff, 0.73);
    rim.position.set(-6, -2, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xffd9b3, 0.33, 40);
    fill.position.set(-4, 3, 5);
    scene.add(fill);
    const ground = new THREE.DirectionalLight(0xffffff, 0.9);
    ground.position.set(0, -6, 3);
    scene.add(ground);

    /* ---------- post-processing ---------- */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.18, 0.5, 0.85);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    /* ---------- drop flight ---------- */
    const PLANE_Z0 = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const _ray = new THREE.Ray();
    const _a = new THREE.Vector3();

    function ndcToWorld(nx: number, ny: number, out: THREE.Vector3) {
      out.set(nx, ny, 0.5).unproject(camera);
      _ray.origin.copy(camera.position);
      _ray.direction.copy(out.sub(camera.position).normalize());
      const hit = _ray.intersectPlane(PLANE_Z0, out);
      return hit ? out : null;
    }
    function bezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, t: number, out: THREE.Vector3) {
      const u = 1 - t;
      out.set(
        u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
        u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
        u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z
      );
      return out;
    }
    function easeInOut(t: number) {
      return t * t * (3 - 2 * t);
    }
    function pathPoint(d: Drop, e: number, out: THREE.Vector3) {
      bezier(d.start, d.ctrl, d.end, e, out);
      if (d.spin) {
        const th = e * d.spin * Math.PI * 2;
        const r = 0.32 * Math.sin(Math.PI * e);
        out.addScaledVector(d.side, Math.cos(th) * r).addScaledVector(d.up2, Math.sin(th) * r);
      }
      return out;
    }

    const dropShaders: { uniforms: Record<string, THREE.IUniform> }[] = [];
    function makeDropMat() {
      const m = new THREE.MeshPhysicalMaterial({
        color: 0xf2f5f8,
        metalness: 0.0,
        roughness: 0.15,
        transmission: 0.9,
        thickness: 0.15,
        ior: 1.33,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.0,
        transparent: true,
        opacity: 1,
      });
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uAmp = { value: 0.02 };
        shader.uniforms.uFreq = { value: 0.3 };
        shader.vertexShader = shader.vertexShader
          .replace("#include <beginnormal_vertex>", BEGINNORMAL)
          .replace("#include <begin_vertex>", BEGINVERTEX)
          .replace("void main() {", NOISE + FLOW + "\nvoid main() {");
        dropShaders.push(shader as unknown as { uniforms: Record<string, THREE.IUniform> });
      };
      return m;
    }

    const SEG = 0.21;
    const TRAIL = 14;
    const GOO_S = 3.6;
    const gooMat = new THREE.MeshPhysicalMaterial({
      color: 0xf2f5f8,
      metalness: 0.0,
      roughness: 0.15,
      transmission: 0.95,
      thickness: 0.4,
      ior: 1.33,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
    });
    const goo = new MarchingCubes(72, gooMat, false, false, 30000);
    goo.scale.setScalar(GOO_S);
    scene.add(goo);
    function addBall(p: THREE.Vector3, R: number) {
      if (R <= 0.001) return;
      const rf = R / (2 * GOO_S);
      goo.addBall(
        p.x / (2 * GOO_S) + 0.5,
        p.y / (2 * GOO_S) + 0.5,
        p.z / (2 * GOO_S) + 0.5,
        rf * rf * (goo.isolation + 12),
        12
      );
    }

    const drops: Drop[] = ITEMS.map((it, i) => ({
      id: it.id,
      size: it.size,
      dur: it.dur,
      lift: it.lift,
      spin: it.spin,
      wob: it.wob,
      seg0: 0.03 + i * 0.24,
      start: new THREE.Vector3(),
      ctrl: new THREE.Vector3(),
      end: new THREE.Vector3(),
      side: new THREE.Vector3(),
      up2: new THREE.Vector3(),
      prevT: 0,
      landed: false,
      ft: 0,
      card: cardEls[it.id] ?? null,
    }));

    function prepDrop(d: Drop) {
      if (!d.card) return false;
      const r = d.card.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = r.left + r.width / 2 + Math.sign(vw / 2 - r.left - r.width / 2) * r.width * 0.32;
      const cy = r.top + r.height / 2 + Math.sign(vh / 2 - r.top - r.height / 2) * r.height * 0.34;
      const nx = (cx / vw) * 2 - 1;
      const ny = -((cy / vh) * 2 - 1);
      const end = ndcToWorld(nx, ny, d.end);
      if (!end) return false;
      _a.copy(end);
      const len = _a.length() || 1;
      d.start.copy(end).multiplyScalar(0.95 / len);
      d.start.y += 0.15;
      d.ctrl.copy(d.start).add(end).multiplyScalar(0.5);
      d.ctrl.addScaledVector(end.clone().normalize(), len * 0.22);
      d.ctrl.y += d.lift;
      _a.copy(end).sub(d.start).normalize();
      d.side.crossVectors(_a, camera.up).normalize();
      d.up2.crossVectors(d.side, _a);
      return true;
    }

    function applyDrop(d: Drop, t: number) {
      if (!prepDrop(d)) return;
      const e = easeInOut(t);
      const phase = Math.sin(Math.PI * Math.min(t / 0.82, 1));
      const melt = t < 0.82 ? 1 : Math.max(1 - (t - 0.82) / 0.18, 0);
      const grow = 0.45 + 0.55 * Math.min(t / 0.14, 1);
      const wb = 1 + d.wob * Math.sin(e * Math.PI * 7) * phase;
      const R = d.size * grow * melt * wb;
      addBall(pathPoint(d, e, _a), R);
      const back = 0.8 * phase;
      if (back > 0.02) {
        for (let k = 1; k <= TRAIL; k++) {
          const f = k / (TRAIL + 1);
          const ek = e - back * f;
          if (ek <= 0.001) break;
          const ripple = 1 + 0.08 * Math.sin(k * 1.7 + clock.elapsedTime * 8);
          addBall(pathPoint(d, ek, _a), R * 0.72 * Math.pow(1 - f, 1.1) * ripple);
        }
      }
    }

    /* ---------- splash satellites ---------- */
    const splashGeo = new THREE.SphereGeometry(1, 12, 10);
    const SPLASH = 28;
    const splashes: { mesh: THREE.Mesh; vel: THREE.Vector3; life: number }[] = [];
    for (let i = 0; i < SPLASH; i++) {
      const m = new THREE.Mesh(splashGeo, makeDropMat());
      m.visible = false;
      m.scale.setScalar(0.05);
      scene.add(m);
      splashes.push({ mesh: m, vel: new THREE.Vector3(), life: 0 });
    }
    let splashIdx = 0;
    function burstSplash(at: THREE.Vector3) {
      for (let i = 0; i < 7; i++) {
        const s = splashes[splashIdx];
        splashIdx = (splashIdx + 1) % SPLASH;
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.4 + Math.random() * 1.6;
        s.vel.set(Math.cos(ang) * spd, 1.2 + Math.random() * 1.4, Math.sin(ang) * spd * 0.6);
        s.mesh.position.copy(at);
        s.mesh.scale.setScalar(0.05 + Math.random() * 0.06);
        s.mesh.visible = true;
        (s.mesh.material as THREE.MeshPhysicalMaterial).opacity = 1;
        s.life = 0.5 + Math.random() * 0.2;
      }
    }
    const GRAV = -6.5;
    function updateSplashes(dt: number) {
      for (const s of splashes) {
        if (s.life <= 0) {
          if (s.mesh.visible) s.mesh.visible = false;
          continue;
        }
        s.life -= dt;
        s.vel.y += GRAV * dt;
        s.mesh.position.addScaledVector(s.vel, dt);
        (s.mesh.material as THREE.MeshPhysicalMaterial).opacity = Math.max(s.life / 0.7, 0);
        if (s.life <= 0) s.mesh.visible = false;
      }
    }

    let gooDirty = false;
    let pulse = 0;
    let prog = 0;
    function updateDrops() {
      let active = 0;
      for (const d of drops) {
        const t = Math.min(Math.max((prog - d.seg0) / SEG, 0), 1);
        if (t >= 0.8 && !d.landed) {
          d.landed = true;
          d.card?.classList.add("shown");
          burstSplash(d.end);
        } else if (t < 0.8 && d.landed) {
          d.landed = false;
          d.card?.classList.remove("shown");
        }
        if ((t > 0) !== (d.prevT > 0)) pulse = Math.max(pulse, 0.85);
        d.prevT = t;
        d.ft = t;
        if (t > 0 && t < 1) active++;
      }
      if (!active && !gooDirty) return;
      goo.reset();
      for (const d of drops) if (d.ft > 0 && d.ft < 1) applyDrop(d, d.ft);
      goo.update();
      gooDirty = active > 0;
    }

    /* ---------- main loop ---------- */
    const clock = new THREE.Clock();
    const BASE_SPIN = 0.26;

    function targetProg() {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(Math.max(-r.top / total, 0), 1);
    }

    if (REDUCED) for (const d of drops) d.card?.classList.add("shown");

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(section);

    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (shaderRef) shaderRef.uniforms.uTime.value = t;

      pulse = Math.max(pulse - dt * 4.0, 0);
      const ps = 0.95 * (1 + pulse * 0.09);
      shape.scale.set(ps, ps, ps);
      shape.rotation.y += BASE_SPIN * dt + pulse * 2.4 * dt;
      shape.rotation.x = Math.sin(t * 0.4) * 0.12;

      prog += (targetProg() - prog) * Math.min(dt * 14, 1);

      if (!REDUCED) updateDrops();
      updateSplashes(dt);
      for (const s of dropShaders) s.uniforms.uTime.value = t;

      controls.update();
      composer.render();
    }
    animate();

    function onResize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
      composer.setSize(W(), H());
      bloom.setSize(W(), H());
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      controls.dispose();
      composer.dispose();
      geo.dispose();
      splashGeo.dispose();
      gooMat.dispose();
      material.dispose();
      photoMats.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
      envTex.dispose();
      renderer.dispose();
      if (canvasEl.parentNode === mount) mount.removeChild(canvasEl);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[160vh] w-full bg-white" aria-label="3D-навигация по разделам">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* goo filter for the liquid splat blobs */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="mc-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" />
          </filter>
        </svg>

        <div ref={mountRef} className="absolute inset-0" />

        {ITEMS.map((c) => (
          <Link key={c.id} href={c.href} data-card-id={c.id} className={`mc-card mc-${c.id}`} aria-label={c.k}>
            <span className="mc-card-inner">
              <span className="mc-splat">
                <span className="mc-grow">
                  <i className="mc-m" />
                </span>
              </span>
              <span className="mc-txt">
                <span className="mc-k">{c.k}</span>
                <span className="mc-s">{c.s}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
