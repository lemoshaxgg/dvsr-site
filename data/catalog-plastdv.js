// Каталог Пластпродукт (plastdv.ru) — трубы ПЭ, фитинги, арматура, оборудование
// ID: 8000–8999

export const pdCategories = [
  { id: 'pd_pipes',    label: 'Трубы ПЭ',                   icon: '🔵' },
  { id: 'pd_fittings', label: 'Фитинги ПЭ',                 icon: '🔩' },
  { id: 'pd_armature', label: 'Арматура ПЭ (фланцы)',        icon: '⚙️' },
  { id: 'pd_weld',     label: 'Сварочное оборудование ПЭ',   icon: '🔥' },
]

export const pdSubcategories = {
  pd_pipes: [
    { id: 'pd_pipe_water', label: 'Трубы для водоснабжения' },
    { id: 'pd_pipe_gas',   label: 'Трубы для газоснабжения' },
    { id: 'pd_pipe_corr',  label: 'Трубы гофрированные двухслойные SN8' },
  ],
  pd_fittings: [
    { id: 'pd_fit_elw',    label: 'Электросварные фитинги' },
    { id: 'pd_fit_comp',   label: 'Компрессионные фитинги' },
    { id: 'pd_fit_weld',   label: 'Сварные фитинги' },
    { id: 'pd_fit_corr',   label: 'Гофрированный фитинг' },
    { id: 'pd_fit_cast',   label: 'Литой фитинг' },
    { id: 'pd_fit_muff',   label: 'Муфта для прохода ПЭ через ЖБ' },
    { id: 'pd_fit_steel',  label: 'Неразъёмное соединение ПЭ-сталь' },
  ],
  pd_armature: [
    { id: 'pd_arm_flange', label: 'Фланцы ПЭ' },
  ],
  pd_weld: [
    { id: 'pd_weld_hydr',  label: 'Гидравлические сварочные аппараты' },
    { id: 'pd_weld_mech',  label: 'Механические сварочные аппараты' },
    { id: 'pd_weld_other', label: 'Дополнительное оборудование' },
  ],
}

