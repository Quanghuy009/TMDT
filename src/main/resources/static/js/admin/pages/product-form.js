import { loadAdminLayout } from "../admin-layout.js";
import {
    createAdminProduct,
    getAdminProductDetail,
    updateAdminProduct
} from "../api/product-api.js";

import {
    initSpecForm,
    handleCategoryChange,
    handleAccessoryTypeChange
} from "../components/product-spec-form.js";

let productId = null;
let isEditMode = false;

document.addEventListener("DOMContentLoaded", async () => {
    await loadAdminLayout("products");

    initSpecForm();

    productId = new URLSearchParams(window.location.search).get("id");
    isEditMode = Boolean(productId);

    setupPageMode();
    bindEvents();

    if (isEditMode) {
        await loadProductDetail(productId);
    }
});

function setupPageMode() {
    const pageTitle = document.getElementById("page-title");
    const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    const submitText = document.getElementById("submit-text");

    if (isEditMode) {
        pageTitle.textContent = "Cập nhật sản phẩm";
        breadcrumbCurrent.textContent = "Cập nhật";
        submitText.textContent = "Cập nhật sản phẩm";
        document.title = "Cập nhật sản phẩm | TechStore Admin";
    } else {
        pageTitle.textContent = "Thêm sản phẩm";
        breadcrumbCurrent.textContent = "Thêm mới";
        submitText.textContent = "Lưu sản phẩm";
        document.title = "Thêm sản phẩm | TechStore Admin";
    }
}

function bindEvents() {
    const form = document.getElementById("product-form");

    form?.addEventListener("submit", handleSubmit);
}

async function loadProductDetail(id) {
    try {
        const product = await getAdminProductDetail(id);

        fillProductForm(product);

    } catch (error) {
        console.error("Lỗi tải chi tiết sản phẩm:", error);
        alert("Không thể tải thông tin sản phẩm.");
    }
}

function fillProductForm(product) {
    setFieldValue("name", product.name);
    setFieldValue("price", product.price);
    setFieldValue("quantity", product.quantity);
    setFieldValue("image", product.image);
    setFieldValue("categoryId", product.categoryId);
    setFieldValue("brandId", product.brandId);

    handleCategoryChange();

    if (product.accessoryType) {
        setFieldValue("accessoryType", product.accessoryType);
        handleAccessoryTypeChange();
    }

    if (product.deviceSpec) {
        fillFields(product.deviceSpec);
    }

    if (product.headphoneSpec) {
        fillFields(product.headphoneSpec);
    }

    if (product.keyboardSpec) {
        fillFields(product.keyboardSpec);
    }

    if (product.mouseSpec) {
        fillFields(product.mouseSpec);
    }

    if (product.speakerSpec) {
        fillFields(product.speakerSpec);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    const payload = buildProductPayload();

    try {
        if (isEditMode) {
            await updateAdminProduct(productId, payload);
            alert("Cập nhật sản phẩm thành công.");
        } else {
            await createAdminProduct(payload);
            alert("Thêm sản phẩm thành công.");
        }

        window.location.href = "/pages/admin/product-management.html";

    } catch (error) {
        console.error("Lỗi lưu sản phẩm:", error);
        alert("Không thể lưu sản phẩm. Vui lòng kiểm tra lại dữ liệu.");
    }
}

function buildProductPayload() {
    const categoryName = getSelectedCategoryName();
    const accessoryType = getFieldValue("accessoryType");

    const payload = {
        name: getFieldValue("name"),
        price: Number(getFieldValue("price")),
        quantity: Number(getFieldValue("quantity")),
        image: getFieldValue("image"),
        categoryId: Number(getFieldValue("categoryId")),
        brandId: Number(getFieldValue("brandId")),
        accessoryType: accessoryType || null
    };

    if (isDeviceCategory(categoryName)) {
        payload.deviceSpec = collectFieldsFromSection("spec-device");
    }

    if (categoryName === "Phụ kiện") {
        if (accessoryType === "headphone") {
            payload.headphoneSpec = collectFieldsFromSection("spec-headphone");
        }

        if (accessoryType === "keyboard") {
            payload.keyboardSpec = collectFieldsFromSection("spec-keyboard");
        }

        if (accessoryType === "mouse") {
            payload.mouseSpec = collectFieldsFromSection("spec-mouse");
        }

        if (accessoryType === "speaker") {
            payload.speakerSpec = collectFieldsFromSection("spec-speaker");
        }
    }

    return payload;
}

function collectFieldsFromSection(sectionId) {
    const section = document.getElementById(sectionId);
    const data = {};

    if (!section) return data;

    section.querySelectorAll("input[name], textarea[name], select[name]").forEach(field => {
        data[field.name] = field.value.trim();
    });

    return data;
}

function fillFields(data) {
    Object.entries(data).forEach(([key, value]) => {
        setFieldValue(key, value);
    });
}

function setFieldValue(name, value) {
    const field = document.querySelector(`[name="${name}"]`);

    if (field) {
        field.value = value ?? "";
    }
}

function getFieldValue(name) {
    const field = document.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
}

function getSelectedCategoryName() {
    const categorySelect = document.getElementById("category-select");
    const selectedOption = categorySelect?.selectedOptions[0];

    return selectedOption?.dataset.name || selectedOption?.textContent || "";
}

function isDeviceCategory(categoryName) {
    return categoryName === "Điện thoại"
        || categoryName === "Laptop"
        || categoryName === "Tablet";
}