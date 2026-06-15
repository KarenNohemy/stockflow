package com.stockflow.inventory_service.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "Product response")
public record ProductResponse (
   Long id,
   String sku,
   String name,
   String category,
   Integer currentStock,
   Integer minStock,
   BigDecimal unitPrice

){ }
