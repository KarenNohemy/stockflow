package com.mariastore.inventory_service.dto.response;

import java.math.BigDecimal;

public record ProductResponse (
   Long id,
   String sku,
   String name,
   String category,
   Integer currentStock,
   Integer minStock,
   BigDecimal unitPrice

){ }
