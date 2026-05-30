import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/categories";

let categories = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        await loadCategories();

        setupSearch();
    } catch (error) {
        console.error("Lỗi khởi tạo trang quản lý danh mục:", error);
    }
});

async function loadCategories() {
    const tableBody = getTableBody();
    const countText = getCountText();

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-gutter py-6 text-center text-sm text-secondary">
                        Đang tải dữ liệu danh mục...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách danh mục");
        }

        categories = await response.json();

        renderCategories(categories);
    } catch (error) {
        console.error("Lỗi tải danh mục:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-gutter py-6 text-center text-sm text-error">
                        Không thể tải dữ liệu danh mục
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = "Lỗi tải dữ liệu";
        }
    }
}

function renderCategories(categoryList) {
    const tableBody = getTableBody();
    const countText = getCountText();

    if (!tableBody) return;

    if (!categoryList || categoryList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="px-gutter py-6 text-center text-sm text-secondary">
                    Không có danh mục nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Không có danh mục nào";
        }

        return;
    }

    tableBody.innerHTML = categoryList.map(category => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-4 text-sm font-medium text-on-surface">
                #${category.categoryId}
            </td>

            <td class="px-gutter py-4">
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-on-surface">
                        ${escapeHtml(category.categoryName)}
                    </span>
                    <span class="text-xs text-secondary">
                        Mã danh mục: ${category.categoryId}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-secondary">
                    ${category.productCount} sản phẩm
                </span>
            </td>

            <td class="px-gutter py-4 text-right">
                <div class="flex items-center justify-end gap-2">

                    <button
                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Sửa danh mục"
                        onclick="editCategory(${category.categoryId})">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-error-container transition-colors text-error"
                        title="Xóa danh mục"
                        onclick="deleteCategory(${category.categoryId})">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${categoryList.length} / ${categories.length} danh mục`;
    }
}

function setupSearch() {
    const searchInput =
        document.getElementById("categorySearchInput") ||
        document.getElementById("productSearchInput");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim().toLowerCase();

        const filteredCategories = categories.filter(category =>
            category.categoryName.toLowerCase().includes(keyword)
        );

        renderCategories(filteredCategories);
    });
}

function getTableBody() {
    return document.getElementById("categoryTableBody")
        || document.getElementById("productTableBody");
}

function getCountText() {
    return document.getElementById("categoryCountText")
        || document.getElementById("productCountText");
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

window.editCategory = function (categoryId) {
    window.location.href = `/pages/admin/category-form.html?id=${categoryId}`;
};

window.deleteCategory = async function (categoryId) {
    const category = categories.find(item => Number(item.categoryId) === Number(categoryId));

    if (!category) return;

    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.categoryName}" không?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Xóa danh mục thất bại");
        }

        alert("Xóa danh mục thành công");

        categories = categories.filter(item => Number(item.categoryId) !== Number(categoryId));
        renderCategories(categories);
    } catch (error) {
        console.error("Lỗi xóa danh mục:", error);
        alert(error.message || "Xóa danh mục thất bại");
    }
};