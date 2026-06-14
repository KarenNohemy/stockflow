package com.stockflow.inventory_service.integration;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import com.stockflow.inventory_service.service.AlertService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AlertIntegrationTest {

    @Autowired
    private AlertService alertService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldReturnCriticalAlerts() {

        Product product = new Product();
        product.setName("Low stock product");
        product.setSku("SKU-LOW");
        product.setCategory("TEST");
        product.setCurrentStock(1);
        product.setMinStock(10);
        product.setUnitPrice(BigDecimal.valueOf(100));

        productRepository.save(product);

        var alerts = alertService.getAlerts();

        assertFalse(alerts.isEmpty());
        assertEquals("Low stock product", alerts.get(0).productName());
    }
}