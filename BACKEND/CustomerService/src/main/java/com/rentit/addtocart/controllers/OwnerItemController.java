package com.rentit.addtocart.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.addtocart.dto.ProductDetailsDTO;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.services.OwnerItemService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
public class OwnerItemController {

	@Autowired
	OwnerItemService serv;
	
	 @GetMapping("/getallproducts")
	    public ResponseEntity<List<ProductDetailsDTO>> getAllProducts(HttpServletRequest httpRequest) {
	        Integer userId = (Integer) httpRequest.getAttribute("userId");
	        String role = (String) httpRequest.getAttribute("role");
	        
	        System.out.println(userId+" : "+role);

	        // 🔐 Only customer can view products
	        if (userId == null || role == null || !role.equalsIgnoreCase("customer")) {
	            return ResponseEntity.status(403).build();
	        }


//	        List<OwnerItem> products = serv.getAllProducts();
	        List<ProductDetailsDTO> products = serv.getAllProducts();
	        return ResponseEntity.ok(products);
	    }
	 
	 @GetMapping("/{id}/details")
	    public ResponseEntity<ProductDetailsDTO> getProductDetails(@PathVariable Integer id) {
	        try {
	            ProductDetailsDTO details = serv.getProductDetails(id);
	            return ResponseEntity.ok(details);
	        } catch (Exception e) {
	            return ResponseEntity.notFound().build();
	        }
	    }
}