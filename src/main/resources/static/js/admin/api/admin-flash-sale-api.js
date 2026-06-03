const FLASH_SALE_API = "/api/admin/flash-sales";
const ADMIN_PRODUCT_API = "/api/admin/products";

function getAuthHeaders() {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

async function handleResponse(response, defaultMessage) {
    if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        return await response.text();
    }

    let errorMessage = defaultMessage;

    try {
        const errorText = await response.text();
        if (errorText) {
            errorMessage = errorText;
        }
    } catch (error) {
        console.error(error);
    }

    throw new Error(errorMessage);
}

export async function getAdminFlashSales() {
    const response = await fetch(FLASH_SALE_API, {
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể tải danh sách Flash Sale");
}

export async function getAdminFlashSaleDetail(id) {
    const response = await fetch(`${FLASH_SALE_API}/${id}`, {
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể tải chi tiết Flash Sale");
}

export async function createAdminFlashSale(payload) {
    const response = await fetch(FLASH_SALE_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response, "Không thể thêm Flash Sale");
}

export async function updateAdminFlashSale(id, payload) {
    const response = await fetch(`${FLASH_SALE_API}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response, "Không thể cập nhật Flash Sale");
}

export async function deleteAdminFlashSale(id) {
    const response = await fetch(`${FLASH_SALE_API}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể xóa Flash Sale");
}

export async function getAdminFlashSaleItems(flashSaleId) {
    const response = await fetch(`${FLASH_SALE_API}/${flashSaleId}/items`, {
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể tải sản phẩm Flash Sale");
}

export async function addAdminFlashSaleItem(flashSaleId, payload) {
    const response = await fetch(`${FLASH_SALE_API}/${flashSaleId}/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response, "Không thể thêm sản phẩm vào Flash Sale");
}

export async function updateAdminFlashSaleItem(itemId, payload) {
    const response = await fetch(`${FLASH_SALE_API}/items/${itemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    return handleResponse(response, "Không thể cập nhật sản phẩm Flash Sale");
}

export async function deleteAdminFlashSaleItem(itemId) {
    const response = await fetch(`${FLASH_SALE_API}/items/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể xóa sản phẩm khỏi Flash Sale");
}

export async function getAdminProductsForFlashSale() {
    const response = await fetch(ADMIN_PRODUCT_API, {
        headers: getAuthHeaders()
    });

    return handleResponse(response, "Không thể tải danh sách sản phẩm");
}