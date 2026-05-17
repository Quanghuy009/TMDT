export function renderProductCard(p) {
    const imageUrl = p.image
        ? `/images/products/${p.image}`
        : '/images/products/default.jpg';

    return `
        <div class="bg-white border border-gray-300 rounded-xl p-card-padding group ambient-lift transition-all cursor-pointer"
             onclick="window.location.href='/pages/product-detail.html?id=${p.id}'">

            <div class="relative mb-4">
                <img
                    class="w-full aspect-square object-contain group-hover:scale-105 transition-transform"
                    src="${imageUrl}"
                    alt="${p.name}">
            </div>

            <div class="space-y-2">
                <h3 class="font-h3 text-sm text-on-surface line-clamp-2 min-h-[42px]">
                    ${p.name}
                </h3>

                ${
        p.onSale
            ? `
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <p class="text-primary-container font-bold text-lg">
                                        ${Number(p.salePrice).toLocaleString('vi-VN')}đ
                                    </p>
                                    <span class="bg-primary-container text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        -${p.discountPercent}%
                                    </span>
                                </div>

                                <span class="text-gray-400 text-xs line-through">
                                    ${Number(p.price).toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        `
            : `
                            <p class="text-primary-container font-bold text-lg">
                                ${Number(p.price).toLocaleString('vi-VN')}đ
                            </p>
                        `
    }
            </div>

            <div class="flex gap-2 pt-3">
                <button
                    onclick="addToCart(${p.id}); event.stopPropagation();"
                    class="flex-1 bg-primary-container hover:bg-primary text-white text-sm font-bold py-2.5 rounded-lg">
                    Mua ngay
                </button>

                <button
                    onclick="addToCart(${p.id}); event.stopPropagation();"
                    class="w-11 flex items-center justify-center border border-gray-300 rounded-lg">
                    <span class="material-symbols-outlined text-[20px]">
                        shopping_cart
                    </span>
                </button>
            </div>
        </div>
    `;
}