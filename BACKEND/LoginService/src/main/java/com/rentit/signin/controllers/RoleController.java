package com.rentit.signin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.signin.entities.Role;
import com.rentit.signin.repositories.RoleRepository;
import com.rentit.signin.services.RoleService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class RoleController {
	
	@Autowired
	RoleService serv;
	
	@GetMapping("/getallroles")
	public List<Role> getAllRoles(){
		return serv.getAllRoles();
	}
}