package com.may55a.kotoba.models;

import lombok.Getter;

import java.util.List;

@Getter
public class MultipleChoiceQuestion extends Question {
    List<String> options;

    public MultipleChoiceQuestion(QuestionType type, String text, String word, String correctAnswer, List<String> options, String audio) {
        this.text = text;
        this.word = word;
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.audio = audio;
        this.type = type;
        this.points = 10;
    }

    @Override
    public boolean checkAnswer(String userAnswer) {
        return correctAnswer.equals(userAnswer);
    }
}
