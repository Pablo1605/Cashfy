package com.example.Cashfy_api.service;

import com.example.Cashfy_api.dto.CategoryExpenseDto;
import com.example.Cashfy_api.dto.ComparisonDto;
import com.example.Cashfy_api.dto.DashboardSummaryResponse;
import com.example.Cashfy_api.dto.MonthlySummaryDto;

import java.util.List;


public interface DashboardService {
    DashboardSummaryResponse getDashboardData(String userId);
    List<MonthlySummaryDto> getMonthlyStatistics(String userId);
    List<CategoryExpenseDto> getExpenseDistribution(String userId);
    ComparisonDto getIncomeExpenseComparison(String userId);
}
