package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.DashboardResponse;
import com.expensetracker.entity.User;
import com.expensetracker.service.FinanceService;
import com.expensetracker.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api")
public class DashboardController {
    private final FinanceService financeService;
    private final UserService userService;

    public DashboardController(FinanceService financeService, UserService userService) {
        this.financeService = financeService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return financeService.dashboard(user);
    }

    @GetMapping("/reports/monthly")
    public DashboardResponse monthlyReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            Authentication authentication
    ) {
        LocalDate now = LocalDate.now();
        User user = userService.currentUser(authentication);
        return financeService.monthlyReport(
                user,
                year == null ? now.getYear() : year,
                month == null ? now.getMonthValue() : month
        );
    }
}
