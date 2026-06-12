package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Page<ProductResponse> getProducts (String category, Pageable pageable);
}
