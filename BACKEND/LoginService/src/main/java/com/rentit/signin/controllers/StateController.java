package com.rentit.signin.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.rentit.signin.entities.State;
import com.rentit.signin.repositories.StateRepository;

@RestController
public class StateController {
    
    @Autowired
    StateRepository stateRepo;
    
    @GetMapping("/states")
    public List<State> getAllStates() {
        return stateRepo.findAll();
    }
}