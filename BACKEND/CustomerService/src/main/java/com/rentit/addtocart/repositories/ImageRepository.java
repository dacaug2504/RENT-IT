package com.rentit.addtocart.repositories;

import com.rentit.addtocart.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {
    
	 @Query("SELECT i FROM Image i WHERE i.ownerItem.ot_id = :otId")
	    Image findByOwnerItemOtId(@Param("otId") Integer otId);
}
