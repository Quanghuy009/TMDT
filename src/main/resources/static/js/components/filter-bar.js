export function renderFilterBar({
                                    containerId,
                                    filters,
                                    selectedFilters,
                                    onFilterChange,
                                    onApply,
                                    onClear
                                }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="relative bg-surface-container-lowest border border-surface-container-high rounded-xl p-4 pb-20">
        <div class="flex flex-wrap items-center gap-4">

            <div class="flex items-center gap-2 mr-2">
                <span class="material-symbols-outlined text-primary">filter_alt</span>
                <span class="text-sm font-bold uppercase tracking-wider text-on-surface">
                    Bộ lọc
                </span>
            </div>

            ${filters.map(filter => renderFilterButton(filter, selectedFilters)).join("")}

        </div>

        <div class="absolute bottom-4 right-4 flex items-center gap-3">
            <button id="clear-filter-btn"
                class="border border-outline-variant text-secondary text-sm font-semibold px-4 py-2 rounded-lg hover:border-primary hover:text-primary transition-all">
                Xóa lọc
            </button>

            <button id="apply-filter-btn"
                class="bg-primary text-white text-sm font-bold px-6 py-2 rounded-lg uppercase hover:opacity-90 transition-all shadow-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">check</span>
                <span>Áp dụng</span>
            </button>
        </div>
    </div>
`;

    bindFilterEvents(container, filters, selectedFilters, onFilterChange, onApply, onClear);
}

function renderFilterButton(filter, selectedFilters) {
    const selectedValue = selectedFilters[filter.key];

    const buttonActiveClass = selectedValue
        ? "bg-surface-container-low border border-primary text-primary"
        : "bg-surface-container-lowest border border-outline-variant hover:border-primary";

    const label = selectedValue
        ? `${filter.label}: ${getOptionLabel(filter, selectedValue)}`
        : filter.label;

    return `
        <div class="relative filter-button" data-filter-key="${filter.key}">
            <button type="button"
                class="filter-toggle flex items-center gap-2 ${buttonActiveClass} px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <span>${label}</span>
                <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </button>

            <div class="hidden absolute left-0 top-full mt-2 w-72 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high z-40 filter-popover">
                <div class="p-4">
                    <h4 class="text-xs font-bold uppercase text-secondary tracking-wider mb-2">
                        ${filter.popoverTitle}
                    </h4>

                    <div class="${filter.type === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"}">
                        ${renderFilterOptions(filter, selectedValue)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFilterOptions(filter, selectedValue) {
    return filter.options.map(option => {
        const optionValue = typeof option === "string" ? option : option.value;
        const optionLabel = typeof option === "string" ? option : option.label;

        const activeClass = selectedValue === optionValue
            ? "border border-primary text-primary bg-primary/5 font-semibold"
            : "border border-outline-variant font-medium hover:border-primary";

        const layoutClass = filter.type === "grid"
            ? "px-3 py-2 rounded text-xs"
            : "w-full text-left px-3 py-2 rounded text-xs";

        return `
            <button type="button"
                class="filter-option ${activeClass} ${layoutClass}"
                data-filter-key="${filter.key}"
                data-filter-value="${optionValue}">
                ${optionLabel}
            </button>
        `;
    }).join("");
}

function bindFilterEvents(container, filters, selectedFilters, onFilterChange, onApply, onClear) {
    container.querySelectorAll(".filter-toggle").forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();

            const wrapper = button.closest(".filter-button");
            const popover = wrapper.querySelector(".filter-popover");

            closeAllPopovers(container, popover);
            popover.classList.toggle("hidden");
        });
    });

    container.querySelectorAll(".filter-option").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.filterKey;
            const value = button.dataset.filterValue;

            onFilterChange(key, value);
        });
    });

    const applyButton = document.getElementById("apply-filter-btn");
    if (applyButton) {
        applyButton.addEventListener("click", onApply);
    }

    const clearButton = document.getElementById("clear-filter-btn");
    if (clearButton) {
        clearButton.addEventListener("click", () => {
            onClear();
        });
    }

    document.addEventListener("click", () => {
        closeAllPopovers(container);
    });
}

function closeAllPopovers(container, exceptPopover = null) {
    container.querySelectorAll(".filter-popover").forEach(popover => {
        if (popover !== exceptPopover) {
            popover.classList.add("hidden");
        }
    });
}

function getOptionLabel(filter, value) {
    const found = filter.options.find(option => {
        const optionValue = typeof option === "string" ? option : option.value;
        return optionValue === value;
    });

    if (!found) return value;

    return typeof found === "string" ? found : found.label;
}
