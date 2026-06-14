package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.response.StockAlertResponse;
import com.stockflow.inventory_service.entity.Severity;
import com.stockflow.inventory_service.service.AlertService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StockAlertController.class)
class StockAlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AlertService alertService;

    @Test
    void shouldReturnAlerts() throws Exception {

        StockAlertResponse response = new StockAlertResponse(
                1L,
                "Product A",
                2,
                5,
                Severity.CRITICAL
        );

        when(alertService.getAlerts())
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productId").value(1));
    }
}