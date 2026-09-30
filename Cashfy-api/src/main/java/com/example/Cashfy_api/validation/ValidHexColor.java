package com.example.Cashfy_api.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = HexColorValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidHexColor {
    String message() default "The color must be a valid HEX code, for example #FF5733";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
