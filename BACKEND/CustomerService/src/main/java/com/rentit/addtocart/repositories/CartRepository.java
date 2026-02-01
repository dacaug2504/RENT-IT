package com.rentit.addtocart.repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.rentit.addtocart.entities.Cart;

import jakarta.transaction.Transactional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
	
//	List<Cart> findByCustomer_User_Id(Integer customerId);
	 @Query("select c from Cart c where c.customer.user_id = :customerId")
	    List<Cart> findByCustomerId(@Param("customerId") Integer customerId);
	 

	    @Modifying
	    @Transactional
	    @Query("delete from Cart c where c.cart_id = :cartId and c.customer.user_id = :customerId")
	    void deleteByCartIdAndCustomerId(@Param("cartId") Integer cartId,
	                                     @Param("customerId") Integer customerId);
}
