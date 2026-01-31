package com.rentit.productservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.productservice.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // no methods needed now
}
