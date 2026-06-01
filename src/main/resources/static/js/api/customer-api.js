// /js/api/customer-api.js

const API_BASE_URL = "/api/customer";

function getToken() {
    return localStorage.getItem("token");
}

function getAuthHeaders() {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

async function handleResponse(response) {
    // 401: token sai, hết hạn, hoặc chưa đăng nhập
    if (response.status === 401) {
        console.error("401 Unauthorized: Token không hợp lệ hoặc đã hết hạn");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/pages/login.html";
        return;
    }

    // 403: đã đăng nhập nhưng không đủ quyền
    // Không được xóa token ở đây, vì xóa token sẽ làm giỏ hàng cũng bị văng login
    if (response.status === 403) {
        console.error("403 Forbidden: Có token nhưng không đủ quyền truy cập API này");

        throw new Error("Bạn không có quyền truy cập chức năng này");
    }

    if (!response.ok) {
        let message = "Có lỗi xảy ra khi gọi API";

        try {
            const errorData = await response.json();
            message = errorData.message || errorData.error || message;
        } catch (error) {
            message = response.statusText || message;
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function getCustomerProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
}

export async function updateCustomerProfile(data) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse(response);
}

export async function getCustomerOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
}

export async function getCustomerOrderDetail(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
}