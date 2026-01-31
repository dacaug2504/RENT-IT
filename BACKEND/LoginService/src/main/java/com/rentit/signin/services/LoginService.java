package com.rentit.signin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.UserRepository;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User login(String email, String rawPassword) {

        System.out.println("LoginService: Looking for user with email: " + email);

        User user = userRepository.findByEmail(email);

        if (user == null) {
            System.out.println("LoginService: User not found");
            return null;
        }

        System.out.println("LoginService: User found, checking password");

        // ✅ CORRECT bcrypt password check
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            System.out.println("LoginService: Password mismatch");
            return null;
        }

        // Force-load role (safe)
        if (user.getRole() != null) {
            System.out.println("LoginService: User role loaded: " 
                + user.getRole().getRoleName());
        } else {
            System.out.println("LoginService: WARNING - User has no role!");
        }

        return user;
    }

}