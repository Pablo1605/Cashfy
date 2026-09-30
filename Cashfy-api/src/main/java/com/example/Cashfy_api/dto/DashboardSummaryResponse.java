package com.example.Cashfy_api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardSummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private BigDecimal monthlyExpenses;
    private BigDecimal monthlyIncome;
    private List<TransactionResponse> recentTransactions;
    private Map<String, BigDecimal> expensesByCategory;

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public BigDecimal getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(BigDecimal monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public Map<String, BigDecimal> getExpensesByCategory() {
        return expensesByCategory;
    }

    public void setExpensesByCategory(Map<String, BigDecimal> expensesByCategory) {
        this.expensesByCategory = expensesByCategory;
    }
}
