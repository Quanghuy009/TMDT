package TMDT.store.service;

import TMDT.store.dto.response.ProductDetailResponse;

public interface ProductDetailService {

    ProductDetailResponse getProductDetail(Integer id);
}