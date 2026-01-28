package com.rentit.signin.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.City;
import com.rentit.signin.entities.Role;
import com.rentit.signin.entities.State;
import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.CityRepository;
import com.rentit.signin.repositories.RegisterRepository;
import com.rentit.signin.repositories.RoleRepository;
import com.rentit.signin.repositories.StateRepository;
import com.rentit.signin.repositories.UserRepository;

import com.rentit.signin.dto.RegisterRequest;
import com.rentit.signin.enums.AccountStatus;
import org.springframework.security.crypto.password.PasswordEncoder;


@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private CityRepository cityRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;


	public User registerUser(RegisterRequest req) {

	    // 🔴 Email uniqueness check
	    if (userRepository.existsByEmail(req.getEmail())) {
	        throw new RuntimeException("Email already registered");
	    }

	    User user = new User();

	    user.setFirstName(req.getFirstName());
	    user.setLastName(req.getLastName());
	    user.setEmail(req.getEmail());
	    user.setPhoneNo(req.getPhoneNo());
	    user.setAddress(req.getAddress());

	    // 🔐 Encrypt password
	    user.setPassword(passwordEncoder.encode(req.getPassword()));

	    // ✅ Account ACTIVE by default
	    user.setStatus(AccountStatus.ACTIVE.getValue());

	    // 🔗 Map state
	    user.setState(
	        stateRepository.findById(req.getState())
	            .orElseThrow(() -> new RuntimeException("Invalid state ID"))
	    );

	    // 🔗 Map city
	    user.setCity(
	        cityRepository.findById(req.getCity())
	            .orElseThrow(() -> new RuntimeException("Invalid city ID"))
	    );

	    // 🔗 Map role
	    user.setRole(
	    	    roleRepository.findById(req.getRoleId())
	    	        .orElseThrow(() -> new RuntimeException("Invalid role selected"))
	    	);


	    return userRepository.save(user);
	}

}
