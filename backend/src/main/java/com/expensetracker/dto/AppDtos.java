package com.expensetracker.dto;

import com.expensetracker.entity.CategoryType;
import com.expensetracker.entity.RecurrenceType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class AppDtos {
    public record CategoryRequest(String name, CategoryType type) {}

    public record CategoryResponse(UUID id, String name, CategoryType type) {}

    public record MoneyRequest(
            UUID categoryId,
            BigDecimal amount,
            LocalDate date,
            String description,
            boolean recurring,
            RecurrenceType recurrenceType
    ) {}

    public record MoneyResponse(
            UUID id,
            UUID categoryId,
            String categoryName,
            BigDecimal amount,
            LocalDate date,
            String description,
            boolean recurring,
            RecurrenceType recurrenceType
    ) {}

    public record BudgetRequest(String budgetType, BigDecimal amount, LocalDate startDate, LocalDate endDate) {}

    public record BudgetResponse(UUID id, String budgetType, BigDecimal amount, LocalDate startDate, LocalDate endDate) {}

    public record NotificationResponse(UUID id, String message, boolean read) {}

    public record ProfileRequest(String name, String phone, String profilePicture) {}

    public record ProfileResponse(UUID id, String name, String email, String phone, String profilePicture, String role) {}

    public record Summary(BigDecimal income, BigDecimal expenses, BigDecimal balance) {}

    public record CategoryTotal(String category, BigDecimal amount) {}

    public record ExpensePeriodSummary(BigDecimal today, BigDecimal week, BigDecimal month, BigDecimal year) {}

    public record DashboardResponse(Summary summary, List<CategoryTotal> expenseByCategory, ExpensePeriodSummary expensePeriods) {}

    public record MonthlyTotal(String month, BigDecimal income, BigDecimal expenses) {}

    public record RecentTransaction(UUID id, String kind, String categoryName, BigDecimal amount, LocalDate date, String description) {}

    public record ReportResponse(
            Summary summary,
            List<CategoryTotal> expenseByCategory,
            List<CategoryTotal> incomeByCategory,
            List<MonthlyTotal> monthlyTrend,
            List<RecentTransaction> recentTransactions
    ) {}
}
