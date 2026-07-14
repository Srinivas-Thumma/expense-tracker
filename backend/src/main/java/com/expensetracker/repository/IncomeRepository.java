package com.expensetracker.repository;

import com.expensetracker.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IncomeRepository extends JpaRepository<Income, UUID> {
    List<Income> findByUserIdOrderByDateDesc(UUID userId);

    List<Income> findByUserIdAndDateBetween(UUID userId, LocalDate start, LocalDate end);

    List<Income> findByDateBetween(LocalDate start, LocalDate end);

    Optional<Income> findByIdAndUserId(UUID id, UUID userId);

    void deleteByUserId(UUID userId);
    
}
