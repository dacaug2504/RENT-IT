package com.rentit.signin.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rentit.signin.entities.City;

public interface CityRepository extends JpaRepository<City, Integer> {

    // Used for: /cities/{stateId}
    List<City> findByState_StateId(Long stateId);
    
    // Alternative query method
    @Query("SELECT c FROM City c WHERE c.state.stateId = :stateId")
    List<City> findByStateId(@Param("stateId") Integer stateId);
}