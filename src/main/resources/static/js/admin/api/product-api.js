const PRODUCT_API_URL = "/api/admin/products";

function buildProductFormData(payload, imageFile) {
    const formData = new FormData();

    formData.append(
        "product",
        new Blob([JSON.stringify(payload)], {
            type: "application/json"
        })
    );

    if (imageFile) {
        formData.append("imageFile", imageFile);
    }

    return formData;
}

export async function getAdminProducts() {
    const response = await fetch(PRODUCT_API_URL);

    if (!response.ok) {
        throw new Error("Không thể tải danh sách sản phẩm");
    }

    return await response.json();
}

export async function getAdminProductDetail(productId) {
    const response = await fetch(`${PRODUCT_API_URL}/${productId}`);

    if (!response.ok) {
        throw new Error("Không thể tải chi tiết sản phẩm");
    }

    return await response.json();
}

export async function createAdminProduct(payload, imageFile) {
    const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        body: buildProductFormData(payload, imageFile)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(errorText || "Không thể thêm sản phẩm");
    }

    return await response.json();
}

export async function updateAdminProduct(id, payload, imageFile) {
    const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "PUT",
        body: buildProductFormData(payload, imageFile)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(errorText || "Không thể cập nhật sản phẩm");
    }

    return await response.json();
}

export async function deleteAdminProduct(productId) {
    const response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(errorText || "Không thể xóa sản phẩm");
    }
}