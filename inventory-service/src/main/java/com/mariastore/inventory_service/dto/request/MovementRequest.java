package com.mariastore.inventory_service.dto.request;

import com.mariastore.inventory_service.entity.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MovementRequest (
        @NotNull (message = "Product id is required")
        Long idProduct,
        @NotNull (message = "Movement type is required")
        MovementType type,
        @NotNull (message = "Reason is required")
        @NotBlank(message = "Reason is required")
        String reason,
        @NotNull (message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be greater than zero")
        Integer quantity
    ) {
    }
