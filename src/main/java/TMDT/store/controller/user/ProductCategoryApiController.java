package TMDT.store.controller.user;

import TMDT.store.dto.response.ProductCategoryResponse;
import TMDT.store.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductCategoryApiController {

    private final ProductCategoryService productCategoryService;

    @GetMapping("/category")
    public ProductCategoryResponse getProductsByCategory(
            @RequestParam String type
    ) {

        return productCategoryService
                .getProductsByCategory(type);
    }
}