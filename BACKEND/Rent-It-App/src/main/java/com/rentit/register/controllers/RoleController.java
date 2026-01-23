package com.rentit.register.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.register.entities.Role;
import com.rentit.register.repositories.RoleRepository;
import com.rentit.register.services.RoleService;

@RestController
public class RoleController {
	
	@Autowired
	RoleService serv;
	
	@GetMapping("/getallroles")
	public List<Role> getAllRoles(){
		return serv.getAllRoles();
	}
}
