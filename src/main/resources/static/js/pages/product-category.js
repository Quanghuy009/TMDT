import {
    loadFragment,
    activeHeaderMenu
} from "../components/layout.js";

import {
    CATEGORY_FILTER_CONFIG
} from "../config/category-filter-config.js";

import {
    renderFilterBar
} from "../components/filter-bar.js";

import {
    renderSortBar
} from "../components/sort-bar.js";

import {
    renderProductCard
} from "../components/product-card.js";

import {
    getCategoryProducts
} from "../api/product-category-api.js";

const DEFAULT_TYPE = "phone";
const DEFAULT_SORT = "newest";
const LOAD_MORE_STEP = 12;

const state = {
    type: DEFAULT_TYPE,
    filters: {},
    sort: DEFAULT_SORT,

    allProducts: [],
    filteredProducts: [],
    sortedProducts: [],

    visibleCount: LOAD_MORE_STEP,
    loadMoreStep: LOAD_MORE_STEP
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadFragment("#header", "/fragments/header.html");
        await loadFragment("#footer", "/fragments/footer.html");

        activeHeaderMenu();

        initStateFromUrl();
        normalizeUrlFromState();

        renderCategoryPage();

        await loadProductsByCategory();

    } catch (error) {
        console.error("Lỗi khởi tạo trang category:", error);
        showProductError();
    }
});

function initStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    state.type = params.get("type") || DEFAULT_TYPE;
    state.sort = params.get("sort") || DEFAULT_SORT;
    state.filters = {};

    const ignoredKeys = ["type", "sort"];

    params.forEach((value, key) => {
        if (!ignoredKeys.includes(key) && value) {
            state.filters[key] = value;
        }
    });
}

function normalizeUrlFromState() {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    if (!params.has("type")) {
        params.set("type", state.type);
        changed = true;
    }

    if (!params.has("sort")) {
        params.set("sort", state.sort);
        changed = true;
    }

    if (changed) {
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }
}

function renderCategoryPage() {
    const config = CATEGORY_FILTER_CONFIG[state.type];

    if (!config) {
        showInvalidCategory();
        return;
    }

    const titleEl = document.getElementById("category-title");
    const descriptionEl = document.getElementById("category-description");

    if (titleEl) {
        titleEl.textContent = config.title;
    }

    if (descriptionEl) {
        descriptionEl.textContent = config.description || "";
    }

    renderFilterBar({
        containerId: "filter-bar",
        filters: getFiltersByCurrentCategory(),
        selectedFilters: state.filters,
        onFilterChange: handleFilterChange,
        onApply: applyFilters,
        onClear: clearFilters
    });

    renderSortBar({
        containerId: "sort-bar",
        currentSort: state.sort,
        shown: 0,
        total: 0,
        onSortChange: handleSortChange
    });
}

async function loadProductsByCategory() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = `
        <div class="col-span-full text-center py-12 text-secondary">
            Đang tải sản phẩm...
        </div>
    `;

    try {
        const data = await getCategoryProducts(state.type);

        state.allProducts = normalizeProductList(data);

        state.visibleCount = state.loadMoreStep;

        applyFilterAndSort();

        renderProducts();

    } catch (error) {
        console.error("Lỗi tải sản phẩm theo category:", error);
        showProductError();
    }
}

function getFiltersByCurrentCategory() {
    const config = CATEGORY_FILTER_CONFIG[state.type];

    if (!config) return [];

    if (state.type !== "accessory") {
        return config.filters || [];
    }

    const baseFilters = config.filters || [];
    const selectedSubType = state.filters.subType;

    if (!selectedSubType) {
        return baseFilters;
    }

    const dynamicFilters = config.subTypeFilters?.[selectedSubType] || [];

    return [
        ...baseFilters,
        ...dynamicFilters
    ];
}

function applyFilterAndSort() {
    let result = [...state.allProducts];

    result = filterProducts(result);
    result = sortProducts(result);

    state.filteredProducts = result;
    state.sortedProducts = result;
}

function filterProducts(products) {
    return products.filter(product => {
        return Object.entries(state.filters).every(([key, value]) => {
            if (!value) return true;

            if (key === "price") {
                return matchPriceRange(product, value);
            }

            const productValue = getProductFieldValue(product, key);

            if (productValue === undefined || productValue === null) {
                return false;
            }

            return String(productValue)
                .toLowerCase()
                .includes(String(value).toLowerCase());
        });
    });
}

function getProductFieldValue(product, key) {
    return product[key];
}

function matchPriceRange(product, rangeValue) {
    const price = getDisplayPrice(product);

    const [minRaw, maxRaw] = String(rangeValue).split("-");

    const min = minRaw ? Number(minRaw) : 0;
    const max = maxRaw ? Number(maxRaw) : Infinity;

    return price >= min && price <= max;
}

