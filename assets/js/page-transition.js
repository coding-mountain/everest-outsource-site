(function () {
  var body = document.body;
  if (!body) return;

  window.requestAnimationFrame(function () {
    body.classList.add("page-ready");
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;
    if (link.target === "_blank") return;
    if (link.hasAttribute("download")) return;
    if (href.startsWith("http")) return;
    if (href.startsWith("mailto:")) return;
    if (href.startsWith("tel:")) return;
    if (href.startsWith("#")) return;

    event.preventDefault();
    body.classList.remove("page-ready");
    body.classList.add("page-leaving");

    window.setTimeout(function () {
      window.location.href = href;
    }, 180);
  });
})();
