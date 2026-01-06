import type {APIRoute} from "astro";

export const GET: APIRoute = async ({request}) => {
  const url = new URL(request.url);
  const origin = url.origin;

  const script = `
(function () {
  var script = document.currentScript;
  var baseUrl = "${origin}";
  var iframeSrc = baseUrl + "/embed";

  var params = [];
  if (script) {
    var getAttr = function (kebab, camel) {
      return (
        script.getAttribute("data-" + kebab) ||
        script.getAttribute(camel || kebab)
      );
    };

    var title = getAttr("title");
    if (title) params.push("title=" + encodeURIComponent(title));

    var style = getAttr("style");
    if (style) params.push("style=" + encodeURIComponent(style));

    var apiVersion = getAttr("api-version", "apiVersion");
    if (apiVersion) params.push("apiVersion=" + encodeURIComponent(apiVersion));

    var apiBackend = getAttr("api-backend", "apiBackend");
    if (apiBackend) params.push("apiBackend=" + encodeURIComponent(apiBackend));

    var debug = getAttr("debug");
    if (debug) params.push("debug=" + encodeURIComponent(debug));
  }

  if (params.length > 0) {
    iframeSrc += "?" + params.join("&");
  }

  var iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  iframe.style.position = "fixed";
  iframe.style.bottom = "0";
  iframe.style.right = "0";
  iframe.style.border = "none";
  iframe.style.zIndex = "2147483647";
  iframe.style.width = "100px";
  iframe.style.height = "100px";
  iframe.style.backgroundColor = "transparent";
  iframe.id = "chatbot-iframe";

  document.body.appendChild(iframe);

  window.addEventListener("message", function (event) {
    if (event.origin !== baseUrl) return;

    if (event.data.type === "chatbot-open") {
      iframe.style.width = "400px";
      iframe.style.height = "75vh";
      iframe.style.maxWidth = "100%";
      iframe.style.maxHeight = "100%";

      if (window.innerWidth < 640) {
        iframe.style.width = "100%";
        iframe.style.height = "100%";
      }
    } else if (event.data.type === "chatbot-close") {
      iframe.style.width = "100px";
      iframe.style.height = "100px";
    }
  });
})();
  `;

  return new Response(script.trim(), {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
};
