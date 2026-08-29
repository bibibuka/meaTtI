"use client";

import { useEffect, useRef } from "react";

// Водолаз вместо ползунка прокрутки. Источник правды — нативный скролл
// документа: колесо, тач и клавиши работают как обычно, водолаза можно
// дополнительно тащить мышью. Пройденный путь остаётся синей верёвкой.
// Прототип и заметки по дизайну: public/diver-scroll/.

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const progressFromScroll = (
  scrollTop: number,
  scrollHeight: number,
  viewportHeight: number,
) => {
  const range = scrollHeight - viewportHeight;
  return range > 0 ? clamp01(scrollTop / range) : 0;
};

const ROPE_PATH =
  "M 92 0 C 84 45 100 88 91 133 C 82 178 100 221 91 267 C 83 314 99 358 91 404 C 83 451 100 493 91 540 C 82 586 100 630 91 676 C 83 723 100 766 91 813 C 82 859 99 905 91 950 C 88 968 89 984 92 1000";

const BUBBLE_SHAPES = [
  { size: 4, drift: 2 },
  { size: 6, drift: -5 },
  { size: 3, drift: 7 },
  { size: 5, drift: -2 },
  { size: 7, drift: 5 },
  { size: 4, drift: -8 },
];
const BUBBLE_BURST_SIZES = [8, 10, 7, 9];

