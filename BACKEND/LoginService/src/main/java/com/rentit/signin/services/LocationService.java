package com.rentit.signin.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.signin.entities.*;
import com.rentit.signin.repositories.*;

@Service
public class LocationService {

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityRepository cityRepository;

    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    public List<City> getCitiesByState(Long stateId) {
        return cityRepository.findByState_StateId(stateId);
    }
}
