package com.rentit.addtocart.controllers;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rentit.addtocart.services.OrderService;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired private OrderService orderService;
    
    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(
        @RequestParam Integer cartId,
        @RequestParam String startDate,
        @RequestParam String endDate
    ) {
        try {
            LocalDate start = LocalDate.parse(startDate);  // "2026-02-01"
            LocalDate end = LocalDate.parse(endDate);
            
            if (start.isAfter(end)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Start date must be before end date");
                return ResponseEntity.badRequest().body(error);
            }
            
            Map<String, Object> result = orderService.placeOrderFromCart(cartId, start, end);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
