export async function loadAdminLayout(activePage) {
    await Promise.all([
        loadFragment("admin-sidebar", "/fragments/admin/admin-sidebar.html"),
        loadFragment("admin-topbar", "/fragments/admin/admin-topbar.html")
    ]);

    activeAdminMenu(activePage);
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

function activeAdminMenu(activePage) {
    const menuItems = document.querySelectorAll(".admin-menu-item");

    menuItems.forEach(item => {
        if (item.dataset.page === activePage) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}