import { loadAdminLayout } from "../admin-layout.js";

import {
    getAdminFlashSales,
    getAdminFlashSaleDetail,
    createAdminFlashSale,
    updateAdminFlashSale,
    deleteAdminFlashSale,
    addAdminFlashSaleItem,
    updateAdminFlashSaleItem,
    deleteAdminFlashSaleItem,
    getAdminProductsForFlashSale
} from "/js/admin/api/admin-flash-sale-api.js";

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

let flashSales = [];
let currentFlashSaleDetail = null;
let adminProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadAdminLayout();

    setupSectionToggles();
    setupAddButtons();
    setupBannerEvents();
    setupFlashSaleEvents();

    await loadBanners();
    await loadFlashSales();
    await loadAllHomepageProductSections();
});

/* =========================
   SECTION TOGGLE
   Tạm thời chỉ đổi UI.
   Sau này nối homepage_sections.
========================= */

const HOMEPAGE_SECTION_API_URL = "/api/admin/homepage-sections";

async function setupSectionToggles() {
    await loadSectionToggleStatus();

    const toggles = document.querySelectorAll(".section-toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", async () => {
            const sectionCode = toggle.dataset.section;

            try {
                const response = await fetch(`${HOMEPAGE_SECTION_API_URL}/${sectionCode}/toggle`, {
                    method: "PATCH"
                });

                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(message || "Không thể cập nhật trạng thái section");
                }

                const updatedSection = await response.json();

                setToggleUI(toggle, updatedSection.active);
            } catch (error) {
                console.error("Lỗi bật/tắt section:", error);
                alert(error.message || "Không thể cập nhật trạng thái section");
            }
        });
    });
}

async function loadSectionToggleStatus() {
    try {
        const response = await fetch(HOMEPAGE_SECTION_API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải trạng thái section");
        }

        const sections = await response.json();

        sections.forEach(section => {
            const toggle = document.querySelector(`.section-toggle[data-section="${section.code}"]`);

            if (toggle) {
                setToggleUI(toggle, section.active);
            }
        });
    } catch (error) {
        console.error("Lỗi tải trạng thái section:", error);
    }
}

