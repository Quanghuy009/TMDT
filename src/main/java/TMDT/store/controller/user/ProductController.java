package TMDT.store.controller.user;

import TMDT.store.dto.response.ProductCardResponse;
import TMDT.store.service.ProductSectionService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductSectionService featuredProductService;

    @GetMapping("/featured")
    public List<ProductCardResponse> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit
    ) {
        return featuredProductService.getFeaturedProducts(limit);
    }

    @GetMapping("/recommended")
    public List<ProductCardResponse> getRecommendedProducts(
            @RequestParam(defaultValue = "8") int limit
    ) {
        return featuredProductService.getRecommendedProducts(limit);
    }

    @GetMapping("/best-seller")
    public List<ProductCardResponse> getBestSellerProducts(
            @RequestParam(defaultValue = "8") int limit
    ) {
        return featuredProductService.getBestSellerProducts(limit);
    }
}