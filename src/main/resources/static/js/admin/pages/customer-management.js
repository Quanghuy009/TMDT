import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/customers";

let customers = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        await loadCustomers();

        setupSearch();
    } catch (error) {
        console.error("Lỗi khởi tạo trang quản lý khách hàng:", error);
    }
});

async function loadCustomers() {
    const tableBody = document.getElementById("customerTableBody");
    const countText = document.getElementById("customerCountText");

    try {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                        Đang tải dữ liệu khách hàng...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Không thể tải danh sách khách hàng");
        }

        customers = await response.json();

        renderCustomers(customers);
    } catch (error) {
        console.error("Lỗi tải khách hàng:", error);

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-gutter py-6 text-center text-xs text-error">
                        Không thể tải dữ liệu khách hàng
                    </td>
                </tr>
            `;
        }

        if (countText) {
            countText.textContent = "Lỗi tải dữ liệu";
        }
    }
}

function renderCustomers(customerList) {
    const tableBody = document.getElementById("customerTableBody");
    const countText = document.getElementById("customerCountText");

    if (!tableBody) return;

    if (!customerList || customerList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-gutter py-6 text-center text-xs text-secondary">
                    Không có khách hàng nào
                </td>
            </tr>
        `;

        if (countText) {
            countText.textContent = "Không có khách hàng nào";
        }

        return;
    }

    tableBody.innerHTML = customerList.map(customer => `
        <tr class="hover:bg-surface-container-low transition-colors">

            <td class="px-gutter py-3">
                <div class="flex flex-col min-w-0">
                    <span class="text-xs font-semibold text-on-surface truncate">
                        ${escapeHtml(customer.fullName)}
                    </span>
                    <span class="text-[11px] text-secondary">
                        Tài khoản ${customer.active ? "đang hoạt động" : "đã khóa"}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${escapeHtml(customer.email)}
            </td>

            <td class="px-gutter py-3">
                ${renderRoleBadge(customer.role)}
            </td>

            <td class="px-gutter py-3">
                ${renderStatusBadge(customer.active)}
            </td>

            <td class="px-gutter py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-secondary">
                    ${customer.orderCount ?? 0} đơn
                </span>
            </td>

            <td class="px-gutter py-3 text-xs text-secondary">
                ${formatDate(customer.createdAt)}
            </td>

            <td class="px-gutter py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-container transition-colors text-secondary"
                        title="Xem chi tiết"
                        onclick="viewCustomer(${customer.userId})">
                        <span class="material-symbols-outlined text-[17px]">visibility</span>
                    </button>

                    <button
                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${customer.active ? "hover:bg-error-container text-error" : "hover:bg-surface-container text-secondary"}"
                        title="${customer.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}"
                        onclick="toggleCustomerStatus(${customer.userId})">
                        <span class="material-symbols-outlined text-[17px]">
                            ${customer.active ? "lock" : "lock_open"}
                        </span>
                    </button>

                </div>
            </td>

        </tr>
    `).join("");

    if (countText) {
        countText.textContent = `Hiển thị ${customerList.length} / ${customers.length} khách hàng`;
    }
}

function setupSearch() {
    const searchInput = document.getElementById("customerSearchInput");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.trim().toLowerCase();

        const filteredCustomers = customers.filter(customer => {
            const fullName = customer.fullName || "";
            const email = customer.email || "";
            const role = customer.role || "";

            return fullName.toLowerCase().includes(keyword)
                || email.toLowerCase().includes(keyword)
                || role.toLowerCase().includes(keyword);
        });

        renderCustomers(filteredCustomers);
    });
}

function renderRoleBadge(role) {
    const displayRole = role === "ROLE_ADMIN" ? "Admin" : "Khách hàng";

    const className = role === "ROLE_ADMIN"
        ? "bg-primary-container text-on-primary"
        : "bg-surface-container text-secondary";

    return `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}">
            ${displayRole}
        </span>
    `;
}

function renderStatusBadge(active) {
    if (active) {
        return `
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                Đang hoạt động
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-error-container text-error">
            Đã khóa
        </span>
    `;
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

window.viewCustomer = function (userId) {
    const customer = customers.find(item => Number(item.userId) === Number(userId));

    if (!customer) return;

    alert(
        `Thông tin khách hàng:\n\n` +
        `Họ tên: ${customer.fullName}\n` +
        `Email: ${customer.email}\n` +
        `Vai trò: ${customer.role}\n` +
        `Trạng thái: ${customer.active ? "Đang hoạt động" : "Đã khóa"}\n` +
        `Số đơn hàng: ${customer.orderCount ?? 0}\n` +
        `Ngày tạo: ${formatDate(customer.createdAt)}`
    );
};

window.toggleCustomerStatus = async function (userId) {
    const customer = customers.find(item => Number(item.userId) === Number(userId));

    if (!customer) return;

    const actionText = customer.active ? "khóa" : "mở khóa";

    if (!confirm(`Bạn có chắc muốn ${actionText} tài khoản "${customer.fullName}" không?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${userId}/toggle-active`, {
            method: "PATCH"
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || `${capitalizeFirstLetter(actionText)} tài khoản thất bại`);
        }

        const updatedCustomer = await response.json();

        customers = customers.map(item =>
            Number(item.userId) === Number(userId) ? updatedCustomer : item
        );

        renderCustomers(customers);

        alert(`${capitalizeFirstLetter(actionText)} tài khoản thành công`);
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái khách hàng:", error);
        alert(error.message || "Cập nhật trạng thái khách hàng thất bại");
    }
};

function capitalizeFirstLetter(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}