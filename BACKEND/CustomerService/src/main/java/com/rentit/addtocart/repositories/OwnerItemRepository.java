package com.rentit.addtocart.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.rentit.addtocart.entities.ItemStatus;
import com.rentit.addtocart.entities.OwnerItem;
import java.util.List;


@Repository
public interface OwnerItemRepository extends JpaRepository<OwnerItem, Integer> {
	
//	public List<OwnerItem> findByStatus(ItemStatus status);
	 @Query("SELECT o FROM OwnerItem o WHERE o.status = 'AVAILABLE'")
	    List<OwnerItem> findAllAvailableProducts();
}
