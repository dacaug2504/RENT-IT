package com.rentit.signin.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    	System.out.println(user.getEmail()+" : "+user.getPassword());
         User dbuser = null;
        try {
            dbuser = loginService.login(
                    user.getEmail(),
                    user.getPassword()
            );
            System.out.println(dbuser);

            if (dbuser != null) {
            	if(dbuser.getStatus() == AccountStatus.ACTIVE)
                    return ResponseEntity.ok(dbuser);
            	else 
            		return ResponseEntity.ok(null);
            } else {
                return ResponseEntity.status(401).body(dbuser);
            }

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(null);
        }
        
    }  
    
    @GetMapping("/all")
    public List<User> getAll() {
    	return loginService.getAll();
    }

}



