package com.mariastore.inventory_service.controller;

import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.exception.ProductNotFoundException;
import com.mariastore.inventory_service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class ProductController
{
    private final ProductService productService;

    @GetMapping ("/products")
    public Page<ProductResponse> getProducts (@RequestParam(required = false) String category,
                                              Pageable pageable) {
        return productService.getProducts(category,pageable);
    }

    @GetMapping
    @RequestMapping("/product/{id}")
    public ProductResponse getProductById (@PathVariable(required = true) Long id ) throws ProductNotFoundException {
        return  productService.getProductById(id);
    }
}
