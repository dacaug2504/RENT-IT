package com.rentit.signin.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.City;
import com.rentit.signin.entities.Role;
import com.rentit.signin.entities.State;
import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.CityRepository;
import com.rentit.signin.repositories.RegisterRepository;
import com.rentit.signin.repositories.RoleRepository;
import com.rentit.signin.repositories.StateRepository;

@Service
public class UserService {

    @Autowired
    private RegisterRepository userRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private RoleRepository roleRepository;

    public User registerUser(User user) {

        // timestamp
        user.setDate_time(LocalDateTime.now());

        // -------- ROLE (FIX FOR YOUR ERROR) --------
        if (user.getRole() != null && user.getRole().getRoleId() != null) {
            Role role = roleRepository
                    .findById(user.getRole().getRoleId())
                    .orElse(null);
            user.setRole(role);
        }

        // -------- STATE --------
        if (user.getState() != null && user.getState().getStateId() != null) {
            State state = stateRepository
                    .findById(user.getState().getStateId())
                    .orElse(null);
            user.setState(state);
        }

        // -------- CITY --------
        if (user.getCity() != null && user.getCity().getCityId() != null) {
            City city = cityRepository
                    .findById(user.getCity().getCityId())
                    .orElse(null);
            user.setCity(city);
        }

        return userRepository.save(user);
    }
}
