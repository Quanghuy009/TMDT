const PRODUCT_API_URL = "/api/admin/products";

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

export async function createAdminProduct(payload) {
    const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Không thể thêm sản phẩm");
    }

    return await response.json();
}

export async function updateAdminProduct(id, data) {
    const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
        throw new Error("Không thể xóa sản phẩm");
    }
}