package com.rentit.signin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.UserRepository;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User login(String email, String password) {
        System.out.println("in login service");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return null;
        }

        // plain-text password check (TEMPORARY)
        if (!user.getPassword().equals(password)) {
            return null;
        }

        return user;
    }
}
