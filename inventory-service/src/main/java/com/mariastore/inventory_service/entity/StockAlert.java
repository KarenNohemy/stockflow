package com.mariastore.inventory_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockAlert {

    @Id
    private Long productId;

    private String productName;

    private Integer currentStock;

    private Integer minStock;

    @Enumerated(EnumType.STRING)
    private Severity severity;
}