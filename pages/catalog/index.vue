<template>
  <div>


    <main class="catalog">
      <!-- Шапка -->
      <div class="catalog__hero">
        <div class="catalog__hero-inner">
          <a href="/" class="catalog__hero-logo">
            <DsrLogo size="md" />
          </a>
          <nav class="catalog__breadcrumb">
            <a href="/">Главная</a>
            <span>/</span>
            <template v-if="activeCategory === 'all' && !searchQuery">
              <span>Каталог</span>
            </template>
            <template v-else-if="searchQuery">
              <a href="/catalog" @click.prevent="activeCategory = 'all'; searchQuery = ''">Каталог</a>
              <span>/</span>
              <span>Поиск: {{ searchQuery }}</span>
            </template>
            <template v-else>
              <a href="/catalog" @click.prevent="activeCategory = 'all'; searchQuery = ''">Каталог</a>
              <span>/</span>
              <template v-if="activeSub">
                <a href="#" @click.prevent="activeSub = null">{{ currentCategory?.label }}</a>
                <span>/</span>
                <span>{{ currentSubs.find(s => s.id === activeSub)?.label }}</span>
              </template>
              <template v-else>
                <span>{{ currentCategory?.label }}</span>
              </template>
            </template>
          </nav>
          <h1 class="catalog__title">Каталог услуг и товаров</h1>
          <p class="catalog__price-note">{{ PRICE_DISCLAIMER }}</p>

          <!-- Поиск + фильтр цены -->
          <div class="catalog__hero-controls">
            <div class="catalog__search-wrap" v-click-outside="closeDropdown">
              <div class="catalog__search">
                <svg class="catalog__search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="catalog__search-input"
                  placeholder=""
                  autocomplete="off"
                  aria-label="Поиск по каталогу"
                  role="combobox"
                  aria-autocomplete="list"
                  :aria-expanded="dropVisible && suggestions.length > 0"
                  @focus="searchFocused = true; dropVisible = true"
                  @blur="searchFocused = false"
                  @keydown="onSearchKeydown"
                />
                <!-- Typewriter placeholder -->
                <span v-if="!searchQuery && !searchFocused" class="catalog__tw" aria-hidden="true">
                  {{ twText }}<span class="catalog__tw-cursor">|</span>
                </span>
                <button v-if="searchQuery" class="catalog__search-clear" aria-label="Очистить поиск" @click="searchQuery = ''; dropVisible = false">✕</button>
              </div>

              <!-- Выпадающие подсказки -->
              <transition name="suggestions">
                <div v-if="dropVisible && suggestions.length > 0" class="catalog__suggestions">
                  <div
                    v-for="(item, idx) in suggestions"
                    :key="item.id"
                    class="catalog__suggestion-item"
                    :class="{ active: idx === activeSuggestion }"
                    @click="selectSuggestion(item)"
                    @mouseenter="activeSuggestion = idx"
                  >
                    <svg class="catalog__suggestion-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
                    <span class="catalog__suggestion-info">
                      <span class="catalog__suggestion-title" v-html="highlight(item.title)"></span>
                      <span class="catalog__suggestion-cat">{{ categoryMap[item.category] }}</span>
                    </span>
                    <span class="catalog__suggestion-price">{{ item.price }}</span>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Фильтр по цене — слайдер (только когда выбрана категория или идёт поиск) -->
            <div v-if="activeCategory !== 'all' || searchQuery" class="catalog__hero-price">
              <div class="catalog__price-header">
                <span class="catalog__hero-price-label">Цена, ₽</span>
                <span class="catalog__price-display">
                  {{ sliderMin > priceAbsMin ? formatPrice(sliderMin) : 'от 0' }}
                  &nbsp;—&nbsp;
                  {{ sliderMax < priceAbsMax ? formatPrice(sliderMax) : 'любая' }}
                </span>
                <button v-if="priceFilterActive" class="catalog__hero-price-reset" @click="resetPrice">Сбросить</button>
              </div>
              <div class="catalog__range-wrap">
                <div class="catalog__range-track">
                  <div class="catalog__range-fill" :style="rangeFillStyle"></div>
                </div>
                <input
                  v-model.number="sliderMin"
                  type="range"
                  class="catalog__range catalog__range--min"
                  :min="priceAbsMin"
                  :max="priceAbsMax"
                  :step="rangeStep"
                  @input="onSliderMin"
                />
                <input
                  v-model.number="sliderMax"
                  type="range"
                  class="catalog__range catalog__range--max"
                  :min="priceAbsMin"
                  :max="priceAbsMax"
                  :step="rangeStep"
                  @input="onSliderMax"
                />
              </div>
              <div class="catalog__hero-price-presets">
                <button class="catalog__hero-price-preset" :class="{ active: priceMin === null && priceMax === 5000 }"    @click="setPricePreset(null, 5000)">до 5 000</button>
                <button class="catalog__hero-price-preset" :class="{ active: priceMin === 5000 && priceMax === 50000 }"   @click="setPricePreset(5000, 50000)">5–50 тыс.</button>
                <button class="catalog__hero-price-preset" :class="{ active: priceMin === 50000 && priceMax === 200000 }" @click="setPricePreset(50000, 200000)">50–200 тыс.</button>
                <button class="catalog__hero-price-preset" :class="{ active: priceMin === 200000 && priceMax === null }"  @click="setPricePreset(200000, null)">от 200 тыс.</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Мобильная панель: липкий поиск + выпадающий список всех категорий -->
      <div class="catalog__mobilebar">
        <div class="catalog__search-wrap catalog__search-wrap--mobile" v-click-outside="closeDropdown">
          <div class="catalog__search">
            <svg class="catalog__search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="catalog__search-input"
              placeholder=""
              autocomplete="off"
              aria-label="Поиск по каталогу"
              role="combobox"
              aria-autocomplete="list"
              :aria-expanded="dropVisible && suggestions.length > 0"
              @focus="searchFocused = true; dropVisible = true"
              @blur="searchFocused = false"
              @keydown="onSearchKeydown"
            />
            <!-- Typewriter placeholder (как на ПК) -->
            <span v-if="!searchQuery && !searchFocused" class="catalog__tw" aria-hidden="true">
              {{ twText }}<span class="catalog__tw-cursor">|</span>
            </span>
            <button v-if="searchQuery" class="catalog__search-clear" aria-label="Очистить поиск" @click="searchQuery = ''; dropVisible = false">✕</button>
          </div>
          <transition name="suggestions">
            <div v-if="dropVisible && suggestions.length > 0" class="catalog__suggestions">
              <div
                v-for="(item, idx) in suggestions"
                :key="item.id"
                class="catalog__suggestion-item"
                :class="{ active: idx === activeSuggestion }"
                @click="selectSuggestion(item)"
                @mouseenter="activeSuggestion = idx"
              >
                <svg class="catalog__suggestion-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
                <span class="catalog__suggestion-info">
                  <span class="catalog__suggestion-title" v-html="highlight(item.title)"></span>
                  <span class="catalog__suggestion-cat">{{ categoryMap[item.category] }}</span>
                </span>
                <span class="catalog__suggestion-price">{{ item.price }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- Выпадающий список всех категорий -->
        <div class="catalog__catdrop" v-click-outside="closeCatDropdown">
          <button class="catalog__catdrop-btn" :class="{ open: catDropdownOpen }" :aria-expanded="catDropdownOpen" @click="catDropdownOpen = !catDropdownOpen">
            <svg class="catalog__catdrop-ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <span class="catalog__catdrop-current">{{ currentCategory?.label || 'Все категории' }}</span>
            <svg class="catalog__catdrop-arrow" :class="{ rotated: catDropdownOpen }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/></svg>
          </button>
          <transition name="suggestions">
            <ul v-if="catDropdownOpen" class="catalog__catdrop-list">
              <li
                v-for="cat in categories"
                :key="cat.id"
                class="catalog__catdrop-item"
                :class="{ active: activeCategory === cat.id }"
                @click="selectCategoryMobile(cat.id)"
              >
                <span class="catalog__catdrop-label">{{ cat.label }}</span>
                <span v-if="countByCategory(cat.id)" class="catalog__catdrop-count">{{ countByCategory(cat.id) }}</span>
              </li>
            </ul>
          </transition>
        </div>
      </div>

      <!-- Основная часть: боковая панель + контент -->
      <div class="catalog__layout">

        <!-- Боковая панель -->
        <aside
          class="catalog__sidebar"
          @mouseleave="flyoutScheduleClose"
        >
          <div class="catalog__sidebar-inner">
          <div class="catalog__sidebar-title">Товары и услуги</div>
          <ul class="catalog__sidebar-list">
            <li
              v-for="cat in categories"
              :key="cat.id"
              class="catalog__sidebar-item"
              :class="{ active: activeCategory === cat.id, hovered: hoveredCat === cat.id }"
              role="button"
              tabindex="0"
              :aria-pressed="activeCategory === cat.id"
              @click="selectCategory(cat.id)"
              @keydown.enter.space.prevent="selectCategory(cat.id)"
              @mouseenter="flyoutOpen(subcategories[cat.id]?.length ? cat.id : null, $event)"
            >
              <span class="catalog__sidebar-label">{{ cat.label }}</span>
              <span v-if="countByCategory(cat.id)" class="catalog__sidebar-count">
                {{ countByCategory(cat.id) }}
              </span>
              <svg v-if="subcategories[cat.id]?.length" class="catalog__sidebar-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l6 6-6 6"/>
              </svg>
            </li>
          </ul>
          </div><!-- /catalog__sidebar-inner -->

          <!-- ═══ Мегаменю flyout ═══ -->
          <transition name="flyout">
            <div
              v-if="hoveredCat && subcategories[hoveredCat]?.length"
              class="catalog__flyout"
              :style="{ top: flyoutTop + 'px' }"
              @mouseenter="flyoutCancelClose"
              @mouseleave="flyoutScheduleClose"
            >
              <div class="catalog__flyout-header">
                <span class="catalog__flyout-title">{{ categories.find(c=>c.id===hoveredCat)?.label }}</span>
                <span class="catalog__flyout-total">{{ countByCategory(hoveredCat) }} позиций</span>
              </div>
              <div class="catalog__flyout-grid">
                <button
                  v-for="sub in subcategories[hoveredCat]"
                  :key="sub.id"
                  class="catalog__flyout-sub"
                  @click="selectCategory(hoveredCat); activeSub = sub.id; hoveredCat = null"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6l6 6-6 6"/>
                  </svg>
                  <span>{{ sub.label }}</span>
                </button>
              </div>
              <button class="catalog__flyout-all" @click="selectCategory(hoveredCat); hoveredCat = null">
                Все товары раздела →
              </button>
            </div>
          </transition>
        </aside>

        <!-- Основной контент -->
        <div class="catalog__main">

          <!-- ═══ СЕТКА КАТЕГОРИЙ (стартовый экран) ═══ -->
          <div v-if="activeCategory === 'all' && !searchQuery.trim()" class="catalog__cats-section">
            <h2 class="catalog__cats-title">Каталог категорий</h2>
            <div class="catalog__cats">
              <div
                v-for="(cat, idx) in categoriesForGrid"
                :key="cat.id"
                class="catalog__cat-card"
                :class="{ 'catalog__cat-card--photo': catImage(cat) }"
                :style="{ '--i': idx }"
                role="button"
                tabindex="0"
                @click="selectCategory(cat.id)"
                @keydown.enter.space.prevent="selectCategory(cat.id)"
              >
                <div class="catalog__cat-card-visual">
                  <span v-if="catImage(cat)" class="catalog__cat-card-shine" aria-hidden="true"></span>
                  <img v-if="catImage(cat)" :src="catImage(cat)" :alt="cat.label" class="catalog__cat-card-photo" loading="lazy" />
                  <div v-else class="catalog__cat-card-icon">
                    <svg v-if="catIconPaths[cat.id]" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="catIconPaths[cat.id]"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/>
                    </svg>
                  </div>
                </div>
                <div class="catalog__cat-card-footer">
                  <span class="catalog__cat-card-label">{{ cat.label }}</span>
                  <span class="catalog__cat-card-count">{{ countByCategory(cat.id) }}</span>
                  <svg class="catalog__cat-card-arrow" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-6-6 6 6-6 6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ СПИСОК ТОВАРОВ (категория выбрана или идёт поиск) ═══ -->
          <template v-else>

          <!-- Заголовок раздела + панель управления (sticky) -->
          <div class="catalog__section-header">
            <div class="catalog__section-left">
              <h2 class="catalog__section-title">
                {{ searchQuery ? `«${searchQuery}»` : (activeCategory === 'all' ? 'Все товары' : currentCategory?.label) }}
              </h2>
              <span class="catalog__section-badge">{{ filteredItems.length }}</span>
            </div>
            <div class="catalog__section-right">
              <!-- Пиллы сортировки -->
              <div class="catalog__sort-pills">
                <button
                  v-for="s in sortOptions"
                  :key="s.value"
                  class="catalog__sort-pill"
                  :class="{ active: sortBy === s.value }"
                  @click="sortBy = s.value"
                >{{ s.label }}</button>
              </div>
              <!-- Переключатель вид -->
              <div class="catalog__view-toggle">
                <button class="catalog__view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="Плитка" aria-label="Вид плиткой">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button class="catalog__view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="Список" aria-label="Вид списком">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                </button>
                <button class="catalog__view-btn" :class="{ active: viewMode === 'compact' }" @click="viewMode = 'compact'" title="Компактно" aria-label="Компактный вид">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="10" y="2" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="18" y="2" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="2" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="10" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="18" y="10" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="2" y="18" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="10" y="18" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                    <rect x="18" y="18" width="4" height="4" rx="0.5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <button v-if="activeCategory !== 'all' || searchQuery" class="catalog__section-reset" @click="activeCategory = 'all'; searchQuery = ''">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Все
              </button>
            </div>
          </div>

          <!-- Подкатегории -->
          <div v-if="currentSubs.length > 0 && !searchQuery" class="catalog__subs">
            <button
              class="catalog__sub-chip"
              :class="{ active: activeSub === null }"
              @click="activeSub = null"
            >Все</button>
            <button
              v-for="sub in currentSubs"
              :key="sub.id"
              class="catalog__sub-chip"
              :class="{ active: activeSub === sub.id }"
              @click="activeSub = sub.id"
            >{{ sub.label }}</button>
          </div>

          <!-- Инфо-панель: цвета и размеры 3D панелей -->
          <transition name="fade">
            <div v-if="activeCategory === 'fence3d' && (activeSub === 'panels' || activeSub === null) && !searchQuery" class="panels-info">
              <div class="panels-info__header" @click="panelsInfoOpen = !panelsInfoOpen">
                <span class="panels-info__title">Цвета и размеры панелей</span>
                <svg class="panels-info__arrow" :class="{ rotated: panelsInfoOpen }" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              <div v-if="panelsInfoOpen" class="panels-info__body">
                <div class="panels-info__section">
                  <div class="panels-info__section-title">Доступные цвета (RAL)</div>
                  <div class="panels-info__colors">
                    <button
                      v-for="c in panelColors" :key="c.ral"
                      class="panels-info__color"
                      :class="{ selected: selectedPanelColor?.ral === c.ral }"
                      :title="c.name + ' RAL ' + c.ral"
                      @click="selectPanelColor(c)">
                      <span class="panels-info__color-dot" :style="{ background: c.hex }"></span>
                      <span class="panels-info__color-name">{{ c.name }}</span>
                      <span class="panels-info__color-ral">{{ c.ral }}</span>
                    </button>
                  </div>
                </div>
                <div class="panels-info__sizes">
                  <div class="panels-info__section">
                    <div class="panels-info__section-title">Толщина 4 мм</div>
                    <div class="panels-info__size-list">
                      <button v-for="s in sizes4mm" :key="s"
                        class="panels-info__size"
                        :class="{ selected: selectedPanelSize === s + '|4mm' }"
                        @click="selectPanelSize(s, '4mm')">{{ s }}</button>
                    </div>
                  </div>
                  <div class="panels-info__section">
                    <div class="panels-info__section-title">Толщина 5 мм</div>
                    <div class="panels-info__size-list">
                      <button v-for="s in sizes5mm" :key="s"
                        class="panels-info__size"
                        :class="{ selected: selectedPanelSize === s + '|5mm' }"
                        @click="selectPanelSize(s, '5mm')">{{ s }}</button>
                    </div>
                  </div>
                  <div class="panels-info__section">
                    <div class="panels-info__section-title">Столбы с фланцем</div>
                    <div class="panels-info__size-list">
                      <button v-for="s in sizesPost" :key="s"
                        class="panels-info__size"
                        :class="{ selected: selectedPanelSize === s + '|posts' }"
                        @click="selectPanelSize(s, 'posts')">{{ s }}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Активный фильтр панели -->
          <transition name="fade">
            <div v-if="selectedPanelSize || selectedPanelColor" class="panel-filter-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 10h10M10 16h4"/>
              </svg>
              <span v-if="selectedPanelSize">{{ selectedPanelSize.split('|')[0] }}
                <template v-if="selectedPanelSize.endsWith('|4mm')">&nbsp;· 4 мм</template>
                <template v-else-if="selectedPanelSize.endsWith('|5mm')">&nbsp;· 5 мм</template>
                <template v-else>&nbsp;· Столб</template>
              </span>
              <span v-if="selectedPanelColor">
                <span class="panel-filter-badge__dot" :style="{ background: selectedPanelColor.hex }"></span>
                {{ selectedPanelColor.name }} {{ selectedPanelColor.ral }}
              </span>
              <button class="panel-filter-badge__clear" aria-label="Сбросить фильтр панелей" @click="clearPanelFilter">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2.5" d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </transition>

          <!-- Пусто -->
          <div v-if="filteredItems.length === 0" class="catalog__empty">
            <svg class="catalog__empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M21 21l-4.35-4.35"/></svg>
            <p>По запросу <strong>«{{ searchQuery }}»</strong> ничего не найдено</p>
            <button class="catalog__empty-btn" @click="searchQuery = ''; activeCategory = 'all'">Сбросить фильтры</button>
          </div>

          <!-- Счётчик позиций -->
          <div v-if="filteredItems.length > 0" class="catalog__count">
            Показано {{ paginatedItems.length }} из {{ filteredItems.length }}
          </div>

          <!-- Skeleton пока грузятся доп. позиции -->
          <div v-if="catalogPending && filteredItems.length === 0" class="catalog__list">
            <div v-for="n in 12" :key="n" class="catalog-skeleton">
              <div class="catalog-skeleton__img"></div>
              <div class="catalog-skeleton__body">
                <div class="catalog-skeleton__line catalog-skeleton__line--sm"></div>
                <div class="catalog-skeleton__line catalog-skeleton__line--lg"></div>
                <div class="catalog-skeleton__line catalog-skeleton__line--md"></div>
                <div class="catalog-skeleton__footer"></div>
              </div>
            </div>
          </div>

          <!-- Список услуг -->
          <TransitionGroup
            v-if="filteredItems.length > 0"
            name="ci"
            tag="div"
            :class="['catalog__list', { 'catalog__list--grid': viewMode === 'grid' || viewMode === 'compact', 'catalog__list--compact': viewMode === 'compact' }]"
          >
            <div
              v-for="(item, i) in paginatedItems"
              :key="item.id"
              class="catalog-item"
              :class="{ 'catalog-item--grid': viewMode === 'grid' || viewMode === 'compact', 'catalog-item--compact': viewMode === 'compact' }"
              :style="{ '--stagger': `${Math.min(i % 24, 10) * 45}ms` }"
            >
              <NuxtLink :to="`/catalog/${item.id}`" class="catalog-item__link" :aria-label="item.title" />
              <div class="catalog-item__img">
                <template v-if="item.photos && item.photos.length > 1">
                  <img :src="item.photos[getPhotoIdx(item.id)]" :alt="item.title" loading="lazy" decoding="async" />
                  <button class="ci-carousel__prev" aria-label="Предыдущее фото" @click.stop="prevPhoto(item.id, item.photos.length)">&#8249;</button>
                  <button class="ci-carousel__next" aria-label="Следующее фото" @click.stop="nextPhoto(item.id, item.photos.length)">&#8250;</button>
                  <div class="ci-carousel__dots">
                    <span v-for="(_, j) in item.photos" :key="j" class="ci-carousel__dot" :class="{ active: j === getPhotoIdx(item.id) }" @click.stop="setPhotoIdx(item.id, j)"></span>
                  </div>
                </template>
                <img v-else-if="productPhoto(item)"
                  :src="productPhoto(item)"
                  :alt="item.title"
                  loading="lazy"
                  decoding="async"
                  @error="onPhotoError($event, item)"
                />
                <div v-else class="catalog-item__placeholder">
                  <div class="catalog-item__placeholder-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" class="catalog-item__placeholder-icon"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></svg>
                    <span class="catalog-item__placeholder-text">Фото скоро</span>
                  </div>
                </div>
                <!-- Бейдж "В списке" -->
                <div v-if="hasItem(item.id)" class="catalog-item__in-list-badge">В списке</div>
              </div>
              <div class="catalog-item__content">
                <span class="catalog-item__category">{{ categoryMap[item.category] }}</span>
                <h3 class="catalog-item__title">{{ item.title }}</h3>
                <p class="catalog-item__desc">{{ item.description }}</p>
                <div class="catalog-item__footer">
                  <div class="catalog-item__price-block">
                    <span v-if="priceFrom(item)" class="catalog-item__price">{{ priceFrom(item) }}</span>
                    <span v-if="isWholesale(item)" class="catalog-item__whole" title="Оптовая цена — за объём от 50 шт / 50 м. При меньшем количестве уточняйте у менеджера.">опт · от 50 шт/м</span>
                    <span v-else class="catalog-item__price catalog-item__price--ask">Уточнить актуальную цену</span>
                  </div>
                  <button class="catalog-item__btn" @click.stop="openOrder(item)">Заявка</button>
                  <button class="catalog-item__add" :class="{ added: hasItem(item.id) }" :aria-label="hasItem(item.id) ? 'Уже в списке запросов' : 'Добавить в список запросов'" @click.stop="addItem(item)">
                    <svg v-if="!hasItem(item.id)" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2.5" d="M12 5v14M5 12h14"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span class="catalog-item__add-tip">{{ hasItem(item.id) ? 'В списке' : 'В список' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Кнопка "Показать ещё" -->
          <div v-if="paginatedItems.length < filteredItems.length" class="catalog__load-more">
            <button class="catalog__load-more-btn" @click="visibleCount += 24">
              Показать ещё {{ Math.min(24, filteredItems.length - paginatedItems.length) }}
              <span class="catalog__load-more-total">из {{ filteredItems.length - paginatedItems.length }} оставшихся</span>
            </button>
          </div>

          </template><!-- /v-else: список товаров -->
        </div>
      </div>
    </main>

    <!-- Модалка заявки -->
    <transition name="modal">
      <div v-if="orderItem" class="modal-overlay" @click.self="orderItem = null">
        <div class="modal">
          <button class="modal__close" aria-label="Закрыть" @click="orderItem = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h2 class="modal__title">{{ orderItem.title }}</h2>
          <p class="modal__price" :class="{ 'modal__price--ask': !priceFrom(orderItem) }">{{ priceFrom(orderItem) || 'Уточнить актуальную цену' }}</p>
          <p v-if="isWholesale(orderItem)" class="modal__whole">⚠ {{ WHOLESALE_NOTE }}</p>

          <form class="modal__form" @submit.prevent="submitOrder">
            <input v-model="orderForm.company" type="text" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
            <input v-model="orderForm.name" type="text" placeholder="Ваше имя *" class="modal__input" maxlength="100" aria-label="Ваше имя" />
            <input :value="orderForm.phone" @input="orderForm.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="modal__input" maxlength="18" aria-label="Телефон" />

            <!-- Чекбокс установки — только для монтируемых категорий -->
            <label v-if="installableCategories.includes(orderItem.category)" class="modal__install">
              <input v-model="orderForm.needInstall" type="checkbox" class="modal__install-checkbox" />
              <span class="modal__install-text">
                <span class="modal__install-label">Нужна установка под ключ</span>
                <span class="modal__install-hint">Наши специалисты выполнят монтаж</span>
              </span>
            </label>

            <textarea v-model="orderForm.message" placeholder="Комментарий — размеры, объём, адрес объекта..." class="modal__input modal__textarea" rows="3" maxlength="500" aria-label="Комментарий"></textarea>
            <label class="modal__consent">
              <input type="checkbox" v-model="orderForm.consent" class="modal__consent-check" />
              <span>Я согласен(а) на <a href="/privacy" target="_blank" class="modal__consent-link">обработку персональных данных</a> в соответствии с ФЗ-152</span>
            </label>
            <button type="submit" class="modal__submit" :disabled="orderLoading || !orderForm.consent">
              {{ orderLoading ? 'Отправка...' : 'Отправить заявку' }}
            </button>
            <p v-if="orderSuccess" class="modal__success">Заявка отправлена! Мы свяжемся с вами.</p>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
// Каталог не пересобирается при возврате из карточки товара (сохраняет товары и позицию).
definePageMeta({ keepalive: true })
import { ref, computed, reactive, watch, nextTick, onMounted } from 'vue'
import { phoneMask } from '~/composables/usePhoneMask.js'
import { categories as coreCategories, items as staticItems, subcategories as coreSubcategories } from '~/data/catalog.js'
import { vkCategories, vkSubcategories } from '~/data/catalog-vostokkabel.js'
import { sigCategories } from '~/data/catalog-sig.js'
import { pdCategories } from '~/data/catalog-plastdv.js'

// Сайдбар показывает категории ВСЕХ источников (ядро + партнёры). Иначе ~4000
// товаров электрики/Сигнала видны только в «Все»/поиске, но не пролистать по разделам.
const categories = (() => {
  const seen = new Set(), out = []
  for (const c of [...coreCategories, ...vkCategories, ...sigCategories, ...pdCategories]) {
    if (c && !seen.has(c.id)) { seen.add(c.id); out.push(c) }
  }
  return out
})()
const subcategories = { ...coreSubcategories, ...vkSubcategories }
import { priceFrom, PRICE_DISCLAIMER, isWholesale, WHOLESALE_NOTE } from '~/composables/usePrice.js'
import { parseQuery, scoreItem, searchItems } from '~/composables/useCatalogSearch.js'

const catIconPaths = {
  fence3d:   'M3 21V9m3-4v16M9 21V5l3-4v20M15 21V5l3-4v16M21 21V9M3 13h18',
  mesh:      'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18',
  piles:     'M7 22V4M12 22V2M17 22V4M2 22h20M5 8l7-4 7 4',
  septic:    'M5 9a7 7 0 0114 0v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9zm7-7v7m-3 11v2m6-2v2',
  welding:   'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  cellar:    'M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5zM9 21V12h6v9',
  tanks:     'M8 3h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2zM6 8h12M6 16h12M12 3v18',
  boiler:    'M12 22a6 6 0 006-6c0-5-3-8-6-14-3 6-6 9-6 14a6 6 0 006 6zm0 0v-8',
  pipe:      'M3 12h18M3 6h2a2 2 0 010 4H3M21 18h-2a2 2 0 010-4h2M7 6v12M17 6v12',
  industry:  'M12 15a3 3 0 100-6 3 3 0 000 6zm0-13v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  hardware:  'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  docke:     'M12 2a3 3 0 100 6 3 3 0 000-6zm0 6v12M6 16a6 6 0 0012 0M3 16h3m12 0h3',
  garden:    'M12 22V12M12 12C11 7 7 4 3 5c4 1 7 4 9 7M12 12c1-5 5-8 9-7-4 1-7 4-9 7',
  services:  'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm7 1l2 2 4-4',
  cable:     'M18 7l-1-4H7L6 7M12 7v8M5 10h14M9 18l-2 3M15 18l2 3M8 15h8',
  stainless: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  metalroll: 'M12 12m-9 0a9 9 0 1018 0 9 9 0 01-18 0M12 3v18M3 12h18',
  hatches:   'M3 3h18v18H3zM3 3l18 18M21 3L3 21',
  plastic:   'M8 2h8l2 8H6L8 2zm-4 8h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V10z',
  chimney:   'M9 22V6l-4-4h14L15 6v16M6 22h12M12 6v16M8 10h8M8 15h8',
  proflist:  'M3 5h18M3 10h18M3 15h18M3 20h18M8 2v3M16 2v3',
  kesson:    'M12 2a9 9 0 100 18A9 9 0 0012 2zm0 0v18M3 12h18M7 6l10 12M17 6L7 18',
}

const viewMode = ref('grid')
const sortOptions = [
  { value: 'default',   label: 'По умолч.' },
  { value: 'name_asc',  label: 'А–Я' },
  { value: 'name_desc', label: 'Я–А' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc',label: 'Цена ↓' },
]

const { addItem, hasItem } = useCart()

const items = reactive([...staticItems])
const catalogPending = ref(true)

onMounted(() => {
  const loadJson = async (url) => {
    try {
      const r = await fetch(url)
      return r.ok ? await r.json() : []
    } catch { return [] }
  }
  const yield_ = () => new Promise(r => setTimeout(r, 0))
  // Один источник → добавляется в общий список ПОРЦИЯМИ по 300 с отдачей кадра
  // браузеру (markRaw снимает глубокую реактивность — кратно быстрее рендер).
  const loadSource = async (url) => {
    const arr = await loadJson(url)
    for (let i = 0; i < arr.length; i += 300) {
      items.splice(items.length, 0, ...arr.slice(i, i + 300).map(markRaw))
      await yield_()
    }
  }
  // Ленивая двухволновая загрузка (было: все 6 файлов ~5 МБ разом на mount):
  // Волна 1 — ходовое ядро + ПримСтройХаб (~1.4 МБ): быстрый первый рендер.
  const primary = ['/data/catalog-items.json', '/data/catalog-psh.json']
  // Волна 2 — тяжёлые партнёрские (сантехника/электрика/сигнал/ПЭ, ~3.8 МБ):
  // в фоне после первой отрисовки, чтобы не конкурировать за поток в критический момент.
  const secondary = ['/data/catalog-cs.json', '/data/catalog-vk.json', '/data/catalog-sig.json', '/data/catalog-pd.json']
  // Если открыли ссылку на конкретную партнёрскую категорию — её файл в первую волну,
  // чтобы товары не «висели» пустыми до фоновой догрузки.
  const cat = String(route.query.cat || '')
  let deepUrl = ''
  if (cat.startsWith('vk_') || cat === 'cable') deepUrl = '/data/catalog-vk.json'
  else if (cat.startsWith('sig')) deepUrl = '/data/catalog-sig.json'
  else if (cat.startsWith('pd_')) deepUrl = '/data/catalog-pd.json'
  else if (['plumbing', 'plastic', 'pipe', 'boiler', 'hardware', 'hatches'].includes(cat)) deepUrl = '/data/catalog-cs.json'
  if (deepUrl && secondary.includes(deepUrl)) { primary.push(deepUrl); secondary.splice(secondary.indexOf(deepUrl), 1) }

  Promise.all(primary.map(loadSource)).then(() => {
    catalogPending.value = false
    if (!secondary.length) return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    idle(() => { Promise.all(secondary.map(loadSource)) })
  })
})

useHead({ title: 'Каталог: заборы 3D, сваи, септики, стройматериалы — ДСР Владивосток' })
useSeoMeta({
  description: 'Каталог ДСР Владивосток: заборы 3D и ворота, винтовые сваи, септики, кессоны, сетки, стройматериалы и оборудование. Цены, снабжение, поставка и монтаж по Приморскому краю. Более 2300 позиций.',
  ogTitle: 'Каталог товаров и услуг — ДСР Владивосток',
  ogDescription: 'Заборы 3D, сваи, септики, стройматериалы с ценами. Поставка и монтаж по Приморскому краю.',
  ogImage: 'https://dsr-dv.ru/og-dsr.jpg',
  ogUrl: 'https://dsr-dv.ru/catalog',
})

const route = useRoute()
const router = useRouter()
const activeCategory = ref(route.query.cat ? String(route.query.cat) : 'all')
const searchQuery = ref(route.query.search ? String(route.query.search) : '')
// Дебаунс: filteredItems пересчитывается через 220мс после последнего символа
const _debouncedSearch = ref(searchQuery.value)
let _searchDebTimer = null
watch(searchQuery, val => {
  clearTimeout(_searchDebTimer)
  _searchDebTimer = setTimeout(() => { _debouncedSearch.value = val }, 220)
}, { immediate: true })
const dropVisible = ref(false)
const activeSub = ref(null)
const searchFocused = ref(false)

// ── Typewriter в поле поиска ──────────────────────────────────────────────
const TW_PHRASES = [
  'Сварочные работы', '3D заборы и ворота', 'Септики и очистные',
  'Котлы отопительные', 'Погреба и кессоны', 'Нержавеющие трубы',
  'Ёмкости пластиковые', 'Дымоходы', 'Профлист', 'Кованые элементы',
  'Садовое оборудование', 'Винтовые сваи', 'Фасад DOCKE',
  'Опалубочные системы', 'Малая механизация',
]
const twText = ref('')
let _twIdx = 0, _twTimer = null
function _twType() {
  const phrase = TW_PHRASES[_twIdx]
  if (twText.value.length < phrase.length) {
    twText.value = phrase.slice(0, twText.value.length + 1)
    _twTimer = setTimeout(_twType, 65)
  } else {
    _twTimer = setTimeout(_twErase, 1800)
  }
}
function _twErase() {
  if (twText.value.length > 0) {
    twText.value = twText.value.slice(0, -1)
    _twTimer = setTimeout(_twErase, 30)
  } else {
    _twIdx = (_twIdx + 1) % TW_PHRASES.length
    _twTimer = setTimeout(_twType, 350)
  }
}
onMounted(() => { _twTimer = setTimeout(_twType, 900) })
onUnmounted(() => clearTimeout(_twTimer))
const priceMin = ref(null)
const priceMax = ref(null)
const orderItem = ref(null)
const orderLoading = ref(false)
const orderSuccess = ref(false)
const orderForm = reactive({ name: '', phone: '', message: '', needInstall: false, company: '', consent: false })

const photoIndexes = reactive({})
const failedPrimaryPhotos = reactive(new Set())
const failedFallbackPhotos = reactive(new Set())

function productPhoto(item) {
  if (item.noPhoto) return null
  // Ядро (id < 1000): приоритет — пофайловое фото /catalog/products/{id}.jpg (правильное
  // на каждый товар), откат на item.photo (общий плейсхолдер), потом «Фото скоро».
  if (item.id < 1000) {
    if (!failedPrimaryPhotos.has(item.id)) return `/catalog/products/${item.id}.jpg`
    const p = item.photo || (item.photos && item.photos[0])
    return p && !failedFallbackPhotos.has(item.id) ? p : null
  }
  // Партнёрские (id ≥ 1000): только явное item.photo, без угадаек по id (иначе мелькает 404).
  const p = item.photo || (item.photos && item.photos[0])
  return p && !failedPrimaryPhotos.has(item.id) ? p : null
}

function onPhotoError(e, item) {
  if (item.id < 1000 && !failedPrimaryPhotos.has(item.id)) failedPrimaryPhotos.add(item.id)
  else failedFallbackPhotos.add(item.id)
}

const panelsInfoOpen = ref(true)
const selectedPanelSize  = ref(null)  // "1530×2510 мм|4mm" или null
const selectedPanelColor = ref(null)  // { name, ral, hex } или null

function selectPanelSize(sizeStr, group) {
  const key = sizeStr + '|' + group
  selectedPanelSize.value  = selectedPanelSize.value === key ? null : key
  selectedPanelColor.value = null
  if (selectedPanelSize.value) nextTick(scrollToList)
}
function selectPanelColor(color) {
  selectedPanelColor.value = selectedPanelColor.value?.ral === color.ral ? null : color
  selectedPanelSize.value  = null
  if (selectedPanelColor.value) nextTick(scrollToList)
}
function clearPanelFilter() {
  selectedPanelSize.value  = null
  selectedPanelColor.value = null
}
function scrollToList() {
  document.querySelector('.catalog__main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const panelColors = [
  { name: 'Бежевый',      ral: 'RAL 1014', hex: '#D2B48C' },
  { name: 'Желтый',       ral: 'RAL 1021', hex: '#F5B800' },
  { name: 'Вишневый',     ral: 'RAL 3005', hex: '#6B2A2A' },
  { name: 'Красный',      ral: 'RAL 3020', hex: '#CC1010' },
  { name: 'Синий',        ral: 'RAL 5005', hex: '#1B4F8A' },
  { name: 'Темно-серый',  ral: 'RAL 7016', hex: '#2E3436' },
  { name: 'Светло-серый', ral: 'RAL 7040', hex: '#9EA0A1' },
  { name: 'Коричневый',   ral: 'RAL 8017', hex: '#6B4226' },
  { name: 'Черный',       ral: 'RAL 9005', hex: '#1A1A1A' },
  { name: 'Белый',        ral: 'RAL 9016', hex: '#F5F4F0' },
]
const sizes4mm = [
  '1530×2510 мм', '1730×2510 мм', '1830×2510 мм',
  '2030×2510 мм', '2430×2510 мм', '2530×2510 мм',
  '1530×3010 мм', '2030×3010 мм', '2530×3010 мм',
]
const sizes5mm = [
  '1530×2510 мм', '1730×2510 мм', '1830×2510 мм',
  '2030×2510 мм', '2030×3010 мм', '2530×3010 мм',
]
const sizesPost = [
  '1500×60×60×1,5 мм', '2000×60×60×1,5 мм', '3000×60×60×1,5 мм',
]

function getPhotoIdx(id) { return photoIndexes[id] ?? 0 }
function nextPhoto(id, total) { photoIndexes[id] = ((photoIndexes[id] ?? 0) + 1) % total }
function prevPhoto(id, total) { photoIndexes[id] = ((photoIndexes[id] ?? 0) - 1 + total) % total }
function setPhotoIdx(id, i) { photoIndexes[id] = i }

const installableCategories = ['fence3d', 'mesh', 'piles', 'septic', 'kesson', 'cellar', 'tanks', 'boiler', 'chimney', 'proflist']

const currentCategory = computed(() =>
  categories.find(c => c.id === activeCategory.value)
)

const suggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  return searchItems(items, searchQuery.value, id => categoryMap[id]).slice(0, 6)
})

// Навигация по подсказкам с клавиатуры (↑ ↓ Enter Esc)
const activeSuggestion = ref(-1)
watch(suggestions, () => { activeSuggestion.value = -1 })

function onSearchKeydown(e) {
  if (!dropVisible.value || suggestions.value.length === 0) {
    if (e.key === 'Enter') dropVisible.value = false
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeSuggestion.value = (activeSuggestion.value + 1) % suggestions.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeSuggestion.value = activeSuggestion.value <= 0
      ? suggestions.value.length - 1
      : activeSuggestion.value - 1
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const pick = activeSuggestion.value >= 0
      ? suggestions.value[activeSuggestion.value]
      : suggestions.value[0]
    if (pick) selectSuggestion(pick)
  } else if (e.key === 'Escape') {
    dropVisible.value = false
    activeSuggestion.value = -1
  }
}

// Подсветка совпавших слов запроса в тексте подсказки
function highlight(text) {
  const parsed = parseQuery(searchQuery.value)
  const tokens = parsed.groups.flat().filter(t => t.length >= 2)
  if (!tokens.length) return escapeHtml(text)
  const esc = escapeHtml(text)
  // строим regex по нормализованным токенам (ищем без учёта ё/Е)
  const pattern = tokens
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|')
  try {
    return esc.replace(new RegExp(`(${pattern})`, 'giu'), '<mark>$1</mark>')
  } catch {
    return esc
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  ))
}

