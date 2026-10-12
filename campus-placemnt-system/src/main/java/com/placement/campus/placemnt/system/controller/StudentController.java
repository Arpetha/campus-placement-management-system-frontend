package com.placement.campus.placemnt.system.controller;

import com.placement.campus.placemnt.system.entity.Student;
import com.placement.campus.placemnt.system.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin
public class StudentController {

    private final StudentRepository studentRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all registered students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get one student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Register a new student
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Student student) {

        if (student.getPassword() == null ||
                student.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        if (student.getEmail() == null ||
                student.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        boolean emailExists = studentRepository.findAll().stream()
                .anyMatch(s -> s.getEmail() != null &&
                        s.getEmail().equalsIgnoreCase(
                                student.getEmail().trim()));

        if (emailExists) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is already registered"));
        }

        student.setEmail(student.getEmail().trim());
        student.setPassword(
                passwordEncoder.encode(student.getPassword()));

        Student savedStudent = studentRepository.save(student);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    // Student login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank() ||
                password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email and password are required"
                    ));
        }

        Student student = studentRepository.findAll().stream()
                .filter(s -> s.getEmail() != null &&
                        s.getEmail().equalsIgnoreCase(email.trim()))
                .findFirst()
                .orElse(null);

        if (student == null ||
                student.getPassword() == null ||
                !passwordEncoder.matches(
                        password, student.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "name", student.getName() == null ? "" : student.getName(),
                "email", student.getEmail() == null ? "" : student.getEmail(),
                "department", student.getDepartment() == null
                        ? "" : student.getDepartment(),
                "cgpa", student.getCgpa() == null
                        ? "" : student.getCgpa()
        ));
    }

    // Delete a student by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {

        if (!studentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        studentRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Student deleted successfully"));
    }
}