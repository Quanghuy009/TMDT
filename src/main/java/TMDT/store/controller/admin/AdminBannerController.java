package TMDT.store.controller.admin;

import TMDT.store.dto.request.BannerRequest;
import TMDT.store.dto.response.AdminBannerResponse;
import TMDT.store.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final AdminBannerService adminBannerService;

    @GetMapping
    public ResponseEntity<List<AdminBannerResponse>> getAllBanners() {
        return ResponseEntity.ok(adminBannerService.getAllBanners());
    }

    @PostMapping
    public ResponseEntity<AdminBannerResponse> createBanner(
            @RequestBody BannerRequest request
    ) {
        return ResponseEntity.ok(adminBannerService.createBanner(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminBannerResponse> updateBanner(
            @PathVariable Long id,
            @RequestBody BannerRequest request
    ) {
        return ResponseEntity.ok(adminBannerService.updateBanner(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<AdminBannerResponse> toggleBanner(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminBannerService.toggleBanner(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBanner(
            @PathVariable Long id
    ) {
        adminBannerService.deleteBanner(id);
        return ResponseEntity.ok("Xóa banner thành công");
    }
}