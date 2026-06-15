package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.response.InventorySummaryResponse;
import com.stockflow.inventory_service.dto.response.ProductResponse;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController
{
    private final ProductService productService;

    @Operation(summary = "List products", description = "Returns paginated products with optional category filter")
    @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    @GetMapping ()
    public Page<ProductResponse> getProducts (@RequestParam(required = false) String category,
                                              Pageable pageable) {
        return productService.getProducts(category,pageable);
    }

    @Operation(summary = "Get product by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ProductResponse getProductById (@PathVariable(required = true) Long id ) throws ProductNotFoundException {
        return  productService.getProductById(id);
    }

    @Operation(summary = "Get total inventory value products")
    @GetMapping("/summary")
    public InventorySummaryResponse getSummary() {
        return productService.getInventorySummary();
    }
}
