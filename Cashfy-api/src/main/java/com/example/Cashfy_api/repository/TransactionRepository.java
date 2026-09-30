package com.example.Cashfy_api.repository;

import com.example.Cashfy_api.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserIdAndType(String userId, String type);
    List<Transaction> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
    List<Transaction> findByUserIdOrderByDateDesc(String userId);
    Long deleteByIdAndUserId(String id, String userId);
}
