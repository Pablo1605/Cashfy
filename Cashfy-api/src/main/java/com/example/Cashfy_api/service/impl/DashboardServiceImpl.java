package com.example.Cashfy_api.service.impl;

import com.example.Cashfy_api.dto.CategoryExpenseDto;
import com.example.Cashfy_api.dto.ComparisonDto;
import com.example.Cashfy_api.dto.DashboardSummaryResponse;
import com.example.Cashfy_api.dto.MonthlySummaryDto;
import com.example.Cashfy_api.entity.Transaction;
import com.example.Cashfy_api.entity.enums.Type;
import com.example.Cashfy_api.mapper.TransactionMapper;
import com.example.Cashfy_api.repository.TransactionRepository;
import com.example.Cashfy_api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DashboardServiceImpl implements DashboardService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;


    @Override
    public DashboardSummaryResponse getDashboardData(String userId) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        BigDecimal totalIncome = sumByType(transactions, Type.INCOME); 
        BigDecimal totalExpense = sumByType(transactions, Type.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);
        BigDecimal monthlyIncome = sumByType(filterByDate(transactions, monthStart, monthEnd), Type.INCOME);
        BigDecimal monthlyExpenses = sumByType(filterByDate(transactions, monthStart, monthEnd), Type.EXPENSE);

        Map<String, BigDecimal> expensesByCategory = filterByDate(transactions, monthStart, monthEnd).stream()
                .filter(transaction -> transaction.getType() == Type.EXPENSE)
                .collect(Collectors.groupingBy(Transaction::getCategoryId,
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(ZERO, amount -> amount == null ? ZERO : amount, BigDecimal::add))));

        List<Transaction> recentTransactions = transactions.stream()
                .filter(transaction -> transaction.getDate() != null)
                .sorted(Comparator.comparing(Transaction::getDate).reversed())
                .limit(5)
                .collect(Collectors.toList());

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setBalance(balance);
        response.setMonthlyIncome(monthlyIncome);
        response.setMonthlyExpenses(monthlyExpenses);
        response.setRecentTransactions(recentTransactions.stream().map(transactionMapper::toDTO).collect(Collectors.toList()));
        response.setExpensesByCategory(expensesByCategory);
        return response;
    }

    @Override
    public List<MonthlySummaryDto> getMonthlyStatistics(String userId) {
        int year = LocalDate.now().getYear();
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        return transactions.stream()
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
    public List<CategoryExpenseDto> getExpenseDistribution(String userId) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        List<Transaction> transactions = filterByDate(transactionRepository.findByUserId(userId), monthStart, monthEnd);

        BigDecimal totalExpenses = transactions.stream()
                .filter(transaction -> transaction.getType() == Type.EXPENSE)
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(ZERO, BigDecimal::add);

        return transactions.stream()
                .filter(transaction -> transaction.getType() == Type.EXPENSE)
                .collect(Collectors.groupingBy(Transaction::getCategoryId,
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(ZERO, amount -> amount == null ? ZERO : amount, BigDecimal::add))))
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
    public ComparisonDto getIncomeExpenseComparison(String userId) {
        LocalDate now = LocalDate.now();
        LocalDate currentStart = now.withDayOfMonth(1);
        LocalDate currentEnd = now.withDayOfMonth(now.lengthOfMonth());
        LocalDate previousMonth = now.minusMonths(1);
        LocalDate previousStart = previousMonth.withDayOfMonth(1);
        LocalDate previousEnd = previousMonth.withDayOfMonth(previousMonth.lengthOfMonth());
        List<Transaction> transactions = transactionRepository.findByUserId(userId);

        BigDecimal currentIncome = sumByType(filterByDate(transactions, currentStart, currentEnd), Type.INCOME);
        BigDecimal currentExpense = sumByType(filterByDate(transactions, currentStart, currentEnd), Type.EXPENSE);
        BigDecimal previousIncome = sumByType(filterByDate(transactions, previousStart, previousEnd), Type.INCOME);
        BigDecimal previousExpense = sumByType(filterByDate(transactions, previousStart, previousEnd), Type.EXPENSE);

        ComparisonDto dto = new ComparisonDto();
        dto.setCurrentPeriodIncome(currentIncome);
        dto.setCurrentPeriodExpense(currentExpense);
        dto.setPreviousPeriodIncome(previousIncome);
        dto.setPreviousPeriodExpense(previousExpense);
        dto.setIncomePercentageChange(calculatePercentageChange(previousIncome, currentIncome));
        dto.setExpensePercentageChange(calculatePercentageChange(previousExpense, currentExpense));
        return dto;
    }

    private BigDecimal sumByType(List<Transaction> transactions, Type type) {
        return transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(ZERO, BigDecimal::add);
    }

    private List<Transaction> filterByDate(List<Transaction> transactions, LocalDate start, LocalDate end) {
        return transactions.stream()
                .filter(transaction -> transaction.getDate() != null)
                .filter(transaction -> (start == null || !transaction.getDate().isBefore(start)))
                .filter(transaction -> (end == null || !transaction.getDate().isAfter(end)))
                .collect(Collectors.toList());
    }

    private Double calculatePercentageChange(BigDecimal previous, BigDecimal current) {
        if (previous == null || current == null) {
            return 0.0;
        }
        if (previous.compareTo(ZERO) == 0) {
            return current.compareTo(ZERO) == 0 ? 0.0 : 100.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
