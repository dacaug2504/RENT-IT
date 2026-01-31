package com.rentit.addtocart.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentit.addtocart.entities.OrderTable;

@Repository
public interface OrderTableRepository extends JpaRepository<OrderTable, Integer> {

}
