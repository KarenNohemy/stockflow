package com.mariastore.inventory_service.repository;

import com.mariastore.inventory_service.entity.Movement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementRepository  extends JpaRepository<Movement, Long> {

}
