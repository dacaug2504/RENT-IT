package com.rentit.signin.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentit.signin.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {
	Optional<Role> findByRoleName(String roleName);

}
