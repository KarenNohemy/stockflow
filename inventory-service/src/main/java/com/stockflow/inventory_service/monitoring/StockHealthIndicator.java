package com.stockflow.inventory_service.monitoring;

import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StockHealthIndicator implements HealthIndicator {

    private final ProductRepository productRepository;

    @Override
    public Health health() {

        List<Product> products = productRepository.findAll();

        if (products.isEmpty()) {
            return Health.up()
                    .withDetail("message", "No products found")
                    .build();
        }

        long total = products.size();

        long critical = products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStock())
                .count();

        double percentage = (critical * 100.0) / total;

        if (percentage > 20) {
            return Health.down()
                    .withDetail("message", "More than 20% products in critical state")
                    .withDetail("criticalPercentage", percentage)
                    .build();
        }

        return Health.up()
                .withDetail("criticalPercentage", percentage)
                .build();
    }
}
