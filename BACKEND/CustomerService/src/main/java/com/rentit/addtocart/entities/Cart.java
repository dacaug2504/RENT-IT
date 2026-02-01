package com.rentit.addtocart.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"customer", "owneritem"})  // optional: keep cart JSON shallow
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_id;

    // FK: customer_id -> user.user_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"carts", "owner_items"}) // when serializing customer from Cart, ignore its collections
    private User customer;

    // FK: item_id -> owner_items.ot_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnoreProperties({"carts"})  // when serializing item from Cart, ignore its carts list
    private OwnerItem owneritem;

    private LocalDateTime date_time;
}
