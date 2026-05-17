export function renderDeviceFilterSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div>
            <h3 class="font-h3 text-spec-label uppercase tracking-wider text-gray-900 mb-4">
                Hãng sản xuất
            </h3>

            <div class="space-y-2">
                ${renderCheckbox('brand', 'Apple')}
                ${renderCheckbox('brand', 'Samsung')}
                ${renderCheckbox('brand', 'Xiaomi')}
                ${renderCheckbox('brand', 'Oppo')}
                ${renderCheckbox('brand', 'Lenovo')}
                ${renderCheckbox('brand', 'Asus')}
                ${renderCheckbox('brand', 'Dell')}
                ${renderCheckbox('brand', 'HP')}
            </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
            <h3 class="font-h3 text-spec-label uppercase tracking-wider text-gray-900 mb-4">
                Mức giá
            </h3>

            <div class="space-y-2">
                ${renderRadio('price', '0-5000000', 'Dưới 5 triệu')}
                ${renderRadio('price', '5000000-10000000', '5 - 10 triệu')}
                ${renderRadio('price', '10000000-20000000', '10 - 20 triệu')}
                ${renderRadio('price', '20000000-', 'Trên 20 triệu')}
            </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
            <h3 class="font-h3 text-spec-label uppercase tracking-wider text-gray-900 mb-4">
                RAM
            </h3>

            <div class="space-y-2">
                ${renderCheckbox('ram', '4GB')}
                ${renderCheckbox('ram', '6GB')}
                ${renderCheckbox('ram', '8GB')}
                ${renderCheckbox('ram', '12GB')}
                ${renderCheckbox('ram', '16GB')}
                ${renderCheckbox('ram', '32GB')}
            </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
            <h3 class="font-h3 text-spec-label uppercase tracking-wider text-gray-900 mb-4">
                Bộ nhớ
            </h3>

            <div class="space-y-2">
                ${renderCheckbox('storage', '64GB')}
                ${renderCheckbox('storage', '128GB')}
                ${renderCheckbox('storage', '256GB')}
                ${renderCheckbox('storage', '512GB')}
                ${renderCheckbox('storage', '1TB')}
            </div>
        </div>
    `;
}

function renderCheckbox(name, value) {
    return `
        <label class="flex items-center gap-3 cursor-pointer group">
            <input 
                class="filter-input rounded border-gray-300 text-red-600 focus:ring-red-500"
                type="checkbox"
                name="${name}"
                value="${value}">
            <span class="text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                ${value}
            </span>
        </label>
    `;
}

function renderRadio(name, value, label) {
    return `
        <label class="flex items-center gap-3 cursor-pointer group">
            <input 
                class="filter-input border-gray-300 text-red-600 focus:ring-red-500"
                type="radio"
                name="${name}"
                value="${value}">
            <span class="text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                ${label}
            </span>
        </label>
    `;
}