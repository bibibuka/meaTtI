/* Ламинарии вдоль нижней кромки страницы. Разметка — дословный перенос
   прототипа из public/kelp-frame/ (там же тесты и заметки по дизайну):
   чистые SVG + CSS, без JS. Стили лежат в globals.css под .kelp-scene,
   размер полосы задаётся её высотой — см. комментарий у .kelp-strip.

   Рисуется над футером, а футер скрыт на главной, поэтому полоса появляется
   на всех страницах кроме неё. Своего фона у полосы нет: она отрицательным
   отступом ложится на низ самой страницы — см. .kelp-strip в globals.css. */

export default function KelpFrame({ className = "" }: { className?: string }) {
  return (
    <div className={`kelp-strip ${className}`} aria-hidden="true">
      <svg
        className="kelp-scene"
        viewBox="0 0 1440 430"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <g id="kelp-a-c" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -7 0 C -20 -61 -4 -111 -19 -170 C -34 -231 -8 -291 -20 -356 C 10 -326 18 -269 6 -211 C -6 -153 17 -88 8 0 Z"
            />
            <path className="vein" d="M 1 -8 C -5 -90 6 -166 -2 -246 C -6 -288 0 -321 -5 -344" />
          </g>
          <g id="kelp-a-a" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -8 0 C -34 -43 -57 -94 -44 -151 C -36 -188 -54 -224 -68 -251 C -29 -230 -12 -190 -17 -146 C -23 -94 -4 -50 3 0 Z"
            />
          </g>
          <g id="kelp-a-b" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M 3 0 C 15 -40 42 -74 37 -120 C 34 -151 49 -178 67 -198 C 72 -158 60 -124 53 -94 C 45 -59 29 -26 12 0 Z"
            />
          </g>
          <g id="kelp-a-base" transform="scale(.18)">
            <path className="holdfast" d="M -15 1 Q -9 -14 -2 0 Q 4 -18 9 0 Q 14 -12 18 2" />
          </g>

          <g id="kelp-c-c" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -7 0 C -3 -58 -28 -111 -16 -169 C -5 -220 -27 -263 -43 -301 C -2 -277 15 -233 6 -184 C -4 -126 18 -65 9 0 Z"
            />
            <path className="vein" d="M 1 -8 C -4 -67 -7 -126 -3 -180 C 1 -225 -13 -263 -34 -290" />
          </g>
          <g id="kelp-c-a" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -5 0 C -33 -34 -58 -66 -59 -108 C -60 -139 -79 -162 -98 -178 C -88 -137 -73 -106 -63 -78 C -52 -43 -30 -19 -14 0 Z"
            />
          </g>
          <g id="kelp-c-b" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M 1 0 C 17 -41 47 -77 41 -124 C 37 -160 54 -193 73 -216 C 79 -171 65 -135 57 -101 C 48 -61 30 -26 12 0 Z"
            />
          </g>
          <g id="kelp-c-base" transform="scale(.18)">
            <path className="holdfast" d="M -18 2 Q -12 -14 -4 0 Q 2 -18 8 0 Q 13 -11 19 2" />
          </g>

          <g id="kelp-d-a" transform="scale(.18)">
            <path className="grass" d="M -3 0 C -38 -72 -16 -139 -58 -217" />
          </g>
          <g id="kelp-d-b" transform="scale(.18)">
            <path className="grass" d="M 0 0 C 23 -93 -11 -165 24 -269" />
          </g>
          <g id="kelp-d-c" transform="scale(.18)">
            <path className="grass" d="M 4 0 C 56 -65 34 -130 82 -194" />
          </g>
          <g id="kelp-d-d" transform="scale(.18)">
            <path className="grass" d="M -1 0 C -5 -73 19 -121 6 -190" />
          </g>
          <g id="kelp-d-e" transform="scale(.18)">
            <path className="grass" d="M 2 0 C -49 -49 -42 -105 -86 -143" />
          </g>
          <g id="kelp-d-base" transform="scale(.18)">
            <path className="holdfast" d="M -16 2 Q -10 -12 -3 0 Q 3 -16 8 0 Q 14 -10 19 2" />
          </g>

          <g id="kelp-e-left" transform="scale(.18)">
            <path className="stem" d="M -4 -65 C -41 -87 -55 -111 -61 -142" />
            <path className="leaf" fill="#ffffff" d="M -25 -83 C -55 -82 -69 -100 -67 -126 C -41 -127 -25 -111 -25 -83 Z" />
          </g>
          <g id="kelp-e-right" transform="scale(.18)">
            <path className="stem" d="M 2 -105 C 38 -127 51 -153 56 -184" />
            <path className="leaf" fill="#ffffff" d="M 21 -121 C 50 -122 68 -140 67 -166 C 40 -167 22 -150 21 -121 Z" />
          </g>
          <g id="kelp-e-main" transform="scale(.18)">
            <path className="stem" d="M 0 0 C -15 -79 18 -150 -6 -251" />
            <path className="leaf" fill="#ffffff" d="M -10 -181 C -39 -187 -51 -207 -44 -232 C -17 -226 -3 -207 -10 -181 Z" />
            <path className="leaf" fill="#ffffff" d="M 0 -216 C 25 -229 38 -252 29 -276 C 4 -264 -7 -241 0 -216 Z" />
          </g>
          <g id="kelp-e-base" transform="scale(.18)">
            <path className="holdfast" d="M -17 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 20 2" />
          </g>

          <g id="kelp-g-a" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -5 0 C -16 -55 -2 -103 -13 -155 C -25 -210 -4 -260 -13 -318 C 14 -288 18 -239 8 -190 C -2 -137 15 -72 7 0 Z"
            />
            <path className="vein" d="M 1 -7 C -5 -75 5 -137 -3 -205 C -6 -247 0 -279 -3 -308" />
          </g>
          <g id="kelp-g-b" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M 2 0 C 14 -38 37 -72 33 -113 C 30 -145 44 -177 60 -204 C 67 -163 53 -128 47 -98 C 40 -59 24 -25 11 0 Z"
            />
            <path className="vein" d="M 8 -6 C 25 -55 38 -105 49 -149 C 53 -168 56 -185 58 -197" />
          </g>
          <g id="kelp-g-base" transform="scale(.18)">
            <path className="holdfast" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
          </g>

          <g id="kelp-h-b" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -4 0 C -32 -47 -55 -98 -46 -151 C -39 -198 -57 -240 -74 -278 C -32 -254 -10 -207 -16 -157 C -22 -104 -3 -53 6 0 Z"
            />
            <path className="vein" d="M -5 -5 C -28 -57 -34 -113 -37 -161 C -41 -209 -55 -247 -68 -269" />
          </g>
          <g id="kelp-h-c" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M 0 0 C -10 -46 2 -91 -8 -137 C -17 -177 -2 -207 -7 -239 C 17 -218 24 -179 14 -142 C 4 -100 16 -49 8 0 Z"
            />
            <path className="vein" d="M 3 -5 C 2 -61 7 -110 3 -156 C 0 -187 5 -213 4 -230" />
          </g>
          <g id="kelp-h-base" transform="scale(.18)">
            <path className="holdfast" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
          </g>

          <g id="kelp-i-a" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M -2 0 C -21 -35 -41 -68 -37 -110 C -34 -143 -48 -170 -64 -193 C -30 -181 -10 -149 -14 -111 C -18 -69 1 -36 7 0 Z"
            />
            <path className="vein" d="M -3 -4 C -21 -48 -26 -93 -31 -130 C -36 -160 -47 -180 -57 -189" />
          </g>
          <g id="kelp-i-c" transform="scale(.18)">
            <path
              className="blade"
              fill="#ffffff"
              d="M 3 0 C 20 -49 42 -90 37 -141 C 32 -190 53 -235 72 -272 C 77 -231 63 -193 57 -153 C 50 -98 30 -45 12 0 Z"
            />
            <path className="vein" d="M 6 -6 C 27 -59 36 -117 45 -165 C 53 -207 62 -241 68 -265" />
          </g>
          <g id="kelp-i-base" transform="scale(.18)">
            <path className="holdfast" d="M -16 2 Q -10 -13 -3 0 Q 3 -17 9 0 Q 14 -11 19 2" />
          </g>
        </defs>

        <g className="kelp-layer kelp-layer--rear">
          <g className="kelp-slot" transform="translate(60 425) scale(.82 .69)">
            <g className="kelp-motion motion--b" data-kelp="kelp-g">
              <use className="frond frond--a" href="#kelp-g-a" />
              <use className="frond frond--b" href="#kelp-g-b" />
              <use href="#kelp-g-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(238 425) scale(.88 .83)">
            <g className="kelp-motion motion--c" data-kelp="kelp-c">
              <use className="frond frond--c" href="#kelp-c-c" />
              <use className="frond frond--a" href="#kelp-c-a" />
              <use className="frond frond--b" href="#kelp-c-b" />
              <use href="#kelp-c-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(425 425) scale(.8 .72)">
            <g className="kelp-motion motion--a" data-kelp="kelp-h">
              <use className="frond frond--b" href="#kelp-h-b" />
              <use className="frond frond--c" href="#kelp-h-c" />
              <use href="#kelp-h-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(575 425) scale(.9 .78)">
            <g className="kelp-motion motion--d" data-kelp="kelp-e">
              <use className="frond frond--a frond--branch-left" href="#kelp-e-left" />
              <use className="frond frond--b frond--branch-right" href="#kelp-e-right" />
              <use className="frond frond--c" href="#kelp-e-main" />
              <use href="#kelp-e-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(760 425) scale(.82 .75)">
            <g className="kelp-motion motion--b" data-kelp="kelp-d">
              <use className="frond frond--a" href="#kelp-d-a" />
              <use className="frond frond--b" href="#kelp-d-b" />
              <use className="frond frond--c" href="#kelp-d-c" />
              <use className="frond frond--d" href="#kelp-d-d" />
              <use className="frond frond--e" href="#kelp-d-e" />
              <use href="#kelp-d-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(920 425) scale(.86 .84)">
            <g className="kelp-motion motion--c" data-kelp="kelp-a">
              <use className="frond frond--c" href="#kelp-a-c" />
              <use className="frond frond--a" href="#kelp-a-a" />
              <use className="frond frond--b" href="#kelp-a-b" />
              <use href="#kelp-a-base" />
            </g>
            <g className="bubble-stream bubble-stream--b">
              <circle className="kelp-bubble bubble--1" cx="8" cy="-31" r="2.5" />
              <circle className="kelp-bubble bubble--2" cx="13" cy="-26" r="3.1" />
              <circle className="kelp-bubble bubble--3" cx="5" cy="-22" r="2" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1112 425) scale(.78 .7)">
            <g className="kelp-motion motion--a" data-kelp="kelp-i">
              <use className="frond frond--a" href="#kelp-i-a" />
              <use className="frond frond--c" href="#kelp-i-c" />
              <use href="#kelp-i-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1264 425) scale(.92 .82)">
            <g className="kelp-motion motion--d" data-kelp="kelp-a">
              <use className="frond frond--c" href="#kelp-a-c" />
              <use className="frond frond--a" href="#kelp-a-a" />
              <use className="frond frond--b" href="#kelp-a-b" />
              <use href="#kelp-a-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1404 425) scale(.72 .68)">
            <g className="kelp-motion motion--b" data-kelp="kelp-d">
              <use className="frond frond--a" href="#kelp-d-a" />
              <use className="frond frond--b" href="#kelp-d-b" />
              <use className="frond frond--c" href="#kelp-d-c" />
              <use className="frond frond--d" href="#kelp-d-d" />
              <use className="frond frond--e" href="#kelp-d-e" />
              <use href="#kelp-d-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
        </g>

        <path
          className="seabed-line seabed-line--rear"
          d="M -30 423 C 80 411 146 432 260 421 C 378 409 452 434 565 420 C 688 406 752 432 873 420 C 997 408 1068 433 1180 420 C 1290 408 1362 430 1470 417"
        />

        <g className="kelp-layer kelp-layer--front">
          <g className="kelp-slot" transform="translate(12 425) scale(.9 .86)">
            <g className="kelp-motion motion--a" data-kelp="kelp-a">
              <use className="frond frond--c" href="#kelp-a-c" />
              <use className="frond frond--a" href="#kelp-a-a" />
              <use className="frond frond--b" href="#kelp-a-b" />
              <use href="#kelp-a-base" />
            </g>
            <g className="bubble-stream bubble-stream--e">
              <circle className="kelp-bubble bubble--1" cx="8" cy="-29" r="2.4" />
              <circle className="kelp-bubble bubble--2" cx="13" cy="-24" r="3" />
              <circle className="kelp-bubble bubble--3" cx="4" cy="-20" r="1.9" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(172 425) scale(.94 .96)">
            <g className="kelp-motion motion--d" data-kelp="kelp-g">
              <use className="frond frond--a" href="#kelp-g-a" />
              <use className="frond frond--b" href="#kelp-g-b" />
              <use href="#kelp-g-base" />
            </g>
            <g className="bubble-stream bubble-stream--f">
              <circle className="kelp-bubble bubble--1" cx="6" cy="-30" r="2.2" />
              <circle className="kelp-bubble bubble--2" cx="12" cy="-25" r="2.8" />
              <circle className="kelp-bubble bubble--3" cx="2" cy="-21" r="1.8" />
              <circle className="kelp-bubble bubble--4" cx="16" cy="-18" r="1.6" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(312 425) scale(.9 .82)">
            <g className="kelp-motion motion--b" data-kelp="kelp-d">
              <use className="frond frond--a" href="#kelp-d-a" />
              <use className="frond frond--b" href="#kelp-d-b" />
              <use className="frond frond--c" href="#kelp-d-c" />
              <use className="frond frond--d" href="#kelp-d-d" />
              <use className="frond frond--e" href="#kelp-d-e" />
              <use href="#kelp-d-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(515 425) scale(.94 .92)">
            <g className="kelp-motion motion--c" data-kelp="kelp-h">
              <use className="frond frond--b" href="#kelp-h-b" />
              <use className="frond frond--c" href="#kelp-h-c" />
              <use href="#kelp-h-base" />
            </g>
            <g className="bubble-stream bubble-stream--d">
              <circle className="kelp-bubble bubble--1" cx="7" cy="-28" r="2.5" />
              <circle className="kelp-bubble bubble--2" cx="12" cy="-23" r="3" />
              <circle className="kelp-bubble bubble--3" cx="3" cy="-19" r="1.8" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(642 425) scale(.95 1)">
            <g className="kelp-motion motion--a" data-kelp="kelp-a">
              <use className="frond frond--c" href="#kelp-a-c" />
              <use className="frond frond--a" href="#kelp-a-a" />
              <use className="frond frond--b" href="#kelp-a-b" />
              <use href="#kelp-a-base" />
            </g>
            <g className="bubble-stream bubble-stream--a">
              <circle className="kelp-bubble bubble--1" cx="7" cy="-32" r="2.6" />
              <circle className="kelp-bubble bubble--2" cx="14" cy="-26" r="3.2" />
              <circle className="kelp-bubble bubble--3" cx="3" cy="-22" r="1.9" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(827 425) scale(.96 .9)">
            <g className="kelp-motion motion--d" data-kelp="kelp-i">
              <use className="frond frond--a" href="#kelp-i-a" />
              <use className="frond frond--c" href="#kelp-i-c" />
              <use href="#kelp-i-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(972 425) scale(.92 .86)">
            <g className="kelp-motion motion--b" data-kelp="kelp-g">
              <use className="frond frond--a" href="#kelp-g-a" />
              <use className="frond frond--b" href="#kelp-g-b" />
              <use href="#kelp-g-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1156 425) scale(.96 .98)">
            <g className="kelp-motion motion--c" data-kelp="kelp-h">
              <use className="frond frond--b" href="#kelp-h-b" />
              <use className="frond frond--c" href="#kelp-h-c" />
              <use href="#kelp-h-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1302 425) scale(.9 .88)">
            <g className="kelp-motion motion--a" data-kelp="kelp-i">
              <use className="frond frond--a" href="#kelp-i-a" />
              <use className="frond frond--c" href="#kelp-i-c" />
              <use href="#kelp-i-base" />
            </g>
            <g className="bubble-stream bubble-stream--c">
              <circle className="kelp-bubble bubble--1" cx="7" cy="-30" r="2.3" />
              <circle className="kelp-bubble bubble--2" cx="13" cy="-25" r="2.9" />
              <circle className="kelp-bubble bubble--3" cx="3" cy="-21" r="1.8" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
          <g className="kelp-slot" transform="translate(1428 425) scale(.86 .94)">
            <g className="kelp-motion motion--d" data-kelp="kelp-a">
              <use className="frond frond--c" href="#kelp-a-c" />
              <use className="frond frond--a" href="#kelp-a-a" />
              <use className="frond frond--b" href="#kelp-a-b" />
              <use href="#kelp-a-base" />
            </g>
            <circle className="kelp-anchor" r="2.5" />
          </g>
        </g>

        <path
          className="seabed-line seabed-line--front"
          d="M -30 427 C 85 414 165 437 282 424 C 393 411 478 437 592 423 C 705 410 788 438 906 423 C 1027 408 1106 438 1222 423 C 1328 410 1390 430 1470 421"
        />
      </svg>
    </div>
  );
}
