package com.rentit.signin.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.City;
import com.rentit.signin.entities.State;
import com.rentit.signin.entities.User;
import com.rentit.signin.repositories.CityRepository;
import com.rentit.signin.repositories.RegisterRepository;
import com.rentit.signin.repositories.StateRepository;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository userRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityRepository cityRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user) {

        

        // silent accept logic (as decided earlier)
        if (user.getState() != null && user.getState().getStateId() != null) {
            State state = stateRepository
                    .findById(user.getState().getStateId())
                    .orElse(null);
            user.setState(state);
        }

        if (user.getCity() != null && user.getCity().getCityId() != null) {
            City city = cityRepository
                    .findById(user.getCity().getCityId())
                    .orElse(null);
            user.setCity(city);
        }

        return userRepository.save(user);
    }
}
