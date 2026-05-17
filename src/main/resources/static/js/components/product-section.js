import { renderProductCard } from './product-card.js';
export async function renderProductSection({
                                               containerId,
                                               title,
                                               apiUrl,
                                               emptyMessage
                                           }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <section class="mt-section-gap">
            <div class="flex items-center justify-between mb-8">
                <h2 class="font-h2 text-h2 text-on-surface">${title}</h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter" id="${containerId}-grid"></div>
        </section>
    `;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Không thể tải ${title}`);
        }

        const products = await response.json();
        const grid = document.getElementById(`${containerId}-grid`);

        if (products.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-500">
                    ${emptyMessage}
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(p => renderProductCard(p)).join('');

    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <section class="mt-section-gap">
                <div class="text-center py-12 text-red-500">
                    Không thể tải ${title}
                </div>
            </section>
        `;
    }
}