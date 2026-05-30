import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/brands";

let editingBrandId = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        const params = new URLSearchParams(window.location.search);
        editingBrandId = params.get("id");

        if (editingBrandId) {
            await setupEditMode(editingBrandId);
        } else {
            setupCreateMode();
        }

        setupSubmitForm();
    } catch (error) {
        console.error("Lỗi khởi tạo form thương hiệu:", error);
        alert("Có lỗi khi tải trang thương hiệu");
    }
});

function setupCreateMode() {
    document.getElementById("page-title").textContent = "Thêm thương hiệu";
    document.getElementById("breadcrumb-current").textContent = "Thêm mới";
    document.getElementById("submit-text").textContent = "Lưu thương hiệu";
}

async function setupEditMode(brandId) {
    document.getElementById("page-title").textContent = "Sửa thương hiệu";
    document.getElementById("breadcrumb-current").textContent = "Chỉnh sửa";
    document.getElementById("submit-text").textContent = "Cập nhật thương hiệu";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách thương hiệu");
        }

        const brands = await response.json();

        const brand = brands.find(item => Number(item.brandId) === Number(brandId));

        if (!brand) {
            alert("Không tìm thấy thương hiệu cần sửa");
            window.location.href = "/pages/admin/brand-management.html";
            return;
        }

        document.getElementById("brand-name").value = brand.brandName || "";
        document.getElementById("brand-country").value = brand.country || "";
    } catch (error) {
        console.error("Lỗi tải dữ liệu thương hiệu:", error);
        alert("Không thể tải dữ liệu thương hiệu");
    }
}

function setupSubmitForm() {
    const form = document.getElementById("brand-form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const brandName = document.getElementById("brand-name").value.trim();
        const country = document.getElementById("brand-country").value.trim();

        if (!brandName) {
            alert("Vui lòng nhập tên thương hiệu");
            return;
        }

        const payload = {
            brandName: brandName,
            country: country
        };

        if (editingBrandId) {
            await updateBrand(editingBrandId, payload);
        } else {
            await createBrand(payload);
        }
    });
}

async function createBrand(payload) {
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
            throw new Error(message || "Thêm thương hiệu thất bại");
        }

        alert("Thêm thương hiệu thành công");
        window.location.href = "/pages/admin/brand-management.html";
    } catch (error) {
        console.error("Lỗi thêm thương hiệu:", error);
        alert(error.message || "Thêm thương hiệu thất bại");
    }
}

async function updateBrand(brandId, payload) {
    try {
        const response = await fetch(`${API_URL}/${brandId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Cập nhật thương hiệu thất bại");
        }

        alert("Cập nhật thương hiệu thành công");
        window.location.href = "/pages/admin/brand-management.html";
    } catch (error) {
        console.error("Lỗi cập nhật thương hiệu:", error);
        alert(error.message || "Cập nhật thương hiệu thất bại");
    }
}