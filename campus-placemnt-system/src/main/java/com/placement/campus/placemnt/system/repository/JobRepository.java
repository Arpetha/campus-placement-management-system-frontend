package com.placement.campus.placemnt.system.repository;

import com.placement.campus.placemnt.system.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {
}