package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.NotificationResponse;
import com.expensetracker.entity.Notification;
import com.expensetracker.entity.User;
import com.expensetracker.repository.NotificationRepository;
import com.expensetracker.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationController(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<NotificationResponse> list(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable UUID id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Notification notification = notificationRepository.findByIdAndUserId(id, user.getId()).orElseThrow();
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(notification.getId(), notification.getMessage(), notification.isRead());
    }
}
