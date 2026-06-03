package TMDT.store.controller.admin;

import TMDT.store.dto.response.HomepageSectionResponse;
import TMDT.store.service.HomepageSectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/homepage-sections")
@RequiredArgsConstructor
public class AdminHomepageSectionController {

    private final HomepageSectionService homepageSectionService;

    @GetMapping
    public ResponseEntity<List<HomepageSectionResponse>> getAllSections() {
        return ResponseEntity.ok(homepageSectionService.getAllSections());
    }

    @PatchMapping("/{sectionCode}/toggle")
    public ResponseEntity<HomepageSectionResponse> toggleSection(
            @PathVariable String sectionCode
    ) {
        return ResponseEntity.ok(homepageSectionService.toggleSection(sectionCode));
    }
}