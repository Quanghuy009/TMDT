import {
    getMyCart,
    updateCartItem,
    removeCartItem
} from "../api/cart-api.js";

import { createOrder } from "../api/order-api.js";

let currentCart = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadLayout();
        await loadCart();

        bindPlaceOrderButton();
    } catch (error) {
        console.error("CART PAGE INIT ERROR:", error);
        showCartError("Không thể tải trang giỏ hàng");
    }
});

/* =========================
   Layout
========================= */

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

/* =========================
   Load cart
========================= */

async function loadCart() {
    try {
        const cart = await getMyCart();
        currentCart = cart;
        renderCart(cart);
    } catch (error) {
        console.error("LOAD CART ERROR:", error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        showCartError("Không thể tải giỏ hàng");
    }
}

/* =========================
   Render cart
========================= */

function renderCart(cart) {
    const container = document.getElementById("cart-items-container");
    const cartTitle = document.getElementById("cart-title");

    if (!container || !cartTitle) return;

    const items = getCartItems(cart);

    const totalQuantity = getTotalQuantity(items);

    cartTitle.textContent = `Sản phẩm trong giỏ (${totalQuantity})`;

    if (items.length === 0) {
        container.innerHTML = renderEmptyCart();
        renderSummary(0, 0);
        return;
    }

    container.innerHTML = items.map(renderCartItem).join("");

    const subtotal = getCartSubtotal(cart, items);

    renderSummary(totalQuantity, subtotal);
    bindCartItemEvents();
}

function renderCartItem(item) {
    const cartItemId = item.cartItemId || item.id;
    const productName = item.productName || item.name || "Tên sản phẩm";

    const image = item.image || item.productImage;
    const imageUrl = image
        ? `/images/products/${image}`
        : "/images/products/default.jpg";

    const unitPrice = getItemPrice(item);
    const quantity = Number(item.quantity || 1);
    const lineTotal = unitPrice * quantity;

    return `
        <div class="p-6 flex flex-col sm:flex-row gap-6" data-cart-item-id="${cartItemId}">
            <div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                <img
                    class="max-w-full max-h-full object-contain"
                    src="${imageUrl}"
                    alt="${escapeHtml(productName)}">
            </div>

            <div class="flex-grow flex flex-col justify-between">
                <div>
                    <h4 class="font-h3 text-body-lg text-on-surface">
                        ${escapeHtml(productName)}
                    </h4>

                    <p class="text-caption text-secondary mt-1">
                        Sản phẩm chính hãng
                    </p>
                </div>

                <div class="flex items-center gap-4 mt-4">
                    <div class="flex items-center border border-outline-variant rounded-lg">
                        <button
                            type="button"
                            class="decrease-btn px-3 py-1 hover:bg-surface-container"
                            data-cart-item-id="${cartItemId}"
                            data-current-quantity="${quantity}">
                            -
                        </button>

                        <span class="px-4 py-1 text-spec-label">
                            ${quantity}
                        </span>

                        <button
                            type="button"
                            class="increase-btn px-3 py-1 hover:bg-surface-container"
                            data-cart-item-id="${cartItemId}"
                            data-current-quantity="${quantity}">
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        class="remove-btn text-caption text-secondary hover:text-error flex items-center gap-1"
                        data-cart-item-id="${cartItemId}">
                        <span class="material-symbols-outlined text-sm">delete</span>
                        Xóa
                    </button>
                </div>
            </div>

            <div class="text-right flex flex-col justify-between">
                <span class="font-h2 text-body-lg text-primary-container">
                    ${formatCurrency(lineTotal)}
                </span>

                ${
        quantity > 1
            ? `<span class="text-caption text-secondary">${formatCurrency(unitPrice)} / sản phẩm</span>`
            : ""
    }
            </div>
        </div>
    `;
}

function renderEmptyCart() {
    return `
        <div class="p-10 text-center">
            <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">
                shopping_cart
            </span>

            <h3 class="text-xl font-bold text-on-surface mb-2">
                Giỏ hàng của bạn đang trống
            </h3>

            <p class="text-secondary mb-6">
                Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
            </p>

            <a
                href="/pages/index.html"
                class="inline-flex items-center justify-center bg-primary-container text-white px-6 py-3 rounded-xl font-bold hover:bg-primary transition">
                Tiếp tục mua sắm
            </a>
        </div>
    `;
}

function showCartError(message) {
    const container = document.getElementById("cart-items-container");

    if (!container) return;

    container.innerHTML = `
        <div class="p-10 text-center">
            <h3 class="text-xl font-bold text-error mb-2">
                ${escapeHtml(message)}
            </h3>

            <button
                type="button"
                onclick="window.location.reload()"
                class="mt-4 bg-primary-container text-white px-6 py-3 rounded-xl font-bold">
                Tải lại
            </button>
        </div>
    `;
}

/* =========================
   Cart item events
========================= */

function bindCartItemEvents() {
    document.querySelectorAll(".increase-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const cartItemId = button.dataset.cartItemId;
            const currentQuantity = Number(button.dataset.currentQuantity);

            await handleUpdateQuantity(cartItemId, currentQuantity + 1);
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const cartItemId = button.dataset.cartItemId;
            const currentQuantity = Number(button.dataset.currentQuantity);

            if (currentQuantity <= 1) {
                await handleRemoveItem(cartItemId);
                return;
            }

            await handleUpdateQuantity(cartItemId, currentQuantity - 1);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async () => {
            const cartItemId = button.dataset.cartItemId;
            await handleRemoveItem(cartItemId);
        });
    });
}

