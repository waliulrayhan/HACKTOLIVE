"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Avatar,
  Progress,
  Button,
  Spinner,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { Em } from "@/components/shared/typography";
import {
  FiClock,
  FiUsers,
  FiStar,
  FiBook,
  FiCheckCircle,
  FiPlay,
  FiAward,
  FiTrendingUp,
  FiBarChart2,
  FiVideo,
  FiCalendar,
} from "react-icons/fi";
import CurriculumAccordion from "@/components/academy/CurriculumAccordion";
import ReviewCard from "@/components/academy/ReviewCard";
import InstructorCard from "@/components/academy/InstructorCard";
import RatingStars from "@/components/academy/RatingStars";
import { Course, Review } from "@/types/academy";
import academyService from "@/lib/academy-service";

interface CourseDetailsPageProps {
  slug: string;
}

export default function CourseDetailsPage({ slug }: CourseDetailsPageProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const courseData = await academyService.getCourseBySlug(slug);
        setCourse(courseData);

        if (courseData) {
          const reviews = await academyService.getCourseReviews(courseData.id);
          setCourseReviews(reviews);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  const scrollToCurriculum = () => {
    const element = document.getElementById("curriculum-tab");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Trigger tab change by clicking the curriculum tab
      const curriculumTabButton = document.querySelector('[aria-label="Curriculum"]') as HTMLElement;
      if (curriculumTabButton) curriculumTabButton.click();
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py="20">
        <Center>
          <VStack spacing="4">
            <Spinner size="xl" color="primary.500" thickness="4px" />
            <Text color="muted">Loading course details...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxW="container.xl" py="20">
        <VStack spacing="4">
          <Heading>Course Not Found</Heading>
          <Text color="muted">The course you're looking for doesn't exist.</Text>
          <ButtonLink href="/academy/courses" colorScheme="primary">
            Browse All Courses
          </ButtonLink>
        </VStack>
      </Container>
    );
  }

  const levelColors = {
    fundamental: "green",
    intermediate: "blue",
    advanced: "purple",
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        as="section"
        id="course-hero"
        mt={{ base: "14", md: "16" }}
        py={{ base: "8", md: "16" }}
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        sx={{ scrollMarginTop: "var(--navbar-height, 80px)" }}
      >
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: "column", lg: "row" }} 
            gap={{ base: "6", md: "12" }} 
            alignItems="center"
          >
            {/* Image - Shows first on mobile */}
            <Box 
              width="100%"
              maxW={{ base: "100%", lg: "500px" }}
              order={{ base: -1, lg: 1 }}
              flex={{ lg: "0 0 auto" }}
            >
              <FallInPlace delay={0.1}>
                <Box 
                  borderRadius={{ base: "xl", md: "2xl" }}
                  overflow="hidden"
                  boxShadow="lg"
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                >
                  <Image
                    src={course.thumbnail || '/images/placeholder-course.jpg'}
                    alt={course.title}
                    width={500}
                    height={340}
                    style={{ 
                      width: "100%", 
                      height: "auto",
                      display: "block"
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-course.jpg';
                    }}
                  />
                </Box>
              </FallInPlace>
            </Box>

            {/* Content - Shows second on mobile */}
            <Box width="100%" flex="1" order={{ base: 0, lg: 0 }}>
              <FallInPlace>
                <VStack align="start" spacing={{ base: "4", md: "6" }} width="100%">
                <HStack spacing="2" flexWrap="wrap" gap="2">
                  <Badge colorScheme={levelColors[course.level]} fontSize="xs" px="2" py="1" borderRadius="md">
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                  <Badge 
                    colorScheme={course.tier === "premium" ? "purple" : "green"} 
                    fontSize="xs" 
                    px="2" 
                    py="1" 
                    borderRadius="md"
                  >
                    {course.tier.toUpperCase()}
                  </Badge>
                  {course.deliveryMode === "live" && (
                    <Badge colorScheme="red" fontSize="xs" px="2" py="1" borderRadius="md">
                      🔴 LIVE
                    </Badge>
                  )}
                  <Badge colorScheme="cyan" fontSize="xs" px="2" py="1" borderRadius="md">
                    {course.category}
                  </Badge>
                </HStack>

                <Heading 
                  fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "3xl" }}
                  lineHeight="shorter"
                >
                  {course.title}
                </Heading>

                <Text 
                  fontSize={{ base: "sm", md: "md", lg: "lg" }} 
                  color="muted"
                  lineHeight="tall"
                >
                  {course.shortDescription}
                </Text>

                <Flex 
                  direction={{ base: "column", sm: "row" }} 
                  gap={{ base: "3", sm: "6" }}
                  flexWrap="wrap"
                  width="100%"
                >
                  <HStack spacing="2">
                    <Icon as={FiStar} color="yellow.500" boxSize={{ base: "4", md: "5" }} />
                    <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>{course.rating}</Text>
                    <Text color="muted" fontSize={{ base: "xs", md: "sm" }}>
                      ({course.totalRatings.toLocaleString()})
                    </Text>
                  </HStack>
                  <HStack spacing="2">
                    <Icon as={FiUsers} color="primary.500" boxSize={{ base: "4", md: "5" }} />
                    <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                      {course.totalStudents.toLocaleString()} students
                    </Text>
                  </HStack>
                </Flex>

                <Flex 
                  direction={{ base: "column", sm: "row" }} 
                  gap="3" 
                  pt="2"
                  width="100%"
                >
                  <ButtonLink 
                    href={`/academy/enroll/${course.slug}`} 
                    colorScheme="primary" 
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", sm: "auto" }}
                  >
                    {course.tier === "premium" ? `Enroll Now - ₹${course.price}` : "Start Free Course"}
                  </ButtonLink>
                  <Button 
                    onClick={scrollToCurriculum} 
                    variant="outline" 
                    colorScheme="primary" 
                    size={{ base: "md", md: "lg" }}
                    width={{ base: "100%", sm: "auto" }}
                  >
                    View Curriculum
                  </Button>
                </Flex>
                </VStack>
              </FallInPlace>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box py="8" bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing="6">
            <FallInPlace delay={0.1}>
              <VStack spacing="2">
                <Flex
                  width="60px"
                  height="60px"
                  borderRadius="xl"
                  bg="green.100"
                  _dark={{ bg: "green.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiClock} boxSize="6" color="green.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold">
                  {Math.floor(course.duration / 60)}h {course.duration % 60}m
                </Text>
                <Text fontSize="sm" color="muted">
                  Total Duration
                </Text>
              </VStack>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <VStack spacing="2">
                <Flex
                  width="60px"
                  height="60px"
                  borderRadius="xl"
                  bg="blue.100"
                  _dark={{ bg: "blue.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiBook} boxSize="6" color="blue.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold">
                  {course.totalLessons}
                </Text>
                <Text fontSize="sm" color="muted">
                  Lessons
                </Text>
              </VStack>
            </FallInPlace>

            <FallInPlace delay={0.3}>
              <VStack spacing="2">
                <Flex
                  width="60px"
                  height="60px"
                  borderRadius="xl"
                  bg="purple.100"
                  _dark={{ bg: "purple.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiBarChart2} boxSize="6" color="purple.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold">
                  {course.totalModules}
                </Text>
                <Text fontSize="sm" color="muted">
                  Modules
                </Text>
              </VStack>
            </FallInPlace>

            <FallInPlace delay={0.4}>
              <VStack spacing="2">
                <Flex
                  width="60px"
                  height="60px"
                  borderRadius="xl"
                  bg="orange.100"
                  _dark={{ bg: "orange.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiAward} boxSize="6" color="orange.500" />
                </Flex>
                <Text fontSize="xl" fontWeight="bold">
                  Certificate
                </Text>
                <Text fontSize="sm" color="muted">
                  On Completion
                </Text>
              </VStack>
            </FallInPlace>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={{ base: "16", md: "24" }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "12", lg: "16" }}>
            {/* Left Column - Course Info */}
            <Box gridColumn={{ lg: "span 2" }}>
              <Tabs id="curriculum-tab" colorScheme="primary" variant="enclosed">
                <TabList 
                  overflowX="auto"
                  overflowY="hidden"
                  sx={{
                    scrollbarWidth: 'none',
                    '::-webkit-scrollbar': { display: 'none' },
                    display: 'flex',
                    flexWrap: 'nowrap',
                  }}
                  borderBottom="1px"
                  borderColor={borderColor}
                >
                  <Tab flexShrink={0} fontSize={{ base: "sm", md: "md" }}>Overview</Tab>
                  <Tab flexShrink={0} fontSize={{ base: "sm", md: "md" }} aria-label="Curriculum">Curriculum</Tab>
                  <Tab flexShrink={0} fontSize={{ base: "sm", md: "md" }}>Reviews</Tab>
                  <Tab flexShrink={0} fontSize={{ base: "sm", md: "md" }}>FAQ</Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel px="0" py="8">
                    <VStack spacing="8" align="stretch">
                      <FallInPlace>
                        <Box>
                          <Heading size="lg" mb="4">
                            About This Course
                          </Heading>
                          <Text color="muted" lineHeight="tall">
                            {course.description}
                          </Text>
                        </Box>
                      </FallInPlace>

                      <FallInPlace delay={0.1}>
                        <Box>
                          <Heading size="lg" mb="4">
                            What You'll Learn
                          </Heading>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="3">
                            {course.learningOutcomes.map((outcome, index) => (
                              <HStack key={index} align="start" spacing="3">
                                <Icon as={FiCheckCircle} color="green.500" mt="1" flexShrink={0} />
                                <Text color="muted">{outcome}</Text>
                              </HStack>
                            ))}
                          </SimpleGrid>
                        </Box>
                      </FallInPlace>

                      <FallInPlace delay={0.2}>
                        <Box>
                          <Heading size="lg" mb="4">
                            Requirements
                          </Heading>
                          <List spacing="2">
                            {course.requirements.map((req, index) => (
                              <ListItem key={index} color="muted">
                                <ListIcon as={FiCheckCircle} color="primary.500" />
                                {req}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </FallInPlace>
                    </VStack>
                  </TabPanel>

                  {/* Curriculum Tab */}
                  <TabPanel px="0" py="8">
                    <FallInPlace>
                      {course.modules && course.modules.length > 0 ? (
                        <CurriculumAccordion modules={course.modules} />
                      ) : (
                        <Box
                          p="12"
                          textAlign="center"
                          borderWidth="2px"
                          borderRadius="2xl"
                          borderColor="primary.200"
                          bg="primary.50"
                          _dark={{ borderColor: "primary.700", bg: "primary.900/20" }}
                          borderStyle="dashed"
                        >
                          <VStack spacing="6">
                            <Flex
                              width="80px"
                              height="80px"
                              borderRadius="full"
                              bg="primary.100"
                              _dark={{ bg: "primary.200" }}
                              align="center"
                              justify="center"
                            >
                              <Icon as={FiBook} boxSize="10" color="primary.600" />
                            </Flex>
                            <VStack spacing="3">
                              <Heading size="md" color="primary.700" _dark={{ color: "primary.700" }}>
                                Curriculum Under Development
                              </Heading>
                              <Text fontSize="md" color="gray.500" maxW="lg" lineHeight="tall">
                                We're working hard to create comprehensive course content for you. 
                                The detailed curriculum with lessons, quizzes, and hands-on labs will be available soon.
                              </Text>
                            </VStack>
                            <HStack spacing="4" pt="2">
                              <ButtonLink href={`/academy/enroll/${course.slug}`} colorScheme="primary" size="md">
                                Enroll & Get Notified
                              </ButtonLink>
                              <ButtonLink href="/contact" variant="outline" colorScheme="primary" size="md" color="primary.600" _dark={{ color: "primary.600" }}>
                                Contact Us
                              </ButtonLink>
                            </HStack>
                          </VStack>
                        </Box>
                      )}
                    </FallInPlace>
                  </TabPanel>

                  {/* Reviews Tab */}
                  <TabPanel px="0" py="8">
                    <VStack spacing="8" align="stretch">
                      <FallInPlace>
                        <HStack spacing="8" p="6" bg={bgColor} borderRadius="2xl" borderWidth="1px">
                          <VStack>
                            <Text fontSize="5xl" fontWeight="bold" color="primary.500">
                              {course.rating}
                            </Text>
                            <RatingStars rating={course.rating} size="20px" />
                            <Text fontSize="sm" color="muted">
                              {course.totalRatings.toLocaleString()} ratings
                            </Text>
                          </VStack>
                          <VStack align="stretch" flex="1" spacing="2">
                            {[5, 4, 3, 2, 1].map((stars) => {
                              const percentage = Math.floor(Math.random() * 100);
                              return (
                                <HStack key={stars} spacing="3">
                                  <HStack spacing="1" w="60px">
                                    <Text fontSize="sm">{stars}</Text>
                                    <Icon as={FiStar} boxSize="3" color="yellow.500" />
                                  </HStack>
                                  <Progress
                                    value={percentage}
                                    colorScheme="primary"
                                    flex="1"
                                    borderRadius="full"
                                    size="sm"
                                  />
                                  <Text fontSize="sm" color="muted" w="40px">
                                    {percentage}%
                                  </Text>
                                </HStack>
                              );
                            })}
                          </VStack>
                        </HStack>
                      </FallInPlace>

                      <VStack spacing="6" align="stretch">
                        {courseReviews.map((review, index) => (
                          <FallInPlace key={review.id} delay={0.05 * index}>
                            <ReviewCard review={review} />
                          </FallInPlace>
                        ))}
                      </VStack>
                    </VStack>
                  </TabPanel>

                  {/* FAQ Tab */}
                  <TabPanel px="0" py="8">
                    <VStack spacing="6" align="stretch">
                      <FallInPlace>
                        <Heading size="lg" mb="4">
                          Frequently Asked Questions
                        </Heading>
                      </FallInPlace>

                      {[
                        {
                          question: "What is the duration of this course?",
                          answer: `This course includes ${Math.floor(course.duration / 60)} hours and ${course.duration % 60} minutes of video content, plus additional time for hands-on labs and practice exercises.`
                        },
                        {
                          question: "Do I get a certificate upon completion?",
                          answer: "Yes! Upon successful completion of all modules and assessments, you'll receive an industry-recognized certificate that you can share on LinkedIn and include in your resume."
                        },
                        {
                          question: "Is this course suitable for beginners?",
                          answer: course.level === "fundamental" 
                            ? "Yes, this course is designed for complete beginners with no prior experience required."
                            : `This is a${course.level === "advanced" ? "n advanced" : "n intermediate"} course. We recommend having some foundational knowledge before enrolling. Check the requirements section for details.`
                        },
                        {
                          question: "What format is the course content?",
                          answer: course.deliveryMode === "live"
                            ? `This course features live interactive classes scheduled for ${course.liveSchedule}. All sessions are recorded so you can review them later.`
                            : "This course is delivered through pre-recorded video lessons that you can access anytime. Learn at your own pace with lifetime access."
                        },
                        {
                          question: "Do I get lifetime access to the course?",
                          answer: "Yes! Once enrolled, you have lifetime access to all course materials, including any future updates and additions."
                        },
                        {
                          question: "What if I need help or have questions?",
                          answer: "You'll have access to our community forum where you can ask questions and get support from both instructors and fellow students. Premium courses also include direct instructor Q&A sessions."
                        },
                        {
                          question: "Can I get a refund if I'm not satisfied?",
                          answer: "We offer a 30-day money-back guarantee. If you're not satisfied with the course for any reason, contact us within 30 days for a full refund."
                        }
                      ].map((faq, index) => (
                        <FallInPlace key={index} delay={0.05 * index}>
                          <Box
                            p="6"
                            bg={bgColor}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <VStack align="start" spacing="3">
                              <Heading size="sm">{faq.question}</Heading>
                              <Text color="muted" fontSize="sm" lineHeight="tall">
                                {faq.answer}
                              </Text>
                            </VStack>
                          </Box>
                        </FallInPlace>
                      ))}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {/* Right Column - Instructor & Sidebar */}
            <VStack spacing="8" align="stretch">
              {/* Live Class Info (if applicable) */}
              {course.deliveryMode === "live" && course.liveSchedule && (
                <FallInPlace delay={0.3}>
                  <Box p="6" bg="red.50" _dark={{ bg: "red.900" }} borderRadius="2xl" borderWidth="2px" borderColor="red.500">
                    <VStack spacing="4" align="stretch">
                      <HStack spacing="2">
                        <Icon as={FiVideo} color="red.500" boxSize="5" />
                        <Heading size="md" color="red.600" _dark={{ color: "red.400" }}>
                          Live Classes
                        </Heading>
                      </HStack>
                      
                      <VStack spacing="3" align="start" fontSize="sm">
                        <HStack>
                          <Icon as={FiCalendar} color="red.500" />
                          <Text fontWeight="semibold">Schedule:</Text>
                          <Text>{course.liveSchedule}</Text>
                        </HStack>
                        
                        {course.startDate && (
                          <HStack>
                            <Icon as={FiClock} color="red.500" />
                            <Text fontWeight="semibold">Starts:</Text>
                            <Text>{new Date(course.startDate).toLocaleDateString()}</Text>
                          </HStack>
                        )}
                        
                        {course.maxStudents && course.enrolledStudents !== undefined && (
                          <Box w="full">
                            <HStack justify="space-between" mb="2">
                              <Text fontWeight="semibold">Enrollment:</Text>
                              <Text>
                                {course.enrolledStudents}/{course.maxStudents}
                              </Text>
                            </HStack>
                            <Progress 
                              value={(course.enrolledStudents / course.maxStudents) * 100} 
                              colorScheme="red" 
                              borderRadius="full"
                              size="sm"
                            />
                            {course.enrolledStudents >= course.maxStudents && (
                              <Badge colorScheme="red" mt="2" fontSize="xs">
                                FULLY BOOKED
                              </Badge>
                            )}
                          </Box>
                        )}
                      </VStack>
                    </VStack>
                  </Box>
                </FallInPlace>
              )}

              <FallInPlace delay={0.4}>
                <Box>
                  <Heading size="md" mb="6">
                    Your Instructor
                  </Heading>
                  <InstructorCard instructor={course.instructor} showFullBio />
                </Box>
              </FallInPlace>

              <FallInPlace delay={0.5}>
                <Box p="6" bg={bgColor} borderRadius="2xl" borderWidth="1px">
                  <VStack spacing="4" align="stretch">
                    <Heading size="md">Course Includes</Heading>
                    <VStack spacing="3" align="start">
                      <HStack>
                        <Icon as={FiPlay} color="primary.500" />
                        <Text fontSize="sm">
                          {course.totalLessons} on-demand video lessons
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiBook} color="primary.500" />
                        <Text fontSize="sm">Downloadable resources</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiTrendingUp} color="primary.500" />
                        <Text fontSize="sm">Hands-on labs & exercises</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiAward} color="primary.500" />
                        <Text fontSize="sm">Certificate of completion</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiUsers} color="primary.500" />
                        <Text fontSize="sm">Access to community</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </FallInPlace>

              <FallInPlace delay={0.5}>
                <Box p="6" bg="primary.50" _dark={{ bg: "primary.900/20" }} borderRadius="2xl">
                  <VStack spacing="4">
                    <Icon as={FiAward} boxSize="12" color="primary.600" />
                    <VStack spacing="2">
                      <Heading size="sm" textAlign="center" color="primary.600" _dark={{ color: "primary.600" }}>
                        Get Certified
                      </Heading>
                      <Text fontSize="sm" textAlign="center" color="gray.600" _dark={{ color: "gray.700" }}>
                        Earn a verified certificate upon completion to showcase your skills
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </FallInPlace>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
