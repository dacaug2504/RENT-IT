package com.rentit.addtocart.services;

import com.rentit.addtocart.dto.ProductDetailsDTO;
import com.rentit.addtocart.entities.Image;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.repositories.ImageRepository;
import com.rentit.addtocart.repositories.OwnerItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class OwnerItemService {
    
    @Autowired
    OwnerItemRepository repo;
    
    @Autowired
    ImageRepository imageRepo;
    
    public List<ProductDetailsDTO> getAllProducts() {
//        return repo.findAllAvailableProducts();
    	List<OwnerItem> items = repo.findAllAvailableProducts();
        
    	List<ProductDetailsDTO> dtoList = new ArrayList<>();
        
        for (OwnerItem item : items) {
            ProductDetailsDTO dto = new ProductDetailsDTO();
            dto.setOt_id(item.getOt_id());
            dto.setBrand(item.getBrand());
            dto.setDescription(item.getDescription());
            dto.setCondition_type(item.getCondition_type());
            dto.setRent_per_day(item.getRent_per_day());
            dto.setDeposit_amt(item.getDeposit_amt());
            dto.setStatus(item.getStatus().name());
            dto.setOwnerName(item.getUser() != null ? item.getUser().getFirst_name() : "N/A");
            
            // Fetch images for this product
            Image image = imageRepo.findByOwnerItemOtId(item.getOt_id());
            if (image != null) {
                if (image.getImg1() != null) {
                    dto.setImg1Base64(encodeImage(image.getImg1()));
                }
                if (image.getImg2() != null) {
                    dto.setImg2Base64(encodeImage(image.getImg2()));
                }
                if (image.getImg3() != null) {
                    dto.setImg3Base64(encodeImage(image.getImg3()));
                }
                if (image.getImg4() != null) {
                    dto.setImg4Base64(encodeImage(image.getImg4()));
                }
                if (image.getImg5() != null) {
                    dto.setImg5Base64(encodeImage(image.getImg5()));
                }
            }
            
            dtoList.add(dto);
        }
        
        return dtoList;
    }
    
    public ProductDetailsDTO getProductDetails(Integer otId) {
        OwnerItem item = repo.findById(otId).orElseThrow();
        Image image = imageRepo.findByOwnerItemOtId(otId); // or @Query version
        
        ProductDetailsDTO dto = new ProductDetailsDTO();
        dto.setOt_id(item.getOt_id());
        dto.setBrand(item.getBrand());
        dto.setDescription(item.getDescription());
        dto.setCondition_type(item.getCondition_type());
        dto.setRent_per_day(item.getRent_per_day());
        dto.setDeposit_amt(item.getDeposit_amt());
        dto.setStatus(item.getStatus().name());
        // ✅ REMOVED: dto.setCategoryType(...)
        dto.setOwnerName(item.getUser() != null ? item.getUser().getFirst_name() : "N/A");
        
        // Images same...
        if (image != null) {
            if (image.getImg1() != null) {
                dto.setImg1Base64(encodeImage(image.getImg1()));
            }
            if (image.getImg2() != null) {
                dto.setImg2Base64(encodeImage(image.getImg2()));
            }
            if (image.getImg3() != null) {
                dto.setImg3Base64(encodeImage(image.getImg3()));
            }
            if (image.getImg4() != null) {
                dto.setImg4Base64(encodeImage(image.getImg4()));
            }
            if (image.getImg5() != null) {
                dto.setImg5Base64(encodeImage(image.getImg5()));
            }
        }
        
        return dto;
    }

    
    private String encodeImage(byte[] imageBytes) {
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}