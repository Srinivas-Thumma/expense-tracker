package com.expensetracker.service;

import com.expensetracker.dto.AdminDtos.AdminDashboardResponse;
import com.expensetracker.dto.AdminDtos.AdminUserFinanceResponse;
import com.expensetracker.dto.AdminDtos.CreateUserRequest;
import com.expensetracker.dto.AdminDtos.UserResponse;
import com.expensetracker.dto.AppDtos.BudgetRequest;
import com.expensetracker.dto.AppDtos.BudgetResponse;
import com.expensetracker.dto.AppDtos.MoneyRequest;
import com.expensetracker.dto.AppDtos.MoneyResponse;
import com.expensetracker.dto.AppDtos.MonthlyTotal;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.CategoryType;
import com.expensetracker.entity.Role;
import com.expensetracker.entity.User;
import com.expensetracker.entity.RecurrenceType;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.NotificationRepository;
import com.expensetracker.repository.UserRepository;

import jakarta.transaction.Transactional;

import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationRepository notificationRepository;
    private final FinanceService financeService;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        IncomeRepository incomeRepository,
                        ExpenseRepository expenseRepository,
                       BudgetRepository budgetRepository,
        CategoryRepository categoryRepository,
        NotificationRepository notificationRepository,
        FinanceService financeService,
        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.notificationRepository = notificationRepository;
        this.financeService = financeService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void seedMasterCategories() {
        if (!categoryRepository.findByUserIsNullOrderByNameAsc().isEmpty()) {
            return;
        }
        createMasterCategory("Salary", CategoryType.INCOME);
        createMasterCategory("Investment", CategoryType.INCOME);
        createMasterCategory("Food", CategoryType.EXPENSE);
        createMasterCategory("Travel", CategoryType.EXPENSE);
        createMasterCategory("Shopping", CategoryType.EXPENSE);
        createMasterCategory("Bills", CategoryType.EXPENSE);
        createMasterCategory("Entertainment", CategoryType.EXPENSE);
        createMasterCategory("Healthcare", CategoryType.EXPENSE);
        createMasterCategory("Education", CategoryType.EXPENSE);
        createMasterCategory("Fuel", CategoryType.EXPENSE);
    }

    public AdminDashboardResponse getDashboard() {

        long totalUsers = userRepository.count();

        BigDecimal totalIncome = incomeRepository.findAll().stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = expenseRepository.findAll().stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalTransactions = incomeRepository.count() + expenseRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalIncome,
                totalExpenses,
                totalTransactions,
                monthlyTrend()
        );
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByNameAsc().stream()
                .map(this::toUserResponse)
                .toList();
    }

    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() == null ? Role.ROLE_USER : request.role());
        return toUserResponse(userRepository.save(user));
    }

    public AdminUserFinanceResponse getUserFinance(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        List<Income> income = incomeRepository.findByUserIdOrderByDateDesc(id);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(id);
        List<Budget> budgets = budgetRepository.findByUserIdOrderByCreatedAtDesc(id);

        BigDecimal totalIncome = income.stream().map(Income::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalBudget = budgets.stream().map(Budget::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add);
        java.time.LocalDate now = java.time.LocalDate.now();

        return new AdminUserFinanceResponse(
                toUserResponse(user),
                totalIncome,
                totalExpenses,
                totalBudget,
                income.stream().map(this::toMoneyResponse).toList(),
                expenses.stream().map(this::toMoneyResponse).toList(),
                budgets.stream().map(this::toBudgetResponse).toList(),
                financeService.report(user, now.getYear(), now.getMonthValue())
        );
    }

    public MoneyResponse createUserIncome(UUID userId, MoneyRequest request) {
        User user = getUser(userId);
        Income income = new Income();
        applyMoney(income, request, user);
        return toMoneyResponse(incomeRepository.save(income));
    }

    public MoneyResponse updateUserIncome(UUID userId, UUID incomeId, MoneyRequest request) {
        User user = getUser(userId);
        Income income = incomeRepository.findByIdAndUserId(incomeId, userId).orElseThrow(() -> new RuntimeException("Income not found"));
        applyMoney(income, request, user);
        return toMoneyResponse(incomeRepository.save(income));
    }

    public void deleteUserIncome(UUID userId, UUID incomeId) {
        incomeRepository.findByIdAndUserId(incomeId, userId).ifPresent(incomeRepository::delete);
    }

    public MoneyResponse createUserExpense(UUID userId, MoneyRequest request) {
        User user = getUser(userId);
        Expense expense = new Expense();
        applyMoney(expense, request, user);
        MoneyResponse response = toMoneyResponse(expenseRepository.save(expense));
        financeService.checkBudget(user);
        return response;
    }

    public MoneyResponse updateUserExpense(UUID userId, UUID expenseId, MoneyRequest request) {
        User user = getUser(userId);
        Expense expense = expenseRepository.findByIdAndUserId(expenseId, userId).orElseThrow(() -> new RuntimeException("Expense not found"));
        applyMoney(expense, request, user);
        MoneyResponse response = toMoneyResponse(expenseRepository.save(expense));
        financeService.checkBudget(user);
        return response;
    }

    public void deleteUserExpense(UUID userId, UUID expenseId) {
        expenseRepository.findByIdAndUserId(expenseId, userId).ifPresent(expenseRepository::delete);
    }

    public BudgetResponse createUserBudget(UUID userId, BudgetRequest request) {
        User user = getUser(userId);
        Budget budget = new Budget();
        applyBudget(budget, request, user);
        return toBudgetResponse(budgetRepository.save(budget));
    }

    public BudgetResponse updateUserBudget(UUID userId, UUID budgetId, BudgetRequest request) {
        User user = getUser(userId);
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId).orElseThrow(() -> new RuntimeException("Budget not found"));
        applyBudget(budget, request, user);
        return toBudgetResponse(budgetRepository.save(budget));
    }

    public void deleteUserBudget(UUID userId, UUID budgetId) {
        budgetRepository.findByIdAndUserId(budgetId, userId).ifPresent(budgetRepository::delete);
    }

   public UserResponse updateRole(UUID id, Role role) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setRole(role);

    userRepository.save(user);

    return toUserResponse(user);
}
  @Transactional
    public void deleteUser(UUID id) {

    notificationRepository.deleteByUserId(id);
    budgetRepository.deleteByUserId(id);
    incomeRepository.deleteByUserId(id);
    expenseRepository.deleteByUserId(id);
    categoryRepository.deleteByUserId(id);

    userRepository.deleteById(id);
}

    private void createMasterCategory(String name, CategoryType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        categoryRepository.save(category);
    }

    private User getUser(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void applyMoney(Income income, MoneyRequest request, User user) {
        Category category = categoryRepository.findByIdAndUserIsNull(request.categoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
        income.setUser(user);
        income.setCategory(category);
        income.setAmount(request.amount());
        income.setDate(request.date());
        income.setDescription(request.description());
        income.setRecurring(request.recurring());
        income.setRecurrenceType(request.recurrenceType() == null ? RecurrenceType.NONE : request.recurrenceType());
    }

    private void applyMoney(Expense expense, MoneyRequest request, User user) {
        Category category = categoryRepository.findByIdAndUserIsNull(request.categoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(request.amount());
        expense.setDate(request.date());
        expense.setDescription(request.description());
        expense.setRecurring(request.recurring());
        expense.setRecurrenceType(request.recurrenceType() == null ? RecurrenceType.NONE : request.recurrenceType());
    }

    private void applyBudget(Budget budget, BudgetRequest request, User user) {
        budget.setUser(user);
        budget.setBudgetType(request.budgetType());
        budget.setAmount(request.amount());
        budget.setStartDate(request.startDate());
        budget.setEndDate(request.endDate());
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getProfilePicture()
        );
    }

    private MoneyResponse toMoneyResponse(Income income) {
        return new MoneyResponse(
                income.getId(),
                income.getCategory() == null ? null : income.getCategory().getId(),
                income.getCategory() == null ? "Uncategorized" : income.getCategory().getName(),
                income.getAmount(),
                income.getDate(),
                income.getDescription(),
                income.isRecurring(),
                income.getRecurrenceType()
        );
    }

    private MoneyResponse toMoneyResponse(Expense expense) {
        return new MoneyResponse(
                expense.getId(),
                expense.getCategory() == null ? null : expense.getCategory().getId(),
                expense.getCategory() == null ? "Uncategorized" : expense.getCategory().getName(),
                expense.getAmount(),
                expense.getDate(),
                expense.getDescription(),
                expense.isRecurring(),
                expense.getRecurrenceType()
        );
    }

    private BudgetResponse toBudgetResponse(Budget budget) {
        return new BudgetResponse(budget.getId(), budget.getBudgetType(), budget.getAmount(), budget.getStartDate(), budget.getEndDate());
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private List<MonthlyTotal> monthlyTrend() {
        List<MonthlyTotal> totals = new java.util.ArrayList<>();
        YearMonth endMonth = YearMonth.now();
        YearMonth current = endMonth.minusMonths(5);
        while (!current.isAfter(endMonth)) {
            LocalDate start = current.atDay(1);
            LocalDate end = current.atEndOfMonth();
            String label = current.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + current.getYear();
            totals.add(new MonthlyTotal(
                    label,
                    incomeRepository.findByDateBetween(start, end).stream().map(Income::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add),
                    expenseRepository.findByDateBetween(start, end).stream().map(Expense::getAmount).map(this::safe).reduce(BigDecimal.ZERO, BigDecimal::add)
            ));
            current = current.plusMonths(1);
        }
        return totals;
    }
    
}
