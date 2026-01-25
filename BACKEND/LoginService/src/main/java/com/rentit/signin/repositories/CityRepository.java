package com.rentit.signin.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.signin.entities.City;

public interface CityRepository extends JpaRepository<City, Integer> {

    // Used for: /states/{stateId}/cities
    List<City> findByState_StateId(Long stateId);
}
