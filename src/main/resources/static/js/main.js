import { renderProductSection } from './components/product-section.js';
import { renderHeroBanner } from './components/hero-banner.js';
import { renderFlashSale } from './components/flash-sale.js';

async function loadFragment(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Không tải được ${filePath}`);

        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Lỗi load ${filePath}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFragment('header', '/fragments/header.html');
    loadFragment('footer', '/fragments/footer.html');

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

    renderHeroBanner();
    renderFlashSale();
});