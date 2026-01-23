package com.rentit.signin.services;


import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.controllers.LoginController;
import com.rentit.signin.entities.User;
import com.rentit.signin.enums.AccountStatus;
import com.rentit.signin.repositories.UserRepository;

@Service
public class LoginService {

   
	
    @Autowired
    private UserRepository userRepository;


    public List<User> getAll() {
    	return userRepository.findAll();
    }
  

    public User login(String username, String password) {
        System.out.println("in login service");
        User dbUser = userRepository.findByEmailAndPassword(username,password);
        System.out.println(dbUser);
        /*User u = null;
        
        try {
        	u = dbUser.get();
        	System.out.println(u);
        }
        catch(NoSuchElementException e) {
        	e.printStackTrace();
        }*/
        return dbUser;
        
        //        .orElseThrow(() -> new RuntimeException("Invalid email or password"));

   

        // Role validation
        /*if (!dbUser.getRole().getRoleName().equalsIgnoreCase(roleName)) {
            throw new RuntimeException("Unauthorized role");
        }
  

        return dbUser;*/
    }
    
    /*public boolean isValidUser(String email, String password) {

        return userRepository.findByEmail(email)
                .map(dbUser -> dbUser.getPassword().equals(password))
                .orElse(false);
    }*/
		

}
