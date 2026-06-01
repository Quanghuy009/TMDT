import { renderProductSection } from '../components/product-section.js';
import { renderHeroBanner } from '../components/hero-banner.js';
import { renderFlashSale } from '../components/flash-sale.js';
import {
    loadFragment,
    activeHeaderMenu
} from '../components/layout.js';
import { handleAddToCart, handleBuyNow } from "../actions/cart-actions.js";

window.addToCart = handleAddToCart;
window.buyNow = handleBuyNow;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load header/footer trước
    await loadFragment('#header', '/fragments/header.html');
    await loadFragment('#footer', '/fragments/footer.html');

    // 2. Highlight menu sau khi header đã load xong
    activeHeaderMenu();

    // 3. Render nội dung trang chủ
    renderHeroBanner();
    renderFlashSale();

    renderProductSection({
        containerId: 'featured-products',
        title: 'Sản phẩm nổi bật',
        apiUrl: '/api/products/featured?limit=8',
        emptyMessage: 'Chưa có sản phẩm nổi bật'
    });

    renderProductSection({
        containerId: 'recommended-products',
        title: 'Sản phẩm dành cho bạn',
        apiUrl: '/api/products/recommended?limit=8',
        emptyMessage: 'Chưa có sản phẩm gợi ý'
    });

    renderProductSection({
        containerId: 'best-seller-products',
        title: 'Sản phẩm bán chạy',
        apiUrl: '/api/products/best-seller?limit=8',
        emptyMessage: 'Chưa có sản phẩm bán chạy'
    });
});
