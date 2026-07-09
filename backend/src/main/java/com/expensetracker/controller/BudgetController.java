package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.BudgetRequest;
import com.expensetracker.dto.AppDtos.BudgetResponse;
import com.expensetracker.entity.Budget;
import com.expensetracker.entity.User;
import com.expensetracker.repository.BudgetRepository;
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
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetRepository budgetRepository;
    private final UserService userService;

    public BudgetController(BudgetRepository budgetRepository, UserService userService) {
        this.budgetRepository = budgetRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<BudgetResponse> list(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return budgetRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public BudgetResponse create(@RequestBody BudgetRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Budget budget = new Budget();
        apply(budget, request, user);
        return toResponse(budgetRepository.save(budget));
    }

    @PutMapping("/{id}")
    public BudgetResponse update(@PathVariable UUID id, @RequestBody BudgetRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId()).orElseThrow();
        apply(budget, request, user);
        return toResponse(budgetRepository.save(budget));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        budgetRepository.findByIdAndUserId(id, user.getId()).ifPresent(budgetRepository::delete);
    }

    private void apply(Budget budget, BudgetRequest request, User user) {
        budget.setUser(user);
        budget.setBudgetType(request.budgetType());
        budget.setAmount(request.amount());
        budget.setStartDate(request.startDate());
        budget.setEndDate(request.endDate());
    }

    private BudgetResponse toResponse(Budget budget) {
        return new BudgetResponse(budget.getId(), budget.getBudgetType(), budget.getAmount(), budget.getStartDate(), budget.getEndDate());
    }
}
