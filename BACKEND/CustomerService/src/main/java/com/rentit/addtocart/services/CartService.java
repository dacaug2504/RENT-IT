package com.rentit.addtocart.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentit.addtocart.dto.CartResponseDTO;
import com.rentit.addtocart.entities.Cart;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.entities.User;
import com.rentit.addtocart.mappers.CartMapper;
import com.rentit.addtocart.repositories.CartRepository;
import com.rentit.addtocart.repositories.OwnerItemRepository;
import com.rentit.addtocart.repositories.UserRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository crepo;

    @Autowired
    private UserRepository urepo;

    @Autowired
    private OwnerItemRepository otrepo;

    public CartResponseDTO addToCart(Integer customerId, Integer ownerItemId) {
    	
    	  System.out.println("addToCart called with customerId=" 
    	  + customerId + ", ownerItemId=" + ownerItemId);
    	  
        User customer = urepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OwnerItem ownerItem = otrepo.findById(ownerItemId)
                .orElseThrow(() -> new RuntimeException("Owner item not found"));

        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setOwneritem(ownerItem);
        cart.setDate_time(LocalDateTime.now());

        Cart saved = crepo.save(cart);

        return CartMapper.toDto(saved);
    }
    
    
    
    public List<CartResponseDTO> getAllCartProducts() {
        List<Cart> carts = crepo.findAll();
        return carts.stream()
                .map(CartMapper::toDto)
                .collect(Collectors.toList());
    }
    
    
    
    public List<CartResponseDTO> getProductsByCustomerId(Integer customerId) {
        List<Cart> carts = crepo.findByCustomerId(customerId);
        return carts.stream()
                .map(CartMapper::toDto)
                .toList();
    }
    
    
    
    
    public void removeFromCart(Integer cartId, Integer customerId) {
        Cart cart = crepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // safety: ensure this row belongs to that customer
        if (!cart.getCustomer().getUser_id().equals(customerId)) {
            throw new RuntimeException("Cart item does not belong to this customer");
        }
        crepo.delete(cart); // or crepo.deleteById(cartId);
    }
    
    
    
    
//    public List<CartResponseDTO> getProductsById(int id){
//    	return crepo.findAllById(id);
//    }
}
