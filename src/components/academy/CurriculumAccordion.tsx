"use client";

import { useState } from "react";
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  VStack,
  Text,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { CourseModule } from "@/types/academy";
import { FaPlayCircle, FaFileAlt, FaQuestionCircle, FaFileUpload, FaClock, FaLock } from "react-icons/fa";

interface CurriculumAccordionProps {
  modules: CourseModule[];
  isEnrolled?: boolean;
}

export default function CurriculumAccordion({ modules, isEnrolled = false }: CurriculumAccordionProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([0]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return FaPlayCircle;
      case "article":
        return FaFileAlt;
      case "quiz":
        return FaQuestionCircle;
      case "assignment":
        return FaFileUpload;
      default:
        return FaFileAlt;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "blue";
      case "article":
        return "green";
      case "quiz":
        return "purple";
      case "assignment":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Accordion
      allowMultiple
      index={expandedIndexes}
      onChange={(indexes) => setExpandedIndexes(indexes as number[])}
    >
      {modules.map((module, moduleIndex) => {
        const totalDuration = module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        const previewLessons = module.lessons.filter((l) => l.isPreview).length;

        return (
          <AccordionItem key={module.id} border="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} mb="2" borderRadius="md">
            <AccordionButton
              _hover={{ bg: "gray.50", _dark: { bg: "gray.800" } }}
              p="4"
              borderRadius="md"
            >
              <Box flex="1" textAlign="left">
                <HStack justify="space-between" align="start" spacing="4">
                  <VStack align="start" spacing="1" flex="1">
                    <HStack>
                      <Badge colorScheme="blue" fontSize="xs">
                        Module {module.order}
                      </Badge>
                      <Text fontWeight="bold" fontSize="md">
                        {module.title}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                      {module.description}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing="0" minW="120px">
                    <Text fontSize="xs" color="gray.500">
                      {module.lessons.length} lessons
                    </Text>
                    <HStack spacing="1" fontSize="xs" color="gray.500">
                      <FaClock />
                      <Text>{totalDuration} min</Text>
                    </HStack>
                    {previewLessons > 0 && (
                      <Text fontSize="xs" color="green.600" _dark={{ color: "green.400" }}>
                        {previewLessons} preview
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
              <AccordionIcon ml="2" />
            </AccordionButton>
            <AccordionPanel pb="4" px="4">
              <VStack align="stretch" spacing="2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const canAccess = isEnrolled || lesson.isPreview;
                  const LessonIcon = getLessonIcon(lesson.type);

                  return (
                    <HStack
                      key={lesson.id}
                      p="3"
                      borderRadius="md"
                      bg={canAccess ? "gray.50" : "gray.100"}
                      _dark={{
                        bg: canAccess ? "gray.700" : "gray.800",
                      }}
                      justify="space-between"
                      opacity={canAccess ? 1 : 0.6}
                      cursor={canAccess ? "pointer" : "not-allowed"}
                      _hover={
                        canAccess
                          ? { bg: "blue.50", _dark: { bg: "gray.600" } }
                          : undefined
                      }
                      transition="all 0.2s"
                    >
                      <HStack spacing="3" flex="1">
                        <Icon
                          as={LessonIcon}
                          color={`${getLessonTypeColor(lesson.type)}.500`}
                          boxSize="18px"
                        />
                        <VStack align="start" spacing="0" flex="1">
                          <HStack>
                            <Text fontSize="sm" fontWeight="medium">
                              {lessonIndex + 1}. {lesson.title}
                            </Text>
                            {lesson.isPreview && (
                              <Badge colorScheme="green" fontSize="xs">
                                Preview
                              </Badge>
                            )}
                          </HStack>
                          {lesson.description && (
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              _dark={{ color: "gray.400" }}
                              noOfLines={1}
                            >
                              {lesson.description}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                      <HStack spacing="3">
                        <HStack spacing="1" fontSize="xs" color="gray.500">
                          <FaClock />
                          <Text>{lesson.duration} min</Text>
                        </HStack>
                        {!canAccess && <Icon as={FaLock} color="gray.400" boxSize="14px" />}
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
