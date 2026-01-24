package com.rentit.productservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rentit.productservice.entity.Category;
import com.rentit.productservice.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET all categories (for dropdown)
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
