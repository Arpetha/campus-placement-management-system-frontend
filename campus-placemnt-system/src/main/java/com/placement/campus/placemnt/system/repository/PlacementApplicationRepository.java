package com.placement.campus.placemnt.system.repository;

import com.placement.campus.placemnt.system.entity.PlacementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlacementApplicationRepository
        extends JpaRepository<PlacementApplication, Long> {

    List<PlacementApplication> findByStudentEmailIgnoreCase(
            String studentEmail);
}