package TMDT.store.service;

import TMDT.store.dto.response.ProductCategoryResponse;

public interface ProductCategoryService {

    ProductCategoryResponse getProductsByCategory(String type);
}