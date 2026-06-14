package com.mariastore.inventory_service.repository;

import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryContainingIgnoreCase (String category, Pageable pageable);

}
