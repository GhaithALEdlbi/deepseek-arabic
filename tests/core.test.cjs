const { test } = require("node:test");
const assert = require("node:assert/strict");
require("../deepseek-arabic/core.js");
const { directionFor, normalizeSettings, DEFAULTS } = globalThis.DeepSeekArabic;

test("Arabic, vowel marks, Arabic numerals and punctuation", () => {
  for (const text of ["مرحباً بالعالم", "١٢٣ — كيف الحال؟", "«أَهْلًا وسَهْلًا!»"]) {
    assert.equal(directionFor(text), "rtl");
  }
});
test("English, empty and neutral text", () => {
  for (const text of ["Hello world", "123 😄", "", null, "Use the API."]) assert.equal(directionFor(text), "ltr");
});
test("Arabic prose beginning with an English product name", () => {
  assert.equal(directionFor("React هي مكتبة لبناء واجهات المستخدم"), "rtl");
  assert.equal(directionFor("API: هي واجهة برمجية بتساعدك تربط تطبيقك بالخدمات"), "rtl");
});
test("a short Arabic quotation doesn't flip an English paragraph", () => {
  assert.equal(directionFor('The Arabic word "مرحبا" is a greeting used to welcome people.'), "ltr");
});
test("long technical tokens don't outweigh Arabic prose", () => {
  assert.equal(directionFor("https://example.com/an/extremely/long/english/address افتح الرابط"), "rtl");
  assert.equal(directionFor("developer.long.address@example.com ابعت هون"), "rtl");
  assert.equal(directionFor("`aVeryLongEnglishVariableName` هذا المتغير"), "rtl");
});
test("manual directions override prose detection", () => {
  assert.equal(directionFor("English", "rtl"), "rtl");
  assert.equal(directionFor("نص عربي", "ltr"), "ltr");
});
test("defaults survive missing, malformed and removed storage", () => {
  for (const value of [undefined, null, false, {}, "bad"]) assert.deepEqual(normalizeSettings(value), DEFAULTS);
  assert.deepEqual(normalizeSettings({ mode: "invalid", enabled: "false", readableFont: 0, fontSize: "oops" }), DEFAULTS);
});
test("font size is finite, bounded and integral", () => {
  assert.equal(normalizeSettings({ fontSize: 300 }).fontSize, 22);
  assert.equal(normalizeSettings({ fontSize: -5 }).fontSize, 14);
  assert.equal(normalizeSettings({ fontSize: "18.8" }).fontSize, 19);
  assert.equal(normalizeSettings({ fontSize: Infinity }).fontSize, 16);
});
test("false settings are preserved; unknown storage properties are dropped", () => {
  assert.deepEqual(normalizeSettings({ enabled: false, readableFont: false, mode: "ltr", fontSize: 19, text: "private" }), {
    enabled: false, readableFont: false, mode: "ltr", fontSize: 19
  });
});
