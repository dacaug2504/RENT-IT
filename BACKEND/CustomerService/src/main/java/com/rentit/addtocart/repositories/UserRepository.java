package com.rentit.addtocart.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rentit.addtocart.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	
}
