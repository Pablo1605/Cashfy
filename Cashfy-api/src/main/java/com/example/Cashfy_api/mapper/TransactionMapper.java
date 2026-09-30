package com.example.Cashfy_api.mapper;

import com.example.Cashfy_api.dto.CreateTransactionRequest;
import com.example.Cashfy_api.dto.TransactionResponse;
import com.example.Cashfy_api.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(source = "categoryId", target = "category")
    TransactionResponse toDTO(Transaction transaction);

    Transaction toEntity(CreateTransactionRequest transaction);
}
