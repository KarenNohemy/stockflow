package com.stockflow.inventory_service.dto.response;

import java.math.BigDecimal;

public record InventorySummaryResponse(
        int totalProducts,
        BigDecimal totalInventoryValue,
        int totalUnits,
        int lowStockProducts
) {
}
