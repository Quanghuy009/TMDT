import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/categories";

let editingCategoryId = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        const params = new URLSearchParams(window.location.search);
        editingCategoryId = params.get("id");

        if (editingCategoryId) {
            setupEditMode(editingCategoryId);
        } else {
            setupCreateMode();
        }

        setupSubmitForm();
    } catch (error) {
        console.error("Lỗi khởi tạo form danh mục:", error);
        alert("Có lỗi khi tải trang danh mục");
    }
});

function setupCreateMode() {
    document.getElementById("page-title").textContent = "Thêm danh mục";
    document.getElementById("breadcrumb-current").textContent = "Thêm mới";
    document.getElementById("submit-text").textContent = "Lưu danh mục";
}

async function setupEditMode(categoryId) {
    document.getElementById("page-title").textContent = "Sửa danh mục";
    document.getElementById("breadcrumb-current").textContent = "Chỉnh sửa";
    document.getElementById("submit-text").textContent = "Cập nhật danh mục";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách danh mục");
        }

        const categories = await response.json();

        const category = categories.find(item => Number(item.categoryId) === Number(categoryId));

        if (!category) {
            alert("Không tìm thấy danh mục cần sửa");
            window.location.href = "/pages/admin/category-management.html";
            return;
        }

        document.getElementById("category-name").value = category.categoryName;
    } catch (error) {
        console.error("Lỗi tải dữ liệu danh mục:", error);
        alert("Không thể tải dữ liệu danh mục");
    }
}

function setupSubmitForm() {
    const form = document.getElementById("category-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const categoryName = document.getElementById("category-name").value.trim();

        if (!categoryName) {
            alert("Vui lòng nhập tên danh mục");
            return;
        }

        const payload = {
            categoryName: categoryName
        };

        if (editingCategoryId) {
            await updateCategory(editingCategoryId, payload);
        } else {
            await createCategory(payload);
        }
    });
}

async function createCategory(payload) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Thêm danh mục thất bại");
        }

        alert("Thêm danh mục thành công");
        window.location.href = "/pages/admin/category-management.html";
    } catch (error) {
        console.error("Lỗi thêm danh mục:", error);
        alert(error.message || "Thêm danh mục thất bại");
    }
}

async function updateCategory(categoryId, payload) {
    try {
        const response = await fetch(`${API_URL}/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Cập nhật danh mục thất bại");
        }

        alert("Cập nhật danh mục thành công");
        window.location.href = "/pages/admin/category-management.html";
    } catch (error) {
        console.error("Lỗi cập nhật danh mục:", error);
        alert(error.message || "Cập nhật danh mục thất bại");
    }
}