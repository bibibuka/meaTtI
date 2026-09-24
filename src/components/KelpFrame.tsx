/* Ламинарии вдоль нижней кромки страницы. Формы и движение — из прототипа
   public/kelp-frame/ (там же тесты и заметки по дизайну), стили — в
   globals.css под .kelp-scene.

   Прототип был одной SVG-сценой, и качание лопастей внутри неё браузер
   перерисовывал каждый кадр: видеокарта тратила на полосу 17–23 мс при
   бюджете 8 мс на 120 Гц. Теперь каждый куст, лопасть и пузырёк — отдельный
   HTML-элемент со своим маленьким <svg>: их рисуют один раз, а качание —
   transform на готовой картинке, его ведёт видеокарта без перерисовки.
   Кадр прежний: координаты ниже сняты с исходной сцены (viewBox 1440×430),
   а качание повторяет исходное в осях куста — см. <Sway>.

   Рисуется над футером, а футер скрыт на главной, поэтому полоса появляется
   на всех страницах кроме неё. */

"use client";
import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// Сцена прототипа: viewBox 1440×430, основания кустов на y = 425.
const VB_W = 1440;
const VB_H = 430;
const FLOOR = 425;

// Габариты детали (fill-box её <use>) в координатах куста: x, y, w, h.
type Box = [number, number, number, number];

const BOX: Record<string, Box> = {
  "g-a": [-3.026, -57.24, 5.367, 57.24],
  "g-b": [.36, -36.72, 10.785, 36.72],
  "g-base": [-2.88, -1.53, 6.3, 1.89],
  "c-c": [-7.74, -54.18, 9.759, 54.18],
  "c-a": [-17.64, -32.04, 16.74, 32.04],
  "c-b": [.18, -38.88, 13.222, 38.88],
  "c-base": [-3.24, -1.62, 6.66, 1.98],
  "h-b": [-13.32, -50.04, 14.4, 50.04],
  "h-c": [-1.969, -43.02, 5.284, 43.02],
  "h-base": [-2.88, -1.53, 6.3, 1.89],
  "e": [-12.094, -49.68, 24.161, 49.68],
  "e-base": [-3.06, -1.53, 6.66, 1.89],
  "d-a": [-10.44, -39.06, 9.9, 39.06],
  "d-b": [0, -48.42, 4.32, 48.42],
  "d-c": [.72, -34.92, 14.04, 34.92],
  "d-d": [-.262, -34.2, 2.044, 34.2],
  "d-e": [-15.48, -25.74, 15.84, 25.74],
  "d-base": [-2.88, -1.44, 6.3, 1.8],
  "a-c": [-4.285, -64.08, 6.328, 64.08],
  "a-a": [-12.24, -45.18, 12.78, 45.18],
  "a-b": [.54, -35.64, 11.733, 35.64],
  "a-base": [-2.7, -1.62, 5.94, 1.98],
  "i-a": [-11.52, -34.74, 12.78, 34.74],
  "i-c": [.54, -48.96, 12.611, 48.96],
  "i-base": [-2.88, -1.53, 6.3, 1.89],
};

// Куст: x основания, масштаб [sx, sy], фаза качания, детали по порядку
// отрисовки ([id из <defs> без "kelp-", фаза лопасти или без качания]) и
// струйка пузырьков ([номер, cx, cy, r] в координатах куста).
type Slot = {
  x: number;
  s: [number, number];
  motion: "a" | "b" | "c" | "d";
  parts: ([string] | [string, "a" | "b" | "c" | "d" | "e"])[];
  bubbles?: { stream: string; list: [number, number, number, number][] };
};

const REAR: Slot[] = [
  { x: 60, s: [.82, .69], motion: "b", parts: [["g-a", "a"], ["g-b", "b"], ["g-base"]] },
  { x: 238, s: [.88, .83], motion: "c", parts: [["c-c", "c"], ["c-a", "a"], ["c-b", "b"], ["c-base"]] },
  { x: 425, s: [.8, .72], motion: "a", parts: [["h-b", "b"], ["h-c", "c"], ["h-base"]] },
  { x: 575, s: [.9, .78], motion: "d", parts: [["e", "c"], ["e-base"]] },
  { x: 760, s: [.82, .75], motion: "b", parts: [["d-a", "a"], ["d-b", "b"], ["d-c", "c"], ["d-d", "d"], ["d-e", "e"], ["d-base"]] },
  { x: 920, s: [.86, .84], motion: "c", parts: [["a-c", "c"], ["a-a", "a"], ["a-b", "b"], ["a-base"]], bubbles: { stream: "b", list: [[1, 8, -31, 2.5], [2, 13, -26, 3.1], [3, 5, -22, 2]] } },
  { x: 1112, s: [.78, .7], motion: "a", parts: [["i-a", "a"], ["i-c", "c"], ["i-base"]] },
  { x: 1264, s: [.92, .82], motion: "d", parts: [["a-c", "c"], ["a-a", "a"], ["a-b", "b"], ["a-base"]] },
  { x: 1404, s: [.72, .68], motion: "b", parts: [["d-a", "a"], ["d-b", "b"], ["d-c", "c"], ["d-d", "d"], ["d-e", "e"], ["d-base"]] },
];

