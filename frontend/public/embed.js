/**
 * Optional host helper for Omega Calculators embeds.
 * Listens for resize postMessages and adjusts matching iframe height.
 * Iframe-only embeds still work with a fixed height when this script is omitted.
 */
(function () {
  var SOURCE = 'omega-calculators-embed';
  var script = document.currentScript;
  var expectedOrigin = (script && script.getAttribute('data-omega-embed-origin')) || '';
  var lastHeights = Object.create(null);

  function originOf(url) {
    try {
      return new URL(url, window.location.href).origin;
    } catch (e) {
      return '';
    }
  }

  function findIframe(embedId) {
    var nodes = document.querySelectorAll('iframe[data-omega-embed-id]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].getAttribute('data-omega-embed-id') === embedId) return nodes[i];
    }
    return null;
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.source !== SOURCE || data.type !== 'resize') return;
    if (typeof data.embedId !== 'string' || typeof data.height !== 'number') return;
    if (!isFinite(data.height) || data.height < 200 || data.height > 8000) return;

    var iframe = findIframe(data.embedId);
    if (!iframe) return;

    var iframeOrigin = originOf(iframe.getAttribute('src') || '');
    if (!iframeOrigin || event.origin !== iframeOrigin) return;
    if (expectedOrigin && event.origin !== expectedOrigin) return;
    if (event.source && iframe.contentWindow && event.source !== iframe.contentWindow) return;

    var next = Math.ceil(data.height);
    if (lastHeights[data.embedId] === next) return;
    lastHeights[data.embedId] = next;
    iframe.style.height = next + 'px';
    iframe.setAttribute('height', String(next));
  });
})();
