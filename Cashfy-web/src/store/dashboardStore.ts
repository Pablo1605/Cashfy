import { create } from "zustand";
import type { DashboardSummaryResponse, MonthlySummaryDto, CategoryExpenseDto } from "../types/Dashboard";

interface DashboardState {
    summary?: DashboardSummaryResponse;
    monthlyStats: MonthlySummaryDto[];
    categoryExpenses: CategoryExpenseDto[];
    setSummary: (summary: DashboardSummaryResponse) => void;
    setMonthlyStats: (monthlyStats: MonthlySummaryDto[]) => void;
    setCategoryExpenses: (categoryExpenses: CategoryExpenseDto[]) => void;
    clearDashboard: () => void;
}

export const dashboardStore = create<DashboardState>((set) => ({
    summary: undefined,
    monthlyStats: [],
    categoryExpenses: [],
    setSummary: (summary) => set({ summary }),
    setMonthlyStats: (monthlyStats) => set({ monthlyStats }),
    setCategoryExpenses: (categoryExpenses) => set({ categoryExpenses }),
    clearDashboard: () => set({ summary: undefined, monthlyStats: [], categoryExpenses: [] }),
}));