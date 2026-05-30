package TMDT.store.controller.admin;

import TMDT.store.dto.request.AdminCategoryRequest;
import TMDT.store.dto.response.AdminCategoryResponse;
import TMDT.store.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<AdminCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllAdminCategories());
    }

    @PostMapping
    public ResponseEntity<AdminCategoryResponse> createCategory(
            @RequestBody AdminCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminCategoryResponse> updateCategory(
            @PathVariable Integer id,
            @RequestBody AdminCategoryRequest request
    ) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Integer id
    ) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Xóa danh mục thành công");
    }
}