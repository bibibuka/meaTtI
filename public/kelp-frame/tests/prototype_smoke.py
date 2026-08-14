import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = (
    sys.argv[1]
    if len(sys.argv) > 1
    else os.environ.get(
        "KELP_FRAME_URL", "http://127.0.0.1:3000/kelp-frame/index.html"
    )
)
OUTPUT = Path(
    os.environ.get("KELP_ARTIFACT_DIR", Path(__file__).with_name("artifacts"))
)
OUTPUT.mkdir(parents=True, exist_ok=True)


def geometry(page):
    return page.evaluate(
        """() => {
          const bed = document.querySelector('.kelp-bed').getBoundingClientRect();
          const anchors = [...document.querySelectorAll('.kelp-anchor')]
            .map((anchor) => anchor.getBoundingClientRect());
          const plants = [...document.querySelectorAll('.kelp-motion')]
            .map((plant) => plant.getBoundingClientRect());
          const visibleAnchorCenters = anchors
            .map((anchor) => anchor.left + anchor.width / 2)
            .filter((center) => center >= 0 && center <= innerWidth)
            .sort((a, b) => a - b);
          const anchorGaps = visibleAnchorCenters.length
            ? [
                visibleAnchorCenters[0],
                ...visibleAnchorCenters.slice(1).map(
                  (center, index) => center - visibleAnchorCenters[index]
                ),
                innerWidth - visibleAnchorCenters.at(-1),
              ]
            : [innerWidth];
          const visiblePlants = plants.filter(
            (plant) => plant.right > 0 && plant.left < innerWidth
          );
          const visiblePatternNames = [...document.querySelectorAll('.kelp-motion')]
            .filter((plant) => {
              const bounds = plant.getBoundingClientRect();
              return bounds.right > 0 && bounds.left < innerWidth;
            })
            .map((plant) => plant.dataset.kelp);

          return {
            bed: {
              left: bed.left,
              right: bed.right,
              top: bed.top,
              bottom: bed.bottom,
            },
            viewport: { width: innerWidth, height: innerHeight },
            overflow: document.documentElement.scrollWidth - innerWidth,
            firstAnchor: Math.min(...anchors.map((anchor) => anchor.left)),
            lastAnchor: Math.max(...anchors.map((anchor) => anchor.right)),
            visibleAnchorCount: visibleAnchorCenters.length,
            maxAnchorGap: Math.max(...anchorGaps),
            croppedTopCount: visiblePlants.filter(
              (plant) => plant.top < bed.top - 1
            ).length,
            maxPlantHeight: Math.max(...visiblePlants.map((plant) => plant.height)),
            minPlantHeight: Math.min(...visiblePlants.map((plant) => plant.height)),
            patternCount: new Set(visiblePatternNames).size,
            topSpread: Math.max(...plants.map((plant) => plant.top)) -
              Math.min(...plants.map((plant) => plant.top)),
          };
        }"""
    )


def animated_details(page):
    return page.evaluate(
        """() => {
          const familyIds = ['kelp-a', 'kelp-g', 'kelp-h', 'kelp-i'];
          const twoLeafIds = familyIds.slice(1);
          const usedFamily = [...document.querySelectorAll('.kelp-motion')]
            .map((plant) => plant.dataset.kelp)
            .filter((id) => familyIds.includes(id));
          const firstPlant = (id) => document.querySelector(
            `.kelp-motion[data-kelp="${id}"]`
          );
          const definitionFor = (use) => document.querySelector(
            use.getAttribute('href')
          );
          const frondsByVariant = Object.fromEntries(
            familyIds.map((id) => [
              id,
              [...firstPlant(id).querySelectorAll('.frond')].map((frond) => {
                const style = getComputedStyle(frond);
                return {
                  name: style.animationName,
                  delay: style.animationDelay,
                  duration: style.animationDuration,
                };
              }),
            ])
          );
          const bubbleStreams = [...document.querySelectorAll('.bubble-stream')];
          const bubbles = [...document.querySelectorAll('.kelp-bubble')];
          const animatedDefinitionIds = [...document.querySelectorAll('defs [id]')]
            .filter((definition) => definition.querySelector('.blade, .leaf, .grass'))
            .map((definition) => definition.id)
            .sort();
          const renderedFrondDefinitionIds = new Set(
            [...document.querySelectorAll('.kelp-motion use.frond')]
              .map((use) => use.getAttribute('href')?.slice(1))
              .filter(Boolean)
          );
          const unwrappedAnimatedParts = [
            ...document.querySelectorAll('.kelp-motion use:not(.frond)')
          ]
            .filter((use) => definitionFor(use)?.querySelector(
              '.blade, .leaf, .grass'
            ))
            .map((use) => use.getAttribute('href'));

          return {
            usedFamily: [...new Set(usedFamily)].sort(),
            threeLeafCount: frondsByVariant['kelp-a'].length,
            twoLeafCounts: twoLeafIds.map((id) => frondsByVariant[id].length),
            stemCounts: twoLeafIds.map(
              (id) => [...firstPlant(id).querySelectorAll('use')].reduce(
                (count, use) => count + definitionFor(use).querySelectorAll('.stem').length,
                0
              )
            ),
            bladesPerTwoLeafFrond: twoLeafIds.flatMap((id) =>
              [...firstPlant(id).querySelectorAll('.frond')].map(
                (frond) => definitionFor(frond).querySelectorAll('.blade').length
              )
            ),
            frondsByVariant,
            bubbleStreamSizes: bubbleStreams.map(
              (stream) => stream.querySelectorAll('.kelp-bubble').length
            ),
            bubbleStreamDelays: bubbleStreams.map(
              (stream) => getComputedStyle(
                stream.querySelector('.kelp-bubble')
              ).animationDelay
            ),
            bubbleAnimations: bubbles.map((bubble) => {
              const style = getComputedStyle(bubble);
              return {
                name: style.animationName,
                delay: style.animationDelay,
                duration: style.animationDuration,
              };
            }),
            unusedAnimatedDefinitions: animatedDefinitionIds.filter(
              (id) => !renderedFrondDefinitionIds.has(id)
            ),
            unwrappedAnimatedParts,
          };
        }"""
    )


