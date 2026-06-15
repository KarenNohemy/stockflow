package com.stockflow.inventory_service.integration;

import com.stockflow.inventory_service.dto.request.MovementRequest;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.MovementRepository;
import com.stockflow.inventory_service.repository.ProductRepository;
import com.stockflow.inventory_service.service.MovementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class MovementIntegrationTest {

    @Autowired
    private MovementService movementService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MovementRepository movementRepository;

    @Test
    void shouldIncreaseStockWhenINMovement() {

        Product product = new Product();
        product.setName("Soap");
        product.setSku("SKU-1");
        product.setCategory("TEST");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(50));

        Product savedProduct = productRepository.save(product);

        MovementRequest request = new MovementRequest(
                savedProduct.getId(),
                MovementType.IN,
                "Stock refill",
                5
        );

        movementService.registerMovement(request);

        Product updated = productRepository.findById(savedProduct.getId()).orElseThrow();

        assertEquals(15, updated.getCurrentStock());
        assertEquals(1, movementRepository.findAll().size());
    }

    @Test
    void shouldDecreaseStockWhenOUTMovement() {

        Product product = new Product();
        product.setName("Soap");
        product.setSku("SKU-2");
        product.setCategory("TEST");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(50));

        Product savedProduct = productRepository.save(product);

        MovementRequest request = new MovementRequest(
                savedProduct.getId(),
                MovementType.OUT,
                "Sale",
                3
        );

        movementService.registerMovement(request);

        Product updated = productRepository.findById(savedProduct.getId()).orElseThrow();

        assertEquals(7, updated.getCurrentStock());
    }

    @Test
    void shouldThrowExceptionWhenStockInsufficient() {

        Product product = new Product();
        product.setName("Soap");
        product.setSku("SKU-3");
        product.setCategory("TEST");
        product.setCurrentStock(2);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(50));

        Product savedProduct = productRepository.save(product);

        MovementRequest request = new MovementRequest(
                savedProduct.getId(),
                MovementType.OUT,
                "Too much sale",
                10
        );

        assertThrows(RuntimeException.class,
                () -> movementService.registerMovement(request));
    }
}