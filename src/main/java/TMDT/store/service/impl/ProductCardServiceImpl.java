package TMDT.store.service.impl;

import TMDT.store.dto.response.ProductCardResponse;
import TMDT.store.entity.FlashSale;
import TMDT.store.entity.FlashSaleItem;
import TMDT.store.entity.Product;
import TMDT.store.repository.FlashSaleItemRepository;
import TMDT.store.repository.FlashSaleRepository;
import TMDT.store.service.ProductCardService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductCardServiceImpl implements ProductCardService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;

    @Override
    public ProductCardResponse toProductCard(Product product) {

        BigDecimal originalPrice = product.getPrice();

        Optional<FlashSale> currentFlashSale =
                flashSaleRepository.findCurrentFlashSale(LocalDateTime.now());

        if (currentFlashSale.isEmpty()) {
            return normalProduct(product);
        }

        Optional<FlashSaleItem> saleItem =
                flashSaleItemRepository.findByFlashSaleIdAndProductId(
                        currentFlashSale.get().getId(),
                        product.getId()
                );

        if (saleItem.isEmpty()) {
            return normalProduct(product);
        }

        BigDecimal salePrice = saleItem.get().getSalePrice();

        int discountPercent = originalPrice
                .subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(originalPrice, 0, RoundingMode.HALF_UP)
                .intValue();

        return ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(originalPrice)
                .salePrice(salePrice)
                .discountPercent(discountPercent)
                .onSale(true)
                .image(product.getImage())
                .build();
    }

    private ProductCardResponse normalProduct(Product product) {
        return ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .salePrice(null)
                .discountPercent(0)
                .onSale(false)
                .image(product.getImage())
                .build();
    }
}