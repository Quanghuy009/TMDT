package TMDT.store.service;

import TMDT.store.dto.request.BrandRequest;
import TMDT.store.dto.response.AdminBrandResponse;

import java.util.List;

public interface BrandService {

    List<AdminBrandResponse> getAllAdminBrands();

    AdminBrandResponse createBrand(BrandRequest request);

    AdminBrandResponse updateBrand(Integer id, BrandRequest request);

    void deleteBrand(Integer id);
}