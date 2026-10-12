package com.placement.campus.placemnt.system.controller;

import com.placement.campus.placemnt.system.entity.PlacementApplication;
import com.placement.campus.placemnt.system.repository.PlacementApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/placement-applications")
@CrossOrigin
public class PlacementApplicationController {

    private final PlacementApplicationRepository applicationRepository;

    public PlacementApplicationController(
            PlacementApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    // Apply for a placement
    @PostMapping
    public ResponseEntity<?> applyForPlacement(
            @RequestBody Map<String, String> request) {

        String studentName = request.get("studentName");
        String studentEmail = request.get("studentEmail");
        String company = request.get("company");
        String role = request.get("role");

        if (studentName == null || studentEmail == null ||
                company == null || role == null ||
                studentName.isBlank() || studentEmail.isBlank() ||
                company.isBlank() || role.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "Required application details are missing"));
        }

        boolean alreadyApplied = applicationRepository
                .findByStudentEmailIgnoreCase(studentEmail)
                .stream()
                .anyMatch(app -> app.getCompany() != null &&
                        app.getCompany().equalsIgnoreCase(company));

        if (alreadyApplied) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "You have already applied to this company"));
        }

        PlacementApplication application = new PlacementApplication();
        application.setStudentName(studentName);
        application.setStudentEmail(studentEmail);
        application.setCompany(company);
        application.setRole(role);
        application.setStatus("Applied");
        application.setAppliedAt(LocalDateTime.now());

        return ResponseEntity.ok(
                applicationRepository.save(application));
    }

    // Get applications for a student
    @GetMapping
    public List<PlacementApplication> getApplications(
            @RequestParam String email) {
        return applicationRepository
                .findByStudentEmailIgnoreCase(email);
    }

    // Get all applications
    @GetMapping("/all")
    public List<PlacementApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Update application status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        if (status == null ||
                !Set.of("Applied", "Shortlisted",
                        "Selected", "Rejected").contains(status)) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Invalid application status"));
        }

        return applicationRepository.findById(id)
                .<ResponseEntity<?>>map(application -> {
                    application.setStatus(status);
                    PlacementApplication saved =
                            applicationRepository.save(application);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}