export const pdItems = [
  // ─── ТРУБЫ ДЛЯ ВОДОСНАБЖЕНИЯ ─────────────────────────────────────────────
  { id: 8001, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d32×2.0 PN6 (100м)',         price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 d32мм, толщина стенки 2.0мм, PN6, для водоснабжения. 100м.' },
  { id: 8002, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d40×2.4 PN6 (100м)',         price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 d40мм, толщина стенки 2.4мм, PN6. 100м.' },
  { id: 8003, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d50×3.0 PN8 (100м)',         price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 d50мм, толщина стенки 3.0мм, PN8. 100м.' },
  { id: 8004, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d63×3.8 PN8 (100м)',         price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 d63мм, толщина 3.8мм, PN8. 100м.' },
  { id: 8005, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d90×5.4 PN8 (12м)',          price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 d90мм, толщина 5.4мм, PN8, мерная длина 12м.' },
  { id: 8006, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d110×6.6 PN8 (12м)',         price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 d110мм, толщина 6.6мм, PN8, 12м.' },
  { id: 8007, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d160×9.5 PN8 (12м)',         price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 d160мм, толщина 9.5мм, PN8, 12м.' },
  { id: 8008, category: 'pd_pipes', sub: 'pd_pipe_water', icon: '🔵', title: 'Труба ПЭ100 d200×11.9 PN8 (12м)',        price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 d200мм, толщина 11.9мм, PN8, 12м.' },

  // ─── ТРУБЫ ДЛЯ ГАЗОСНАБЖЕНИЯ ─────────────────────────────────────────────
  { id: 8010, category: 'pd_pipes', sub: 'pd_pipe_gas', icon: '🟡', title: 'Труба ПЭ100 d32×3.0 PN10 газ (100м)',    price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 газовая d32мм, PN10, жёлтая или с жёлтой полосой. 100м.' },
  { id: 8011, category: 'pd_pipes', sub: 'pd_pipe_gas', icon: '🟡', title: 'Труба ПЭ100 d63×5.8 PN10 газ (100м)',   price: 'Уточнить', basePrice: null, unit: 'бухта', description: 'Труба ПЭ100 газовая d63мм, PN10. 100м.' },
  { id: 8012, category: 'pd_pipes', sub: 'pd_pipe_gas', icon: '🟡', title: 'Труба ПЭ100 d110×10.0 PN10 газ (12м)', price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 газовая d110мм, PN10, 12м.' },
  { id: 8013, category: 'pd_pipes', sub: 'pd_pipe_gas', icon: '🟡', title: 'Труба ПЭ100 d160×14.6 PN10 газ (12м)', price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Труба ПЭ100 газовая d160мм, PN10, 12м.' },

  // ─── ТРУБЫ ГОФРИРОВАННЫЕ SN8 ─────────────────────────────────────────────
  { id: 8015, category: 'pd_pipes', sub: 'pd_pipe_corr', icon: '🔵', title: 'Труба гофр. двухслойная d110 SN8 (6м)',  price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Двухслойная гофрированная труба d110мм, жёсткость SN8, 6м. Канализация.' },
  { id: 8016, category: 'pd_pipes', sub: 'pd_pipe_corr', icon: '🔵', title: 'Труба гофр. двухслойная d160 SN8 (6м)',  price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Двухслойная гофрированная труба d160мм, SN8, 6м.' },
  { id: 8017, category: 'pd_pipes', sub: 'pd_pipe_corr', icon: '🔵', title: 'Труба гофр. двухслойная d200 SN8 (6м)',  price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Двухслойная гофрированная труба d200мм, SN8, 6м.' },
  { id: 8018, category: 'pd_pipes', sub: 'pd_pipe_corr', icon: '🔵', title: 'Труба гофр. двухслойная d315 SN8 (6м)',  price: 'Уточнить', basePrice: null, unit: 'отрезок', description: 'Двухслойная гофрированная труба d315мм, SN8, 6м.' },

  // ─── ЭЛЕКТРОСВАРНЫЕ ФИТИНГИ ───────────────────────────────────────────────
  { id: 8020, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Муфта электросварная d32',               price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварная муфта ПЭ100 d32мм для сварки труб.' },
  { id: 8021, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Муфта электросварная d63',               price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварная муфта ПЭ100 d63мм.' },
  { id: 8022, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Муфта электросварная d110',              price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварная муфта ПЭ100 d110мм.' },
  { id: 8023, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Отвод электросварной 90° d63',           price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварной отвод 90° ПЭ100 d63мм.' },
  { id: 8024, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Тройник электросварной d110',            price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварной тройник равнопроходной d110мм.' },
  { id: 8025, category: 'pd_fittings', sub: 'pd_fit_elw', icon: '🔩', title: 'Седловое ответвление ЭС d110/32',        price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Электросварное седловое ответвление d110/32мм.' },

  // ─── КОМПРЕССИОННЫЕ ФИТИНГИ ───────────────────────────────────────────────
  { id: 8030, category: 'pd_fittings', sub: 'pd_fit_comp', icon: '🔩', title: 'Муфта компрессионная d20',              price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Компрессионная муфта равнопроходная d20мм.' },
  { id: 8031, category: 'pd_fittings', sub: 'pd_fit_comp', icon: '🔩', title: 'Муфта компрессионная d32',              price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Компрессионная муфта равнопроходная d32мм.' },
  { id: 8032, category: 'pd_fittings', sub: 'pd_fit_comp', icon: '🔩', title: 'Тройник компрессионный d32',            price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Компрессионный тройник равнопроходной d32мм.' },
  { id: 8033, category: 'pd_fittings', sub: 'pd_fit_comp', icon: '🔩', title: 'Угол компрессионный 90° d32',           price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Компрессионный угол 90° d32мм.' },
  { id: 8034, category: 'pd_fittings', sub: 'pd_fit_comp', icon: '🔩', title: 'Переход компрессионный d32/d20',        price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Компрессионный переход d32/d20мм.' },

  // ─── СВАРНЫЕ ФИТИНГИ ─────────────────────────────────────────────────────
  { id: 8040, category: 'pd_fittings', sub: 'pd_fit_weld', icon: '🔩', title: 'Отвод сварной 90° d63',                 price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сварной отвод 90° ПЭ100 d63мм.' },
  { id: 8041, category: 'pd_fittings', sub: 'pd_fit_weld', icon: '🔩', title: 'Отвод сварной 90° d110',                price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сварной отвод 90° ПЭ100 d110мм.' },
  { id: 8042, category: 'pd_fittings', sub: 'pd_fit_weld', icon: '🔩', title: 'Тройник сварной d110',                  price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сварной тройник равнопроходной ПЭ100 d110мм.' },
  { id: 8043, category: 'pd_fittings', sub: 'pd_fit_weld', icon: '🔩', title: 'Тройник сварной d160',                  price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сварной тройник равнопроходной ПЭ100 d160мм.' },
  { id: 8044, category: 'pd_fittings', sub: 'pd_fit_weld', icon: '🔩', title: 'Переход сварной d110/63',               price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сварной переход ПЭ100 d110/63мм.' },

  // ─── ЛИТЫЕ ФИТИНГИ ───────────────────────────────────────────────────────
  { id: 8050, category: 'pd_fittings', sub: 'pd_fit_cast', icon: '🔩', title: 'Муфта литая ПЭ100 d32',                 price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Литая муфта соединительная ПЭ100 d32мм.' },
  { id: 8051, category: 'pd_fittings', sub: 'pd_fit_cast', icon: '🔩', title: 'Муфта литая ПЭ100 d63',                 price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Литая муфта соединительная ПЭ100 d63мм.' },
  { id: 8052, category: 'pd_fittings', sub: 'pd_fit_cast', icon: '🔩', title: 'Заглушка литая ПЭ100 d110',             price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Литая заглушка ПЭ100 d110мм.' },

  // ─── МУФТА ЗАЩИТНАЯ ──────────────────────────────────────────────────────
  { id: 8055, category: 'pd_fittings', sub: 'pd_fit_muff', icon: '🔩', title: 'Муфта защитная ПЭ для ЖБ d63',          price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Защитная муфта для прохода ПЭ труб через железобетонные изделия d63мм.' },
  { id: 8056, category: 'pd_fittings', sub: 'pd_fit_muff', icon: '🔩', title: 'Муфта защитная ПЭ для ЖБ d110',         price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Защитная муфта для прохода d110мм.' },
  { id: 8057, category: 'pd_fittings', sub: 'pd_fit_muff', icon: '🔩', title: 'Муфта защитная ПЭ для ЖБ d160',         price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Защитная муфта для прохода d160мм.' },

  // ─── НЕРАЗЪЁМНОЕ СОЕДИНЕНИЕ ПЭ-СТАЛЬ ────────────────────────────────────
  { id: 8060, category: 'pd_fittings', sub: 'pd_fit_steel', icon: '🔩', title: 'Соединение ПЭ-сталь фланцевое d63',    price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Неразъёмное фланцевое соединение ПЭ-сталь d63мм.' },
  { id: 8061, category: 'pd_fittings', sub: 'pd_fit_steel', icon: '🔩', title: 'Соединение ПЭ-сталь фланцевое d110',   price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Неразъёмное фланцевое соединение ПЭ-сталь d110мм.' },
  { id: 8062, category: 'pd_fittings', sub: 'pd_fit_steel', icon: '🔩', title: 'Соединение ПЭ-сталь резьбовое 1" d32',  price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Неразъёмное резьбовое соединение ПЭ-сталь 1" d32мм.' },

  // ─── ФЛАНЦЫ ───────────────────────────────────────────────────────────────
  { id: 8070, category: 'pd_armature', sub: 'pd_arm_flange', icon: '⚙️', title: 'Фланец ПЭ свободный d63 PN10',        price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Свободный фланец ПЭ100 d63мм, PN10.' },
  { id: 8071, category: 'pd_armature', sub: 'pd_arm_flange', icon: '⚙️', title: 'Фланец ПЭ свободный d110 PN10',       price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Свободный фланец ПЭ100 d110мм, PN10.' },
  { id: 8072, category: 'pd_armature', sub: 'pd_arm_flange', icon: '⚙️', title: 'Фланец ПЭ свободный d160 PN10',       price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Свободный фланец ПЭ100 d160мм, PN10.' },
  { id: 8073, category: 'pd_armature', sub: 'pd_arm_flange', icon: '⚙️', title: 'Комплект фланцевого соединения d63',   price: 'Уточнить', basePrice: null, unit: 'компл', description: 'Комплект: 2 фланца, болты, шайбы, прокладка. d63мм.' },
  { id: 8074, category: 'pd_armature', sub: 'pd_arm_flange', icon: '⚙️', title: 'Комплект фланцевого соединения d110',  price: 'Уточнить', basePrice: null, unit: 'компл', description: 'Комплект: 2 фланца, болты, шайбы, прокладка. d110мм.' },

  // ─── СВАРОЧНОЕ ОБОРУДОВАНИЕ ───────────────────────────────────────────────
  { id: 8080, category: 'pd_weld', sub: 'pd_weld_hydr', icon: '🔥', title: 'Аппарат гидравлический МСП 200 (d63-200мм)', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Гидравлический аппарат стыковой сварки МСП 200, диаметры d63–200мм.' },
  { id: 8081, category: 'pd_weld', sub: 'pd_weld_hydr', icon: '🔥', title: 'Аппарат гидравлический МСП 315 (d90-315мм)', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Гидравлический аппарат стыковой сварки МСП 315, диаметры d90–315мм.' },
  { id: 8082, category: 'pd_weld', sub: 'pd_weld_hydr', icon: '🔥', title: 'Аппарат гидравлический МСП 630 (d160-630мм)',price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Гидравлический аппарат стыковой сварки МСП 630, диаметры d160–630мм.' },
  { id: 8083, category: 'pd_weld', sub: 'pd_weld_mech', icon: '🔥', title: 'Аппарат механический МСП 63 (d20-63мм)',   price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Механический аппарат стыковой сварки, диаметры d20–63мм.' },
  { id: 8084, category: 'pd_weld', sub: 'pd_weld_mech', icon: '🔥', title: 'Аппарат механический МСП 110 (d50-110мм)', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Механический аппарат стыковой сварки, диаметры d50–110мм.' },
  { id: 8085, category: 'pd_weld', sub: 'pd_weld_other',icon: '🔥', title: 'Аппарат электросварной для фитингов',     price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Аппарат для сварки электросварных фитингов ПЭ. Автоматический режим.' },
  { id: 8086, category: 'pd_weld', sub: 'pd_weld_other',icon: '🔥', title: 'Нагревательный элемент (зеркало) d110',   price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сменный нагревательный элемент (зеркало) для стыковой сварки d110мм.' },
  { id: 8087, category: 'pd_weld', sub: 'pd_weld_other',icon: '🔥', title: 'Нагревательный элемент (зеркало) d315',   price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Сменный нагревательный элемент d315мм.' },
  { id: 8088, category: 'pd_weld', sub: 'pd_weld_other',icon: '🔥', title: 'Торцеватель d63–160мм',                   price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Торцеватель для подготовки торцов труб d63–160мм.' },
]