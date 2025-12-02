"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import Image from "next/image";
import { Course } from "@/types/academy";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import {
  FiCheckCircle,
  FiClock,
  FiBook,
  FiAward,
  FiUsers,
  FiStar,
  FiVideo,
  FiCalendar,
} from "react-icons/fi";
import { useState } from "react";

interface EnrollmentPageProps {
  course: Course;
}

export default function EnrollmentPage({ course }: EnrollmentPageProps) {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle enrollment submission
    console.log("Enrollment data:", formData);
    alert("Enrollment request submitted! We'll contact you shortly.");
  };

  return (
    <Box>
      {/* Header */}
      <Box py={{ base: "12", md: "16" }} bg={bgColor} borderBottomWidth="1px">
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing="4" align="start">
              <ButtonLink href={`/academy/courses/${course.slug}`} variant="link" colorScheme="primary">
                ← Back to Course
              </ButtonLink>
              <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                Enrollment
              </Badge>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                Enroll in {course.title}
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="muted">
                Complete the form below to enroll in this course
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={{ base: "12", md: "20" }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "8", lg: "12" }}>
            {/* Enrollment Form */}
            <Box gridColumn={{ lg: "span 2" }}>
              <FallInPlace>
                <Box bg={cardBg} p={{ base: "6", md: "8" }} borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="6" align="stretch">
                    <Heading size="lg">Enrollment Details</Heading>
                    
                    <form onSubmit={handleSubmit}>
                      <VStack spacing="4" align="stretch">
                        <FormControl isRequired>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Phone Number</FormLabel>
                          <Input
                            type="tel"
                            placeholder="+880 1XXX-XXXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Message (Optional)</FormLabel>
                          <Textarea
                            placeholder="Any questions or special requirements?"
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          />
                        </FormControl>

                        <Divider />

                        <FormControl isRequired>
                          <Checkbox
                            isChecked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                          >
                            I agree to the{" "}
                            <Text as="span" color="primary.500" textDecoration="underline">
                              terms and conditions
                            </Text>
                          </Checkbox>
                        </FormControl>

                        <Button
                          type="submit"
                          colorScheme="primary"
                          size="lg"
                          width="full"
                          isDisabled={!formData.agreeToTerms || !formData.name || !formData.email || !formData.phone}
                        >
                          Complete Enrollment - ₹{course.price === 0 ? "Free" : course.price}
                        </Button>
                      </VStack>
                    </form>
                  </VStack>
                </Box>
              </FallInPlace>
            </Box>

            {/* Course Summary Sidebar */}
            <VStack spacing="6" align="stretch">
              {/* Course Card */}
              <FallInPlace delay={0.2}>
                <Box bg={cardBg} borderRadius="2xl" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={400}
                    height={250}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <VStack p="6" spacing="4" align="stretch">
                    <Heading size="md">{course.title}</Heading>
                    
                    <HStack spacing="4" fontSize="sm" color="muted">
                      <HStack spacing="1">
                        <Icon as={FiStar} color="yellow.500" />
                        <Text fontWeight="semibold">{course.rating}</Text>
                      </HStack>
                      <HStack spacing="1">
                        <Icon as={FiUsers} />
                        <Text>{course.totalStudents.toLocaleString()}</Text>
                      </HStack>
                    </HStack>

                    <Divider />

                    <VStack spacing="3" align="start" fontSize="sm">
                      <HStack>
                        <Icon as={FiClock} color="primary.500" />
                        <Text>
                          {Math.floor(course.duration / 60)}h {course.duration % 60}m total duration
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiBook} color="primary.500" />
                        <Text>{course.totalLessons} video lessons</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiAward} color="primary.500" />
                        <Text>Certificate of completion</Text>
                      </HStack>
                      {course.deliveryMode === "live" && (
                        <>
                          <HStack>
                            <Icon as={FiVideo} color="red.500" />
                            <Text fontWeight="semibold" color="red.500">
                              Live Classes
                            </Text>
                          </HStack>
                          {course.liveSchedule && (
                            <HStack>
                              <Icon as={FiCalendar} color="primary.500" />
                              <Text>{course.liveSchedule}</Text>
                            </HStack>
                          )}
                        </>
                      )}
                    </VStack>

                    <Divider />

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="muted">
                        Total Price
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </FallInPlace>

              {/* What's Included */}
              <FallInPlace delay={0.3}>
                <Box bg={cardBg} p="6" borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <Heading size="md">What's Included</Heading>
                    <List spacing="3">
                      {course.learningOutcomes.slice(0, 5).map((outcome, index) => (
                        <ListItem key={index} fontSize="sm">
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          {outcome}
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </Box>
              </FallInPlace>

              {/* Instructor */}
              <FallInPlace delay={0.4}>
                <Box bg={cardBg} p="6" borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <Heading size="md">Your Instructor</Heading>
                    <HStack spacing="4">
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        width={60}
                        height={60}
                        style={{ borderRadius: "50%" }}
                      />
                      <VStack align="start" spacing="1">
                        <Text fontWeight="bold">{course.instructor.name}</Text>
                        <Text fontSize="sm" color="muted" noOfLines={1}>
                          {course.instructor.experience}
                        </Text>
                        <HStack spacing="1" fontSize="xs">
                          <Icon as={FiUsers} />
                          <Text color="muted">{course.instructor.totalStudents.toLocaleString()} students</Text>
                        </HStack>
                      </VStack>
                    </HStack>
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
