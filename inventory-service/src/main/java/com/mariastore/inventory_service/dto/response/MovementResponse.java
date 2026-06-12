package com.mariastore.inventory_service.dto.response;
import  com.mariastore.inventory_service.entity.MovementType;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public record MovementResponse(
        Long id,
        Long productId,
        MovementType type,
        Integer quantity,
        String reason,
        LocalDateTime timestamp
) {
}
