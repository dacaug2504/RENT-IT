package com.rentit.productservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.rentit.productservice.entity.Item;
import com.rentit.productservice.repository.ItemRepository;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    // GET items by category (category → items dropdown)
    @GetMapping("/category/{categoryId}")
    public List<Item> getItemsByCategory(@PathVariable int categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }
}
