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
                  placeholder="Найти услугу или товар..."
                  autocomplete="off"
                  @focus="dropVisible = true"
                />
                <button v-if="searchQuery" class="catalog__search-clear" @click="searchQuery = ''; dropVisible = false">✕</button>
              </div>

              <!-- Выпадающие подсказки -->
              <transition name="suggestions">
                <div v-if="dropVisible && suggestions.length > 0" class="catalog__suggestions">
                  <div
                    v-for="item in suggestions"
                    :key="item.id"
                    class="catalog__suggestion-item"
                    @click="selectSuggestion(item)"
                  >
                    <svg class="catalog__suggestion-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M3 16l5-5 4 4 3-3 6 6"/></svg>
                    <span class="catalog__suggestion-info">
                      <span class="catalog__suggestion-title">{{ item.title }}</span>
                      <span class="catalog__suggestion-cat">{{ categoryMap[item.category] }}</span>
                    </span>
                    <span class="catalog__suggestion-price">{{ item.price }}</span>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Фильтр по цене — слайдер -->
            <div class="catalog__hero-price">
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

      <!-- Основная часть: боковая панель + контент -->
      <div class="catalog__layout">

        <!-- Боковая панель -->
        <aside class="catalog__sidebar">
          <div class="catalog__sidebar-title">Товары и услуги</div>
          <ul class="catalog__sidebar-list">
            <li
              v-for="cat in categories"
              :key="cat.id"
              class="catalog__sidebar-item"
              :class="{ active: activeCategory === cat.id }"
              @click="activeCategory = cat.id; searchQuery = ''"
            >
              <span class="catalog__sidebar-label">{{ cat.label }}</span>
              <span v-if="countByCategory(cat.id)" class="catalog__sidebar-count">
                {{ countByCategory(cat.id) }}
              </span>
            </li>
          </ul>

        </aside>

        <!-- Основной контент -->
        <div class="catalog__main">

          <!-- Карточки категорий (только при "Все") -->
          <transition name="fade">
            <div v-if="activeCategory === 'all' && !searchQuery" class="catalog__cats">
              <div
                v-for="cat in categories.filter(c => c.id !== 'all')"
                :key="cat.id"
                class="catalog__cat-card"
                @click="activeCategory = cat.id"
              >
                <div class="catalog__cat-card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path :d="catIconPaths[cat.id] || 'M3 3h18v18H3z'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/>
                  </svg>
                </div>
                <span class="catalog__cat-card-label">{{ cat.label }}</span>
                <span class="catalog__cat-card-count">{{ countByCategory(cat.id) }} позиций</span>
                <svg class="catalog__cat-card-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </transition>

          <!-- Популярные товары (когда выбрано "Все" и нет поиска) -->
          <transition name="fade">
            <div v-if="activeCategory === 'all' && !searchQuery" class="catalog__popular">
              <h3 class="catalog__popular-title">Популярные позиции</h3>
              <div class="catalog__list">
                <div v-for="item in popularItems" :key="item.id" class="catalog-item" @click="navigateTo('/catalog/' + item.id)">
                  <div class="catalog-item__img">
                    <template v-if="item.photos && item.photos.length > 1">
                      <img :src="item.photos[getPhotoIdx(item.id)]" :alt="item.title" />
                      <button class="ci-carousel__prev" @click.stop="prevPhoto(item.id, item.photos.length)">&#8249;</button>
                      <button class="ci-carousel__next" @click.stop="nextPhoto(item.id, item.photos.length)">&#8250;</button>
                      <div class="ci-carousel__dots">
                        <span v-for="(_, i) in item.photos" :key="i" class="ci-carousel__dot" :class="{ active: i === getPhotoIdx(item.id) }" @click.stop="setPhotoIdx(item.id, i)"></span>
                      </div>
                    </template>
                    <img v-else-if="item.photo || item.photos" :src="item.photo || item.photos[0]" :alt="item.title" />
                    <div v-else class="catalog-item__placeholder">
                      <div class="catalog-item__placeholder-empty">
                        <span>{{ item.icon }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="catalog-item__content">
                    <span class="catalog-item__category">{{ categoryMap[item.category] }}</span>
                    <h3 class="catalog-item__title">{{ item.title }}</h3>
                    <p class="catalog-item__desc">{{ item.description }}</p>
                    <div class="catalog-item__footer">
                      <div class="catalog-item__price-block">
                        <span class="catalog-item__price catalog-item__price--ask">Уточнить цену</span>
                      </div>
                      <button class="catalog-item__btn" @click.stop="openOrder(item)">Заявка</button>
                  <button class="catalog-item__add" :class="{ added: hasItem(item.id) }" @click.stop="addItem(item)">
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
              </div>
            </div>
          </transition>

          <!-- Заголовок раздела -->
          <div class="catalog__section-header" v-if="activeCategory !== 'all' || searchQuery">
            <div class="catalog__section-left">
              <h2 class="catalog__section-title">
                {{ searchQuery ? `«${searchQuery}»` : currentCategory?.label }}
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
                <button class="catalog__view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="Список">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                </button>
                <button class="catalog__view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="Сетка">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <button class="catalog__section-reset" @click="activeCategory = 'all'; searchQuery = ''">
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
              <button class="panel-filter-badge__clear" @click="clearPanelFilter">
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
          <div v-if="filteredItems.length > 0 && (activeCategory !== 'all' || searchQuery)" class="catalog__count">
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
            :class="['catalog__list', { 'catalog__list--grid': viewMode === 'grid' }]"
          >
            <div
              v-for="(item, i) in paginatedItems"
              :key="item.id"
              class="catalog-item"
              :class="{ 'catalog-item--grid': viewMode === 'grid' }"
              :style="{ '--stagger': `${Math.min(i % 24, 10) * 45}ms` }"
              @click="navigateTo('/catalog/' + item.id)"
            >
              <div class="catalog-item__img">
                <template v-if="item.photos && item.photos.length > 1">
                  <img :src="item.photos[getPhotoIdx(item.id)]" :alt="item.title" loading="lazy" />
                  <button class="ci-carousel__prev" @click.stop="prevPhoto(item.id, item.photos.length)">&#8249;</button>
                  <button class="ci-carousel__next" @click.stop="nextPhoto(item.id, item.photos.length)">&#8250;</button>
                  <div class="ci-carousel__dots">
                    <span v-for="(_, j) in item.photos" :key="j" class="ci-carousel__dot" :class="{ active: j === getPhotoIdx(item.id) }" @click.stop="setPhotoIdx(item.id, j)"></span>
                  </div>
                </template>
                <img v-else-if="item.photo || item.photos" :src="item.photo || item.photos[0]" :alt="item.title" loading="lazy" />
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
                    <span class="catalog-item__price catalog-item__price--ask">Уточнить цену</span>
                  </div>
                  <button class="catalog-item__btn" @click.stop="openOrder(item)">Заявка</button>
                  <button class="catalog-item__add" :class="{ added: hasItem(item.id) }" @click.stop="addItem(item)">
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
        </div>
      </div>
    </main>

    <!-- Модалка заявки -->
    <transition name="modal">
      <div v-if="orderItem" class="modal-overlay" @click.self="orderItem = null">
        <div class="modal">
          <button class="modal__close" @click="orderItem = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h2 class="modal__title">{{ orderItem.title }}</h2>
          <p class="modal__price modal__price--ask">Уточнить цену</p>

          <form class="modal__form" @submit.prevent="submitOrder">
            <input v-model="orderForm.name" type="text" placeholder="Ваше имя *" class="modal__input" maxlength="100" />
            <input :value="orderForm.phone" @input="orderForm.phone = phoneMask($event.target.value)" type="tel" placeholder="+7 (___) ___-__-__" class="modal__input" maxlength="18" />

            <!-- Чекбокс установки — только для монтируемых категорий -->
            <label v-if="installableCategories.includes(orderItem.category)" class="modal__install">
              <input v-model="orderForm.needInstall" type="checkbox" class="modal__install-checkbox" />
              <span class="modal__install-text">
                <span class="modal__install-label">Нужна установка под ключ</span>
                <span class="modal__install-hint">Наши специалисты выполнят монтаж</span>
              </span>
            </label>

            <textarea v-model="orderForm.message" placeholder="Комментарий — размеры, объём, адрес объекта..." class="modal__input modal__textarea" rows="3" maxlength="500"></textarea>
            <button type="submit" class="modal__submit" :disabled="orderLoading">
              {{ orderLoading ? 'Отправка...' : 'Отправить заявку' }}
            </button>
            <p v-if="orderSuccess" class="modal__success">Заявка отправлена! Мы свяжемся с вами.</p>
          </form>
        </div>
      </div>
    </transition>

    <footer class="footer">
      <div class="footer__inner">
        <p class="footer__name">ДСР — Дальневосточные Системы Развития</p>
        <p class="footer__contacts">
          г. Владивосток, ул. Русская, д. 17, каб. 704 &nbsp;|&nbsp;
          <a href="tel:+79143292929">+7 914 329-29-29</a> &nbsp;|&nbsp;
          <a href="https://e.mail.ru/compose/?to=ooo-dsr@bk.ru" target="_blank" rel="noopener">ooo-dsr@bk.ru</a>
        </p>
        <p class="footer__copy">© {{ new Date().getFullYear() }} ДСР. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import { phoneMask } from '~/composables/usePhoneMask.js'
import { categories, items as staticItems, subcategories } from '~/data/catalog.js'

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

const viewMode = ref('list')
const sortOptions = [
  { value: 'default',   label: 'По умолч.' },
  { value: 'name_asc',  label: 'А–Я' },
  { value: 'name_desc', label: 'Я–А' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc',label: 'Цена ↓' },
]

const { addItem, hasItem } = useCart()

const items = reactive([...staticItems])
const { data: dynamicItemsData, pending: catalogPending } = await useFetch('/data/catalog-items.json', { lazy: true, server: false, default: () => [] })
watch(dynamicItemsData, (val) => { if (val?.length) items.push(...val) }, { immediate: true })

useHead({ title: 'Каталог товаров и услуг — ДСР Владивосток' })
useSeoMeta({
  description: 'Каталог строительных материалов, трубопроводной арматуры, кабелей, металлопроката, септиков и оборудования. ООО ДСР — Владивосток. Более 2300 позиций.',
  ogTitle: 'Каталог товаров — ДСР Владивосток',
  ogDescription: 'Строительные материалы и оборудование. Более 2300 позиций. Доставка по Приморскому краю.',
})

const route = useRoute()
const router = useRouter()
const activeCategory = ref(route.query.cat ? String(route.query.cat) : 'all')
const searchQuery = ref(route.query.search ? String(route.query.search) : '')
const dropVisible = ref(false)
const activeSub = ref(null)
const priceMin = ref(null)
const priceMax = ref(null)
const orderItem = ref(null)
const orderLoading = ref(false)
const orderSuccess = ref(false)
const orderForm = reactive({ name: '', phone: '', message: '', needInstall: false })

const photoIndexes = reactive({})
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
  const q = searchQuery.value.toLowerCase()
  return items
    .filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
    .slice(0, 6)
})

