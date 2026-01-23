package com.rentit.register.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.register.entities.User;
import com.rentit.register.services.RegisterService;

@RestController
public class RegisterController {
	
	@Autowired
	RegisterService serv;
	
	
	@GetMapping("/hello")
	public String hello() {
		return "Hello";
	}
	
	@GetMapping("/getallusers")
	public List<User> getAllUsers(){
		return serv.getAllUsers();
	}
	
	@PostMapping("/saveuser")
	public User saveUser(@RequestBody User user) {
		return serv.saveUser(user);
	}
	
}
