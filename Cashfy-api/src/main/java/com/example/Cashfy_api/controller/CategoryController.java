package com.example.Cashfy_api.controller;

import com.example.Cashfy_api.auth.CurrentUserProvider;
import com.example.Cashfy_api.dto.CategoryDto;
import com.example.Cashfy_api.dto.CreateCategoryRequest;
import com.example.Cashfy_api.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories")
@Validated
public class CategoryController {
    private final CategoryService categoryService;
    private final CurrentUserProvider currentUserProvider;

    private String getCurrentUserId() {
        return currentUserProvider.getCurrentUsername();
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getCategories() {
        String userId = getCurrentUserId();
        List<CategoryDto> categories = categoryService.getUserCategories(userId);
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@RequestBody @Valid CreateCategoryRequest request) {
        String userId = getCurrentUserId();
        CategoryDto createdCategory = categoryService.createCategory(request, userId);
        return ResponseEntity.ok(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable String id,
            @RequestBody @Valid CreateCategoryRequest request) {
        String userId = getCurrentUserId();
        CategoryDto updatedCategory = categoryService.updateCategory(request, id, userId);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        String userId = getCurrentUserId();
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.noContent().build();
    }
}