export default function DiverScroll() {
  const controllerRef = useRef<HTMLElement>(null);
  const bubbleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = controllerRef.current;
    const bubbleLayer = bubbleLayerRef.current;
    if (!controller || !bubbleLayer) return;

    const track = controller.querySelector<HTMLElement>(".dive-track")!;
    const thumb = controller.querySelector<HTMLButtonElement>(".diver-thumb")!;
    const rope = controller.querySelector<SVGPathElement>(".completed-rope")!;
    const diverArt = thumb.querySelector<SVGSVGElement>(".diver-art")!;
    const grip = thumb.querySelector<SVGPathElement>(".grip")!;
    const regulator = thumb.querySelector<SVGPathElement>(".regulator")!;
    const ropeSvg = rope.ownerSVGElement!;

    const gripBox = grip.getBBox();
    const gripXRatio =
      (gripBox.x + gripBox.width / 2) / diverArt.viewBox.baseVal.width;
    let ropeLength = 0;
    try {
      ropeLength = rope.getTotalLength();
    } catch {}
    const ropeViewBoxWidth = ropeSvg.viewBox.baseVal.width;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // кэшируем thumb ширину, чтобы не мерить каждый кадр
    let cachedThumbWidth = thumb.getBoundingClientRect().width;
    const roThumb = new ResizeObserver(() => {
      cachedThumbWidth = thumb.getBoundingClientRect().width;
      try { ropeLength = rope.getTotalLength(); } catch {}
    });
    roThumb.observe(thumb);
    roThumb.observe(track);

    let progress = 0;
    let previousScrollTop = window.scrollY;
    let pointerId: number | null = null;
    let grabOffset = 0;
    let dragTrackRect: DOMRect | null = null;
    let frame = 0;
    let movementTimer = 0;
    let activityTimer = 0;
    let bubbleIndex = 0;
    let bubbleBurstIndex = 0;
    const pendingBubbles = new Set<number>();

    const scrollHeight = () => document.documentElement.scrollHeight;

    function releaseBubble(order: number, bubbleCount: number) {
      if (reducedMotion.matches || document.hidden) return;
      const origin = regulator.getBoundingClientRect();
      const shape = BUBBLE_SHAPES[bubbleIndex % BUBBLE_SHAPES.length];
      // Первые пузырьки пачки поднимаются выше последних.
      const rise = 16 - (order / Math.max(1, bubbleCount - 1)) * 8;
      const bubble = document.createElement("span");

      bubbleIndex += 1;
      bubble.className = "released-bubble";
      bubble.style.left = `${(origin.right - 1).toFixed(2)}px`;
      bubble.style.top = `${(origin.top + origin.height * 0.55).toFixed(2)}px`;
      // Размеры в rem, чтобы на 27″ пузырьки росли вместе с водолазом.
      bubble.style.width = `${shape.size / 16}rem`;
      bubble.style.setProperty("--bubble-drift", `${shape.drift / 16}rem`);
      bubble.style.setProperty("--bubble-rise", `${rise / 16}rem`);
      bubble.addEventListener("animationend", () => bubble.remove(), {
        once: true,
      });
      bubbleLayer!.append(bubble);
    }

    function releaseBubbleBurst() {
      if (reducedMotion.matches || document.hidden) return;
      const bubbleCount =
        BUBBLE_BURST_SIZES[bubbleBurstIndex % BUBBLE_BURST_SIZES.length];

      bubbleBurstIndex += 1;
      for (let index = 0; index < bubbleCount; index += 1) {
        const timer = window.setTimeout(() => {
          pendingBubbles.delete(timer);
          releaseBubble(index, bubbleCount);
        }, index * 52);
        pendingBubbles.add(timer);
      }
    }

    function render(nextProgress: number) {
      progress = clamp01(nextProgress);
      const trackRect = track.getBoundingClientRect();
      let thumbX = 0;
      let thumbY = progress * trackRect.height;
      try {
        const ropePoint = rope.getPointAtLength(ropeLength * progress);
        thumbX =
          (ropePoint.x / ropeViewBoxWidth) * trackRect.width -
          gripXRatio * cachedThumbWidth;
      } catch {
        thumbX = 0;
      }
      const percent = Math.round(progress * 100);

      thumb.style.transform = `translate3d(${thumbX.toFixed(2)}px, ${thumbY.toFixed(2)}px, 0) translateY(-50%)`;
      thumb.setAttribute("aria-valuenow", String(percent));
      thumb.setAttribute(
        "aria-valuetext",
        percent === 0
          ? "0 процентов, поверхность"
          : percent === 100
            ? "100 процентов, дно"
            : `${percent} процентов, глубина ${percent} метров`,
      );
      // clipPath триггерит перерисовку, используем более дешевую трансформацию через opacity/height
      rope.style.clipPath = `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`;
    }

    function setDirection(nextProgress: number) {
      if (Math.abs(nextProgress - progress) < 0.0001) return;
      controller!.dataset.direction = nextProgress > progress ? "down" : "up";
    }

    function showActivity() {
      controller!.dataset.active = "true";
      window.clearTimeout(activityTimer);
      activityTimer = window.setTimeout(() => {
        if (pointerId === null) controller!.dataset.active = "false";
      }, 1_100);
    }

    function showMovement() {
      controller!.dataset.moving = "true";
      window.clearTimeout(movementTimer);
      movementTimer = window.setTimeout(() => {
        controller!.dataset.moving = "false";
      }, 180);
    }

    function syncFromScroll() {
      frame = 0;
      const nextScrollTop = window.scrollY;
      const nextProgress = progressFromScroll(
        nextScrollTop,
        scrollHeight(),
        window.innerHeight,
      );

      if (nextScrollTop !== previousScrollTop) {
        setDirection(nextProgress);
        showMovement();
      }

      previousScrollTop = nextScrollTop;
      render(nextProgress);
    }

    function scheduleSync() {
      showActivity();
      if (!frame) frame = window.requestAnimationFrame(syncFromScroll);
    }

    function scrollToProgress(nextProgress: number) {
      const clamped = clamp01(nextProgress);
      setDirection(clamped);
      render(clamped);
      showActivity();
      showMovement();
      window.scrollTo({
        top:
          clamped * Math.max(0, scrollHeight() - window.innerHeight),
        left: 0,
        // Не "auto": у html стоит scroll-behavior: smooth, и перетаскивание
        // начало бы отставать от курсора.
        behavior: "instant",
      });
    }

    function beginDrag(event: PointerEvent) {
      if (event.button !== 0 || pointerId !== null) return;
      dragTrackRect = track.getBoundingClientRect();
      pointerId = event.pointerId;
      grabOffset =
        event.clientY - (dragTrackRect.top + progress * dragTrackRect.height);
      controller!.dataset.dragging = "true";
      thumb.setPointerCapture(pointerId);
      showActivity();
      event.preventDefault();
    }

    function moveDrag(event: PointerEvent) {
      if (event.pointerId !== pointerId || !dragTrackRect) return;
      dragTrackRect = track.getBoundingClientRect();
      const desiredCenterY = event.clientY - grabOffset;
      scrollToProgress(
        dragTrackRect.height > 0
          ? (desiredCenterY - dragTrackRect.top) / dragTrackRect.height
          : 0,
      );
      event.preventDefault();
    }

    function endDrag(event: PointerEvent) {
      if (event.pointerId !== pointerId) return;
      const activePointer = pointerId;
      pointerId = null;
      dragTrackRect = null;
      controller!.dataset.dragging = "false";
      if (thumb.hasPointerCapture(activePointer)) {
        thumb.releasePointerCapture(activePointer);
      }
      showActivity();
    }

    function handleKeydown(event: KeyboardEvent) {
      let nextProgress = progress;

      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          nextProgress += 0.04;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          nextProgress -= 0.04;
          break;
        case "PageDown":
          nextProgress += 0.2;
          break;
        case "PageUp":
          nextProgress -= 0.2;
          break;
        case "Home":
          nextProgress = 0;
          break;
        case "End":
          nextProgress = 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      scrollToProgress(nextProgress);
    }

    const onLostCapture = (event: PointerEvent) => {
      if (event.pointerId === pointerId) endDrag(event);
    };

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    window.addEventListener("pageshow", scheduleSync);
    thumb.addEventListener("pointerdown", beginDrag);
    thumb.addEventListener("pointermove", moveDrag);
    thumb.addEventListener("pointerup", endDrag);
    thumb.addEventListener("pointercancel", endDrag);
    thumb.addEventListener("lostpointercapture", onLostCapture);
    thumb.addEventListener("keydown", handleKeydown);

    // Высота страницы меняется на переходах между роутами.
    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(document.body);

    render(progressFromScroll(window.scrollY, scrollHeight(), window.innerHeight));
    const startTimer = window.setTimeout(releaseBubbleBurst, 180);
    const breathTimer = window.setInterval(releaseBubbleBurst, 3_000);
    activityTimer = window.setTimeout(() => {
      controller.dataset.active = "false";
    }, 1_800);

    return () => {
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      window.removeEventListener("pageshow", scheduleSync);
      thumb.removeEventListener("pointerdown", beginDrag);
      thumb.removeEventListener("pointermove", moveDrag);
      thumb.removeEventListener("pointerup", endDrag);
      thumb.removeEventListener("pointercancel", endDrag);
      thumb.removeEventListener("lostpointercapture", onLostCapture);
      thumb.removeEventListener("keydown", handleKeydown);
      resizeObserver.disconnect();
      roThumb.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      pendingBubbles.forEach(window.clearTimeout);
      window.clearTimeout(startTimer);
      window.clearTimeout(activityTimer);
      window.clearTimeout(movementTimer);
      window.clearInterval(breathTimer);
      bubbleLayer.replaceChildren();
    };
  }, []);

  return (
    <>
      <div className="bubble-trail" ref={bubbleLayerRef} aria-hidden="true" />

      <aside
        className="dive-controller"
        ref={controllerRef}
        data-active="true"
        data-direction="down"
        data-moving="false"
        data-dragging="false"
        aria-label="Навигация по глубине страницы"
      >
        <div className="dive-track" aria-hidden="true">
          <svg
            className="rope-svg"
            viewBox="0 0 120 1000"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path className="rope remaining-rope" d={ROPE_PATH} />
            <path className="rope completed-rope" d={ROPE_PATH} />
            <circle className="surface-knot" cx="92" cy="3" r="5" />
          </svg>
        </div>

        <button
          className="diver-thumb"
          type="button"
          role="scrollbar"
          aria-label="Глубина страницы. Потяните водолаза вверх или вниз"
          aria-controls="page-content"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
          aria-valuetext="0 процентов, поверхность"
        >
          <svg
            className="diver-art"
            viewBox="0 0 104 108"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
            aria-hidden="true"
          >
            <g className="diver-float">
              <path
                className="tank"
                d="M 36 35 C 36 30 39 27 44 27 C 49 27 52 30 52 35 L 52 65 C 52 70 49 73 44 73 C 39 73 36 70 36 65 Z"
              />
              <path className="tank-valve" d="M 41 27 L 41 23 L 47 23 L 47 27" />
              <path className="harness" d="M 37 43 L 52 43 M 37 61 L 52 61" />

              <g className="rear-fin">
                <path d="M 47 65 C 46 75 43 82 40 88" />
                <path d="M 40 86 L 31 99 L 43 96 L 47 88" />
              </g>
              <g className="front-fin">
                <path d="M 56 66 C 58 76 60 82 64 88" />
                <path d="M 63 86 L 67 101 L 73 91 L 66 85" />
              </g>

              <path
                className="torso"
                d="M 48 34 C 55 32 62 37 64 45 L 62 63 C 59 69 50 70 44 65 L 42 45 C 42 39 44 36 48 34 Z"
              />
              <path className="belt" d="M 43 61 C 49 64 56 65 62 62" />
              <circle className="head" cx="58" cy="23" r="9" />
              <path className="mask" d="M 54 19 C 59 17 64 18 67 21 L 65 26 L 55 26 Z" />
              <path className="regulator" d="M 67 25 q 6 0 6 4 M 71 29 q 2 3 5 0" />
              <path className="hose" d="M 70 27 C 74 41 66 47 61 47" />
              <path className="rope-arm" d="M 61 40 L 69 49 L 77 44 L 83 45" />
              <path className="near-arm" d="M 58 44 L 66 56 L 77 53" />
              <path className="grip" d="M 81 42 q 5 3 0 7" />
            </g>
          </svg>
        </button>
      </aside>
    </>
  );
}
