import { addCartItem } from "../api/cart-api.js";

function redirectToLogin() {
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = `/pages/login.html?redirect=${encodeURIComponent(currentUrl)}`;
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert(message);
}

export async function handleAddToCart(productId) {
    try {
        await addCartItem(productId);

        showSuccess("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
        console.error(error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        showError("Không thể thêm sản phẩm vào giỏ hàng");
    }
}

export async function handleBuyNow(productId) {
    try {
        await addCartItem(productId);

        window.location.href = "/pages/cart.html";
    } catch (error) {
        console.error(error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        showError("Không thể mua ngay sản phẩm này");
    }
}