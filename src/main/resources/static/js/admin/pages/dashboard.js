import { loadAdminLayout } from "../admin-layout.js";

const API_URL = "/api/admin/dashboard";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadAdminLayout();

        const rangeSelect = document.getElementById("dashboardRangeSelect");
        const defaultRange = rangeSelect?.value || "7d";

        await loadDashboard(defaultRange);

        rangeSelect?.addEventListener("change", async () => {
            await loadDashboard(rangeSelect.value);
        });
    } catch (error) {
        console.error("Lỗi khởi tạo dashboard:", error);
        alert("Không thể tải dashboard");
    }
});

async function loadDashboard(range = "7d") {
    try {
        setLoadingState();

        const response = await fetch(`${API_URL}?range=${range}`);

        if (!response.ok) {
            throw new Error("Không thể tải dữ liệu dashboard");
        }

        const data = await response.json();

        renderDashboard(data);
    } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard:", error);
    }
}

function setLoadingState() {
    setText("completedRevenueText", "--");
    setText("totalOrdersText", "--");
    setText("newCustomersText", "--");
    setText("totalProductsText", "--");

    setText("pendingOrdersText", "--");
    setText("confirmedOrdersText", "--");
    setText("shippingOrdersText", "--");
    setText("completedOrdersText", "--");
    setText("cancelledOrdersText", "--");

    setText("lowStockCountText", "--");
}

function renderDashboard(data) {
    setText("completedRevenueText", formatCurrency(data.completedRevenue));
    setText("totalOrdersText", data.totalOrders ?? 0);
    setText("newCustomersText", data.newCustomers ?? 0);
    setText("totalProductsText", data.totalProducts ?? 0);

    setText("pendingOrdersText", data.orderStatusStats?.pending ?? 0);
    setText("confirmedOrdersText", data.orderStatusStats?.confirmed ?? 0);
    setText("shippingOrdersText", data.orderStatusStats?.shipping ?? 0);
    setText("completedOrdersText", data.orderStatusStats?.completed ?? 0);
    setText("cancelledOrdersText", data.orderStatusStats?.cancelled ?? 0);

    setText("lowStockCountText", data.lowStockCount ?? 0);

    renderRevenueTrend(data.revenueTrend || []);
    renderTopSellingProducts(data.topSellingProducts || []);
    renderLowStockProducts(data.lowStockProducts || []);
    renderCategoryRevenue(data.categoryRevenue || []);
}

function renderRevenueTrend(items) {
    const container = document.getElementById("revenueChart");
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="w-full h-full flex items-center justify-center text-xs text-secondary bg-surface-container rounded-xl">
                Chưa có dữ liệu doanh thu
            </div>
        `;
        return;
    }

    const maxRevenue = Math.max(...items.map(item => Number(item.revenue || 0)), 1);

    container.innerHTML = items.map(item => {
        const height = Math.max((Number(item.revenue || 0) / maxRevenue) * 100, 8);

        return `
            <div class="flex-1 flex flex-col items-center justify-end gap-2 min-w-[36px]">
                <div title="${formatCurrency(item.revenue)} - ${item.orderCount ?? 0} đơn"
                     class="w-full rounded-t-lg bg-primary-container transition-all hover:opacity-90"
                     style="height: ${height}%"></div>
                <p class="text-[11px] text-secondary text-center whitespace-nowrap">
                    ${escapeHtml(item.label)}
                </p>
            </div>
        `;
    }).join("");
}

function renderTopSellingProducts(items) {
    const container = document.getElementById("topSellingProductList");
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-surface-container text-center text-xs text-secondary">
                Chưa có dữ liệu sản phẩm bán chạy
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="flex items-center gap-3 p-3 hover:bg-surface-container rounded-lg transition-colors">
            <img class="w-11 h-11 rounded-lg object-cover bg-surface-container"
                 src="/images/products/${escapeHtml(item.productImage || "default.jpg")}"
                 alt="${escapeHtml(item.productName)}"
                 onerror="this.src='/images/products/default.jpg'"/>

            <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-on-surface truncate">
                    ${escapeHtml(item.productName)}
                </p>
                <p class="text-[11px] text-secondary">
                    Đã bán: ${item.soldQuantity ?? 0}
                </p>
            </div>

            <p class="text-xs font-bold text-primary whitespace-nowrap">
                ${formatCurrency(item.revenue)}
            </p>
        </div>
    `).join("");
}

function renderLowStockProducts(items) {
    const container = document.getElementById("lowStockProductList");
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-surface-container text-center text-xs text-secondary">
                Không có sản phẩm sắp hết hàng
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container">
            <div class="min-w-0">
                <p class="text-xs font-semibold text-on-surface truncate">
                    ${escapeHtml(item.productName)}
                </p>
                <p class="text-[11px] text-secondary">
                    ${escapeHtml(item.categoryName)} · ${escapeHtml(item.brandName)}
                </p>
            </div>

            <span class="px-2 py-0.5 rounded-full bg-error-container text-error text-[11px] font-bold whitespace-nowrap">
                Còn ${item.quantity ?? 0}
            </span>
        </div>
    `).join("");
}

function renderCategoryRevenue(items) {
    const container = document.getElementById("categoryRevenueChart");
    const summary = document.getElementById("categoryRevenueSummaryText");

    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="w-full h-full flex items-center justify-center text-xs text-secondary bg-surface-container rounded-xl">
                Chưa có dữ liệu doanh thu theo nhóm sản phẩm
            </div>
        `;

        if (summary) {
            summary.textContent = "Chưa có dữ liệu";
        }

        return;
    }

    const maxRevenue = Math.max(...items.map(item => Number(item.revenue || 0)), 1);
    const totalRevenue = items.reduce((sum, item) => sum + Number(item.revenue || 0), 0);

    container.innerHTML = items.map(item => {
        const height = Math.max((Number(item.revenue || 0) / maxRevenue) * 100, 8);

        return `
            <div class="flex-1 flex flex-col items-center justify-end gap-2 min-w-[64px]">
                <div title="${escapeHtml(item.categoryName)}: ${formatCurrency(item.revenue)}"
                     class="w-full rounded-t-lg bg-primary-container transition-all hover:opacity-90"
                     style="height: ${height}%"></div>
                <p class="text-[11px] text-secondary text-center line-clamp-2">
                    ${escapeHtml(item.categoryName)}
                </p>
            </div>
        `;
    }).join("");

    if (summary) {
        summary.textContent = `Tổng doanh thu: ${formatCurrency(totalRevenue)}`;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function formatCurrency(value) {
    if (value === null || value === undefined) {
        return "0 ₫";
    }

    return Number(value).toLocaleString("vi-VN") + " ₫";
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