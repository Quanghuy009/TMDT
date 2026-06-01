import { loadAdminLayout } from "../admin-layout.js";

const BANNER_API_URL = "/api/admin/banners";
const HOMEPAGE_PRODUCT_API_URL = "/api/admin/homepage-products";

let banners = [];

const homepageProductSections = {
    featured_products: {
        apiSection: "featured",
        tableBodyId: "featuredProductsTableBody",
        countTextId: "featuredProductsCountText",
        name: "Sản phẩm nổi bật"
    },
    recommended_products: {
        apiSection: "recommended",
        tableBodyId: "recommendedProductsTableBody",
        countTextId: "recommendedProductsCountText",
        name: "Sản phẩm gợi ý"
    },
    best_seller_products: {
        apiSection: "best-seller",
        tableBodyId: "bestSellerProductsTableBody",
        countTextId: "bestSellerProductsCountText",
        name: "Sản phẩm bán chạy"
    }
};

let homepageProducts = {
    featured_products: [],
    recommended_products: [],
    best_seller_products: []
};

document.addEventListener("DOMContentLoaded", async () => {
    await loadAdminLayout();

    setupSectionToggles();
    setupAddButtons();

    await loadBanners();
    await loadAllHomepageProductSections();
});

/* =========================
   SECTION TOGGLE
   Tạm thời chỉ đổi UI.
   Sau này nối homepage_sections.
========================= */

function setupSectionToggles() {
    const toggles = document.querySelectorAll(".section-toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const sectionCode = toggle.dataset.section;

            toggleSectionUI(toggle);

            console.log("Toggle section:", sectionCode);

            // Sau này gọi BE:
            // PATCH /api/admin/homepage-sections/{sectionCode}/toggle
        });
    });
}

function toggleSectionUI(toggle) {
    const circle = toggle.querySelector(".toggle-circle");
    const isActive = toggle.classList.contains("bg-primary-container");

    if (isActive) {
        toggle.classList.remove("bg-primary-container");
        toggle.classList.add("bg-slate-300");

        circle.classList.remove("translate-x-5");
        circle.classList.add("translate-x-1");
    } else {
        toggle.classList.add("bg-primary-container");
        toggle.classList.remove("bg-slate-300");

        circle.classList.add("translate-x-5");
        circle.classList.remove("translate-x-1");
    }
}

/* =========================
   ADD BUTTONS
========================= */

function setupAddButtons() {
    const buttons = document.querySelectorAll(".btn-add-item");

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            const sectionCode = button.dataset.section;

            switch (sectionCode) {
                case "hero_banner":
                    await createBannerByPrompt();
                    break;

                case "flash_sale":
                    alert("Phần Flash Sale sẽ xử lý sau");
                    break;

                case "featured_products":
                case "recommended_products":
                case "best_seller_products":
                    await addHomepageProductByPrompt(sectionCode);
                    break;

                default:
                    alert("Chưa hỗ trợ section này");
            }
        });
    });
}

/* =========================
   BANNER: LOAD + RENDER
========================= */

async function loadBanners() {
    const tableBody = document.getElementById("heroBannerTableBody");
    const countText = document.getElementById("heroBannerCountText");

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-gutter py-6 text-center text-xs text-secondary">
                        Đang tải dữ liệu banner...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(BANNER_API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách banner");
        }

        banners = await response.json();

        renderBanners(banners);
    } catch (error) {
        console.error("Lỗi tải banner:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-gutter py-6 text-center text-xs text-error">
                        Không thể tải dữ liệu banner
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = "Lỗi tải dữ liệu banner";
        }
    }
}

