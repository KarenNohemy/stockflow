package com.mariastore.inventory_service.exception;

import com.mariastore.inventory_service.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlerProductNotFound
            (ProductNotFoundException ex, HttpServletRequest request){

        ErrorResponse error = new ErrorResponse (
                LocalDateTime.now(), 400, "Not found", ex.getMessage(), request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handlerProductNotFound
            (InsufficientStockException ex, HttpServletRequest request){

        ErrorResponse error = new ErrorResponse (
                LocalDateTime.now(), 422, "Insufficient Stock", ex.getMessage(), request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(error);
    }

}