async function handleUpdateQuantity(cartItemId, quantity) {
    if (!cartItemId) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng");
        return;
    }

    try {
        const updatedCart = await updateCartItem(cartItemId, quantity);

        currentCart = updatedCart;
        renderCart(updatedCart);
    } catch (error) {
        console.error("UPDATE CART ITEM ERROR:", error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        alert("Không thể cập nhật số lượng sản phẩm");
    }
}

async function handleRemoveItem(cartItemId) {
    if (!cartItemId) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng");
        return;
    }

    const confirmed = confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?");

    if (!confirmed) return;

    try {
        const updatedCart = await removeCartItem(cartItemId);

        currentCart = updatedCart;
        renderCart(updatedCart);
    } catch (error) {
        console.error("REMOVE CART ITEM ERROR:", error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        alert("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
}

/* =========================
   Summary
========================= */

function renderSummary(totalQuantity, subtotal) {
    const subtotalLabel = document.getElementById("summary-subtotal-label");
    const subtotalElement = document.getElementById("summary-subtotal");
    const discountElement = document.getElementById("summary-discount");
    const totalElement = document.getElementById("summary-total");

    const discount = 0;
    const total = Math.max(subtotal - discount, 0);

    if (subtotalLabel) {
        subtotalLabel.textContent = `Tạm tính (${totalQuantity} sản phẩm)`;
    }

    if (subtotalElement) {
        subtotalElement.textContent = formatCurrency(subtotal);
    }

    if (discountElement) {
        discountElement.textContent = `-${formatCurrency(discount)}`;
    }

    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
}

/* =========================
   Place order - COD
========================= */

function bindPlaceOrderButton() {
    const placeOrderBtn = document.getElementById("place-order-btn");

    if (!placeOrderBtn) return;

    placeOrderBtn.addEventListener("click", async () => {
        const items = getCartItems(currentCart);

        if (items.length === 0) {
            alert("Giỏ hàng của bạn đang trống");
            return;
        }

        const request = buildCreateOrderRequest();

        if (!validateCreateOrderRequest(request)) {
            return;
        }

        try {
            setPlaceOrderButtonLoading(true);

            const order = await createOrder(request);

            alert("Đặt hàng thành công");

            window.location.href = `/pages/order-success.html?id=${order.orderId}`;
        } catch (error) {
            console.error("CREATE ORDER ERROR:", error);

            if (error.message === "UNAUTHORIZED") {
                redirectToLogin();
                return;
            }

            alert(error.message || "Không thể đặt hàng. Vui lòng thử lại.");
            setPlaceOrderButtonLoading(false);
        }
    });
}

function buildCreateOrderRequest() {
    return {
        customerName: document.getElementById("customer-name-input")?.value.trim() || "",
        phone: document.getElementById("phone-input")?.value.trim() || "",
        address: document.getElementById("address-input")?.value.trim() || "",
        province: document.getElementById("province-select")?.value || "",
        district: document.getElementById("district-select")?.value || "",
        note: document.getElementById("note-input")?.value.trim() || "",

        deliveryMethod: "HOME_DELIVERY",
        paymentMethod: "COD",

        voucherCode: null
    };
}

function validateCreateOrderRequest(request) {
    if (!request.customerName) {
        alert("Vui lòng nhập họ và tên");
        return false;
    }

    if (!request.phone) {
        alert("Vui lòng nhập số điện thoại");
        return false;
    }

    if (!isValidPhone(request.phone)) {
        alert("Số điện thoại không hợp lệ");
        return false;
    }

    if (!request.address) {
        alert("Vui lòng nhập địa chỉ nhận hàng");
        return false;
    }

    if (!request.province) {
        alert("Vui lòng chọn tỉnh/thành phố");
        return false;
    }

    return true;
}

function setPlaceOrderButtonLoading(isLoading) {
    const placeOrderBtn = document.getElementById("place-order-btn");

    if (!placeOrderBtn) return;

    placeOrderBtn.disabled = isLoading;

    if (isLoading) {
        placeOrderBtn.textContent = "Đang đặt hàng...";
        placeOrderBtn.classList.add("opacity-70", "cursor-not-allowed");
    } else {
        placeOrderBtn.textContent = "Xác nhận đặt hàng";
        placeOrderBtn.classList.remove("opacity-70", "cursor-not-allowed");
    }
}

/* =========================
   Helpers
========================= */

function getCartItems(cart) {
    if (!cart) return [];

    return cart.items || cart.cartItems || [];
}

function getTotalQuantity(items) {
    return items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
    }, 0);
}

function getItemPrice(item) {
    return Number(
        item.salePrice ||
        item.price ||
        item.unitPrice ||
        item.productPrice ||
        0
    );
}

function getCartSubtotal(cart, items) {
    if (cart && cart.totalPrice !== undefined && cart.totalPrice !== null) {
        return Number(cart.totalPrice);
    }

    if (cart && cart.totalAmount !== undefined && cart.totalAmount !== null) {
        return Number(cart.totalAmount);
    }

    return items.reduce((sum, item) => {
        const price = getItemPrice(item);
        const quantity = Number(item.quantity || 1);

        return sum + price * quantity;
    }, 0);
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function isValidPhone(phone) {
    return /^(0|\+84)[0-9]{9,10}$/.test(phone);
}

function redirectToLogin() {
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = `/pages/login.html?redirect=${encodeURIComponent(currentUrl)}`;
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}