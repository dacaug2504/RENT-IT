package com.rentit.productservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.productservice.entity.OwnerItem;

public interface OwnerItemRepository extends JpaRepository<OwnerItem, Integer> {
	 List<OwnerItem> findByUserId(int userId);
}
