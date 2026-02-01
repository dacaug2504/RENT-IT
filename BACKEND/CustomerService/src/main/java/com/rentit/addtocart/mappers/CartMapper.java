package com.rentit.addtocart.mappers;

import com.rentit.addtocart.dto.CartResponseDTO;
import com.rentit.addtocart.entities.Cart;
import com.rentit.addtocart.entities.Category;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.entities.User;

public class CartMapper {

    public static CartResponseDTO toDto(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();

        dto.setCart_id(cart.getCart_id());
        dto.setDate_time(cart.getDate_time());

        // customer/user
        User customer = cart.getCustomer();
        if (customer != null) {
            dto.setCustomer_id(customer.getUser_id());
            dto.setCustomer_first_name(customer.getFirst_name());
            dto.setCustomer_last_name(customer.getLast_name());
            dto.setCustomer_email(customer.getEmail());
            dto.setCustomer_role_id(customer.getRole_id());
        }

        // owner item
        OwnerItem ownerItem = cart.getOwneritem();
        if (ownerItem != null) {
            dto.setOwner_item_id(ownerItem.getOt_id());
            dto.setItem_id(ownerItem.getItem_id());
            dto.setBrand(ownerItem.getBrand());
            dto.setDescription(ownerItem.getDescription());
            dto.setCondition_type(ownerItem.getCondition_type());
            dto.setRent_per_day(ownerItem.getRent_per_day());
            dto.setDeposit_amt(ownerItem.getDeposit_amt());
            if (ownerItem.getStatus() != null) {
                dto.setStatus(ownerItem.getStatus().name());
            }

            // category
//            Category category = ownerItem.getCategory();
//            if (category != null) {
//                dto.setCategory_id(category.getCategory_id());
//                dto.setCategory_type(category.getType());
//                dto.setCategory_description(category.getDescription());
//            }
        }

        return dto;
    }
}
