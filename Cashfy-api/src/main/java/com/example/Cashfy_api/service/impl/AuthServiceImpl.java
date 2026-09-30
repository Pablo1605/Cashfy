package com.example.Cashfy_api.service.impl;

import com.example.Cashfy_api.auth.JwtUtil;
import com.example.Cashfy_api.dto.AuthResponseDto;
import com.example.Cashfy_api.dto.LoginRequestDto;
import com.example.Cashfy_api.dto.RegisterRequestDto;
import com.example.Cashfy_api.repository.UserRepository;
import com.example.Cashfy_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.Cashfy_api.entity.User;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtUtil.generateToken(request.getUsername());
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setUsername(request.getUsername());
        return response;
    }

    @Override
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The username is already in use");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The email is already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername());
        return new AuthResponseDto(token, saved.getUsername());
    }
}
