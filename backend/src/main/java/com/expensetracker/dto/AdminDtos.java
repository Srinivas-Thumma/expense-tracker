package com.expensetracker.dto;

import com.expensetracker.entity.Role;
import com.expensetracker.dto.AppDtos.MonthlyTotal;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class AdminDtos {

    public record AdminDashboardResponse(
            long totalUsers,
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            long totalTransactions,
            List<MonthlyTotal> monthlyTrend
    ) {}

    public record UserResponse(
            UUID id,
            String name,
            String email,
            Role role,
            String phone,
            String profilePicture
    ) {}

    public record UpdateRoleRequest(
            Role role
    ) {}

    public record CreateUserRequest(
            String name,
            String email,
            String password,
            Role role
    ) {}

    public record AdminUserFinanceResponse(
            UserResponse user,
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal totalBudget,
            List<com.expensetracker.dto.AppDtos.MoneyResponse> income,
            List<com.expensetracker.dto.AppDtos.MoneyResponse> expenses,
            List<com.expensetracker.dto.AppDtos.BudgetResponse> budgets,
            com.expensetracker.dto.AppDtos.ReportResponse report
    ) {}
}
