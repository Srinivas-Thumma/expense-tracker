package com.expensetracker.controller;

import com.expensetracker.dto.AdminDtos.AdminDashboardResponse;
import com.expensetracker.dto.AdminDtos.AdminUserFinanceResponse;
import com.expensetracker.dto.AdminDtos.CreateUserRequest;
import com.expensetracker.dto.AdminDtos.UpdateRoleRequest;
import com.expensetracker.dto.AdminDtos.UserResponse;

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
