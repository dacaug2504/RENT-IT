package com.rentit.addtocart.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.addtocart.dto.AddToCartRequestDTO;
import com.rentit.addtocart.dto.CartResponseDTO;
import com.rentit.addtocart.entities.Cart;
import com.rentit.addtocart.services.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
	
	@Autowired
	CartService serv;
	
//	 @PostMapping("/addtocart")
//	    public ResponseEntity<Cart> add(@RequestParam Integer customer_id, 
//	                                   @RequestParam Integer owner_item_id) {
//	        Cart cart = serv.addToCart(customer_id, owner_item_id);
//	        return ResponseEntity.ok(cart);
//	    }
	 
//	 @PostMapping("/addtocart")
//	    public ResponseEntity<Cart> add(@RequestBody AddToCartRequestDTO dto) {
//		 Cart cart = serv.addToCart(dto.getCustomer_id(),
//                 dto.getOwnerItemId());
//		 return ResponseEntity.ok(cart);
//	    }
	
	@PostMapping("/addtocart")
	// adds a record in the cart table 
    public ResponseEntity<CartResponseDTO> add(@RequestBody AddToCartRequestDTO request,HttpServletRequest httpRequest) {
		 Integer customerId = (Integer) httpRequest.getAttribute("userId");
	        // Optional: validate role
	        String role = (String) httpRequest.getAttribute("role");
	        
		if (customerId == null || !"customer".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        CartResponseDTO cartDto =
                serv.addToCart(customerId, request.getOwnerItemId());
        return ResponseEntity.ok(cartDto);
    }
	
	@GetMapping("/getallcartproducts")
	// gets all products(records) from the cart table without checking customer_id
	public List<CartResponseDTO> getAllCartProducts() {
	    return serv.getAllCartProducts();
	}
	
	@GetMapping("/getproductsbyid")
	// this method retrieves the products by customer_id from cart table
	public List<CartResponseDTO> getProductsById(HttpServletRequest httpRequest) {
//	    customerId = 103; // hardcoded customer_id
		 Integer customerId = (Integer) httpRequest.getAttribute("userId");
	        if (customerId == null) {
	            return List.of(); // or throw 401
	        }
	    return serv.getProductsByCustomerId(customerId);
	}
	

	 @DeleteMapping("/deleteproductfromcart/{cartId}")
	    public ResponseEntity<Void> removeFromCart(
	            @PathVariable Integer cartId,
	            HttpServletRequest httpRequest) {

	        Integer customerId = (Integer) httpRequest.getAttribute("userId");
	        String role = (String) httpRequest.getAttribute("role");

	        if (customerId == null || !"customer".equalsIgnoreCase(role)) {
	            return ResponseEntity.status(403).build();
	        }

	        serv.removeFromCart(cartId, customerId);
	        return ResponseEntity.noContent().build();
	    }
//	public List<CartResponseDTO> getProductsById(int id){
//			
//	}
}
