package com.expensetracker.repository;

import com.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Budget> findByIdAndUserId(UUID id, UUID userId);

    void deleteByUserId(UUID userId);
}
