# خطوات نشر المشروع على GitHub Pages

## 1️⃣ إعداد مستودع GitHub

```bash
# إنشاء مستودع جديد على GitHub باسم "forma"
# قم برفع المشروع:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/forma.git
git push -u origin main
```

## 2️⃣ إضافة متغيرات البيئة

في إعدادات مستودعك على GitHub:

1. اذهب إلى **Settings** > **Secrets and variables** > **Actions**
2. أضف المتغيرات التالية:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`

## 3️⃣ تفعيل GitHub Pages

1. في المستودع، اذهب إلى **Settings** > **Pages**
2. حدد **Deploy from a branch**
3. اختر الفرع: **gh-pages**
4. احفظ التغييرات

## 4️⃣ النشر التلقائي

- كل push إلى `main` سيؤدي للنشر التلقائي 🚀
- يمكنك مراقبة التقدم في تبويب **Actions**

## ✅ رابط الموقع

```
https://YOUR-USERNAME.github.io/forma/
```

## 📝 ملاحظات

- تأكد من أن المستودع **public** (عام)
- إذا أردت تغيير اسم المستودع، عدّل قيمة `base` في `vite.config.ts`