function setToggleUI(toggle, active) {
    const circle = toggle.querySelector(".toggle-circle");

    if (!circle) return;

    if (active) {
        toggle.classList.add("bg-primary-container");
        toggle.classList.remove("bg-slate-300");

        circle.classList.add("translate-x-5");
        circle.classList.remove("translate-x-1");
    } else {
        toggle.classList.remove("bg-primary-container");
        toggle.classList.add("bg-slate-300");

        circle.classList.remove("translate-x-5");
        circle.classList.add("translate-x-1");
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
                    openBannerModal();
                    break;

                case "flash_sale":
                    openFlashSaleProgramModal();
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
                ${renderVisibleStatusBadge(banner.active)}
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

function setupBannerEvents() {
    document.getElementById("btnCloseBannerModal")?.addEventListener("click", closeBannerModal);
    document.getElementById("btnCancelBanner")?.addEventListener("click", closeBannerModal);
    document.getElementById("bannerForm")?.addEventListener("submit", handleSubmitBanner);
    document.getElementById("bannerImageInput")?.addEventListener("change", previewBannerImage);
}

function openBannerModal(banner = null) {
    const modal = document.getElementById("bannerModal");
    const title = document.getElementById("bannerModalTitle");
    const currentImageText = document.getElementById("bannerCurrentImageText");
    const imageInput = document.getElementById("bannerImageInput");
    const previewWrapper = document.getElementById("bannerPreviewWrapper");
    const previewImage = document.getElementById("bannerPreviewImage");

    document.getElementById("bannerIdInput").value = banner?.id ?? "";
    document.getElementById("bannerTitleInput").value = banner?.title ?? "";
    document.getElementById("bannerActiveInput").checked = banner ? Boolean(banner.active) : true;

    if (imageInput) {
        imageInput.value = "";
    }

    if (title) {
        title.textContent = banner ? "Cập nhật banner" : "Thêm banner";
    }

    if (currentImageText) {
        currentImageText.textContent = banner?.image
            ? `Ảnh hiện tại: ${banner.image}`
            : "Vui lòng chọn ảnh banner.";
    }

    if (previewWrapper && previewImage) {
        if (banner?.image) {
            previewWrapper.classList.remove("hidden");
            previewImage.src = `/images/banners/${banner.image}`;
        } else {
            previewWrapper.classList.add("hidden");
            previewImage.src = "";
        }
    }

    showModal(modal);
}

function closeBannerModal() {
    hideModal(document.getElementById("bannerModal"));
}

function previewBannerImage() {
    const imageInput = document.getElementById("bannerImageInput");
    const previewWrapper = document.getElementById("bannerPreviewWrapper");
    const previewImage = document.getElementById("bannerPreviewImage");

    if (!imageInput || !previewWrapper || !previewImage) return;

    const file = imageInput.files?.[0];

    if (!file) {
        previewWrapper.classList.add("hidden");
        previewImage.src = "";
        return;
    }

    previewWrapper.classList.remove("hidden");
    previewImage.src = URL.createObjectURL(file);
}

async function handleSubmitBanner(event) {
    event.preventDefault();

    const id = document.getElementById("bannerIdInput").value;
    const title = document.getElementById("bannerTitleInput").value.trim();
    const active = document.getElementById("bannerActiveInput").checked;
    const imageFile = document.getElementById("bannerImageInput").files?.[0];

    if (!id && !imageFile) {
        alert("Vui lòng chọn ảnh banner");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("active", active);

    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    try {
        const url = id ? `${BANNER_API_URL}/${id}` : BANNER_API_URL;
        const method = id ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            body: formData
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Lưu banner thất bại");
        }

        alert(id ? "Cập nhật banner thành công" : "Thêm banner thành công");

        closeBannerModal();
        await loadBanners();
    } catch (error) {
        console.error("Lỗi lưu banner:", error);
        alert(error.message || "Lưu banner thất bại");
    }
}
window.editBanner = function (bannerId) {
    const banner = banners.find(item => Number(item.id) === Number(bannerId));

    if (!banner) {
        alert("Không tìm thấy banner");
        return;
    }

    openBannerModal(banner);
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
   FLASH SALE
========================= */

function setupFlashSaleEvents() {
    document.getElementById("btnCloseFlashSaleProgramModal")?.addEventListener("click", closeFlashSaleProgramModal);
    document.getElementById("btnCancelFlashSaleProgram")?.addEventListener("click", closeFlashSaleProgramModal);
    document.getElementById("flashSaleProgramForm")?.addEventListener("submit", handleSubmitFlashSaleProgram);

    document.getElementById("btnCloseFlashSaleDetailModal")?.addEventListener("click", closeFlashSaleDetailModal);

    document.getElementById("btnOpenAddFlashSaleItemModal")?.addEventListener("click", async () => {
        if (!currentFlashSaleDetail) {
            alert("Không xác định được chương trình Flash Sale");
            return;
        }

        await openFlashSaleItemModal({
            flashSaleId: currentFlashSaleDetail.id
        });
    });

    document.getElementById("btnCloseFlashSaleItemModal")?.addEventListener("click", closeFlashSaleItemModal);
    document.getElementById("btnCancelFlashSaleItem")?.addEventListener("click", closeFlashSaleItemModal);
    document.getElementById("flashSaleItemForm")?.addEventListener("submit", handleSubmitFlashSaleItem);
    document.getElementById("flashSaleProductSelect")?.addEventListener("change", renderSelectedProductPrice);
}

async function loadFlashSales() {
    const tableBody = document.getElementById("flashSaleTableBody");
    const countText = document.getElementById("flashSaleCountText");

    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="px-gutter py-6 text-center text-xs text-secondary">
                Đang tải danh sách Flash Sale...
            </td>
        </tr>
    `;

    try {
        flashSales = await getAdminFlashSales();
        renderFlashSaleTable(flashSales);

        if (countText) {
            countText.textContent = `Có ${flashSales.length} chương trình Flash Sale`;
        }
    } catch (error) {
        console.error("Lỗi tải Flash Sale:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-gutter py-6 text-center text-xs text-error">
                    ${escapeHtml(error.message || "Không thể tải dữ liệu Flash Sale")}
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Không thể tải dữ liệu Flash Sale";
        }
    }
}

function renderFlashSaleTable(data) {
    const tableBody = document.getElementById("flashSaleTableBody");

    if (!tableBody) return;

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-gutter py-6 text-center text-xs text-secondary">
                    Chưa có chương trình Flash Sale nào.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map((sale) => `
        <tr class="hover:bg-surface-container-low transition-colors">
            <td class="px-gutter py-4">
                <div>
                    <p class="text-sm font-bold text-on-surface">
                        ${escapeHtml(sale.name)}
                    </p>
                    <p class="text-xs text-secondary mt-1">
                        ID: ${sale.id} • Priority: ${sale.priority ?? 0}
                    </p>
                </div>
            </td>

            <td class="px-gutter py-4">
                <div class="text-xs text-secondary">
                    <p><span class="font-semibold">Bắt đầu:</span> ${formatDateTime(sale.startTime)}</p>
                    <p class="mt-1"><span class="font-semibold">Kết thúc:</span> ${formatDateTime(sale.endTime)}</p>
                </div>
            </td>

            <td class="px-gutter py-4">
                <span class="inline-flex items-center rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface">
                    ${sale.itemCount ?? 0} sản phẩm
                </span>
            </td>

            <td class="px-gutter py-4">
                <div class="flex flex-col gap-1">
                    ${renderFlashSaleStatusBadge(sale.status)}
                    <span class="text-[11px] text-secondary">
                        ${sale.active ? "Active: Bật" : "Active: Tắt"}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-4 text-right">
                <div class="flex justify-end gap-2">
                    <button class="btn-view-flash-sale px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container text-on-surface hover:opacity-80"
                            data-id="${sale.id}">
                        Chi tiết
                    </button>

                    <button class="btn-edit-flash-sale px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:opacity-80"
                            data-id="${sale.id}">
                        Sửa
                    </button>

                    <button class="btn-delete-flash-sale px-3 py-1.5 rounded-lg text-xs font-semibold bg-error-container text-error hover:opacity-80"
                            data-id="${sale.id}">
                        Xóa
                    </button>
                </div>
            </td>
        </tr>
    `).join("");

    tableBody.querySelectorAll(".btn-view-flash-sale").forEach((button) => {
        button.addEventListener("click", async () => {
            await openFlashSaleDetailModal(Number(button.dataset.id));
        });
    });

    tableBody.querySelectorAll(".btn-edit-flash-sale").forEach((button) => {
        button.addEventListener("click", () => {
            const sale = flashSales.find((item) => Number(item.id) === Number(button.dataset.id));
            openFlashSaleProgramModal(sale);
        });
    });

    tableBody.querySelectorAll(".btn-delete-flash-sale").forEach((button) => {
        button.addEventListener("click", async () => {
            await handleDeleteFlashSale(Number(button.dataset.id));
        });
    });
}

function openFlashSaleProgramModal(sale = null) {
    const modal = document.getElementById("flashSaleProgramModal");
    const title = document.getElementById("flashSaleProgramModalTitle");

    document.getElementById("flashSaleIdInput").value = sale?.id ?? "";
    document.getElementById("flashSaleNameInput").value = sale?.name ?? "";
    document.getElementById("flashSaleStartTimeInput").value = toDateTimeLocalValue(sale?.startTime);
    document.getElementById("flashSaleEndTimeInput").value = toDateTimeLocalValue(sale?.endTime);
    document.getElementById("flashSalePriorityInput").value = sale?.priority ?? 0;
    document.getElementById("flashSaleActiveInput").checked = Boolean(sale?.active);

    if (title) {
        title.textContent = sale ? "Cập nhật chương trình Flash Sale" : "Thêm chương trình Flash Sale";
    }

    showModal(modal);
}

function closeFlashSaleProgramModal() {
    hideModal(document.getElementById("flashSaleProgramModal"));
}

async function handleSubmitFlashSaleProgram(event) {
    event.preventDefault();

    const id = document.getElementById("flashSaleIdInput").value;

    const payload = {
        name: document.getElementById("flashSaleNameInput").value.trim(),
        startTime: document.getElementById("flashSaleStartTimeInput").value,
        endTime: document.getElementById("flashSaleEndTimeInput").value,
        active: document.getElementById("flashSaleActiveInput").checked,
        priority: Number(document.getElementById("flashSalePriorityInput").value || 0)
    };

    if (!payload.name) {
        alert("Vui lòng nhập tên chương trình Flash Sale");
        return;
    }

    if (!payload.startTime || !payload.endTime) {
        alert("Vui lòng nhập thời gian bắt đầu và kết thúc");
        return;
    }

    if (new Date(payload.startTime) >= new Date(payload.endTime)) {
        alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
        return;
    }

    try {
        if (id) {
            await updateAdminFlashSale(id, payload);
            alert("Cập nhật chương trình Flash Sale thành công");
        } else {
            await createAdminFlashSale(payload);
            alert("Thêm chương trình Flash Sale thành công");
        }

        closeFlashSaleProgramModal();
        await loadFlashSales();
    } catch (error) {
        console.error("Lỗi lưu Flash Sale:", error);
        alert(error.message || "Có lỗi xảy ra khi lưu chương trình Flash Sale");
    }
}

async function handleDeleteFlashSale(id) {
    const confirmed = confirm("Bạn có chắc muốn xóa chương trình Flash Sale này không?");

    if (!confirmed) return;

    try {
        await deleteAdminFlashSale(id);
        alert("Xóa chương trình Flash Sale thành công");
        await loadFlashSales();
    } catch (error) {
        console.error("Lỗi xóa Flash Sale:", error);
        alert(error.message || "Không thể xóa chương trình Flash Sale");
    }
}

async function openFlashSaleDetailModal(id) {
    const modal = document.getElementById("flashSaleDetailModal");
    const title = document.getElementById("flashSaleDetailTitle");
    const meta = document.getElementById("flashSaleDetailMeta");
    const tableBody = document.getElementById("flashSaleItemTableBody");

    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                    Đang tải sản phẩm trong Flash Sale...
                </td>
            </tr>
        `;
    }

    showModal(modal);

    try {
        currentFlashSaleDetail = await getAdminFlashSaleDetail(id);

        if (title) {
            title.textContent = currentFlashSaleDetail.name;
        }

        if (meta) {
            meta.textContent = `${formatDateTime(currentFlashSaleDetail.startTime)} - ${formatDateTime(currentFlashSaleDetail.endTime)} • ${currentFlashSaleDetail.status}`;
        }

        renderFlashSaleItems(currentFlashSaleDetail.items || []);
    } catch (error) {
        console.error("Lỗi tải chi tiết Flash Sale:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-gutter py-6 text-center text-xs text-error">
                        ${escapeHtml(error.message || "Không thể tải chi tiết Flash Sale")}
                    </td>
                </tr>
            `;
        }
    }
}

function closeFlashSaleDetailModal() {
    currentFlashSaleDetail = null;
    hideModal(document.getElementById("flashSaleDetailModal"));
}

function renderFlashSaleItems(items) {
    const tableBody = document.getElementById("flashSaleItemTableBody");

    if (!tableBody) return;

    if (!items || items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                    Chương trình này chưa có sản phẩm Flash Sale.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map((item) => {
        const imageUrl = getProductImageUrl(item.image);

        return `
            <tr class="hover:bg-surface-container-low transition-colors">
                <td class="px-gutter py-4">
                    <div class="flex items-center gap-3">
                        <img src="${imageUrl}"
                             alt="${escapeHtml(item.productName)}"
                             class="w-12 h-12 rounded-lg object-cover border border-outline-variant"
                             onerror="this.src='/images/products/default.jpg'"/>

                        <div>
                            <p class="text-sm font-semibold text-on-surface">
                                ${escapeHtml(item.productName)}
                            </p>
                            <p class="text-xs text-secondary mt-1">
                                Product ID: ${item.productId}
                            </p>
                        </div>
                    </div>
                </td>

                <td class="px-gutter py-4 text-sm text-secondary">
                    ${formatCurrency(item.originalPrice)}
                </td>

                <td class="px-gutter py-4 text-sm font-bold text-primary">
                    ${formatCurrency(item.salePrice)}
                </td>

                <td class="px-gutter py-4">
                    <span class="inline-flex rounded-full bg-error-container text-error px-3 py-1 text-xs font-bold">
                        -${item.discountPercent ?? 0}%
                    </span>
                </td>

                <td class="px-gutter py-4 text-sm text-secondary">
                    ${item.quantityLimit ?? 0}
                </td>

                <td class="px-gutter py-4 text-sm text-secondary">
                    ${item.soldQuantity ?? 0}
                </td>

                <td class="px-gutter py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="btn-edit-flash-sale-item px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:opacity-80"
                                data-id="${item.id}">
                            Sửa
                        </button>

                        <button class="btn-delete-flash-sale-item px-3 py-1.5 rounded-lg text-xs font-semibold bg-error-container text-error hover:opacity-80"
                                data-id="${item.id}">
                            Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    tableBody.querySelectorAll(".btn-edit-flash-sale-item").forEach((button) => {
        button.addEventListener("click", async () => {
            const item = currentFlashSaleDetail.items.find(
                (product) => Number(product.id) === Number(button.dataset.id)
            );

            await openFlashSaleItemModal({
                flashSaleId: currentFlashSaleDetail.id,
                item
            });
        });
    });

    tableBody.querySelectorAll(".btn-delete-flash-sale-item").forEach((button) => {
        button.addEventListener("click", async () => {
            await handleDeleteFlashSaleItem(Number(button.dataset.id));
        });
    });
}

async function openFlashSaleItemModal({ flashSaleId, item = null }) {
    const modal = document.getElementById("flashSaleItemModal");
    const title = document.getElementById("flashSaleItemModalTitle");
    const productSelect = document.getElementById("flashSaleProductSelect");

    document.getElementById("flashSaleItemIdInput").value = item?.id ?? "";
    document.getElementById("flashSaleItemFlashSaleIdInput").value = flashSaleId;
    document.getElementById("flashSaleItemSalePriceInput").value = item?.salePrice ?? "";
    document.getElementById("flashSaleItemQuantityLimitInput").value = item?.quantityLimit ?? 0;
    document.getElementById("flashSaleItemSoldQuantityInput").value = item?.soldQuantity ?? 0;

    if (title) {
        title.textContent = item ? "Cập nhật sản phẩm Flash Sale" : "Thêm sản phẩm vào Flash Sale";
    }

    await loadProductsToSelect();

    if (productSelect) {
        productSelect.value = item?.productId ?? "";
        productSelect.disabled = Boolean(item);
    }

    renderSelectedProductPrice();
    showModal(modal);
}

function closeFlashSaleItemModal() {
    const productSelect = document.getElementById("flashSaleProductSelect");

    if (productSelect) {
        productSelect.disabled = false;
    }

    hideModal(document.getElementById("flashSaleItemModal"));
}

async function loadProductsToSelect() {
    const productSelect = document.getElementById("flashSaleProductSelect");

    if (!productSelect) return;

    if (adminProducts.length === 0) {
        adminProducts = await getAdminProductsForFlashSale();
    }

    productSelect.innerHTML = `
        <option value="">-- Chọn sản phẩm --</option>
        ${adminProducts.map((product) => {
        const productName = product.name || product.productName || "Không có tên";
        const productPrice = product.price || 0;

        return `
                <option value="${product.id}">
                    ${escapeHtml(productName)} - ${formatCurrency(productPrice)}
                </option>
            `;
    }).join("")}
    `;
}

function renderSelectedProductPrice() {
    const productSelect = document.getElementById("flashSaleProductSelect");
    const text = document.getElementById("selectedProductPriceText");

    if (!productSelect || !text) return;

    const productId = Number(productSelect.value);

    if (!productId) {
        text.textContent = "";
        return;
    }

    const product = adminProducts.find((item) => Number(item.id) === productId);

    if (!product) {
        text.textContent = "";
        return;
    }

    text.textContent = `Giá gốc: ${formatCurrency(product.price)} | Tồn kho: ${product.quantity ?? 0}`;
}

async function handleSubmitFlashSaleItem(event) {
    event.preventDefault();

    const itemId = document.getElementById("flashSaleItemIdInput").value;
    const flashSaleId = document.getElementById("flashSaleItemFlashSaleIdInput").value;
    const productId = document.getElementById("flashSaleProductSelect").value;

    const payload = {
        productId: productId ? Number(productId) : null,
        salePrice: Number(document.getElementById("flashSaleItemSalePriceInput").value),
        quantityLimit: Number(document.getElementById("flashSaleItemQuantityLimitInput").value || 0),
        soldQuantity: Number(document.getElementById("flashSaleItemSoldQuantityInput").value || 0)
    };

    if (!itemId && !payload.productId) {
        alert("Vui lòng chọn sản phẩm");
        return;
    }

    if (!payload.salePrice || payload.salePrice <= 0) {
        alert("Giá sale phải lớn hơn 0");
        return;
    }

    if (payload.quantityLimit < 0 || payload.soldQuantity < 0) {
        alert("Số lượng không được nhỏ hơn 0");
        return;
    }

    if (payload.quantityLimit > 0 && payload.soldQuantity > payload.quantityLimit) {
        alert("Số lượng đã bán không được lớn hơn số lượng giới hạn");
        return;
    }

    try {
        if (itemId) {
            await updateAdminFlashSaleItem(itemId, payload);
            alert("Cập nhật sản phẩm Flash Sale thành công");
        } else {
            await addAdminFlashSaleItem(flashSaleId, payload);
            alert("Thêm sản phẩm vào Flash Sale thành công");
        }

        closeFlashSaleItemModal();
        await refreshCurrentFlashSaleDetail();
        await loadFlashSales();
    } catch (error) {
        console.error("Lỗi lưu sản phẩm Flash Sale:", error);
        alert(error.message || "Có lỗi xảy ra khi lưu sản phẩm Flash Sale");
    }
}

async function handleDeleteFlashSaleItem(itemId) {
    const confirmed = confirm("Bạn có chắc muốn xóa sản phẩm này khỏi Flash Sale không?");

    if (!confirmed) return;

    try {
        await deleteAdminFlashSaleItem(itemId);
        alert("Xóa sản phẩm khỏi Flash Sale thành công");

        await refreshCurrentFlashSaleDetail();
        await loadFlashSales();
    } catch (error) {
        console.error("Lỗi xóa sản phẩm Flash Sale:", error);
        alert(error.message || "Không thể xóa sản phẩm khỏi Flash Sale");
    }
}

async function refreshCurrentFlashSaleDetail() {
    if (!currentFlashSaleDetail) return;

    currentFlashSaleDetail = await getAdminFlashSaleDetail(currentFlashSaleDetail.id);

    const meta = document.getElementById("flashSaleDetailMeta");

    if (meta) {
        meta.textContent = `${formatDateTime(currentFlashSaleDetail.startTime)} - ${formatDateTime(currentFlashSaleDetail.endTime)} • ${currentFlashSaleDetail.status}`;
    }

    renderFlashSaleItems(currentFlashSaleDetail.items || []);
}

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
                ${renderVisibleStatusBadge(true)}
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

function renderVisibleStatusBadge(active) {
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

function renderFlashSaleStatusBadge(status) {
    let className = "bg-surface-container text-on-surface";

    if (status === "Đang áp dụng") {
        className = "bg-green-100 text-green-700";
    }

    if (status === "Chưa bắt đầu") {
        className = "bg-blue-100 text-blue-700";
    }

    if (status === "Đã hết hạn") {
        className = "bg-gray-100 text-gray-700";
    }

    if (status === "Đã tắt") {
        className = "bg-error-container text-error";
    }

    return `
        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}">
            ${escapeHtml(status || "Không xác định")}
        </span>
    `;
}

function showModal(modal) {
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function hideModal(modal) {
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "0 ₫";
    }

    return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatDateTime(value) {
    if (!value) return "Không xác định";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function toDateTimeLocalValue(value) {
    if (!value) return "";

    return String(value).slice(0, 16);
}

function getProductImageUrl(image) {
    if (!image) {
        return "/images/products/default.jpg";
    }

    if (image.startsWith("http") || image.startsWith("/")) {
        return image;
    }

    return `/images/products/${image}`;
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