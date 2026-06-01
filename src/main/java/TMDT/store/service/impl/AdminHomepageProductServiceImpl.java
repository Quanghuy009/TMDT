package TMDT.store.service.impl;

import TMDT.store.dto.request.HomepageProductRequest;
import TMDT.store.dto.response.AdminHomepageProductResponse;
import TMDT.store.entity.*;
import TMDT.store.repository.*;
import TMDT.store.service.AdminHomepageProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminHomepageProductServiceImpl implements AdminHomepageProductService {

    private final ProductRepository productRepository;
    private final FeaturedProductRepository featuredProductRepository;
    private final RecommendedProductRepository recommendedProductRepository;
    private final BestSellerProductRepository bestSellerProductRepository;

    @Override
    public List<AdminHomepageProductResponse> getProductsBySection(String section) {
        return switch (normalizeSection(section)) {
            case "featured" -> featuredProductRepository.findAllByOrderByIdDesc()
                    .stream()
                    .map(item -> toResponse(item.getId(), item.getProduct()))
                    .toList();

            case "recommended" -> recommendedProductRepository.findAllByOrderByIdDesc()
                    .stream()
                    .map(item -> toResponse(item.getId(), item.getProduct()))
                    .toList();

            case "best-seller" -> bestSellerProductRepository.findAllByOrderByIdDesc()
                    .stream()
                    .map(item -> toResponse(item.getId(), item.getProduct()))
                    .toList();

            default -> throw new RuntimeException("Section không hợp lệ");
        };
    }

    @Override
    @Transactional
    public AdminHomepageProductResponse addProductToSection(String section, HomepageProductRequest request) {
        Product product = getProductFromRequest(request);

        return switch (normalizeSection(section)) {
            case "featured" -> {
                if (featuredProductRepository.existsByProductId(product.getId())) {
                    throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm nổi bật");
                }

                FeaturedProduct saved = featuredProductRepository.save(
                        FeaturedProduct.builder()
                                .product(product)
                                .build()
                );

                yield toResponse(saved.getId(), saved.getProduct());
            }

            case "recommended" -> {
                if (recommendedProductRepository.existsByProductId(product.getId())) {
                    throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm gợi ý");
                }

                RecommendedProduct saved = recommendedProductRepository.save(
                        RecommendedProduct.builder()
                                .product(product)
                                .build()
                );

                yield toResponse(saved.getId(), saved.getProduct());
            }

            case "best-seller" -> {
                if (bestSellerProductRepository.existsByProductId(product.getId())) {
                    throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm bán chạy");
                }

                BestSellerProduct saved = bestSellerProductRepository.save(
                        BestSellerProduct.builder()
                                .product(product)
                                .build()
                );

                yield toResponse(saved.getId(), saved.getProduct());
            }

            default -> throw new RuntimeException("Section không hợp lệ");
        };
    }

    @Override
    @Transactional
    public AdminHomepageProductResponse updateProductInSection(
            String section,
            Long id,
            HomepageProductRequest request
    ) {
        Product product = getProductFromRequest(request);

        return switch (normalizeSection(section)) {
            case "featured" -> {
                FeaturedProduct item = featuredProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm nổi bật"));

                featuredProductRepository.findByProductId(product.getId())
                        .ifPresent(existing -> {
                            if (!existing.getId().equals(id)) {
                                throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm nổi bật");
                            }
                        });

                item.setProduct(product);

                FeaturedProduct saved = featuredProductRepository.save(item);
                yield toResponse(saved.getId(), saved.getProduct());
            }

            case "recommended" -> {
                RecommendedProduct item = recommendedProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm gợi ý"));

                recommendedProductRepository.findByProductId(product.getId())
                        .ifPresent(existing -> {
                            if (!existing.getId().equals(id)) {
                                throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm gợi ý");
                            }
                        });

                item.setProduct(product);

                RecommendedProduct saved = recommendedProductRepository.save(item);
                yield toResponse(saved.getId(), saved.getProduct());
            }

            case "best-seller" -> {
                BestSellerProduct item = bestSellerProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm bán chạy"));

                bestSellerProductRepository.findByProductId(product.getId())
                        .ifPresent(existing -> {
                            if (!existing.getId().equals(id)) {
                                throw new RuntimeException("Sản phẩm đã tồn tại trong mục Sản phẩm bán chạy");
                            }
                        });

                item.setProduct(product);

                BestSellerProduct saved = bestSellerProductRepository.save(item);
                yield toResponse(saved.getId(), saved.getProduct());
            }

            default -> throw new RuntimeException("Section không hợp lệ");
        };
    }

    @Override
    @Transactional
    public void deleteProductFromSection(String section, Long id) {
        switch (normalizeSection(section)) {
            case "featured" -> {
                FeaturedProduct item = featuredProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm nổi bật"));

                featuredProductRepository.delete(item);
            }

            case "recommended" -> {
                RecommendedProduct item = recommendedProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm gợi ý"));

                recommendedProductRepository.delete(item);
            }

            case "best-seller" -> {
                BestSellerProduct item = bestSellerProductRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm bán chạy"));

                bestSellerProductRepository.delete(item);
            }

            default -> throw new RuntimeException("Section không hợp lệ");
        }
    }

    private Product getProductFromRequest(HomepageProductRequest request) {
        if (request == null || request.getProductId() == null) {
            throw new RuntimeException("Vui lòng chọn sản phẩm");
        }

        return productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    private AdminHomepageProductResponse toResponse(Long id, Product product) {
        return AdminHomepageProductResponse.builder()
                .id(id)
                .productId(product.getId())
                .productName(product.getName())
                .image(product.getImage())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .price(product.getPrice())
                .build();
    }

    private String normalizeSection(String section) {
        if (section == null) {
            throw new RuntimeException("Section không hợp lệ");
        }

        return section.trim().toLowerCase();
    }
}