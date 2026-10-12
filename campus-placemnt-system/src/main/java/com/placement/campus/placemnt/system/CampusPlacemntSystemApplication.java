package com.placement.campus.placemnt.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class CampusPlacemntSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusPlacemntSystemApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Campus Placement Management System Backend is Running!";
    }
}