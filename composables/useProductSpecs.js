// Composable для автоматического разбора характеристик и преимуществ товара.
// Данные извлекаются из заголовка, описания и категории/подкатегории товара.

// ── Общие вспомогательные парсеры ───────────────────────────────

function mm(v) { return v + ' мм' }
function m(v) { return v + ' м' }
function kg(v) { return v + ' кг' }
function kw(v) { return v + ' кВт' }

// Парсит строку вида "A×B" или "AxB" и возвращает [A, B]
function parsePair(title, sep = '[×xхXХ]') {
  const m = title.match(new RegExp(`(\\d+(?:\\.\\d+)?)${sep}(\\d+(?:\\.\\d+)?)`))
  return m ? [m[1], m[2]] : null
}

function parseFourDims(title) {
  const m = title.match(/(\d+(?:\.\d+)?)[×xхXХ](\d+(?:\.\d+)?)[×xхXХ](\d+(?:\.\d+)?)[×xхXХ](\d+(?:\.\d+)?)/)
  return m ? [m[1], m[2], m[3], m[4]] : null
}

function parseThreeDims(title) {
  const m = title.match(/(\d+(?:\.\d+)?)[×xхXХ](\d+(?:\.\d+)?)[×xхXХ](\d+(?:\.\d+)?)/)
  return m ? [m[1], m[2], m[3]] : null
}

