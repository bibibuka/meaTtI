import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


URL = (
    sys.argv[1]
    if len(sys.argv) > 1
    else os.environ.get(
        "DIVER_SCROLL_URL", "http://127.0.0.1:3000/diver-scroll/index.html"
    )
)
OUTPUT = Path(
    os.environ.get(
        "DIVER_ARTIFACT_DIR", Path(__file__).with_name("artifacts")
    )
)
OUTPUT.mkdir(parents=True, exist_ok=True)


def open_page(browser, viewport, reduced_motion="no-preference"):
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        reduced_motion=reduced_motion,
    )
    page = context.new_page()
    errors = []
    page.on(
        "console",
        lambda message: errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    return context, page, errors


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)

    desktop_context, desktop, desktop_errors = open_page(
        browser, {"width": 1440, "height": 900}
    )
    desktop.screenshot(path=OUTPUT / "desktop-surface.png")
    desktop.evaluate(
        "window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.48)"
    )
    desktop.wait_for_timeout(180)
    desktop.locator("#diver-thumb").hover()
    desktop.screenshot(path=OUTPUT / "desktop-mid-depth.png")
    desktop.locator("#diver-thumb").screenshot(path=OUTPUT / "diver-closeup.png")
    desktop.keyboard.press("End")
    desktop.wait_for_timeout(120)
    desktop.screenshot(path=OUTPUT / "desktop-seabed.png")
    assert desktop_errors == [], desktop_errors
    desktop_context.close()

    mobile_context, mobile, mobile_errors = open_page(
        browser, {"width": 390, "height": 844}
    )
    mobile.evaluate(
        "window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.34)"
    )
    mobile.wait_for_timeout(180)
    mobile.locator("#diver-thumb").hover()
    mobile.screenshot(path=OUTPUT / "mobile-mid-depth.png")
    assert mobile_errors == [], mobile_errors
    mobile_context.close()

    reduced_context, reduced, reduced_errors = open_page(
        browser,
        {"width": 1440, "height": 900},
        reduced_motion="reduce",
    )
    reduced.evaluate(
        "window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * 0.62)"
    )
    reduced.wait_for_timeout(80)
    reduced.locator("#diver-thumb").hover()
    reduced.screenshot(path=OUTPUT / "reduced-motion.png")
    assert reduced_errors == [], reduced_errors
    reduced_context.close()

    browser.close()

print(f"visual captures: {OUTPUT}")
