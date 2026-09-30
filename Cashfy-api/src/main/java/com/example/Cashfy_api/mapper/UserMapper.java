package com.example.Cashfy_api.mapper;

import com.example.Cashfy_api.dto.AuthResponseDto;
import com.example.Cashfy_api.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    AuthResponseDto toDTO(User user);

    User toEntity(AuthResponseDto userDto);
}
