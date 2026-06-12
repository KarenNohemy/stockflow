package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.request.MovementRequest;
import com.mariastore.inventory_service.dto.response.MovementResponse;

public interface MovementService {

    MovementResponse registerMovement (MovementRequest request );
}
