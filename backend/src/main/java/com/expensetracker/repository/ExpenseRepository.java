package com.expensetracker.repository;

import com.expensetracker.entity.Expense;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    
    @EntityGraph(attributePaths = {"category"})
    List<Expense> findByUserIdOrderByDateDesc(UUID userId);

    List<Expense> findByUserIdAndDateBetween(UUID userId, LocalDate start, LocalDate end);

    List<Expense> findByDateBetween(LocalDate start, LocalDate end);

    Optional<Expense> findByIdAndUserId(UUID id, UUID userId);

    void deleteByUserId(UUID userId);
}
