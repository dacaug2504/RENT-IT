package com.rentit.signin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rentit.signin.entities.User;
import com.rentit.signin.enums.AccountStatus;
import com.rentit.signin.services.LoginService;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {

        try {
            User dbuser = loginService.login(
                    user.getEmail(),
                    user.getPassword()
            );

            // 1️⃣ Invalid credentials
            if (dbuser == null) {
                return ResponseEntity.status(401).body(null);
            }

            // 2️⃣ Status check
            if (dbuser.getStatus() == null ||
                dbuser.getStatus() != AccountStatus.ACTIVE.getValue()) {
                return ResponseEntity.status(403).body(null);
            }

            // 3️⃣ Hide password in response
            dbuser.setPassword(null);

            return ResponseEntity.ok(dbuser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/all")
    public List<User> getAll() {
        return loginService.getAll();
    }
}
