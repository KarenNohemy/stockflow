package com.mariastore.inventory_service.service;

import com.mariastore.inventory_service.dto.response.ProductResponse;
import com.mariastore.inventory_service.entity.Product;
import com.mariastore.inventory_service.mapper.ProductMapper;
import com.mariastore.inventory_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements  ProductService{

    private final ProductRepository productRepository;

    @Override
    public Page<ProductResponse> getProducts (String category, Pageable pageable) {

        Page<Product> products;

        if (category != null && !category.isBlank()){
            products =  productRepository.findByCategory(category, pageable);
        }else {
            products = productRepository.findAll(pageable);
        }

        return products.map(ProductMapper::toResponse);
    }
}
