package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.request.MovementRequest;
import com.stockflow.inventory_service.dto.response.MovementResponse;

import java.util.List;

public interface MovementService {

    MovementResponse registerMovement (MovementRequest request );

    List<MovementResponse> getMovementHistory (Long productId);


}
