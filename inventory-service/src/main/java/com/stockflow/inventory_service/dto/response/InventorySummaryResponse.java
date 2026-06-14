package com.stockflow.inventory_service.dto.response;

import java.math.BigDecimal;

public record InventorySummaryResponse  (
        BigDecimal totalInventoryValue,
        Long totalProducts
) {
}
