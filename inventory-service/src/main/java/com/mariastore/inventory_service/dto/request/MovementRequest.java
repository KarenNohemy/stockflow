package com.mariastore.inventory_service.dto.request;

import com.mariastore.inventory_service.entity.MovementType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Movement request payload")
public record MovementRequest (
        @Schema(description = "Product ID", example = "1")
        @NotNull (message = "Product id is required")
        Long idProduct,

        @Schema(description = "Movement type IN or OUT")
        @NotNull (message = "Movement type is required")
        MovementType type,

        @Schema(description = "Reason for movement")
        @NotNull (message = "Reason is required")
        @NotBlank(message = "Reason is required")
        String reason,

        @Schema(description = "Quantity", example = "5")
        @NotNull (message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be greater than zero")
        Integer quantity
    ) {
    }
