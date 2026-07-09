package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.ProfileRequest;
import com.expensetracker.dto.AppDtos.ProfileResponse;
import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;
    private final UserRepository userRepository;

    public ProfileController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ProfileResponse get(Authentication authentication) {
        return toResponse(userService.currentUser(authentication));
    }

    @PutMapping
    public ProfileResponse update(@RequestBody ProfileRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setProfilePicture(request.profilePicture());
        user.setUpdatedAt(LocalDateTime.now());
        return toResponse(userRepository.save(user));
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getProfilePicture(),
                user.getRole().name()
        );
    }
}
