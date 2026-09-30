import apiClient from "./http";
import type { DashboardSummaryResponse, MonthlySummaryDto, CategoryExpenseDto } from "../types/Dashboard";

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
    const response = await apiClient.get("/api/dashboard/summary");
    return response.data;
};

export const getMonthlyStatistics = async (): Promise<MonthlySummaryDto[]> => {
    const response = await apiClient.get("/api/dashboard/monthly-stats");
    return response.data;
};

export const getCategoryExpenses = async (): Promise<CategoryExpenseDto[]> => {
    const response = await apiClient.get("/api/dashboard/category-expenses");
    return response.data;
};