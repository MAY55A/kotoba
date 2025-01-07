package com.may55a.kotoba.controllers;

import com.may55a.kotoba.models.KanjiDetails;
import com.may55a.kotoba.models.Quiz;
import com.may55a.kotoba.services.KanjiService;
import com.may55a.kotoba.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }
    @GetMapping("/unit-test")
    public ResponseEntity<Quiz> getUnitTest(@RequestParam String grade, @RequestParam int test) {
        Quiz quiz = quizService.getUnitTest(grade, test);
        if(quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/final-test")
    public ResponseEntity<Quiz> getFinalTest(@RequestParam String grade) {
        Quiz quiz = quizService.getFinalTest(grade);
        if(quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/skill-quiz")
    public ResponseEntity<Quiz> getSkillQuiz(@RequestParam int questions) {
        Quiz quiz = quizService.generateSkillQuiz(questions);
        if(quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }
}
