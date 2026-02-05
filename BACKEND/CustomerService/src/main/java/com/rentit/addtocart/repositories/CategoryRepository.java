package com.rentit.addtocart.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rentit.addtocart.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
