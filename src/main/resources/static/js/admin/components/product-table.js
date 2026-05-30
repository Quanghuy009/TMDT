export function renderProductTable(products) {
    const tbody = document.getElementById("productTableBody");

    if (!tbody) return;

    if (!products || products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-xs text-secondary">
                    Không có sản phẩm nào.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => renderProductRow(product)).join("");
}

function renderProductRow(product) {
    const imageUrl = product.image
        ? `/images/products/${product.image}`
        : "/images/products/default.jpg";

    return `
        <tr class="hover:bg-surface-container-low transition-colors group">

            <td class="px-gutter py-3">
                <div class="w-14 h-14 bg-white rounded-lg border border-outline-variant overflow-hidden p-1 flex items-center justify-center">
                    <img src="${imageUrl}"
                         alt="${escapeHtml(product.name)}"
                         class="max-w-full max-h-full object-contain"
                         onerror="this.src='/images/products/default.jpg'">
                </div>
            </td>

            <td class="px-gutter py-3">
                <div class="flex flex-col gap-0.5">
                    <span class="text-xs font-semibold text-on-surface leading-5">
                        ${escapeHtml(product.name)}
                    </span>
                    <span class="text-[11px] text-secondary leading-4">
                        ID: ${product.id}
                    </span>
                </div>
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${escapeHtml(product.category)}
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${escapeHtml(product.brand)}
            </td>

            <td class="px-gutter py-3 text-xs text-primary font-bold whitespace-nowrap">
                ${formatCurrency(product.price)}
            </td>

            <td class="px-gutter py-3 text-xs text-on-surface">
                ${formatQuantity(product.quantity)}
            </td>

            <td class="px-gutter py-3 text-right">
                <div class="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">

                    <button class="btn-edit-product p-1.5 text-secondary hover:text-primary hover:bg-red-50 rounded-lg transition-all"
                            data-id="${product.id}"
                            title="Sửa sản phẩm">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    <button class="btn-delete-product p-1.5 text-secondary hover:text-error hover:bg-error-container rounded-lg transition-all"
                            data-id="${product.id}"
                            title="Xóa sản phẩm">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>

                </div>
            </td>

        </tr>
    `;
}

function formatCurrency(value) {
    if (value == null) return "0 ₫";

    return Number(value).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    });
}

function formatQuantity(value) {
    if (value == null) return "0";

    return Number(value).toLocaleString("vi-VN");
}

function escapeHtml(value) {
    if (value == null) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}