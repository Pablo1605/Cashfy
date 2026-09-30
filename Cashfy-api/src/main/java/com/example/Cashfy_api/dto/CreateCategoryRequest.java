package com.example.Cashfy_api.dto;

import com.example.Cashfy_api.entity.enums.Type;
import com.example.Cashfy_api.validation.ValidHexColor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateCategoryRequest {
    @NotBlank(message = "The category name is requires")
    @Size(max = 50, message = "The category name cannot exceed 50 characters")
    private String name;

    @NotNull(message = "The category type is required")
    private Type type;

    @NotBlank(message = "The category color is required")
    @ValidHexColor
    private String color;

    @NotBlank(message = "The category icon is requires")
    @Size(max = 50, message = "The icon cannot exceed 50 characters")
    private String icon;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
