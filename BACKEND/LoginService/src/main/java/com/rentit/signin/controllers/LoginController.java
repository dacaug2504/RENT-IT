package com.rentit.signin.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rentit.signin.entities.User;
import com.rentit.signin.enums.AccountStatus;
import com.rentit.signin.services.LoginService;
import com.rentit.signin.security.JwtUtil;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = "http://localhost:3000",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {
            System.out.println("Login attempt for: " + user.getEmail());

            User dbuser = loginService.login(
                    user.getEmail(),
                    user.getPassword()
            );

            // ❌ Invalid credentials
            if (dbuser == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "Invalid email or password"));
            }

            // ❌ Inactive account
            if (dbuser.getStatus() == null ||
                dbuser.getStatus() != AccountStatus.ACTIVE.getValue()) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Account inactive"));
            }

            // ✅ Generate JWT
            String token = JwtUtil.generateToken(
                    dbuser.getUserId(),
                    dbuser.getRole().getRoleName()
            );

            // ❌ NEVER send password
            dbuser.setPassword(null);

            // ✅ Final response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", dbuser);

            System.out.println("Login successful for: " + dbuser.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Internal server error"));
        }
    }


    @GetMapping("/all")
    public List<User> getAll() {
        return loginService.getAll();
    }
}