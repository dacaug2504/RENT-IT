package com.rentit.signin.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.rentit.signin.entities.City;
import com.rentit.signin.repositories.CityRepository;

@RestController
public class CityController {
    
    @Autowired
    CityRepository cityRepo;
    
    @GetMapping("/cities/{stateId}")
    public List<City> getCitiesByState(@PathVariable Integer stateId) {
        return cityRepo.findByState_StateId(Long.valueOf(stateId));
    }
}