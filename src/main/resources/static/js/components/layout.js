export async function loadFragment(selector, url) {
    const element = document.querySelector(selector);
    if (!element) return;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Không tải được fragment: ${url}`);
    }

    element.innerHTML = await response.text();

    if (selector === "#header") {
        setupAccountLink();
    }
}

export function activeHeaderMenu() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    document.querySelectorAll(".nav-link").forEach(link => {
        const page = link.dataset.page;

        const isHome =
            (path === "/" || path.includes("index.html")) &&
            page === "home";

        const isCategory =
            path.includes("product-category.html") &&
            page === type;

        if (isHome || isCategory) {
            link.classList.remove(
                "text-gray-700",
                "dark:text-gray-300"
            );

            link.classList.add(
                "text-red-600",
                "border-b-2",
                "border-red-600",
                "pb-1"
            );
        }
    });
}

function setupAccountLink() {
    const accountLink = document.getElementById("accountLink");

    if (!accountLink) return;

    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");

    if (!token) {
        accountLink.href = "/pages/login.html";
        return;
    }

    let role = null;

    try {
        const user = userJson ? JSON.parse(userJson) : null;
        role = user?.role;
    } catch (error) {
        console.error("Không đọc được user trong localStorage:", error);
    }

    if (role === "ROLE_ADMIN" || role === "ADMIN") {
        accountLink.href = "/pages/admin/dashboard.html";
        return;
    }

    accountLink.href = "/pages/customer-account.html";
}