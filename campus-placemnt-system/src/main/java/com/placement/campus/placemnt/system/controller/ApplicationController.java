package com.placement.campus.placemnt.system.controller;

import com.placement.campus.placemnt.system.entity.Application;
import com.placement.campus.placemnt.system.repository.ApplicationRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5174")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PostMapping
    public Application applyForJob(@RequestBody Application application) {
        if (application.getStatus() == null || application.getStatus().isEmpty()) {
            application.setStatus("Applied");
        }

        return applicationRepository.save(application);
    }
}