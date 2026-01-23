package com.rentit.productservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.productservice.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Integer> {
}
