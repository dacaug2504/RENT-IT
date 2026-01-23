package com.rentit.register.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.register.entities.Role;
import com.rentit.register.repositories.RoleRepository;

@Service
public class RoleService {
	
	@Autowired
	RoleRepository repo;
	
	public List<Role> getAllRoles(){
		return repo.findAll();
	}
}
