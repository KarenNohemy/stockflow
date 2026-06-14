package com.stockflow.inventory_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockflow.inventory_service.dto.request.MovementRequest;
import com.stockflow.inventory_service.dto.response.MovementResponse;
import com.stockflow.inventory_service.entity.MovementType;
import com.stockflow.inventory_service.service.MovementService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MovementController.class)
class MovementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MovementService movementService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRegisterMovement() throws Exception {

        MovementRequest request = new MovementRequest(
                1L,
                MovementType.IN,
                "Initial stock",
                5
        );

        MovementResponse response = new MovementResponse(
                1L,
                1L,
                MovementType.IN,
                5,
                "Initial stock",
                LocalDateTime.now()
        );

        when(movementService.registerMovement(request))
                .thenReturn(response);

        mockMvc.perform(post("/api/v1/movements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.productId").value(1));
    }

    @Test
    void shouldReturnHistory() throws Exception {

        MovementResponse response = new MovementResponse(
                1L,
                1L,
                MovementType.IN,
                5,
                "Initial stock",
                LocalDateTime.now()
        );

        when(movementService.getMovementHistory(1L))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/movements/1/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].productId").value(1));
    }
}