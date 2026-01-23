package com.rentit.signin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.Role;
import com.rentit.signin.repositories.RoleRepository;

@Service
public class RoleService {
	
	@Autowired
	RoleRepository repo;
	
	public List<Role> getAllRoles(){
		return repo.findAll();
	}
}
