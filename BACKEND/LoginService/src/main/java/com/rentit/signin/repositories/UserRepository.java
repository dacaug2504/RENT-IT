package com.rentit.signin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.signin.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);
}
