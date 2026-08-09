export const clamp01 = (value) => Math.min(1, Math.max(0, value));

export function progressFromScroll(scrollTop, scrollHeight, viewportHeight) {
  const range = scrollHeight - viewportHeight;
  return range > 0 ? clamp01(scrollTop / range) : 0;
}

export function scrollTopFromProgress(progress, scrollHeight, viewportHeight) {
  const range = Math.max(0, scrollHeight - viewportHeight);
  return clamp01(progress) * range;
}

export function progressFromPointer(clientY, trackTop, trackHeight) {
  return trackHeight > 0 ? clamp01((clientY - trackTop) / trackHeight) : 0;
}

export function setupDiverScroll() {
  const controller = document.querySelector("#dive-controller");
  const track = document.querySelector("#dive-track");
  const thumb = document.querySelector("#diver-thumb");
  const rope = document.querySelector("#rope-progress");
  const meter = document.querySelector("#depth-meter");
  const bubbleLayer = document.querySelector("#bubble-trail");
  const diverArt = thumb?.querySelector(".diver-art");
  const grip = thumb?.querySelector(".grip");
  const regulator = thumb?.querySelector(".regulator");
  const ropeSvg = rope?.ownerSVGElement;

  if (
    !controller ||
    !track ||
    !thumb ||
    !rope ||
    !meter ||
    !bubbleLayer ||
    !diverArt ||
    !grip ||
    !regulator ||
    !ropeSvg
  )
    return;

  const gripBox = grip.getBBox();
  const gripXRatio =
    (gripBox.x + gripBox.width / 2) / diverArt.viewBox.baseVal.width;
  const ropeLength = rope.getTotalLength();
  const ropeViewBoxWidth = ropeSvg.viewBox.baseVal.width;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const bubbleShapes = [
    { size: 4, drift: 2 },
    { size: 6, drift: -5 },
    { size: 3, drift: 7 },
    { size: 5, drift: -2 },
    { size: 7, drift: 5 },
    { size: 4, drift: -8 },
  ];
  const bubbleBurstSizes = [8, 10, 7, 9];

  let progress = 0;
  let previousScrollTop = window.scrollY;
  let pointerId = null;
  let grabOffset = 0;
  let dragTrackRect = null;
  let frame = 0;
  let movementTimer = 0;
  let activityTimer = 0;
  let bubbleIndex = 0;
  let bubbleBurstIndex = 0;

  const scrollHeight = () => document.documentElement.scrollHeight;

  function releaseBubble(order, bubbleCount) {
    if (reducedMotion.matches || document.hidden) return;
    const origin = regulator.getBoundingClientRect();
    const shape = bubbleShapes[bubbleIndex % bubbleShapes.length];
    const rise = 16 - (order / Math.max(1, bubbleCount - 1)) * 8;
    const bubble = document.createElement("span");

    bubbleIndex += 1;
    bubble.className = "released-bubble";
    bubble.dataset.bubbleId = String(bubbleIndex);
    bubble.style.left = `${(origin.right - 1).toFixed(2)}px`;
    bubble.style.top = `${(origin.top + origin.height * 0.55).toFixed(2)}px`;
    bubble.style.width = `${shape.size}px`;
    bubble.style.setProperty("--bubble-drift", `${shape.drift}px`);
    bubble.style.setProperty("--bubble-rise", `${rise.toFixed(2)}px`);
    bubble.addEventListener("animationend", () => bubble.remove(), {
      once: true,
    });
    bubbleLayer.append(bubble);
    window.setTimeout(() => bubble.remove(), 1_600);
  }

  function releaseBubbleBurst() {
    if (reducedMotion.matches || document.hidden) return;
    const bubbleCount =
      bubbleBurstSizes[bubbleBurstIndex % bubbleBurstSizes.length];

    bubbleBurstIndex += 1;
    for (let index = 0; index < bubbleCount; index += 1) {
      window.setTimeout(() => releaseBubble(index, bubbleCount), index * 52);
    }
  }

  function render(nextProgress) {
    progress = clamp01(nextProgress);
    const trackRect = track.getBoundingClientRect();
    const trackHeight = trackRect.height;
    const ropePoint = rope.getPointAtLength(ropeLength * progress);
    const thumbX =
      (ropePoint.x / ropeViewBoxWidth) * trackRect.width -
      gripXRatio * thumb.getBoundingClientRect().width;
    const thumbY = progress * trackHeight;
    const percent = Math.round(progress * 100);
    const depth = String(percent).padStart(3, "0");

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
    rope.style.clipPath = `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`;
    meter.textContent = `${depth} м`;
  }

  function setDirection(nextProgress) {
    if (Math.abs(nextProgress - progress) < 0.0001) return;
    controller.dataset.direction = nextProgress > progress ? "down" : "up";
  }

  function showActivity() {
    controller.dataset.active = "true";
    window.clearTimeout(activityTimer);
    activityTimer = window.setTimeout(() => {
      if (pointerId === null) controller.dataset.active = "false";
    }, 1_100);
  }

  function showMovement() {
    controller.dataset.moving = "true";
    window.clearTimeout(movementTimer);
    movementTimer = window.setTimeout(() => {
      controller.dataset.moving = "false";
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

  function scrollToProgress(nextProgress) {
    const clamped = clamp01(nextProgress);
    setDirection(clamped);
    render(clamped);
    showActivity();
    showMovement();
    window.scrollTo({
      top: scrollTopFromProgress(clamped, scrollHeight(), window.innerHeight),
      left: 0,
      behavior: "auto",
    });
  }

  function beginDrag(event) {
    if (event.button !== 0 || pointerId !== null) return;
    dragTrackRect = track.getBoundingClientRect();
    pointerId = event.pointerId;
    grabOffset =
      event.clientY - (dragTrackRect.top + progress * dragTrackRect.height);
    controller.dataset.dragging = "true";
    thumb.setPointerCapture(pointerId);
    showActivity();
    event.preventDefault();
  }

  function moveDrag(event) {
    if (event.pointerId !== pointerId || !dragTrackRect) return;
    dragTrackRect = track.getBoundingClientRect();
    const desiredCenterY = event.clientY - grabOffset;
    scrollToProgress(
      progressFromPointer(
        desiredCenterY,
        dragTrackRect.top,
        dragTrackRect.height,
      ),
    );
    event.preventDefault();
  }

  function endDrag(event) {
    if (event.pointerId !== pointerId) return;
    const activePointer = pointerId;
    pointerId = null;
    dragTrackRect = null;
    controller.dataset.dragging = "false";
    if (thumb.hasPointerCapture(activePointer)) {
      thumb.releasePointerCapture(activePointer);
    }
    showActivity();
  }

  function handleKeydown(event) {
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

  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("pageshow", scheduleSync);
  thumb.addEventListener("pointerdown", beginDrag);
  thumb.addEventListener("pointermove", moveDrag);
  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);
  thumb.addEventListener("lostpointercapture", (event) => {
    if (event.pointerId === pointerId) endDrag(event);
  });
  thumb.addEventListener("keydown", handleKeydown);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(document.body);
  }

  render(
    progressFromScroll(window.scrollY, scrollHeight(), window.innerHeight),
  );
  window.setTimeout(() => {
    releaseBubbleBurst();
    window.setInterval(releaseBubbleBurst, 3_000);
  }, 180);
  activityTimer = window.setTimeout(() => {
    controller.dataset.active = "false";
  }, 1_800);
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupDiverScroll, {
      once: true,
    });
  } else {
    setupDiverScroll();
  }
}
