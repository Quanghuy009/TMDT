import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/orders";

let orderId = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        const params = new URLSearchParams(window.location.search);
        orderId = params.get("id");

        if (!orderId) {
            alert("Thiếu mã đơn hàng");
            window.location.href = "/pages/admin/order-management.html";
            return;
        }

        document.getElementById("btnUpdateOrder").href = `/pages/admin/order-form.html?id=${orderId}`;

        await loadOrderDetail(orderId);
    } catch (error) {
        console.error("Lỗi khởi tạo trang chi tiết đơn hàng:", error);
    }
});

async function loadOrderDetail(id) {
    const container = document.getElementById("orderDetailContainer");

    try {
        container.innerHTML = `
            <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <p class="text-sm text-secondary">Đang tải dữ liệu đơn hàng...</p>
            </section>
        `;

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Không thể tải chi tiết đơn hàng");
        }

        const order = await response.json();

        renderOrderDetail(order);
    } catch (error) {
        console.error("Lỗi tải chi tiết đơn hàng:", error);

        container.innerHTML = `
            <section class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <p class="text-sm text-error">Không thể tải chi tiết đơn hàng</p>
            </section>
        `;
    }
}

function renderOrderDetail(order) {
    const container = document.getElementById("orderDetailContainer");

    document.getElementById("page-title").textContent = `Chi tiết đơn hàng #${order.orderId}`;

    container.innerHTML = `
        <section class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <div class="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
                <div>
                    <h3 class="text-base font-bold text-on-surface">
                        Thông tin đơn hàng
                    </h3>
                    <p class="text-xs text-secondary mt-1">
                        Mã đơn: #${order.orderId}
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    ${renderOrderStatusBadge(order.status)}
                    ${renderPaymentStatusBadge(order.paymentStatus)}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                ${renderInfoItem("Ngày đặt", formatDateTime(order.createdAt))}
                ${renderInfoItem("Phương thức giao hàng", formatDeliveryMethod(order.deliveryMethod))}
                ${renderInfoItem("Phương thức thanh toán", formatPaymentMethod(order.paymentMethod))}
                ${renderInfoItem("Trạng thái đơn", formatOrderStatus(order.status))}
                ${renderInfoItem("Trạng thái thanh toán", formatPaymentStatus(order.paymentStatus))}
                ${renderInfoItem("Mã voucher", order.voucherCode || "Không có")}
            </div>
        </section>

        <section class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <h3 class="text-base font-bold text-on-surface border-b border-outline-variant pb-4 mb-4">
                Thông tin người nhận
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                ${renderInfoItem("Tên khách hàng", order.customerName)}
                ${renderInfoItem("Số điện thoại", order.phone)}
                ${renderInfoItem("Tỉnh/Thành", order.province || "Chưa cập nhật")}
                ${renderInfoItem("Quận/Huyện", order.district || "Chưa cập nhật")}
                ${renderInfoItem("Địa chỉ", order.address, true)}
                ${renderInfoItem("Ghi chú", order.note || "Không có", true)}
            </div>
        </section>

        <section class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div class="p-5 border-b border-outline-variant">
                <h3 class="text-base font-bold text-on-surface">
                    Sản phẩm trong đơn
                </h3>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                    <tr class="bg-surface-container border-b border-outline-variant">
                        <th class="px-gutter py-3 text-[11px] font-bold text-secondary uppercase tracking-wider">Sản phẩm</th>
                        <th class="px-gutter py-3 text-[11px] font-bold text-secondary uppercase tracking-wider">Đơn giá</th>
                        <th class="px-gutter py-3 text-[11px] font-bold text-secondary uppercase tracking-wider">Số lượng</th>
                        <th class="px-gutter py-3 text-[11px] font-bold text-secondary uppercase tracking-wider text-right">Thành tiền</th>
                    </tr>
                    </thead>

                    <tbody class="divide-y divide-outline-variant">
                        ${(order.items || []).map(item => `
                            <tr class="hover:bg-surface-container-low transition-colors">
                                <td class="px-gutter py-3">
                                    <div class="flex items-center gap-3">
                                        <img class="w-12 h-12 rounded-lg object-cover bg-surface-container"
                                             src="/images/products/${escapeHtml(item.productImage || "default.jpg")}"
                                             alt="${escapeHtml(item.productName)}"
                                             onerror="this.src='/images/products/default.jpg'"/>

                                        <div class="flex flex-col">
                                            <span class="text-xs font-semibold text-on-surface">
                                                ${escapeHtml(item.productName)}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-gutter py-3 text-xs text-on-surface">
                                    ${formatCurrency(item.unitPrice)}
                                </td>

                                <td class="px-gutter py-3 text-xs text-on-surface">
                                    ${item.quantity}
                                </td>

                                <td class="px-gutter py-3 text-xs font-semibold text-on-surface text-right">
                                    ${formatCurrency(item.totalPrice)}
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm">
            <h3 class="text-base font-bold text-on-surface border-b border-outline-variant pb-4 mb-4">
                Tổng kết thanh toán
            </h3>

            <div class="max-w-md ml-auto space-y-3 text-sm">
                ${renderPriceRow("Tạm tính", order.subtotal)}
                ${renderPriceRow("Phí vận chuyển", order.shippingFee)}
                ${renderPriceRow("Giảm giá", order.discountAmount)}
                <div class="border-t border-outline-variant pt-3 flex justify-between items-center">
                    <span class="font-bold text-on-surface">Tổng tiền</span>
                    <span class="font-bold text-primary text-lg">${formatCurrency(order.totalAmount)}</span>
                </div>
            </div>
        </section>
    `;
}

function renderInfoItem(label, value, full = false) {
    return `
        <div class="${full ? "md:col-span-2" : ""}">
            <p class="text-[11px] font-semibold text-secondary mb-1">${label}</p>
            <p class="text-sm font-medium text-on-surface">${escapeHtml(value || "Chưa cập nhật")}</p>
        </div>
    `;
}

function renderPriceRow(label, value) {
    return `
        <div class="flex justify-between items-center">
            <span class="text-secondary">${label}</span>
            <span class="font-semibold text-on-surface">${formatCurrency(value)}</span>
        </div>
    `;
}

function renderOrderStatusBadge(status) {
    const config = {
        PENDING: ["Chờ xác nhận", "bg-yellow-100 text-yellow-700"],
        CONFIRMED: ["Đã xác nhận", "bg-blue-100 text-blue-700"],
        SHIPPING: ["Đang giao", "bg-purple-100 text-purple-700"],
        COMPLETED: ["Hoàn thành", "bg-green-100 text-green-700"],
        CANCELLED: ["Đã hủy", "bg-error-container text-error"]
    }[status] || [status || "Không rõ", "bg-surface-container text-secondary"];

    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${config[1]}">${config[0]}</span>`;
}

