import type { Transaction } from "./Transaction";

export type DashboardSummaryResponse = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    monthlyExpenses: number;
    monthlyIncome: number;
    recentTransactions: Transaction[];
    expensesByCategory: Record<string, number>;
};

export type MonthlySummaryDto = {
    month: number;
    monthName: string;
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
};

export type CategoryExpenseDto = {
    category: string;
    totalAmount: number;
    percentage: number;
};