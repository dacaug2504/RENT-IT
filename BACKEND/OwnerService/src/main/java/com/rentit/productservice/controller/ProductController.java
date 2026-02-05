package com.rentit.productservice.controller;

import jakarta.servlet.http.HttpServletRequest;

import com.rentit.productservice.request.ProductAddRequest;
import com.rentit.productservice.request.ProductUpdateRequest;
import com.rentit.productservice.entity.*;
import com.rentit.productservice.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Base64;


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
    
    @PostMapping(
        value = "/add",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Transactional
    public ResponseEntity<?> addProduct(
            @ModelAttribute ProductAddRequest req,
            BindingResult result,
            HttpServletRequest request
    ) throws Exception {
    	
    	
    	if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                System.out.println("error: " +
                    err.getField() + " -> " + err.getRejectedValue() + " : " + err.getDefaultMessage()
                )
            );
            return ResponseEntity.badRequest().body(result.getFieldErrors());
        }
    	System.out.println("ADD PRODUCT CONTROLLER HIT @ " + System.currentTimeMillis());

    	System.out.println("===== ADD PRODUCT DEBUG =====");
    	System.out.println("categoryId = " + req.getCategoryId());
    	System.out.println("itemId = " + req.getItemId());
    	System.out.println("brand = " + req.getBrand());
    	System.out.println("rentPerDay = " + req.getRentPerDay());
    	System.out.println("depositAmt = " + req.getDepositAmt());
    	System.out.println("img1 = " + (req.getImg1() != null));
    	System.out.println("maxRentDays = " + req.getMaxRentDays());
    	System.out.println("================================");


    	 // ✅ Extract from filter (NOT JWT)
        Integer userId = (Integer) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if (userId == null || role == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (!"OWNER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Only OWNER can add products");
        }


    	


        // 1️⃣ validate category exists
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid category"));

        // 2️⃣ validate item exists
        Item item = itemRepository.findById(req.getItemId())
                .orElseThrow(() -> new RuntimeException("Invalid item"));

        // 3️⃣ validate item belongs to category......this is safer for wrappers
        if (!Integer.valueOf(item.getCategoryId()).equals(req.getCategoryId())) {

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
        ownerItem.setMaxRentDays(req.getMaxRentDays());

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
    
    
    //Get product details
    @GetMapping("/{otId}")
    public ResponseEntity<?> getProduct(@PathVariable int otId) {

        OwnerItem ownerItem = ownerItemRepository.findById(otId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("otId", ownerItem.getOtId());
        response.put("brand", ownerItem.getBrand());
        response.put("description", ownerItem.getDescription());
        response.put("conditionType", ownerItem.getConditionType());
        response.put("rentPerDay", ownerItem.getRentPerDay());
        response.put("depositAmt", ownerItem.getDepositAmt());
        response.put("status", ownerItem.getStatus());
        response.put("itemId", ownerItem.getItemId());
        response.put("maxRentDays",ownerItem.getMaxRentDays());

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
        ownerItem.setMaxRentDays(req.getMaxRentDays());

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
    
    //Get product images
    @GetMapping("/{otId}/images")
    public ResponseEntity<?> getProductImages(@PathVariable int otId) {

        Image image = imageRepository.findByOtId(otId);

        if (image == null) {
            return ResponseEntity.ok(Map.of());
        }

        Map<String, String> response = new HashMap<>();

        if (image.getImg1() != null)
            response.put("img1", Base64.getEncoder().encodeToString(image.getImg1()));
        if (image.getImg2() != null)
            response.put("img2", Base64.getEncoder().encodeToString(image.getImg2()));
        if (image.getImg3() != null)
            response.put("img3", Base64.getEncoder().encodeToString(image.getImg3()));
        if (image.getImg4() != null)
            response.put("img4", Base64.getEncoder().encodeToString(image.getImg4()));
        if (image.getImg5() != null)
            response.put("img5", Base64.getEncoder().encodeToString(image.getImg5()));

        return ResponseEntity.ok(response);
    }

    
    //Edit product images
    @Transactional
    @PutMapping(value = "/{otId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductImage(
            @PathVariable int otId,
            @RequestParam(required = false) MultipartFile img1,
            @RequestParam(required = false) MultipartFile img2,
            @RequestParam(required = false) MultipartFile img3,
            @RequestParam(required = false) MultipartFile img4,
            @RequestParam(required = false) MultipartFile img5
    ) throws IOException {

        // 1️⃣ Check product exists
        OwnerItem ownerItem = ownerItemRepository.findById(otId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2️⃣ Fetch image row
        Image image = imageRepository.findByOtId(otId);
        if (image == null) {
            image = new Image();
            image.setOtId(otId);
        }

        // 3️⃣ Update only provided images
        if (img1 != null && !img1.isEmpty()) {
            image.setImg1(img1.getBytes());
        }
        if (img2 != null && !img2.isEmpty()) {
            image.setImg2(img2.getBytes());
        }
        if (img3 != null && !img3.isEmpty()) {
            image.setImg3(img3.getBytes());
        }
        if (img4 != null && !img4.isEmpty()) {
            image.setImg4(img4.getBytes());
        }
        if (img5 != null && !img5.isEmpty()) {
            image.setImg5(img5.getBytes());
        }

        // 4️⃣ Save
        imageRepository.save(image);

        // 5️⃣ Response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Product images updated successfully");
        response.put("otId", otId);

        return ResponseEntity.ok(response);
    }
    
    //Delete particular product image
    @DeleteMapping("/{otId}/image/{imgKey}")
    @Transactional
    public ResponseEntity<?> deleteProductImage(
            @PathVariable int otId,
            @PathVariable String imgKey
    ) {
        Image image = imageRepository.findByOtId(otId);

        if (image == null) {
            throw new RuntimeException("Image record not found for product");
        }

        switch (imgKey.toLowerCase()) {
            case "img1" -> image.setImg1(null);
            case "img2" -> image.setImg2(null);
            case "img3" -> image.setImg3(null);
            case "img4" -> image.setImg4(null);
            case "img5" -> image.setImg5(null);
            default -> throw new IllegalArgumentException("Invalid image key");
        }

        imageRepository.save(image);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Image deleted successfully");
        response.put("otId", otId);
        response.put("image", imgKey);

        return ResponseEntity.ok(response);
    }
    
    
    @GetMapping("/myProducts")
    public ResponseEntity<?> getMyProducts(HttpServletRequest request) {

        Integer userId = (Integer) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        

        if (userId == null || role == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        if (!"OWNER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Only OWNER can access listings");
        }

        // 1️⃣ Fetch owner items
        List<OwnerItem> ownerItems = ownerItemRepository.findByUserId(userId);

        // 2️⃣ Build response
        List<Map<String, Object>> response = ownerItems.stream().map(oi -> {
            Map<String, Object> map = new HashMap<>();

            map.put("otId", oi.getOtId());
            map.put("brand", oi.getBrand());
            map.put("description", oi.getDescription());
            map.put("conditionType", oi.getConditionType());
            map.put("rentPerDay", oi.getRentPerDay());
            map.put("depositAmt", oi.getDepositAmt());
            map.put("status", oi.getStatus());
            map.put("maxRentDays", oi.getMaxRentDays());

            // 🔹 fetch item info
            Item item = itemRepository.findById(oi.getItemId()).orElse(null);
            if (item != null) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("itemId", item.getItemId());
                itemMap.put("itemName", item.getItemName());

                Category category = categoryRepository.findById(item.getCategoryId()).orElse(null);
                if (category != null) {
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("categoryId", category.getCategoryId());
                    categoryMap.put("type", category.getCategoryName());
                    itemMap.put("category", categoryMap);
                }

                map.put("item", itemMap);
            }

            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }



}
