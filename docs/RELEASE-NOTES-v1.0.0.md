# v1.0.0 — نسخة تجريبية / Preview

First public preview of **DeepSeek عربي — RTL & LTR**, an independent Chrome/Edge extension for Arabic and mixed Arabic/English reading and writing on `chat.deepseek.com`.

الميزات: اتجاه تلقائي لكل فقرة، RTL/LTR يدوي، اتجاه مربع الكتابة، خط محلي وحجم قابل للتعديل، وحماية اتجاه الأكواد والمعادلات والروابط.

## التنزيل الصحيح

- **للتثبيت اليدوي:** `deepseek-arabic-1.0.0.zip`. فك الضغط، فعّل Developer mode في صفحة الإضافات، ثم Load unpacked واختر مجلد `deepseek-arabic` الذي يحتوي `manifest.json`، وحدّث تبويب DeepSeek.
- **للتقديم إلى متجر Chrome/Edge:** `deepseek-arabic-1.0.0-store.zip`. هذه حزمة للمطور؛ لم تُرسل الإضافة إلى المتاجر بعد. يوجد `manifest.json` في جذرها.
- **للتحقق من التنزيل:** `SHA256SUMS.txt`.

## التحقق والحدود

نجحت 9 مجموعات لاختبارات الاتجاه والإعدادات و42 حالة تحقق في Chromium على محادثة تجريبية محلية مع تحميل الإضافة الفعلية. نجحت أيضاً تجربة المفكرة التعليمية المنفصلة في التحميل والحفظ وإعادة الفتح والمسح.

تعذر التحقق من محادثة حقيقية في جلسة إعداد النسخة لأن الموقع أعاد HTTP 403 لمتصفح الاختبار. هذه نسخة تجريبية؛ اختبرها بحسابك وأبلغ عن مشكلات التوافق دون نشر محادثات خاصة. محددات واجهة الموقع قد تحتاج تحديثاً عند تغيّر DeepSeek.

No chat text is stored or transmitted by the extension. Only four display preferences are saved locally. No runtime dependencies, analytics, remote code, or API key.

[تعليمات التثبيت](https://github.com/GhaithALEdlbi/deepseek-arabic#readme) · [الخصوصية](https://github.com/GhaithALEdlbi/deepseek-arabic/blob/main/PRIVACY.md) · [الإبلاغ عن مشكلة](https://github.com/GhaithALEdlbi/deepseek-arabic/issues)

This project is not affiliated with DeepSeek or RTL/LTR Magic. MIT license.
