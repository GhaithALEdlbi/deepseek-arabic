"use strict";

const note = document.getElementById("note");
const save = document.getElementById("save");
const status = document.getElementById("status");

// 1. Load the saved note every time the popup opens.
chrome.storage.local.get("note").then(result => {
  note.value = typeof result.note === "string" ? result.note : "";
  note.disabled = false;
  save.disabled = false;
  status.textContent = "الملاحظة بتبقى محفوظة بعد إغلاق النافذة.";
}).catch(() => {
  status.textContent = "تعذّر التحميل. أغلق النافذة وافتحها مجدداً.";
});

// 2. Save when the user clicks. No website access or server is involved.
save.addEventListener("click", async () => {
  save.disabled = true;
  try {
    await chrome.storage.local.set({ note: note.value });
    status.textContent = "تم الحفظ ✓";
  } catch {
    status.textContent = "ما انحفظت. جرّب مرة ثانية.";
  } finally {
    save.disabled = false;
  }
});
