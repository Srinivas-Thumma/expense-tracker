package com.expensetracker.service;

import com.expensetracker.dto.AppDtos.CategoryTotal;
import com.expensetracker.dto.AppDtos.DashboardResponse;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


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
                categoryTotals
        );
    }

    public DashboardResponse monthlyReport(User user, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        List<Income> income = incomeRepository.findByUserIdAndDateBetween(user.getId(), start, end);
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(user.getId(), start, end);

        BigDecimal totalIncome = sumIncome(income);
        BigDecimal totalExpenses = sumExpenses(expenses);
        return new DashboardResponse(new Summary(totalIncome, totalExpenses, totalIncome.subtract(totalExpenses)), List.of());
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

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
