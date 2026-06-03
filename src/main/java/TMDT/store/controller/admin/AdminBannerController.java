package TMDT.store.controller.admin;

import TMDT.store.dto.response.AdminBannerResponse;
import TMDT.store.service.AdminBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminBannerResponse> createBanner(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean active,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                adminBannerService.createBanner(title, active, imageFile)
        );
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AdminBannerResponse> updateBanner(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) MultipartFile imageFile
    ) {
        return ResponseEntity.ok(
                adminBannerService.updateBanner(id, title, active, imageFile)
        );
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