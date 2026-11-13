(() => {
  "use strict";
  const { STORAGE_KEY, DEFAULTS, normalizeSettings, directionFor } = globalThis.DeepSeekArabic;
  const enabled = document.getElementById("enabled");
  const fieldset = document.getElementById("settings");
  const font = document.getElementById("readable-font");
  const size = document.getElementById("font-size");
  const sizeValue = document.getElementById("font-size-value");
  const status = document.getElementById("status");
  const reset = document.getElementById("reset");
  const preview = document.getElementById("preview-content");
  const radios = [...document.querySelectorAll('input[name="mode"]')];
  let settings = { ...DEFAULTS };
  let ready = false;
  let revision = 0;
  let saves = Promise.resolve();

  function showStatus(text, error = false) {
    status.textContent = text;
    status.classList.toggle("error", error);
  }

  function render() {
    enabled.checked = settings.enabled;
    fieldset.disabled = !ready || !settings.enabled;
    enabled.disabled = !ready;
    reset.disabled = !ready;
    document.body.toggleAttribute("data-disabled", !settings.enabled);
    font.checked = settings.readableFont;
    size.value = settings.fontSize;
    sizeValue.textContent = `${settings.fontSize} px`;
    radios.forEach(radio => { radio.checked = radio.value === settings.mode; });
    document.getElementById("activation-detail").textContent = settings.enabled ? "تحسين اتجاه المحادثة والكتابة" : "متوقفة — فعّلها لقراءة أوضح";
    document.getElementById("mode-hint").textContent = {
      auto: "العربي يمين، الإنجليزي يسار. حتى ضمن نفس الرد.",
      rtl: "كل الفقرات من اليمين. الأكواد بتضل من اليسار.",
      ltr: "كل الفقرات من اليسار. مناسب للمحتوى الإنجليزي."
    }[settings.mode];
    preview.style.setProperty("--preview-size", settings.enabled ? `${settings.fontSize}px` : "16px");
    preview.style.fontFamily = settings.enabled && settings.readableFont ? "Tahoma, Arial, sans-serif" : "system-ui, sans-serif";
    for (const paragraph of preview.querySelectorAll("p")) {
      paragraph.dir = settings.enabled ? directionFor(paragraph.textContent, settings.mode) : "ltr";
    }
  }

  function save(patch) {
    if (!ready) return;
    settings = normalizeSettings({ ...settings, ...patch });
    const snapshot = { ...settings };
    const currentRevision = ++revision;
    render();
    showStatus("جارٍ الحفظ…");
    // Serialize writes so rapid slider changes can never save an older value last.
    saves = saves.catch(() => {}).then(() => chrome.storage.local.set({ [STORAGE_KEY]: snapshot }));
    saves.then(() => {
      if (currentRevision === revision) showStatus("تم الحفظ · التغييرات بتتطبق مباشرة");
    }).catch(() => {
      if (currentRevision === revision) showStatus("تعذّر الحفظ. جرّب تغيير الإعداد مرة ثانية.", true);
    });
  }

  enabled.addEventListener("change", () => save({ enabled: enabled.checked }));
  radios.forEach(radio => radio.addEventListener("change", () => {
    if (radio.checked) save({ mode: radio.value });
  }));
  font.addEventListener("change", () => save({ readableFont: font.checked }));
  size.addEventListener("input", () => save({ fontSize: Number(size.value) }));
  reset.addEventListener("click", () => save(DEFAULTS));

  chrome.storage.local.get(STORAGE_KEY).then(result => {
    settings = normalizeSettings(result[STORAGE_KEY]);
    ready = true;
    render();
    showStatus("التغييرات بتتطبق مباشرة على تبويبات DeepSeek المفتوحة");
  }).catch(() => {
    render();
    showStatus("تعذّر تحميل الإعدادات. أغلق النافذة وافتحها مجدداً.", true);
  });
})();