function selectSuggestion(item) {
  searchQuery.value = item.title
  activeCategory.value = 'all'
  dropVisible.value = false
  nextTick(() => {
    document.querySelector('.catalog__main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function closeDropdown() { dropVisible.value = false }

watch(activeCategory, () => {
  activeSub.value = null
  selectedPanelSize.value = null
  selectedPanelColor.value = null
})

watch(searchQuery, (q) => {
  router.replace({ query: { ...route.query, search: q || undefined } })
  if (q.trim()) {
    dropVisible.value = true
    nextTick(() => {
      document.querySelector('.catalog__main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
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

const POPULAR_IDS = [1, 5, 34, 58, 15]
const popularItems = computed(() => items.filter(i => POPULAR_IDS.includes(i.id)))

function countByCategory(catId) {
  if (catId === 'all') return items.length
  return items.filter(i => i.category === catId).length
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
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    )
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
    default: return arr.sort((a, b) => {
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
  sortBy.value = 'default'
})

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
    ? `от ${orderItem.value.basePrice.toLocaleString('ru-RU')} ₽ / ${orderItem.value.unit}`
    : orderItem.value.price

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
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
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 80%);
  padding: 6rem 1.5rem 2.5rem;
  border-bottom: 1px solid #1a1a1a;
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

.catalog__title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #fff; margin-bottom: 1.25rem; }

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
.catalog__suggestion-item:hover { background: rgba(230,184,0,0.08); }

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
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.catalog__sidebar-title {
  padding: 1rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #e6b800;
  background: rgba(230,184,0,0.06);
  border-bottom: 1px solid #1e1e1e;
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
.catalog__sidebar-item:hover { background: rgba(230,184,0,0.06); color: #e6b800; border-left-color: #e6b800; }
.catalog__sidebar-item.active { background: rgba(230,184,0,0.08); color: #e6b800; border-left-color: #e6b800; font-weight: 600; }

.catalog__sidebar-label { flex: 1; line-height: 1.3; }
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

/* Карточки категорий */
.catalog__cats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.catalog__cat-card {
  position: relative;
  overflow: hidden;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  padding: 1.1rem 1.25rem 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.catalog__cat-card-icon {
  width: 38px; height: 38px;
  background: rgba(230,184,0,0.07);
  border: 1px solid rgba(230,184,0,0.14);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: #777;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s, color 0.3s, border-color 0.3s;
}
.catalog__cat-card:hover .catalog__cat-card-icon {
  transform: scale(1.14) rotate(-8deg);
  background: rgba(230,184,0,0.14);
  border-color: rgba(230,184,0,0.3);
  color: #e6b800;
}

.catalog__cat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(230,184,0,0.08) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.catalog__cat-card:hover::before {
  transform: translateX(100%);
}

.catalog__cat-card:hover {
  border-color: rgba(230,184,0,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(230,184,0,0.08);
  transform: translateY(-3px);
}

.catalog__cat-card-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e0e0e0;
  line-height: 1.3;
  flex: 1;
}
.catalog__cat-card:hover .catalog__cat-card-label { color: #fff; }

.catalog__cat-card-count {
  font-size: 0.7rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.catalog__cat-card-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  color: #333;
  transition: transform 0.25s, color 0.25s;
  opacity: 0;
}
.catalog__cat-card:hover .catalog__cat-card-arrow {
  opacity: 1;
  color: #e6b800;
  transform: translateY(-50%) translateX(0);
}

/* Заголовок раздела */
.catalog__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
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
  display: grid;
  grid-template-columns: 280px 1fr;
  background: linear-gradient(145deg, #141410, #111);
  border: 1px solid #1e1e1e;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.catalog-item:hover {
  border-color: rgba(230,184,0,0.45);
  box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(230,184,0,0.07);
  transform: translateY(-2px);
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
  min-height: 200px;
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
  min-height: 200px;
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
.catalog-item__price-block { display: flex; flex-direction: column; gap: 0.1rem; }
.catalog-item__price-label { font-size: 0.68rem; color: #444; text-transform: uppercase; letter-spacing: 0.1em; }
.catalog-item__price { font-size: 1.15rem; font-weight: 700; color: #e6b800; }

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
@media (max-width: 900px) {
  .catalog__layout { grid-template-columns: 1fr; }
  .catalog__sidebar { position: static; display: flex; flex-wrap: wrap; gap: 0; background: none; border: none; border-radius: 0; flex-direction: column; }
  .catalog__sidebar-title { display: none; }
  .catalog__sidebar-list { display: flex; flex-wrap: wrap; padding: 0; gap: 0.4rem; }
  .catalog__sidebar-item { border: 1px solid #1e1e1e; border-radius: 999px; background: #111; padding: 0.45rem 0.9rem; font-size: 0.8rem; }
  .catalog__sidebar-item.active { background: rgba(230,184,0,0.12); }
  .catalog__hero-controls { flex-direction: column; }
  .catalog__hero-price { width: 100%; }
  .catalog__hero-price-inputs { border-radius: 12px; }
  .catalog__cats { grid-template-columns: repeat(2, 1fr); }
  .catalog-item { grid-template-columns: 1fr; }
  .catalog-item__img, .catalog-item__placeholder { min-height: 180px; }
  .catalog-item__content { padding: 1.25rem; }
}

@media (max-width: 480px) {
  .catalog__cats { grid-template-columns: 1fr 1fr; }
  .catalog-item__btn { width: 100%; text-align: center; }
}

/* Модалка */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal { background: #141414; border: 1px solid #2a2412; border-radius: 20px; padding: 2rem; width: 100%; max-width: 460px; position: relative; }
.modal__close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #666; font-size: 1.1rem; cursor: pointer; transition: color 0.2s; }
.modal__close:hover { color: #fff; }
.modal__title { font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.modal__price { color: #e6b800; font-weight: 600; margin-bottom: 1.5rem; }
.modal__form { display: flex; flex-direction: column; gap: 0.85rem; }
.modal__input { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 0.75rem 1rem; color: #fff; font-size: 0.95rem; font-family: inherit; outline: none; transition: border-color 0.2s; }
.modal__input:focus { border-color: #e6b800; }
.modal__input::placeholder { color: #444; }
.modal__textarea { resize: vertical; min-height: 80px; }
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

/* ── Grid режим ── */
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
.catalog-item--grid .catalog-item__btn { font-size: 0.78rem; padding: 0.5rem 0.8rem; flex: 1; }

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
  .catalog__view-toggle { display: none; }
  .catalog__list--grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
