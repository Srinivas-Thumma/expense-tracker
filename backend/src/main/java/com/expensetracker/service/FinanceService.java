package com.expensetracker.service;

import com.expensetracker.dto.AppDtos.CategoryTotal;
import com.expensetracker.dto.AppDtos.DashboardResponse;
import com.expensetracker.dto.AppDtos.ExpensePeriodSummary;
import com.expensetracker.dto.AppDtos.MonthlyTotal;
import com.expensetracker.dto.AppDtos.RecentTransaction;
import com.expensetracker.dto.AppDtos.ReportResponse;
import com.expensetracker.dto.AppDtos.Summary;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.Notification;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;


@Service
public class FinanceService {
    private final EmailService emailService;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final NotificationRepository notificationRepository;

    public FinanceService(
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            NotificationRepository notificationRepository,
            EmailService emailService
    ) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public DashboardResponse dashboard(User user) {
        List<Income> income = incomeRepository.findByUserIdOrderByDateDesc(user.getId());
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());
        BigDecimal totalIncome = sumIncome(income);
        BigDecimal totalExpenses = sumExpenses(expenses);

        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        for (Expense expense : expenses) {
            String category = expense.getCategory() == null ? "Uncategorized" : expense.getCategory().getName();
            byCategory.merge(category, safe(expense.getAmount()), BigDecimal::add);
        }

        List<CategoryTotal> categoryTotals = byCategory.entrySet()
                .stream()
                .map(entry -> new CategoryTotal(entry.getKey(), entry.getValue()))
                .toList();

        return new DashboardResponse(
                new Summary(totalIncome, totalExpenses, totalIncome.subtract(totalExpenses)),
                categoryTotals,
                expensePeriods(expenses)
        );
    }

    public DashboardResponse monthlyReport(User user, int year, int month) {
        ReportResponse report = report(user, year, month);
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(
                user.getId(),
                LocalDate.of(year, month, 1),
                LocalDate.of(year, month, 1).withDayOfMonth(LocalDate.of(year, month, 1).lengthOfMonth())
        );
        return new DashboardResponse(report.summary(), report.expenseByCategory(), expensePeriods(expenses));
    }

    public ReportResponse report(User user, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        List<Income> income = incomeRepository.findByUserIdAndDateBetween(user.getId(), start, end);
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);

        BigDecimal totalIncome = sumIncome(income);
        BigDecimal totalExpenses = sumExpenses(expenses);
        return new ReportResponse(
                new Summary(totalIncome, totalExpenses, totalIncome.subtract(totalExpenses)),
                totalsByExpenseCategory(expenses),
                totalsByIncomeCategory(income),
                monthlyTrend(user, YearMonth.of(year, month).minusMonths(5), YearMonth.of(year, month)),
                recentTransactions(income, expenses)
        );
    }

    public void checkBudget(User user) {
        BigDecimal expenses = sumExpenses(expenseRepository.findByUserIdOrderByDateDesc(user.getId()));
        for (Budget budget : budgetRepository.findByUserIdOrderByCreatedAtDesc(user.getId())) {
           if (budget.getAmount() != null &&
            expenses.compareTo(budget.getAmount()) > 0) {

              System.out.println("checkBudget() called");
            System.out.println("Expenses = " + expenses);
            System.out.println("Budget = " + budget.getAmount());
            System.out.println("Sending email to: " + user.getEmail());  

           Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("Budget exceeded for " + budget.getBudgetType());
            notification.setRead(false);


            notificationRepository.save(notification);

            emailService.sendBudgetExceededEmail(
            user.getEmail(),
            budget.getBudgetType()
        );
        

    return;
}
        }
    }

    private BigDecimal sumIncome(List<Income> income) {
        return income.stream().map(Income::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumExpenses(List<Expense> expenses) {
        return expenses.stream().map(Expense::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private ExpensePeriodSummary expensePeriods(List<Expense> expenses) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate yearStart = today.withDayOfYear(1);

        return new ExpensePeriodSummary(
                sumExpensesBetween(expenses, today, today),
                sumExpensesBetween(expenses, weekStart, today),
                sumExpensesBetween(expenses, monthStart, today),
                sumExpensesBetween(expenses, yearStart, today)
        );
    }

    private BigDecimal sumExpensesBetween(List<Expense> expenses, LocalDate startDate, LocalDate endDate) {
        return expenses.stream()
                .filter(expense -> expense.getDate() != null
                        && !expense.getDate().isBefore(startDate)
                        && !expense.getDate().isAfter(endDate))
                .map(Expense::getAmount)
                .map(this::safe)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<CategoryTotal> totalsByExpenseCategory(List<Expense> expenses) {
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        for (Expense expense : expenses) {
            String category = expense.getCategory() == null ? "Uncategorized" : expense.getCategory().getName();
            totals.merge(category, safe(expense.getAmount()), BigDecimal::add);
        }
        return totals.entrySet().stream()
                .map(entry -> new CategoryTotal(entry.getKey(), entry.getValue()))
                .sorted((left, right) -> right.amount().compareTo(left.amount()))
                .toList();
    }

    private List<CategoryTotal> totalsByIncomeCategory(List<Income> income) {
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        for (Income item : income) {
            String category = item.getCategory() == null ? "Uncategorized" : item.getCategory().getName();
            totals.merge(category, safe(item.getAmount()), BigDecimal::add);
        }
        return totals.entrySet().stream()
                .map(entry -> new CategoryTotal(entry.getKey(), entry.getValue()))
                .sorted((left, right) -> right.amount().compareTo(left.amount()))
                .toList();
    }

    private List<MonthlyTotal> monthlyTrend(User user, YearMonth startMonth, YearMonth endMonth) {
        List<MonthlyTotal> totals = new java.util.ArrayList<>();
        YearMonth current = startMonth;
        while (!current.isAfter(endMonth)) {
            LocalDate start = current.atDay(1);
            LocalDate end = current.atEndOfMonth();
            String label = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + current.getYear();
            totals.add(new MonthlyTotal(
                    label,
                    sumIncome(incomeRepository.findByUserIdAndDateBetween(user.getId(), start, end)),
                    sumExpenses(expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end))
            ));
            current = current.plusMonths(1);
        }
        return totals;
    }

    private List<RecentTransaction> recentTransactions(List<Income> income, List<Expense> expenses) {
        List<RecentTransaction> transactions = new java.util.ArrayList<>();
        for (Income item : income) {
            transactions.add(new RecentTransaction(
                    item.getId(),
                    "Income",
                    item.getCategory() == null ? "Uncategorized" : item.getCategory().getName(),
                    item.getAmount(),
                    item.getDate(),
                    item.getDescription()
            ));
        }
        for (Expense item : expenses) {
            transactions.add(new RecentTransaction(
                    item.getId(),
                    "Expense",
                    item.getCategory() == null ? "Uncategorized" : item.getCategory().getName(),
                    item.getAmount(),
                    item.getDate(),
                    item.getDescription()
            ));
        }
        return transactions.stream()
                .sorted(Comparator.comparing(RecentTransaction::date).reversed())
                .limit(8)
                .toList();
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
