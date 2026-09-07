if (typeof window !== "undefined" && window.self !== window.top) {
  document.documentElement.classList.add("embed");
  window.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest && e.target.closest("a[href]");
      if (!a || a.target || a.getAttribute("href").charAt(0) === "#") return;
      e.preventDefault();
      window.top.location.href = a.href;
    },
    true
  );
}
