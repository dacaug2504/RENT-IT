package com.rentit.signin.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.signin.entities.State;

public interface StateRepository extends JpaRepository<State, Integer> {
}