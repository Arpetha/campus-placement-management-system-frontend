package com.placement.campus.placemnt.system.repository;

import com.placement.campus.placemnt.system.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}