function renderPaymentStatusBadge(status) {
    const config = {
        UNPAID: ["Chưa thanh toán", "bg-yellow-100 text-yellow-700"],
        PAID: ["Đã thanh toán", "bg-green-100 text-green-700"],
        FAILED: ["Thanh toán lỗi", "bg-error-container text-error"],
        REFUNDED: ["Đã hoàn tiền", "bg-blue-100 text-blue-700"]
    }[status] || [status || "Không rõ", "bg-surface-container text-secondary"];

    return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${config[1]}">${config[0]}</span>`;
}

function formatOrderStatus(status) {
    return {
        PENDING: "Chờ xác nhận",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao hàng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy"
    }[status] || status || "Không rõ";
}

function formatPaymentStatus(status) {
    return {
        UNPAID: "Chưa thanh toán",
        PAID: "Đã thanh toán",
        FAILED: "Thanh toán lỗi",
        REFUNDED: "Đã hoàn tiền"
    }[status] || status || "Không rõ";
}

function formatDeliveryMethod(value) {
    return {
        HOME_DELIVERY: "Giao hàng tận nơi",
        STORE_PICKUP: "Nhận tại cửa hàng"
    }[value] || value || "Không rõ";
}

function formatPaymentMethod(value) {
    return {
        COD: "Thanh toán khi nhận hàng",
        BANK_TRANSFER: "Chuyển khoản",
        E_WALLET: "Ví điện tử"
    }[value] || value || "Không rõ";
}

function formatCurrency(value) {
    if (value === null || value === undefined) return "0 ₫";
    return Number(value).toLocaleString("vi-VN") + " ₫";
}

function formatDateTime(value) {
    if (!value) return "Chưa có";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("vi-VN");
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