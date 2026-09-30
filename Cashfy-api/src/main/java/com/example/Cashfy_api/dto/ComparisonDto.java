package com.example.Cashfy_api.dto;

import java.math.BigDecimal;

public class ComparisonDto {
    private BigDecimal currentPeriodIncome;
    private BigDecimal currentPeriodExpense;
    private BigDecimal previousPeriodIncome;
    private BigDecimal previousPeriodExpense;
    private Double incomePercentageChange;
    private Double expensePercentageChange;

    public BigDecimal getCurrentPeriodIncome() {
        return currentPeriodIncome;
    }

    public void setCurrentPeriodIncome(BigDecimal currentPeriodIncome) {
        this.currentPeriodIncome = currentPeriodIncome;
    }

    public BigDecimal getCurrentPeriodExpense() {
        return currentPeriodExpense;
    }

    public void setCurrentPeriodExpense(BigDecimal currentPeriodExpense) {
        this.currentPeriodExpense = currentPeriodExpense;
    }

    public BigDecimal getPreviousPeriodIncome() {
        return previousPeriodIncome;
    }

    public void setPreviousPeriodIncome(BigDecimal previousPeriodIncome) {
        this.previousPeriodIncome = previousPeriodIncome;
    }

    public BigDecimal getPreviousPeriodExpense() {
        return previousPeriodExpense;
    }

    public void setPreviousPeriodExpense(BigDecimal previousPeriodExpense) {
        this.previousPeriodExpense = previousPeriodExpense;
    }

    public Double getIncomePercentageChange() {
        return incomePercentageChange;
    }

    public void setIncomePercentageChange(Double incomePercentageChange) {
        this.incomePercentageChange = incomePercentageChange;
    }

    public Double getExpensePercentageChange() {
        return expensePercentageChange;
    }

    public void setExpensePercentageChange(Double expensePercentageChange) {
        this.expensePercentageChange = expensePercentageChange;
    }
}
