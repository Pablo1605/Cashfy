package com.example.Cashfy_api.mapper;

import com.example.Cashfy_api.dto.CategoryDto;
import com.example.Cashfy_api.dto.CreateCategoryRequest;
import com.example.Cashfy_api.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDto toDTO(Category category);

    Category toEntity(CreateCategoryRequest category);
}
