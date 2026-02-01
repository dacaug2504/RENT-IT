package com.rentit.addtocart.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailsDTO {
    private Integer ot_id;
    private String brand;
    private String description;
    private String condition_type;
    private Integer rent_per_day;
    private Integer deposit_amt;
    private String status;
//    private String categoryType;  // Changed from categoryName to categoryType
    private String ownerName;
    
    // Base64 Images
    private String img1Base64;
    private String img2Base64;
    private String img3Base64;
    private String img4Base64;
    private String img5Base64;
}
