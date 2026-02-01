package com.rentit.addtocart.services;

import com.rentit.addtocart.dto.ProductDetailsDTO;
import com.rentit.addtocart.entities.Image;
import com.rentit.addtocart.entities.OwnerItem;
import com.rentit.addtocart.repositories.ImageRepository;
import com.rentit.addtocart.repositories.OwnerItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
public class OwnerItemService {
    
    @Autowired
    OwnerItemRepository repo;
    
    @Autowired
    ImageRepository imageRepo;
    
    public List<OwnerItem> getAllProducts() {
        return repo.findAllAvailableProducts();
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
            if (image.getImg1() != null) dto.setImg1Base64(encodeImage(image.getImg1()));
            // ... rest same
        }
        
        return dto;
    }

    
    private String encodeImage(byte[] imageBytes) {
        return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}
