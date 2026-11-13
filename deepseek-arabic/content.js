(() => {
  "use strict";
  const { STORAGE_KEY, DEFAULTS, normalizeSettings, directionFor } = globalThis.DeepSeekArabic;
  // Prefer semantic/component selectors. The final selector is a legacy user
  // bubble used by DeepSeek versions without a semantic message container.
  const ROOTS = ".ds-markdown, .ds-message, [data-message-content], [data-message-author-role], .fbb737a4";
  const EDITORS = 'textarea:not([disabled]):not([readonly]), [contenteditable="true"][role="textbox"], #chat-input[contenteditable="true"]';
  const BLOCKS = "p, li, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, td, th, .ds-markdown-paragraph";
  const EXCLUDED = 'pre, code, kbd, samp, .katex, .katex-display, .MathJax, mjx-container, math, [role="math"], button, script, style, svg, [aria-hidden="true"]';
  const ATTRS = ["data-dsa-root", "data-dsa-block", "data-dsa-direction", "data-dsa-editor", "data-dsa-inline"];
  let settings = { ...DEFAULTS };
  let timer = 0;
  const pending = new Set();

  function proseText(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest(EXCLUDED) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const text = [];
    while (walker.nextNode()) text.push(walker.currentNode.nodeValue);
    return text.join(" ");
  }

  function markDirection(element, text) {
    const direction = directionFor(text, settings.mode);
    if (element.dataset.dsaDirection !== direction) element.dataset.dsaDirection = direction;
  }

  function processRoot(root) {
    if (!root.isConnected || root.closest(EXCLUDED)) return;
    root.dataset.dsaRoot = "";
    markDirection(root, proseText(root));
    for (const block of root.querySelectorAll(BLOCKS)) {
      if (block.closest(EXCLUDED)) continue;
      block.dataset.dsaBlock = "";
      markDirection(block, proseText(block));
    }
    // Some renderer versions use plain divs instead of paragraph elements.
    for (const div of root.querySelectorAll("div")) {
      if (div.closest(EXCLUDED) || div.matches(BLOCKS)) continue;
      const hasDirectText = [...div.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (hasDirectText && !div.querySelector("p, div, pre, table, ul, ol")) {
        div.dataset.dsaBlock = "";
        markDirection(div, proseText(div));
      }
    }
    for (const link of root.querySelectorAll("a[href]")) {
      if (link.closest(EXCLUDED)) continue;
      link.dataset.dsaInline = directionFor(link.textContent);
    }
  }

  function processEditor(editor) {
    if (!editor.isConnected) return;
    editor.dataset.dsaEditor = "";
    markDirection(editor, editor instanceof HTMLTextAreaElement ? editor.value : editor.textContent);
  }

  function scan(scope) {
    if (!settings.enabled || !scope.isConnected) return;
    const roots = new Set();
    if (scope instanceof Element) {
      const parentRoot = scope.closest(ROOTS);
      if (parentRoot) roots.add(parentRoot);
    }
    scope.querySelectorAll?.(ROOTS).forEach(root => roots.add(root));
    // Use the innermost content root so message action bars don't inherit the
    // prose direction/font from an outer message shell.
    for (const root of roots) {
      if (!root.querySelector(ROOTS)) processRoot(root);
    }
    if (scope.matches?.(EDITORS)) processEditor(scope);
    scope.querySelectorAll?.(EDITORS).forEach(processEditor);
  }

  function flush() {
    timer = 0;
    const scopes = [...pending];
    pending.clear();
    if (!settings.enabled) return;
    for (const scope of scopes) {
      if (!scopes.some(other => other !== scope && other.contains(scope))) scan(scope);
    }
  }

  function queue(node) {
    if (!settings.enabled) return;
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    if (!element) return;
    pending.add(element.closest?.(ROOTS) ?? element);
    // A bounded throttle updates streamed replies without rescanning the entire
    // conversation on each token. Our own data attributes aren't observed.
    if (!timer) timer = window.setTimeout(flush, 80);
  }

  function applySettings(value) {
    settings = normalizeSettings(value);
    const html = document.documentElement;
    html.toggleAttribute("data-dsa-enabled", settings.enabled);
    html.toggleAttribute("data-dsa-font", settings.enabled && settings.readableFont);
    if (settings.enabled) {
      html.style.setProperty("--dsa-font-size", `${settings.fontSize}px`);
      scan(document);
    } else {
      html.style.removeProperty("--dsa-font-size");
      pending.clear();
      clearTimeout(timer);
      timer = 0;
      document.querySelectorAll("[data-dsa-root], [data-dsa-editor], [data-dsa-block], [data-dsa-inline]").forEach(element => {
        for (const attr of ATTRS) element.removeAttribute(attr);
      });
    }
  }

  document.addEventListener("input", event => {
    if (!settings.enabled) return;
    const editor = event.target.closest?.(EDITORS);
    if (editor) processEditor(editor);
  }, true);

  const observer = new MutationObserver(mutations => {
    if (!settings.enabled) return;
    for (const mutation of mutations) {
      queue(mutation.target);
      // scan(target) includes added nodes, including roots mounted by SPA routing.
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["class", "contenteditable", "role", "id"]
  });

  let storageRevision = 0;
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[STORAGE_KEY]) {
      storageRevision++;
      applySettings(changes[STORAGE_KEY].newValue);
    }
  });
  const initialRevision = storageRevision;
  chrome.storage.local.get(STORAGE_KEY).then(result => {
    if (storageRevision === initialRevision) applySettings(result[STORAGE_KEY]);
  }).catch(() => {
    if (storageRevision === initialRevision) applySettings(DEFAULTS);
  });
})();
