package com.expensetracker.controller;

import com.expensetracker.dto.AppDtos.CategoryRequest;
import com.expensetracker.dto.AppDtos.CategoryResponse;
import com.expensetracker.entity.Category;
import com.expensetracker.entity.User;
import com.expensetracker.repository.CategoryRepository;
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
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public CategoryController(CategoryRepository categoryRepository, UserService userService) {
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<CategoryResponse> list(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return categoryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    @PostMapping
    public CategoryResponse create(@RequestBody CategoryRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Category category = new Category();
        category.setUser(user);
        category.setName(request.name());
        category.setType(request.type());
        return toResponse(categoryRepository.save(category));
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable UUID id, @RequestBody CategoryRequest request, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Category category = categoryRepository.findByIdAndUserId(id, user.getId()).orElseThrow();
        category.setName(request.name());
        category.setType(request.type());
        return toResponse(categoryRepository.save(category));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        categoryRepository.findByIdAndUserId(id, user.getId()).ifPresent(categoryRepository::delete);
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getType());
    }
}
