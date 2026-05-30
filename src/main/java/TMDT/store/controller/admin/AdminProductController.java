package TMDT.store.controller.admin;

import TMDT.store.dto.request.AdminProductRequest;
import TMDT.store.dto.response.AdminProductDetailResponse;
import TMDT.store.dto.response.AdminProductResponse;
import TMDT.store.service.AdminProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public List<AdminProductResponse> getAllProductsForAdmin() {
        return adminProductService.getAllProductsForAdmin();
    }

    @GetMapping("/{id}")
    public AdminProductDetailResponse getProductDetailForAdmin(@PathVariable Integer id) {
        return adminProductService.getProductDetailForAdmin(id);
    }

    @PostMapping
    public AdminProductDetailResponse createProduct(@RequestBody AdminProductRequest request) {
        return adminProductService.createProduct(request);
    }

    @PutMapping("/{id}")
    public AdminProductDetailResponse updateProduct(
            @PathVariable Integer id,
            @RequestBody AdminProductRequest request
    ) {
        return adminProductService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}