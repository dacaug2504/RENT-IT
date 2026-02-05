package com.rentit.addtocart.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer image_id;
    
    @Column(name = "img_1", length = 16777215)
    private byte[] img1;
    
    @Column(name = "img_2", length = 16777215)
    private byte[] img2;
    
    @Column(name = "img_3", length = 16777215)
    private byte[] img3;
    
    @Column(name = "img_4", length = 16777215)
    private byte[] img4;
    
    @Column(name = "img_5", length = 16777215)
    private byte[] img5;
    
    @OneToOne
    @JoinColumn(name = "ot_id")
    private OwnerItem ownerItem;
}
