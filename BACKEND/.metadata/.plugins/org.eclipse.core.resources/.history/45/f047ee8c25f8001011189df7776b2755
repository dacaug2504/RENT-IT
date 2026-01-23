package com.rentit.register.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.rentit.register.entities.User;
import com.rentit.register.repositories.RegisterRepository;

@Service
public class RegisterService {
	
	@Autowired
	RegisterRepository repo;
	
	
	public List<User> getAllUsers(){
		return repo.findAll();
	}
	
	public User saveUser(User user) {
		return repo.save(user);
	}
}
