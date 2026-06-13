package com.mariastore.inventory_service.dto.response;
import  com.mariastore.inventory_service.entity.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Schema(description = "Movement response")
public record MovementResponse(
        Long id,
        Long productId,
        MovementType type,
        Integer quantity,
        String reason,
        LocalDateTime timestamp
) {
}
