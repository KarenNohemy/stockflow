package com.stockflow.inventory_service.exception;

import com.stockflow.inventory_service.dto.response.ErrorResponse;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.NoHandlerFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @Mock
    private HttpServletRequest request;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        handler = new GlobalExceptionHandler();

        when(request.getRequestURI())
                .thenReturn("/api/test");
    }

    @Test
    void shouldHandleProductNotFound() {

        ProductNotFoundException ex =
                new ProductNotFoundException("Producto no existe");

        ResponseEntity<ErrorResponse> response =
                handler.handlerProductNotFound(ex, request);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Producto no existe",
                response.getBody().message());
    }

    @Test
    void shouldHandleInsufficientStock() {

        InsufficientStockException ex =
                new InsufficientStockException("Sin stock");

        ResponseEntity<ErrorResponse> response =
                handler.handlerInsuddicientStock(ex, request);

        assertEquals(422, response.getStatusCode().value());
        assertEquals("Sin stock",
                response.getBody().message());
    }

    @Test
    void shouldHandleGenericException() {

        Exception ex = new Exception("Error interno");

        ResponseEntity<ErrorResponse> response =
                handler.handleGeneric(ex, request);

        assertEquals(500, response.getStatusCode().value());
        assertEquals("Error interno",
                response.getBody().message());
    }

    @Test
    void shouldHandleRateLimit() {

        RequestNotPermitted ex = org.mockito.Mockito.mock(RequestNotPermitted.class);

        ResponseEntity<ErrorResponse> response =
                handler.handleRateLimit(ex, request);

        assertEquals(429, response.getStatusCode().value());
    }

    @Test
    void shouldHandleEndpointNotFound() {

        NoHandlerFoundException ex =
                new NoHandlerFoundException(
                        "GET",
                        "/fake",
                        null
                );

        ResponseEntity<ErrorResponse> response =
                handler.handleNotFoundRoute(ex, request);

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void shouldCreateProductNotFoundException() {

        ProductNotFoundException ex =
                new ProductNotFoundException("error");

        assertEquals("error", ex.getMessage());
    }

    @Test
    void shouldCreateInsufficientStockException() {

        InsufficientStockException ex =
                new InsufficientStockException("error");

        assertEquals("error", ex.getMessage());
    }
}