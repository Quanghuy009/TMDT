package TMDT.store.controller.admin;

import TMDT.store.dto.request.AdminProductRequest;
import TMDT.store.dto.response.AdminProductDetailResponse;
import TMDT.store.dto.response.AdminProductResponse;
import TMDT.store.service.AdminProductService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminProductDetailResponse createProduct(
            @RequestPart("product") AdminProductRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return adminProductService.createProduct(request, imageFile);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AdminProductDetailResponse updateProduct(
            @PathVariable Integer id,
            @RequestPart("product") AdminProductRequest request,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return adminProductService.updateProduct(id, request, imageFile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}