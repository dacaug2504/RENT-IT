package com.rentit.signin.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.RegisterRepository;

@Service
public class RegisterService {
	
	@Autowired
	RegisterRepository repo;
	
	
	public List<User> getAllUsers(){
		return repo.findAll();
	}
	
	public User saveUser(User user) {
		user.setDate_time(LocalDateTime.now());
		return repo.save(user);
	}
}
