package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.response.InventorySummaryResponse;
import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.dto.response.StockAlertResponse;
import com.mariastore.inventory_service.entity.Product;
import com.mariastore.inventory_service.exception.ProductNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getProducts (String category, Pageable pageable);

    ProductResponse getProductById (Long id) throws ProductNotFoundException;

    InventorySummaryResponse getInventorySummary();
}
