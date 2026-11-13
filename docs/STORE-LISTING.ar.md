# نصوص جاهزة لصفحة المتجر

هذه مسودات للنسخة 1.0.0 الحالية. راجعها إذا أضفت ميزات أو صلاحيات قبل الإرسال. الإضافة لم تُرسل إلى المتجر بعد.

## الاسم

DeepSeek عربي — RTL & LTR

## الوصف القصير

قراءة وكتابة أوضح في DeepSeek: اتجاه ذكي للعربية والإنجليزية، مع الحفاظ على الأكواد والمعادلات.

## الوصف الكامل

DeepSeek عربي إضافة مستقلة لتحسين عرض وكتابة النص العربي والإنجليزي المختلط داخل chat.deepseek.com.

تحدد الإضافة اتجاه كل فقرة تلقائياً؛ العربي من اليمين والإنجليزي من اليسار. ويمكنك اختيار RTL أو LTR يدوياً من نافذة إعدادات عربية، مع معاينة مباشرة.

الميزات:
- ضبط اتجاه النص ومربع الكتابة أثناء الإدخال.
- متابعة الفقرات الجديدة أثناء ظهور الرد.
- الإبقاء على اتجاه الأكواد والمعادلات من اليسار إلى اليمين.
- عزل الروابط والأكواد المضمنة ضمن الجمل المختلطة.
- اتجاه مستقل لخلايا الجداول مع الحفاظ على ترتيب الأعمدة.
- خط محلي أوضح، وحجم نص من 14 إلى 22، وتباعد مريح للأسطر.
- تعطيل مباشر واستعادة تنسيق الموقع الأصلي.

تُعالج النصوص محلياً داخل المتصفح. لا تحفظ الإضافة محتوى المحادثات أو ترسله لأي جهة. تحفظ أربعة إعدادات عرض فقط على جهازك، دون تحليلات أو خطوط خارجية أو حساب إضافي أو API key.

تعمل فقط على نسخة DeepSeek على الويب في متصفحات الكمبيوتر المتوافقة مع Chromium. كشف الاتجاه تقريبي ويمكن ضبطه يدوياً. قد يحتاج التكامل إلى تحديث إذا تغيّرت بنية الموقع.

مشروع مفتوح المصدر بترخيص MIT، غير تابع لشركة DeepSeek أو لمطوري RTL/LTR Magic.

الدعم والكود: https://github.com/GhaithALEdlbi/deepseek-arabic

## Privacy practices — نصوص مقترحة

**Single purpose:** Improve the reading and writing direction of Arabic/English text on chat.deepseek.com, while preserving code and math direction.

**Storage justification:** The storage permission saves only four local display preferences: enabled state, direction mode, readable-font option, and font size. No message text or editor text is stored.

**Site access justification:** Access is limited to https://chat.deepseek.com/* so the content script can inspect visible chat text and supported input text locally, determine writing direction, and apply CSS and presentation attributes. No chat text is transmitted or persisted.

**Remote code:** No remote code is used. All JavaScript and styles are bundled in the extension. No eval, remotely hosted scripts, or downloaded executable code.

**Data handling:** The extension accesses message and input text locally for direction detection, but does not collect it for transmission or retain it. Only the four preferences are retained locally. راجع تعريفات النموذج عند تعبئته، وصرّح بالمعالجة المحلية للنص بدقة؛ لا تضف ادعاء أن الإضافة لا تقرأ محتوى الصفحة.

**Privacy policy URL:** https://github.com/GhaithALEdlbi/deepseek-arabic/blob/main/PRIVACY.md

**Support URL:** https://github.com/GhaithALEdlbi/deepseek-arabic/issues

**Website URL:** https://github.com/GhaithALEdlbi/deepseek-arabic

**Category:** اختر من الفئات المتاحة في لوحة المتجر الفئة الأقرب لتحسين القراءة والإنتاجية.

## تعليمات للمراجع

1. Install the extension and open https://chat.deepseek.com/ using your own DeepSeek account if login is required. The extension has no separate account, subscription, or paid features.
2. Enter Arabic text containing English terms, for example: اشرح React مع مثال JavaScript.
3. Check automatic paragraph direction and input direction. Code and math should remain LTR.
4. Open the extension popup and test Auto, RTL, LTR, font size, font option, disable, and reset.
5. Confirm changes apply without reloading an already injected DeepSeek tab, and persist after reopening the popup.

لا تضع بيانات دخول حسابك الشخصي في تعليمات المراجعة. إذا طلب المتجر حساب اختبار، اتبع متطلبات لوحة المتجر وقدّم حساب اختبار منفصلاً عند الحاجة.

المراجع الرسمية: [حقول الخصوصية](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)، [سياسة الخصوصية](https://developer.chrome.com/docs/webstore/program-policies/privacy).
