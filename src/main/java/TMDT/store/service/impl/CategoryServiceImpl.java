package TMDT.store.service.impl;

import TMDT.store.dto.request.AdminCategoryRequest;
import TMDT.store.dto.response.AdminCategoryResponse;
import TMDT.store.entity.Category;
import TMDT.store.repository.CategoryRepository;
import TMDT.store.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<AdminCategoryResponse> getAllAdminCategories() {
        return categoryRepository.findAllAdminCategories();
    }

    @Override
    @Transactional
    public AdminCategoryResponse createCategory(AdminCategoryRequest request) {
        String categoryName = normalizeCategoryName(request.getCategoryName());

        if (categoryRepository.existsByName(categoryName)) {
            throw new RuntimeException("Tên danh mục đã tồn tại");
        }

        Category category = Category.builder()
                .name(categoryName)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return AdminCategoryResponse.builder()
                .categoryId(savedCategory.getId())
                .categoryName(savedCategory.getName())
                .productCount(0L)
                .build();
    }

    @Override
    @Transactional
    public AdminCategoryResponse updateCategory(Integer id, AdminCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        String categoryName = normalizeCategoryName(request.getCategoryName());

        categoryRepository.findByName(categoryName)
                .ifPresent(existingCategory -> {
                    if (!existingCategory.getId().equals(id)) {
                        throw new RuntimeException("Tên danh mục đã tồn tại");
                    }
                });

        category.setName(categoryName);

        Category updatedCategory = categoryRepository.save(category);

        long productCount = categoryRepository.countProductsByCategoryId(updatedCategory.getId());

        return AdminCategoryResponse.builder()
                .categoryId(updatedCategory.getId())
                .categoryName(updatedCategory.getName())
                .productCount(productCount)
                .build();
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        long productCount = categoryRepository.countProductsByCategoryId(id);

        if (productCount > 0) {
            throw new RuntimeException("Không thể xóa danh mục vì vẫn còn sản phẩm thuộc danh mục này");
        }

        categoryRepository.delete(category);
    }

    private String normalizeCategoryName(String categoryName) {
        if (categoryName == null || categoryName.trim().isEmpty()) {
            throw new RuntimeException("Tên danh mục không được để trống");
        }

        return categoryName.trim();
    }
}