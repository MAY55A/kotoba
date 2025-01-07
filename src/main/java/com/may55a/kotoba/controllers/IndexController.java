package com.may55a.kotoba.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {
    @GetMapping("/")
    public String home() {
        return "Home";
    }

    @GetMapping("/signup")
    public String signup() {
        return "Signup";
    }

    @GetMapping("/login")
    public String login() {
        return "Login";
    }

    @GetMapping("/learn")
    public String learn() {
        return "Learn";
    }

    @GetMapping("/learn/grades/{grade}")
    public String learnGrade(@PathVariable String grade, Model model) {
        model.addAttribute("grade", grade);
        return "Grade";
    }
    @GetMapping("/learn/grades/{grade}/kanji")
    public String learnKanji(@RequestParam String kanji, @RequestParam int id, @PathVariable String grade, Model model) {
        model.addAttribute("kanji", kanji);
        model.addAttribute("id", id);
        model.addAttribute("grade", grade);
        return "Kanji";
    }

    @GetMapping("/learn/grades/{grade}/tests/{test}")
    public String test(@PathVariable String grade, @PathVariable String test, Model model) {
        model.addAttribute("grade", grade);
        model.addAttribute("test", test);
        return "Test";
    }
}
