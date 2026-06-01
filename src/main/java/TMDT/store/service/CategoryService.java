package TMDT.store.service;

import TMDT.store.dto.request.AdminCategoryRequest;
import TMDT.store.dto.response.AdminCategoryResponse;

import java.util.List;

public interface CategoryService {

    List<AdminCategoryResponse> getAllAdminCategories();

    AdminCategoryResponse createCategory(AdminCategoryRequest request);

    AdminCategoryResponse updateCategory(Integer id, AdminCategoryRequest request);

    void deleteCategory(Integer id);

}