package com.example.Cashfy_api.service;

import com.example.Cashfy_api.dto.CategoryDto;
import com.example.Cashfy_api.dto.CreateCategoryRequest;

import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CreateCategoryRequest request, String userId);
    CategoryDto updateCategory(CreateCategoryRequest request, String id, String userId);
    void deleteCategory(String id, String userId);
    List<CategoryDto> getUserCategories(String userId);
}
