package com.expensetracker.controller;

import com.expensetracker.dto.AdminDtos.AdminDashboardResponse;
import com.expensetracker.dto.AdminDtos.AdminUserFinanceResponse;
import com.expensetracker.dto.AdminDtos.CreateUserRequest;
import com.expensetracker.dto.AdminDtos.UpdateRoleRequest;
import com.expensetracker.dto.AdminDtos.UserResponse;
import com.expensetracker.dto.AppDtos.BudgetRequest;
import com.expensetracker.dto.AppDtos.BudgetResponse;
import com.expensetracker.dto.AppDtos.MoneyRequest;
import com.expensetracker.dto.AppDtos.MoneyResponse;

import com.expensetracker.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
      
    }

    @GetMapping("/test")
    public String test() {
        return "Welcome Admin!";
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return adminService.getAllUsers();
    }

    @PostMapping("/users")
    public UserResponse createUser(@RequestBody CreateUserRequest request) {
        return adminService.createUser(request);
    }

    @GetMapping("/users/{id}")
    public AdminUserFinanceResponse userFinance(@PathVariable UUID id) {
        return adminService.getUserFinance(id);
    }

    @PostMapping("/users/{id}/income")
    public MoneyResponse createIncome(@PathVariable UUID id, @RequestBody MoneyRequest request) {
        return adminService.createUserIncome(id, request);
    }

    @PutMapping("/users/{id}/income/{incomeId}")
    public MoneyResponse updateIncome(@PathVariable UUID id, @PathVariable UUID incomeId, @RequestBody MoneyRequest request) {
        return adminService.updateUserIncome(id, incomeId, request);
    }

    @DeleteMapping("/users/{id}/income/{incomeId}")
    public void deleteIncome(@PathVariable UUID id, @PathVariable UUID incomeId) {
        adminService.deleteUserIncome(id, incomeId);
    }

    @PostMapping("/users/{id}/expenses")
    public MoneyResponse createExpense(@PathVariable UUID id, @RequestBody MoneyRequest request) {
        return adminService.createUserExpense(id, request);
    }

    @PutMapping("/users/{id}/expenses/{expenseId}")
    public MoneyResponse updateExpense(@PathVariable UUID id, @PathVariable UUID expenseId, @RequestBody MoneyRequest request) {
        return adminService.updateUserExpense(id, expenseId, request);
    }

    @DeleteMapping("/users/{id}/expenses/{expenseId}")
    public void deleteExpense(@PathVariable UUID id, @PathVariable UUID expenseId) {
        adminService.deleteUserExpense(id, expenseId);
    }

    @PostMapping("/users/{id}/budgets")
    public BudgetResponse createBudget(@PathVariable UUID id, @RequestBody BudgetRequest request) {
        return adminService.createUserBudget(id, request);
    }

    @PutMapping("/users/{id}/budgets/{budgetId}")
    public BudgetResponse updateBudget(@PathVariable UUID id, @PathVariable UUID budgetId, @RequestBody BudgetRequest request) {
        return adminService.updateUserBudget(id, budgetId, request);
    }

    @DeleteMapping("/users/{id}/budgets/{budgetId}")
    public void deleteBudget(@PathVariable UUID id, @PathVariable UUID budgetId) {
        adminService.deleteUserBudget(id, budgetId);
    }

   @PutMapping("/users/{id}/role")
public UserResponse updateRole(
        @PathVariable UUID id,
        @RequestBody UpdateRoleRequest request) {

    return adminService.updateRole(id, request.role());
}

    @DeleteMapping("/users/{id}")
public void deleteUser(@PathVariable UUID id) {
    adminService.deleteUser(id);
}

}
