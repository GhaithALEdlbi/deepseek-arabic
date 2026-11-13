# كيف توصل الإضافة للناس؟

هناك مساران: تنزيل وتجربة يدوية الآن عبر GitHub، وتثبيت عادي من متجر الإضافات بعد المراجعة.

## 1. المشاركة الآن عبر GitHub

شارك [رابط المشروع](https://github.com/GhaithALEdlbi/deepseek-arabic) أو [الإصدار التجريبي v1.0.0](https://github.com/GhaithALEdlbi/deepseek-arabic/releases/tag/v1.0.0).

المستخدم ينزّل `deepseek-arabic-1.0.0.zip` ويفك الضغط، ويفتح `chrome://extensions` أو `edge://extensions`، ويفعّل Developer mode، ثم Load unpacked، ويختار مجلد `deepseek-arabic` الذي يحتوي `manifest.json`. بعدها يحدّث تبويب DeepSeek.

هذا مناسب للتجربة والمطورين، ويحتاج خطوات يدوية وتحديثاً يدوياً عند صدور نسخة جديدة. وجود المستودع العام وحده لا يضيف الإضافة إلى متجر Chrome.

## 2. النشر في Chrome Web Store

1. جرّب النسخة على محادثة حقيقية بحسابك في DeepSeek، مع عربي وإنجليزي مختلط، رد متدرج، أكواد، معادلات، جداول، وإيقاف الإضافة. الاختبارات الحالية محلية؛ واجه متصفح الاختبار خطأ 403 عند الوصول للموقع الحقيقي. توصي Google باختبار ميزات الإضافة على الموقع المستهدف قبل الرفع. [المصدر](https://developer.chrome.com/docs/webstore/prepare).
2. سجّل حساب مطوّر عبر [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). التسجيل يتطلب رسماً لمرة واحدة؛ تحقّق من المبلغ والأهلية والبلدان المدعومة أثناء التسجيل. لا يلزم شراء استضافة للإضافة نفسها. [تفاصيل التسجيل](https://developer.chrome.com/docs/webstore/register).
3. شغّل `npm test` و`npm run check` ثم `npm run package`. ارفع **`dist/deepseek-arabic-1.0.0-store.zip`**. هذه الحزمة تحتوي `manifest.json` في الجذر؛ لا ترفع ZIP مصدر GitHub أو الحزمة اليدوية ذات المجلد الإضافي. [متطلبات الحزمة](https://developer.chrome.com/docs/webstore/prepare).
4. من اللوحة اختر **Add new item** وارفع الحزمة، ثم املأ Store Listing وPrivacy practices وDistribution، وTest instructions عند الحاجة. الوصف وشرح الصلاحيات وروابط الدعم جاهزة في [STORE-LISTING.ar.md](STORE-LISTING.ar.md). [خطوات الإرسال الرسمية](https://developer.chrome.com/docs/webstore/publish).
5. أضف أيقونة المتجر PNG بقياس 128×128، ولقطة واحدة على الأقل بقياس 1280×800 أو 640×400. لقطات README الحالية تُظهر نافذة الإضافة ومحادثة تجريبية؛ ليست بالحجم المطلوب للمتجر، فالتقط صوراً مناسبة من التجربة الفعلية. للصورة المربعة، راجع أيضاً إرشاد مساحة الرسم 96×96 مع هامش شفاف 16 بكسل. [متطلبات الصور](https://developer.chrome.com/docs/webstore/images).
6. ضع رابط [سياسة الخصوصية](https://github.com/GhaithALEdlbi/deepseek-arabic/blob/main/PRIVACY.md). الإضافة تقرأ النص وتعالجه محلياً؛ السياسة توضح أنها لا تحفظ نص المحادثة ولا ترسله. راجعها إذا تغيّر الكود أو أُضيفت تحليلات. [سياسة Google](https://developer.chrome.com/docs/webstore/program-policies/privacy).
7. اختر توزيعاً عاماً **Public**، وحدد البلدان المتاحة حسب حسابك، ثم **Submit for Review**. اختر النشر بعد الموافقة أو النشر اليدوي لاحقاً حسب رغبتك. الموافقة ووقت المراجعة يحددهما المتجر. [إجراءات النشر](https://developer.chrome.com/docs/webstore/publish).
8. بعد الموافقة، شارك رابط صفحة الإضافة في المتجر وأضفه إلى README والبوست؛ يصبح التثبيت من زر المتجر بدلاً من Developer mode.

الحساب والدفع والتحقق من الهوية ومراجعة المتجر لا تنفذها حزمة المشروع. المستودع وحزمة المتجر لا تعنيان قبول المتجر للإضافة.

## 3. Microsoft Edge Add-ons

يمكن التقديم أيضاً عبر [Microsoft Partner Center](https://partner.microsoft.com/dashboard). برنامج إضافات Edge لا يفرض رسم تسجيل بحسب وثائق Microsoft الحالية. سجّل في برنامج Edge، وقدّم حزمة الإضافة ووصفها وصورها وسياسة الخصوصية واتبع المراجعة. تحقّق من تشغيلها في Edge قبل التقديم. [توثيق التسجيل](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/create-dev-account).

## 4. إصدار تحديث

1. عدّل الكود وجرّب التغيير على DeepSeek الحقيقي.
2. ارفع `version` في `deepseek-arabic/manifest.json`، وحدّث نسخة `package.json` للاتساق.
3. شغّل الفحوص وأعد `npm run package`.
4. أنشئ GitHub Release جديداً مع الحزم وملف `SHA256SUMS.txt`.
5. إذا كانت الإضافة منشورة، ارفع حزمة `-store.zip` كنسخة جديدة لنفس عنصر المتجر، ولا تنشئ إضافة جديدة لكل تحديث. يجب أن يكون رقم النسخة أكبر من السابق. [متطلبات النسخ](https://developer.chrome.com/docs/webstore/prepare).

## قبل إرسال البوست

البوست الحالي يصف نسخة تجريبية على GitHub. اترك هذا الوصف كما هو حتى يصدر رابط متجر فعلي. ويمكن إرفاق `docs/assets/popup.png` معه؛ صورة المحادثة الأخرى عبارة عن بيانات تجريبية محلية، وليست محادثة مستخدم حقيقية.

تمت مراجعة روابط التوثيق بتاريخ 14 نوفمبر 2026؛ قد تتغيّر أسماء الحقول والمتطلبات لاحقاً.
