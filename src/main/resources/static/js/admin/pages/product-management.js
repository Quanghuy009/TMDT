import { loadAdminLayout } from "../admin-layout.js";
import {
    getAdminProducts,
    deleteAdminProduct
} from "../api/product-api.js";
import { renderProductTable } from "../components/product-table.js";

let allProducts = [];
let filteredProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadAdminLayout();

    await loadProducts();

    bindEvents();
});

async function loadProducts() {
    try {
        allProducts = await getAdminProducts();
        filteredProducts = [...allProducts];

        renderProductTable(filteredProducts);
        updateProductCount();

    } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm:", error);

        const tbody = document.getElementById("productTableBody");

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-8 text-center text-xs text-red-600">
                        Không thể tải danh sách sản phẩm. Vui lòng kiểm tra API /api/admin/products.
                    </td>
                </tr>
            `;
        }

        updateProductCount();
    }
}

function bindEvents() {
    const searchInput = document.getElementById("productSearchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const addButton = document.getElementById("btnAddProduct");

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);

    addButton?.addEventListener("click", () => {
        window.location.href = "/pages/admin/product-form.html";
    });

    document.addEventListener("click", handleProductActions);
}

function applyFilters() {
    const keyword = document.getElementById("productSearchInput")?.value.toLowerCase().trim() || "";
    const category = document.getElementById("categoryFilter")?.value || "";

    filteredProducts = allProducts.filter(product => {
        const productName = product.name?.toLowerCase() || "";
        const productBrand = product.brand?.toLowerCase() || "";
        const productCategory = product.category?.toLowerCase() || "";

        const matchesKeyword =
            productName.includes(keyword) ||
            productBrand.includes(keyword) ||
            productCategory.includes(keyword);

        const matchesCategory =
            !category || normalizeCategoryCode(product.category) === category;

        return matchesKeyword && matchesCategory;
    });

    renderProductTable(filteredProducts);
    updateProductCount();
}

function normalizeCategoryCode(categoryName) {
    if (!categoryName) return "";

    const name = categoryName.toLowerCase();

    if (name.includes("điện thoại")) return "phone";
    if (name.includes("laptop")) return "laptop";
    if (name.includes("tablet")) return "tablet";
    if (name.includes("phụ kiện")) return "accessory";

    return name;
}

function updateProductCount() {
    const countText = document.getElementById("productCountText");

    if (!countText) return;

    countText.textContent = `Hiển thị ${filteredProducts.length} / ${allProducts.length} sản phẩm`;
}

async function handleProductActions(event) {
    const editButton = event.target.closest(".btn-edit-product");
    const deleteButton = event.target.closest(".btn-delete-product");

    if (editButton) {
        const productId = editButton.dataset.id;
        window.location.href = `/pages/admin/product-form.html?id=${productId}`;
        return;
    }

    if (deleteButton) {
        const productId = deleteButton.dataset.id;

        const confirmed = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
        if (!confirmed) return;

        try {
            await deleteAdminProduct(productId);
            alert("Xóa sản phẩm thành công.");
            await loadProducts();
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            alert("Không thể xóa sản phẩm.");
        }
    }
}