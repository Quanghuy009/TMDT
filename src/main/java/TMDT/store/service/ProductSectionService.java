package TMDT.store.service;

import TMDT.store.dto.response.ProductCardResponse;

import java.util.List;

public interface ProductSectionService {

    List<ProductCardResponse> getFeaturedProducts(int limit);

    List<ProductCardResponse> getRecommendedProducts(int limit);

    List<ProductCardResponse> getBestSellerProducts(int limit);
}

