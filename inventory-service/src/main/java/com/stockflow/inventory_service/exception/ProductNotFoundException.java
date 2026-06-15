package com.stockflow.inventory_service.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


public class ProductNotFoundException extends RuntimeException {


    public  ProductNotFoundException (String message) {
        super(message);
    }
}