function extractNum(title, unit) {
  const re = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}`, 'i')
  const m = title.match(re)
  return m ? m[1] : null
}

function hasMesh(title) {
  const m = title.match(/\((\d+)[×xхXХ](\d+)\s*(?:мм|cm|cm)\)/)
  return m ? `${m[1]}×${m[2]} мм` : null
}

function wireD(title) {
  const m = title.match(/,\s*([\d.]+)\s*мм\)/) || title.match(/([0-9.]+)\s*мм\)/)
  return m ? m[1] + ' мм' : null
}

// ── Характеристики по подкатегории ──────────────────────────────

const specBuilders = {

  // 3D панели: '3D панель 1500×2000 d4мм' → ширина × высота, диаметр прутка
  panels(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина панели', value: mm(d[0]) })
      s.push({ label: 'Высота панели', value: mm(d[1]) })
    }
    const rod = item.title.match(/d(\d+)\s*мм/i)
    if (rod) s.push({ label: 'Диаметр прутка', value: 'd' + rod[1] + ' мм' })
    s.push({ label: 'Материал', value: 'Сталь Ст3' })
    s.push({ label: 'Покрытие', value: 'Порошковая полимерная краска' })
    s.push({ label: 'Цвет', value: 'По каталогу RAL' })
    s.push({ label: 'Срок службы', value: 'от 15 лет' })
    return s
  },

  // Столбы: '1500×60×60×1.5мм' = длина × ширина × высота × толщина стенки
  posts(item) {
    const s = []
    const d = parseFourDims(item.title)
    if (d) {
      s.push({ label: 'Длина столба', value: mm(d[0]) })
      s.push({ label: 'Сечение', value: `${d[1]}×${d[2]} мм` })
      s.push({ label: 'Толщина стенки', value: mm(d[3]) })
    }
    const flange = item.title.includes('фланец') || item.title.includes('фланце')
    s.push({ label: 'Материал', value: 'Квадратная труба Ст3' })
    s.push({ label: 'Покрытие', value: 'Порошковая краска или грунтовка' })
    s.push({ label: 'Фланец монтажный', value: flange ? 'Есть' : 'Нет' })
    return s
  },

  // Крепёж 3D забора
  fasteners(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) s.push({ label: 'Размер', value: `${d[0]}×${d[1]} мм` })
    const isClamp = item.title.toLowerCase().includes('хомут') || item.title.toLowerCase().includes('скоба')
    const isY = item.title.includes('Y') || item.title.includes('у-образ') || item.title.includes('колюч')
    const isEgoza = item.title.toLowerCase().includes('егоза')
    s.push({ label: 'Материал', value: 'Оцинкованная сталь' })
    if (isClamp) s.push({ label: 'Назначение', value: 'Крепление 3D панели к столбу' })
    if (isY) s.push({ label: 'Назначение', value: 'Крепление спирали Егоза' })
    if (isEgoza) {
      const len = extractNum(item.title, 'м')
      if (len) s.push({ label: 'Длина', value: m(len) })
      s.push({ label: 'Тип', value: 'Спиральная барьерная' })
    }
    return s
  },

  // Калитки/ворота: '1500×900 d4мм'
  gates(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      const isGate = item.title.toLowerCase().includes('ворот')
      s.push({ label: isGate ? 'Высота' : 'Высота калитки', value: mm(d[0]) })
      s.push({ label: isGate ? 'Ширина проёма' : 'Ширина калитки', value: mm(d[1]) })
    }
    const rod = item.title.match(/d(\d+)\s*мм/i)
    if (rod) s.push({ label: 'Диаметр прутка', value: 'd' + rod[1] + ' мм' })
    const hasPosts = item.title.includes('столб')
    if (hasPosts) s.push({ label: 'Комплектация', value: 'Со столбами 60×60мм' })
    s.push({ label: 'Навесы', value: '2 шт, регулируемые' })
    s.push({ label: 'Замок', value: 'Щеколда (в комплекте)' })
    s.push({ label: 'Покрытие', value: 'Порошковая краска' })
    return s
  },

  // Сетка ПВХ: '1.5×10м (50×100×2.5мм)'
  pvc(item) {
    const s = []
    const dim = parsePair(item.title)
    if (dim) {
      s.push({ label: 'Высота', value: `${dim[0]} м` })
      s.push({ label: 'Длина в рулоне', value: `${dim[1]} м` })
    }
    const cell = hasMesh(item.title)
    if (cell) s.push({ label: 'Размер ячейки', value: cell })
    const wd = wireD(item.title)
    if (wd) s.push({ label: 'Диаметр проволоки', value: wd })
    s.push({ label: 'Покрытие', value: 'ПВХ (поливинилхлорид)' })
    s.push({ label: 'Цвет', value: 'Зелёный (RAL 6005)' })
    return s
  },

  // Сетка оцинкованная
  zinc(item) {
    const s = []
    const dim = parsePair(item.title)
    if (dim) {
      s.push({ label: 'Высота', value: `${dim[0]} м` })
      s.push({ label: 'Длина в рулоне', value: `${dim[1]} м` })
    }
    const cell = hasMesh(item.title)
    if (cell) s.push({ label: 'Размер ячейки', value: cell })
    const wd = wireD(item.title)
    if (wd) s.push({ label: 'Диаметр проволоки', value: wd })
    s.push({ label: 'Покрытие', value: 'Горячее оцинкование' })
    s.push({ label: 'Материал', value: 'Стальная проволока' })
    return s
  },

  // Рабица
  rabica(item) {
    const s = []
    const dim = parsePair(item.title)
    if (dim) {
      s.push({ label: 'Высота', value: `${dim[0]} м` })
      s.push({ label: 'Длина в рулоне', value: `${dim[1]} м` })
    }
    const cell = item.title.match(/\((\d+)[×xх](\d+)\s*мм/)
    if (cell) s.push({ label: 'Размер ячейки', value: `${cell[1]}×${cell[2]} мм` })
    const heavy = item.title.includes('толст')
    const thin  = item.title.includes('тонк')
    s.push({ label: 'Проволока', value: thin ? 'Тонкая (1.2–1.4 мм)' : heavy ? 'Усиленная (1.8–2 мм)' : 'Стандарт' })
    s.push({ label: 'Покрытие', value: 'Оцинкование' })
    return s
  },

  // Сваи лопастные: '60×5×150×500мм' = Ø трубы × стенка × Ø лопасти × длина
  lopast(item) {
    const s = []
    const d = parseFourDims(item.title)
    if (d) {
      s.push({ label: 'Диаметр трубы', value: mm(d[0]) })
      s.push({ label: 'Толщина стенки', value: mm(d[1]) })
      s.push({ label: 'Диаметр лопасти', value: mm(d[2]) })
      const lenM = (parseInt(d[3]) / 1000).toFixed(1)
      s.push({ label: 'Длина', value: `${lenM} м (${d[3]} мм)` })
    }
    s.push({ label: 'Тип', value: 'Лопастная (несущая)' })
    s.push({ label: 'Материал', value: 'Труба стальная 08Г2С' })
    s.push({ label: 'Покрытие', value: 'Антикоррозийный грунт' })
    s.push({ label: 'Монтаж', value: 'Механическое завинчивание' })
    return s
  },

  // Сваи винтовые: формат как лопастные
  vintovye(item) {
    const s = []
    const isZinc = item.title.includes('оцинк')
    if (isZinc) {
      const len = extractNum(item.title, 'мм')
      if (len) s.push({ label: 'Длина', value: `${(parseInt(len)/1000).toFixed(1)} м (${len} мм)` })
    } else {
      const d = parseFourDims(item.title)
      if (d) {
        s.push({ label: 'Диаметр трубы', value: mm(d[0]) })
        s.push({ label: 'Толщина стенки', value: mm(d[1]) })
        s.push({ label: 'Диаметр лопасти', value: mm(d[2]) })
        const lenM = (parseInt(d[3]) / 1000).toFixed(1)
        s.push({ label: 'Длина', value: `${lenM} м (${d[3]} мм)` })
      }
    }
    s.push({ label: 'Тип', value: 'Винтовая (SV-серия)' })
    s.push({ label: 'Материал', value: 'Труба стальная 08Г2С' })
    s.push({ label: 'Покрытие', value: isZinc ? 'Горячее оцинкование' : 'Антикоррозийный грунт' })
    s.push({ label: 'Монтаж', value: 'Механическое завинчивание' })
    return s
  },

  // Фланцы: '140×140×5мм'
  flanets(item) {
    const s = []
    const d = parseThreeDims(item.title)
    if (d) {
      s.push({ label: 'Ширина', value: mm(d[0]) })
      s.push({ label: 'Высота', value: mm(d[1]) })
      s.push({ label: 'Толщина', value: mm(d[2]) })
    }
    s.push({ label: 'Форма', value: 'Квадратная пластина' })
    s.push({ label: 'Материал', value: 'Сталь Ст3' })
    s.push({ label: 'Отверстие', value: '4 отверстия под болт М12' })
    s.push({ label: 'Покрытие', value: 'Грунт-эмаль' })
    return s
  },

  // Септики
  rings(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Диаметр', value: mm(d[0]) })
      s.push({ label: 'Высота', value: mm(d[1]) })
    }
    s.push({ label: 'Материал', value: 'Железобетон B25' })
    s.push({ label: 'Водонепроницаемость', value: 'W6' })
    return s
  },

  accum(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    s.push({ label: 'Тип', value: 'Накопительный' })
    s.push({ label: 'Материал', value: 'Стеклопластик или НПВХ' })
    s.push({ label: 'Монтаж', value: 'Подземный' })
    return s
  },

  topas(item) {
    const s = []
    const vol = item.title.match(/ТОПАС[- ]?(\d+)/i) || item.title.match(/(\d+)\s*чел/i)
    if (vol) s.push({ label: 'Расчётное число пользователей', value: vol[1] + ' чел.' })
    s.push({ label: 'Тип очистки', value: 'Биологическая (аэробная)' })
    s.push({ label: 'Степень очистки', value: 'до 98%' })
    s.push({ label: 'Гарантия', value: '5 лет' })
    s.push({ label: 'Монтаж', value: 'Подземный, ниже точки промерзания' })
    return s
  },

  auto(item) {
    const s = []
    s.push({ label: 'Тип', value: 'Автономная биостанция' })
    s.push({ label: 'Степень очистки', value: 'до 95%' })
    s.push({ label: 'Материал', value: 'Стеклопластик / НПВХ' })
    s.push({ label: 'Обслуживание', value: 'Раз в 1–3 года' })
    return s
  },

  // Кессоны
  sfera(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Диаметр', value: mm(d[0]) })
      s.push({ label: 'Высота', value: mm(d[1]) })
    }
    s.push({ label: 'Форма', value: 'Сферическая крышка' })
    s.push({ label: 'Материал', value: 'Сталь 4–5 мм' })
    s.push({ label: 'Покрытие', value: 'Полимерная краска внутри и снаружи' })
    s.push({ label: 'Утепление', value: 'Пенополиуретан 30–50 мм' })
    return s
  },

  bunker(item) {
    const s = []
    s.push({ label: 'Форма', value: 'Бункерная (прямоугольная)' })
    s.push({ label: 'Материал', value: 'Сталь 4–5 мм' })
    s.push({ label: 'Покрытие', value: 'Полимерная краска' })
    s.push({ label: 'Горловина', value: 'Под люк 600 мм' })
    return s
  },

  // Погреба
  std(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина', value: mm(d[0]) })
      s.push({ label: 'Длина', value: mm(d[1]) })
    }
    s.push({ label: 'Материал', value: 'Сталь 4–5 мм' })
    s.push({ label: 'Покрытие', value: 'Эпоксидная краска' })
    s.push({ label: 'Крышка', value: 'Сдвижная или распашная' })
    return s
  },

  lift(item) {
    const s = []
    s.push({ label: 'Тип', value: 'С подъёмником лестницы' })
    s.push({ label: 'Материал', value: 'Сталь 4–5 мм' })
    s.push({ label: 'Покрытие', value: 'Эпоксидная краска' })
    s.push({ label: 'Механизм подъёма', value: 'Газовые амортизаторы' })
    return s
  },

  // Ёмкости пластиковые
  cylinder(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    const h = extractNum(item.title, 'мм')
    if (h) s.push({ label: 'Высота', value: mm(h) })
    s.push({ label: 'Форма', value: 'Цилиндрическая вертикальная' })
    s.push({ label: 'Материал', value: 'Полиэтилен (ПЭ)' })
    s.push({ label: 'Температура жидкости', value: 'до +60°C' })
    s.push({ label: 'Рабочее давление', value: '0 (безнапорная)' })
    return s
  },

  shower(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    s.push({ label: 'Назначение', value: 'Летний душ, дача' })
    s.push({ label: 'Материал', value: 'Полиэтилен (ПЭ) чёрный' })
    s.push({ label: 'Нагрев', value: 'Пассивный (от солнца)' })
    return s
  },

  rect(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    s.push({ label: 'Форма', value: 'Прямоугольная' })
    s.push({ label: 'Материал', value: 'Полиэтилен (ПЭ)' })
    return s
  },

  horiz(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    s.push({ label: 'Форма', value: 'Горизонтальный цилиндр' })
    s.push({ label: 'Материал', value: 'Полиэтилен (ПЭ)' })
    s.push({ label: 'Установка', value: 'Горизонтальная (наземная/подземная)' })
    return s
  },

  slim(item) {
    const s = []
    const vol = item.title.match(/(\d+)\s*(л|куб|м³|литр)/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} л` })
    s.push({ label: 'Серия', value: 'SLIM (узкая)' })
    s.push({ label: 'Материал', value: 'Полиэтилен (ПЭ)' })
    s.push({ label: 'Назначение', value: 'Ограниченное пространство' })
    return s
  },

  // Профлист
  sheet(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина листа', value: mm(d[0]) })
      s.push({ label: 'Длина', value: mm(d[1]) })
    }
    const profile = item.title.match(/[CС]-(\d+)|[HН]-(\d+)/i)
    if (profile) s.push({ label: 'Профиль', value: (profile[0]).toUpperCase() })
    s.push({ label: 'Покрытие', value: 'Полимерное (PE/PVDF)' })
    s.push({ label: 'Применение', value: 'Кровля, ограждения, фасады' })
    return s
  },

  aluminum(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина', value: mm(d[0]) })
      s.push({ label: 'Длина', value: mm(d[1]) })
    }
    const thick = extractNum(item.title, 'мм')
    if (thick) s.push({ label: 'Толщина', value: mm(thick) })
    s.push({ label: 'Сплав', value: 'АМЦ, АД1, Д16' })
    s.push({ label: 'Применение', value: 'Вентилируемые фасады, кровля' })
    return s
  },

  // Котлы
  sten(item) {
    const s = []
    const kw_m = extractNum(item.title, 'кВт')
    if (kw_m) s.push({ label: 'Мощность', value: kw(kw_m) })
    s.push({ label: 'Бренд', value: 'СТЭН' })
    s.push({ label: 'Тип', value: 'Напольный стальной' })
    s.push({ label: 'Топливо', value: 'Природный газ / пропан-бутан' })
    s.push({ label: 'КПД', value: 'до 92%' })
    return s
  },

  karakan(item) {
    const s = []
    const kw_m = extractNum(item.title, 'кВт')
    if (kw_m) s.push({ label: 'Мощность', value: kw(kw_m) })
    s.push({ label: 'Бренд', value: 'Каракан' })
    s.push({ label: 'Тип', value: 'Твердотопливный' })
    s.push({ label: 'Топливо', value: 'Уголь, дрова, брикеты' })
    s.push({ label: 'Горение одной закладки', value: 'до 8–12 часов' })
    return s
  },

  zota(item) {
    const s = []
    const kw_m = extractNum(item.title, 'кВт')
    if (kw_m) s.push({ label: 'Мощность', value: kw(kw_m) })
    s.push({ label: 'Бренд', value: 'ZOTA' })
    s.push({ label: 'Тип', value: 'Электрический / комбинированный' })
    s.push({ label: 'КПД', value: '98–100%' })
    return s
  },

  // Дымоходы
  chimney_default(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Внутренний диаметр', value: mm(d[0]) })
      s.push({ label: 'Наружный диаметр', value: mm(d[1]) })
    }
    s.push({ label: 'Материал', value: 'Нержавеющая сталь AISI 316L' })
    s.push({ label: 'Толщина стенки', value: '0.5 мм' })
    s.push({ label: 'Теплоизоляция', value: 'Базальтовый утеплитель 50 мм' })
    s.push({ label: 'Рабочая температура', value: 'до +600°C' })
    return s
  },

  // Трубопроводная арматура
  pipe_ball(item) {
    const s = []
    const dn = item.title.match(/DN\s*(\d+)|Ду\s*(\d+)|(\d+)\s*мм/i)
    if (dn) s.push({ label: 'Диаметр (ДУ)', value: `ДУ ${dn[1] || dn[2] || dn[3]}` })
    const pn = item.title.match(/PN\s*(\d+)|(\d+)\s*бар/i)
    if (pn) s.push({ label: 'Давление (PN)', value: `PN${pn[1] || pn[2]}` })
    s.push({ label: 'Тип', value: 'Шаровой кран' })
    s.push({ label: 'Материал корпуса', value: 'Латунь / сталь / нержавейка' })
    s.push({ label: 'Резьба', value: 'Внутренняя / наружная' })
    s.push({ label: 'Управление', value: 'Ручное (рычаг)' })
    return s
  },

  pipe_gate(item) {
    const s = []
    const dn = item.title.match(/DN\s*(\d+)|Ду\s*(\d+)|(\d+)\s*мм/i)
    if (dn) s.push({ label: 'Диаметр (ДУ)', value: `ДУ ${dn[1] || dn[2] || dn[3]}` })
    s.push({ label: 'Тип', value: 'Задвижка клиновая' })
    s.push({ label: 'Материал', value: 'Чугун ЧУГ / сталь' })
    s.push({ label: 'Привод', value: 'Маховик / электропривод' })
    return s
  },

  pipe_valve(item) {
    const s = []
    const dn = item.title.match(/DN\s*(\d+)|Ду\s*(\d+)|(\d+)\s*мм/i)
    if (dn) s.push({ label: 'Диаметр (ДУ)', value: `ДУ ${dn[1] || dn[2] || dn[3]}` })
    s.push({ label: 'Тип', value: 'Вентиль' })
    s.push({ label: 'Материал', value: 'Латунь / бронза' })
    return s
  },

  pipe_check(item) {
    const s = []
    const dn = item.title.match(/DN\s*(\d+)|Ду\s*(\d+)|(\d+)\s*мм/i)
    if (dn) s.push({ label: 'Диаметр (ДУ)', value: `ДУ ${dn[1] || dn[2] || dn[3]}` })
    s.push({ label: 'Тип', value: 'Обратный клапан / затвор' })
    s.push({ label: 'Направление', value: 'Одностороннее' })
    return s
  },

  pipe_filter(item) {
    const s = []
    s.push({ label: 'Тип', value: 'Фильтр грубой очистки (грязевик)' })
    const dn = item.title.match(/DN\s*(\d+)|Ду\s*(\d+)|(\d+)\s*мм/i)
    if (dn) s.push({ label: 'Диаметр (ДУ)', value: `ДУ ${dn[1] || dn[2] || dn[3]}` })
    s.push({ label: 'Сетка', value: '500 мкм' })
    return s
  },

  // Металлопрокат
  metalroll_sheet(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина листа', value: mm(d[0]) })
      s.push({ label: 'Длина', value: mm(d[1]) })
    }
    const thick = item.title.match(/(\d+(?:\.\d+)?)\s*мм/i)
    if (thick) s.push({ label: 'Толщина', value: mm(thick[1]) })
    s.push({ label: 'Тип', value: 'Горячекатаный / холоднокатаный' })
    s.push({ label: 'Материал', value: 'Сталь Ст3, 09Г2С' })
    return s
  },

  metalroll_pipe(item) {
    const s = []
    const d = parseThreeDims(item.title)
    if (d) {
      s.push({ label: 'Наружный диаметр', value: mm(d[0]) })
      s.push({ label: 'Толщина стенки', value: mm(d[1]) })
      s.push({ label: 'Длина мерного отрезка', value: `${d[2]} м` })
    }
    s.push({ label: 'Материал', value: 'Сталь Ст10/20/35' })
    s.push({ label: 'Стандарт', value: 'ГОСТ 8732, 8734' })
    return s
  },

  // Пластиковые трубы
  pnd(item) {
    const s = []
    const dn = item.title.match(/(\d+)[×xх](\d+(?:\.\d+)?)/i)
    if (dn) {
      s.push({ label: 'Наружный диаметр', value: mm(dn[1]) })
      s.push({ label: 'Толщина стенки', value: mm(dn[2]) })
    }
    s.push({ label: 'Материал', value: 'Полиэтилен низкого давления (ПНД)' })
    s.push({ label: 'Рабочее давление', value: 'PN 6–25 бар' })
    s.push({ label: 'Цвет', value: 'Чёрный с синей полосой' })
    return s
  },

  // Нержавеющие трубы
  stainless_pipe(item) {
    const s = []
    const d = parseThreeDims(item.title)
    if (d) {
      s.push({ label: 'Наружный диаметр', value: mm(d[0]) })
      s.push({ label: 'Толщина стенки', value: mm(d[1]) })
      s.push({ label: 'Длина', value: `${d[2]} м` })
    }
    s.push({ label: 'Марка стали', value: 'AISI 304 / AISI 316' })
    s.push({ label: 'Стандарт', value: 'ГОСТ 9941-81' })
    s.push({ label: 'Исполнение', value: 'Шлифованная / зеркальная / матовая' })
    return s
  },

  stainless_sheet(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина', value: mm(d[0]) })
      s.push({ label: 'Длина', value: mm(d[1]) })
    }
    const thick = extractNum(item.title, 'мм')
    if (thick) s.push({ label: 'Толщина', value: mm(thick) })
    s.push({ label: 'Марка стали', value: 'AISI 304 / AISI 430' })
    s.push({ label: 'Поверхность', value: '2B (холоднокатаная) / BA (зеркальная)' })
    return s
  },

  // Кабели
  wire(item) {
    const s = []
    const cross = item.title.match(/([\d.]+)\s*мм²/i)
    if (cross) s.push({ label: 'Сечение', value: `${cross[1]} мм²` })
    const cores = item.title.match(/(\d+)[xхXХ\*][\d.]+/)
    if (cores) s.push({ label: 'Число жил', value: cores[1] + ' жилы' })
    s.push({ label: 'Изоляция', value: 'ПВХ / XLPE' })
    s.push({ label: 'Расчётное напряжение', value: 'до 1000 В' })
    return s
  },

  cable_power(item) {
    const s = []
    const cross = item.title.match(/([\d.]+)\s*мм²/i)
    if (cross) s.push({ label: 'Сечение жилы', value: `${cross[1]} мм²` })
    s.push({ label: 'Тип', value: 'Силовой кабель' })
    s.push({ label: 'Напряжение', value: '0.66–6 кВ' })
    s.push({ label: 'Броня', value: 'Стальная лента (ВБШв)' })
    return s
  },

  // Опалубка
  small(item) {
    const s = []
    s.push({ label: 'Тип', value: 'Мелкощитовая рамная' })
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Ширина', value: mm(d[0]) })
      s.push({ label: 'Высота', value: mm(d[1]) })
    }
    s.push({ label: 'Материал рамы', value: 'Алюминий / сталь' })
    s.push({ label: 'Палуба', value: 'Фанера 18 мм / сталь' })
    return s
  },

  slab(item) {
    const s = []
    s.push({ label: 'Тип', value: 'Опалубка перекрытий' })
    s.push({ label: 'Несущая способность', value: 'до 30 кН/м²' })
    s.push({ label: 'Материал', value: 'Алюминий / сталь' })
    return s
  },

  // Люки
  hatch_iron(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      s.push({ label: 'Диаметр / размер', value: `${d[0]}×${d[1]} мм` })
    }
    s.push({ label: 'Материал', value: 'Чугун ЧГС' })
    s.push({ label: 'Нагрузка', value: 'B125 / C250 / D400 по EN 124' })
    s.push({ label: 'Покрытие', value: 'Необработанный / битум' })
    return s
  },

  hatch_polymer(item) {
    const s = []
    s.push({ label: 'Материал', value: 'Полимер (PP/PE)' })
    s.push({ label: 'Нагрузка', value: 'B125 (1.25 т)' })
    s.push({ label: 'Устойчивость', value: 'УФ, морозостойкость до −60°C' })
    return s
  },

  // Садовое / контейнеры
  containers(item) {
    const s = []
    const vol = item.title.match(/(\d+(?:\.\d+)?)\s*м³/i) || item.title.match(/(\d+)\s*куб/i)
    if (vol) s.push({ label: 'Объём', value: `${vol[1]} м³` })
    s.push({ label: 'Материал', value: 'Оцинкованная сталь' })
    s.push({ label: 'Покрытие', value: 'Порошковая краска' })
    s.push({ label: 'Вывоз мусора', value: 'Фронтальная / боковая загрузка' })
    return s
  },

  // Кованые элементы
  venzeli(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) s.push({ label: 'Размер', value: `${d[0]}×${d[1]} мм` })
    s.push({ label: 'Материал', value: 'Пруток квадрат/круг Ст3' })
    s.push({ label: 'Исполнение', value: 'Горячая ковка' })
    s.push({ label: 'Покрытие', value: 'Кузнечная грунт-эмаль' })
    return s
  },

  // Обработчик по умолчанию
  _default(item) {
    const s = []
    const d = parsePair(item.title)
    if (d) {
      const isLen = d[0].length > 3
      s.push({ label: isLen ? 'Размер (А)' : 'Параметр A', value: mm(d[0]) })
      s.push({ label: isLen ? 'Размер (Б)' : 'Параметр B', value: mm(d[1]) })
    }
    return s
  },
}

