package com.rentit.signin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rentit.signin.entities.User;
import com.rentit.signin.services.UserService;

@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return "User registered successfully with ID: " + savedUser.getUserId();
    }
}
