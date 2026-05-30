package TMDT.store.service.impl;

import TMDT.store.dto.request.BrandRequest;
import TMDT.store.dto.response.AdminBrandResponse;
import TMDT.store.entity.Brand;
import TMDT.store.repository.BrandRepository;
import TMDT.store.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    public List<AdminBrandResponse> getAllAdminBrands() {
        return brandRepository.findAllAdminBrands();
    }

    @Override
    @Transactional
    public AdminBrandResponse createBrand(BrandRequest request) {
        String brandName = normalizeBrandName(request.getBrandName());
        String country = normalizeNullableText(request.getCountry());

        if (brandRepository.existsByName(brandName)) {
            throw new RuntimeException("Tên thương hiệu đã tồn tại");
        }

        Brand brand = Brand.builder()
                .name(brandName)
                .country(country)
                .build();

        Brand savedBrand = brandRepository.save(brand);

        return AdminBrandResponse.builder()
                .brandId(savedBrand.getId())
                .brandName(savedBrand.getName())
                .country(savedBrand.getCountry())
                .productCount(0L)
                .build();
    }

    @Override
    @Transactional
    public AdminBrandResponse updateBrand(Integer id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu"));

        String brandName = normalizeBrandName(request.getBrandName());
        String country = normalizeNullableText(request.getCountry());

        brandRepository.findByName(brandName)
                .ifPresent(existingBrand -> {
                    if (!existingBrand.getId().equals(id)) {
                        throw new RuntimeException("Tên thương hiệu đã tồn tại");
                    }
                });

        brand.setName(brandName);
        brand.setCountry(country);

        Brand updatedBrand = brandRepository.save(brand);

        long productCount = brandRepository.countProductsByBrandId(updatedBrand.getId());

        return AdminBrandResponse.builder()
                .brandId(updatedBrand.getId())
                .brandName(updatedBrand.getName())
                .country(updatedBrand.getCountry())
                .productCount(productCount)
                .build();
    }

    @Override
    @Transactional
    public void deleteBrand(Integer id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu"));

        long productCount = brandRepository.countProductsByBrandId(id);

        if (productCount > 0) {
            throw new RuntimeException("Không thể xóa thương hiệu vì vẫn còn sản phẩm thuộc thương hiệu này");
        }

        brandRepository.delete(brand);
    }

    private String normalizeBrandName(String brandName) {
        if (brandName == null || brandName.trim().isEmpty()) {
            throw new RuntimeException("Tên thương hiệu không được để trống");
        }

        return brandName.trim();
    }

    private String normalizeNullableText(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}