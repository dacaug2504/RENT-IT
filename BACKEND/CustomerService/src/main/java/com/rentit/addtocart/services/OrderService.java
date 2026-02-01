
package com.rentit.addtocart.services;

import com.rentit.addtocart.dto.ProductDetailsDTO;
import com.rentit.addtocart.entities.Bill;
import com.rentit.addtocart.entities.Cart;
import com.rentit.addtocart.entities.DeliveryMode;
import com.rentit.addtocart.entities.Image;
import com.rentit.addtocart.entities.OrderTable;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.entities.User;
import com.rentit.addtocart.repositories.BillRepository;
import com.rentit.addtocart.repositories.CartRepository;
import com.rentit.addtocart.repositories.ImageRepository;
import com.rentit.addtocart.repositories.OrderTableRepository;
import com.rentit.addtocart.repositories.OwnerItemRepository;
import com.rentit.addtocart.repositories.UserRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OrderService {
    
    @Autowired private BillRepository billRepo;
    @Autowired private OrderTableRepository orderRepo;
    @Autowired private CartRepository cartRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private OwnerItemRepository ownerItemRepo;
    
    public Map<String, Object> placeOrderFromCart(Integer cartId, LocalDate startDate, LocalDate endDate) {
        try {
            // 1. Fetch cart record
            Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartId));
            
            // 2. Extract all required data
            Integer customerId = cart.getCustomer().getUser_id();
//            Integer ownerItemId = cart.getOwneritem().getItem_id();
            Integer ownerItemId = cart.getOwneritem().getOt_id(); // added
            
//            OwnerItem ownerItem = ownerItemRepo.findById(ownerItemId)
//                .orElseThrow(() -> new RuntimeException("Item not found: " + ownerItemId));
            OwnerItem ownerItem = cart.getOwneritem(); // added
            Integer ownerId = ownerItem.getUser().getUser_id(); // added
            
            User customer = userRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
            
            // 3. Calculate total amount (7 days rent + deposit)
            long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
            Integer rentAmount = (int) (ownerItem.getRent_per_day() * days);
            Integer totalAmount = rentAmount + ownerItem.getDeposit_amt();
            
            // 4. Create BILL
            Bill bill = new Bill();
            bill.setCustomer(customer);
            bill.setOwner(owner);
            bill.setOwnerItem(ownerItem);
            bill.setAmount(totalAmount);
            Bill savedBill = billRepo.save(bill);
            
            // 5. Create ORDER
            OrderTable order = new OrderTable();
            order.setCustomer(customer);
            order.setOwner(owner);
            order.setOwnerItem(ownerItem);
            order.setStartDate(startDate);
            order.setEndDate(endDate);
            order.setPaymentStatus("PENDING");
            order.setDeliveryMode(DeliveryMode.SELF);
            OrderTable savedOrder = orderRepo.save(order);
            
            // 6. Delete from cart (optional)
            // cartRepo.delete(cart);
            
            // 7. Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order placed successfully!");
            response.put("billNo", savedBill.getBillNo());
            response.put("orderId", savedOrder.getOrderId());
            response.put("totalAmount", totalAmount);
            response.put("days", days);
            response.put("startDate", startDate.toString());
            response.put("endDate", endDate.toString());
            
            return response;
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Order failed: " + e.getMessage());
            return error;
        }
    }
}
