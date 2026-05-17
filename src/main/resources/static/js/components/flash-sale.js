let countdownInterval = null;

export async function renderFlashSale() {
    const container = document.getElementById('flash-sale');
    if (!container) return;

    try {
        const response = await fetch('/api/flash-sale/current');

        if (!response.ok) {
            throw new Error('Không thể tải flash sale');
        }

        const flashSale = await response.json();

        if (!flashSale || !flashSale.products || flashSale.products.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <section class="mt-section-gap">
                <div class="flex items-end justify-between mb-8">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <span 
                                class="material-symbols-outlined text-primary-container" 
                                style="font-variation-settings: 'FILL' 1;">
                                bolt
                            </span>
                            <h2 class="font-h2 text-h2 text-on-surface">
                                FLASH SALE
                            </h2>
                        </div>

                        <div class="flex gap-2 items-center">
                            <span class="text-sm font-medium text-gray-500 uppercase">
                                Kết thúc sau:
                            </span>

                            <div class="flex gap-1" id="flash-sale-countdown">
                                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
                                <span class="text-on-surface font-bold">:</span>
                                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
                                <span class="text-on-surface font-bold">:</span>
                                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
                    ${flashSale.products.map(p => renderFlashSaleCard(p)).join('')}
                </div>
            </section>
        `;

        startCountdown(flashSale.endTime);

    } catch (error) {
        console.error(error);
        container.innerHTML = '';
    }
}

function renderFlashSaleCard(p) {
    const imageUrl = p.image
        ? `/images/products/${p.image}`
        : '/images/products/default.jpg';

    const soldPercent = p.soldPercent ?? 0;

    return `
        <div class="bg-white border border-gray-300 rounded-xl p-card-padding group ambient-lift transition-all cursor-pointer"
             onclick="window.location.href='/pages/product-detail.html?id=${p.id}'">

            <div class="relative mb-4">
                <span class="absolute top-0 left-0 bg-primary-container text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    -${p.discountPercent}%
                </span>

                <img
                    class="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                    src="${imageUrl}"
                    alt="${p.name}">
            </div>

            <div class="space-y-2">
                <h3 class="font-h3 text-sm text-on-surface line-clamp-2 min-h-[42px]">
                    ${p.name}
                </h3>

                <div class="flex flex-col">
                    <span class="text-primary-container font-bold text-lg">
                        ${Number(p.salePrice).toLocaleString('vi-VN')}đ
                    </span>

                    <span class="text-gray-400 text-xs line-through">
                        ${Number(p.price).toLocaleString('vi-VN')}đ
                    </span>
                </div>
            </div>

            <div class="h-1.5 w-full bg-gray-100 rounded-full relative overflow-hidden mt-4">
                <div 
                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-container to-red-400"
                    style="width: ${soldPercent}%">
                </div>
            </div>


            <div class="flex gap-2 pt-2">
                <button
                    onclick="addToCart(${p.id}); event.stopPropagation();"
                    class="flex-1 bg-primary-container hover:bg-primary text-white text-sm font-bold py-2 rounded-lg transition-all duration-200">
                    Mua ngay
                </button>

                <button
                    onclick="addToCart(${p.id}); event.stopPropagation();"
                    class="w-11 flex items-center justify-center border border-gray-300 hover:border-primary-container hover:text-primary-container rounded-lg transition-all duration-200">
                    <span class="material-symbols-outlined text-[20px]">
                        shopping_cart
                    </span>
                </button>
            </div>
        </div>
    `;
}

function startCountdown(endTime) {
    const countdownEl = document.getElementById('flash-sale-countdown');
    if (!countdownEl) return;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const distance = end - now;

        if (distance <= 0) {
            clearInterval(countdownInterval);
            countdownEl.innerHTML = `
                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
                <span class="text-on-surface font-bold">:</span>
                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
                <span class="text-on-surface font-bold">:</span>
                <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">00</span>
            `;

            renderFlashSale();
            return;
        }

        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        countdownEl.innerHTML = `
            <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">
                ${String(hours).padStart(2, '0')}
            </span>
            <span class="text-on-surface font-bold">:</span>
            <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">
                ${String(minutes).padStart(2, '0')}
            </span>
            <span class="text-on-surface font-bold">:</span>
            <span class="bg-on-surface text-white px-2 py-1 rounded text-sm font-bold">
                ${String(seconds).padStart(2, '0')}
            </span>
        `;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}