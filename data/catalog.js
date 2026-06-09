export const categories = [
  { id: 'all',       label: 'Все категории' },
  { id: 'fence3d',   label: '3D заборы и ворота' },
  { id: 'mesh',      label: 'Сетки' },
  { id: 'piles',     label: 'Сваи и фундаменты' },
  { id: 'septic',    label: 'Септики и очистные' },
  { id: 'kesson',    label: 'Кессоны' },
  { id: 'cellar',    label: 'Погреба' },
  { id: 'tanks',     label: 'Ёмкости пластиковые' },
  { id: 'fglass',    label: 'Стеклопластик (ЛОС)' },
  { id: 'proflist',  label: 'Профлист и алюминий' },
  { id: 'rail',      label: 'Нерж. ограждения' },
  { id: 'boiler',    label: 'Котлы отопительные' },
  { id: 'chimney',   label: 'Дымоходы' },
  { id: 'docke',     label: 'Фасад DOCKE' },
  { id: 'welding',   label: 'Сварочные работы' },
  { id: 'pipe',      label: 'Трубопроводная арматура' },
  { id: 'industry',  label: 'Промышленное оборудование' },
  { id: 'rti',       label: 'РТИ и комплектующие' },
  { id: 'hardware',  label: 'Метизы' },
  { id: 'plastic',   label: 'Трубы ПНД, ПЭ, ПП' },
  { id: 'plumbing',  label: 'Сантехника' },
  { id: 'forged',    label: 'Кованые элементы' },
  { id: 'garden',    label: 'Садовое оборудование' },
  { id: 'services',  label: 'Услуги' },
]

export const subcategories = {
  fence3d:  [
    { id: 'panels',   label: 'Панели 3D' },
    { id: 'posts',    label: 'Столбы' },
    { id: 'fasteners',label: 'Крепёж' },
    { id: 'gates',    label: 'Калитки и ворота' },
  ],
  mesh: [
    { id: 'pvc',      label: 'Сетка с ПВХ' },
    { id: 'zinc',     label: 'Оцинкованная' },
    { id: 'rabica',   label: 'Рабица' },
  ],
  piles: [
    { id: 'lopast',   label: 'Лопастные' },
    { id: 'vintovye', label: 'Винтовые' },
    { id: 'flanets',  label: 'Фланцы' },
  ],
  septic: [
    { id: 'rings',    label: 'Крышки и кольца' },
    { id: 'accum',    label: 'Накопительные' },
    { id: 'auto',     label: 'Автономные' },
  ],
  kesson: [
    { id: 'sfera',    label: 'Сферические' },
    { id: 'bunker',   label: 'Бункер' },
  ],
  cellar: [
    { id: 'std',      label: 'Стандарт' },
    { id: 'lift',     label: 'С подъёмником' },
  ],
  tanks: [
    { id: 'cylinder', label: 'Цилиндрические' },
    { id: 'shower',   label: 'Для душа' },
    { id: 'rect',     label: 'Прямоугольные' },
  ],
  proflist: [
    { id: 'sheet',    label: 'Профнастил' },
    { id: 'aluminum', label: 'Алюминиевый лист' },
  ],
  boiler: [
    { id: 'sten',     label: 'СТЭН' },
    { id: 'karakan',  label: 'Каракан' },
    { id: 'zota',     label: 'ZOTA' },
  ],
  garden: [
    { id: 'containers', label: 'Контейнеры ТБО' },
    { id: 'furniture',  label: 'Мебель и сантехника' },
    { id: 'buildings',  label: 'Бытовки и отдых' },
  ],
  forged: [
    { id: 'venzeli',  label: 'Вензели' },
    { id: 'rings',    label: 'Кольца и корзинки' },
  ],
}

