package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.MoneyRequest;
import com.expensetracker.dto.AppDtos.MoneyResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Expense;
import com.expensetracker.entity.RecurrenceType;
import com.expensetracker.entity.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.service.FinanceService;
import com.expensetracker.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final FinanceService financeService;

    public ExpenseController(ExpenseRepository expenseRepository, CategoryRepository categoryRepository, UserService userService, FinanceService financeService) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userService = userService;
        this.financeService = financeService;
    }

    @GetMapping
    public List<MoneyResponse> list(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public MoneyResponse create(@RequestBody MoneyRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Expense expense = new Expense();
        apply(expense, request, user);
        MoneyResponse response = toResponse(expenseRepository.save(expense));
        financeService.checkBudget(user);
        return response;
    }

    @PutMapping("/{id}")
    public MoneyResponse update(@PathVariable UUID id, @RequestBody MoneyRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Expense expense = expenseRepository.findByIdAndUserId(id, user.getId()).orElseThrow();
        apply(expense, request, user);
        return toResponse(expenseRepository.save(expense));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        expenseRepository.findByIdAndUserId(id, user.getId()).ifPresent(expenseRepository::delete);
    }

    private void apply(Expense expense, MoneyRequest request, User user) {
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), user.getId()).orElseThrow();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(request.amount());
        expense.setDate(request.date());
        expense.setDescription(request.description());
        expense.setRecurring(request.recurring());
        expense.setRecurrenceType(request.recurrenceType() == null ? RecurrenceType.NONE : request.recurrenceType());
    }

    private MoneyResponse toResponse(Expense expense) {
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
}
