package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.MoneyRequest;
import com.expensetracker.dto.AppDtos.MoneyResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.Income;
import com.expensetracker.entity.RecurrenceType;
import com.expensetracker.entity.User;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.IncomeRepository;
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
@RequestMapping("/api/income")
public class IncomeController {
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public IncomeController(IncomeRepository incomeRepository, CategoryRepository categoryRepository, UserService userService) {
        this.incomeRepository = incomeRepository;
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<MoneyResponse> list(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return incomeRepository.findByUserIdOrderByDateDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public MoneyResponse create(@RequestBody MoneyRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Income income = new Income();
        apply(income, request, user);
        return toResponse(incomeRepository.save(income));
    }

    @PutMapping("/{id}")
    public MoneyResponse update(@PathVariable UUID id, @RequestBody MoneyRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Income income = incomeRepository.findByIdAndUserId(id, user.getId()).orElseThrow();
        apply(income, request, user);
        return toResponse(incomeRepository.save(income));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        incomeRepository.findByIdAndUserId(id, user.getId()).ifPresent(incomeRepository::delete);
    }

    private void apply(Income income, MoneyRequest request, User user) {
        Category category = categoryRepository.findByIdAndUserIsNull(request.categoryId()).orElseThrow();
        income.setUser(user);
        income.setCategory(category);
        income.setAmount(request.amount());
        income.setDate(request.date());
        income.setDescription(request.description());
        income.setRecurring(request.recurring());
        income.setRecurrenceType(request.recurrenceType() == null ? RecurrenceType.NONE : request.recurrenceType());
    }

    private MoneyResponse toResponse(Income income) {
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
}
