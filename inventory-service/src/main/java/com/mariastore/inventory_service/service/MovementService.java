package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.request.MovementRequest;
import com.mariastore.inventory_service.dto.response.MovementResponse;
import com.mariastore.inventory_service.entity.Movement;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface MovementService {

    MovementResponse registerMovement (MovementRequest request );

    List<MovementResponse> getMovementHistory (Long productId);


}
