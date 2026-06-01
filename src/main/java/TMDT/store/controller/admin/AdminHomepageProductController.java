package TMDT.store.controller.admin;

import TMDT.store.dto.request.HomepageProductRequest;
import TMDT.store.dto.response.AdminHomepageProductResponse;
import TMDT.store.service.AdminHomepageProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/homepage-products")
@RequiredArgsConstructor
public class AdminHomepageProductController {

    private final AdminHomepageProductService adminHomepageProductService;

    @GetMapping("/{section}")
    public ResponseEntity<List<AdminHomepageProductResponse>> getProductsBySection(
            @PathVariable String section
    ) {
        return ResponseEntity.ok(
                adminHomepageProductService.getProductsBySection(section)
        );
    }

    @PostMapping("/{section}")
    public ResponseEntity<AdminHomepageProductResponse> addProductToSection(
            @PathVariable String section,
            @RequestBody HomepageProductRequest request
    ) {
        return ResponseEntity.ok(
                adminHomepageProductService.addProductToSection(section, request)
        );
    }

    @PutMapping("/{section}/{id}")
    public ResponseEntity<AdminHomepageProductResponse> updateProductInSection(
            @PathVariable String section,
            @PathVariable Long id,
            @RequestBody HomepageProductRequest request
    ) {
        return ResponseEntity.ok(
                adminHomepageProductService.updateProductInSection(section, id, request)
        );
    }

    @DeleteMapping("/{section}/{id}")
    public ResponseEntity<String> deleteProductFromSection(
            @PathVariable String section,
            @PathVariable Long id
    ) {
        adminHomepageProductService.deleteProductFromSection(section, id);
        return ResponseEntity.ok("Xóa sản phẩm khỏi section thành công");
    }
}