function selectSuggestion(item) {
  searchQuery.value = item.title
  activeCategory.value = 'all'
  dropVisible.value = false
  nextTick(() => {
    document.querySelector('.catalog__main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function closeDropdown() { dropVisible.value = false }

// Мобильный выпадающий список категорий
const catDropdownOpen = ref(false)
const hoveredCat = ref(null)
const flyoutTop = ref(0)
let _flyoutCloseTimer = null
function flyoutOpen(catId, event) {
  clearTimeout(_flyoutCloseTimer)
  hoveredCat.value = catId
  if (catId && event) {
    const item = event.currentTarget
    const sidebar = item.closest('.catalog__sidebar')
    if (sidebar) flyoutTop.value = item.getBoundingClientRect().top - sidebar.getBoundingClientRect().top
  }
}
function flyoutScheduleClose() {
  _flyoutCloseTimer = setTimeout(() => { hoveredCat.value = null }, 180)
}
function flyoutCancelClose() {
  clearTimeout(_flyoutCloseTimer)
}
function closeCatDropdown() { catDropdownOpen.value = false }
function selectCategoryMobile(catId) {
  selectCategory(catId)
  catDropdownOpen.value = false
}

// Выбор категории + прокрутка к товарам на мобиле (сайдбар стоит над списком)
function selectCategory(catId) {
  activeCategory.value = catId
  searchQuery.value = ''
  if (process.client && window.innerWidth <= 900) {
    nextTick(() => {
      const el = document.querySelector('.catalog__main')
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 64
        window.scrollTo({ top, behavior: 'smooth' })
      }
    })
  }
}

watch(activeCategory, () => {
  activeSub.value = null
  selectedPanelSize.value = null
  selectedPanelColor.value = null
})

watch(searchQuery, (q, prev) => {
  router.replace({ query: { ...route.query, search: q || undefined } })
  if (q.trim()) {
    dropVisible.value = true
    // прокручиваем к результатам только при начале ввода, а не на каждый символ
    if (!prev || !prev.trim()) {
      nextTick(() => {
        document.querySelector('.catalog__main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }
})

const vClickOutside = {
  mounted(el, binding) {
    el._out = (e) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener('click', el._out)
  },
  unmounted(el) { document.removeEventListener('click', el._out) },
}

const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.label]))

const categoriesForGrid = computed(() =>
  categories.filter(c => c.id !== 'all' && countByCategory(c.id) > 0)
)

// Картинка категории: своя (cat.img) или фото первого товара с фото из этой категории
const _autoCatImg = computed(() => {
  const map = {}
  for (const it of items) {
    if (map[it.category]) continue
    const p = it.photo || (it.photos && it.photos[0])
    if (p) map[it.category] = p
  }
  return map
})
function catImage(cat) {
  return cat.img || _autoCatImg.value[cat.id] || ''
}

const POPULAR_IDS = [1, 5, 34, 58, 15]
const popularItems = computed(() => {
  const picked = items.filter(i => POPULAR_IDS.includes(i.id))
  // запасной вариант, если хардкод-ID устарели
  return picked.length >= 3 ? picked : items.slice(0, 5)
})

// Счётчики по категориям — реактивны, пересчитываются при дозагрузке партнёрских товаров
const _catCounts = computed(() => {
  const map = { all: items.length }
  for (const item of items) map[item.category] = (map[item.category] || 0) + 1
  return map
})
function countByCategory(catId) {
  return _catCounts.value[catId] || 0
}

const currentSubs = computed(() =>
  subcategories[activeCategory.value] || []
)

const priceFilterActive = computed(() => priceMin.value !== null || priceMax.value !== null)

const priceAbsMin = computed(() => {
  const prices = items.filter(i => i.basePrice).map(i => i.basePrice)
  return prices.length ? Math.floor(Math.min(...prices) / 100) * 100 : 0
})
const priceAbsMax = computed(() => {
  const prices = items.filter(i => i.basePrice).map(i => i.basePrice)
  return prices.length ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 500000
})
const rangeStep = computed(() => {
  const range = priceAbsMax.value - priceAbsMin.value
  if (range <= 10000) return 100
  if (range <= 100000) return 500
  return 1000
})

const sliderMin = ref(0)
const sliderMax = ref(500000)
watch(priceAbsMin, v => { sliderMin.value = v }, { immediate: true })
watch(priceAbsMax, v => { sliderMax.value = v }, { immediate: true })

const rangeFillStyle = computed(() => {
  const total = priceAbsMax.value - priceAbsMin.value
  if (total === 0) return {}
  const left = ((sliderMin.value - priceAbsMin.value) / total) * 100
  const right = ((priceAbsMax.value - sliderMax.value) / total) * 100
  return { left: `${left}%`, right: `${right}%` }
})

function onSliderMin() {
  if (sliderMin.value >= sliderMax.value) sliderMin.value = sliderMax.value - rangeStep.value
  priceMin.value = sliderMin.value <= priceAbsMin.value ? null : sliderMin.value
}
function onSliderMax() {
  if (sliderMax.value <= sliderMin.value) sliderMax.value = sliderMin.value + rangeStep.value
  priceMax.value = sliderMax.value >= priceAbsMax.value ? null : sliderMax.value
}

function formatPrice(v) {
  if (v >= 1000) return (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + ' тыс.'
  return v.toLocaleString('ru-RU')
}

function setPricePreset(min, max) {
  priceMin.value = min
  priceMax.value = max
  sliderMin.value = min ?? priceAbsMin.value
  sliderMax.value = max ?? priceAbsMax.value
}
function resetPrice() {
  priceMin.value = null
  priceMax.value = null
  sliderMin.value = priceAbsMin.value
  sliderMax.value = priceAbsMax.value
}

const visibleCount = ref(24)
const sortBy = ref('default')

const filteredItems = computed(() => {
  let result = activeCategory.value === 'all'
    ? items
    : items.filter(i => i.category === activeCategory.value)
  if (activeSub.value) {
    result = result.filter(i => i.sub === activeSub.value)
  }
  if (_debouncedSearch.value.trim()) {
    const parsed = parseQuery(_debouncedSearch.value)
    result = result
      .map(i => ({ i, s: scoreItem(i, parsed, categoryMap[i.category]) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.i)
  }
  if (priceMin.value !== null || priceMax.value !== null) {
    result = result.filter(i => {
      if (!i.basePrice) return true
      const p = i.basePrice
      if (priceMin.value !== null && p < priceMin.value) return false
      if (priceMax.value !== null && p > priceMax.value) return false
      return true
    })
  }
  // Фильтр по выбранному размеру из инфо-панели
  if (selectedPanelSize.value) {
    const [sizeStr, group] = selectedPanelSize.value.split('|')
    const dims = sizeStr.replace(' мм', '').split('×')
    if (group === 'posts') {
      result = result.filter(i => {
        if (i.sub !== 'posts' && i.sub !== 'flanets') return false
        return dims.some(d => i.title.includes(d.replace(',', '.')))
      })
    } else {
      const isD5 = group === '5mm'
      result = result.filter(i => {
        if (i.sub && i.sub !== 'panels') return false
        const hasAllDims = dims.every(d => i.title.includes(d))
        if (!hasAllDims) return false
        if (isD5) return i.title.includes('d5') || i.title.includes('5мм')
        return !i.title.includes('d5')
      })
    }
  }
  // Фильтр по выбранному цвету из инфо-панели
  if (selectedPanelColor.value) {
    const name = selectedPanelColor.value.name.toLowerCase()
    const ral  = selectedPanelColor.value.ral.toLowerCase()
    const byColor = result.filter(i => {
      const t = (i.title + ' ' + (i.description || '')).toLowerCase()
      return t.includes(name) || t.includes(ral) || t.includes('ral')
    })
    result = byColor.length > 0
      ? byColor
      : result.filter(i => i.title.toLowerCase().includes('цвет'))
  }
  return result
})

const sortedItems = computed(() => {
  const arr = [...filteredItems.value]
  switch (sortBy.value) {
    case 'name_asc':   return arr.sort((a, b) => a.title.localeCompare(b.title, 'ru'))
    case 'name_desc':  return arr.sort((a, b) => b.title.localeCompare(a.title, 'ru'))
    case 'price_asc':  return arr.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0))
    case 'price_desc': return arr.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0))
    default:
      // при активном поиске сохраняем порядок по релевантности
      if (_debouncedSearch.value.trim()) return arr
      return arr.sort((a, b) => {
      const aHasPhoto = !!(a.photo || (a.photos && a.photos.length))
      const bHasPhoto = !!(b.photo || (b.photos && b.photos.length))
      if (aHasPhoto === bHasPhoto) return 0
      return aHasPhoto ? -1 : 1
    })
  }
})

const paginatedItems = computed(() => sortedItems.value.slice(0, visibleCount.value))

watch([activeCategory, searchQuery, activeSub, priceMin, priceMax], () => {
  visibleCount.value = 24
})

// ── Появление карточек товара при скролле (IntersectionObserver) ──
// Скрытое состояние навешивается из JS (класс .ci-reveal), поэтому без JS
// карточки остаются видимыми. При пагинации/смене фильтра — переобследуем новые.
let revealObserver = null
function observeItems() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('ci-revealed')
          revealObserver.unobserve(e.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
  }
  document.querySelectorAll('.catalog-item:not([data-io])').forEach((el) => {
    el.setAttribute('data-io', '')
    el.classList.add('ci-reveal')
    revealObserver.observe(el)
  })
}
onMounted(() => nextTick(observeItems))
watch(paginatedItems, () => nextTick(observeItems))

function openOrder(item) {
  orderItem.value = item
  orderSuccess.value = false
  orderForm.name = ''
  orderForm.phone = ''
  orderForm.message = ''
  orderForm.needInstall = false
}

async function submitOrder() {
  if (!orderForm.name || !orderForm.phone) return
  orderLoading.value = true

  const priceText = orderItem.value.basePrice
    ? `от ${orderItem.value.basePrice.toLocaleString('ru-RU')} ₽${orderItem.value.unit ? ' / ' + orderItem.value.unit : ''}`
    : (orderItem.value.price || 'Уточнить цену')

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        company: orderForm.company,
        name: orderForm.name,
        phone: orderForm.phone,
        email: null,
        message: [
          orderForm.needInstall ? '✅ Нужна установка под ключ' : '',
          orderForm.message || '',
        ].filter(Boolean).join('\n') || '—',
        item_title: orderItem.value.title,
        item_price: priceText,
      },
    })
    orderSuccess.value = true
    orderForm.name = ''
    orderForm.phone = ''
    orderForm.message = ''
  } catch {
    orderForm.message = 'Ошибка. Позвоните нам напрямую.'
  } finally {
    orderLoading.value = false
  }
}
</script>

