package TMDT.store.service.impl;

import TMDT.store.dto.response.ProductCategoryItemResponse;
import TMDT.store.dto.response.ProductCategoryResponse;
import TMDT.store.exception.BadRequestException;
import TMDT.store.mapper.ProductCategoryMapper;
import TMDT.store.repository.ProductCategoryRepository;
import TMDT.store.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    private final ProductCategoryMapper productCategoryMapper;

    @Override
    public ProductCategoryResponse getProductsByCategory(String type) {
        return switch (type) {
            case "phone" ->
                    getDeviceCategory(
                            type,
                            "Điện thoại",
                            "Điện thoại"
                    );

            case "laptop" ->
                    getDeviceCategory(
                            type,
                            "Laptop",
                            "Laptop"
                    );

            case "tablet" ->
                    getDeviceCategory(
                            type,
                            "Tablet",
                            "Tablet"
                    );

            case "accessory" ->
                    getAccessoryCategory();

            default ->
                    throw new BadRequestException(
                            "Loại danh mục không hợp lệ: " + type
                    );
        };
    }

    private ProductCategoryResponse getDeviceCategory(
            String type,
            String title,
            String categoryName
    ) {

        List<Map<String, Object>> rows =
                productCategoryRepository
                        .findDeviceProductsByCategoryName(categoryName);

        List<ProductCategoryItemResponse> products =
                rows.stream()
                        .map(row ->
                                productCategoryMapper
                                        .toDeviceProductResponse(
                                                row,
                                                type
                                        )
                        )
                        .toList();

        return ProductCategoryResponse.builder()
                .type(type)
                .title(title)
                .products(products)
                .build();
    }

    private ProductCategoryResponse getAccessoryCategory() {

        List<Map<String, Object>> rows =
                productCategoryRepository
                        .findAccessoryProducts();

        List<ProductCategoryItemResponse> products =
                rows.stream()
                        .map(productCategoryMapper::toAccessoryProductResponse)
                        .toList();

        return ProductCategoryResponse.builder()
                .type("accessory")
                .title("Phụ kiện")
                .products(products)
                .build();
    }
}