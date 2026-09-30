package com.example.Cashfy_api.dto;

import com.example.Cashfy_api.entity.enums.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateTransactionRequest {
    @NotNull(message = "The transaction type is required")
    private Type type;

    @NotNull(message = "The mount is required")
    @Positive(message = "The amount must be a positive value")
    private BigDecimal amount;

    private String description;

    @NotNull(message = "The date is required")
    @PastOrPresent(message = "The date cannot be future")
    private LocalDate date;

    private String categoryId;

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}
