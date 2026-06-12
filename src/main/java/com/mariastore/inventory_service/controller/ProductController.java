package com.mariastore.inventory_service.controller;

import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController
{
    private final ProductService productService;

    @GetMapping
    public Page<ProductResponse> getProducts (@RequestParam(required = false) String category,
                                              Pageable pageable) {
        return productService.getProducts(category,pageable);
    }
}
