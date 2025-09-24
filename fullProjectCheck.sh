#!/bin/bash

echo "🔍 بدء الفحص الكامل لمشروع Tolay..."

# التأكد من وجود مجلد المشروع
PROJECT_DIR=~/TolayProject
if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ مجلد المشروع غير موجود في $PROJECT_DIR"
  exit 1
fi

cd "$PROJECT_DIR" || exit 1

# تحديث الحزم
echo "📦 تثبيت وتحديث الحزم..."
npm install

# فحص TypeScript
echo "🟢 فحص TypeScript..."
if ! command -v tsc >/dev/null 2>&1; then
  echo "⚠️ TypeScript غير مثبت، سيتم تثبيته..."
  npm install -g typescript
fi
npx tsc --noEmit

# فحص ESLint
echo "🟢 فحص ESLint..."
if ! command -v eslint >/dev/null 2>&1; then
  echo "⚠️ ESLint غير مثبت، سيتم تثبيته..."
  npm install -g eslint
fi
npx eslint .

# فحص الملفات المفقودة والمكونات
echo "🟢 التحقق من الملفات المفقودة في Next.js..."
find pages app components lib -type f -name "*.ts*" -o -name "*.js*" | while read FILE; do
  grep -H "from '.*'" "$FILE" | grep -v "node_modules" | while read LINE; do
    IMPORT_PATH=$(echo "$LINE" | sed -E "s/.*from '(.*)'.*/\1/")
    if [[ ! "$IMPORT_PATH" =~ ^[./] ]]; then
      continue
    fi
    RESOLVED_PATH="$PROJECT_DIR/$IMPORT_PATH"
    if [[ ! -f "${RESOLVED_PATH}.ts" && ! -f "${RESOLVED_PATH}.tsx" && ! -f "${RESOLVED_PATH}.js" && ! -f "${RESOLVED_PATH}.jsx" ]]; then
      echo "⚠️ الملف المستورد غير موجود: $IMPORT_PATH في $FILE"
    fi
  done
done

# فحص npm audit
echo "🟢 فحص مشاكل npm..."
npm audit

echo "✅ الفحص الكامل اكتمل. تحقق من التحذيرات والأخطاء أعلاه."
