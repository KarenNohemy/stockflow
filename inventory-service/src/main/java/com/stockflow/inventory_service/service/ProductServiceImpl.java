package com.stockflow.inventory_service.service;

import com.stockflow.inventory_service.dto.response.InventorySummaryResponse;
import com.stockflow.inventory_service.dto.response.ProductResponse;
import com.stockflow.inventory_service.entity.Product;
import com.stockflow.inventory_service.exception.ProductNotFoundException;
import com.stockflow.inventory_service.mapper.ProductMapper;
import com.stockflow.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements  ProductService{

    private final ProductRepository productRepository;

    @Override
    public Page<ProductResponse> getProducts (String category, Pageable pageable) {

        Page<Product> products;

        if (category != null && !category.isBlank()){
            products =  productRepository.findByCategoryContainingIgnoreCase(category, pageable);
        }else {
            products = productRepository.findAll(pageable);
        }

        return products.map(ProductMapper::toResponse);
    }

    @Override
    public ProductResponse getProductById (Long id) throws ProductNotFoundException {
        Product product;

        product = productRepository.findById(id).orElseThrow( ()->
                new ProductNotFoundException ("Id de producto " + id +  " no existe"));

        return ProductMapper.toResponse(product);
    }

    @Override
    public InventorySummaryResponse getInventorySummary() {

        List<Product> products = productRepository.findAll();

        BigDecimal totalInventoryValue = products.stream()
                .map(p -> p.getUnitPrice()
                        .multiply(BigDecimal.valueOf(p.getCurrentStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalProducts = products.size();

        int totalUnits = products.stream()
                .mapToInt(Product::getCurrentStock)
                .sum();

        int lowStockProducts = (int) products.stream()
                .filter(p -> p.getCurrentStock() <= p.getMinStock())
                .count();

        return new InventorySummaryResponse(
                totalProducts,
                totalInventoryValue,
                totalUnits,
                lowStockProducts
        );
    }

}
