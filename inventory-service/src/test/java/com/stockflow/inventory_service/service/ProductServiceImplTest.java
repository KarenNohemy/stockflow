package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.response.InventorySummaryResponse;
import com.stockflow.inventory_service.dto.response.ProductResponse;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    // =========================
    // 1. LISTAR PRODUCTOS SIN FILTRO
    // =========================
    @Test
    void shouldReturnAllProductsPaged() {

        Product product = createProduct(1L, "SKU-001", "Product A", "HOME", 10, 5, 100);

        Page<Product> page = new PageImpl<>(List.of(product));

        when(productRepository.findAll(any(Pageable.class)))
                .thenReturn(page);

        Page<ProductResponse> result =
                productService.getProducts(null, Pageable.ofSize(10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Product A", result.getContent().get(0).name());

        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }

    // =========================
    // 2. LISTAR CON FILTRO
    // =========================
    @Test
    void shouldFilterProductsByCategory() {

        Product product = createProduct(2L, "SKU-002", "Filtered Product", "COSMETICS", 5, 2, 50);

        Page<Product> page = new PageImpl<>(List.of(product));

        when(productRepository.findByCategoryContainingIgnoreCase(eq("COSMETICS"), any(Pageable.class)))
                .thenReturn(page);

        Page<ProductResponse> result =
                productService.getProducts("COSMETICS", Pageable.ofSize(10));

        assertEquals(1, result.getContent().size());
        assertEquals("Filtered Product", result.getContent().get(0).name());

        verify(productRepository).findByCategoryContainingIgnoreCase(eq("COSMETICS"), any(Pageable.class));
    }

    // =========================
    // 3. GET BY ID OK
    // =========================
    @Test
    void shouldReturnProductById() {

        Product product = createProduct(1L, "SKU-001", "Single Product", "HOME", 10, 5, 100);

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        ProductResponse result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Single Product", result.name());
        assertEquals("SKU-001", result.sku());

        verify(productRepository).findById(1L);
    }

    // =========================
    // 4. GET BY ID NOT FOUND
    // =========================
    @Test
    void shouldThrowExceptionWhenProductNotFound() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> productService.getProductById(99L));

        verify(productRepository).findById(99L);
    }

    // =========================
    // 5. INVENTORY SUMMARY
    // =========================
    @Test
    void shouldReturnInventorySummary() {

        Product p1 = createProduct(1L, "SKU-001", "A", "CAT", 2, 1, 10);
        Product p2 = createProduct(2L, "SKU-002", "B", "CAT", 3, 1, 20);

        when(productRepository.findAll())
                .thenReturn(List.of(p1, p2));

        InventorySummaryResponse result = productService.getInventorySummary();

        assertNotNull(result);
        assertEquals(2, result.totalProducts());

        // 2*10 + 3*20 = 80
        assertTrue(BigDecimal.valueOf(80)
                .compareTo(result.totalInventoryValue()) == 0);
        verify(productRepository).findAll();
    }

    // =========================
    // HELPERS (IMPORTANTE PARA LIMPIEZA)
    // =========================
    private Product createProduct(Long id,
                                  String sku,
                                  String name,
                                  String category,
                                  int stock,
                                  int minStock,
                                  double price) {

        Product p = new Product();
        p.setId(id);
        p.setSku(sku);
        p.setName(name);
        p.setCategory(category);
        p.setCurrentStock(stock);
        p.setMinStock(minStock);
        p.setUnitPrice(BigDecimal.valueOf(price));

        return p;
    }
}