package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.response.StockAlertResponse;
import com.mariastore.inventory_service.entity.Severity;
import com.mariastore.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final ProductRepository productRepository;

    @CircuitBreaker(name = "alertsService", fallbackMethod = "alertsFallback")
    public List<StockAlertResponse> getAlerts () {

        return productRepository.findAll().stream()
                .filter(product -> product.getCurrentStock() <= product.getMinStock() )
                .map(  product -> {
                            Severity severity  = product.getCurrentStock() < product.getMinStock()
                                    ? Severity.CRITICAL
                                    : Severity.LOW;

                            return new StockAlertResponse(
                                    product.getId(),
                                    product.getName(),
                                    product.getCurrentStock(),
                                    product.getMinStock(),
                                    severity
                            );
                        }
                ).toList();
    }

    public List<StockAlertResponse> alertsFallback(Throwable ex) {

        return List.of(
                new StockAlertResponse(
                        null,
                        "Servicio inhabilitado temporalmente",
                        0,
                        0,
                        Severity.CRITICAL
                )
        );
    }
}
