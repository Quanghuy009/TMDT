package TMDT.store.controller.admin;

import TMDT.store.dto.request.BrandRequest;
import TMDT.store.dto.response.AdminBrandResponse;
import TMDT.store.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {

    private final BrandService brandService;

    @GetMapping
    public ResponseEntity<List<AdminBrandResponse>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllAdminBrands());
    }

    @PostMapping
    public ResponseEntity<AdminBrandResponse> createBrand(
            @RequestBody BrandRequest request
    ) {
        return ResponseEntity.ok(brandService.createBrand(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminBrandResponse> updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandRequest request
    ) {
        return ResponseEntity.ok(brandService.updateBrand(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(
            @PathVariable Integer id
    ) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Xóa thương hiệu thành công");
    }
}