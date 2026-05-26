const CART_API = "/api/cart";

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

export async function getMyCart() {
    const response = await fetch(CART_API, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("GET_CART_FAILED");
    }

    return await response.json();
}

export async function addCartItem(productId) {
    const response = await fetch(`${CART_API}/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            productId: Number(productId)
        })
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "ADD_TO_CART_FAILED");
    }

    return await response.json();
}

export async function updateCartItem(cartItemId, quantity) {
    const response = await fetch(`${CART_API}/items/${cartItemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            quantity: Number(quantity)
        })
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("UPDATE_CART_ITEM_FAILED");
    }

    return await response.json();
}

export async function removeCartItem(cartItemId) {
    const response = await fetch(`${CART_API}/items/${cartItemId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        throw new Error("REMOVE_CART_ITEM_FAILED");
    }

    return await response.json();
}