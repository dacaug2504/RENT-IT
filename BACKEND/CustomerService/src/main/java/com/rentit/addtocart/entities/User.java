package com.rentit.addtocart.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"carts", "owner_items"})  // prevent recursion from collections
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;

    private Integer role_id;

    private String first_name;

    private String last_name;

    private String password;

    private String email;

    private Long phone_no;

    private String address;

    private Integer state_id;

    private Integer city_id;

    private Integer status;   // tinyint as Boolean

    private LocalDateTime date_time;

    // One customer -> many cart rows
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("customer")  // in Cart, ignore back-reference to customer
    private List<Cart> carts = new ArrayList<>();

    // One owner -> many owned items
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("user")  // in OwnerItem, ignore back-reference to user
    private List<OwnerItem> owner_items = new ArrayList<>();
}
