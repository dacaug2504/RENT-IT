package com.rentit.signin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rentit.signin.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	
	/*@Query("""
		    select u from User u
		    join fetch u.role
		    where u.email = :email
		""")*/
	    //@Query("select u from User u where u.email = ?1and u.password = ?2")
		User findByEmailAndPassword(String email, String password);
}
