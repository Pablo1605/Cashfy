package com.example.Cashfy_api.controller;

import com.example.Cashfy_api.auth.CurrentUserProvider;
import com.example.Cashfy_api.dto.CreateTransactionRequest;
import com.example.Cashfy_api.dto.TransactionResponse;
import com.example.Cashfy_api.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/transactions")
@Validated
public class TransactionController {
    private final TransactionService transactionService;
    private final CurrentUserProvider currentUserProvider;

    private String getCurrentUserId() {
        return currentUserProvider.getCurrentUsername();
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) String category) {
        String userId = getCurrentUserId();
        List<TransactionResponse> filteredTransactions = transactionService.getTransactionsByFilters(
                userId, startDate, endDate, type, category);
        return ResponseEntity.ok(filteredTransactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable String id) {
        getCurrentUserId();
        TransactionResponse transaction = transactionService.getTransactionById(id);
        if (transaction != null) {
            return ResponseEntity.ok(transaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody @Valid CreateTransactionRequest requestBody) {
        String userId = getCurrentUserId();

        TransactionResponse createdTransaction =
                transactionService.createTransaction(
                        requestBody,
                        userId,
                        requestBody.getCategoryId()
                );

        return ResponseEntity.ok(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable String id,
            @RequestBody @Valid CreateTransactionRequest request) {
        getCurrentUserId();
        TransactionResponse updatedTransaction = transactionService.updateTransaction(id, request);
        if (updatedTransaction != null) {
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        getCurrentUserId();
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
