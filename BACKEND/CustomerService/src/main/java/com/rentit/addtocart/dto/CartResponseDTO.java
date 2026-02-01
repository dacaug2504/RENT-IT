package com.rentit.addtocart.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CartResponseDTO {

    private Integer cart_id;
    private LocalDateTime date_time;

    // Customer (user) details
    private Integer customer_id;
    private String customer_first_name;
    private String customer_last_name;
    private String customer_email;
    private Integer customer_role_id;

    // Owner item details
    private Integer owner_item_id;       // ot_id
    private Integer item_id;            // from owner_items.item_id
    private String brand;
    private String description;
    private String condition_type;
    private Integer rent_per_day;
    private Integer deposit_amt;
    private String status;

    // Category details
    private Integer category_id;
    private String category_type;
    private String category_description;
}
