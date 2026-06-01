import {
    getCustomerOrderDetail
} from "../api/customer-api.js";

import {
    loadFragment,
    activeHeaderMenu
} from "../components/layout.js";

document.addEventListener("DOMContentLoaded", async () => {
    checkLogin();

    await loadLayout();

    const orderId = getOrderIdFromUrl();

    if (!orderId) {
        showError("Không tìm thấy mã đơn hàng");
        return;
    }

    await loadOrderDetail(orderId);
});

function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/pages/login.html";
    }
}

async function loadLayout() {
    await Promise.all([
        loadFragment("#header", "/fragments/header.html"),
        loadFragment("#footer", "/fragments/footer.html")
    ]);

    activeHeaderMenu();
}

function getOrderIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadOrderDetail(orderId) {
    try {
        showLoading(true);

        const order = await getCustomerOrderDetail(orderId);

        renderOrderDetail(order);

    } catch (error) {
        console.error(error);
        showError(error.message || "Không thể tải chi tiết đơn hàng");
    } finally {
        showLoading(false);
    }
}

function renderOrderDetail(order) {
    setText("orderTitle", `Chi tiết đơn hàng #${order.orderId}`);
    setText("orderIdText", `#${order.orderId}`);
    setText("orderCreatedAtText", formatDate(order.createdAt));
    setText("orderStatusText", translateOrderStatus(order.status));
    setText("paymentMethodText", translatePaymentMethod(order.paymentMethod));
    setText("paymentStatusText", translatePaymentStatus(order.paymentStatus));

    setText("customerNameText", order.customerName);
    setText("phoneText", order.phone);
    setText("addressText", buildAddress(order));
    setText("noteText", order.note || "Không có ghi chú");

    setText("subtotalText", formatCurrency(order.subtotal));
    setText("shippingFeeText", formatCurrency(order.shippingFee));
    setText("discountAmountText", formatCurrency(order.discountAmount));
    setText("totalAmountText", formatCurrency(order.totalAmount));

    renderOrderItems(order.items || []);
}

function renderOrderItems(items) {
    const container = document.getElementById("orderItemsContainer");

    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                Đơn hàng chưa có sản phẩm
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const image = getProductImageUrl(item.productImage);

        return `
            <div class="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0">
                <img
                    src="${image}"
                    alt="${escapeHtml(item.productName || 'Sản phẩm')}"
                    class="w-20 h-20 rounded-xl object-cover bg-gray-100"
                    onerror="this.onerror=null; this.src='/images/products/default.jpg';"
                >

                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 line-clamp-2">
                        ${escapeHtml(item.productName || 'Sản phẩm')}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                        Số lượng: ${item.quantity || 0}
                    </p>
                </div>

                <div class="text-right">
                    <p class="text-sm text-gray-500">
                        ${formatCurrency(item.unitPrice)}
                    </p>
                    <p class="font-bold text-primary-container mt-1">
                        ${formatCurrency(item.totalPrice)}
                    </p>
                </div>
            </div>
        `;
    }).join("");
}

function getProductImageUrl(image) {
    if (!image || image.trim() === "") {
        return "/images/products/default.jpg";
    }

    const imageName = image.trim();

    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
        return imageName;
    }

    if (imageName.startsWith("/images/products/")) {
        return imageName;
    }

    if (imageName.startsWith("images/products/")) {
        return "/" + imageName;
    }

    if (imageName.startsWith("/images/")) {
        return imageName;
    }

    if (imageName.startsWith("images/")) {
        return "/" + imageName;
    }

    return `/images/products/${imageName}`;
}

function buildAddress(order) {
    const parts = [
        order.address,
        order.district,
        order.province
    ].filter(Boolean);

    return parts.join(", ");
}

function showLoading(isLoading) {
    const loading = document.getElementById("orderDetailLoading");
    const content = document.getElementById("orderDetailContent");

    if (loading) {
        loading.classList.toggle("hidden", !isLoading);
    }

    if (content) {
        content.classList.toggle("hidden", isLoading);
    }
}

function showError(message) {
    const errorBox = document.getElementById("orderDetailError");
    const content = document.getElementById("orderDetailContent");
    const loading = document.getElementById("orderDetailLoading");

    if (loading) loading.classList.add("hidden");
    if (content) content.classList.add("hidden");

    if (errorBox) {
        errorBox.classList.remove("hidden");
        errorBox.textContent = message;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value || "Không có thông tin";
    }
}

function formatCurrency(value) {
    const number = Number(value || 0);

    return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    });
}

function formatDate(value) {
    if (!value) return "Không xác định";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Không xác định";
    }

    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function translateOrderStatus(status) {
    const map = {
        PENDING: "Chờ xử lý",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy"
    };

    return map[status] || status || "Không xác định";
}

function translatePaymentMethod(method) {
    const map = {
        COD: "Thanh toán khi nhận hàng",
        BANK_TRANSFER: "Chuyển khoản ngân hàng",
        MOMO: "Ví MoMo",
        VNPAY: "VNPay"
    };

    return map[method] || method || "Không xác định";
}

function translatePaymentStatus(status) {
    const map = {
        UNPAID: "Chưa thanh toán",
        PAID: "Đã thanh toán",
        FAILED: "Thanh toán thất bại",
        REFUNDED: "Đã hoàn tiền"
    };

    return map[status] || status || "Không xác định";
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}