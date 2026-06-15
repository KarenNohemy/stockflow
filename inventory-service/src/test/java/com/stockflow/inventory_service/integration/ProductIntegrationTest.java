package com.stockflow.inventory_service.integration;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ProductIntegrationTest {

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldSaveAndRetrieveProduct() {

        Product product = new Product();
        product.setName("Integration Product");
        product.setSku("SKU-INT-001");
        product.setCategory("TEST");
        product.setCurrentStock(10);
        product.setMinStock(5);
        product.setUnitPrice(BigDecimal.valueOf(100));

        Product saved = productRepository.save(product);

        Product found = productRepository.findById(saved.getId()).orElseThrow();

        assertEquals("Integration Product", found.getName());
        assertEquals(10, found.getCurrentStock());
    }
}