package com.expensetracker.dto;

import com.expensetracker.entity.Role;

import java.util.UUID;

public class AuthDtos {
    public record RegisterRequest(String name, String email, String password) {}

    public record LoginRequest(String email, String password) {}

    public record AuthResponse(String token, UUID id, String name, String email, Role role) {}
}
