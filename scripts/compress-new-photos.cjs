// Сжимает свежескачанные фото (список путей в /tmp/new-imgs.txt) на месте:
// max 800px, JPEG q80, без метаданных. Срезает вес в ~5-6 раз.
// node scripts/compress-new-photos.cjs
const fs = require('fs');
const sharp = require('sharp');

const LIST_FILE = process.argv[2] || 'new-imgs.txt';
const list = fs.readFileSync(LIST_FILE, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
console.log('к сжатию:', list.length);

async function pool(arr, limit, fn) {
  let i = 0; let done = 0; let saved = 0; let fail = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < arr.length) {
      const f = arr[i++];
      try {
        const input = fs.readFileSync(f); // читаем в буфер — sharp не держит файловый хэндл
        const buf = await sharp(input).rotate().resize(800, 800, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        if (buf.length < input.length) { fs.writeFileSync(f, buf); saved += input.length - buf.length; }
      } catch (e) { fail++; if (fail <= 3) console.log('  ERR', f.split(/[\\/]/).pop(), String(e.message).slice(0, 90)); }
      if (++done % 400 === 0) console.log(`  …${done}/${arr.length} (сэкономлено ${Math.round(saved / 1048576)} MB, ошибок ${fail})`);
    }
  }));
  console.log(`Готово: ${done}, ошибок ${fail}, сэкономлено ${Math.round(saved / 1048576)} MB`);
}

pool(list, 8, () => {});
