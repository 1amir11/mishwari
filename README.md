# مشواري — Mishwari

دفتر السناتر والمواصلات، لـ workers اللي بتتحرك بين أكتر من مكان شغل.

**التطبيق:** PWA (Progressive Web App) — بيتثبت على الموبايل من كروم بدون متجر، وبيشتغل أوفلاين.

## طريقة التثبيت
1. افتح الرابط: `https://<user>.github.io/mishwari/`
2. على أندرويد: كروم هيعرض بانل **Install app** (أو من `⋮` → Install app).
3. على آيفون: لازم **Safari** → زر المشاركة ↑ → **Add to Home Screen**.

## تحديث النشر
النسخة المنشورة في مجلد `docs/`. بعد أي تعديل على الـ app:
```powershell
Copy-Item "C:\ai atuomation\job2\app\*" -Destination "C:\ai atuomation\job2\publish\docs" -Force
cd C:\ai atuomation\job2\publish; git add -A; git commit -m "update"; git push
```
التحديث بيوصل للموبايل من خلال الـ service worker (شبكة أولاً، كاش تاني).

## البيانات
كل البيانات محفوظة **محلياً على الجهاز** (`localStorage`) — مفيش سيرفر ومفيش حساب.
عشان كده:
- البيانات **مش بتنتقل** لو غيّرت الرابط أو الموبايل → استخدم **الإعدادات ← نسخة احتياطية**.
- **حفظ نسخة** بيصدّر ملف JSON، **استرجاع نسخة** بيستورده.

## الملفات
| الملف | الوظيفة |
|---|---|
| `docs/index.html` | التطبيق كله (HTML + CSS + JS في ملف واحد) |
| `docs/manifest.webmanifest` | بيانات التثبيت (الاسم، الأيقونات، الاتجاه RTL) |
| `docs/sw.js` | Service worker: تخزين الملفات + العمل بدون نت |
| `docs/.nojekyll` | يمنع Jekyll من لمس الملفات |