def sample_animation(page, selector, mid_progress, end_progress):
    return page.locator(selector).first.evaluate(
        """(element, [midProgress, endProgress]) => {
          element.style.animationDelay = '0s';
          const animation = element.getAnimations()[0];
          if (!animation) return null;
          const duration = Number(animation.effect.getTiming().duration);
          const sample = (progress) => {
            animation.pause();
            animation.currentTime = duration * progress;
            const style = getComputedStyle(element);
            return { opacity: Number(style.opacity), transform: style.transform };
          };
          return {
            start: sample(0),
            mid: sample(midProgress),
            end: sample(endProgress),
          };
        }""",
        [mid_progress, end_progress],
    )


def rendered_frond_motions(page):
    return page.evaluate(
        """() => [...document.querySelectorAll('.kelp-motion .frond')].map(
          (target, index) => {
            const plant = target.closest('.kelp-motion');
            const plantAnimation = plant.getAnimations()[0];
            const animation = target.getAnimations()[0];
            if (!animation) return null;
            const plantTime = plantAnimation?.currentTime;
            const plantPlayState = plantAnimation?.playState;
            const targetTime = animation.currentTime;
            const targetPlayState = animation.playState;
            const timing = animation.effect.getTiming();
            const delay = Number(timing.delay);
            const duration = Number(timing.duration);
            try {
              plantAnimation?.pause();
              animation.pause();
              animation.effect.updateTiming({ delay: 0 });
              const box = () => {
                const rect = target.getBoundingClientRect();
                return {
                  left: rect.left,
                  top: rect.top,
                  right: rect.right,
                  bottom: rect.bottom,
                };
              };

              animation.currentTime = 0;
              const start = box();
              animation.currentTime = duration;
              const end = box();
              const edgeShift = Math.max(
                Math.abs(end.left - start.left),
                Math.abs(end.top - start.top),
                Math.abs(end.right - start.right),
                Math.abs(end.bottom - start.bottom)
              );

              return {
                index,
                kelp: plant.dataset.kelp,
                href: target.getAttribute('href'),
                duration,
                edgeShift,
                pixelsPerSecond: edgeShift / (duration / 1000),
              };
            } finally {
              animation.effect.updateTiming({ delay });
              animation.currentTime = targetTime;
              if (targetPlayState === 'running') animation.play();
              if (plantAnimation) {
                plantAnimation.currentTime = plantTime;
                if (plantPlayState === 'running') plantAnimation.play();
              }
            }
          }
        )"""
    )


