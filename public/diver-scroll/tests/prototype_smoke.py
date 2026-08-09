import os
import re
import sys

from playwright.sync_api import sync_playwright


URL = (
    sys.argv[1]
    if len(sys.argv) > 1
    else os.environ.get(
        "DIVER_SCROLL_URL", "http://127.0.0.1:3000/diver-scroll/index.html"
    )
)


def scroll_ratio(page):
    return page.evaluate(
        """() => {
          const range = document.documentElement.scrollHeight - innerHeight;
          return range > 0 ? scrollY / range : 0;
        }"""
    )


def right_gap(page, selector):
    return page.locator(selector).evaluate(
        "element => innerWidth - element.getBoundingClientRect().right"
    )


def contrast_with_white(css_color, opacity=1.0):
    channels = [float(value) for value in re.findall(r"[\d.]+", css_color)]
    alpha = channels[3] if len(channels) > 3 else 1.0
    effective_alpha = alpha * opacity
    rgb = [
        (channel * effective_alpha + 255 * (1 - effective_alpha)) / 255
        for channel in channels[:3]
    ]
    linear = [
        channel / 12.92
        if channel <= 0.04045
        else ((channel + 0.055) / 1.055) ** 2.4
        for channel in rgb
    ]
    luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
    return 1.05 / (luminance + 0.05)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    console_errors = []
    page_errors = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.add_init_script(
        """document.addEventListener('DOMContentLoaded', () => {
          window.__bubbleEmissions = [];
          const layer = document.querySelector('#bubble-trail');
          new MutationObserver(records => {
            for (const record of records) {
              for (const node of record.addedNodes) {
                if (node instanceof HTMLElement && node.matches('.released-bubble')) {
                  window.__bubbleEmissions.push(performance.now());
                }
              }
            }
          }).observe(layer, { childList: true });
        }, { once: true });"""
    )

    response = page.goto(URL)
    page.wait_for_load_state("networkidle")
    assert response is not None and response.status == 200, response.status if response else None

    thumb = page.locator('[role="scrollbar"]')
    track = page.locator("#dive-track")
    assert thumb.count() == 1
    assert page.get_by_text("тянуть", exact=True).count() == 0
    assert thumb.get_attribute("aria-valuenow") == "0"
    controller_box = page.locator("#dive-controller").bounding_box()
    initial_thumb_box = thumb.bounding_box()
    assert controller_box is not None and initial_thumb_box is not None
    assert abs(initial_thumb_box["width"] / controller_box["width"] - 0.72) <= 0.01

    edge_gaps = {
        "desktop": {
            "rope": right_gap(page, ".surface-knot"),
            "meter": right_gap(page, "#depth-meter"),
        }
    }
    page.set_viewport_size({"width": 390, "height": 844})
    edge_gaps["mobile"] = {
        "rope": right_gap(page, ".surface-knot"),
        "meter": right_gap(page, "#depth-meter"),
    }
    page.set_viewport_size({"width": 1_440, "height": 900})
    assert 8 <= edge_gaps["desktop"]["rope"] <= 24, edge_gaps
    assert 8 <= edge_gaps["mobile"]["rope"] <= 16, edge_gaps
    assert edge_gaps["desktop"]["meter"] >= 4, edge_gaps
    assert edge_gaps["mobile"]["meter"] >= 4, edge_gaps

    pose = thumb.locator(".diver-art").evaluate(
        """svg => {
          const box = selector => {
            const bounds = svg.querySelector(selector).getBBox();
            return {
              x: bounds.x + bounds.width / 2,
              y: bounds.y + bounds.height / 2,
              width: bounds.width,
              height: bounds.height,
            };
          };
          const head = box('.head');
          const torso = box('.torso');
          const rearFin = box('.rear-fin');
          const frontFin = box('.front-fin');
          const fins = {
            x: (rearFin.x + frontFin.x) / 2,
            y: (rearFin.y + frontFin.y) / 2,
          };
          const tank = box('.tank');
          return {
            head,
            torso,
            fins,
            tank,
            verticalSpan: fins.y - head.y,
            horizontalSpan: Math.max(head.x, torso.x, fins.x) -
              Math.min(head.x, torso.x, fins.x),
          };
        }"""
    )
    assert pose["head"]["y"] < pose["torso"]["y"] < pose["fins"]["y"], pose
    assert pose["verticalSpan"] > pose["horizontalSpan"] * 1.6, pose
    assert pose["tank"]["height"] > pose["torso"]["height"] * 1.15, pose

    page.wait_for_timeout(420)
    first_burst = page.evaluate(
        """() => {
          const emissions = window.__bubbleEmissions;
          const nextBurst = emissions.findIndex(
            (time, index) => index > 0 && time - emissions[index - 1] > 250,
          );
          const burst = nextBurst === -1 ? emissions : emissions.slice(0, nextBurst);
          return {
            count: burst.length,
            duration: burst.length > 1 ? burst.at(-1) - burst[0] : 0,
          };
        }"""
    )
    assert 7 <= first_burst["count"] <= 10, first_burst
    assert first_burst["duration"] <= 550, first_burst

    first_burst_centers = page.locator(".released-bubble").evaluate_all(
        """(bubbles, count) => bubbles
          .map(bubble => ({
            id: Number(bubble.dataset.bubbleId),
            box: bubble.getBoundingClientRect(),
          }))
          .sort((a, b) => a.id - b.id)
          .slice(0, count)
          .map(({ box }) => box.top + box.height / 2)""",
        first_burst["count"],
    )
    assert all(
        upper < lower
        for upper, lower in zip(first_burst_centers, first_burst_centers[1:])
    ), first_burst_centers
    assert first_burst_centers[-1] - first_burst_centers[0] >= 8, first_burst_centers

    page.wait_for_function(
        """() => window.__bubbleEmissions.some(
          (time, index, emissions) =>
            index > 0 && time - emissions[index - 1] > 250,
        )""",
        timeout=3_500,
    )
    breath_interval = page.evaluate(
        """() => {
          const emissions = window.__bubbleEmissions;
          const secondBurst = emissions.findIndex(
            (time, index) => index > 0 && time - emissions[index - 1] > 250,
          );
          return emissions[secondBurst] - emissions[0];
        }"""
    )
    assert 2_850 <= breath_interval <= 3_150, breath_interval

    released_bubbles = page.locator(".released-bubble")
    latest_bubble_id = (
        int(released_bubbles.last.get_attribute("data-bubble-id"))
        if released_bubbles.count()
        else 0
    )
    page.wait_for_function(
        """previousId => [...document.querySelectorAll('.released-bubble')]
          .some(bubble => Number(bubble.dataset.bubbleId) > previousId)""",
        arg=latest_bubble_id,
        timeout=1_200,
    )
    bubble_id = page.evaluate(
        """previousId => Math.min(
          ...[...document.querySelectorAll('.released-bubble')]
            .map(bubble => Number(bubble.dataset.bubbleId))
            .filter(id => id > previousId)
        )""",
        latest_bubble_id,
    )
    released_bubble = page.locator(f'[data-bubble-id="{bubble_id}"]')
    bubble_seen_at = page.evaluate("performance.now()")
    assert released_bubble.evaluate(
        "element => getComputedStyle(element).animationDuration"
    ) == "1.5s"
    bubble_start = released_bubble.bounding_box()
    regulator_start = page.locator(".regulator").bounding_box()
    assert bubble_start is not None and regulator_start is not None

    page.evaluate(
        "window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.55)"
    )
    page.wait_for_timeout(250)
    bubble_after_scroll = released_bubble.bounding_box()
    regulator_after_scroll = page.locator(".regulator").bounding_box()
    assert bubble_after_scroll is not None and regulator_after_scroll is not None
    assert abs(bubble_after_scroll["x"] - bubble_start["x"]) <= 5
    assert 0 <= bubble_start["y"] - bubble_after_scroll["y"] <= 8
    assert abs(regulator_after_scroll["y"] - regulator_start["y"]) > 80

    released_bubble.wait_for(state="detached", timeout=1_500)
    bubble_lifetime = page.evaluate("performance.now()") - bubble_seen_at
    assert 1_250 <= bubble_lifetime <= 1_700, bubble_lifetime
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(120)

    page.wait_for_timeout(1_850)
    idle_opacity = float(
        page.locator("#dive-controller").evaluate(
            "element => getComputedStyle(element).opacity"
        )
    )
    thumb_color = thumb.evaluate("element => getComputedStyle(element).color")
    assert contrast_with_white(thumb_color, idle_opacity) >= 3

    page.keyboard.press("Tab")
    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement.id") == "diver-thumb"
    focus_state = thumb.evaluate(
        """element => ({
          matches: element.matches(':focus'),
          outline: getComputedStyle(element).outlineColor,
          token: getComputedStyle(document.documentElement).getPropertyValue('--blue')
        })"""
    )
    assert contrast_with_white(focus_state["outline"]) >= 3, focus_state

    page.evaluate(
        "window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.5)"
    )
    page.wait_for_timeout(120)
    midpoint = int(thumb.get_attribute("aria-valuenow"))
    assert 48 <= midpoint <= 52, midpoint
    rope_rendering = page.locator("#rope-progress").evaluate(
        """element => ({
          clipPath: getComputedStyle(element).clipPath,
          dashOffset: element.getAttribute('stroke-dashoffset'),
        })"""
    )
    assert rope_rendering["clipPath"] != "none", rope_rendering
    assert rope_rendering["dashOffset"] is None, rope_rendering
    alignment = page.evaluate(
        """() => {
          const rope = document.querySelector('#rope-progress');
          const grip = document.querySelector('.grip');
          const progress = Number(
            document.querySelector('#diver-thumb').getAttribute('aria-valuenow')
          ) / 100;
          const point = rope.getPointAtLength(rope.getTotalLength() * progress);
          const end = new DOMPoint(point.x, point.y).matrixTransform(rope.getScreenCTM());
          const gripBox = grip.getBoundingClientRect();
          const gripX = gripBox.left + gripBox.width / 2;
          const gripY = gripBox.top + gripBox.height / 2;
          return {
            endX: end.x,
            endY: end.y,
            gripX,
            gripY,
            horizontalGap: gripX - end.x,
            verticalGap: gripY - end.y,
          };
        }"""
    )
    assert abs(alignment["horizontalGap"]) <= 2, alignment
    assert abs(alignment["verticalGap"]) <= 10, alignment

    thumb.focus()
    page.keyboard.press("Home")
    page.wait_for_timeout(60)
    assert scroll_ratio(page) < 0.01
    page.keyboard.press("ArrowDown")
    page.wait_for_timeout(60)
    assert 0.01 < scroll_ratio(page) < 0.1

    page.keyboard.press("Home")
    page.wait_for_timeout(60)
    thumb_box = thumb.bounding_box()
    assert thumb_box is not None
    page.mouse.move(
        thumb_box["x"] + thumb_box["width"] / 2,
        thumb_box["y"] + thumb_box["height"] / 2,
    )
    page.mouse.down()
    page.set_viewport_size({"width": 1_200, "height": 650})
    track_box = track.bounding_box()
    assert track_box is not None
    page.mouse.move(
        track_box["x"] + track_box["width"] / 2,
        track_box["y"] + track_box["height"] - 2,
        steps=8,
    )
    page.mouse.up()
    page.wait_for_timeout(100)
    assert scroll_ratio(page) > 0.97, scroll_ratio(page)

    assert console_errors == [], console_errors
    assert page_errors == [], page_errors
    browser.close()

print("prototype smoke: passed")
