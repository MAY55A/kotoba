package com.may55a.kotoba.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.may55a.kotoba.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {
    private final KanjiService kanjiService;

    @Autowired
    public QuizService(KanjiService kanjiService){
        this.kanjiService= kanjiService;
    }

    public Quiz getUnitTest(String grade, int nbTest) {
        List<String> list = getListKanji(grade, (nbTest-1)*10, nbTest*10);
        if(list.isEmpty())
            return null;
        return generateTest(list, 7, 75);
    }

    public Quiz getFinalTest(String grade) {
        List<String> list = getListKanji(grade, 0, -1);
        if(list.isEmpty())
            return null;
        return generateTest(list, 20, 60);
    }

    public Quiz generateTest(List<String> kanjiList, int nbQuestions, int passingPercentage) {
        Quiz test = new Quiz();
        int minScore = 0;
        List<Question> questions = new ArrayList<Question>();
        Random random = new Random();

        Collections.shuffle(kanjiList);
        // add a 'fill in the blank question' every 7 questions
        for(int i=0; i<nbQuestions && i<kanjiList.size(); i += 7) {
            KanjiDetails randomKanji = kanjiService.getKanjiDetails(kanjiList.get(i));
            FillInBlankQuestion generatedFIBQ = generateFillInBlankQuestion(randomKanji);
            if (generatedFIBQ != null) {
                questions.add(generatedFIBQ);
                minScore += generatedFIBQ.getPoints();
            }
        }
        // add a 'multiple choice question' for the rest of the questions
        while (questions.size() < nbQuestions) {
            QuestionType type = QuestionType.values()[random.nextInt(QuestionType.values().length)];
            MultipleChoiceQuestion generatedMCQ = generateMultipleChoiceQuestion(kanjiList, 4, type);
            if(generatedMCQ != null && !questions.contains(generatedMCQ)) {
                questions.add(generatedMCQ);
                minScore += generatedMCQ.getPoints();
            }
        }
        Collections.shuffle(questions);
        test.setQuestions(questions);
        minScore = minScore * passingPercentage / 100;
        test.setRequiredScore(minScore);
        return test;
    }

    private MultipleChoiceQuestion generateMultipleChoiceQuestion(List<String> kanjiList, int nbOptions, QuestionType type) {
        Collections.shuffle(kanjiList);
        List<String> options = new ArrayList<>();
        KanjiDetails kanji = null;
        for(int i=0; i < kanjiList.size() && i < nbOptions; i++) {
            kanji = kanjiService.getKanjiDetails(kanjiList.get(i));
            if(type == QuestionType.SHOW_KANJI)
                options.add(kanji.getMeaning());
            else
                options.add(kanji.getKanji());
        }
        System.out.println(options);
        if (kanji == null)
            return null;
        if(type == QuestionType.SHOW_KANJI)
            return new MultipleChoiceQuestion(type, "What is the meaning of the kanji ?", kanji.getKanji(), kanji.getMeaning(), options, kanji.getAudioPath());
        else if(type == QuestionType.SHOW_MEANING)
            return new MultipleChoiceQuestion(type, "What is the kanji for this word ?", kanji.getMeaning(), kanji.getKanji(), options, null);
        else if (type == QuestionType.SHOW_READING)
            return new MultipleChoiceQuestion(type, "What is the kanji for this reading ?", kanji.getKunyomi().get("romaji").isEmpty() ? kanji.getOnyomi().get("katakana") : kanji.getKunyomi().get("hiragana"), kanji.getKanji(), options, null);
        else
            return new MultipleChoiceQuestion(type, "What is the kanji with this sound ?", null, kanji.getKanji(), options, kanji.getAudioPath());
    }

    private FillInBlankQuestion generateFillInBlankQuestion(KanjiDetails kanji) {
        String kunyomi = kanji.getKunyomi().get("hiragana").isEmpty() ? "" : kanji.getKunyomi().get("romaji");
        String onyomi = kanji.getOnyomi().get("katakana").isEmpty() ? "" : kanji.getOnyomi().get("romaji");
        if( kunyomi.isEmpty() && onyomi.isEmpty())
            return null;
        String readings = kunyomi + ", " + onyomi;
        return new FillInBlankQuestion("Write a reading for this kanji", kanji.getKanji(), readings);
    }

    public List<String> getListKanji(String grade, int start, int end) {
        ObjectMapper objectMapper = new ObjectMapper();
        String kanji = kanjiService.getAllKanjiByGrade(grade);
        try {
            List<String> list = objectMapper.readValue(kanji, List.class);
            if (end == -1)
                return list;
            return list.subList(start, end);
        } catch (Exception e) {
            return new ArrayList<String>();
        }
    }

    public Quiz generateSkillQuiz(int nbQuestions) {
        Quiz quiz = new Quiz();
        List<Question> questions = new ArrayList<>();
        while (questions.size() < nbQuestions)
            questions.add(generateRandomQuestion(5));
        return quiz;
    }

    public MultipleChoiceQuestion generateRandomQuestion(int nbOptions) {
        Random random = new Random();
        int randomOffset = random.nextInt(8385/nbOptions);
        List<Map<String, Object>> words = kanjiService.getOffsetList(randomOffset, nbOptions);
        Map<String, Object> chosenWord = words.remove(random.nextInt(nbOptions));
        List<QuestionType> types = Arrays.stream(QuestionType.values()).toList();
        types.remove(QuestionType.SHOW_AUDIO);

        if (chosenWord.get("furigana").toString().isEmpty())
            types.remove(QuestionType.SHOW_READING);
        QuestionType type = types.get(random.nextInt(types.size()));

        if(type == QuestionType.SHOW_KANJI)
            return new MultipleChoiceQuestion(type, "What is the meaning of this word ?", chosenWord.get("word").toString(), chosenWord.get("meaning").toString(), words.stream().map((word)-> word.get("meaning").toString()).toList(), null);
        else if(type == QuestionType.SHOW_MEANING)
            return new MultipleChoiceQuestion(type, "What is the word with this meaning ?", chosenWord.get("meaning").toString(), chosenWord.get("word").toString(), words.stream().map((word)-> word.get("word").toString()).toList(), null);
        else
            return new MultipleChoiceQuestion(type, "What is the kanji for this reading ?", chosenWord.get("furigana").toString(), chosenWord.get("word").toString(), words.stream().map((word)-> word.get("word").toString()).toList(), null);
    }
}
