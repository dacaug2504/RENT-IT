// src/main/java/com/rentit/entity/OrderTable.java

package com.rentit.addtocart.entities; 

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "payment_status")
    private String paymentStatus = "PENDING";
    
//    @Column(name = "delivery_mode")
//    private String deliveryMode = "SELF";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_mode")
    private DeliveryMode deliveryMode = DeliveryMode.SELF;

    
    @ManyToOne
    @JoinColumn(name = "owner_item_id")
    private OwnerItem ownerItem;
}
