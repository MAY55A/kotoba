package com.may55a.kotoba.controllers;

import com.may55a.kotoba.dto.UserUpdateDTO;
import com.may55a.kotoba.models.LearningStats;
import com.may55a.kotoba.models.User;
import com.may55a.kotoba.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfile() {
        return ResponseEntity.ok(userService.getLoggedInUser());
    }

    @GetMapping("/learningStats")
    public ResponseEntity<LearningStats> getLearningStats() {
        return ResponseEntity.ok(userService.getLearningStats());
    }

    @GetMapping("/favourites")
    public ResponseEntity<List<String>> getFavourites() {
        return ResponseEntity.ok(userService.getFavourites());
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDTO data) {
        try {
            userService.updateUser(data);
            return ResponseEntity.ok("User updated successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
