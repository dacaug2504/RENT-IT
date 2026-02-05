package com.rentit.addtocart.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartRequestDTO {

    private Integer customer_id;   // user.user_id of the customer
    private Integer ownerItemId;   // owner_items.ot_id
}
