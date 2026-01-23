package com.rentit.productservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rentit.productservice.entity.Image;

public interface ImageRepository extends JpaRepository<Image, Integer> {
}
