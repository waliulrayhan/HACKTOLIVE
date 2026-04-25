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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { CourseModule } from "@/types/academy";
import { FaPlayCircle, FaFileAlt, FaQuestionCircle, FaFileUpload, FaClock, FaLock, FaBook, FaPlay } from "react-icons/fa";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { normalizeMarkdownForRender } from "@/lib/markdown-utils";

interface CurriculumAccordionProps {
  modules: CourseModule[];
  isEnrolled?: boolean;
  showLockedModules?: boolean;
}

export default function CurriculumAccordion({ modules, isEnrolled = false, showLockedModules = false }: CurriculumAccordionProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([0]);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show fallback UI if no modules are available
  if (!modules || modules.length === 0) {
    return (
      <Box
        p="8"
        textAlign="center"
        borderWidth="1px"
        borderRadius="xl"
        borderColor="gray.200"
        bg="gray.50"
        _dark={{ borderColor: "gray.700", bg: "gray.800" }}
      >
        <VStack spacing="4">
          <Icon as={FaBook} boxSize="12" color="gray.400" />
          <VStack spacing="2">
            <Text fontSize="lg" fontWeight="semibold" color="gray.700" _dark={{ color: "gray.300" }}>
              Curriculum Coming Soon
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} maxW="md">
              We're currently preparing the detailed curriculum for this course. Check back soon or contact us for more information.
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

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

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const isYouTubeUrl = (url: string) => {
    if (!url) return false;
    return /(?:youtube\.com|youtu\.be)/.test(url);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  return (
    <>
      <Accordion
      allowMultiple
      index={expandedIndexes}
      onChange={(indexes) => setExpandedIndexes(indexes as number[])}
    >
      {modules.map((module, moduleIndex) => {
        const totalDuration = module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
        // Count preview lessons: individual preview lessons OR all lessons if module has marketing visibility and not enrolled
        const previewLessons = isEnrolled 
          ? 0 
          : module.lessons.filter((l) => l.isPreview || module.isVisibleForMarketing).length;

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
                      {module.isVisibleForMarketing && !isEnrolled && (
                        <Badge colorScheme="green" fontSize="xs">
                          Free Preview
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} whiteSpace="pre-wrap">
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
                  // Lesson is accessible if: enrolled, lesson has preview enabled, or module has marketing preview enabled
                  const canAccess = isEnrolled || lesson.isPreview || module.isVisibleForMarketing;
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
                      onClick={() => canAccess && handleLessonClick(lesson)}
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
                              whiteSpace="pre-wrap"
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

    {/* Lesson Content Modal */}
    <Modal isOpen={isModalOpen} onClose={closeModal} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="95vh" overflowY="auto" bg="white" _dark={{ bg: "gray.900" }}>
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }}>
          <VStack align="start" spacing="2">
            <Text fontSize="lg" fontWeight="bold">
              {selectedLesson?.title}
            </Text>
            <Badge colorScheme={getLessonTypeColor(selectedLesson?.type) as any} fontSize="xs">
              {selectedLesson?.type === "VIDEO"
                ? "Video"
                : selectedLesson?.type === "ARTICLE"
                ? "Article"
                : selectedLesson?.type === "QUIZ"
                ? "Quiz"
                : "Assignment"}
            </Badge>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="8" pt="6">
          <VStack spacing="8" align="stretch">
            {/* Video Lesson - YouTube or HTML5 */}
            {selectedLesson?.type === "VIDEO" && selectedLesson?.videoUrl && (
              <Box>
                <Box
                  bg="black"
                  borderRadius="lg"
                  overflow="hidden"
                  w="100%"
                  aspectRatio="16/9"
                >
                  {isYouTubeUrl(selectedLesson.videoUrl) ? (
                    // YouTube Video
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedLesson.videoUrl)}?modestbranding=1`}
                      title={selectedLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    // HTML5 Video
                    <video
                      width="100%"
                      height="100%"
                      controls
                      controlsList="nodownload"
                      style={{ width: "100%", height: "100%" }}
                    >
                      <source src={selectedLesson.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </Box>
              </Box>
            )}

            {/* Article Lesson - Markdown Preview */}
            {selectedLesson?.type === "ARTICLE" && selectedLesson?.articleContent && (
              <Box w="100%">
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  bg="gray.50"
                  _dark={{ bg: "gray.800" }}
                  p="6"
                  className="lesson-article-markdown-wrapper"
                >
                  <MarkdownPreview
                    source={normalizeMarkdownForRender(selectedLesson.articleContent)}
                    wrapperElement={{ "data-color-mode": "dark" }}
                    className="lesson-article-markdown"
                  />
                </Box>
              </Box>
            )}

            {/* Lesson Description */}
            {selectedLesson?.description && selectedLesson?.type !== "ARTICLE" && (
              <Box p="4" borderRadius="lg" bg="blue.50" _dark={{ bg: "blue.900/20" }} border="1px solid" borderColor="blue.200" _dark={{ borderColor: "blue.700" }}>
                <Text fontWeight="semibold" mb="2" fontSize="sm">
                  About This Lesson
                </Text>
                <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }} whiteSpace="pre-wrap">
                  {selectedLesson.description}
                </Text>
              </Box>
            )}

            {/* Lesson Duration */}
            {/* <HStack spacing="4" p="4" borderRadius="lg" bg="gray.50" _dark={{ bg: "gray.800" }}>
              <Icon as={FaClock} color="gray.500" boxSize="5" />
              <VStack align="start" spacing="0">
                <Text fontSize="xs" color="gray.500">
                  Duration
                </Text>
                <Text fontWeight="semibold">
                  {selectedLesson?.duration} minutes
                </Text>
              </VStack>
            </HStack> */}

            {/* Quiz Placeholder */}
            {selectedLesson?.type === "QUIZ" && (
              <Box p="6" borderRadius="lg" bg="purple.50" _dark={{ bg: "purple.900/20" }} border="2px dashed" borderColor="purple.200" _dark={{ borderColor: "purple.700" }}>
                <VStack spacing="3">
                  <Icon as={FaQuestionCircle} boxSize="8" color="purple.500" />
                  <VStack spacing="1" textAlign="center">
                    <Text fontWeight="semibold" color="purple.900" _dark={{ color: "purple.100" }}>
                      Interactive Quiz
                    </Text>
                    <Text fontSize="sm" color="purple.700" _dark={{ color: "purple.300" }}>
                      To take this quiz, please enroll in the course
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Assignment Placeholder */}
            {selectedLesson?.type === "ASSIGNMENT" && (
              <Box p="6" borderRadius="lg" bg="orange.50" _dark={{ bg: "orange.900/20" }} border="2px dashed" borderColor="orange.200" _dark={{ borderColor: "orange.700" }}>
                <VStack spacing="3">
                  <Icon as={FaFileUpload} boxSize="8" color="orange.500" />
                  <VStack spacing="1" textAlign="center">
                    <Text fontWeight="semibold" color="orange.900" _dark={{ color: "orange.100" }}>
                      Assignment
                    </Text>
                    <Text fontSize="sm" color="orange.700" _dark={{ color: "orange.300" }}>
                      To submit this assignment, please enroll in the course
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}

            {/* Close Button */}
            {/* <Button onClick={closeModal} colorScheme="primary" w="100%" size="lg">
              Close
            </Button> */}
          </VStack>

          <style jsx global>{`
            .lesson-article-markdown-wrapper {
              overflow-x: auto;
            }

            .lesson-article-markdown,
            .lesson-article-markdown.wmde-markdown {
              background: transparent !important;
              color: #374151 !important;
              box-shadow: none !important;
              font-size: 16px;
              line-height: 1.6;
              --color-canvas-default: transparent;
              --color-fg-default: #374151;
              --color-canvas-subtle: rgba(148, 163, 184, 0.08);
              --color-border-default: rgba(148, 163, 184, 0.25);
            }

            .dark .lesson-article-markdown,
            .dark .lesson-article-markdown.wmde-markdown {
              color: #d1d5db !important;
              --color-fg-default: #d1d5db;
              --color-canvas-subtle: rgba(148, 163, 184, 0.12);
              --color-border-default: rgba(148, 163, 184, 0.32);
            }

            /* Better markdown heading styling */
            .lesson-article-markdown h1,
            .lesson-article-markdown h2,
            .lesson-article-markdown h3,
            .lesson-article-markdown h4,
            .lesson-article-markdown h5,
            .lesson-article-markdown h6 {
              margin: 1.5em 0 0.5em 0 !important;
              font-weight: 700 !important;
            }

            .lesson-article-markdown p {
              margin: 0.75em 0 !important;
            }

            .lesson-article-markdown code {
              background: rgba(0, 0, 0, 0.1) !important;
              padding: 0.2em 0.4em !important;
              border-radius: 3px !important;
              font-family: "Monaco", "Courier New", monospace !important;
            }

            .dark .lesson-article-markdown code {
              background: rgba(255, 255, 255, 0.1) !important;
            }

            .lesson-article-markdown pre {
              background: #1f2937 !important;
              color: #f3f4f6 !important;
              padding: 1em !important;
              border-radius: 6px !important;
              overflow-x: auto !important;
            }

            .dark .lesson-article-markdown pre {
              background: #111827 !important;
            }

            .lesson-article-markdown blockquote {
              border-left: 4px solid #3b82f6 !important;
              padding-left: 1em !important;
              margin: 1em 0 !important;
              color: #666 !important;
            }

            .dark .lesson-article-markdown blockquote {
              color: #999 !important;
            }

            .lesson-article-markdown ul,
            .lesson-article-markdown ol {
              margin: 1em 0 !important;
              padding-left: 2em !important;
            }

            .lesson-article-markdown li {
              margin: 0.5em 0 !important;
            }

            .lesson-article-markdown img {
              max-width: 100% !important;
              height: auto !important;
              border-radius: 6px !important;
              margin: 1em 0 !important;
            }

            .lesson-article-markdown table {
              border-collapse: collapse !important;
              width: 100% !important;
              margin: 1em 0 !important;
            }

            .lesson-article-markdown table th,
            .lesson-article-markdown table td {
              border: 1px solid #ddd !important;
              padding: 0.75em !important;
              text-align: left !important;
            }

            .dark .lesson-article-markdown table th,
            .dark .lesson-article-markdown table td {
              border-color: #444 !important;
            }

            .lesson-article-markdown table tr:nth-child(even) {
              background: rgba(0, 0, 0, 0.05) !important;
            }

            .dark .lesson-article-markdown table tr:nth-child(even) {
              background: rgba(255, 255, 255, 0.05) !important;
            }

            .lesson-article-markdown a {
              color: #3b82f6 !important;
              text-decoration: none !important;
            }

            .lesson-article-markdown a:hover {
              text-decoration: underline !important;
            }
          `}</style>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
}
