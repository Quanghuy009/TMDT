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

    // 3. Lấy trạng thái bật/tắt các section
    const sectionStatus = await getHomepageSectionStatus();

    // 4. Áp dụng ẩn/hiện section
    applyHomepageSectionVisibility(sectionStatus);

    // 5. Render banner nếu section được bật
    if (sectionStatus.hero_banner) {
        renderHeroBanner();
    }

    // 6. Render Flash Sale nếu section được bật và có dữ liệu
    if (sectionStatus.flash_sale) {
        await loadFlashSaleSection();
    }

    // 7. Render sản phẩm nổi bật nếu section được bật
    if (sectionStatus.featured_products) {
        renderProductSection({
            containerId: 'featured-products',
            title: 'Sản phẩm nổi bật',
            apiUrl: '/api/products/featured?limit=8',
            emptyMessage: 'Chưa có sản phẩm nổi bật'
        });
    }

    // 8. Render sản phẩm gợi ý nếu section được bật
    if (sectionStatus.recommended_products) {
        renderProductSection({
            containerId: 'recommended-products',
            title: 'Sản phẩm dành cho bạn',
            apiUrl: '/api/products/recommended?limit=8',
            emptyMessage: 'Chưa có sản phẩm gợi ý'
        });
    }

    // 9. Render sản phẩm bán chạy nếu section được bật
    if (sectionStatus.best_seller_products) {
        renderProductSection({
            containerId: 'best-seller-products',
            title: 'Sản phẩm bán chạy',
            apiUrl: '/api/products/best-seller?limit=8',
            emptyMessage: 'Chưa có sản phẩm bán chạy'
        });
    }
});

async function getHomepageSectionStatus() {
    const defaultStatus = {
        hero_banner: true,
        flash_sale: true,
        featured_products: true,
        recommended_products: true,
        best_seller_products: true
    };

    try {
        const response = await fetch("/api/homepage-sections");

        if (!response.ok) {
            throw new Error("Không thể tải trạng thái section trang chủ");
        }

        const sections = await response.json();

        return {
            ...defaultStatus,
            ...sections
        };

    } catch (error) {
        console.error("Lỗi tải trạng thái section:", error);

        // Nếu API lỗi thì mặc định vẫn hiển thị các section
        return defaultStatus;
    }
}

function applyHomepageSectionVisibility(sections) {
    setSectionVisible("heroBannerSection", sections.hero_banner);
    setSectionVisible("flashSaleSection", sections.flash_sale);
    setSectionVisible("featuredProductsSection", sections.featured_products);
    setSectionVisible("recommendedProductsSection", sections.recommended_products);
    setSectionVisible("bestSellerProductsSection", sections.best_seller_products);
}

function setSectionVisible(sectionId, visible) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.classList.toggle("hidden", !visible);
}

async function loadFlashSaleSection() {
    const section = document.getElementById("flashSaleSection");

    if (!section) return;

    try {
        const response = await fetch("/api/flash-sale/current");

        if (!response.ok) {
            section.classList.add("hidden");
            return;
        }

        const flashSale = await response.json();

        if (!flashSale || !flashSale.products || flashSale.products.length === 0) {
            section.classList.add("hidden");
            return;
        }

        section.classList.remove("hidden");

        /*
         * Nếu renderFlashSale của bạn tự gọi API thì dùng:
         */
        renderFlashSale();

        /*
         * Nếu sau này bạn sửa renderFlashSale để nhận dữ liệu có sẵn,
         * thì đổi thành:
         * renderFlashSale(flashSale);
         */

    } catch (error) {
        console.error("Lỗi tải Flash Sale:", error);
        section.classList.add("hidden");
    }
}