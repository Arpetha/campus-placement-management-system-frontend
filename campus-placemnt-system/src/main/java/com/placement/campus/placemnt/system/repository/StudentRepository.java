package com.placement.campus.placemnt.system.repository;

import com.placement.campus.placemnt.system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
