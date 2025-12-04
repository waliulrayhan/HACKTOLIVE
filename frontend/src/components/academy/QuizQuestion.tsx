"use client";

import { Box, Radio, RadioGroup, Checkbox, CheckboxGroup, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import { QuizQuestion as QuizQuestionType } from "@/types/academy";
import { useState } from "react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  onAnswer?: (answer: string | string[]) => void;
  showExplanation?: boolean;
  userAnswer?: string | string[];
}

export default function QuizQuestion({
  question,
  questionNumber,
  onAnswer,
  showExplanation = false,
  userAnswer,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>(userAnswer || (question.type === "multiple-select" ? [] : ""));

  const handleAnswer = (answer: string | string[] | (string | number)[]) => {
    // Convert (string | number)[] to string[] for CheckboxGroup compatibility
    const normalizedAnswer = Array.isArray(answer) 
      ? answer.map(a => String(a)) 
      : answer;
    
    setSelectedAnswer(normalizedAnswer);
    if (onAnswer) {
      onAnswer(normalizedAnswer);
    }
  };

  const isCorrect = () => {
    if (question.type === "multiple-select") {
      const correctAnswers = question.correctAnswer as string[];
      const userAnswers = selectedAnswer as string[];
      return (
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((ans) => userAnswers.includes(ans))
      );
    }
    return selectedAnswer === question.correctAnswer;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p="6"
      bg="white"
      _dark={{ bg: "gray.800" }}
    >
      <VStack align="stretch" spacing="4">
        {/* Question Header */}
        <HStack justify="space-between" align="start">
          <HStack spacing="3" flex="1">
            <Badge colorScheme="blue" fontSize="md" px="3" py="1">
              Q{questionNumber}
            </Badge>
            <Text fontSize="lg" fontWeight="semibold" flex="1">
              {question.question}
            </Text>
          </HStack>
          {showExplanation && (
            <Badge colorScheme={isCorrect() ? "green" : "red"} fontSize="sm">
              {isCorrect() ? "Correct" : "Incorrect"}
            </Badge>
          )}
        </HStack>

        {/* Options */}
        {question.type === "multiple-select" ? (
          <CheckboxGroup
            value={selectedAnswer as string[]}
            onChange={handleAnswer}
          >
            <VStack align="stretch" spacing="3">
              {question.options.map((option, index) => (
                <Checkbox
                  key={index}
                  value={option}
                  isDisabled={showExplanation}
                  colorScheme="blue"
                  p="3"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _dark={{ borderColor: "gray.600" }}
                  _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                >
                  {option}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        ) : (
          <RadioGroup
            value={selectedAnswer as string}
            onChange={handleAnswer}
          >
            <VStack align="stretch" spacing="3">
              {question.options.map((option, index) => (
                <Radio
                  key={index}
                  value={option}
                  isDisabled={showExplanation}
                  colorScheme="blue"
                  p="3"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _dark={{ borderColor: "gray.600" }}
                  _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                >
                  {option}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        )}

        {/* Explanation (shown after submission) */}
        {showExplanation && question.explanation && (
          <Box
            bg={isCorrect() ? "green.50" : "red.50"}
            _dark={{ bg: isCorrect() ? "green.900" : "red.900" }}
            p="4"
            borderRadius="md"
            borderLeft="4px solid"
            borderColor={isCorrect() ? "green.500" : "red.500"}
          >
            <Text fontWeight="semibold" mb="2" color={isCorrect() ? "green.700" : "red.700"} _dark={{ color: isCorrect() ? "green.300" : "red.300" }}>
              {isCorrect() ? "Correct!" : "Incorrect"}
            </Text>
            <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
              {question.explanation}
            </Text>
            {!isCorrect() && (
              <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} mt="2">
                <strong>Correct answer:</strong>{" "}
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(", ")
                  : question.correctAnswer}
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
}
