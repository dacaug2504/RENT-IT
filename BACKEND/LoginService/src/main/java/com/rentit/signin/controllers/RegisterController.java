package com.rentit.signin.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rentit.signin.dto.RegisterRequest;
import com.rentit.signin.entities.User;
import com.rentit.signin.services.UserService;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {

        try {
        	System.out.println("REGISTER REQUEST = " + request);
            User savedUser = userService.registerUser(request);
            savedUser.setPassword(null); // extra safety
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

}

