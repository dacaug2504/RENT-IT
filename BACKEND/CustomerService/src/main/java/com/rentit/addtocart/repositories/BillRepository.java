package com.rentit.addtocart.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentit.addtocart.entities.Bill;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

}
