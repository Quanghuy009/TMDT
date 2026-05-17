const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao đến thấp", value: "price_desc" },
    { label: "Ưu đãi", value: "sale" }
];

export function renderSortBar({
                                  containerId,
                                  currentSort,
                                  shown,
                                  total,
                                  onSortChange
                              }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8 bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high">
            <div class="flex items-center gap-4">
                <span class="text-sm font-semibold text-on-surface">
                    Sắp xếp theo:
                </span>

                <div class="flex flex-wrap gap-2">
                    ${SORT_OPTIONS.map(option => renderSortButton(option, currentSort)).join("")}
                </div>
            </div>

            <p class="text-sm text-secondary font-medium">
                Hiển thị 
                <span id="shown-count" class="text-on-surface">${shown}</span> 
                trên 
                <span id="total-count" class="text-on-surface">${total}</span> 
                sản phẩm
            </p>
        </div>
    `;

    container.querySelectorAll(".sort-option").forEach(button => {
        button.addEventListener("click", () => {
            const sort = button.dataset.sort;
            onSortChange(sort);
        });
    });
}

function renderSortButton(option, currentSort) {
    const activeClass = option.value === currentSort
        ? "bg-primary text-white"
        : "bg-surface-container text-secondary hover:bg-surface-container-high";

    return `
        <button type="button"
            class="sort-option ${activeClass} px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            data-sort="${option.value}">
            ${option.label}
        </button>
    `;
}