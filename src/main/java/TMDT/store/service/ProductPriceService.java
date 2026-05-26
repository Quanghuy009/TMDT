package TMDT.store.service;

import TMDT.store.entity.Product;

import java.math.BigDecimal;

public interface ProductPriceService {

    BigDecimal getFinalPrice(Product product);

    BigDecimal getActiveSalePrice(Product product);

    boolean isOnSale(Product product);

    Integer calculateDiscountPercent(BigDecimal price, BigDecimal salePrice);
}