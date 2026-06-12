package com.mariastore.inventory_service.dto.request;

import com.mariastore.inventory_service.entity.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MovementRequest (
        @NotNull Long idProduct,
        @NotNull MovementType type,
        @NotNull String reason,
        @NotNull @Min(1)
        @NotNull Integer quantity
    ) {
    }
