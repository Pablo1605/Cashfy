package com.example.Cashfy_api.controller;

import com.example.Cashfy_api.dto.AuthResponseDto;
import com.example.Cashfy_api.dto.LoginRequestDto;
import com.example.Cashfy_api.dto.RegisterRequestDto;
import com.example.Cashfy_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody @Valid RegisterRequestDto request) {
        AuthResponseDto dto = authService.register(request);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid LoginRequestDto request) {
        AuthResponseDto jwtResponse = authService.login(request);
        return ResponseEntity.ok(jwtResponse);
    }
}
