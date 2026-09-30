package com.example.Cashfy_api.config;

import com.example.Cashfy_api.entity.Category;
import com.example.Cashfy_api.entity.enums.Type;
import com.example.Cashfy_api.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner loadCategories(CategoryRepository repository) {

        return args -> {

            createIfNotExists(
                    repository,
                    "Groceries",
                    Type.EXPENSE,
                    "#FFBE24",
                    "\uD83C\uDF57"
            );

            createIfNotExists(
                    repository,
                    "Transportation",
                    Type.EXPENSE,
                    "#2946FF",
                    "\uD83D\uDE97"
            );

            createIfNotExists(
                    repository,
                    "Salary",
                    Type.INCOME,
                    "#22C55E",
                    "\uD83D\uDECD\uFE0F"
            );

            createIfNotExists(
                    repository,
                    "Health",
                    Type.EXPENSE,
                    "#E01919",
                    "\uD83D\uDC89"
            );
        };
    }

    private void createIfNotExists(
            CategoryRepository repository,
            String name,
            Type type,
            String color,
            String icon
    ) {

        if (repository.existsByNameAndSystemTrue(name)) {
            return;
        }

        Category category = new Category();

        category.setName(name);
        category.setType(type);
        category.setColor(color);
        category.setIcon(icon);

        category.setSystem(true);

        repository.save(category);
    }
}
