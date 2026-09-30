package com.example.Cashfy_api.service.impl;

import com.example.Cashfy_api.dto.CategoryDto;
import com.example.Cashfy_api.dto.CreateCategoryRequest;
import com.example.Cashfy_api.entity.Category;
import com.example.Cashfy_api.exception.ResourceNotFoundException;
import com.example.Cashfy_api.mapper.CategoryMapper;
import com.example.Cashfy_api.repository.CategoryRepository;
import com.example.Cashfy_api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryDto createCategory(CreateCategoryRequest request, String userId) {
        Category category = new Category();
        category.setUserId(userId);
        category.setName(request.getName());
        category.setType(request.getType());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());
        category.setSystem(false);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    @Override
    public CategoryDto updateCategory(CreateCategoryRequest request, String id, String userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (category.isSystem()) {
            throw new IllegalStateException(
                    "System categories cannot be modified");
        }
        category.setName(request.getName());
        category.setType(request.getType());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    @Override
    public void deleteCategory(String id, String userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (category.isSystem()) {
            throw new IllegalStateException(
                    "System categories cannot be deleted");
        }
        categoryRepository.deleteById(category.getId());
    }

    @Override
    public List<CategoryDto> getUserCategories(String userId) {
        return categoryRepository.findByUserIdOrSystemTrue(userId).stream()
                .map(categoryMapper::toDTO)
                .toList();
    }
}
