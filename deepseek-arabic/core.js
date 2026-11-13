/* Shared by the content script and popup. No network calls or page-text storage. */
(() => {
  "use strict";

  const STORAGE_KEY = "deepseekArabicSettings";
  const DEFAULTS = Object.freeze({
    enabled: true,
    mode: "auto",
    readableFont: true,
    fontSize: 16
  });

  function normalizeSettings(value = {}) {
    if (!value || typeof value !== "object") value = {};
    const fontSize = Number(value.fontSize ?? DEFAULTS.fontSize);
    return {
      enabled: typeof value.enabled === "boolean" ? value.enabled : DEFAULTS.enabled,
      mode: ["auto", "rtl", "ltr"].includes(value.mode) ? value.mode : DEFAULTS.mode,
      readableFont: typeof value.readableFont === "boolean" ? value.readableFont : DEFAULTS.readableFont,
      fontSize: Number.isFinite(fontSize) ? Math.min(22, Math.max(14, Math.round(fontSize))) : DEFAULTS.fontSize
    };
  }

  function directionFor(text, mode = "auto") {
    if (mode === "rtl" || mode === "ltr") return mode;
    // Ignore URLs, addresses and inline code so a long technical token doesn't
    // outweigh the surrounding Arabic prose. Digits and diacritics aren't letters.
    const prose = String(text ?? "")
      .replace(/(?:https?:\/\/|www\.)[^\s<>]+/giu, " ")
      .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/giu, " ")
      .replace(/`[^`]*`/gu, " ");
    const letters = prose.match(/\p{L}/gu) ?? [];
    if (!letters.length) return "ltr";
    const isArabic = letter => /\p{Script_Extensions=Arabic}/u.test(letter);
    const arabicCount = letters.filter(isArabic).length;
    // Arabic paragraphs often begin with a product name such as API or React.
    return isArabic(letters[0]) || arabicCount / letters.length >= 0.25 ? "rtl" : "ltr";
  }

  globalThis.DeepSeekArabic = Object.freeze({ STORAGE_KEY, DEFAULTS, normalizeSettings, directionFor });
})();
