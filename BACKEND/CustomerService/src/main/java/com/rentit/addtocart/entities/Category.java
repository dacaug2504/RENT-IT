package com.rentit.addtocart.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@JsonIgnoreProperties({"items"})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer category_id;

    private String type;

    private String description;

//    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
//    @JsonIgnoreProperties("category")  // in OwnerItem, ignore back-reference to category
//    private List<OwnerItem> items = new ArrayList<>();
}
