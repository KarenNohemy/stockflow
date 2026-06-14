package com.mariastore.inventory_service.dto.response;

import java.math.BigDecimal;

public record InventorySummaryResponse  (
        BigDecimal totalInventoryValue,
        Long totalProducts
) {
}
