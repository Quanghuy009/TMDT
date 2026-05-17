export async function loadFragment(selector, url) {
    const element = document.querySelector(selector);
    if (!element) return;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Không tải được fragment: ${url}`);
    }

    element.innerHTML = await response.text();
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