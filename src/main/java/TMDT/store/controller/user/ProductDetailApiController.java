package TMDT.store.controller.user;

import TMDT.store.dto.response.ProductDetailResponse;
import TMDT.store.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductDetailApiController {

    private final ProductDetailService productDetailService;

    @GetMapping("/{id}")
    public ProductDetailResponse getProductDetail(@PathVariable Integer id) {
        return productDetailService.getProductDetail(id);
    }
}