const FRONT: Slot[] = [
  { x: 12, s: [.9, .86], motion: "a", parts: [["a-c", "c"], ["a-a", "a"], ["a-b", "b"], ["a-base"]], bubbles: { stream: "e", list: [[1, 8, -29, 2.4], [2, 13, -24, 3], [3, 4, -20, 1.9]] } },
  { x: 172, s: [.94, .96], motion: "d", parts: [["g-a", "a"], ["g-b", "b"], ["g-base"]], bubbles: { stream: "f", list: [[1, 6, -30, 2.2], [2, 12, -25, 2.8], [3, 2, -21, 1.8], [4, 16, -18, 1.6]] } },
  { x: 312, s: [.9, .82], motion: "b", parts: [["d-a", "a"], ["d-b", "b"], ["d-c", "c"], ["d-d", "d"], ["d-e", "e"], ["d-base"]] },
  { x: 515, s: [.94, .92], motion: "c", parts: [["h-b", "b"], ["h-c", "c"], ["h-base"]], bubbles: { stream: "d", list: [[1, 7, -28, 2.5], [2, 12, -23, 3], [3, 3, -19, 1.8]] } },
  { x: 642, s: [.95, 1], motion: "a", parts: [["a-c", "c"], ["a-a", "a"], ["a-b", "b"], ["a-base"]], bubbles: { stream: "a", list: [[1, 7, -32, 2.6], [2, 14, -26, 3.2], [3, 3, -22, 1.9]] } },
  { x: 827, s: [.96, .9], motion: "d", parts: [["i-a", "a"], ["i-c", "c"], ["i-base"]] },
  { x: 972, s: [.92, .86], motion: "b", parts: [["g-a", "a"], ["g-b", "b"], ["g-base"]] },
  { x: 1156, s: [.96, .98], motion: "c", parts: [["h-b", "b"], ["h-c", "c"], ["h-base"]] },
  { x: 1302, s: [.9, .88], motion: "a", parts: [["i-a", "a"], ["i-c", "c"], ["i-base"]], bubbles: { stream: "c", list: [[1, 7, -30, 2.3], [2, 13, -25, 2.9], [3, 3, -21, 1.8]] } },
  { x: 1428, s: [.86, .94], motion: "d", parts: [["a-c", "c"], ["a-a", "a"], ["a-b", "b"], ["a-base"]] },
];

const pct = (v: number, of: number) => `${+((v / of) * 100).toFixed(4)}%`;
const scale = ([sx, sy]: [number, number]) => `scale(${sx}, ${sy})`;
const unscale = ([sx, sy]: [number, number]) => `scale(${+(1 / sx).toFixed(5)}, ${+(1 / sy).toFixed(5)})`;

