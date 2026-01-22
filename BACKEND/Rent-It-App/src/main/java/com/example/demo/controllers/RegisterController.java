package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.User;
import com.example.demo.services.RegisterService;

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
