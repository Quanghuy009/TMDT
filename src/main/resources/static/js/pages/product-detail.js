import { getProductDetail } from "../api/product-detail-api.js";
import { renderProductDetail } from "../components/product-detail-renderer.js";
import { handleAddToCart, handleBuyNow } from "../actions/cart-actions.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadLayout();

    const productId = getProductIdFromUrl();

    if (!productId) {
        showError("Không tìm thấy id sản phẩm trên URL");
        return;
    }

    try {
        const product = await getProductDetail(productId);
        renderProductDetail(product);

        bindCartButtons(productId);
    } catch (error) {
        console.error(error);
        showError("Không thể tải chi tiết sản phẩm");
    }
});

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function bindCartButtons(productId) {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", async () => {
            await handleAddToCart(productId);
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", async () => {
            await handleBuyNow(productId);
        });
    }
}

async function loadLayout() {
    await Promise.all([
        loadFragment("header", "/fragments/header.html"),
        loadFragment("footer", "/fragments/footer.html")
    ]);
}

async function loadFragment(elementId, path) {
    const element = document.getElementById(elementId);

    if (!element) return;

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Không tải được ${path}`);
    }

    element.innerHTML = await response.text();
}

function showError(message) {
    const main = document.querySelector("main");

    if (!main) return;

    main.innerHTML = `
        <div class="pt-24 text-center">
            <h1 class="text-2xl font-bold text-red-600 mb-4">
                ${message}
            </h1>
            <a href="/pages/index.html" class="text-primary underline">
                Quay về trang chủ
            </a>
        </div>
    `;
}