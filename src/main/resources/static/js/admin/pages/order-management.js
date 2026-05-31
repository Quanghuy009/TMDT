import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/orders";

let orders = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        await loadOrders();

        setupFilters();
    } catch (error) {
        console.error("Lỗi khởi tạo trang quản lý đơn hàng:", error);
    }
});

async function loadOrders() {
    const tableBody = document.getElementById("orderTableBody");
    const countText = document.getElementById("orderCountText");

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-gutter py-6 text-center text-xs text-secondary">
                        Đang tải dữ liệu đơn hàng...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách đơn hàng");
        }

        orders = await response.json();

        renderOrders(orders);
    } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="px-gutter py-6 text-center text-xs text-error">
                        Không thể tải dữ liệu đơn hàng
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = "Lỗi tải dữ liệu";
        }
    }
}

function renderOrders(orderList) {
    const tableBody = document.getElementById("orderTableBody");
    const countText = document.getElementById("orderCountText");

    if (!tableBody) return;

    if (!orderList || orderList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-gutter py-6 text-center text-xs text-secondary">
                    Không có đơn hàng nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Không có đơn hàng nào";
        }

        return;
    }

    tableBody.innerHTML = orderList.map(order => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-3 text-xs font-semibold text-on-surface whitespace-nowrap">
                #${order.orderId}
            </td>

            <td class="px-gutter py-3">
                <div class="flex flex-col min-w-0">
                    <span class="text-xs font-semibold text-on-surface truncate">
                        ${escapeHtml(order.customerName)}
                    </span>
                    <span class="text-[11px] text-secondary">
                        ${escapeHtml(order.address || "Chưa có địa chỉ")}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface whitespace-nowrap">
                ${escapeHtml(order.phone)}
            </td>

            <td class="px-gutter py-3 text-xs font-semibold text-on-surface whitespace-nowrap">
                ${formatCurrency(order.totalAmount)}
            </td>

            <td class="px-gutter py-3 whitespace-nowrap">
                ${renderOrderStatusBadge(order.status)}
            </td>

            <td class="px-gutter py-3 whitespace-nowrap">
                ${renderPaymentStatusBadge(order.paymentStatus)}
            </td>

            <td class="px-gutter py-3 text-xs text-secondary whitespace-nowrap">
                ${formatDate(order.createdAt)}
            </td>

            <td class="px-gutter py-3 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Xem chi tiết"
                        onclick="viewOrder(${order.orderId})">
                        <span class="material-symbols-outlined text-[17px]">visibility</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Cập nhật đơn hàng"
                        onclick="updateOrder(${order.orderId})">
                        <span class="material-symbols-outlined text-[17px]">edit</span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${orderList.length} / ${orders.length} đơn hàng`;
    }
}

function setupFilters() {
    const searchInput = document.getElementById("orderSearchInput");
    const orderStatusFilter = document.getElementById("orderStatusFilter");
    const paymentStatusFilter = document.getElementById("paymentStatusFilter");

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (orderStatusFilter) {
        orderStatusFilter.addEventListener("change", applyFilters);
    }

    if (paymentStatusFilter) {
        paymentStatusFilter.addEventListener("change", applyFilters);
    }
}

function applyFilters() {
    const searchInput = document.getElementById("orderSearchInput");
    const orderStatusFilter = document.getElementById("orderStatusFilter");
    const paymentStatusFilter = document.getElementById("paymentStatusFilter");

    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const status = orderStatusFilter ? orderStatusFilter.value : "";
    const paymentStatus = paymentStatusFilter ? paymentStatusFilter.value : "";

    const filteredOrders = orders.filter(order => {
        const orderId = String(order.orderId || "");
        const customerName = order.customerName || "";
        const phone = order.phone || "";

        const matchKeyword =
            orderId.includes(keyword) ||
            customerName.toLowerCase().includes(keyword) ||
            phone.toLowerCase().includes(keyword);

        const matchStatus = !status || order.status === status;
        const matchPaymentStatus = !paymentStatus || order.paymentStatus === paymentStatus;

        return matchKeyword && matchStatus && matchPaymentStatus;
    });

    renderOrders(filteredOrders);
}

function renderOrderStatusBadge(status) {
    const statusMap = {
        PENDING: {
            text: "Chờ xác nhận",
            className: "bg-yellow-100 text-yellow-700"
        },
        CONFIRMED: {
            text: "Đã xác nhận",
            className: "bg-blue-100 text-blue-700"
        },
        SHIPPING: {
            text: "Đang giao",
            className: "bg-purple-100 text-purple-700"
        },
        COMPLETED: {
            text: "Hoàn thành",
            className: "bg-green-100 text-green-700"
        },
        CANCELLED: {
            text: "Đã hủy",
            className: "bg-error-container text-error"
        }
    };

    const config = statusMap[status] || {
        text: status || "Không rõ",
        className: "bg-surface-container text-secondary"
    };

    return `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.className}">
            ${config.text}
        </span>
    `;
}

function renderPaymentStatusBadge(paymentStatus) {
    const statusMap = {
        UNPAID: {
            text: "Chưa thanh toán",
            className: "bg-yellow-100 text-yellow-700"
        },
        PAID: {
            text: "Đã thanh toán",
            className: "bg-green-100 text-green-700"
        },
        FAILED: {
            text: "Thanh toán lỗi",
            className: "bg-error-container text-error"
        },
        REFUNDED: {
            text: "Đã hoàn tiền",
            className: "bg-blue-100 text-blue-700"
        }
    };

    const config = statusMap[paymentStatus] || {
        text: paymentStatus || "Không rõ",
        className: "bg-surface-container text-secondary"
    };

    return `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.className}">
            ${config.text}
        </span>
    `;
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "0 ₫";
    }

    return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatDate(value) {
    if (!value) return "Chưa có";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("vi-VN");
}

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

window.viewOrder = function (orderId) {
    window.location.href = `/pages/admin/order-detail.html?id=${orderId}`;
};

window.updateOrder = function (orderId) {
    window.location.href = `/pages/admin/order-form.html?id=${orderId}`;
};