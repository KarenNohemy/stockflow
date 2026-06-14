package com.stockflow.inventory_service.monitoring;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.actuate.health.Health;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockHealthIndicatorTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private StockHealthIndicator stockHealthIndicator;

    @Test
    void shouldReturnUpWhenNoProductsExist() {

        when(productRepository.findAll())
                .thenReturn(List.of());

        Health health = stockHealthIndicator.health();

        assertEquals("UP", health.getStatus().getCode());
        assertEquals("No products found",
                health.getDetails().get("message"));
    }

    @Test
    void shouldReturnDownWhenMoreThanTwentyPercentAreCritical() {

        Product p1 = new Product();
        p1.setCurrentStock(1);
        p1.setMinStock(5);

        Product p2 = new Product();
        p2.setCurrentStock(10);
        p2.setMinStock(5);

        Product p3 = new Product();
        p3.setCurrentStock(1);
        p3.setMinStock(5);

        when(productRepository.findAll())
                .thenReturn(List.of(p1, p2, p3));

        Health health = stockHealthIndicator.health();

        assertEquals("DOWN", health.getStatus().getCode());
    }

    @Test
    void shouldReturnUpWhenInventoryIsHealthy() {

        Product p1 = new Product();
        p1.setCurrentStock(10);
        p1.setMinStock(5);

        Product p2 = new Product();
        p2.setCurrentStock(20);
        p2.setMinStock(5);

        Product p3 = new Product();
        p3.setCurrentStock(15);
        p3.setMinStock(5);

        when(productRepository.findAll())
                .thenReturn(List.of(p1, p2, p3));

        Health health = stockHealthIndicator.health();

        assertEquals("UP", health.getStatus().getCode());
    }
}