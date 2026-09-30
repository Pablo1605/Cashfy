package com.example.Cashfy_api.controller;

import com.example.Cashfy_api.auth.CurrentUserProvider;
import com.example.Cashfy_api.dto.CategoryExpenseDto;
import com.example.Cashfy_api.dto.DashboardSummaryResponse;
import com.example.Cashfy_api.dto.MonthlySummaryDto;
import com.example.Cashfy_api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    private final CurrentUserProvider currentUserProvider;

    private String getCurrentUserId() {
        return currentUserProvider.getCurrentUsername();
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getMonthlySummary() {
        String userId = getCurrentUserId();
        DashboardSummaryResponse summary = dashboardService.getDashboardData(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/monthly-stats")
    public ResponseEntity<List<MonthlySummaryDto>> getMonthlyStatistics() {
        String userId = getCurrentUserId();
        List<MonthlySummaryDto> statics = dashboardService.getMonthlyStatistics(userId);
        return ResponseEntity.ok(statics);
    }

    @GetMapping("/category-expenses")
    public ResponseEntity<List<CategoryExpenseDto>> getCategoryExpenses() {
        String userId = getCurrentUserId();
        List<CategoryExpenseDto> categoryExpenses = dashboardService.getExpenseDistribution(userId);
        return ResponseEntity.ok(categoryExpenses);
    }
}
