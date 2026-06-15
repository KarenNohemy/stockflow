package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.response.StockAlertResponse;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.entity.Severity;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private AlertService alertService;

    @Test
    void shouldReturnEmptyListWhenNoAlerts() {

        Product product = createProduct(
                1L,
                "Product OK",
                20,
                10
        );

        when(productRepository.findAll())
                .thenReturn(List.of(product));

        List<StockAlertResponse> result = alertService.getAlerts();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(productRepository).findAll();
    }

    @Test
    void shouldReturnLowAlert() {

        Product product = createProduct(
                1L,
                "Product LOW",
                10,
                10
        );

        when(productRepository.findAll())
                .thenReturn(List.of(product));

        List<StockAlertResponse> result = alertService.getAlerts();

        assertEquals(1, result.size());

        StockAlertResponse alert = result.get(0);

        assertEquals(Severity.LOW, alert.severity());
        assertEquals("Product LOW", alert.productName());
        assertEquals(10, alert.currentStock());
        assertEquals(10, alert.minStock());

        verify(productRepository).findAll();
    }

    @Test
    void shouldReturnCriticalAlert() {

        Product product = createProduct(
                2L,
                "Product Critical",
                5,
                10
        );

        when(productRepository.findAll())
                .thenReturn(List.of(product));

        List<StockAlertResponse> result = alertService.getAlerts();

        assertEquals(1, result.size());

        StockAlertResponse alert = result.get(0);

        assertEquals(Severity.CRITICAL, alert.severity());
        assertEquals("Product Critical", alert.productName());

        verify(productRepository).findAll();
    }

    @Test
    void shouldReturnMixedAlerts() {

        Product low = createProduct(
                1L,
                "Low Product",
                10,
                10
        );

        Product critical = createProduct(
                2L,
                "Critical Product",
                3,
                10
        );

        Product normal = createProduct(
                3L,
                "Normal Product",
                20,
                10
        );

        when(productRepository.findAll())
                .thenReturn(List.of(low, critical, normal));

        List<StockAlertResponse> result = alertService.getAlerts();

        assertEquals(2, result.size());

        assertTrue(
                result.stream()
                        .anyMatch(a -> a.severity() == Severity.LOW)
        );

        assertTrue(
                result.stream()
                        .anyMatch(a -> a.severity() == Severity.CRITICAL)
        );

        verify(productRepository).findAll();
    }

    @Test
    void shouldReturnFallbackResponse() {

        List<StockAlertResponse> result =
                alertService.alertsFallback(new RuntimeException("Error"));

        assertNotNull(result);
        assertEquals(1, result.size());

        StockAlertResponse alert = result.get(0);

        assertNull(alert.productId());
        assertEquals(
                "Servicio inhabilitado temporalmente",
                alert.productName()
        );
        assertEquals(Severity.CRITICAL, alert.severity());
    }

    private Product createProduct(
            Long id,
            String name,
            Integer currentStock,
            Integer minStock
    ) {

        Product product = new Product();

        product.setId(id);
        product.setName(name);
        product.setCurrentStock(currentStock);
        product.setMinStock(minStock);
        product.setSku("SKU-" + id);
        product.setCategory("TEST");
        product.setUnitPrice(BigDecimal.TEN);

        return product;
    }
}