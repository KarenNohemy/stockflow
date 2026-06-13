package com.mariastore.inventory_service.controller;

import com.mariastore.inventory_service.dto.response.StockAlertResponse;
import com.mariastore.inventory_service.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping
    public ResponseEntity<List<StockAlertResponse>> verifyAlerts () {
        return ResponseEntity.ok(alertService.getAlerts());
    }

}