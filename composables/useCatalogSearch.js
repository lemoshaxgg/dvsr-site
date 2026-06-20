// Поисковый движок каталога ДСР.
// Один источник истины для подсказок и для фильтрации списка:
//  - многословный запрос (AND по токенам)
//  - ранжирование по релевантности (начало title > title > категория > описание)
//  - терпимость к опечаткам (расстояние Левенштейна ≤1 для слов от 4 букв)
//  - исправление неправильной раскладки (pf,jh → забор)
//  - синонимы и поиск по названию категории

// QWERTY → ЙЦУКЕН (одна и та же физическая клавиша)
const LAYOUT_EN_RU = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з',
  '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о',
  k: 'л', l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и',
  n: 'т', m: 'ь', ',': 'б', '.': 'ю', '`': 'ё',
}

// Словарь синонимов: запрос → дополнительные слова для поиска.
// Каждое слово раскрывается в группу — товар попадёт в выдачу,
// если в нём встречается хоть одно слово из группы.
const SYNONYMS = {
  ворота: ['калитка', 'распашн', 'откатн'],
  калитка: ['ворота'],
  забор: ['ограждение', 'секция', 'панель', '3d', '3д'],
  ограждение: ['забор', 'перила', 'поручень'],
  септик: ['канализация', 'очистн', 'лос', 'станция'],
  канализация: ['септик', 'очистн'],
  свая: ['винтов', 'фундамент', 'столб'],
  фундамент: ['свая', 'винтов'],
  труба: ['пнд', 'пэ', 'пп', 'трубопровод'],
  котёл: ['отопление', 'котел'],
  котел: ['отопление', 'котёл'],
  сетка: ['рабица', 'панель', 'секция'],
  люк: ['шахта', 'колодец'],
  кессон: ['колодец', 'погреб'],
  погреб: ['кессон', 'подвал'],
  профлист: ['профнастил', 'профиль'],
  метизы: ['болт', 'гайка', 'саморез', 'крепёж', 'крепеж'],
}

export function normalize(str) {
  return (str || '').toLowerCase().replace(/ё/g, 'е').trim()
}

// Перевод строки из латинской раскладки в кириллицу
function switchLayout(str) {
  let out = ''
  for (const ch of str.toLowerCase()) {
    out += LAYOUT_EN_RU[ch] ?? ch
  }
  return out
}

// true, если строки отличаются не более чем на 1 правку (вставка/удаление/замена)
function levenshtein1(a, b) {
  if (a === b) return true
  const la = a.length, lb = b.length
  if (Math.abs(la - lb) > 1) return false
  let i = 0, j = 0, edits = 0
  while (i < la && j < lb) {
    if (a[i] === b[j]) { i++; j++; continue }
    if (++edits > 1) return false
    if (la > lb) i++
    else if (lb > la) j++
    else { i++; j++ }
  }
  if (i < la || j < lb) edits++
  return edits <= 1
}

// Разбор запроса на токены + раскрытие синонимов и раскладки.
// Возвращает массив групп токенов: запрос совпадает, если КАЖДАЯ группа нашлась.
export function parseQuery(raw) {
  const norm = normalize(raw)
  if (!norm) return { groups: [], raw: '' }

  // если кириллицы нет вовсе, но есть латиница — вероятно перепутана раскладка
  const hasCyrillic = /[а-я]/.test(norm)
  const hasLatin = /[a-z]/.test(norm)
  const base = (!hasCyrillic && hasLatin) ? switchLayout(norm) : norm

  const words = base.split(/\s+/).filter(Boolean)
  const groups = words.map(w => {
    const variants = new Set([w])
    if (SYNONYMS[w]) SYNONYMS[w].forEach(s => variants.add(normalize(s)))
    return [...variants]
  })
  return { groups, raw: base }
}

// Строит индексируемый текст товара
function itemText(item, categoryLabel) {
  return normalize(
    item.title + ' ' + (item.description || '') + ' ' + (categoryLabel || '')
  )
}

// Оценка релевантности товара по разобранному запросу.
// Возвращает score > 0 при совпадении всех групп, иначе 0.
export function scoreItem(item, parsed, categoryLabel) {
  const { groups } = parsed
  if (!groups.length) return 0

  const title = normalize(item.title)
  const desc = normalize(item.description || '')
  const cat = normalize(categoryLabel || '')
  const titleWords = title.split(/\s+/)

  let score = 0
  for (const variants of groups) {
    let groupScore = 0
    for (const token of variants) {
      // самое сильное совпадение — начало названия
      if (title.startsWith(token)) { groupScore = Math.max(groupScore, 100); continue }
      if (titleWords.some(w => w.startsWith(token))) { groupScore = Math.max(groupScore, 60); continue }
      if (title.includes(token)) { groupScore = Math.max(groupScore, 40); continue }
      if (cat.includes(token)) { groupScore = Math.max(groupScore, 20); continue }
      if (desc.includes(token)) { groupScore = Math.max(groupScore, 10); continue }
      // опечатка в одном из слов названия
      if (token.length >= 4 && titleWords.some(w => levenshtein1(w, token))) {
        groupScore = Math.max(groupScore, 25)
      }
    }
    if (groupScore === 0) return 0 // группа не нашлась → товар не подходит (AND)
    score += groupScore
  }
  // лёгкий бонус товарам с фото — они выглядят полнее
  if (item.photo || (item.photos && item.photos.length)) score += 1
  return score
}

// Полный поиск: вернуть отсортированный по релевантности массив товаров.
export function searchItems(items, raw, categoryLabelOf) {
  const parsed = parseQuery(raw)
  if (!parsed.groups.length) return items
  const scored = []
  for (const item of items) {
    const s = scoreItem(item, parsed, categoryLabelOf?.(item.category))
    if (s > 0) scored.push({ item, s })
  }
  scored.sort((a, b) => b.s - a.s)
  return scored.map(x => x.item)
}
