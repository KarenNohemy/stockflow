package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.request.MovementRequest;
import com.mariastore.inventory_service.dto.response.MovementResponse;
import com.mariastore.inventory_service.entity.Movement;
import com.mariastore.inventory_service.entity.MovementType;
import com.mariastore.inventory_service.entity.Product;
import com.mariastore.inventory_service.exception.InsufficientStockException;
import com.mariastore.inventory_service.exception.ProductNotFoundException;
import com.mariastore.inventory_service.repository.MovementRepository;
import com.mariastore.inventory_service.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MovementServiceImpl implements  MovementService{

    private final ProductRepository productRepository;
    private final MovementRepository movementRepository;

    public MovementResponse registerMovement (MovementRequest  request){

        Product product = productRepository.findById(request.idProduct()).orElseThrow( ()->
                new ProductNotFoundException("El id de producto no existe"));

        if (MovementType.IN.equals(request.type()) ){
            product.setCurrentStock(product.getCurrentStock() + request.quantity());
        }else {
            if (product.getCurrentStock() < request.quantity()){
                throw  new InsufficientStockException("Inventario insuficiente para el producto: " + product.getName());
            }
            product.setCurrentStock(product.getCurrentStock() - request.quantity());
        }

        Movement movement = new Movement();

        movement.setProductId(product.getId());
        movement.setType(request.type());
        movement.setQuantity(request.quantity());
        movement.setReason(request.reason());
        movement.setTimestamp(LocalDateTime.now());

        productRepository.save(product);
        Movement savedMovement = movementRepository.save(movement);

        return new MovementResponse(
                savedMovement.getId(),
                savedMovement.getProductId(),
                savedMovement.getType(),
                savedMovement.getQuantity(),
                savedMovement.getReason(),
                savedMovement.getTimestamp()
        );

    }

    @Override
    public List<MovementResponse> getMovementHistory(Long productId) {

        productRepository.findById(productId).orElseThrow(
                ()-> new ProductNotFoundException("El producto no existe")
        );

        return movementRepository.findByProductId(productId)
                .stream()
                .map( movement -> new MovementResponse(
                        movement.getId(),
                        movement.getProductId(),
                        movement.getType(),
                        movement.getQuantity(),
                        movement.getReason(),
                        movement.getTimestamp()
                        )

                ).toList();
    }

}
