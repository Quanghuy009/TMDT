package TMDT.store.service;

import TMDT.store.dto.request.HomepageProductRequest;
import TMDT.store.dto.response.AdminHomepageProductResponse;

import java.util.List;

public interface AdminHomepageProductService {

    List<AdminHomepageProductResponse> getProductsBySection(String section);

    AdminHomepageProductResponse addProductToSection(String section, HomepageProductRequest request);

    AdminHomepageProductResponse updateProductInSection(String section, Long id, HomepageProductRequest request);

    void deleteProductFromSection(String section, Long id);
}