package com.rentit.signin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rentit.signin.entities.User;

@Repository
public interface RegisterRepository extends JpaRepository<User, Integer> {

	User findByEmailAndPassword(String email, String password);
	
	
}
