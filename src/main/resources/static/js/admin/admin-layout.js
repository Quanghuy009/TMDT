export async function loadAdminLayout(activePage = null) {
    await Promise.all([
        loadFragment("admin-sidebar", "/fragments/admin/admin-sidebar.html"),
        loadFragment("admin-topbar", "/fragments/admin/admin-topbar.html")
    ]);

    const page = activePage || detectActivePage();
    activeAdminMenu(page);
}

async function loadFragment(elementId, url) {
    const target = document.getElementById(elementId);

    if (!target) {
        console.error(`Không tìm thấy phần tử #${elementId}`);
        return;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Không tải được fragment: ${url}`);
    }

    target.innerHTML = await response.text();
}

function detectActivePage() {
    const path = window.location.pathname;

    if (path.includes("dashboard")) {
        return "dashboard";
    }

    if (
        path.includes("product-management") ||
        path.includes("product-form")
    ) {
        return "products";
    }

    if (
        path.includes("category-management") ||
        path.includes("category-form")
    ) {
        return "categories";
    }

    if (
        path.includes("brand-management") ||
        path.includes("brand-form")
    ) {
        return "brands";
    }

    if (path.includes("order-management")) {
        return "orders";
    }

    if (path.includes("customer-management")) {
        return "customers";
    }

    if (path.includes("promotion-management")) {
        return "promotions";
    }

    return "";
}

function activeAdminMenu(activePage) {
    const menuItems = document.querySelectorAll(".admin-menu-item");

    menuItems.forEach(item => {
        const isActive = item.dataset.page === activePage;

        item.classList.toggle("active", isActive);

        if (isActive) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });
}