function sortProducts(products) {
    const copied = [...products];

    switch (state.sort) {
        case "price_asc":
            return copied.sort((a, b) => {
                return getDisplayPrice(a) - getDisplayPrice(b);
            });

        case "price_desc":
            return copied.sort((a, b) => {
                return getDisplayPrice(b) - getDisplayPrice(a);
            });

        case "sale":
            return copied.sort((a, b) => {
                const aSale = a.onSale ? 1 : 0;
                const bSale = b.onSale ? 1 : 0;

                if (bSale !== aSale) {
                    return bSale - aSale;
                }

                return getDiscountPercent(b) - getDiscountPercent(a);
            });

        case "newest":
        default:
            return copied.sort((a, b) => {
                return getCreatedTime(b) - getCreatedTime(a);
            });
    }
}

function getDisplayPrice(product) {
    if (product.onSale && product.salePrice) {
        return Number(product.salePrice);
    }

    return Number(product.price);
}

function getDiscountPercent(product) {
    return Number(product.discountPercent || 0);
}

function getCreatedTime(product) {
    if (!product.createdAt) return 0;

    return new Date(product.createdAt).getTime();
}

function renderProducts() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    const visibleProducts = state.sortedProducts.slice(0, state.visibleCount);

    if (visibleProducts.length === 0) {
        productList.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                Không có sản phẩm phù hợp.
            </div>
        `;

        updateProductCount(0, state.sortedProducts.length);
        renderLoadMoreButton();
        return;
    }

    productList.innerHTML = visibleProducts
        .map(product => renderProductCard(product))
        .join("");

    updateProductCount(
        visibleProducts.length,
        state.sortedProducts.length
    );

    renderLoadMoreButton();
}

function renderLoadMoreButton() {
    const container = document.getElementById("pagination");
    if (!container) return;

    const hasMore = state.visibleCount < state.sortedProducts.length;

    if (!hasMore) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div class="flex justify-center mt-10">
            <button id="load-more-btn"
                class="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Xem thêm
            </button>
        </div>
    `;

    const loadMoreBtn = document.getElementById("load-more-btn");

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            state.visibleCount += state.loadMoreStep;
            renderProducts();
        });
    }
}

function handleFilterChange(key, value) {
    if (state.type === "accessory" && key === "subType") {
        state.filters = {
            subType: value
        };
    } else {
        state.filters[key] = value;
    }

    rerenderFilterBarOnly();
}

function applyFilters() {
    state.visibleCount = state.loadMoreStep;

    updateUrlFromState();

    applyFilterAndSort();

    renderProducts();
}

function clearFilters() {
    state.filters = {};
    state.visibleCount = state.loadMoreStep;

    updateUrlFromState();

    renderCategoryPage();

    applyFilterAndSort();

    renderProducts();
}

function handleSortChange(sortValue) {
    state.sort = sortValue;
    state.visibleCount = state.loadMoreStep;

    updateUrlFromState();

    applyFilterAndSort();

    rerenderSortBarOnly();

    renderProducts();
}

function rerenderFilterBarOnly() {
    const config = CATEGORY_FILTER_CONFIG[state.type];

    if (!config) return;

    renderFilterBar({
        containerId: "filter-bar",
        filters: getFiltersByCurrentCategory(),
        selectedFilters: state.filters,
        onFilterChange: handleFilterChange,
        onApply: applyFilters,
        onClear: clearFilters
    });
}

function rerenderSortBarOnly() {
    const shown = Math.min(state.visibleCount, state.sortedProducts.length);
    const total = state.sortedProducts.length;

    renderSortBar({
        containerId: "sort-bar",
        currentSort: state.sort,
        shown,
        total,
        onSortChange: handleSortChange
    });
}

function updateUrlFromState() {
    const params = new URLSearchParams();

    params.set("type", state.type);
    params.set("sort", state.sort);

    Object.entries(state.filters).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
}

function normalizeProductList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.content)) {
        return data.content;
    }

    if (data && Array.isArray(data.products)) {
        return data.products;
    }

    return [];
}

function updateProductCount(shown, total) {
    const shownEl = document.getElementById("shown-count");
    const totalEl = document.getElementById("total-count");

    if (shownEl) {
        shownEl.textContent = shown;
    }

    if (totalEl) {
        totalEl.textContent = total;
    }
}

function showInvalidCategory() {
    const titleEl = document.getElementById("category-title");
    const descriptionEl = document.getElementById("category-description");
    const filterBar = document.getElementById("filter-bar");
    const sortBar = document.getElementById("sort-bar");
    const productList = document.getElementById("product-list");

    if (titleEl) {
        titleEl.textContent = "Danh mục không tồn tại";
    }

    if (descriptionEl) {
        descriptionEl.textContent = "";
    }

    if (filterBar) {
        filterBar.innerHTML = "";
    }

    if (sortBar) {
        sortBar.innerHTML = "";
    }

    if (productList) {
        productList.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                Không tìm thấy danh mục sản phẩm phù hợp.
            </div>
        `;
    }
}

function showProductError() {
    const productList = document.getElementById("product-list");

    if (productList) {
        productList.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500">
                Không thể tải danh sách sản phẩm.
            </div>
        `;
    }

    updateProductCount(0, 0);

    const pagination = document.getElementById("pagination");
    if (pagination) {
        pagination.innerHTML = "";
    }
}