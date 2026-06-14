package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.response.StockAlertResponse;
import com.stockflow.inventory_service.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
public class StockAlertController {

    private final AlertService alertService;

    @Operation(summary = "Get stock alerts")
    @ApiResponse(responseCode = "200", description = "Alerts retrieved")
    @GetMapping
    public ResponseEntity<List<StockAlertResponse>> verifyAlerts () {
        return ResponseEntity.ok(alertService.getAlerts());
    }

}