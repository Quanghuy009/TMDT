// /js/pages/customer-account.js

import {
    getCustomerProfile,
    updateCustomerProfile,
    getCustomerOrders
} from "../api/customer-api.js";

document.addEventListener("DOMContentLoaded", async () => {
    checkLogin();

    await loadLayout();

    initLogoutButton();
    initProfileForm();

    await loadCustomerAccountPage();
});

function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/pages/login.html";
    }
}

async function loadLayout() {
    await Promise.all([
        loadFragment("header", "/fragments/header.html"),
        loadFragment("footer", "/fragments/footer.html")
    ]);
}

async function loadFragment(elementId, url) {
    const element = document.getElementById(elementId);

    if (!element) return;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Không tải được ${url}`);
        }

        element.innerHTML = await response.text();

        activeHeaderMenu();
    } catch (error) {
        console.error(error);
    }
}

function activeHeaderMenu() {
    const currentPath = window.location.pathname;

    document.querySelectorAll("a[href]").forEach(link => {
        const href = link.getAttribute("href");

        if (!href) return;

        if (
            currentPath.includes("customer-account.html") &&
            href.includes("customer-account.html")
        ) {
            link.classList.add("text-primary-container", "font-bold");
        }
    });
}

async function loadCustomerAccountPage() {
    try {
        showOrdersLoading(true);

        const [profile, orders] = await Promise.all([
            getCustomerProfile(),
            getCustomerOrders()
        ]);

        renderProfile(profile);
        renderOrders(orders || []);

    } catch (error) {
        console.error(error);
        showProfileMessage(error.message || "Không thể tải thông tin tài khoản", "error");
        renderOrders([]);
    } finally {
        showOrdersLoading(false);
    }
}

function renderProfile(profile) {
    const fullName = profile?.fullName || "Khách hàng";
    const email = profile?.email || "";
    const active = profile?.active;

    setText("profileFullNameText", fullName);
    setText("profileEmailText", email);
    setText("profileStatusText", active === false ? "Tạm khóa" : "Đang hoạt động");

    const statusEl = document.getElementById("profileStatusText");
    if (statusEl) {
        statusEl.className = active === false
            ? "mt-1 font-semibold text-red-600"
            : "mt-1 font-semibold text-green-600";
    }

    const fullNameInput = document.getElementById("fullNameInput");
    const emailInput = document.getElementById("emailInput");

    if (fullNameInput) fullNameInput.value = fullName;
    if (emailInput) emailInput.value = email;
}

function initProfileForm() {
    const form = document.getElementById("profileForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullNameInput = document.getElementById("fullNameInput");
        const fullName = fullNameInput?.value.trim();

        if (!fullName) {
            showProfileMessage("Vui lòng nhập họ và tên", "error");
            return;
        }

        try {
            setProfileFormLoading(true);

            const updatedProfile = await updateCustomerProfile({
                fullName: fullName
            });

            renderProfile(updatedProfile);
            showProfileMessage("Cập nhật thông tin thành công", "success");

        } catch (error) {
            console.error(error);
            showProfileMessage(error.message || "Cập nhật thông tin thất bại", "error");
        } finally {
            setProfileFormLoading(false);
        }
    });
}

function renderOrders(orders) {
    const orderCountText = document.getElementById("orderCountText");
    const ordersEmpty = document.getElementById("ordersEmpty");
    const tableWrapper = document.getElementById("ordersTableWrapper");
    const tableBody = document.getElementById("ordersTableBody");
    const mobileList = document.getElementById("ordersMobileList");

    if (orderCountText) {
        orderCountText.textContent = `${orders.length} đơn hàng`;
    }

    if (!orders || orders.length === 0) {
        if (ordersEmpty) ordersEmpty.classList.remove("hidden");
        if (tableWrapper) tableWrapper.classList.add("hidden");
        if (mobileList) mobileList.classList.add("hidden");
        return;
    }

    if (ordersEmpty) ordersEmpty.classList.add("hidden");
    if (tableWrapper) tableWrapper.classList.remove("hidden");
    if (mobileList) mobileList.classList.remove("hidden");

    if (tableBody) {
        tableBody.innerHTML = orders.map(order => renderOrderRow(order)).join("");
    }

    if (mobileList) {
        mobileList.innerHTML = orders.map(order => renderOrderMobileCard(order)).join("");
    }

    bindOrderDetailButtons();
}

function renderOrderRow(order) {
    const orderId = order.orderId || order.id;
    const createdAt = formatDate(order.createdAt);
    const totalAmount = formatCurrency(order.totalAmount);
    const statusBadge = renderStatusBadge(order.status);

    return `
        <tr class="hover:bg-surface-container-low transition">
            <td class="px-6 py-5">
                <span class="font-bold text-primary-container">#${orderId}</span>
            </td>

            <td class="px-6 py-5 text-gray-600">
                ${createdAt}
            </td>

            <td class="px-6 py-5">
                <span class="font-bold">${totalAmount}</span>
            </td>

            <td class="px-6 py-5">
                ${statusBadge}
            </td>

            <td class="px-6 py-5 text-right">
                <button
                    type="button"
                    class="view-order-detail-btn inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-primary transition"
                    data-order-id="${orderId}"
                >
                    <span class="material-symbols-outlined text-lg">visibility</span>
                    Xem chi tiết
                </button>
            </td>
        </tr>
    `;
}

function renderOrderMobileCard(order) {
    const orderId = order.orderId || order.id;
    const createdAt = formatDate(order.createdAt);
    const totalAmount = formatCurrency(order.totalAmount);
    const statusBadge = renderStatusBadge(order.status);

    return `
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="text-sm text-gray-500">Mã đơn hàng</p>
                    <p class="text-lg font-bold text-primary-container">#${orderId}</p>
                </div>
                ${statusBadge}
            </div>

            <div class="mt-4 space-y-2 text-sm">
                <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Ngày đặt</span>
                    <span class="font-semibold text-right">${createdAt}</span>
                </div>

                <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Tổng tiền</span>
                    <span class="font-bold text-right">${totalAmount}</span>
                </div>
            </div>

            <button
                type="button"
                class="view-order-detail-btn mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-white text-sm font-semibold hover:bg-primary transition"
                data-order-id="${orderId}"
            >
                <span class="material-symbols-outlined text-lg">visibility</span>
                Xem chi tiết
            </button>
        </div>
    `;
}

function bindOrderDetailButtons() {
    const buttons = document.querySelectorAll(".view-order-detail-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const orderId = button.dataset.orderId;

            if (!orderId) return;

            window.location.href = `/pages/customer-order-detail.html?id=${orderId}`;
        });
    });
}

function initLogoutButton() {
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/pages/login.html";
    });
}

function showOrdersLoading(isLoading) {
    const ordersLoading = document.getElementById("ordersLoading");

    if (!ordersLoading) return;

    if (isLoading) {
        ordersLoading.classList.remove("hidden");
    } else {
        ordersLoading.classList.add("hidden");
    }
}

function setProfileFormLoading(isLoading) {
    const submitBtn = document.querySelector("#profileForm button[type='submit']");

    if (!submitBtn) return;

    submitBtn.disabled = isLoading;

    if (isLoading) {
        submitBtn.classList.add("opacity-70", "cursor-not-allowed");
        submitBtn.innerHTML = `
            <span class="material-symbols-outlined text-xl animate-spin">progress_activity</span>
            Đang cập nhật...
        `;
    } else {
        submitBtn.classList.remove("opacity-70", "cursor-not-allowed");
        submitBtn.innerHTML = `
            <span class="material-symbols-outlined text-xl">save</span>
            Cập nhật thông tin
        `;
    }
}

function showProfileMessage(message, type = "success") {
    const messageEl = document.getElementById("profileMessage");

    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.classList.remove(
        "hidden",
        "bg-green-50",
        "text-green-700",
        "border",
        "border-green-200",
        "bg-red-50",
        "text-red-700",
        "border-red-200"
    );

    if (type === "success") {
        messageEl.classList.add(
            "bg-green-50",
            "text-green-700",
            "border",
            "border-green-200"
        );
    } else {
        messageEl.classList.add(
            "bg-red-50",
            "text-red-700",
            "border",
            "border-red-200"
        );
    }

    messageEl.classList.remove("hidden");

    setTimeout(() => {
        messageEl.classList.add("hidden");
    }, 3000);
}

function renderStatusBadge(status) {
    const normalizedStatus = String(status || "PENDING").toUpperCase();

    const statusMap = {
        "PENDING": {
            text: "Chờ xử lý",
            className: "bg-yellow-100 text-yellow-700"
        },
        "CONFIRMED": {
            text: "Đã xác nhận",
            className: "bg-blue-100 text-blue-700"
        },
        "SHIPPING": {
            text: "Đang giao",
            className: "bg-indigo-100 text-indigo-700"
        },
        "COMPLETED": {
            text: "Hoàn thành",
            className: "bg-green-100 text-green-700"
        },
        "CANCELLED": {
            text: "Đã hủy",
            className: "bg-red-100 text-red-700"
        }
    };

    const statusInfo = statusMap[normalizedStatus] || {
        text: normalizedStatus,
        className: "bg-gray-100 text-gray-700"
    };

    return `
        <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${statusInfo.className}">
            ${statusInfo.text}
        </span>
    `;
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

function setText(elementId, text) {
    const element = document.getElementById(elementId);

    if (element) {
        element.textContent = text;
    }
}