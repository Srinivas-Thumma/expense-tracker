package com.expensetracker.repository;

import com.expensetracker.entity.Category;
import com.expensetracker.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<Category> findByUserIdAndTypeOrderByNameAsc(UUID userId, CategoryType type);

    Optional<Category> findByIdAndUserId(UUID id, UUID userId);

    List<Category> findByUserIsNullOrderByNameAsc();

    List<Category> findByUserIsNullAndTypeOrderByNameAsc(CategoryType type);

    Optional<Category> findByIdAndUserIsNull(UUID id);

    void deleteByUserId(UUID userId);
}
