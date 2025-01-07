package com.may55a.kotoba.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
abstract public class Question {
    String text;
    String word;
    String correctAnswer;
    String audio;
    QuestionType type;
    int points;

    abstract boolean checkAnswer(String userAnswer);
}

