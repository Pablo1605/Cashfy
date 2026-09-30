import { useShallow } from "zustand/shallow";
import { dashboardStore } from "../store/dashboardStore";
import { getDashboardSummary, getMonthlyStatistics, getCategoryExpenses } from "../api/dashboardApi";
import type { DashboardSummaryResponse, MonthlySummaryDto, CategoryExpenseDto } from "../types/Dashboard";

export const useDashboard = () => {
    const { summary, monthlyStats, categoryExpenses, setSummary, setMonthlyStats, setCategoryExpenses, clearDashboard } =
        dashboardStore(useShallow((state) => ({
            summary: state.summary,
            monthlyStats: state.monthlyStats,
            categoryExpenses: state.categoryExpenses,
            setSummary: state.setSummary,
            setMonthlyStats: state.setMonthlyStats,
            setCategoryExpenses: state.setCategoryExpenses,
            clearDashboard: state.clearDashboard,
        })));

    const loadDashboardSummary = async (): Promise<DashboardSummaryResponse> => { 
        const result = await getDashboardSummary();
        setSummary(result);
        return result;
    };

    const loadMonthlyStatistics = async (): Promise<MonthlySummaryDto[]> => {
        const result = await getMonthlyStatistics();
        setMonthlyStats(result);
        return result;
    };

    const loadCategoryExpenses = async (): Promise<CategoryExpenseDto[]> => {
        const result = await getCategoryExpenses();
        setCategoryExpenses(result);
        return result;
    };

    return {
        summary,
        monthlyStats,
        categoryExpenses,
        loadDashboardSummary,
        loadMonthlyStatistics,
        loadCategoryExpenses,
        clearDashboard,
    };
};