// Качание лопасти и куста шло в SVG в сплюснутых масштабом куста S осях.
// Здесь оно собрано из трёх коробок одного размера: снаружи статичный
// scale(S), в середине анимация (общие keyframes, без переменных — такие
// Chrome пересчитывает на кадре дешевле всего), внутри scale(S⁻¹). Итог —
// S·движение·S⁻¹, как было, а сама деталь нарисована уже в экранных осях.
function Sway({
  box,
  s,
  className,
  children,
}: {
  box: CSSProperties;
  s: [number, number];
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="kelp-sway" style={{ ...box, transform: scale(s) }}>
      <div className={className}>
        <div className="kelp-unscale" style={{ transform: unscale(s) }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Bush({ slot }: { slot: Slot }) {
  const [sx, sy] = slot.s;
  const boxes = slot.parts.map(([id]) => BOX[id]);
  const x0 = Math.min(...boxes.map((b) => b[0]));
  const y0 = Math.min(...boxes.map((b) => b[1]));
  const w = Math.max(...boxes.map((b) => b[0] + b[2])) - x0;
  const h = Math.max(...boxes.map((b) => b[1] + b[3])) - y0;

  return (
    <Sway
      className={`kelp-motion motion--${slot.motion}`}
      s={slot.s}
      box={{
        left: pct(slot.x + sx * x0, VB_W),
        top: pct(FLOOR + sy * y0, VB_H),
        width: pct(sx * w, VB_W),
        height: pct(sy * h, VB_H),
      }}
    >
      {slot.parts.map(([id, frond]) => {
        const [x, y, bw, bh] = BOX[id];
        const box = { left: pct(x - x0, w), top: pct(y - y0, h), width: pct(bw, w), height: pct(bh, h) };
        // viewBox с preserveAspectRatio="none" сам растягивает деталь на
        // sx×sy, а non-scaling-stroke держит обводку той же толщины.
        const art = (
          <svg
            className="kelp-part"
            viewBox={`${x} ${y} ${bw} ${bh}`}
            preserveAspectRatio="none"
            focusable="false"
            style={frond ? undefined : box}
          >
            <use href={`#kelp-${id}`} />
          </svg>
        );
        return frond ? (
          <Sway key={id} className={`frond frond--${frond}`} s={slot.s} box={box}>
            {art}
          </Sway>
        ) : (
          <Fragment key={id}>{art}</Fragment>
        );
      })}
    </Sway>
  );
}

function Bubbles({ slot }: { slot: Slot }) {
  if (!slot.bubbles) return null;
  const [sx, sy] = slot.s;
  return (
    <div className={`bubble-stream bubble-stream--${slot.bubbles.stream}`}>
      {slot.bubbles.list.map(([n, cx, cy, r]) => (
        <Sway
          key={n}
          className={`kelp-bubble bubble--${n}`}
          s={slot.s}
          box={{
            left: pct(slot.x + sx * (cx - r), VB_W),
            top: pct(FLOOR + sy * (cy - r), VB_H),
            width: pct(2 * r * sx, VB_W),
            height: pct(2 * r * sy, VB_H),
          }}
        >
          <svg
            className="kelp-part"
            viewBox={`${cx - r} ${cy - r} ${2 * r} ${2 * r}`}
            preserveAspectRatio="none"
            focusable="false"
          >
            <circle cx={cx} cy={cy} r={r} vectorEffect="non-scaling-stroke" />
          </svg>
        </Sway>
      ))}
    </div>
  );
}

function Layer({ slots, className }: { slots: Slot[]; className: string }) {
  return (
    <div className={`kelp-layer ${className}`}>
      {slots.map((slot) => (
        <Fragment key={slot.x}>
          <Bush slot={slot} />
          <Bubbles slot={slot} />
        </Fragment>
      ))}
    </div>
  );
}

export default function KelpFrame({
  className = "",
  transparentBlades = false,
}: {
  className?: string;
  transparentBlades?: boolean;
}) {
  const bladeFill = transparentBlades ? "none" : "#ffffff";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Бесконечная CSS-анимация на каждом круге шлёт animationiteration, а React
    // слушает это событие на всём документе. Из-за этого браузер будил главный
    // поток ~20 раз в секунду и заодно пересчитывал все 90 деталей. Анимации
    // Web Animations таких событий не шлют: пересоздаём каждую из CSS-анимации
    // (те же keyframes и тайминг, та же фаза — кадр не дёргается), а сами
    // CSS-анимации снимает класс .kelp-live. До гидратации работают CSS.
    const live = el
      .getAnimations({ subtree: true })
      .filter((a): a is CSSAnimation => a instanceof CSSAnimation)
      .map((css) => {
        const effect = css.effect as KeyframeEffect;
        const anim = new Animation(
          new KeyframeEffect(effect.target, effect.getKeyframes(), effect.getTiming()),
          document.timeline,
        );
        anim.currentTime = css.currentTime;
        anim.play();
        return anim;
      });
    el.classList.add("kelp-live");

    // Сотню слоёв ламинарий видеокарта рисует разом, как только полоса
    // оказывается рядом с экраном, — на компьютере это рывок в 40–70 мс в
    // начале первой прокрутки. Пока страница только открылась и никто не
    // листает, на три кадра выставляем полосу в экран почти прозрачной
    // (.kelp-prewarm): слои отрисуются заранее и останутся в кэше.
    let prewarm = 0;
    if (live.length && el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("kelp-prewarm");
      let frames = 3;
      const step = () => {
        frames -= 1;
        if (frames > 0) prewarm = requestAnimationFrame(step);
        else el.classList.remove("kelp-prewarm");
      };
      prewarm = requestAnimationFrame(step);
    }

    // Пауза, если полоса за экраном ИЛИ вкладка скрыта. Раньше возврат на
    // вкладку снимал паузу, даже когда полоса была далеко за экраном.
    let offscreen = false;
    const sync = () => {
      const pause = offscreen || document.hidden;
      live.forEach((a) => (pause ? a.pause() : a.play()));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        offscreen = !e.isIntersecting;
        sync();
      },
      { threshold: 0, rootMargin: "100px" }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(prewarm);
      live.forEach((a) => a.cancel());
      el.classList.remove("kelp-live", "kelp-prewarm");
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`kelp-strip ${className}`}
      aria-hidden="true"
    >
      <div className="kelp-scene">
        {/* Формы кустов живут здесь, каждая деталь ссылается на них через <use>. */}
        <svg className="kelp-defs" focusable="false">
          <defs>
            {/* Заливки и толщины заданы presentation-атрибутами, а не CSS:
               клоны <use> не матчатся правилами вида ".kelp-scene .grass",
               поэтому fill:none из CSS до них не доезжал и открытые пути
               травы/стеблей заливались дефолтным чёрным. Атрибуты клонируются
               всегда. Цвет контура НЕ задаём — он наследуется от слоя. */}
            <g id="kelp-a-c" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -7 0 C -20 -61 -4 -111 -19 -170 C -34 -231 -8 -291 -20 -356 C 10 -326 18 -269 6 -211 C -6 -153 17 -88 8 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 1 -8 C -5 -90 6 -166 -2 -246 C -6 -288 0 -321 -5 -344" />
            </g>
            <g id="kelp-a-a" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -8 0 C -34 -43 -57 -94 -44 -151 C -36 -188 -54 -224 -68 -251 C -29 -230 -12 -190 -17 -146 C -23 -94 -4 -50 3 0 Z"
              />
            </g>
            <g id="kelp-a-b" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M 3 0 C 15 -40 42 -74 37 -120 C 34 -151 49 -178 67 -198 C 72 -158 60 -124 53 -94 C 45 -59 29 -26 12 0 Z"
              />
            </g>
            <g id="kelp-a-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -15 1 Q -9 -14 -2 0 Q 4 -18 9 0 Q 14 -12 18 2" />
            </g>

            <g id="kelp-c-c" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -7 0 C -3 -58 -28 -111 -16 -169 C -5 -220 -27 -263 -43 -301 C -2 -277 15 -233 6 -184 C -4 -126 18 -65 9 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 1 -8 C -4 -67 -7 -126 -3 -180 C 1 -225 -13 -263 -34 -290" />
            </g>
            <g id="kelp-c-a" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -5 0 C -33 -34 -58 -66 -59 -108 C -60 -139 -79 -162 -98 -178 C -88 -137 -73 -106 -63 -78 C -52 -43 -30 -19 -14 0 Z"
              />
            </g>
            <g id="kelp-c-b" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M 1 0 C 17 -41 47 -77 41 -124 C 37 -160 54 -193 73 -216 C 79 -171 65 -135 57 -101 C 48 -61 30 -26 12 0 Z"
              />
            </g>
            <g id="kelp-c-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -18 2 Q -12 -14 -4 0 Q 2 -18 8 0 Q 13 -11 19 2" />
            </g>

            <g id="kelp-d-a" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="grass" vectorEffect="non-scaling-stroke" d="M -3 0 C -38 -72 -16 -139 -58 -217" />
            </g>
            <g id="kelp-d-b" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="grass" vectorEffect="non-scaling-stroke" d="M 0 0 C 23 -93 -11 -165 24 -269" />
            </g>
            <g id="kelp-d-c" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="grass" vectorEffect="non-scaling-stroke" d="M 4 0 C 56 -65 34 -130 82 -194" />
            </g>
            <g id="kelp-d-d" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="grass" vectorEffect="non-scaling-stroke" d="M -1 0 C -5 -73 19 -121 6 -190" />
            </g>
            <g id="kelp-d-e" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="grass" vectorEffect="non-scaling-stroke" d="M 2 0 C -49 -49 -42 -105 -86 -143" />
            </g>
            <g id="kelp-d-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -16 2 Q -10 -12 -3 0 Q 3 -16 8 0 Q 14 -10 19 2" />
            </g>

            <g id="kelp-e" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="stem" vectorEffect="non-scaling-stroke" d="M 0 0 C -15 -79 18 -150 -6 -251" />
              <path className="leaf" fill={bladeFill} vectorEffect="non-scaling-stroke" d="M -10 -181 C -39 -187 -51 -207 -44 -232 C -17 -226 -3 -207 -10 -181 Z" />
              <path className="leaf" fill={bladeFill} vectorEffect="non-scaling-stroke" d="M 0 -216 C 25 -229 38 -252 29 -276 C 4 -264 -7 -241 0 -216 Z" />
              <path className="stem" vectorEffect="non-scaling-stroke" d="M -4 -65 C -41 -87 -55 -111 -61 -142" />
              <path className="leaf" fill={bladeFill} vectorEffect="non-scaling-stroke" d="M -25 -83 C -55 -82 -69 -100 -67 -126 C -41 -127 -25 -111 -25 -83 Z" />
              <path className="stem" vectorEffect="non-scaling-stroke" d="M 2 -105 C 38 -127 51 -153 56 -184" />
              <path className="leaf" fill={bladeFill} vectorEffect="non-scaling-stroke" d="M 21 -121 C 50 -122 68 -140 67 -166 C 40 -167 22 -150 21 -121 Z" />
            </g>
            <g id="kelp-e-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -17 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 20 2" />
            </g>

            <g id="kelp-g-a" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -5 0 C -16 -55 -2 -103 -13 -155 C -25 -210 -4 -260 -13 -318 C 14 -288 18 -239 8 -190 C -2 -137 15 -72 7 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 1 -7 C -5 -75 5 -137 -3 -205 C -6 -247 0 -279 -3 -308" />
            </g>
            <g id="kelp-g-b" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M 2 0 C 14 -38 37 -72 33 -113 C 30 -145 44 -177 60 -204 C 67 -163 53 -128 47 -98 C 40 -59 24 -25 11 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 8 -6 C 25 -55 38 -105 49 -149 C 53 -168 56 -185 58 -197" />
            </g>
            <g id="kelp-g-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
            </g>

            <g id="kelp-h-b" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -4 0 C -32 -47 -55 -98 -46 -151 C -39 -198 -57 -240 -74 -278 C -32 -254 -10 -207 -16 -157 C -22 -104 -3 -53 6 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M -5 -5 C -28 -57 -34 -113 -37 -161 C -41 -209 -55 -247 -68 -269" />
            </g>
            <g id="kelp-h-c" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M 0 0 C -10 -46 2 -91 -8 -137 C -17 -177 -2 -207 -7 -239 C 17 -218 24 -179 14 -142 C 4 -100 16 -49 8 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 3 -5 C 2 -61 7 -110 3 -156 C 0 -187 5 -213 4 -230" />
            </g>
            <g id="kelp-h-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
            </g>

            <g id="kelp-i-a" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M -2 0 C -21 -35 -41 -68 -37 -110 C -34 -143 -48 -170 -64 -193 C -30 -181 -10 -149 -14 -111 C -18 -69 1 -36 7 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M -3 -4 C -21 -48 -26 -93 -31 -130 C -36 -160 -47 -180 -57 -189" />
            </g>
            <g id="kelp-i-c" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path
                className="blade"
                fill={bladeFill}
                vectorEffect="non-scaling-stroke"
                d="M 3 0 C 20 -49 42 -90 37 -141 C 32 -190 53 -235 72 -272 C 77 -231 63 -193 57 -153 C 50 -98 30 -45 12 0 Z"
              />
              <path className="vein" strokeWidth="0.575" opacity="0.62" vectorEffect="non-scaling-stroke" d="M 6 -6 C 27 -59 36 -117 45 -165 C 53 -207 62 -241 68 -265" />
            </g>
            <g id="kelp-i-base" transform="scale(.18)" fill="none" strokeWidth="1.075" strokeLinecap="round" strokeLinejoin="round">
              <path className="holdfast" vectorEffect="non-scaling-stroke" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
            </g>
          </defs>
        </svg>

        <Layer slots={REAR} className="kelp-layer--rear" />
        <svg className="kelp-seabed" viewBox="0 0 1440 430" preserveAspectRatio="none" focusable="false">
          <path
            className="seabed-line seabed-line--rear"
            d="M -30 423 C 80 411 146 432 260 421 C 378 409 452 434 565 420 C 688 406 752 432 873 420 C 997 408 1068 433 1180 420 C 1290 408 1362 430 1470 417"
          />
        </svg>
        <Layer slots={FRONT} className="kelp-layer--front" />
        <svg className="kelp-seabed" viewBox="0 0 1440 430" preserveAspectRatio="none" focusable="false">
          <path
            className="seabed-line seabed-line--front"
            d="M -30 427 C 85 414 165 437 282 424 C 393 411 478 437 592 423 C 705 410 788 438 906 423 C 1027 408 1106 438 1222 423 C 1328 410 1390 430 1470 421"
          />
        </svg>
      </div>
    </div>
  );
}
