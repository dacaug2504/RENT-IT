package com.rentit.productservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.productservice.entity.OwnerItem;

public interface OwnerItemRepository extends JpaRepository<OwnerItem, Integer> {
}
