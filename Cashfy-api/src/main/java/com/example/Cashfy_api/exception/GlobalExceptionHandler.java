package com.example.Cashfy_api.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                         HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "There are invalid fields in the request",
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex,
                                                                      HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String property = violation.getPropertyPath().toString();
            errors.put(property, violation.getMessage());
        });
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "There are validation restrictions on the request parameters",
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                               HttpServletRequest request) {
        String message = String.format("Invalid value for '%s': %s", ex.getName(), ex.getValue());
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Invalid parameter type",
                message,
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                                                                         HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "JSON inválido",
                "The request contains an invalid or malformed JSON body",
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(ResourceNotFoundException ex,
                                                                   HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Resource not found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiErrorResponse> handleUnauthorized(UnauthorizedException ex,
                                                               HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex,
                                                                 HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Invalid credentials\n",
                "The username or password is incorrect",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatusException(ResponseStatusException ex,
                                                                          HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                ex.getStatusCode().value(),
                ex.getStatusCode().toString(),
                ex.getReason(),
                request.getRequestURI()
        );
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex,
                                                               HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Access denied",
                ex.getMessage(),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex,
                                                                   HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal error",
                "An unexpected error occurred on the server",
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