export const items = [
  // ─── 3D ЗАБОРЫ ───────────────────────────────────────────────
  { id: 1,   category: 'fence3d', sub: 'panels',   icon: '🔲', photo: '/catalog/panel-3d-plain.jpg', title: '3D панель 1500×2000 d4мм',            price: 'Уточнить',   basePrice: 1350,  unit: 'шт', description: 'Сварная 3D панель из прутка 4мм. Размер 1500×2000мм.' },
  { id: 2,   category: 'fence3d', sub: 'panels',   icon: '🔲', photo: '/catalog/panel-3d-plain.jpg', title: '3D панель 1500×2500 d4мм',            price: 'Уточнить',   basePrice: 1700,  unit: 'шт', description: 'Сварная 3D панель 1500×2500мм, пруток 4мм.' },
  { id: 3,   category: 'fence3d', sub: 'panels',   icon: '🔲', photo: '/catalog/panel-3d-plain.jpg', title: '3D панель 2000×2500 d4мм',            price: 'Уточнить',   basePrice: 2050,  unit: 'шт', description: 'Сварная 3D панель 2000×2500мм, пруток 4мм.' },
  { id: 4,   category: 'fence3d', sub: 'panels',   icon: '🔲', photo: '/catalog/panel-3d-plain.jpg', title: '3D панель 2000×2500 d5мм',            price: 'Уточнить',   basePrice: 3050,  unit: 'шт', description: 'Усиленная 3D панель 2000×2500мм, пруток 5мм.' },
  { id: 5,   category: 'fence3d', sub: 'panels',   icon: '🔲', photos: ['/catalog/panel-3d-1.jpg','/catalog/panel-3d-2.jpg','/catalog/panel-3d-3.jpg','/catalog/panel-3d-4.jpg'], title: 'Цветная 3D панель и столб',           price: 'Уточнить',   basePrice: 2400,  unit: 'шт', description: 'Окрашенные 3D панели и столбы. Цвет по RAL.' },
  { id: 6,   category: 'fence3d', sub: 'posts',    icon: '🏗️',                                     title: 'Столб 1500×60×60×1.5мм без фланца',  price: 'Уточнить',   basePrice: 900,   unit: 'шт', description: 'Столб для 3D забора 1500мм без монтажного фланца.' },
  { id: 7,   category: 'fence3d', sub: 'posts',    icon: '🏗️',                                     title: 'Столб 2000×60×60×1.5мм без фланца',  price: 'Уточнить',   basePrice: 1300,  unit: 'шт', description: 'Столб для 3D забора 2000мм без монтажного фланца.' },
  { id: 8,   category: 'fence3d', sub: 'posts',    icon: '🏗️',                                     title: 'Столб 3000×60×60×1.5мм без фланца',  price: 'Уточнить',   basePrice: 1700,  unit: 'шт', description: 'Столб для 3D забора 3000мм без монтажного фланца.' },
  { id: 9,   category: 'fence3d', sub: 'posts',    icon: '🏗️',                                     title: 'Столб 2000×60×60×1.5мм с фланцем',   price: 'Уточнить',   basePrice: 1800,  unit: 'шт', description: 'Столб 2000мм с монтажным фланцем для бетонирования.' },
  { id: 10,  category: 'fence3d', sub: 'fasteners',icon: '🔩',                                     title: 'Хомут-скоба 3D забора',               price: 'Уточнить',   basePrice: 50,    unit: 'шт', description: 'Крепёжная скоба для монтажа 3D панелей на столб.' },
  { id: 11,  category: 'fence3d', sub: 'fasteners',icon: '🔩',                                     title: 'Кронштейн прямой 60×60мм',            price: 'Уточнить',   basePrice: 150,   unit: 'шт', description: 'Прямой кронштейн для крепления 3D панели.' },
  { id: 12,  category: 'fence3d', sub: 'fasteners',icon: '🔩',                                     title: 'Кронштейн угловой 60×60мм',           price: 'Уточнить',   basePrice: 150,   unit: 'шт', description: 'Угловой кронштейн для поворота забора.' },
  { id: 13,  category: 'fence3d', sub: 'fasteners',icon: '🔩',                                     title: 'Y-кронштейн для колючей проволоки',   price: 'Уточнить',   basePrice: 800,   unit: 'шт', description: 'Кронштейн Y-образный для крепления егозы.' },
  { id: 14,  category: 'fence3d', sub: 'fasteners',icon: '🌀',                                     title: 'Проволока колючая "Егоза" 10м',       price: 'Уточнить',   basePrice: 1700,  unit: 'рул', description: 'Спиральная колючая проволока Егоза, длина 10м.' },
  { id: 15,  category: 'fence3d', sub: 'gates',    icon: '🚪', photo: '/catalog/kalitka-3d.jpg', title: 'Калитка 1500×900 d4мм (2 столба)',    price: 'Уточнить',   basePrice: 17000, unit: 'шт', description: 'Калитка 1500×900мм в комплекте с 2 столбами.' },
  { id: 16,  category: 'fence3d', sub: 'gates',    icon: '🚪', photo: '/catalog/kalitka-3d.jpg', title: 'Калитка 2000×900 d4мм (2 столба)',    price: 'Уточнить',   basePrice: 20000, unit: 'шт', description: 'Калитка 2000×900мм в комплекте с 2 столбами.' },
  { id: 17,  category: 'fence3d', sub: 'gates',    icon: '🚗', photo: '/catalog/vorota-3d.jpg',  title: 'Ворота 2000×4000 d5мм',               price: 'Уточнить',   basePrice: 38000, unit: 'шт', description: 'Распашные ворота 2×4м, пруток 5мм.' },
  { id: 18,  category: 'fence3d', sub: 'gates',    icon: '🚗', photo: '/catalog/vorota-3d.jpg',  title: 'Ворота 2000×6000 d5мм',               price: 'Уточнить',   basePrice: 48000, unit: 'шт', description: 'Распашные ворота 2×6м, пруток 5мм.' },

  // ─── СЕТКИ ───────────────────────────────────────────────────
  { id: 19,  category: 'mesh', sub: 'pvc',    icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка ПВХ 1.5×10м (50×100×2.5мм)',     price: 'Уточнить', basePrice: 3000,  unit: 'рул', description: 'Сварная сетка с ПВХ покрытием 1.5×10м, ячейка 50×100мм.' },
  { id: 20,  category: 'mesh', sub: 'pvc',    icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка ПВХ 1.8×10м (50×100×2.5мм)',     price: 'Уточнить', basePrice: 3500,  unit: 'рул', description: 'Сварная сетка с ПВХ покрытием 1.8×10м.' },
  { id: 21,  category: 'mesh', sub: 'pvc',    icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка ПВХ 1.2×30м (60×60×1.8мм)',      price: 'Уточнить', basePrice: 6000,  unit: 'рул', description: 'Сварная сетка с ПВХ покрытием 1.2×30м.' },
  { id: 22,  category: 'mesh', sub: 'pvc',    icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка ПВХ 1.5×30м (60×60×1.8мм)',      price: 'Уточнить', basePrice: 6600,  unit: 'рул', description: 'Сварная сетка с ПВХ покрытием 1.5×30м.' },
  { id: 23,  category: 'mesh', sub: 'pvc',    icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка ПВХ 1.8×30м (60×60×1.8мм)',      price: 'Уточнить', basePrice: 7500,  unit: 'рул', description: 'Сварная сетка с ПВХ покрытием 1.8×30м.' },
  { id: 24,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 0.5×5м (2×2см, 1.05мм)',  price: 'Уточнить', basePrice: 742,   unit: 'рул', description: 'Сварная оцинкованная сетка 0.5×5м, ячейка 2×2см.' },
  { id: 25,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 1×5м (2×2см, 1.05мм)',    price: 'Уточнить', basePrice: 1400,  unit: 'рул', description: 'Сварная оцинкованная сетка 1×5м, ячейка 2×2см.' },
  { id: 26,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 0.9×30м (2×2см)',         price: 'Уточнить', basePrice: 2050,  unit: 'рул', description: 'Сварная оцинкованная сетка 0.9×30м, ячейка 2×2см.' },
  { id: 27,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 1.2×18м (2.5×2.5см)',     price: 'Уточнить', basePrice: 4260,  unit: 'рул', description: 'Сварная оцинкованная сетка 1.2×18м.' },
  { id: 28,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 1.5×10м (5×5см, 2мм)',    price: 'Уточнить', basePrice: 4410,  unit: 'рул', description: 'Сварная оцинкованная сетка 1.5×10м, ячейка 5×5см.' },
  { id: 29,  category: 'mesh', sub: 'zinc',   icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Сетка оцинк. 1.5×20м (5×5см, 2мм)',    price: 'Уточнить', basePrice: 8820,  unit: 'рул', description: 'Сварная оцинкованная сетка 1.5×20м.' },
  { id: 30,  category: 'mesh', sub: 'rabica', icon: '🔗', photo: '/catalog/mesh-rabica.jpg', title: 'Рабица 1×27м (2×2мм, тонкая)',          price: 'Уточнить', basePrice: 9000,  unit: 'рул', description: 'Сетка рабица оцинкованная 1×27м, тонкая.' },
  { id: 31,  category: 'mesh', sub: 'rabica', icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Рабица 1×27м (2×2мм, толстая)',         price: 'Уточнить', basePrice: 12900, unit: 'рул', description: 'Сетка рабица оцинкованная 1×27м, усиленная.' },
  { id: 32,  category: 'mesh', sub: 'rabica', icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Рабица 1×27м (6×6мм)',                  price: 'Уточнить', basePrice: 12900, unit: 'рул', description: 'Сетка рабица оцинкованная 1×27м, ячейка 6×6мм.' },
  { id: 33,  category: 'mesh', sub: 'rabica', icon: '🔗', photo: '/catalog/mesh.jpg', title: 'Рабица 1×27м (9×9мм)',                  price: 'Уточнить', basePrice: 12900, unit: 'рул', description: 'Сетка рабица оцинкованная 1×27м, ячейка 9×9мм.' },

  // ─── СВАИ И ФУНДАМЕНТЫ ───────────────────────────────────────
  { id: 34,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 60×5×150×500мм',       price: 'Уточнить', basePrice: 1050,  unit: 'шт', description: 'Лопастная свая 60мм, длина 500мм.' },
  { id: 35,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая винтовая 60×5×150×500мм',        price: 'Уточнить', basePrice: 1050,  unit: 'шт', description: 'Винтовая свая 60мм, длина 500мм.' },
  { id: 36,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 60×5×150×1000мм',      price: 'Уточнить', basePrice: 1300,  unit: 'шт', description: 'Лопастная свая 60мм, длина 1000мм.' },
  { id: 37,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая винтовая 60×5×150×1000мм',       price: 'Уточнить', basePrice: 1300,  unit: 'шт', description: 'Винтовая свая 60мм, длина 1000мм.' },
  { id: 38,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 60×5×150×1500мм',      price: 'Уточнить', basePrice: 1400,  unit: 'шт', description: 'Лопастная свая 60мм, длина 1500мм.' },
  { id: 39,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая винтовая 60×5×150×1500мм',       price: 'Уточнить', basePrice: 1400,  unit: 'шт', description: 'Винтовая свая 60мм, длина 1500мм.' },
  { id: 40,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 60×5×150×2000мм',      price: 'Уточнить', basePrice: 1750,  unit: 'шт', description: 'Лопастная свая 60мм, длина 2000мм.' },
  { id: 41,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая винтовая 60×5×150×2000мм',       price: 'Уточнить', basePrice: 1750,  unit: 'шт', description: 'Винтовая свая 60мм, длина 2000мм.' },
  { id: 42,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 73×5.5×200×1000мм',    price: 'Уточнить', basePrice: 1600,  unit: 'шт', description: 'Лопастная свая 73мм, длина 1000мм.' },
  { id: 43,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая винтовая 73×5.5×200×1000мм',     price: 'Уточнить', basePrice: 1600,  unit: 'шт', description: 'Винтовая свая 73мм, длина 1000мм.' },
  { id: 44,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 73×5.5×200×1500мм',    price: 'Уточнить', basePrice: 1800,  unit: 'шт', description: 'Лопастная свая 73мм, длина 1500мм.' },
  { id: 45,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 73×5.5×200×2000мм',    price: 'Уточнить', basePrice: 2100,  unit: 'шт', description: 'Лопастная свая 73мм, длина 2000мм.' },
  { id: 46,  category: 'piles', sub: 'lopast',   icon: '⚓', photo: '/catalog/piles-lopast.jpg', title: 'Свая лопастная 60×5×150×2500мм',      price: 'Уточнить', basePrice: 2100,  unit: 'шт', description: 'Лопастная свая 60мм, длина 2500мм.' },
  { id: 47,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая оцинк. 800мм',                   price: 'Уточнить', basePrice: 800,   unit: 'шт', description: 'Оцинкованная винтовая свая длиной 800мм.' },
  { id: 48,  category: 'piles', sub: 'vintovye', icon: '⚓', photo: '/catalog/piles.jpg',        title: 'Свая оцинк. 1000мм',                  price: 'Уточнить', basePrice: 1250,  unit: 'шт', description: 'Оцинкованная винтовая свая длиной 1000мм.' },
  { id: 49,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 140×140×5мм',          price: 'Уточнить', basePrice: 250,   unit: 'шт', description: 'Квадратный опорный фланец 140×140мм, толщина 5мм.' },
  { id: 50,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 150×150×5мм',          price: 'Уточнить', basePrice: 300,   unit: 'шт', description: 'Квадратный опорный фланец 150×150мм с отверстием.' },
  { id: 51,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 180×180×5мм',          price: 'Уточнить', basePrice: 350,   unit: 'шт', description: 'Квадратный опорный фланец 180×180мм с отверстием.' },
  { id: 52,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 200×200×5мм',          price: 'Уточнить', basePrice: 400,   unit: 'шт', description: 'Квадратный опорный фланец 200×200мм с отверстием.' },
  { id: 53,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 250×250×5мм',          price: 'Уточнить', basePrice: 600,   unit: 'шт', description: 'Квадратный опорный фланец 250×250мм с отверстием.' },
  { id: 54,  category: 'piles', sub: 'flanets',  icon: '🔩', photo: '/catalog/piles-flange.jpg', title: 'Фланец опорный 300×300×5мм',          price: 'Уточнить', basePrice: 800,   unit: 'шт', description: 'Квадратный опорный фланец 300×300мм с отверстием.' },

  // ─── СЕПТИКИ ─────────────────────────────────────────────────
  { id: 55,  category: 'septic', sub: 'rings', icon: '💧',                                    title: 'Крышка колодца/ёмкости',              price: 'Уточнить', basePrice: 4500,   unit: 'шт', description: 'Крышка для колодца или накопительной ёмкости.' },
  { id: 56,  category: 'septic', sub: 'rings', icon: '💧',                                    title: 'Доборное кольцо колодца 30см',        price: 'Уточнить', basePrice: 6500,   unit: 'шт', description: 'Удлинительное кольцо для колодца, высота 30см.' },
  { id: 57,  category: 'septic', sub: 'rings', icon: '💧',                                    title: 'Доборное кольцо колодца 50см',        price: 'Уточнить', basePrice: 7500,   unit: 'шт', description: 'Удлинительное кольцо для колодца, высота 50см.' },
  { id: 58,  category: 'septic', sub: 'accum', icon: '💧', photo: '/catalog/septic.jpg',      title: 'Септик «ШАР» накопительный 1000л',    price: 'Уточнить', basePrice: 36000,  unit: 'шт', description: 'Накопительный септик ШАР объёмом 1000 литров.' },
  { id: 59,  category: 'septic', sub: 'auto',  icon: '💧', photo: '/catalog/septic.jpg',      title: 'ПСБО «ШАР» автономная система',       price: 'Уточнить', basePrice: 49500,  unit: 'шт', description: 'Полная автономная система очистки ШАР.' },
  { id: 60,  category: 'septic', sub: 'accum', icon: '💧', photo: '/catalog/septic.jpg',      title: 'Септик «ЖУК» накопительный 2500л',   price: 'Уточнить', basePrice: 79000,  unit: 'шт', description: 'Накопительный септик ЖУК объёмом 2500 литров.' },
  { id: 61,  category: 'septic', sub: 'auto',  icon: '💧', photo: '/catalog/septic.jpg',      title: 'Септик ТВЕРЬ LITE 0.6Н',              price: 'Уточнить', basePrice: 80100,  unit: 'шт', description: 'Автономная канализация ТВЕРЬ LITE серия 0.6Н.' },
  { id: 62,  category: 'septic', sub: 'auto',  icon: '💧', photo: '/catalog/septic.jpg',      title: 'Септик «СКАРАБЕЙ» 5000л',             price: 'Уточнить', basePrice: 117000, unit: 'шт', description: 'Накопительный септик СКАРАБЕЙ объёмом 5000 литров.' },

  // ─── КЕССОНЫ ─────────────────────────────────────────────────
  { id: 63,  category: 'kesson', sub: 'sfera',  icon: '🏗️', title: 'Кессон «Шар» сферический',           price: 'Уточнить', basePrice: 35500,  unit: 'шт', description: 'Пластиковый кессон сферической формы.' },
  { id: 64,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1 (1110×1110×2110мм)',price: 'Уточнить', basePrice: 90250,  unit: 'шт', description: 'Кессон Бункер К1, размер 1110×1110×2110мм.' },
  { id: 65,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1М (1110×1110×2340)', price: 'Уточнить', basePrice: 95950,  unit: 'шт', description: 'Кессон Бункер К1М, размер 1110×1110×2340мм.' },
  { id: 66,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1.2 (1310×1310×2110)',price: 'Уточнить', basePrice: 102600, unit: 'шт', description: 'Кессон Бункер К1.2, размер 1310×1310×2110мм.' },
  { id: 67,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1L (1110×1110×2570)', price: 'Уточнить', basePrice: 104500, unit: 'шт', description: 'Кессон Бункер К1L удлинённый 2570мм.' },
  { id: 68,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1.2М',                price: 'Уточнить', basePrice: 109250, unit: 'шт', description: 'Кессон Бункер К1.2М, размер 1310×1310×2340мм.' },
  { id: 69,  category: 'kesson', sub: 'bunker', icon: '🏗️', title: 'Кессон Бункер К1.2L',                price: 'Уточнить', basePrice: 118750, unit: 'шт', description: 'Кессон Бункер К1.2L, размер 1310×1310×2570мм.' },

  // ─── ПОГРЕБА ─────────────────────────────────────────────────
  { id: 70,  category: 'cellar', sub: 'std',  icon: '🏠', photo: '/catalog/cellar.jpg', title: 'Погреб ПП 1',                         price: 'Уточнить', basePrice: 259470, unit: 'шт', description: 'Пластиковый погреб ПП 1 стандарт.' },
  { id: 71,  category: 'cellar', sub: 'std',  icon: '🏠', photo: '/catalog/cellar.jpg', title: 'Погреб ПП 1 Long',                    price: 'Уточнить', basePrice: 295830, unit: 'шт', description: 'Пластиковый погреб ПП 1 удлинённый.' },
  { id: 72,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 2',                         price: 'Уточнить', basePrice: 312750, unit: 'шт', description: 'Пластиковый погреб ПП 2.' },
  { id: 73,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 2 Long',                    price: 'Уточнить', basePrice: 351360, unit: 'шт', description: 'Пластиковый погреб ПП 2 удлинённый.' },
  { id: 74,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 3',                         price: 'Уточнить', basePrice: 394650, unit: 'шт', description: 'Пластиковый погреб ПП 3.' },
  { id: 75,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 3 Long',                    price: 'Уточнить', basePrice: 435330, unit: 'шт', description: 'Пластиковый погреб ПП 3 удлинённый.' },
  { id: 76,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 4',                         price: 'Уточнить', basePrice: 446670, unit: 'шт', description: 'Пластиковый погреб ПП 4.' },
  { id: 77,  category: 'cellar', sub: 'std',  icon: '🏠', title: 'Погреб ПП 4 Long',                    price: 'Уточнить', basePrice: 498060, unit: 'шт', description: 'Пластиковый погреб ПП 4 удлинённый.' },
  { id: 78,  category: 'cellar', sub: 'lift', icon: '🏠', title: 'Погреб ПП 1 с подъёмным механизмом',  price: 'Уточнить', basePrice: 343710, unit: 'шт', description: 'Погреб ПП 1 с грузоподъёмным механизмом.' },
  { id: 79,  category: 'cellar', sub: 'lift', icon: '🏠', title: 'Погреб ПП 2 с подъёмным механизмом',  price: 'Уточнить', basePrice: 399150, unit: 'шт', description: 'Погреб ПП 2 с грузоподъёмным механизмом.' },
  { id: 80,  category: 'cellar', sub: 'lift', icon: '🏠', title: 'Погреб ПП 3 с подъёмным механизмом',  price: 'Уточнить', basePrice: 481410, unit: 'шт', description: 'Погреб ПП 3 с грузоподъёмным механизмом.' },
  { id: 81,  category: 'cellar', sub: 'lift', icon: '🏠', title: 'Погреб ПП 4 с подъёмным механизмом',  price: 'Уточнить', basePrice: 554310, unit: 'шт', description: 'Погреб ПП 4 с грузоподъёмным механизмом.' },

  // ─── ЁМКОСТИ ПЛАСТИКОВЫЕ ─────────────────────────────────────
  { id: 82,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 100л',  price: 'Уточнить', basePrice: 4800,  unit: 'шт', description: 'Вертикальная пластиковая ёмкость 100 литров.' },
  { id: 83,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 210л',  price: 'Уточнить', basePrice: 6800,  unit: 'шт', description: 'Вертикальная пластиковая ёмкость 210 литров.' },
  { id: 84,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 260л',  price: 'Уточнить', basePrice: 8500,  unit: 'шт', description: 'Вертикальная пластиковая ёмкость 260 литров.' },
  { id: 85,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 300л',  price: 'Уточнить', basePrice: 8900,  unit: 'шт', description: 'Вертикальная пластиковая ёмкость 300 литров.' },
  { id: 86,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 400л',  price: 'Уточнить', basePrice: 10700, unit: 'шт', description: 'Вертикальная пластиковая ёмкость 400 литров.' },
  { id: 87,  category: 'tanks', sub: 'cylinder', icon: '🛢️', title: 'Ёмкость цилиндрическая 500л',  price: 'Уточнить', basePrice: 12300, unit: 'шт', description: 'Вертикальная пластиковая ёмкость 500 литров.' },
  { id: 88,  category: 'tanks', sub: 'shower',   icon: '🛢️', title: 'Бак для летнего душа 100л',    price: 'Уточнить', basePrice: 6600,  unit: 'шт', description: 'Накопительный бак для летнего душа 100л.' },
  { id: 89,  category: 'tanks', sub: 'shower',   icon: '🛢️', title: 'Бак для летнего душа 200л',    price: 'Уточнить', basePrice: 8900,  unit: 'шт', description: 'Накопительный бак для летнего душа 200л.' },
  { id: 90,  category: 'tanks', sub: 'rect',     icon: '🛢️', title: 'Ёмкость прямоугольная 200л',   price: 'Уточнить', basePrice: 8500,  unit: 'шт', description: 'Прямоугольная пластиковая ёмкость 200 литров.' },

  // ─── СТЕКЛОПЛАСТИК (ЛОС-ЕМ) ──────────────────────────────────
  { id: 91,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 2000л',                        price: 'Уточнить', basePrice: 236600,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 2000 литров.' },
  { id: 92,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 3000л',                        price: 'Уточнить', basePrice: 253000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 3000 литров.' },
  { id: 93,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 4000л',                        price: 'Уточнить', basePrice: 299000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 4000 литров.' },
  { id: 94,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 5000л',                        price: 'Уточнить', basePrice: 320500,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 5000 литров.' },
  { id: 95,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 10000л',                       price: 'Уточнить', basePrice: 380000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 10 000 литров.' },
  { id: 96,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 15000л',                       price: 'Уточнить', basePrice: 499000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 15 000 литров.' },
  { id: 97,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 20000л',                       price: 'Уточнить', basePrice: 560000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 20 000 литров.' },
  { id: 98,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 25000л',                       price: 'Уточнить', basePrice: 602000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 25 000 литров.' },
  { id: 99,  category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 35000л',                       price: 'Уточнить', basePrice: 695000,  unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 35 000 литров.' },
  { id: 100, category: 'fglass', icon: '🧪', title: 'ЛОС-Ем 50000л',                       price: 'Уточнить', basePrice: 1120000, unit: 'шт', description: 'Стеклопластиковая ёмкость ЛОС-Ем 50 000 литров.' },

  // ─── ПРОФЛИСТ И АЛЮМИНИЙ ─────────────────────────────────────
  { id: 101, category: 'proflist', sub: 'sheet',    icon: '🏗️',                         title: 'Профлист окрашенный',              price: 'Уточнить', basePrice: 400,   unit: 'м²', description: 'Окрашенный металлический профнастил. Цвет по RAL.' },
  { id: 102, category: 'proflist', sub: 'sheet',    icon: '🏗️',                         title: 'Профлист оцинкованный',            price: 'Уточнить', basePrice: 400,   unit: 'м²', description: 'Оцинкованный металлический профнастил.' },
  { id: 103, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1200×3000×1.2мм', price: 'Уточнить', basePrice: 11000, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1200×3000мм, толщина 1.2мм.' },
  { id: 104, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1200×3000×1.5мм', price: 'Уточнить', basePrice: 13000, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1200×3000мм, толщина 1.5мм.' },
  { id: 105, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1500×3000×1.2мм', price: 'Уточнить', basePrice: 14000, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1500×3000мм, толщина 1.2мм.' },
  { id: 106, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1200×3000×2мм',   price: 'Уточнить', basePrice: 17500, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1200×3000мм, толщина 2мм.' },
  { id: 107, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1200×3000×3мм',   price: 'Уточнить', basePrice: 28500, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1200×3000мм, толщина 3мм.' },
  { id: 108, category: 'proflist', sub: 'aluminum', icon: '🏗️', photo: '/catalog/proflist.jpg', title: 'Лист алюминиевый 1200×3000×4мм',   price: 'Уточнить', basePrice: 37000, unit: 'шт', description: 'Рифлёный алюминиевый лист Квинтет 1200×3000мм, толщина 4мм.' },

  // ─── НЕРЖАВЕЮЩИЕ ОГРАЖДЕНИЯ ──────────────────────────────────
  { id: 109, category: 'rail', icon: '✨', title: 'Труба нерж. круглая Ø16×1.5мм AISI 304', price: 'Уточнить', basePrice: 540,  unit: 'м', description: 'Круглая нержавеющая труба зеркальная Ø16мм AISI 304.' },
  { id: 110, category: 'rail', icon: '✨', title: 'Отвод для поручня Ø50.8мм AISI 304',     price: 'Уточнить', basePrice: 450,  unit: 'шт', description: 'Угловой отвод для поручня Ø50.8мм, нержавейка.' },
  { id: 111, category: 'rail', icon: '✨', title: 'Держатель прутка на стойку Ø38.1мм',     price: 'Уточнить', basePrice: 250,  unit: 'шт', description: 'Держатель прутка Ø16мм на стойку Ø38.1мм AISI 304.' },
  { id: 112, category: 'rail', icon: '✨', title: 'Кронштейн боковой для стойки Ø38.1мм',  price: 'Уточнить', basePrice: 400,  unit: 'шт', description: 'Боковой монтажный кронштейн для стойки Ø38.1мм.' },
  { id: 113, category: 'rail', icon: '✨', title: 'Заглушка штампованная Ø38.1мм',          price: 'Уточнить', basePrice: 150,  unit: 'шт', description: 'Штампованная заглушка для стойки Ø38.1мм AISI 304.' },

  // ─── КОТЛЫ ОТОПЛЕНИЯ ─────────────────────────────────────────
  { id: 114, category: 'boiler', sub: 'sten',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл СТЭН mini 7 (терракот)',  price: 'Уточнить', basePrice: 26300, unit: 'шт', description: 'Твёрдотопливный котёл СТЭН mini 7 кВт, цвет терракот.' },
  { id: 115, category: 'boiler', sub: 'sten',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл СТЭН mini 11 (терракот)', price: 'Уточнить', basePrice: 32200, unit: 'шт', description: 'Твёрдотопливный котёл СТЭН mini 11 кВт, цвет терракот.' },
  { id: 116, category: 'boiler', sub: 'karakan', icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл «Каракан» 8ТПЭ-3',       price: 'Уточнить', basePrice: 32310, unit: 'шт', description: 'Твёрдотопливный котёл Каракан 8ТПЭ-3.' },
  { id: 117, category: 'boiler', sub: 'karakan', icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл «Каракан» 12ТПЭ-3',      price: 'Уточнить', basePrice: 41453, unit: 'шт', description: 'Твёрдотопливный котёл Каракан 12ТПЭ-3.' },
  { id: 118, category: 'boiler', sub: 'zota',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл ZOTA Master-X 12кВт',    price: 'Уточнить', basePrice: 51000, unit: 'шт', description: 'Твёрдотопливный котёл ZOTA Master-X мощностью 12 кВт.' },
  { id: 119, category: 'boiler', sub: 'zota',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл ZOTA Master-X 20кВт',    price: 'Уточнить', basePrice: 57200, unit: 'шт', description: 'Твёрдотопливный котёл ZOTA Master-X мощностью 20 кВт.' },
  { id: 120, category: 'boiler', sub: 'sten',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл СТЭН Кобальт 15',        price: 'Уточнить', basePrice: 52500, unit: 'шт', description: 'Твёрдотопливный котёл СТЭН Кобальт 15 кВт.' },
  { id: 121, category: 'boiler', sub: 'sten',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл СТЭН Кобальт 25',        price: 'Уточнить', basePrice: 66000, unit: 'шт', description: 'Твёрдотопливный котёл СТЭН Кобальт 25 кВт.' },
  { id: 122, category: 'boiler', sub: 'sten',    icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл СТЭН Кобальт 35',        price: 'Уточнить', basePrice: 75000, unit: 'шт', description: 'Твёрдотопливный котёл СТЭН Кобальт 35 кВт.' },
  { id: 123, category: 'boiler', sub: 'karakan', icon: '🔥', photo: '/catalog/boiler-front.jpg', title: 'Котёл «Каракан» 30ТЭГВ-3',     price: 'Уточнить', basePrice: 69000, unit: 'шт', description: 'Твёрдотопливный котёл Каракан 30ТЭГВ-3.' },

  // ─── ДЫМОХОДЫ ─────────────────────────────────────────────────
  { id: 124, category: 'chimney', icon: '🏭', title: 'Дымоход 0.25м Ø110мм (нерж.)',       price: 'Уточнить', basePrice: 310, unit: 'шт', description: 'Секция дымохода 0.25м Ø110мм, нержавеющая сталь 430.' },
  { id: 125, category: 'chimney', icon: '🏭', title: 'Колено 135° Ø80мм (нерж.)',           price: 'Уточнить', basePrice: 396, unit: 'шт', description: 'Угловое колено 135° Ø80мм, нержавеющая сталь 430.' },
  { id: 126, category: 'chimney', icon: '🏭', title: 'Адаптер ММ Ø100мм (нерж.)',           price: 'Уточнить', basePrice: 205, unit: 'шт', description: 'Адаптер муфта-муфта Ø100мм, нержавеющая сталь 430.' },
  { id: 127, category: 'chimney', icon: '🏭', title: 'Адаптер ММ Ø120мм (нерж.)',           price: 'Уточнить', basePrice: 220, unit: 'шт', description: 'Адаптер муфта-муфта Ø120мм, нержавеющая сталь 430.' },
  { id: 128, category: 'chimney', icon: '🏭', title: 'Конденсатоотвод Ø115мм (нерж.)',      price: 'Уточнить', basePrice: 390, unit: 'шт', description: 'Конденсатоотводчик Ø115мм для дымоходной системы.' },
  { id: 129, category: 'chimney', icon: '🏭', title: 'Заглушка внешняя Ø100мм (нерж.)',    price: 'Уточнить', basePrice: 249, unit: 'шт', description: 'Внешняя заглушка Ø100мм, нержавеющая сталь 430.' },

  // ─── ФАСАД DOCKE ─────────────────────────────────────────────
  { id: 130, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Slate (Шампери)',    price: 'Уточнить', basePrice: 717, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Slate, цвет Шампери.' },
  { id: 131, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Slate (Шамони)',     price: 'Уточнить', basePrice: 717, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Slate, цвет Шамони.' },
  { id: 132, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Dufour (Виллар)',    price: 'Уточнить', basePrice: 770, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Dufour, цвет Виллар.' },
  { id: 133, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Dufour (Давос)',     price: 'Уточнить', basePrice: 770, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Dufour, цвет Давос.' },
  { id: 134, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Altai (Ваниль)',     price: 'Уточнить', basePrice: 814, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Altai, цвет Ваниль.' },
  { id: 135, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Altai (Шоколад)',    price: 'Уточнить', basePrice: 814, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Altai, цвет Шоколад.' },
  { id: 136, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Flemish (Красный)',  price: 'Уточнить', basePrice: 844, unit: 'шт', description: 'Фасадная панель DOCKE коллекция Flemish, цвет Красный.' },
  { id: 137, category: 'docke', icon: '🏡', title: 'Панель DOCKE серия Berg (Серый)',       price: 'Уточнить', basePrice: 946, unit: 'шт', description: 'Премиум панель DOCKE коллекция Berg, цвет Серый.' },

  // ─── КОВАНЫЕ ЭЛЕМЕНТЫ ────────────────────────────────────────
  { id: 138, category: 'forged', sub: 'venzeli', icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Вензель-запятая 130×110мм',  price: 'Уточнить', basePrice: 98,  unit: 'шт', description: 'Кованый декоративный элемент вензель-запятая 130×110мм.' },
  { id: 139, category: 'forged', sub: 'venzeli', icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Вензель «С» 115×80мм',      price: 'Уточнить', basePrice: 110, unit: 'шт', description: 'Кованый декоративный вензель С-образный 115×80мм.' },
  { id: 140, category: 'forged', sub: 'venzeli', icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Вензель S 225×80мм',        price: 'Уточнить', basePrice: 145, unit: 'шт', description: 'Кованый декоративный вензель S-образный 225×80мм.' },
  { id: 141, category: 'forged', sub: 'rings',   icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Кольцо кованое 130мм',      price: 'Уточнить', basePrice: 140, unit: 'шт', description: 'Кованое декоративное кольцо диаметром 130мм.' },
  { id: 142, category: 'forged', sub: 'rings',   icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Кольцо кованое 190мм',      price: 'Уточнить', basePrice: 200, unit: 'шт', description: 'Кованое декоративное кольцо диаметром 190мм.' },
  { id: 143, category: 'forged', sub: 'rings',   icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Корзинка кованая 120–170мм', price: 'Уточнить', basePrice: 250, unit: 'шт', description: 'Кованый декоративный элемент корзинка 120–170мм.' },
  { id: 144, category: 'forged', sub: 'venzeli', icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Вензель «С» 350×240мм',     price: 'Уточнить', basePrice: 242, unit: 'шт', description: 'Кованый декоративный вензель С-образный крупный 350×240мм.' },
  { id: 145, category: 'forged', sub: 'venzeli', icon: '⚙️', photo: '/catalog/forged.jpg', title: 'Вензель S 430×120мм',       price: 'Уточнить', basePrice: 270, unit: 'шт', description: 'Кованый декоративный вензель S крупный 430×120мм.' },

  // ─── САДОВОЕ ОБОРУДОВАНИЕ ────────────────────────────────────
  { id: 146, category: 'garden', sub: 'containers', icon: '🌿', title: 'Контейнер ТБО 0.65м³',   price: 'Уточнить', basePrice: 14900,  unit: 'шт',  description: 'Мусорный контейнер под ТКО объёмом 0.65 м³.' },
  { id: 147, category: 'garden', sub: 'containers', icon: '🌿', title: 'Контейнер ТБО 0.75м³',   price: 'Уточнить', basePrice: 17000,  unit: 'шт',  description: 'Мусорный контейнер под ТКО объёмом 0.75 м³.' },
  { id: 148, category: 'garden', sub: 'furniture',  icon: '🌿', title: 'Геотекстиль',             price: 'Уточнить', basePrice: 30000,  unit: 'рул', description: 'Геотекстиль нетканый для дорожного строительства и дренажа.' },
  { id: 149, category: 'garden', sub: 'furniture',  icon: '🌿', photo: '/catalog/bench.jpg', title: 'Скамейка / лавочка',      price: 'Уточнить', basePrice: 30000,  unit: 'шт',  description: 'Садовая скамейка для двора или парка.' },
  { id: 150, category: 'garden', sub: 'furniture',  icon: '🚽', photo: '/catalog/bench.jpg', title: 'Биотуалет пластиковый',   price: 'Уточнить', basePrice: 35900,  unit: 'шт',  description: 'Уличный пластиковый биотуалет для дачи или стройки.' },
  { id: 151, category: 'garden', sub: 'buildings',  icon: '📦', photo: '/catalog/bench.jpg', title: 'Бытовка / хозблок',       price: 'Уточнить', basePrice: 100000, unit: 'шт',  description: 'Готовая бытовка хозяйственного назначения.' },
  { id: 152, category: 'garden', sub: 'buildings',  icon: '🛁', photo: '/catalog/bench.jpg', title: 'Чан банный / купель фурако', price: 'Уточнить', basePrice: 200000, unit: 'шт', description: 'Деревянный банный чан купель фурако для бани и отдыха.' },
  { id: 153, category: 'garden', sub: 'buildings',  icon: '🔥', photo: '/catalog/bench.jpg', title: 'Мангальная зона',          price: 'Уточнить', basePrice: 350000, unit: 'шт',  description: 'Готовая мангальная зона под ключ.' },

  // ─── СВАРОЧНЫЕ РАБОТЫ ────────────────────────────────────────
  { id: 160, category: 'welding', icon: '🔧', title: 'Вольер для собак',              price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Изготовление и монтаж вольеров любого размера под ключ. Сварная конструкция, оцинкованная сетка, крыша. Индивидуальные размеры.' },
  { id: 161, category: 'welding', icon: '🔧', title: 'Курятник / птичник',            price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Изготовление и монтаж хозблоков для птицы. Утепление, вентиляция, насесты. Металлический каркас, сварка.' },
  { id: 162, category: 'welding', icon: '🔧', title: 'Металлический навес',           price: 'Уточнить', basePrice: null, unit: 'м²',    description: 'Сварной навес над воротами, парковкой, крыльцом. Профтруба + поликарбонат или профлист. Под ключ.' },
  { id: 163, category: 'welding', icon: '🔧', title: 'Калитка сварная',              price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Изготовление металлической калитки по индивидуальным размерам. Грунтовка, покраска в цвет.' },
  { id: 164, category: 'welding', icon: '🔧', title: 'Ворота распашные',             price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Сварные распашные ворота из профтрубы. Любой размер, грунтовка и покраска включены.' },
  { id: 165, category: 'welding', icon: '🔧', title: 'Ворота откатные',              price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Откатные ворота с механизмом. Сварная рама, профлист или сетка. Монтаж под ключ.' },
  { id: 166, category: 'welding', icon: '🔧', title: 'Металлическая лестница',       price: 'Уточнить', basePrice: null, unit: 'шт',     description: 'Сварная металлическая лестница для дома, дачи или производственного помещения.' },
  { id: 167, category: 'welding', icon: '🔧', title: 'Металлоконструкции под заказ', price: 'Уточнить', basePrice: null, unit: 'объект', description: 'Изготовление любых металлоконструкций по чертежу или эскизу заказчика. Сварка, покраска.' },

  // ─── ТРУБОПРОВОДНАЯ АРМАТУРА ──────────────────────────────────
  { id: 168, category: 'pipe', title: 'Детали трубопровода',    price: 'Уточнить', basePrice: null, unit: 'шт',  description: 'Фланцы, отводы, переходы, тройники. Стальные и чугунные. Любые размеры под заказ.' },
  { id: 169, category: 'pipe', title: 'Запорная арматура',      price: 'Уточнить', basePrice: null, unit: 'шт',  description: 'Задвижки, клапаны, краны шаровые. Для водо-, газо- и теплоснабжения.' },
  { id: 170, category: 'pipe', title: 'Сантехнические трубы',   price: 'Уточнить', basePrice: null, unit: 'м',   description: 'Трубы ПНД, ПЭ, ПП для водоснабжения и канализации. Любые диаметры.' },
  { id: 171, category: 'pipe', title: 'Фланцы стальные',        price: 'Уточнить', basePrice: null, unit: 'шт',  description: 'Стальные плоские и воротниковые фланцы Ду15–Ду500. ГОСТ.' },

  // ─── ПРОМЫШЛЕННОЕ ОБОРУДОВАНИЕ ────────────────────────────────
  { id: 172, category: 'industry', title: 'Подшипники',              price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Подшипники качения и скольжения. SKF, NSK, FAG и отечественные. Большой выбор.' },
  { id: 173, category: 'industry', title: 'ЗИП судового оборудования', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Запасные части и инструменты для судового оборудования. Поставка под заказ.' },
  { id: 174, category: 'industry', title: 'Насосы и насосные станции', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Промышленные насосы для воды, химии, нефтепродуктов. Поставка и монтаж.' },
  { id: 175, category: 'industry', title: 'Электродвигатели',          price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Асинхронные и синхронные электродвигатели. Мощность от 0.1 до 500 кВт.' },

  // ─── РТИ И КОМПЛЕКТУЮЩИЕ ──────────────────────────────────────
  { id: 176, category: 'rti', title: 'Резинотехнические изделия', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Уплотнители, прокладки, манжеты, муфты. Стойкие к агрессивным средам.' },
  { id: 177, category: 'rti', title: 'Ремни приводные',           price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Клиновые и плоские приводные ремни. Все типоразмеры.' },
  { id: 178, category: 'rti', title: 'Шланги и рукава',           price: 'Уточнить', basePrice: null, unit: 'м',  description: 'Резиновые и армированные шланги для воды, воздуха, топлива.' },

  // ─── МЕТИЗЫ ───────────────────────────────────────────────────
  { id: 179, category: 'hardware', title: 'Болты, гайки, шайбы',    price: 'Уточнить', basePrice: null, unit: 'кг', description: 'Крепёжные изделия из чёрного металла и нержавейки. ГОСТ и DIN. Опт и розница.' },
  { id: 180, category: 'hardware', title: 'Саморезы и шурупы',       price: 'Уточнить', basePrice: null, unit: 'кг', description: 'Саморезы кровельные, универсальные, по металлу и дереву.' },
  { id: 181, category: 'hardware', title: 'Анкеры и дюбели',         price: 'Уточнить', basePrice: null, unit: 'уп', description: 'Анкерные болты, химические анкеры, дюбели для различных оснований.' },
  { id: 182, category: 'hardware', title: 'Хомуты и стяжки',         price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Хомуты нержавеющие, оцинкованные, пластиковые стяжки. Все размеры.' },

  // ─── ТРУБЫ ПНД, ПЭ, ПП ───────────────────────────────────────
  { id: 183, category: 'plastic', title: 'Труба ПНД для водоснабжения',   price: 'Уточнить', basePrice: null, unit: 'м', description: 'Полиэтиленовые трубы ПНД Ду20–Ду630. Питьевая и техническая вода.' },
  { id: 184, category: 'plastic', title: 'Труба ПЭ для газоснабжения',    price: 'Уточнить', basePrice: null, unit: 'м', description: 'Газовые трубы ПЭ80, ПЭ100. SDR11, SDR17. По ГОСТу.' },
  { id: 185, category: 'plastic', title: 'Труба ПП для канализации',      price: 'Уточнить', basePrice: null, unit: 'м', description: 'Канализационные трубы и фитинги ПП серого и оранжевого цвета.' },
  { id: 186, category: 'plastic', title: 'Фитинги и соединения',          price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Муфты, тройники, отводы, краны для труб ПНД и ПЭ. Все диаметры.' },

  // ─── САНТЕХНИКА ───────────────────────────────────────────────
  { id: 187, category: 'plumbing', title: 'Умывальники и раковины', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Керамические и стальные умывальники. Различные формы и размеры.' },
  { id: 188, category: 'plumbing', title: 'Унитазы компакт',        price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Унитазы-компакт, подвесные, напольные. Эконом и премиум сегмент.' },
  { id: 189, category: 'plumbing', title: 'Смесители',              price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Смесители для ванны, душа, кухни. Однорычажные и двухвентильные.' },
  { id: 190, category: 'plumbing', title: 'Душевые кабины и поддоны', price: 'Уточнить', basePrice: null, unit: 'шт', description: 'Душевые кабины и поддоны различных размеров. Монтаж включён.' },

  // ─── УСЛУГИ ───────────────────────────────────────────────────
  { id: 154, category: 'services', icon: '🔩', title: 'Установка забора под ключ',           price: 'Уточнить', basePrice: null, unit: 'м.п.', description: 'Монтаж забора любого типа под ключ. Столбы в бетон.' },
  { id: 155, category: 'services', icon: '💧', title: 'Монтаж септика под ключ',             price: 'Уточнить', basePrice: null, unit: 'объект', description: 'Земляные работы, монтаж и засыпка септика под ключ.' },
  { id: 156, category: 'services', icon: '⚓', title: 'Монтаж свайного поля',               price: 'Уточнить', basePrice: null, unit: 'свая', description: 'Завинчивание или забивка свай. Собственная техника.' },
  { id: 157, category: 'services', icon: '🏠', title: 'Малоэтажное строительство',           price: 'Уточнить', basePrice: null, unit: 'м²', description: 'Строительство жилых домов и техзданий под ключ.' },
  { id: 158, category: 'services', icon: '🚜', title: 'Экскаватор с оператором',             price: 'Уточнить', basePrice: null, unit: 'час', description: 'Земляные работы. Собственная техника без аренды.' },
  { id: 159, category: 'services', icon: '🚛', title: 'Самосвал',                            price: 'Уточнить', basePrice: null, unit: 'рейс', description: 'Вывоз грунта, доставка материалов. Собственный парк.' },
]

