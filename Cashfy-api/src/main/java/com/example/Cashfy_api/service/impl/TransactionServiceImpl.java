package com.example.Cashfy_api.service.impl;

import com.example.Cashfy_api.dto.CategoryExpenseDto;
import com.example.Cashfy_api.dto.CreateTransactionRequest;
import com.example.Cashfy_api.dto.MonthlySummaryDto;
import com.example.Cashfy_api.dto.TransactionResponse;
import com.example.Cashfy_api.entity.Transaction;
import com.example.Cashfy_api.entity.enums.Type;
import com.example.Cashfy_api.exception.ResourceNotFoundException;
import com.example.Cashfy_api.mapper.TransactionMapper;
import com.example.Cashfy_api.repository.TransactionRepository;
import com.example.Cashfy_api.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class TransactionServiceImpl implements TransactionService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    private List<Transaction> getUserTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    @Override
    public TransactionResponse createTransaction(CreateTransactionRequest request, String userId, String categoryId) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategoryId(categoryId);
        Transaction saved = transactionRepository.save(transaction);
        return transactionMapper.toDTO(saved);
    }

    @Override
    public TransactionResponse updateTransaction(String id, CreateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        if (request.getCategoryId() != null) {
            transaction.setCategoryId(request.getCategoryId());
        }
        transaction.setDate(request.getDate());
        Transaction saved = transactionRepository.save(transaction);
        return transactionMapper.toDTO(saved);
    }

    @Override
    public void deleteTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.deleteById(transaction.getId());
    }

    @Override
    public TransactionResponse getTransactionById(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return transactionMapper.toDTO(transaction);
    }

    @Override
    public List<TransactionResponse> getAllTransactions(String userId) {
        return getUserTransactions(userId).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getTransactionsByFilters(String userId, LocalDate start, LocalDate end, String type, String category) {
        return getUserTransactions(userId).stream()
                .filter(transaction -> start == null || !transaction.getDate().isBefore(start))
                .filter(transaction -> end == null || !transaction.getDate().isAfter(end))
                .filter(transaction -> type == null || type.isBlank() || transaction.getType() == null || transaction.getType().name().equalsIgnoreCase(type))
                .filter(transaction -> category == null || category.isBlank() || transaction.getCategoryId() == null || transaction.getCategoryId().equalsIgnoreCase(category))
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal calculateCurrentBalance(String userId) {
        return getUserTransactions(userId).stream()
                .map(transaction -> {
                    if (transaction.getType() == Type.INCOME) {
                        return transaction.getAmount();
                    }
                    if (transaction.getType() == Type.EXPENSE) {
                        return transaction.getAmount() == null ? ZERO : transaction.getAmount().negate();
                    }
                    return ZERO;
                })
                .filter(amount -> amount != null)
                .reduce(ZERO, BigDecimal::add);
    }

    @Override
    public List<MonthlySummaryDto> getMonthlySummary(String userId, int year) {
        return getUserTransactions(userId).stream()
                .filter(transaction -> transaction.getDate() != null && transaction.getDate().getYear() == year)
                .collect(Collectors.groupingBy(transaction -> transaction.getDate().getMonthValue()))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    int month = entry.getKey();
                    BigDecimal totalIncome = entry.getValue().stream()
                            .filter(transaction -> transaction.getType() == Type.INCOME)
                            .map(Transaction::getAmount)
                            .filter(amount -> amount != null)
                            .reduce(ZERO, BigDecimal::add);
                    BigDecimal totalExpense = entry.getValue().stream()
                            .filter(transaction -> transaction.getType() == Type.EXPENSE)
                            .map(Transaction::getAmount)
                            .filter(amount -> amount != null)
                            .reduce(ZERO, BigDecimal::add);
                    MonthlySummaryDto dto = new MonthlySummaryDto();
                    dto.setMonth(month);
                    dto.setMonthName(Month.of(month).getDisplayName(TextStyle.FULL, Locale.getDefault()));
                    dto.setTotalIncome(totalIncome);
                    dto.setTotalExpense(totalExpense);
                    dto.setNetSavings(totalIncome.subtract(totalExpense));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryExpenseDto> getExpensesByCategory(String userId, LocalDate start, LocalDate end) {
        List<Transaction> expenses = getUserTransactions(userId).stream()
                .filter(transaction -> transaction.getType() == Type.EXPENSE)
                .filter(transaction -> transaction.getDate() != null && (start == null || !transaction.getDate().isBefore(start)))
                .filter(transaction -> transaction.getDate() != null && (end == null || !transaction.getDate().isAfter(end)))
                .collect(Collectors.toList());

        BigDecimal totalExpenses = expenses.stream()
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(ZERO, BigDecimal::add);

        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategoryId,
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(ZERO, amount -> amount == null ? ZERO : amount, BigDecimal::add))
                ))
                .entrySet().stream()
                .map(entry -> {
                    CategoryExpenseDto dto = new CategoryExpenseDto();
                    dto.setCategory(entry.getKey());
                    dto.setTotalAmount(entry.getValue());
                    dto.setPercentage(totalExpenses.compareTo(ZERO) == 0
                            ? 0.0
                            : entry.getValue().divide(totalExpenses, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponse> getRecentTransactions(String userId, int limit) {
        if (limit <= 0) {
            return List.of();
        }
        return transactionRepository.findByUserIdOrderByDateDesc(userId).stream()
                .limit(limit)
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
