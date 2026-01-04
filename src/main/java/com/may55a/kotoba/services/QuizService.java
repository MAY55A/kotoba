package com.may55a.kotoba.services;

import com.may55a.kotoba.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Stream;

@Service
public class QuizService {
    private final KanjiService kanjiService;
    private final ThreadLocalRandom random = ThreadLocalRandom.current();

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

        // cache kanji details (lazy cache)
        Map<String, KanjiDetails> kanjiCache = new HashMap<>();

        int maxScore = 0;
        int kanjiListSize = kanjiList.size();
        int questionTypes = QuestionType.values().length;
        List<Question> questions = new ArrayList<Question>();

        // add a 'fill in the blank question' every 7 questions
        for(int i=0; i<nbQuestions && i<kanjiListSize; i += 7) {
            String kanjiStr = kanjiList.get(random.nextInt(kanjiListSize));
            // if not already cached, fetch kanji details
            KanjiDetails randomKanji = kanjiCache.computeIfAbsent(
                    kanjiStr,
                    kanjiService::getKanjiDetails
            );
            FillInBlankQuestion generatedFIBQ = generateFillInBlankQuestion(randomKanji);
            if (generatedFIBQ != null) {
                questions.add(generatedFIBQ);
                maxScore += generatedFIBQ.getPoints();
            }
        }
        // add 'multiple choice questions' for the rest of the questions
        // use HashSet to avoid adding the same question
        Set<MultipleChoiceQuestion> questionSet = new HashSet<>();;
        int questionsLeft = nbQuestions - questions.size();

        while (questionSet.size() < questionsLeft) {
            QuestionType type = QuestionType.values()[random.nextInt(questionTypes)];

            List<String> randomKanjis = getRandomList(kanjiList, 4);
            List<KanjiDetails> randomKanjisWithDetails = randomKanjis
                    .stream()
                    .map(kanjiStr -> kanjiCache.computeIfAbsent(
                        kanjiStr,
                        kanjiService::getKanjiDetails
                    ))
                    .toList();

            MultipleChoiceQuestion generatedMCQ = generateMultipleChoiceQuestion(randomKanjisWithDetails, type);

            // if the generated MCQ was already added ignore it and don't count its points
            if (generatedMCQ != null && questionSet.add(generatedMCQ))
                maxScore += generatedMCQ.getPoints();
        }
        questions.addAll(questionSet);
        Collections.shuffle(questions);
        test.setQuestions(questions);
        int minScore = maxScore * passingPercentage / 100;
        test.setRequiredScore(minScore);
        return test;
    }

    private List<String> getRandomList(List<String> list, int elementsNumber) {
        // make sure the elements number is smaller than the list size to prevent infinite loop
        elementsNumber = Math.min(elementsNumber, list.size());
        return random.ints(0, list.size())
                .distinct()
                .limit(elementsNumber)
                .mapToObj(list::get)
                .toList();
    }

    private MultipleChoiceQuestion generateMultipleChoiceQuestion(List<KanjiDetails> kanjiList, QuestionType type) {
        // populate options list with values (meaning or kanji itself depending on the question type)
        List<String> options = new ArrayList<>();
        for(KanjiDetails option : kanjiList) {
            if(type == QuestionType.SHOW_KANJI)
                options.add(option.getMeaning());
            else
                options.add(option.getKanji());
        }

        // pick the first kanji from the list to be the main kanji for this question (test subject)
        KanjiDetails kanji = kanjiList.get(0);
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
        List<String> list = kanjiService.getAllKanjiByGrade(grade);
        if (end == -1)
            return list;
        return list.subList(start, end);
    }

    public Quiz generateSkillQuiz(int nbQuestions) {
        Quiz quiz = new Quiz();
        List<Question> questions = new ArrayList<>();
        while (questions.size() < nbQuestions)
            questions.add(generateRandomQuestion(5));
        quiz.setQuestions(questions);
        return quiz;
    }

    public MultipleChoiceQuestion generateRandomQuestion(int nbOptions) {
        int randomOffset = random.nextInt(8385/nbOptions);
        List<Map<String, Object>> words = kanjiService.getOffsetList(randomOffset, nbOptions);
        Map<String, Object> chosenWord = words.remove(random.nextInt(nbOptions));
        List<QuestionType> types = Arrays.stream(QuestionType.values()).filter(type -> type != QuestionType.SHOW_AUDIO).toList();

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
