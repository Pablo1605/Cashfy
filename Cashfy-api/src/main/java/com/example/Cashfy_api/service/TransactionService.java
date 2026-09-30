package com.example.Cashfy_api.service;

import com.example.Cashfy_api.dto.CategoryExpenseDto;
import com.example.Cashfy_api.dto.CreateTransactionRequest;
import com.example.Cashfy_api.dto.MonthlySummaryDto;
import com.example.Cashfy_api.dto.TransactionResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    TransactionResponse createTransaction(CreateTransactionRequest request, String userId, String categoryId);
    TransactionResponse updateTransaction(String id, CreateTransactionRequest request);
    void deleteTransaction(String id);
    TransactionResponse getTransactionById(String id);
    List<TransactionResponse> getAllTransactions(String userId);
    List<TransactionResponse> getTransactionsByFilters(String userId, LocalDate start, LocalDate end, String type, String category);

    BigDecimal calculateCurrentBalance(String userId);
    List<MonthlySummaryDto> getMonthlySummary(String userId, int year);
    List<CategoryExpenseDto> getExpensesByCategory(String userId, LocalDate start, LocalDate end);
    List<TransactionResponse> getRecentTransactions(String userId, int limit);
}
