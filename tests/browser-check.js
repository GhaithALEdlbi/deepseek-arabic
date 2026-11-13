async (page) => {
  // Run with Playwright CLI run-code --filename in a persistent Chromium
  // session with the unpacked extension loaded. This uses its real storage API.
  const checks = [];
  function check(condition, name) {
    if (!condition) throw new Error(name);
    checks.push(name);
  }
  await page.goto("chrome://extensions/");
  const extension = page.locator("extensions-item").filter({ hasText: "DeepSeek عربي" });
  const id = await extension.getAttribute("id");
  check(Boolean(id), "Extension is installed and enabled in Chromium");
  const popup = await page.context().newPage();
  const errors = [];
  popup.on("pageerror", error => errors.push(error.message));
  page.on("pageerror", error => errors.push(error.message));
  const popupURL = `chrome-extension://${id}/popup.html`;
  await popup.goto(popupURL);
  await popup.locator("#reset").click();
  await popup.waitForFunction(() => document.querySelector("#status").textContent.startsWith("تم الحفظ"));

  const fixture = `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title>Local DeepSeek conversation fixture</title>
    <style>body{margin:0;font:16px/1.6 Arial;color:#203b40;background:#f4f7f5;display:grid;grid-template-columns:190px 1fr}nav{padding:24px;background:#e3ede6;min-height:100vh}main{max-width:760px;padding:30px}h1{font-size:22px}.ds-message{background:white;padding:20px;border-radius:14px;margin:15px 0}pre{padding:16px;background:#203b40;color:#f0fff8;border-radius:8px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #c8d7cc;padding:10px}textarea,[contenteditable]{display:block;width:100%;box-sizing:border-box;border:1px solid #a3b9ab;border-radius:8px;padding:12px;margin-top:16px}p{margin:10px 0}</style></head><body>
    <nav><p id="sidebar">Sidebar stays left to right</p><a href="#">New chat</a></nav>
    <main><h1>DeepSeek عربي · local compatibility check</h1>
    <article class="ds-message"><div class="ds-markdown" id="reply">
    <p id="arabic" dir="ltr">مرحباً! فيك تستخدم <code id="inline-code">fetch(url)</code> مع <a id="english-link" href="https://example.com/docs?q=rtl">https://example.com/docs?q=rtl</a> بكل سهولة.</p>
    <p id="english">This paragraph stays left to right, with punctuation (and numbers 123).</p>
    <div class="ds-markdown-paragraph" id="mixed">React هي مكتبة لبناء واجهات المستخدم، وبتشتغل مع JavaScript.</div>
    <p id="code-heavy">جرب: <code>aVeryLongEnglishVariableNameThatShouldNotOutweighArabic</code></p>
    <ul id="list"><li id="arabic-li">العنصر الأول مع English</li><li id="english-li">English item</li></ul>
    <blockquote><p id="quote">هذا اقتباس عربي مع كلمة English.</p></blockquote>
    <pre id="pre"><code id="block-code">const message = "مرحبا";\nconsole.log(message);</code></pre>
    <div class="katex-display" id="math-display"><span class="katex" id="math">x + y = 123</span></div>
    <table id="table"><thead><tr><th>الاسم</th><th>Name</th></tr></thead><tbody><tr><td id="arabic-cell">نص عربي</td><td id="english-cell">English text</td></tr></tbody></table>
    <p id="stream">Hello</p></div><button id="copy" type="button">Copy</button></article>
    <div class="fbb737a4" id="legacy-user">هذا سؤال المستخدم مع English.</div>
    <div data-message-author-role="user" id="semantic-user">رسالة مستخدم ثانية.</div>
    <textarea id="chat-input" dir="ltr" placeholder="Message DeepSeek"></textarea>
    <div contenteditable="true" role="textbox" id="rich-editor" aria-label="Rich text input"></div>
    </main></body></html>`;
  let requests = 0;
  await page.route("https://chat.deepseek.com/**", route => {
    requests++;
    return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: fixture });
  });
  await page.goto("https://chat.deepseek.com/rtl-local-test");
  await page.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "rtl");
  const direction = selector => page.locator(selector).evaluate(element => getComputedStyle(element).direction);
  const originalText = await page.locator("main").textContent();
  const originalValue = await page.locator("#chat-input").inputValue();
  check(await direction("#arabic") === "rtl", "Arabic prose uses RTL even if host supplied dir=ltr");
  check(await direction("#mixed") === "rtl", "English-leading Arabic paragraph uses RTL");
  check(await direction("#code-heavy") === "rtl", "Inline code is excluded from prose direction detection");
  check(await direction("#english") === "ltr", "English paragraph stays LTR");
  check(await direction("#arabic-li") === "rtl" && await direction("#english-li") === "ltr", "List items use independent directions");
  check(await direction("#quote") === "rtl", "Blockquotes support Arabic");
  for (const selector of ["#pre", "#block-code", "#inline-code", "#math", "#math-display", "#english-link", "#table"]) {
    check(await direction(selector) === "ltr", `${selector} stays LTR`);
  }
  check(await direction("#arabic-cell") === "rtl" && await direction("#english-cell") === "ltr", "Table cells retain independent directions");
  check(await direction("#sidebar") === "ltr" && await direction("#copy") === "ltr", "Sidebar and message action layout stay unchanged");
  check(await direction("#legacy-user") === "rtl" && await direction("#semantic-user") === "rtl", "Legacy and semantic user messages are supported");

  await page.locator("#chat-input").fill("اشرحلي React مع مثال");
  check(await direction("#chat-input") === "rtl", "Textarea switches to RTL while typing Arabic");
  check(await page.locator("#chat-input").inputValue() === "اشرحلي React مع مثال", "Typed text is preserved exactly");
  check(await page.locator("#chat-input").getAttribute("dir") === "ltr", "Host input dir attribute is never overwritten");
  await page.locator("#chat-input").fill("Explain React with an example");
  check(await direction("#chat-input") === "ltr", "Textarea switches back for English");
  await page.locator("#chat-input").fill("");
  check(await direction("#chat-input") === "ltr", "Empty textarea resets its direction");
  await page.locator("#rich-editor").fill("نص عربي قابل للتحرير");
  check(await direction("#rich-editor") === "rtl", "Contenteditable textbox switches while typing");
  await page.locator("#rich-editor").fill("");

  // Update a Text node, then append new paragraphs: both streaming forms matter.
  await page.locator("#stream").evaluate(element => { element.firstChild.nodeValue = "React هي مكتبة لتصميم واجهات المستخدم"; });
  await page.waitForFunction(() => document.querySelector("#stream").dataset.dsaDirection === "rtl");
  check(await direction("#stream") === "rtl", "Streamed characterData updates are processed");
  await page.locator("#reply").evaluate(element => {
    const paragraph = document.createElement("p"); paragraph.id = "new-paragraph"; paragraph.textContent = "New English paragraph"; element.append(paragraph);
  });
  await page.waitForFunction(() => document.querySelector("#new-paragraph").dataset.dsaDirection === "ltr");
  check(await direction("#new-paragraph") === "ltr", "New streamed paragraphs are processed");
  await page.locator("#stream").evaluate(element => { element.textContent = "Hello"; });
  await page.locator("#new-paragraph").evaluate(element => element.remove());

  await popup.locator('input[name="mode"][value="rtl"]').check();
  await page.waitForFunction(() => document.querySelector("#english").dataset.dsaDirection === "rtl");
  check(await direction("#english") === "rtl" && await direction("#block-code") === "ltr", "Forced RTL updates an open tab and preserves code");
  await popup.locator('input[name="mode"][value="ltr"]').check();
  await page.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "ltr");
  check(await direction("#arabic") === "ltr", "Forced LTR applies to Arabic");

  await popup.locator("#font-size").fill("20");
  await page.waitForFunction(() => getComputedStyle(document.querySelector("#reply")).fontSize === "20px");
  check(await page.locator("#reply").evaluate(element => getComputedStyle(element).fontSize) === "20px", "Font-size setting updates open tabs");
  await popup.locator("#readable-font").uncheck();
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-dsa-font"));
  check(true, "Local font setting toggles without reloading");
  await popup.waitForFunction(() => document.querySelector("#status").textContent.startsWith("تم الحفظ"));
  await popup.reload();
  await popup.locator("#reset").waitFor({ state: "visible" });
  await popup.waitForFunction(() => !document.querySelector("#reset").disabled);
  check(await popup.locator("#font-size").inputValue() === "20" && await popup.locator('input[value="ltr"]').isChecked(), "Settings persist across popup reload");
  const stored = await popup.evaluate(async () => (await chrome.storage.local.get(null)));
  check(Object.keys(stored).length === 1 && Object.keys(stored.deepseekArabicSettings).length === 4, "Only four preferences are stored; no conversation text");

  await popup.locator("#enabled").uncheck();
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-dsa-enabled"));
  check(await page.locator("[data-dsa-root], [data-dsa-editor], [data-dsa-block], [data-dsa-inline], [data-dsa-direction]").count() === 0, "Disabling removes all extension marks");
  check(await direction("#arabic") === "ltr" && await direction("#legacy-user") === "ltr", "Disabling restores host direction");
  check(await page.locator("main").textContent() === originalText, "Conversation text and markup text remain unchanged");
  check(await page.locator("#chat-input").inputValue() === originalValue, "Editor value is not rewritten");
  check(await popup.locator("#settings").evaluate(element => element.disabled), "Reading controls are disabled when the extension is off");

  await popup.locator("#reset").click();
  await page.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "rtl");
  check(await popup.locator('input[value="auto"]').isChecked() && await popup.locator("#enabled").isChecked(), "Reset restores automatic mode and re-enables the extension");
  const second = await page.context().newPage();
  await second.route("https://chat.deepseek.com/**", route => route.fulfill({ status: 200, contentType: "text/html", body: fixture }));
  await second.goto("https://chat.deepseek.com/rtl-local-test-second");
  await second.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "rtl");
  await popup.locator('input[value="ltr"]').check();
  await Promise.all([page, second].map(tab => tab.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "ltr")));
  check(true, "Storage changes update multiple open DeepSeek tabs");
  await second.close();
  await popup.locator("#reset").click();
  await page.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "rtl");

  await page.locator("main").evaluate(element => {
    history.pushState({}, "", "/a/chat/spa-route");
    element.innerHTML = '<article class="ds-message"><div class="ds-markdown"><p id="routed">محادثة جديدة بعد التنقل</p></div></article><textarea id="chat-input"></textarea>';
  });
  await page.waitForFunction(() => document.querySelector("#routed").dataset.dsaDirection === "rtl");
  check(await direction("#routed") === "rtl", "SPA route changes process newly mounted messages");
  await page.locator("#chat-input").fill("رسالة بعد التنقل");
  check(await direction("#chat-input") === "rtl", "Replacement editor is detected after navigation");

  // Restore the full fixture for a useful screenshot.
  await page.goto("https://chat.deepseek.com/rtl-local-test");
  await page.waitForFunction(() => document.querySelector("#arabic").dataset.dsaDirection === "rtl");
  await page.screenshot({ path: "output/playwright/conversation.png", fullPage: true });
  await popup.setViewportSize({ width: 380, height: 600 });
  await popup.screenshot({ path: "output/playwright/popup.png", fullPage: true });
  check(await popup.locator("body").evaluate(element => element.scrollWidth <= 380), "Popup has no horizontal overflow");
  check(errors.length === 0, `No extension or page errors: ${errors.join(", ")}`);
  await popup.close();
  return { passed: checks.length, checks, fixtureRequests: requests, note: "Local intercepted fixture, not a live authenticated DeepSeek conversation." };
}