def assert_frame_coverage(measurements):
    bed = measurements["bed"]
    viewport = measurements["viewport"]
    assert bed["left"] <= 1, measurements
    assert bed["right"] >= viewport["width"] - 1, measurements
    assert abs(bed["bottom"] - viewport["height"]) <= 1, measurements
    assert measurements["firstAnchor"] <= viewport["width"] * 0.08, measurements
    assert measurements["lastAnchor"] >= viewport["width"] * 0.92, measurements
    assert measurements["visibleAnchorCount"] >= 3, measurements
    assert measurements["maxAnchorGap"] <= viewport["width"] * 0.3, measurements
    assert measurements["croppedTopCount"] == 0, measurements
    assert measurements["maxPlantHeight"] <= 130, measurements
    assert measurements["minPlantHeight"] >= 24, measurements
    assert measurements["patternCount"] >= min(
        5, measurements["visibleAnchorCount"]
    ), measurements
    assert measurements["topSpread"] >= 24, measurements
    assert measurements["overflow"] == 0, measurements


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    context = browser.new_context(viewport={"width": 1_440, "height": 900})
    page = context.new_page()
    errors = []
    page.on(
        "console",
        lambda message: errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: errors.append(str(error)))
    response = page.goto(URL)
    page.wait_for_load_state("networkidle")
    assert response is not None and response.status == 200
    assert_frame_coverage(geometry(page))

    details = animated_details(page)
    assert details["usedFamily"] == ["kelp-a", "kelp-g", "kelp-h", "kelp-i"], details
    assert details["threeLeafCount"] == 3, details
    assert details["twoLeafCounts"] == [2, 2, 2], details
    assert details["stemCounts"] == [0, 0, 0], details
    assert details["bladesPerTwoLeafFrond"] == [1, 1, 1, 1, 1, 1], details
    for fronds in details["frondsByVariant"].values():
        assert all(frond["name"] != "none" for frond in fronds), details
        assert len({frond["delay"] for frond in fronds}) == len(fronds), details
    assert len(details["bubbleStreamSizes"]) == 6, details
    assert all(3 <= size <= 4 for size in details["bubbleStreamSizes"]), details
    assert len(set(details["bubbleStreamDelays"])) == 6, details
    assert all(
        bubble["name"] != "none" for bubble in details["bubbleAnimations"]
    ), details
    assert len({bubble["delay"] for bubble in details["bubbleAnimations"]}) >= 3, details
    assert details["unusedAnimatedDefinitions"] == [], details
    assert details["unwrappedAnimatedParts"] == [], details

    frond_motion = sample_animation(
        page, '.kelp-motion[data-kelp="kelp-a"] .frond', 0.5, 0.85
    )
    assert frond_motion is not None, frond_motion
    assert frond_motion["start"]["transform"] != frond_motion["mid"]["transform"], frond_motion

    visible_frond_motions = rendered_frond_motions(page)
    assert all(visible_frond_motions), visible_frond_motions
    subtle_fronds = [
        motion
        for motion in visible_frond_motions
        if motion["edgeShift"] < 3 or motion["pixelsPerSecond"] < 0.6
    ]
    assert subtle_fronds == [], subtle_fronds

    bubble_motion = sample_animation(page, ".kelp-bubble", 0.24, 0.46)
    assert bubble_motion is not None, bubble_motion
    assert bubble_motion["mid"]["opacity"] > bubble_motion["start"]["opacity"], bubble_motion
    assert bubble_motion["end"]["opacity"] < bubble_motion["mid"]["opacity"], bubble_motion
    assert bubble_motion["start"]["transform"] != bubble_motion["mid"]["transform"], bubble_motion

    moving_plant = page.locator(".kelp-motion").first
    before = moving_plant.evaluate("plant => getComputedStyle(plant).transform")
    page.wait_for_timeout(650)
    after = moving_plant.evaluate("plant => getComputedStyle(plant).transform")
    assert before != after, {"before": before, "after": after}
    page.screenshot(path=OUTPUT / "desktop.png")
    assert errors == [], errors
    context.close()

    wide_context = browser.new_context(viewport={"width": 2_560, "height": 1_440})
    wide = wide_context.new_page()
    wide.goto(URL)
    wide.wait_for_load_state("networkidle")
    assert_frame_coverage(geometry(wide))
    wide.screenshot(path=OUTPUT / "wide.png")
    wide_context.close()

    mobile_context = browser.new_context(viewport={"width": 390, "height": 844})
    mobile = mobile_context.new_page()
    mobile.goto(URL)
    mobile.wait_for_load_state("networkidle")
    assert_frame_coverage(geometry(mobile))
    mobile.screenshot(path=OUTPUT / "mobile.png")
    mobile_context.close()

    reduced_context = browser.new_context(
        viewport={"width": 1_440, "height": 900}, reduced_motion="reduce"
    )
    reduced = reduced_context.new_page()
    reduced.goto(URL)
    reduced.wait_for_load_state("networkidle")
    animation_names = reduced.locator(".kelp-motion").evaluate_all(
        "plants => plants.map((plant) => getComputedStyle(plant).animationName)"
    )
    assert set(animation_names) == {"none"}, animation_names
    frond_animation_names = reduced.locator(".frond").evaluate_all(
        "fronds => fronds.map((frond) => getComputedStyle(frond).animationName)"
    )
    bubble_styles = reduced.locator(".kelp-bubble").evaluate_all(
        "bubbles => bubbles.map((bubble) => ({"
        " name: getComputedStyle(bubble).animationName,"
        " opacity: getComputedStyle(bubble).opacity"
        "}))"
    )
    assert set(frond_animation_names) == {"none"}, frond_animation_names
    assert {style["name"] for style in bubble_styles} == {"none"}, bubble_styles
    assert {style["opacity"] for style in bubble_styles} == {"0"}, bubble_styles
    reduced_context.close()

    browser.close()

print("kelp frame smoke: passed")
