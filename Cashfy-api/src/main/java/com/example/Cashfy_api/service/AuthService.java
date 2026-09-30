package com.example.Cashfy_api.service;

import com.example.Cashfy_api.dto.AuthResponseDto;
import com.example.Cashfy_api.dto.LoginRequestDto;
import com.example.Cashfy_api.dto.RegisterRequestDto;

public interface AuthService {
    AuthResponseDto login(LoginRequestDto request);
    AuthResponseDto register(RegisterRequestDto requestDto);
}
