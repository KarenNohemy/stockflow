package com.stockflow.inventory_service.mapper;

import com.stockflow.inventory_service.dto.response.MovementResponse;
import com.stockflow.inventory_service.entity.Movement;

public class MovementMapper {

    public static MovementResponse toResponse(
            Movement movement) {

        return new MovementResponse(
                movement.getId(),
                movement.getProductId(),
                movement.getType(),
                movement.getQuantity(),
                movement.getReason(),
                movement.getTimestamp()
        );
    }
}