// ── Преимущества по категориям ────────────────────────────────────

const catAdvantages = {
  fence3d: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Долговечность 15+ лет', desc: 'Полимерное покрытие защищает металл от коррозии даже в условиях влажного приморского климата.' },
    { iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', title: 'Выбор цветов RAL', desc: '10 стандартных цветов в наличии. Нестандартная покраска — под заказ за 5–7 рабочих дней.' },
    { iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', title: 'Монтаж под ключ', desc: 'Наши бригады выполняют установку ограждений с подготовкой основания и гарантией.' },
    { iconPath: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Быстрая отгрузка', desc: 'Стандартные размеры — на складе во Владивостоке. Отгрузка в день оплаты.' },
  ],
  mesh: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Антикоррозийное покрытие', desc: 'ПВХ или горячее оцинкование — проволока не ржавеет даже при постоянном контакте с землёй.' },
    { iconPath: 'M4 6h16M4 10h16M4 14h16M4 18h16', title: 'Гибкость применения', desc: 'Используется для огораживания участков, вольеров, строительных площадок, теплиц.' },
    { iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 0V5m0 2H9m3 0h3M12 18v1', title: 'Экономичность', desc: 'Минимальные затраты на монтаж — рулон разматывается вдоль столбов, крепится стяжками.' },
    { iconPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z', title: 'Наличие на складе', desc: 'Стандартные размеры отгружаем со склада в Владивостоке в 1 день.' },
  ],
  piles: [
    { iconPath: 'M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4', title: 'Монтаж круглый год', desc: 'Завинчивание при температуре до −40°C. Земляные работы не требуются.' },
    { iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', title: 'Любой грунт', desc: 'Пучинистый, обводнённый, торфяной — сваи работают там, где традиционный фундамент невозможен.' },
    { iconPath: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', title: 'Высокая несущая', desc: 'Нагрузка до 10 тонн на одну сваю. Расчёт под ваш объект — бесплатно.' },
    { iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 0V5', title: 'Экономия 30–50%', desc: 'Нет заливки бетона, нет аренды тяжёлой техники. Только ручное или механизированное завинчивание.' },
  ],
  septic: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Высокая степень очистки', desc: 'До 95–98% очистки сточных вод. Возможен сброс в поглощающий колодец или на рельеф.' },
    { iconPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707', title: 'Надёжность', desc: 'Полная автономность. Работает без постоянного электричества (накопительные модели).' },
    { iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35', title: 'Редкое обслуживание', desc: 'Откачка 1 раз в 1–3 года в зависимости от интенсивности использования.' },
    { iconPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z', title: 'Быстрый монтаж', desc: 'Установка за 1–2 дня без масштабных земляных работ.' },
  ],
  kesson: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Защита от промерзания', desc: 'Сталь 4–5 мм + ППУ утепление 30–50 мм. Насосное оборудование работает при −40°C.' },
    { iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: 'Безопасность', desc: 'Замок на горловине, герметичный корпус — защита от несанкционированного доступа.' },
    { iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Долгий срок службы', desc: 'Антикоррозийная обработка внутри и снаружи. Гарантированный срок — от 30 лет.' },
    { iconPath: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Быстрая установка', desc: 'Монтаж в котлован за 1 день. Размеры под стандартные объёмы насосного оборудования.' },
  ],
  tanks: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Устойчивость к коррозии', desc: 'Полиэтилен не ржавеет, не гниёт, не вступает в реакцию с водой, химикатами и топливом.' },
    { iconPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3', title: 'Устойчивость к УФ', desc: 'Чёрный полиэтилен с добавкой сажи выдерживает прямое солнечное излучение без деградации.' },
    { iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Долгий срок службы', desc: 'Срок эксплуатации — от 15 лет при правильном использовании.' },
    { iconPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z', title: 'Широкий выбор объёмов', desc: 'От 100 до 20 000 литров. Горизонтальные, вертикальные, узкие SLIM — под любой объект.' },
  ],
  pipe: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Сертифицированная продукция', desc: 'Вся арматура имеет сертификаты соответствия и декларации ГОСТ.' },
    { iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Высокое давление', desc: 'Рабочее давление до PN40 — подходит для тепловых пунктов и промышленных трубопроводов.' },
    { iconPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2z', title: 'Широкий ассортимент', desc: 'Краны, задвижки, клапаны, фильтры — все типоразмеры в наличии на складе.' },
    { iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Тех. поддержка', desc: 'Подбор арматуры по схеме трубопровода. Консультация инженера бесплатно.' },
  ],
  default: [
    { iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Проверенное качество', desc: 'Работаем только с надёжными производителями. Входной контроль на складе.' },
    { iconPath: 'M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3M9 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9a2 2 0 00-2 2v7a2 2 0 002 2zM1 9h4', title: 'Доставка по краю', desc: 'Собственный транспорт и партнёрская логистика по всему Приморскому краю.' },
    { iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: 'Поддержка и консультации', desc: 'Технические консультации, подбор по параметрам — бесплатно для каждого клиента.' },
    { iconPath: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Быстрые сроки', desc: 'Позиции со склада — отгрузка в день. Нестандарт — от 3 рабочих дней.' },
  ],
}

// ── Расширенные описания по категориям ──────────────────────────

export const catDescriptions = {
  fence3d:   'Трёхмерные сварные панели применяются для ограждения частных владений, промышленных объектов и общественных пространств. Изготовлены из стального прутка с полимерным покрытием. Строгая геометрия и широкий выбор цветов RAL делают ограждение одновременно практичным и эстетичным.',
  mesh:      'Сварная сетка обеспечивает надёжную защиту периметра при минимальных затратах. ПВХ или оцинкованное покрытие гарантирует долгий срок службы в условиях приморского климата. Подходит для дач, вольеров, стройплощадок и теплиц.',
  piles:     'Винтовые и лопастные сваи — универсальное решение для фундаментов на любых типах грунта. Монтаж возможен без земляных работ и в любое время года, включая зимний период. Несущая способность — до 10 тонн на сваю.',
  septic:    'Автономные системы канализации обеспечивают эффективную очистку сточных вод без подключения к централизованным сетям. Соответствуют санитарным нормам, подходят для постоянного проживания и сезонного использования.',
  kesson:    'Стальные кессоны надёжно защищают насосное оборудование скважины от промерзания и загрязнения. Утепление пенополиуретаном обеспечивает работу оборудования при температурах до −40°C. Срок службы — от 30 лет.',
  cellar:    'Стальные погреба обеспечивают оптимальный температурный режим для хранения продуктов. Эпоксидное покрытие защищает металл от коррозии и конденсата. Монтируются в готовый котлован за 1 день.',
  tanks:     'Пластиковые ёмкости применяются для хранения воды, технических жидкостей и ГСМ. Полиэтилен устойчив к коррозии, ультрафиолету и низким температурам. Не требует обслуживания на протяжении всего срока эксплуатации.',
  fglass:    'Изделия из стеклопластика (ЛОС) сочетают высокую прочность с минимальным весом. Применяются в системах локальной очистки сточных вод.',
  proflist:  'Профнастил и алюминиевые листы применяются для кровли, ограждений и облицовки фасадов. Широкий выбор профилей и цветов по каталогу RAL.',
  rail:      'Нержавеющие ограждения из стали AISI 304 применяются в жилых комплексах, торговых центрах и общественных пространствах. Устойчивы к коррозии без дополнительного покрытия.',
  boiler:    'Отопительные котлы для жилых домов и производственных помещений. Подбор системы под конкретный объект с учётом теплопотерь.',
  chimney:   'Дымоходы из нержавеющей стали AISI 316L обеспечивают безопасный отвод продуктов горения. Модульная конструкция упрощает монтаж и техническое обслуживание.',
  pipe:      'Трубопроводная арматура для систем водоснабжения, отопления и промышленных трубопроводов. Широкий ассортимент диаметров и материалов.',
  metalroll: 'Металлопрокат — основа строительных и производственных проектов. Листы, трубы, уголок, профиль от проверенных производителей.',
  stainless: 'Нержавеющий прокат из стали AISI 304/316 применяется в пищевой промышленности, медицине, машиностроении и архитектуре.',
  cable:     'Кабели и провода для строительства и промышленности. Широкий выбор типов изоляции и сечений.',
  plastic:   'Трубы из ПНД, ПЭ и ПП для систем водоснабжения, газоснабжения, канализации и технологических трубопроводов.',
  formwork:  'Опалубочные системы для монолитного строительства. Мелкощитовая и крупнощитовая опалубка в аренду и в продажу.',
  hatches:   'Чугунные и полимерные люки, шахты и дождеприёмники для инфраструктурных объектов.',
  default:   'Товар изготовлен с соблюдением стандартов качества строительной отрасли. ООО ДСР осуществляет поставку материалов и оборудования по всему Приморскому краю.',
}

// ── Экспортируемые функции ─────────────────────────────────────

export function getProductSpecs(item) {
  if (!item) return []
  // Готовые характеристики из источника (товары Сигнала)
  if (item.specs && item.specs.length) return item.specs
  const base = []
  if (item.sku)  base.push({ label: 'Артикул', value: item.sku })
  if (item.unit) base.push({ label: 'Ед. измерения', value: item.unit })

  const builder = specBuilders[item.sub] || specBuilders._default
  const specific = builder(item)

  // Убираем дубликаты по label
  const seen = new Set(base.map(s => s.label))
  const filtered = specific.filter(s => !seen.has(s.label))

  const result = [...base, ...filtered]
  result.push({ label: 'Наличие', value: 'Под заказ / со склада' })
  result.push({ label: 'Доставка', value: 'По Приморскому краю' })
  return result
}

export function getProductAdvantages(item) {
  if (!item) return []
  return catAdvantages[item.category] || catAdvantages.default
}

export function getProductCatDesc(item) {
  if (!item) return ''
  return catDescriptions[item.category] || catDescriptions.default
}
