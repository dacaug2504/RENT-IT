package com.rentit.addtocart.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "owner_items")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"carts"})   // avoid deep nesting owner_item -> carts -> item -> carts ...
public class OwnerItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ot_id;

    // owner user (FK: user_id)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"carts", "owner_items"})  // in User, ignore collections when serializing from here
    private User user;

    private Integer item_id;   // keep as is (or later map to a separate Item entity)

    private String brand;

    private String description;

    private String condition_type;

    private Integer rent_per_day;

    private Integer deposit_amt;

    @Enumerated(EnumType.STRING)
    private ItemStatus status;

    // category (FK: category_id)
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "category_id")
//    @JsonIgnoreProperties({"items"})  // in Category, ignore item list when seen from here
//    private Category category;

    private Integer max_rent_days;

    // One item -> many cart rows
    @OneToMany(mappedBy = "owneritem", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("owneritem")     // in Cart, ignore back-reference to item
    private List<Cart> carts = new ArrayList<>();
}
