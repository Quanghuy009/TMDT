package TMDT.store.service.impl;

import TMDT.store.entity.FlashSaleItem;
import TMDT.store.entity.Product;
import TMDT.store.repository.FlashSaleItemRepository;
import TMDT.store.service.ProductPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductPriceServiceImpl implements ProductPriceService {

    private final FlashSaleItemRepository flashSaleItemRepository;

    @Override
    public BigDecimal getFinalPrice(Product product) {
        BigDecimal salePrice = getActiveSalePrice(product);

        if (salePrice != null && salePrice.compareTo(product.getPrice()) < 0) {
            return salePrice;
        }

        return product.getPrice();
    }

    @Override
    public BigDecimal getActiveSalePrice(Product product) {
        List<FlashSaleItem> activeItems =
                flashSaleItemRepository.findActiveItemsByProductId(product.getId());

        if (activeItems == null || activeItems.isEmpty()) {
            return null;
        }

        return activeItems.get(0).getSalePrice();
    }

    @Override
    public boolean isOnSale(Product product) {
        BigDecimal salePrice = getActiveSalePrice(product);

        return salePrice != null
                && product.getPrice() != null
                && salePrice.compareTo(product.getPrice()) < 0;
    }

    @Override
    public Integer calculateDiscountPercent(
            BigDecimal price,
            BigDecimal salePrice
    ) {
        if (price == null || salePrice == null) {
            return 0;
        }

        if (salePrice.compareTo(price) >= 0) {
            return 0;
        }

        return price.subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(price, 0, RoundingMode.HALF_UP)
                .intValue();
    }
}