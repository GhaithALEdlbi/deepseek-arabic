async (page) => {
  await page.goto("chrome://extensions/");
  const extension = page.locator("extensions-item").filter({ hasText: "أول إضافة إلي" });
  const id = await extension.getAttribute("id");
  if (!id) throw new Error("Tutorial extension is not installed");
  await page.goto(`chrome-extension://${id}/popup.html`);
  await page.waitForFunction(() => !document.querySelector("#save").disabled);
  await page.locator("#note").fill("ملاحظة عربية مع English 123");
  await page.locator("#save").click();
  await page.waitForFunction(() => document.querySelector("#status").textContent.includes("تم الحفظ"));
  await page.reload();
  await page.waitForFunction(() => !document.querySelector("#note").disabled);
  if (await page.locator("#note").inputValue() !== "ملاحظة عربية مع English 123") {
    throw new Error("Note did not persist across popup reload");
  }
  const manifest = await page.evaluate(() => chrome.runtime.getManifest());
  if (JSON.stringify(manifest.permissions) !== '["storage"]' || manifest.host_permissions) {
    throw new Error("Tutorial requests unexpected permissions");
  }
  await page.locator("#note").fill("");
  await page.locator("#save").click();
  await page.waitForFunction(() => document.querySelector("#status").textContent.includes("تم الحفظ"));
  await page.reload();
  await page.waitForFunction(() => !document.querySelector("#note").disabled);
  if (await page.locator("#note").inputValue() !== "") throw new Error("Clearing a note did not persist");
  return { passed: true, checks: ["popup loads", "mixed-language note saves", "note persists on reopen", "only local storage permission", "empty note persists"] };
}
