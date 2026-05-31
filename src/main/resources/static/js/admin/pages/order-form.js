import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/orders";

let orderId = null;
let currentOrder = null;

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

        document.getElementById("btnBack").href = `/pages/admin/order-detail.html?id=${orderId}`;

        await loadOrder(orderId);

        setupSubmitForm();
    } catch (error) {
        console.error("Lỗi khởi tạo form đơn hàng:", error);
        alert("Có lỗi khi tải trang cập nhật đơn hàng");
    }
});

async function loadOrder(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Không thể tải dữ liệu đơn hàng");
        }

        currentOrder = await response.json();

        fillForm(currentOrder);
    } catch (error) {
        console.error("Lỗi tải dữ liệu đơn hàng:", error);
        alert("Không thể tải dữ liệu đơn hàng");
        window.location.href = "/pages/admin/order-management.html";
    }
}

function fillForm(order) {
    document.getElementById("page-title").textContent = `Cập nhật đơn hàng #${order.orderId}`;

    document.getElementById("status").value = order.status || "PENDING";
    document.getElementById("paymentStatus").value = order.paymentStatus || "UNPAID";

    document.getElementById("customerName").value = order.customerName || "";
    document.getElementById("phone").value = order.phone || "";
    document.getElementById("province").value = order.province || "";
    document.getElementById("district").value = order.district || "";
    document.getElementById("address").value = order.address || "";
    document.getElementById("note").value = order.note || "";

    document.getElementById("subtotalText").textContent = formatCurrency(order.subtotal);
    document.getElementById("shippingFeeText").textContent = formatCurrency(order.shippingFee);
    document.getElementById("discountAmountText").textContent = formatCurrency(order.discountAmount);
    document.getElementById("totalAmountText").textContent = formatCurrency(order.totalAmount);

    updateEditableState(order.status);
}

function setupSubmitForm() {
    const form = document.getElementById("order-form");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            customerName: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            address: document.getElementById("address").value.trim(),
            province: document.getElementById("province").value.trim(),
            district: document.getElementById("district").value.trim(),
            note: document.getElementById("note").value.trim(),
            status: document.getElementById("status").value,
            paymentStatus: document.getElementById("paymentStatus").value
        };

        if (!payload.customerName) {
            alert("Vui lòng nhập tên người nhận");
            return;
        }

        if (!payload.phone) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }

        if (!payload.address) {
            alert("Vui lòng nhập địa chỉ");
            return;
        }

        await updateOrder(payload);
    });
}

async function updateOrder(payload) {
    try {
        const response = await fetch(`${API_URL}/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Cập nhật đơn hàng thất bại");
        }

        alert("Cập nhật đơn hàng thành công");

        window.location.href = `/pages/admin/order-detail.html?id=${orderId}`;
    } catch (error) {
        console.error("Lỗi cập nhật đơn hàng:", error);
        alert(error.message || "Cập nhật đơn hàng thất bại");
    }
}

function updateEditableState(status) {
    const shippingFields = [
        "customerName",
        "phone",
        "province",
        "district",
        "address",
        "note"
    ];

    const readonlyShippingInfo = status === "SHIPPING"
        || status === "COMPLETED"
        || status === "CANCELLED";

    shippingFields.forEach(id => {
        const field = document.getElementById(id);

        if (!field) return;

        field.disabled = readonlyShippingInfo;

        if (readonlyShippingInfo) {
            field.classList.add("bg-slate-100", "cursor-not-allowed");
        } else {
            field.classList.remove("bg-slate-100", "cursor-not-allowed");
        }
    });
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "0 ₫";
    }

    return Number(value).toLocaleString("vi-VN") + " ₫";
}