package com.mariastore.inventory_service.controller;

import com.mariastore.inventory_service.dto.request.MovementRequest;
import com.mariastore.inventory_service.dto.response.MovementResponse;
import com.mariastore.inventory_service.service.MovementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movements")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public ResponseEntity<MovementResponse> registerMovement (@Valid  @RequestBody MovementRequest movement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movementService.registerMovement(movement));
    }

    @GetMapping()
    @RequestMapping("/{productId}/history")
    public ResponseEntity<List<MovementResponse>> historyMovements ( @PathVariable(required = true) Long productId){

       return ResponseEntity.status(HttpStatus.OK).body(movementService.getMovementHistory(productId)) ;
    }
}
