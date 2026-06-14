package com.stockflow.inventory_service.dto.response;

import com.stockflow.inventory_service.entity.Severity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Alert response")
public record StockAlertResponse (
        Long productId,
        String productName,
        Integer currentStock,
        Integer minStock,
        Severity severity
){
}
