package TMDT.store.service.impl;

import TMDT.store.dto.response.FlashSaleProductResponse;
import TMDT.store.dto.response.FlashSaleResponse;
import TMDT.store.entity.FlashSale;
import TMDT.store.entity.FlashSaleItem;
import TMDT.store.entity.Product;
import TMDT.store.repository.FlashSaleItemRepository;
import TMDT.store.repository.FlashSaleRepository;
import TMDT.store.service.FlashSaleService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlashSaleServiceImpl implements FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final FlashSaleItemRepository flashSaleItemRepository;

    @Override
    public FlashSaleResponse getCurrentFlashSale() {

        FlashSale flashSale = flashSaleRepository
                .findCurrentFlashSale(LocalDateTime.now())
                .orElse(null);

        if (flashSale == null) {
            return null;
        }

        List<FlashSaleItem> items =
                flashSaleItemRepository.findByFlashSaleId(flashSale.getId());

        List<FlashSaleProductResponse> products = items.stream()
                .map(this::toProductResponse)
                .toList();

        return FlashSaleResponse.builder()
                .id(flashSale.getId())
                .name(flashSale.getName())
                .endTime(flashSale.getEndTime())
                .products(products)
                .build();
    }

    private FlashSaleProductResponse toProductResponse(FlashSaleItem item) {

        Product p = item.getProduct();

        BigDecimal price = p.getPrice();
        BigDecimal salePrice = item.getSalePrice();

        int discountPercent = price
                .subtract(salePrice)
                .multiply(BigDecimal.valueOf(100))
                .divide(price, 0, RoundingMode.HALF_UP)
                .intValue();

        int quantityLimit = item.getQuantityLimit() != null ? item.getQuantityLimit() : 0;
        int soldQuantity = item.getSoldQuantity() != null ? item.getSoldQuantity() : 0;

        int soldPercent = 0;

        if (quantityLimit > 0) {
            soldPercent = Math.min(100, soldQuantity * 100 / quantityLimit);
        }

        return FlashSaleProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(price)
                .salePrice(salePrice)
                .discountPercent(discountPercent)
                .quantityLimit(quantityLimit)
                .soldQuantity(soldQuantity)
                .soldPercent(soldPercent)
                .image(p.getImage())
                .build();
    }
}