function renderBanners(bannerList) {
    const tableBody = document.getElementById("heroBannerTableBody");
    const countText = document.getElementById("heroBannerCountText");

    if (!tableBody) return;

    if (!bannerList || bannerList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-gutter py-6 text-center text-xs text-secondary">
                    Chưa có banner nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Chưa có banner nào";
        }

        return;
    }

    tableBody.innerHTML = bannerList.map((banner, index) => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-3">
                <img class="w-28 h-14 rounded-lg object-cover bg-surface-container"
                     src="/images/banners/${escapeHtml(banner.image || "default-banner.jpg")}"
                     alt="${escapeHtml(banner.title || "Banner")}"
                     onerror="this.src='/images/banners/default-banner.jpg'"/>
            </td>

            <td class="px-gutter py-3">
                <div class="flex flex-col">
                    <span class="text-xs font-semibold text-on-surface">
                        ${escapeHtml(banner.title || "Chưa có tiêu đề")}
                    </span>
                    <span class="text-[11px] text-secondary">
                        ID: ${banner.id}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-3 text-xs text-secondary">
                /images/banners/${escapeHtml(banner.image)}
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${index + 1}
            </td>

            <td class="px-gutter py-3">
                ${renderStatusBadge(banner.active)}
            </td>

            <td class="px-gutter py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Sửa banner"
                        onclick="editBanner(${banner.id})">
                        <span class="material-symbols-outlined text-[17px]">edit</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="${banner.active ? "Ẩn banner" : "Hiện banner"}"
                        onclick="toggleBanner(${banner.id})">
                        <span class="material-symbols-outlined text-[17px]">
                            ${banner.active ? "visibility_off" : "visibility"}
                        </span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-error-container transition-colors text-error"
                        title="Xóa banner"
                        onclick="deleteBanner(${banner.id})">
                        <span class="material-symbols-outlined text-[17px]">delete</span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${bannerList.length} banner`;
    }
}

async function createBannerByPrompt() {
    const title = prompt("Nhập tiêu đề banner:");

    if (title === null) return;

    const image = prompt("Nhập tên file ảnh banner, ví dụ: banner-sale.jpg");

    if (image === null) return;

    if (!image.trim()) {
        alert("Tên file ảnh không được để trống");
        return;
    }

    const payload = {
        title: title.trim(),
        image: image.trim(),
        active: true
    };

    try {
        const response = await fetch(BANNER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Thêm banner thất bại");
        }

        alert("Thêm banner thành công");

        await loadBanners();
    } catch (error) {
        console.error("Lỗi thêm banner:", error);
        alert(error.message || "Thêm banner thất bại");
    }
}

window.editBanner = async function (bannerId) {
    const banner = banners.find(item => Number(item.id) === Number(bannerId));

    if (!banner) {
        alert("Không tìm thấy banner");
        return;
    }

    const newTitle = prompt("Sửa tiêu đề banner:", banner.title || "");

    if (newTitle === null) return;

    const newImage = prompt("Sửa tên file ảnh:", banner.image || "");

    if (newImage === null) return;

    if (!newImage.trim()) {
        alert("Tên file ảnh không được để trống");
        return;
    }

    const payload = {
        title: newTitle.trim(),
        image: newImage.trim(),
        active: banner.active
    };

    try {
        const response = await fetch(`${BANNER_API_URL}/${bannerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Cập nhật banner thất bại");
        }

        alert("Cập nhật banner thành công");

        await loadBanners();
    } catch (error) {
        console.error("Lỗi cập nhật banner:", error);
        alert(error.message || "Cập nhật banner thất bại");
    }
};

