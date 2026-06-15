package com.stockflow.inventory_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.inventory_service.dto.response.InventorySummaryResponse;
import com.stockflow.inventory_service.dto.response.ProductResponse;
import com.stockflow.inventory_service.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturnProductsPage() throws Exception {

        ProductResponse product = new ProductResponse(
                1L,
                "SKU-001",
                "Test Product",
                "CATEGORY",
                10,
                5,
                BigDecimal.valueOf(100)
        );

        Page<ProductResponse> page =
                new PageImpl<>(List.of(product), PageRequest.of(0, 10), 1);

        when(productService.getProducts(null, PageRequest.of(0, 10)))
                .thenReturn(page);

        mockMvc.perform(get("/api/v1/products")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].sku").value("SKU-001"));
    }

    @Test
    void shouldReturnSummary() throws Exception {

        InventorySummaryResponse response =
                new InventorySummaryResponse(
                        2,
                        BigDecimal.valueOf(100),
                        50,
                        1
                );

        when(productService.getInventorySummary())
                .thenReturn(response);

        mockMvc.perform(get("/api/v1/products/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProducts").value(2));
    }
}