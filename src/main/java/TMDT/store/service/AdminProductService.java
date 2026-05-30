package TMDT.store.service;

import TMDT.store.dto.request.AdminProductRequest;
import TMDT.store.dto.response.AdminProductDetailResponse;
import TMDT.store.dto.response.AdminProductResponse;

import java.util.List;

public interface AdminProductService {

    List<AdminProductResponse> getAllProductsForAdmin();

    AdminProductDetailResponse getProductDetailForAdmin(Integer id);

    AdminProductDetailResponse createProduct(AdminProductRequest request);

    AdminProductDetailResponse updateProduct(Integer id, AdminProductRequest request);

    void deleteProduct(Integer id);
}