window.toggleBanner = async function (bannerId) {
    const banner = banners.find(item => Number(item.id) === Number(bannerId));

    if (!banner) return;

    const actionText = banner.active ? "ẩn" : "hiển thị";

    if (!confirm(`Bạn có chắc muốn ${actionText} banner này không?`)) {
        return;
    }

    try {
        const response = await fetch(`${BANNER_API_URL}/${bannerId}/toggle`, {
            method: "PATCH"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Cập nhật trạng thái banner thất bại");
        }

        await loadBanners();
    } catch (error) {
        console.error("Lỗi bật/tắt banner:", error);
        alert(error.message || "Cập nhật trạng thái banner thất bại");
    }
};

window.deleteBanner = async function (bannerId) {
    const banner = banners.find(item => Number(item.id) === Number(bannerId));

    if (!banner) return;

    if (!confirm(`Bạn có chắc muốn xóa banner "${banner.title || banner.image}" không?`)) {
        return;
    }

    try {
        const response = await fetch(`${BANNER_API_URL}/${bannerId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Xóa banner thất bại");
        }

        alert("Xóa banner thành công");

        await loadBanners();
    } catch (error) {
        console.error("Lỗi xóa banner:", error);
        alert(error.message || "Xóa banner thất bại");
    }
};

/* =========================
   HOMEPAGE PRODUCTS:
   FEATURED / RECOMMENDED / BEST SELLER
========================= */

async function loadAllHomepageProductSections() {
    await Promise.all([
        loadHomepageProducts("featured_products"),
        loadHomepageProducts("recommended_products"),
        loadHomepageProducts("best_seller_products")
    ]);
}

async function loadHomepageProducts(sectionCode) {
    const config = homepageProductSections[sectionCode];

    if (!config) return;

    const tableBody = document.getElementById(config.tableBodyId);
    const countText = document.getElementById(config.countTextId);

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                        Đang tải dữ liệu ${config.name.toLowerCase()}...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(`${HOMEPAGE_PRODUCT_API_URL}/${config.apiSection}`);

        if (!response.ok) {
            throw new Error(`Không thể tải ${config.name.toLowerCase()}`);
        }

        homepageProducts[sectionCode] = await response.json();

        renderHomepageProducts(sectionCode);
    } catch (error) {
        console.error(`Lỗi tải ${config.name}:`, error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-gutter py-6 text-center text-xs text-error">
                        Không thể tải dữ liệu ${config.name.toLowerCase()}
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = `Lỗi tải dữ liệu ${config.name.toLowerCase()}`;
        }
    }
}

function renderHomepageProducts(sectionCode) {
    const config = homepageProductSections[sectionCode];

    if (!config) return;

    const tableBody = document.getElementById(config.tableBodyId);
    const countText = document.getElementById(config.countTextId);
    const items = homepageProducts[sectionCode] || [];

    if (!tableBody) return;

    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                    Chưa có ${config.name.toLowerCase()} nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = `Chưa có ${config.name.toLowerCase()} nào`;
        }

        return;
    }

    tableBody.innerHTML = items.map((item, index) => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-3">
                <div class="flex items-center gap-3 min-w-[240px]">
                    <img class="w-12 h-12 rounded-lg object-cover bg-surface-container"
                         src="/images/products/${escapeHtml(item.image || "default.jpg")}"
                         alt="${escapeHtml(item.productName)}"
                         onerror="this.src='/images/products/default.jpg'"/>

                    <div class="flex flex-col min-w-0">
                        <span class="text-xs font-semibold text-on-surface truncate">
                            ${escapeHtml(item.productName)}
                        </span>
                        <span class="text-[11px] text-secondary">
                            ID sản phẩm: ${item.productId}
                        </span>
                    </div>
                </div>
            </td>

            <td class="px-gutter py-3 text-xs text-secondary">
                ${escapeHtml(item.categoryName || "Chưa có")}
            </td>

            <td class="px-gutter py-3 text-xs text-secondary">
                ${escapeHtml(item.brandName || "Chưa có")}
            </td>

            <td class="px-gutter py-3 text-xs font-semibold text-on-surface whitespace-nowrap">
                ${formatCurrency(item.price)}
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${index + 1}
            </td>

            <td class="px-gutter py-3">
                ${renderStatusBadge(true)}
            </td>

            <td class="px-gutter py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Sửa sản phẩm trong section"
                        onclick="editHomepageProduct('${sectionCode}', ${item.id})">
                        <span class="material-symbols-outlined text-[17px]">edit</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-error-container transition-colors text-error"
                        title="Xóa khỏi section"
                        onclick="deleteHomepageProduct('${sectionCode}', ${item.id})">
                        <span class="material-symbols-outlined text-[17px]">delete</span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${items.length} ${config.name.toLowerCase()}`;
    }
}

async function addHomepageProductByPrompt(sectionCode) {
    const config = homepageProductSections[sectionCode];

    if (!config) return;

    const productIdInput = prompt(`Nhập ID sản phẩm muốn thêm vào mục "${config.name}":`);

    if (productIdInput === null) return;

    const productId = Number(productIdInput);

    if (!Number.isInteger(productId) || productId <= 0) {
        alert("ID sản phẩm không hợp lệ");
        return;
    }

    try {
        const response = await fetch(`${HOMEPAGE_PRODUCT_API_URL}/${config.apiSection}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `Thêm ${config.name.toLowerCase()} thất bại`);
        }

        alert(`Thêm ${config.name.toLowerCase()} thành công`);

        await loadHomepageProducts(sectionCode);
    } catch (error) {
        console.error(`Lỗi thêm ${config.name}:`, error);
        alert(error.message || `Thêm ${config.name.toLowerCase()} thất bại`);
    }
}

window.editHomepageProduct = async function (sectionCode, itemId) {
    const config = homepageProductSections[sectionCode];

    if (!config) return;

    const items = homepageProducts[sectionCode] || [];
    const item = items.find(product => Number(product.id) === Number(itemId));

    if (!item) {
        alert("Không tìm thấy sản phẩm trong section");
        return;
    }

    const productIdInput = prompt(
        `Nhập ID sản phẩm mới để thay thế trong mục "${config.name}":`,
        item.productId
    );

    if (productIdInput === null) return;

    const productId = Number(productIdInput);

    if (!Number.isInteger(productId) || productId <= 0) {
        alert("ID sản phẩm không hợp lệ");
        return;
    }

    try {
        const response = await fetch(`${HOMEPAGE_PRODUCT_API_URL}/${config.apiSection}/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `Cập nhật ${config.name.toLowerCase()} thất bại`);
        }

        alert(`Cập nhật ${config.name.toLowerCase()} thành công`);

        await loadHomepageProducts(sectionCode);
    } catch (error) {
        console.error(`Lỗi cập nhật ${config.name}:`, error);
        alert(error.message || `Cập nhật ${config.name.toLowerCase()} thất bại`);
    }
};

window.deleteHomepageProduct = async function (sectionCode, itemId) {
    const config = homepageProductSections[sectionCode];

    if (!config) return;

    const items = homepageProducts[sectionCode] || [];
    const item = items.find(product => Number(product.id) === Number(itemId));

    if (!item) return;

    if (!confirm(`Bạn có chắc muốn xóa "${item.productName}" khỏi mục "${config.name}" không?`)) {
        return;
    }

    try {
        const response = await fetch(`${HOMEPAGE_PRODUCT_API_URL}/${config.apiSection}/${itemId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `Xóa ${config.name.toLowerCase()} thất bại`);
        }

        alert(`Xóa khỏi mục "${config.name}" thành công`);

        await loadHomepageProducts(sectionCode);
    } catch (error) {
        console.error(`Lỗi xóa ${config.name}:`, error);
        alert(error.message || `Xóa ${config.name.toLowerCase()} thất bại`);
    }
};

/* =========================
   UTILS
========================= */

function renderStatusBadge(active) {
    if (active) {
        return `
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                Đang hiển thị
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-error-container text-error">
            Đang ẩn
        </span>
    `;
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "0 ₫";
    }

    return Number(value).toLocaleString("vi-VN") + " ₫";
}

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}