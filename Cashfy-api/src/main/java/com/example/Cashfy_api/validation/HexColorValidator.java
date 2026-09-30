package com.example.Cashfy_api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class HexColorValidator implements ConstraintValidator<ValidHexColor, String> {

    private static final String HEX_PATTERN = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(HEX_PATTERN);
    }
}
