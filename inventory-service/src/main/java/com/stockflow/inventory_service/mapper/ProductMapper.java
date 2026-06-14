package com.stockflow.inventory_service.mapper;

import com.stockflow.inventory_service.dto.response.ProductResponse;
import com.stockflow.inventory_service.entity.Product;

public class ProductMapper {

    public void ProductMapper () {}

    public static ProductResponse toResponse (Product product) {
        return  new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getCurrentStock(),
                product.getMinStock(),
                product.getUnitPrice()
        );
    }
}
