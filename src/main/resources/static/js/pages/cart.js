import {
    getMyCart,
    updateCartItem,
    removeCartItem
} from "../api/cart-api.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadLayout();
    await loadCart();
});

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

async function loadCart() {
    try {
        const cart = await getMyCart();
        renderCart(cart);
    } catch (error) {
        console.error(error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        showCartError("Không thể tải giỏ hàng");
    }
}

function renderCart(cart) {
    const container = document.getElementById("cart-items-container");
    const cartTitle = document.getElementById("cart-title");

    if (!container || !cartTitle) return;

    const items = cart.items || [];

    cartTitle.textContent = `Sản phẩm trong giỏ (${items.length})`;

    if (items.length === 0) {
        container.innerHTML = renderEmptyCart();
        renderSummary(0, 0);
        return;
    }

    container.innerHTML = items.map(renderCartItem).join("");

    const totalQuantity = items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0);
    }, 0);

    const subtotal = getCartSubtotal(cart, items);

    renderSummary(totalQuantity, subtotal);
    bindCartItemEvents();
}

function renderCartItem(item) {
    const imageUrl = item.image
        ? `/images/products/${item.image}`
        : "/images/products/default.jpg";

    const unitPrice = getItemPrice(item);
    const quantity = Number(item.quantity || 1);
    const lineTotal = unitPrice * quantity;

    return `
        <div class="p-6 flex flex-col sm:flex-row gap-6" data-cart-item-id="${item.cartItemId}">
            <div class="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2">
                <img
                    class="max-w-full max-h-full object-contain"
                    src="${imageUrl}"
                    alt="${item.productName || "Sản phẩm"}">
            </div>

            <div class="flex-grow flex flex-col justify-between">
                <div>
                    <h4 class="font-h3 text-body-lg text-on-surface">
                        ${item.productName || "Tên sản phẩm"}
                    </h4>
                    <p class="text-caption text-secondary mt-1">
                        Sản phẩm chính hãng
                    </p>
                </div>

                <div class="flex items-center gap-4 mt-4">
                    <div class="flex items-center border border-outline-variant rounded-lg">
                        <button
                            class="decrease-btn px-3 py-1 hover:bg-surface-container"
                            data-cart-item-id="${item.cartItemId}"
                            data-current-quantity="${quantity}">
                            -
                        </button>

                        <span class="px-4 py-1 text-spec-label">
                            ${quantity}
                        </span>

                        <button
                            class="increase-btn px-3 py-1 hover:bg-surface-container"
                            data-cart-item-id="${item.cartItemId}"
                            data-current-quantity="${quantity}">
                            +
                        </button>
                    </div>

                    <button
                        class="remove-btn text-caption text-secondary hover:text-error flex items-center gap-1"
                        data-cart-item-id="${item.cartItemId}">
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
    try {
        const updatedCart = await updateCartItem(cartItemId, quantity);
        renderCart(updatedCart);
    } catch (error) {
        console.error(error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        alert("Không thể cập nhật số lượng sản phẩm");
    }
}

async function handleRemoveItem(cartItemId) {
    const confirmed = confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?");

    if (!confirmed) return;

    try {
        const updatedCart = await removeCartItem(cartItemId);
        renderCart(updatedCart);
    } catch (error) {
        console.error(error);

        if (error.message === "UNAUTHORIZED") {
            redirectToLogin();
            return;
        }

        alert("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
}

function renderSummary(totalQuantity, subtotal) {
    const subtotalLabel = document.getElementById("summary-subtotal-label");
    const subtotalElement = document.getElementById("summary-subtotal");
    const discountElement = document.getElementById("summary-discount");
    const totalElement = document.getElementById("summary-total");

    const discount = 0;
    const total = subtotal - discount;

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
                ${message}
            </h3>

            <button
                onclick="window.location.reload()"
                class="mt-4 bg-primary-container text-white px-6 py-3 rounded-xl font-bold">
                Tải lại
            </button>
        </div>
    `;
}

function redirectToLogin() {
    const currentUrl = window.location.pathname + window.location.search;
    window.location.href = `/pages/login.html?redirect=${encodeURIComponent(currentUrl)}`;
}

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
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
    if (cart.totalPrice !== undefined && cart.totalPrice !== null) {
        return Number(cart.totalPrice);
    }

    if (cart.totalAmount !== undefined && cart.totalAmount !== null) {
        return Number(cart.totalAmount);
    }

    return items.reduce((sum, item) => {
        const price = getItemPrice(item);
        const quantity = Number(item.quantity || 1);

        return sum + price * quantity;
    }, 0);
}