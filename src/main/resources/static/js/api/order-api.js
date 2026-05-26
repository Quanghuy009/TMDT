function getAuthHeaders() {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export async function createOrder(request) {
    const response = await fetch("/api/orders", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "CREATE_ORDER_FAILED");
    }

    return await response.json();
}

export async function getOrderDetail(orderId) {
    const response = await fetch(`/api/orders/${orderId}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("GET_ORDER_FAILED");
    }

    return await response.json();
}