package com.rentit.productservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentit.productservice.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Integer> {

    // fetch items belonging to a category
    List<Item> findByCategoryId(int categoryId);
}
