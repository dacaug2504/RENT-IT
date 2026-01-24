package com.rentit.productservice.controller;

import com.rentit.productservice.request.ProductAddRequest;
import com.rentit.productservice.request.ProductUpdateRequest;
import com.rentit.productservice.entity.*;
import com.rentit.productservice.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private OwnerItemRepository ownerItemRepository;

    @Autowired
    private ImageRepository imageRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    //Add new product
    @Transactional
    @PostMapping(
        value = "/add",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addProduct(
            @ModelAttribute ProductAddRequest req) throws Exception {

        // TEMP user (JWT later)
        int userId = 104;

        // 1️⃣ validate category exists
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid category"));

        // 2️⃣ validate item exists
        Item item = itemRepository.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Invalid item"));

        // 3️⃣ validate item belongs to category
        if (item.getCategoryId() != req.getCategoryId()) {
            throw new RuntimeException("Item does not belong to selected category");
        }

        // 4️⃣ create owner_item (ONLY user-specific data)
        OwnerItem ownerItem = new OwnerItem();
        ownerItem.setUserId(userId);
        
        ownerItem.setItemId(item.getItemId());
        ownerItem.setBrand(req.getBrand());
        ownerItem.setDescription(req.getDescription());
        ownerItem.setConditionType(req.getConditionType());
        ownerItem.setRentPerDay(req.getRentPerDay());
        ownerItem.setDepositAmt(req.getDepositAmt());
        ownerItem.setStatus("AVAILABLE");

        ownerItem = ownerItemRepository.save(ownerItem);

        // 5️⃣ save images (optional)
        Image image = new Image();
        image.setOtId(ownerItem.getOtId());

        if (req.getImg1() != null && !req.getImg1().isEmpty())
            image.setImg1(req.getImg1().getBytes());
        if (req.getImg2() != null && !req.getImg2().isEmpty())
            image.setImg2(req.getImg2().getBytes());
        if (req.getImg3() != null && !req.getImg3().isEmpty())
            image.setImg3(req.getImg3().getBytes());
        if (req.getImg4() != null && !req.getImg4().isEmpty())
            image.setImg4(req.getImg4().getBytes());
        if (req.getImg5() != null && !req.getImg5().isEmpty())
            image.setImg5(req.getImg5().getBytes());

        imageRepository.save(image);

        // 6️⃣ build JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product added successfully");
        response.put("otId", ownerItem.getOtId());
        response.put("itemId", item.getItemId());
        response.put("categoryId", category.getCategoryId());

        return ResponseEntity.ok(response);
    }
    
    
    //Delete product
    @Transactional
    @DeleteMapping("/{otId}")
    public ResponseEntity<?> deleteProduct(@PathVariable int otId) {

        // 1️> check if product exists
        OwnerItem ownerItem = ownerItemRepository.findById(otId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2️> delete image first (child)
        imageRepository.deleteByOtId(otId);

        // 3️> delete owner_item (parent)
        ownerItemRepository.deleteById(otId);

        // 4️> return response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        response.put("otId", otId);

        return ResponseEntity.ok(response);
    }
    
    
    //Edit product
    @PutMapping("/{otId}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int otId,
            @RequestBody ProductUpdateRequest req) {

        // 1️⃣ Check product exists
        OwnerItem ownerItem = ownerItemRepository.findById(otId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2️⃣ Update allowed fields only
        ownerItem.setBrand(req.getBrand().trim());
        ownerItem.setDescription(req.getDescription().trim());
        ownerItem.setConditionType(req.getConditionType().trim());
        ownerItem.setRentPerDay(req.getRentPerDay());
        ownerItem.setDepositAmt(req.getDepositAmt());

        // 3️⃣ Validate & update status
        String status = req.getStatus().trim().toUpperCase();

        if (!status.equals("AVAILABLE") && !status.equals("UNAVAILABLE")) {
            throw new RuntimeException("Invalid status value");
        }

        ownerItem.setStatus(status);


        // 4️⃣ Save updates
        ownerItemRepository.save(ownerItem);

        // 5️⃣ Response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product updated successfully");
        response.put("otId", otId);
        response.put("status", ownerItem.getStatus());

        return ResponseEntity.ok(response);
    }





//    @PostMapping(
//    	    value = "/add",
//    	    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
//    	)
//    public String addProduct(@ModelAttribute ProductAddRequest req) throws IOException {
//
//    	    // ✅ existing user in DB
//    	    int userId = 104;
//
//    	 // 1️⃣ items
//    	    Item item = new Item();
//    	    item.setItemName(req.getItemName());
//    	    item.setCategoryId(req.getCategoryId());
//    	    item = itemRepository.save(item);
//
//    	    // 2️⃣ owner_items
//    	    OwnerItem ownerItem = new OwnerItem();
//    	    ownerItem.setUserId(userId);
//    	    ownerItem.setItemId(item.getItemId());
//    	    ownerItem.setBrand(req.getBrand());
//    	    ownerItem.setDescription(req.getDescription());
//    	    ownerItem.setConditionType(req.getConditionType());
//    	    ownerItem.setRentPerDay(req.getRentPerDay());
//    	    ownerItem.setDepositAmt(req.getDepositAmt());
//    	    ownerItem.setStatus("AVAILABLE");
//    	    ownerItem = ownerItemRepository.save(ownerItem);
//
//    	    // 3️⃣ image
//    	    Image image = new Image();
//    	    image.setOtId(ownerItem.getOtId());
//
//    	    if (req.getImg1() != null && !req.getImg1().isEmpty())
//    	        image.setImg1(req.getImg1().getBytes());
//
//    	    if (req.getImg2() != null && !req.getImg2().isEmpty())
//    	        image.setImg2(req.getImg2().getBytes());
//
//    	    if (req.getImg3() != null && !req.getImg3().isEmpty())
//    	        image.setImg3(req.getImg3().getBytes());
//
//    	    if (req.getImg4() != null && !req.getImg4().isEmpty())
//    	        image.setImg4(req.getImg4().getBytes());
//
//    	    if (req.getImg5() != null && !req.getImg5().isEmpty())
//    	        image.setImg5(req.getImg5().getBytes());
//
//    	    imageRepository.save(image);
//    	    System.out.println(req.getImg1());
//
//
//    	    return "Product + Image uploaded successfully";
//    	}

}
//package com.rentit.productservice.controller;
//
//import com.rentit.productservice.request.ProductAddRequest;
//import com.rentit.productservice.entity.*;
//import com.rentit.productservice.repository.*;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Base64;
//
//@RestController
//@RequestMapping("/api/products")
//public class ProductController {
//
//    @Autowired
//    private ItemRepository itemRepository;
//
//    @Autowired
//    private OwnerItemRepository ownerItemRepository;
//
//    @Autowired
//    private ImageRepository imageRepository;
//
//    @PostMapping("/add")
//    public String addProduct(@RequestBody ProductAddRequest request) {
//
//        // ⚠️ TEMPORARY (later from login/JWT)
//        int userId = 104;
//
//        // 1️⃣ items table
//        Item item = new Item();
//        item.setItemName(request.getItemName());
//        item.setCategoryId(request.getCategoryId());
//        item = itemRepository.save(item);
//
//        // 2️⃣ owner_items table
//        OwnerItem ownerItem = new OwnerItem();
//        ownerItem.setUserId(userId);
//        ownerItem.setItemId(item.getItemId());
//        ownerItem.setBrand(request.getBrand());
//        ownerItem.setDescription(request.getDescription());
//        ownerItem.setConditionType(request.getConditionType());
//        ownerItem.setRentPerDay(request.getRentPerDay());
//        ownerItem.setDepositAmt(request.getDepositAmt());
//        ownerItem.setStatus("AVAILABLE");
//
//        ownerItem = ownerItemRepository.save(ownerItem);
//
//        // 3️⃣ image table
//        Image image = new Image();
//        image.setOtId(ownerItem.getOtId());
//
//        image.setImg1(toBytes(request.getImg1()));
//        image.setImg2(toBytes(request.getImg2()));
//        image.setImg3(toBytes(request.getImg3()));
//        image.setImg4(toBytes(request.getImg4()));
//        image.setImg5(toBytes(request.getImg5()));
//
//        imageRepository.save(image);
//
//        return "✅ Product added successfully. Item ID = " + item.getItemId();
//    }
//
//    private byte[] toBytes(String base64) {
//        if (base64 == null) return null;
//        return Base64.getDecoder().decode(base64);
//    }
//}