<style scoped>
.catalog { min-height: 100vh; background: #0a0a0a; padding-bottom: 4rem; }

/* Шапка */
.catalog__hero {
  background:
    radial-gradient(ellipse 70% 60% at 50% -10%, rgba(230,184,0,0.13) 0%, transparent 60%),
    radial-gradient(ellipse 35% 40% at 95% 30%, rgba(230,184,0,0.06) 0%, transparent 50%),
    #0a0a0a;
  padding: 5rem 1.5rem 1.75rem;
  border-bottom: 1px solid rgba(230,184,0,0.08);
  position: relative;
  overflow: hidden;
}
.catalog__hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(230,184,0,0.3), transparent);
}
.catalog__hero-inner { max-width: 1300px; margin: 0 auto; }

.catalog__hero-logo {
  display: inline-flex;
  text-decoration: none;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  transition: opacity 0.2s;
}
.catalog__hero-logo:hover { opacity: 1; }

/* Строка поиск + фильтр цены */
.catalog__hero-controls {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.catalog__hero-price {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.catalog__price-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.catalog__price-display {
  font-size: 0.8rem;
  color: #ccc;
  font-weight: 500;
}

.catalog__hero-price-label {
  font-size: 0.75rem;
  color: #e6b800;
  font-weight: 700;
  white-space: nowrap;
}

.catalog__hero-price-reset {
  background: none;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  font-size: 0.72rem;
  font-family: inherit;
  padding: 0.15rem 0.6rem;
  transition: color 0.2s, border-color 0.2s;
  margin-left: auto;
}
.catalog__hero-price-reset:hover { color: #e6b800; border-color: rgba(230,184,0,0.4); }

/* Двойной range-слайдер */
.catalog__range-wrap {
  position: relative;
  height: 28px;
  display: flex;
  align-items: center;
}
.catalog__range-track {
  position: absolute;
  left: 0; right: 0;
  height: 4px;
  background: #222;
  border-radius: 4px;
}
.catalog__range-fill {
  position: absolute;
  top: 0; bottom: 0;
  background: #e6b800;
  border-radius: 4px;
}
.catalog__range {
  position: absolute;
  width: 100%;
  height: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  pointer-events: none;
  outline: none;
}
.catalog__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px; height: 18px;
  background: #e6b800;
  border-radius: 50%;
  border: 2px solid #0a0a0a;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 0 0 3px rgba(230,184,0,0.2);
  transition: box-shadow 0.2s;
}
.catalog__range::-webkit-slider-thumb:hover { box-shadow: 0 0 0 5px rgba(230,184,0,0.3); }
.catalog__range::-moz-range-thumb {
  width: 18px; height: 18px;
  background: #e6b800;
  border-radius: 50%;
  border: 2px solid #0a0a0a;
  cursor: pointer;
  pointer-events: all;
}
.catalog__range--max { z-index: 2; }

.catalog__hero-price-presets {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  padding-left: 0.2rem;
}

.catalog__hero-price-preset {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #666;
  font-size: 0.72rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s;
  white-space: nowrap;
}
.catalog__hero-price-preset:hover { border-color: rgba(230,184,0,0.4); color: #ccc; }
.catalog__hero-price-preset.active { background: rgba(230,184,0,0.12); border-color: #e6b800; color: #e6b800; }

.catalog__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 1rem;
}
.catalog__breadcrumb a { color: #e6b800; text-decoration: none; opacity: 0.8; }
.catalog__breadcrumb a:hover { opacity: 1; }

.catalog__title {
  font-family: 'Space Grotesk', 'Montserrat', sans-serif;
  font-size: clamp(1.4rem, 4.5vw, 2.2rem);
  font-weight: 700;
  margin-bottom: 0.85rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
  background: linear-gradient(118deg, #ffffff 0%, #ffe9a3 58%, #e6b800 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.catalog__title span { color: #e6b800; -webkit-text-fill-color: #e6b800; }
.catalog__price-note { font-size: 0.74rem; color: #666; line-height: 1.4; max-width: 620px; margin: 0 0 1rem; }

/* Поиск */
.catalog__search-wrap {
  position: relative;
  max-width: 520px;
}

.catalog__search {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  backdrop-filter: blur(10px);
  transition: border-color 0.2s;
  overflow: hidden;
}
.catalog__search:focus-within { border-color: rgba(230,184,0,0.5); }
.catalog__search-icon { position: absolute; left: 1rem; color: #555; pointer-events: none; flex-shrink: 0; }
.catalog__search-input {
  flex: 1;
  padding: 0.8rem 2.5rem 0.8rem 2.75rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}
.catalog__search-input::placeholder { color: #555; }
.catalog__search-clear { position: absolute; right: 1rem; background: none; border: none; color: #555; cursor: pointer; transition: color 0.2s; font-size: 0.9rem; }
.catalog__search-clear:hover { color: #fff; }
.catalog__tw {
  position: absolute;
  left: 2.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  font-size: 0.95rem;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 5rem);
}
.catalog__tw-cursor {
  display: inline-block;
  color: #e6b800;
  animation: tw-blink 0.75s step-end infinite;
  margin-left: 1px;
}
@keyframes tw-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* Подсказки каталога */
.catalog__suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(16,16,16,0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6);
  z-index: 50;
}

.catalog__suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.catalog__suggestion-item:last-child { border-bottom: none; }
.catalog__suggestion-item:hover,
.catalog__suggestion-item.active { background: rgba(230,184,0,0.08); }

.catalog__suggestion-title :deep(mark),
.catalog__suggestion-title mark {
  background: rgba(230,184,0,0.28);
  color: #ffe9a3;
  border-radius: 3px;
  padding: 0 1px;
}

.catalog__suggestion-icon { font-size: 1.1rem; flex-shrink: 0; }
.catalog__suggestion-info { display: flex; flex-direction: column; gap: 0.1rem; flex: 1; min-width: 0; }
.catalog__suggestion-title { font-size: 0.875rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.catalog__suggestion-cat { font-size: 0.72rem; color: #555; }
.catalog__suggestion-price { font-size: 0.8rem; font-weight: 700; color: #e6b800; white-space: nowrap; flex-shrink: 0; }

.suggestions-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.suggestions-leave-active { transition: opacity 0.15s ease; }
.suggestions-enter-from { opacity: 0; transform: translateY(-6px); }
.suggestions-leave-to { opacity: 0; }

/* Layout */
.catalog__layout {
  max-width: 1300px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Боковая панель */
.catalog__sidebar {
  position: sticky;
  top: 80px;
  z-index: 50;
}
.catalog__sidebar-inner {
  background: #0d0d0d;
  border: 1px solid rgba(230,184,0,0.1);
  border-radius: 16px;
  overflow: hidden;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.catalog__sidebar-title {
  padding: 1rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #e6b800;
  background: rgba(230,184,0,0.05);
  border-bottom: 1px solid rgba(230,184,0,0.08);
  flex-shrink: 0;
}

.catalog__sidebar-list {
  list-style: none;
  padding: 0.4rem 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
}
.catalog__sidebar-list::-webkit-scrollbar { width: 4px; }
.catalog__sidebar-list::-webkit-scrollbar-track { background: transparent; }
.catalog__sidebar-list::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
.catalog__sidebar-list::-webkit-scrollbar-thumb:hover { background: #e6b800; }

.catalog__sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.25rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border-left-color 0.18s;
  color: #777;
  font-size: 0.82rem;
  font-weight: 500;
  border-left: 2px solid transparent;
}
.catalog__sidebar-item:hover,
.catalog__sidebar-item.hovered { background: rgba(230,184,0,0.06); color: #e6b800; border-left-color: #e6b800; }
.catalog__sidebar-item.active { background: rgba(230,184,0,0.08); color: #e6b800; border-left-color: #e6b800; font-weight: 600; }

.catalog__sidebar-label { flex: 1; line-height: 1.3; }
.catalog__sidebar-arrow { color: #444; transition: color 0.18s; flex-shrink: 0; }
.catalog__sidebar-item:hover .catalog__sidebar-arrow,
.catalog__sidebar-item.hovered .catalog__sidebar-arrow { color: #e6b800; }

/* ── Flyout мегаменю ── */
.catalog__flyout {
  position: absolute;
  left: calc(100% + 8px);
  width: 340px;
  background: rgba(14,14,14,0.99);
  border: 1px solid rgba(230,184,0,0.25);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,184,0,0.05);
  backdrop-filter: blur(20px);
  z-index: 100;
  overflow: hidden;
}
.catalog__flyout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.catalog__flyout-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #e6b800;
}
.catalog__flyout-total {
  font-size: 0.7rem;
  color: #555;
  background: rgba(255,255,255,0.04);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.catalog__flyout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 0.5rem;
}
.catalog__flyout-sub {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: none;
  border: none;
  color: #999;
  font-size: 0.78rem;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  line-height: 1.3;
}
.catalog__flyout-sub svg { color: #444; flex-shrink: 0; transition: color 0.15s, transform 0.15s; }
.catalog__flyout-sub:hover { background: rgba(230,184,0,0.08); color: #fff; }
.catalog__flyout-sub:hover svg { color: #e6b800; transform: translateX(2px); }
.catalog__flyout-all {
  display: block;
  width: calc(100% - 1rem);
  margin: 0 0.5rem 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(230,184,0,0.07);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 8px;
  color: #e6b800;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-align: center;
}
.catalog__flyout-all:hover { background: rgba(230,184,0,0.13); border-color: rgba(230,184,0,0.4); }

/* Анимация flyout */
.flyout-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.flyout-leave-active { transition: opacity 0.12s ease; }
.flyout-enter-from  { opacity: 0; transform: translateX(-6px); }
.flyout-leave-to    { opacity: 0; }

.catalog__sidebar-count {
  font-size: 0.72rem;
  background: rgba(255,255,255,0.07);
  color: #555;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.catalog__sidebar-item.active .catalog__sidebar-count { background: rgba(230,184,0,0.15); color: #e6b800; }


/* Основной контент */
.catalog__main { min-width: 0; }

/* ── Сетка категорий ── */
.catalog__cats-section { margin-bottom: 2rem; }
.catalog__cats-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #1e1e1e;
}

.catalog__cats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

/* Базовая карточка категории (иконка) */
.catalog__cat-card {
  position: relative;
  overflow: hidden;
  background: #0f0f0f;
  border: 1px solid #1e1e1e;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s, box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1);
  user-select: none;
  /* Каскадное появление */
  animation: cat-card-in 0.55s cubic-bezier(0.16,1,0.3,1) both;
  animation-delay: calc(var(--i, 0) * 55ms);
}
@keyframes cat-card-in {
  from { opacity: 0; transform: translateY(24px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.catalog__cat-card:hover {
  border-color: rgba(230,184,0,0.55);
  box-shadow: 0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(230,184,0,0.1), 0 0 24px rgba(230,184,0,0.12);
  transform: translateY(-6px) scale(1.015);
}
.catalog__cat-card:active { transform: translateY(-2px) scale(0.99); transition-duration: 0.1s; }
@media (prefers-reduced-motion: reduce) {
  .catalog__cat-card { animation: none; }
  .catalog__cat-card:hover { transform: none; }
}

/* Вращающаяся каёмка */
@keyframes cat-border-spin { to { transform: rotate(360deg); } }
.catalog__cat-card::before {
  content: '';
  position: absolute; z-index: 0;
  top: 50%; left: 50%;
  width: 175%; aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg, transparent 0deg,
    rgba(245,200,66,0.15) 40deg, rgba(230,184,0,1) 95deg,
    rgba(245,200,66,0.15) 130deg, transparent 200deg, transparent 360deg
  );
  opacity: 0;
  transition: opacity 0.3s;
  animation: cat-border-spin 4s linear infinite;
  animation-play-state: paused;
  pointer-events: none;
}
.catalog__cat-card::after {
  content: ''; position: absolute; z-index: 0;
  inset: 1.5px; border-radius: 13px;
  background: #0f0f0f; transition: background 0.25s; pointer-events: none;
}
.catalog__cat-card:hover::before { opacity: 1; animation-play-state: running; }
.catalog__cat-card:hover::after  { background: #111108; }
@media (prefers-reduced-motion: reduce) { .catalog__cat-card::before { animation: none; } }

/* Визуальная часть */
.catalog__cat-card-visual {
  position: relative; z-index: 1;
  width: 100%; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Карточка с иконкой */
.catalog__cat-card:not(.catalog__cat-card--photo) .catalog__cat-card-visual {
  padding: 1.5rem 1rem 0.75rem;
}
.catalog__cat-card-icon {
  width: 56px; height: 56px;
  background: linear-gradient(150deg, rgba(245,200,66,0.14), rgba(230,184,0,0.04));
  border: 1px solid rgba(230,184,0,0.22);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: #e6b800;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s;
}
.catalog__cat-card:hover .catalog__cat-card-icon {
  transform: translateY(-3px);
  border-color: rgba(230,184,0,0.5);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 20px rgba(230,184,0,0.18);
}

/* Карточка с фотографией */
.catalog__cat-card--photo .catalog__cat-card-visual {
  height: 140px;
  background: #111;
}
.catalog__cat-card-photo {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.3s;
  filter: brightness(0.82) saturate(0.9);
}
.catalog__cat-card--photo:hover .catalog__cat-card-photo {
  transform: scale(1.09);
  filter: brightness(1) saturate(1.15);
}

/* Блик-проблеск по фото при наведении */
.catalog__cat-card-shine {
  position: absolute; z-index: 2;
  top: 0; left: -75%;
  width: 50%; height: 100%;
  background: linear-gradient(100deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.28) 50%,
    rgba(255,255,255,0) 100%);
  transform: skewX(-18deg);
  pointer-events: none;
  opacity: 0;
}
.catalog__cat-card--photo:hover .catalog__cat-card-shine {
  animation: cat-card-shine 0.85s cubic-bezier(0.3,0,0.2,1);
}
@keyframes cat-card-shine {
  0%   { left: -75%; opacity: 0; }
  15%  { opacity: 1; }
  100% { left: 130%; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .catalog__cat-card-shine { display: none; }
}

/* Нижняя часть карточки */
.catalog__cat-card-footer {
  position: relative; z-index: 1;
  padding: 0.85rem 1rem 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.catalog__cat-card--photo .catalog__cat-card-footer {
  border-top: none;
  background: linear-gradient(180deg, rgba(10,10,8,0) 0%, rgba(10,10,8,0.95) 100%);
}

/* Иконные карточки — footer без верхней линии, паддинг сверху меньше */
.catalog__cat-card:not(.catalog__cat-card--photo) .catalog__cat-card-footer {
  border-top: none;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.catalog__cat-card-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ccc;
  line-height: 1.3;
  text-align: center;
  flex: 1;
}
.catalog__cat-card--photo .catalog__cat-card-label { color: #eee; text-align: left; }

.catalog__cat-card-count {
  font-size: 0.68rem;
  color: #555;
  background: rgba(255,255,255,0.06);
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.catalog__cat-card:hover .catalog__cat-card-count { color: #e6b800; background: rgba(230,184,0,0.12); }

/* Стрелка-подсказка */
.catalog__cat-card-arrow {
  color: #e6b800;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1);
}
.catalog__cat-card:not(.catalog__cat-card--photo) .catalog__cat-card-arrow { display: none; }
.catalog__cat-card--photo:hover .catalog__cat-card-arrow {
  opacity: 1;
  transform: translateX(0);
}
/* Лёгкий сдвиг названия, чтобы освободить место стрелке */
.catalog__cat-card--photo:hover .catalog__cat-card-label { transform: translateX(2px); transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }

/* Заголовок раздела */
.catalog__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
  position: sticky;
  top: 68px;
  z-index: 30;
  padding: 0.85rem 0;
  background: rgba(10,10,10,0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.catalog__section-title { font-size: 1.3rem; font-weight: 700; color: #fff; }
.catalog__section-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.catalog__sort-select {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  color: #bbb;
  font-size: 0.82rem;
  font-family: inherit;
  padding: 0.4rem 0.75rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 2rem;
}
.catalog__sort-select:focus,
.catalog__sort-select:hover { border-color: #e6b800; color: #fff; }
.catalog__section-reset {
  font-size: 0.8rem;
  color: #e6b800;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.catalog__section-reset:hover { opacity: 1; }

/* Список */
.catalog__list { display: flex; flex-direction: column; gap: 1.25rem; }

/* Элемент */
.catalog-item {
  position: relative;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #0e0e0e;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
  cursor: pointer;
}
.catalog-item:hover {
  border-color: rgba(230,184,0,0.4);
  box-shadow: 0 12px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(230,184,0,0.05), 0 0 40px rgba(230,184,0,0.12);
}

/* Появление карточки при скролле (класс навешивается из JS) */
.catalog-item.ci-reveal { opacity: 0; transform: translateY(26px); }
.catalog-item.ci-reveal.ci-revealed {
  opacity: 1;
  transform: none;
  transition: opacity 0.55s ease, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  .catalog-item.ci-reveal { opacity: 1; transform: none; }
}

/* Вращающаяся подсветка-каёмка карточки товара (при наведении) */
.catalog-item::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: 50%; left: 50%;
  width: 200%; aspect-ratio: 1;
  transform: translate(-50%, -50%);
  transform-origin: center;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(245,200,66,0.12) 35deg,
    rgba(245,200,66,0.9) 75deg,
    rgba(230,184,0,1) 92deg,
    rgba(255,233,163,1) 100deg,
    rgba(245,200,66,0.12) 140deg,
    transparent 210deg,
    transparent 360deg
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: cat-border-spin 3.5s linear infinite;
  animation-play-state: paused;
  pointer-events: none;
}
/* Внутренняя заглушка — оставляет видимой только тонкую вращающуюся кромку */
.catalog-item::after {
  content: '';
  position: absolute;
  z-index: 0;
  inset: 1.5px;
  border-radius: 15px;
  background: #0e0e0e;
  pointer-events: none;
}
.catalog-item:hover::before { opacity: 1; animation-play-state: running; }
/* Контент карточки — поверх вращающейся кромки */
.catalog-item__img,
.catalog-item__content { position: relative; z-index: 1; }
@media (prefers-reduced-motion: reduce) {
  .catalog-item::before { animation: none; }
}

.catalog-item__img { min-height: 200px; background: #0d0d0d; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.catalog-item__img img { width: 100%; height: 100%; object-fit: contain; display: block; padding: 6%; filter: drop-shadow(0 4px 20px rgba(230, 184, 0, 0.2)); transition: filter 0.3s; }
.catalog-item:hover .catalog-item__img img { filter: drop-shadow(0 4px 32px rgba(230, 184, 0, 0.45)); }

/* Карусель */
.ci-carousel__prev,
.ci-carousel__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.55);
  border: none;
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  width: 28px;
  height: 40px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
  z-index: 2;
  padding: 0;
}
.ci-carousel__prev { left: 6px; }
.ci-carousel__next { right: 6px; }
.catalog-item:hover .ci-carousel__prev,
.catalog-item:hover .ci-carousel__next { opacity: 1; }
.ci-carousel__prev:hover,
.ci-carousel__next:hover { background: rgba(230,184,0,0.7); color: #000; }

.ci-carousel__prev--lg,
.ci-carousel__next--lg {
  width: 36px;
  height: 52px;
  font-size: 1.8rem;
  opacity: 1;
  background: rgba(0,0,0,0.45);
}

.ci-carousel__dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 2;
}
.ci-carousel__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.ci-carousel__dot.active {
  background: #e6b800;
  transform: scale(1.3);
}
.ci-carousel__dots--lg .ci-carousel__dot { width: 8px; height: 8px; }

.catalog-item__placeholder {
  width: 100%;
  height: 100%;
  min-height: 120px;
  overflow: hidden;
}
.catalog-item__placeholder-img {
  width: 100%;
  height: 100%;
  min-height: 200px;
  object-fit: cover;
  display: block;
  filter: brightness(0.85);
  transition: transform 0.4s ease;
}
.catalog-item:hover .catalog-item__placeholder-img {
  transform: scale(1.04);
}
.catalog-item__placeholder-empty {
  width: 100%;
  height: 100%;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, #1c1a10, #0d0d0d);
  opacity: 0.5;
}

.catalog-item__content { padding: 1.75rem; display: flex; flex-direction: column; gap: 0.65rem; justify-content: center; }
.catalog-item__category { font-size: 0.72rem; font-weight: 700; color: #e6b800; text-transform: uppercase; letter-spacing: 0.12em; }
.catalog-item__title { font-size: 1.15rem; font-weight: 700; color: #fff; }
.catalog-item__desc { font-size: 0.875rem; color: #777; line-height: 1.7; flex: 1; }

.catalog-item__footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; }
.catalog-item__price-block { display: flex; flex-direction: column; gap: 0.1rem; flex: 1 1 auto; min-width: 0; }
.catalog-item__price-label { font-size: 0.68rem; color: #444; text-transform: uppercase; letter-spacing: 0.1em; }
.catalog-item__price { font-size: 1.15rem; font-weight: 700; color: #e6b800; }
.catalog-item__whole { font-size: 0.68rem; color: #b0862e; line-height: 1.2; cursor: help; }
.catalog-item__price--ask { font-size: 0.8rem; font-weight: 600; line-height: 1.2; color: #aaa; white-space: normal; }

.catalog-item__btn {
  position: relative;
  overflow: hidden;
  padding: 0.6rem 1.3rem;
  background: #e6b800;
  color: #0a0a0a;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.catalog-item__btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  transform: skewX(-20deg);
  transition: left 0.55s ease;
}
.catalog-item__btn:hover::after { left: 140%; }
.catalog-item__btn:hover {
  background: #f5c842;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(230,184,0,0.4);
}

.catalog-item__add {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #333;
  background: none;
  color: #666;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.catalog-item__add:hover { background: rgba(230,184,0,0.12); color: #e6b800; border-color: rgba(230,184,0,0.4); }
.catalog-item__add.added { background: rgba(74,222,128,0.1); color: #4ade80; border-color: rgba(74,222,128,0.3); }

/* Подкатегории */
/* ── Инфо-панель панелей ── */
.panels-info {
  background: #121212;
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}
.panels-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.18s;
}
.panels-info__header:hover { background: rgba(230,184,0,0.05); }
.panels-info__title { font-size: 0.9rem; font-weight: 600; color: #e6b800; }
.panels-info__arrow { color: #e6b800; transition: transform 0.2s; flex-shrink: 0; }
.panels-info__arrow.rotated { transform: rotate(180deg); }
.panels-info__body {
  padding: 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.panels-info__section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #606060;
  margin-bottom: 0.6rem;
}
.panels-info__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.panels-info__color {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 999px;
  padding: 0.3rem 0.75rem 0.3rem 0.4rem;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.panels-info__color:hover { border-color: rgba(230,184,0,0.35); transform: translateY(-1px); }
.panels-info__color.selected { border-color: #e6b800; background: rgba(230,184,0,0.1); box-shadow: 0 0 0 3px rgba(230,184,0,0.12); }
.panels-info__color-dot {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  flex-shrink: 0;
}
.panels-info__color-name { font-size: 0.78rem; color: #c0c0c0; }
.panels-info__color-ral  { font-size: 0.7rem;  color: #505050; }
.panels-info__sizes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.panels-info__size-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.panels-info__size {
  background: #1a1a1a;
  border: 1px solid #252525;
  border-radius: 6px;
  padding: 0.25rem 0.6rem;
  font-size: 0.78rem;
  color: #909090;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
}
.panels-info__size:hover { border-color: rgba(230,184,0,0.4); color: #e6b800; transform: translateY(-1px); }
.panels-info__size.selected { background: #e6b800; border-color: #e6b800; color: #0a0a0a; font-weight: 700; transform: none; }

/* Бейдж активного фильтра */
.panel-filter-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(230,184,0,0.08); border: 1px solid rgba(230,184,0,0.25);
  border-radius: 999px; padding: 0.4rem 0.5rem 0.4rem 0.9rem;
  font-size: 0.8rem; color: #e6b800; font-weight: 600;
  margin-bottom: 1rem;
}
.panel-filter-badge__dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; vertical-align: middle; margin-right: 2px; }
.panel-filter-badge__clear {
  background: rgba(230,184,0,0.12); border: none; border-radius: 50%;
  width: 20px; height: 20px; cursor: pointer; color: #e6b800;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.panel-filter-badge__clear:hover { background: rgba(230,184,0,0.25); }
@media (max-width: 700px) {
  .panels-info__sizes { grid-template-columns: 1fr; }
}

.catalog__subs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.catalog__sub-chip {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1px solid #2a2a2a;
  background: #111;
  color: #777;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.catalog__sub-chip:hover {
  border-color: rgba(230,184,0,0.4);
  color: #ccc;
}

.catalog__sub-chip.active {
  background: rgba(230,184,0,0.12);
  border-color: #e6b800;
  color: #e6b800;
  font-weight: 600;
}

/* Счётчик и пагинация */
.catalog__count {
  font-size: 0.8rem;
  color: #444;
  margin-bottom: 1rem;
}

.catalog__load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.catalog__load-more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.85rem 2.5rem;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  color: #ccc;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.catalog__load-more-btn:hover {
  border-color: rgba(230,184,0,0.5);
  color: #e6b800;
  background: rgba(230,184,0,0.05);
}
.catalog__load-more-total {
  font-size: 0.72rem;
  color: #555;
  font-weight: 400;
}

/* Популярные */
.catalog__popular { margin-bottom: 2.5rem; }
.catalog__popular-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #1e1e1e;
}

/* Пусто */
.catalog__empty { text-align: center; padding: 4rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.catalog__empty-icon { opacity: 0.25; color: #e6b800; }
.catalog__empty p { color: #666; }
.catalog__empty strong { color: #e6b800; }
.catalog__empty-btn { padding: 0.6rem 1.5rem; border: 1px solid #333; border-radius: 999px; background: none; color: #888; font-family: inherit; font-size: 0.875rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
.catalog__empty-btn:hover { border-color: #e6b800; color: #e6b800; }

/* Анимации */
.list-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.list-leave-active { transition: opacity 0.2s ease; position: absolute; }
.list-enter-from { opacity: 0; transform: translateY(12px); }
.list-leave-to { opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Мобильная */
/* ── Мобильная липкая панель: поиск + выпадающие категории ── */
.catalog__mobilebar {
  display: none; /* включается в медиа ≤900px */
  flex-direction: column;
  gap: 0.55rem;
  position: sticky;
  top: 56px;
  z-index: 40;
  margin: 0 0 1.25rem;
  padding: 0.7rem 1.5rem 0.8rem;
  background: rgba(10,10,10,0.97);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(230,184,0,0.1);
}
.catalog__mobilebar .catalog__search-wrap { max-width: none; width: 100%; }

.catalog__catdrop { position: relative; }
.catalog__catdrop-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  color: #fff;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.catalog__catdrop-btn.open { border-color: rgba(230,184,0,0.5); background: rgba(230,184,0,0.06); }
.catalog__catdrop-ico { color: #e6b800; flex-shrink: 0; }
.catalog__catdrop-current { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.catalog__catdrop-arrow { color: #888; flex-shrink: 0; transition: transform 0.25s ease; }
.catalog__catdrop-arrow.rotated { transform: rotate(180deg); color: #e6b800; }

.catalog__catdrop-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0; right: 0;
  max-height: 60vh;
  overflow-y: auto;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: rgba(16,16,16,0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.6);
  z-index: 50;
  -webkit-overflow-scrolling: touch;
}
.catalog__catdrop-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  color: #bbb;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.catalog__catdrop-item:hover,
.catalog__catdrop-item.active { background: rgba(230,184,0,0.1); color: #e6b800; }
.catalog__catdrop-label { flex: 1; }
.catalog__catdrop-count {
  font-size: 0.72rem;
  background: rgba(255,255,255,0.07);
  color: #777;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.catalog__catdrop-item.active .catalog__catdrop-count { background: rgba(230,184,0,0.18); color: #e6b800; }

@media (max-width: 900px) {
  .catalog__layout { grid-template-columns: 1fr; }
  /* Сайдбар и поиск в шапке скрыты — их заменяет липкая мобильная панель */
  .catalog__sidebar { display: none; }
  .catalog__hero-controls > .catalog__search-wrap { display: none; }
  .catalog__mobilebar { display: flex; }
  .catalog__section-header { position: static; backdrop-filter: none; background: none; padding: 0; }
  .catalog__hero-controls { flex-direction: column; }
  .catalog__hero-price { width: 100%; }
  .catalog__hero-price-inputs { border-radius: 12px; }
  .catalog__cats { grid-template-columns: repeat(3, 1fr); }
  .catalog-item { grid-template-columns: 1fr; }
  .catalog-item__img, .catalog-item__placeholder { min-height: 180px; }
  .catalog-item__content { padding: 1.25rem; }
}

@media (max-width: 480px) {
  .catalog__cats { grid-template-columns: repeat(2, 1fr); }
  .catalog-item__btn { width: 100%; text-align: center; }
}

/* Модалка */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal { background: #141414; border: 1px solid #2a2412; border-radius: 20px; padding: 2rem; width: 100%; max-width: 460px; position: relative; }
.modal__close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #666; font-size: 1.1rem; cursor: pointer; transition: color 0.2s; }
.modal__close:hover { color: #fff; }
.modal__title { font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.modal__price { color: #e6b800; font-weight: 600; margin-bottom: 0.5rem; }
.modal__whole { font-size: 0.8rem; color: #c8974a; background: rgba(230,184,0,0.08); border: 1px solid rgba(230,184,0,0.2); border-radius: 8px; padding: 0.5rem 0.7rem; margin-bottom: 1.25rem; line-height: 1.4; }
.modal__form { display: flex; flex-direction: column; gap: 0.85rem; }
.modal__input { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
.modal__input:focus { border-color: #e6b800; }
.modal__input::placeholder { color: #444; }
.modal__textarea { resize: vertical; min-height: 80px; }
.modal__consent {
  display: flex; align-items: flex-start; gap: 0.6rem; cursor: pointer;
  font-size: 0.72rem; color: #555; line-height: 1.5;
}
.modal__consent-check { flex-shrink: 0; width: 14px; height: 14px; margin-top: 2px; accent-color: #e6b800; cursor: pointer; }
.modal__consent-link { color: #e6b800; text-decoration: underline; }

.modal__submit { padding: 0.85rem; background: #e6b800; color: #0a0a0a; font-size: 1rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.modal__submit:hover:not(:disabled) { background: #f5c842; }
.modal__submit:disabled { opacity: 0.6; cursor: not-allowed; }
.modal__success { color: #4ade80; font-size: 0.9rem; text-align: center; }

.modal__install {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(230,184,0,0.06);
  border: 1px solid rgba(230,184,0,0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.modal__install:hover { background: rgba(230,184,0,0.1); border-color: rgba(230,184,0,0.35); }

.modal__install-checkbox {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: #e6b800;
  cursor: pointer;
}

.modal__install-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.modal__install-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.modal__install-hint {
  font-size: 0.75rem;
  color: #666;
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* Детальный просмотр */
.modal--detail {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  max-width: 860px;
  padding: 2rem;
  align-items: flex-start;
  max-height: 90vh;
  overflow-y: auto;
}

.detail__img-wrap {
  flex: 0 0 340px;
  background: #0d0d0d;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.detail__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8%;
  filter: drop-shadow(0 4px 20px rgba(230,184,0,0.2));
}

.detail__img-empty {
  width: 100%;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

.detail__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail__category {
  display: inline-block;
  background: rgba(230,184,0,0.12);
  color: #e6b800;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(230,184,0,0.25);
  width: fit-content;
}

.detail__title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

.detail__desc {
  color: #888;
  font-size: 0.95rem;
  line-height: 1.6;
}

.detail__price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e6b800;
}

.detail__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.detail__btn { flex: 1; min-width: 160px; padding: 0.85rem 1.5rem; font-size: 1rem; text-align: center; display: flex; align-items: center; justify-content: center; }

.detail__btn-page {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 1.1rem;
  background: transparent;
  border: 1px solid rgba(230,184,0,0.3);
  color: #e6b800;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.85rem;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.detail__btn-page:hover { background: rgba(230,184,0,0.1); border-color: rgba(230,184,0,0.6); }

.detail__btn-close {
  flex: 0 0 auto;
  padding: 0.85rem 1.25rem;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s, color 0.2s;
}
.detail__btn-close:hover { border-color: #555; color: #ccc; }

.catalog-item { cursor: pointer; }

/* Stretched-link: настоящая ссылка поверх карточки (SEO + клавиатура + новая вкладка) */
.catalog-item__link {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  font-size: 0;
}
/* Интерактив поверх ссылки */
.catalog-item__btn,
.catalog-item__add,
.ci-carousel__prev,
.ci-carousel__next,
.ci-carousel__dots { position: relative; z-index: 4; }

@media (max-width: 640px) {
  .modal--detail { flex-direction: column; padding: 1.25rem; }
  .detail__img-wrap { flex: none; width: 100%; min-height: 200px; }
}

/* Футер */
.footer { padding: 2.5rem 1.5rem; background: #080808; border-top: 1px solid #1e1e1e; text-align: center; margin-top: 4rem; }
.footer__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 0.5rem; }
.footer__name { color: #e6b800; font-weight: 600; font-size: 0.95rem; }
.footer__contacts { color: #555; font-size: 0.85rem; }
.footer__contacts a { color: #888; text-decoration: none; transition: color 0.2s; }
.footer__contacts a:hover { color: #e6b800; }
.footer__copy { color: #333; font-size: 0.8rem; }

/* Skeleton */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.catalog-skeleton {
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.catalog-skeleton__img {
  height: 180px;
  background: linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}
.catalog-skeleton__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.catalog-skeleton__line {
  border-radius: 6px;
  background: linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
}
.catalog-skeleton__line--sm  { height: 10px; width: 45%; }
.catalog-skeleton__line--lg  { height: 14px; width: 85%; }
.catalog-skeleton__line--md  { height: 10px; width: 65%; }
.catalog-skeleton__footer    { height: 32px; border-radius: 8px; margin-top: 0.4rem; background: linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite linear; }

/* ── Заголовок раздела — новый ── */
.catalog__section-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.catalog__section-badge {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(230,184,0,0.12);
  border: 1px solid rgba(230,184,0,0.25);
  color: #e6b800;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

/* ── Пиллы сортировки ── */
.catalog__sort-pills {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}
.catalog__sort-pill {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.03);
  color: #555;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.catalog__sort-pill:hover { border-color: rgba(230,184,0,0.35); color: #ccc; }
.catalog__sort-pill.active {
  background: rgba(230,184,0,0.12);
  border-color: rgba(230,184,0,0.5);
  color: #e6b800;
}

/* ── Переключатель вид ── */
.catalog__view-toggle {
  display: flex;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  overflow: hidden;
}
.catalog__view-btn {
  width: 32px; height: 32px;
  background: none; border: none;
  color: #444; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.catalog__view-btn:hover { color: #999; }
.catalog__view-btn.active { background: rgba(230,184,0,0.14); color: #e6b800; }

/* ── TransitionGroup items ── */
.ci-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger, 0ms);
}
.ci-leave-active { transition: opacity 0.15s ease; }
.ci-enter-from { opacity: 0; transform: translateY(12px); }
.ci-leave-to   { opacity: 0; }
.ci-move { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }

/* ── Grid режим (плитка 2-3 колонки) ── */
.catalog__list--grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}
.catalog-item--grid {
  grid-template-columns: 1fr !important;
  flex-direction: column;
}
.catalog-item--grid .catalog-item__img {
  min-height: 180px;
  max-height: 200px;
}
.catalog-item--grid .catalog-item__content {
  padding: 1.1rem;
  gap: 0.45rem;
}
.catalog-item--grid .catalog-item__title { font-size: 0.9rem; }
.catalog-item--grid .catalog-item__desc  { font-size: 0.78rem; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.catalog-item--grid .catalog-item__footer { flex-wrap: nowrap; gap: 0.5rem; }
.catalog-item--grid .catalog-item__btn { font-size: 0.78rem; padding: 0.5rem 0.8rem; flex: 0 0 auto; }

/* ── Compact режим (мелкая плитка 4-5 колонок) ── */
.catalog__list--compact {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
  gap: 0.65rem !important;
}
.catalog-item--compact .catalog-item__img { min-height: 130px; max-height: 150px; }
.catalog-item--compact .catalog-item__content { padding: 0.75rem; gap: 0.3rem; }
.catalog-item--compact .catalog-item__category { font-size: 0.6rem; }
.catalog-item--compact .catalog-item__title { font-size: 0.78rem; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.catalog-item--compact .catalog-item__desc { display: none; }
.catalog-item--compact .catalog-item__price { font-size: 0.85rem; }
.catalog-item--compact .catalog-item__footer { gap: 0.3rem; }
.catalog-item--compact .catalog-item__btn { font-size: 0.72rem; padding: 0.4rem 0.6rem; }
.catalog-item--compact .catalog-item__add { padding: 0.4rem; }

/* ── Кнопка "В список" + тултип ── */
.catalog-item__add {
  position: relative;
}
.catalog-item__add-tip {
  position: absolute;
  bottom: calc(100% + 7px);
  right: 0;
  background: rgba(10,10,10,0.96);
  border: 1px solid rgba(255,255,255,0.08);
  color: #aaa;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.22rem 0.55rem;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(3px);
  transition: opacity 0.15s, transform 0.15s;
}
.catalog-item__add:hover .catalog-item__add-tip { opacity: 1; transform: translateY(0); }
.catalog-item__add.added .catalog-item__add-tip { color: #4ade80; border-color: rgba(74,222,128,0.2); }

/* ── Бейдж "В списке" на фото ── */
.catalog-item__in-list-badge {
  position: absolute;
  top: 8px; left: 8px;
  background: rgba(74,222,128,0.9);
  backdrop-filter: blur(6px);
  color: #000;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  animation: badge-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badge-in {
  from { opacity: 0; transform: scale(0.7) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 640px) {
  .catalog__sort-pills { display: none; }
  .catalog__list--grid { grid-template-columns: repeat(2, 1fr); }
  .catalog__list--compact { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }

  /* Карточки-плитки: цена и кнопка не влезают в одну строку — раскладываем в 2 ряда */
  .catalog-item--grid .catalog-item__footer,
  .catalog-item--compact .catalog-item__footer {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .catalog-item--grid .catalog-item__price-block,
  .catalog-item--compact .catalog-item__price-block {
    flex: 1 0 100%;
    min-width: 0;
  }
  .catalog-item--grid .catalog-item__price,
  .catalog-item--compact .catalog-item__price {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .catalog-item--grid .catalog-item__btn,
  .catalog-item--compact .catalog-item__btn {
    flex: 1 1 auto;
    width: auto;
    text-align: center;
  }
}
</style>
