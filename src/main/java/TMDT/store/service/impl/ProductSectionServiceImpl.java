package TMDT.store.service.impl;

import TMDT.store.service.ProductSectionService;
import lombok.RequiredArgsConstructor;
import TMDT.store.dto.response.ProductCardResponse;
import TMDT.store.repository.BestSellerProductRepository;
import TMDT.store.repository.FeaturedProductRepository;
import TMDT.store.repository.RecommendedProductRepository;
import TMDT.store.service.ProductCardService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSectionServiceImpl implements ProductSectionService {

    private final FeaturedProductRepository featuredProductRepository;
    private final RecommendedProductRepository recommendedProductRepository;
    private final BestSellerProductRepository bestSellerProductRepository;

    private final ProductCardService productCardService;

    @Override
    public List<ProductCardResponse> getFeaturedProducts(int limit) {
        return featuredProductRepository.findAll(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(item -> productCardService.toProductCard(item.getProduct()))
                .toList();
    }

    @Override
    public List<ProductCardResponse> getRecommendedProducts(int limit) {
        return recommendedProductRepository.findAll(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(item -> productCardService.toProductCard(item.getProduct()))
                .toList();
    }

    @Override
    public List<ProductCardResponse> getBestSellerProducts(int limit) {
        return bestSellerProductRepository.findAll(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(item -> productCardService.toProductCard(item.getProduct()))
                .toList();
    }
}