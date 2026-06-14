package com.stockflow.inventory_service.controller;

import com.stockflow.inventory_service.dto.request.MovementRequest;
import com.stockflow.inventory_service.dto.response.MovementResponse;
import com.stockflow.inventory_service.service.MovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Register movement (IN/OUT)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Movement registered"),
            @ApiResponse(responseCode = "422", description = "Insufficient stock")
    })
    @PostMapping
    public ResponseEntity<MovementResponse> registerMovement (@Valid  @RequestBody MovementRequest movement) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movementService.registerMovement(movement));
    }

    @Operation(summary = "Get movement history by product")
    @ApiResponse(responseCode = "200", description = "History retrieved")
    @GetMapping("/{productId}/history")
    public ResponseEntity<List<MovementResponse>> historyMovements ( @PathVariable(required = true) Long productId){

       return ResponseEntity.status(HttpStatus.OK).body(movementService.getMovementHistory(productId)) ;
    }
}
