import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/brands";

let brands = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        await loadBrands();

        setupSearch();
    } catch (error) {
        console.error("Lỗi khởi tạo trang quản lý thương hiệu:", error);
    }
});

async function loadBrands() {
    const tableBody = document.getElementById("brandTableBody");
    const countText = document.getElementById("brandCountText");

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-gutter py-6 text-center text-sm text-secondary">
                        Đang tải dữ liệu thương hiệu...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách thương hiệu");
        }

        brands = await response.json();

        renderBrands(brands);
    } catch (error) {
        console.error("Lỗi tải thương hiệu:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-gutter py-6 text-center text-sm text-error">
                        Không thể tải dữ liệu thương hiệu
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = "Lỗi tải dữ liệu";
        }
    }
}

function renderBrands(brandList) {
    const tableBody = document.getElementById("brandTableBody");
    const countText = document.getElementById("brandCountText");

    if (!tableBody) return;

    if (!brandList || brandList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-gutter py-6 text-center text-sm text-secondary">
                    Không có thương hiệu nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Không có thương hiệu nào";
        }

        return;
    }

    tableBody.innerHTML = brandList.map(brand => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-4 text-sm font-medium text-on-surface">
                #${brand.brandId}
            </td>

            <td class="px-gutter py-4">
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-on-surface">
                        ${escapeHtml(brand.brandName)}
                    </span>
                    <span class="text-xs text-secondary">
                        Mã thương hiệu: ${brand.brandId}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-4">
                <span class="text-sm text-on-surface">
                    ${escapeHtml(brand.country || "Chưa cập nhật")}
                </span>
            </td>

            <td class="px-gutter py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-secondary">
                    ${brand.productCount ?? 0} sản phẩm
                </span>
            </td>

            <td class="px-gutter py-4 text-right">
                <div class="flex items-center justify-end gap-2">

                    <button
                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Sửa thương hiệu"
                        onclick="editBrand(${brand.brandId})">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-error-container transition-colors text-error"
                        title="Xóa thương hiệu"
                        onclick="deleteBrand(${brand.brandId})">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${brandList.length} / ${brands.length} thương hiệu`;
    }
}

function setupSearch() {
    const searchInput = document.getElementById("brandSearchInput");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim().toLowerCase();

        const filteredBrands = brands.filter(brand => {
            const brandName = brand.brandName || "";
            const country = brand.country || "";

            return brandName.toLowerCase().includes(keyword)
                || country.toLowerCase().includes(keyword);
        });

        renderBrands(filteredBrands);
    });
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

window.editBrand = function (brandId) {
    window.location.href = `/pages/admin/brand-form.html?id=${brandId}`;
};

window.deleteBrand = async function (brandId) {
    const brand = brands.find(item => Number(item.brandId) === Number(brandId));

    if (!brand) return;

    if (!confirm(`Bạn có chắc muốn xóa thương hiệu "${brand.brandName}" không?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${brandId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Xóa thương hiệu thất bại");
        }

        alert("Xóa thương hiệu thành công");

        brands = brands.filter(item => Number(item.brandId) !== Number(brandId));
        renderBrands(brands);
    } catch (error) {
        console.error("Lỗi xóa thương hiệu:", error);
        alert(error.message || "Xóa thương hiệu thất bại");
    }
};