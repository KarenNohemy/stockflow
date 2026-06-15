package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.request.MovementRequest;
import com.stockflow.inventory_service.dto.response.MovementResponse;
import com.stockflow.inventory_service.entity.Movement;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.InsufficientStockException;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.repository.MovementRepository;
import com.stockflow.inventory_service.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovementServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MovementRepository movementRepository;

    @InjectMocks
    private MovementServiceImpl movementService;

    // =========================
    // 1. MOVEMENT IN (AUMENTA STOCK)
    // =========================
    @Test
    void shouldIncreaseStockWhenMovementIsIN() {

        Product product = createProduct(1L, 10);

        MovementRequest request = new MovementRequest(
                1L,
                MovementType.IN,
                "Restock",
                5
        );

        Movement savedMovement = createMovement(1L, MovementType.IN, 5);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenReturn(savedMovement);

        MovementResponse response = movementService.registerMovement(request);

        assertNotNull(response);
        assertEquals(15, product.getCurrentStock());

        verify(productRepository).save(product);
        verify(movementRepository).save(any(Movement.class));
    }

    // =========================
    // 2. MOVEMENT OUT (RESTA STOCK)
    // =========================
    @Test
    void shouldDecreaseStockWhenMovementIsOUT() {

        Product product = createProduct(1L, 10);

        MovementRequest request = new MovementRequest(
                1L,
                MovementType.OUT,
                "Sale",
                3
        );

        Movement savedMovement = createMovement(1L, MovementType.OUT, 3);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.save(any(Movement.class))).thenReturn(savedMovement);

        MovementResponse response = movementService.registerMovement(request);

        assertNotNull(response);
        assertEquals(7, product.getCurrentStock());

        verify(productRepository).save(product);
    }

    // =========================
    // 3. STOCK INSUFICIENTE
    // =========================
    @Test
    void shouldThrowExceptionWhenInsufficientStock() {

        Product product = createProduct(1L, 2);

        MovementRequest request = new MovementRequest(
                1L,
                MovementType.OUT,
                "Sale",
                5
        );

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class,
                () -> movementService.registerMovement(request));

        verify(productRepository, never()).save(any());
        verify(movementRepository, never()).save(any());
    }

    // =========================
    // 4. PRODUCT NOT FOUND
    // =========================
    @Test
    void shouldThrowExceptionWhenProductNotFound() {

        MovementRequest request = new MovementRequest(
                99L,
                MovementType.IN,
                "Restock",
                5
        );

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProductNotFoundException.class,
                () -> movementService.registerMovement(request));
    }

    // =========================
    // 5. HISTORY
    // =========================
    @Test
    void shouldReturnMovementHistory() {

        Product product = createProduct(1L, 10);
        Movement movement = createMovement(1L, MovementType.IN, 5);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(movementRepository.findByProductId(1L)).thenReturn(List.of(movement));

        List<MovementResponse> result = movementService.getMovementHistory(1L);

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(movementRepository).findByProductId(1L);
    }

    // =========================
    // HELPERS
    // =========================
    private Product createProduct(Long id, int stock) {
        Product p = new Product();
        p.setId(id);
        p.setCurrentStock(stock);
        return p;
    }

    private Movement createMovement(Long id, MovementType type, int qty) {
        Movement m = new Movement();
        m.setId(id);
        m.setType(type);
        m.setQuantity(qty);
        return m;
    }
}