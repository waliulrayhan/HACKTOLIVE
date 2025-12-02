"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import { courses } from "@/data/academy/courses";
import { liveCourses } from "@/data/academy/batches";
import CourseCard from "@/components/academy/CourseCard";
import SearchBar from "@/components/academy/SearchBar";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { Em } from "@/components/shared/typography";
import { 
  FiArrowRight, 
  FiAward, 
  FiUsers, 
  FiBook, 
  FiTrendingUp 
} from "react-icons/fi";

export default function AcademyHomePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const freeCourses = courses.filter((c) => c.tier === "free").slice(0, 3);
  const premiumCourses = courses.filter((c) => c.tier === "premium").slice(0, 3);
  const upcomingLiveCourses = liveCourses.slice(0, 3);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        py={{ base: '16', md: '24', lg: '32' }}
      >
        {/* Background decoration */}
        <Box
          position="absolute"
          top="-10%"
          right="-5%"
          width="600px"
          height="600px"
          borderRadius="full"
          bg={accentColor}
          opacity="0.1"
          filter="blur(100px)"
          pointerEvents="none"
        />
        
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} textAlign="center">
            <FallInPlace>
              <Badge 
                colorScheme="green" 
                fontSize="sm" 
                px="3" 
                py="1" 
                borderRadius="full"
              >
                🎓 World-Class Cybersecurity Education
              </Badge>
            </FallInPlace>
            
            <FallInPlace delay={0.2}>
              <Heading 
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                lineHeight="1.2"
                maxW="5xl"
              >
                Master Cybersecurity Skills{" "}
                <Em>From Industry Experts</Em>
              </Heading>
            </FallInPlace>

            <FallInPlace delay={0.3}>
              <Text 
                fontSize={{ base: 'lg', md: 'xl' }} 
                color="muted" 
                maxW="3xl"
              >
                Join thousands of students learning ethical hacking, penetration testing,
                and web security. Get certified and launch your cybersecurity career with
                hands-on training in Bengali.
              </Text>
            </FallInPlace>

            <FallInPlace delay={0.4}>
              <Flex 
                gap="4" 
                flexDirection={{ base: 'column', sm: 'row' }}
                width={{ base: '100%', sm: 'auto' }}
              >
                <ButtonLink 
                  colorScheme="primary" 
                  size="lg"
                  href="/academy/courses"
                  rightIcon={<Icon as={FiArrowRight} />}
                  flex={{ base: '1', sm: 'none' }}
                >
                  Browse All Courses
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href="/academy/live"
                  variant="outline"
                  flex={{ base: '1', sm: 'none' }}
                >
                  View Live Batches
                </ButtonLink>
              </Flex>
            </FallInPlace>

            <FallInPlace delay={0.5}>
              <Box w="full" maxW="2xl" pt="4">
                <SearchBar placeholder="Search cybersecurity courses..." />
              </Box>
            </FallInPlace>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={{ base: '12', md: '16' }} bg={bgColor}>
        <Container maxW="container.xl">
          <FallInPlace delay={0.2}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: '6', md: '8' }}>
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="green.50"
                  _dark={{ bg: "green.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiUsers} boxSize={{ base: '6', md: '8' }} color="green.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  50,000+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="muted" textAlign="center">
                  Students Enrolled
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="blue.50"
                  _dark={{ bg: "blue.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiBook} boxSize={{ base: '6', md: '8' }} color="blue.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  50+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="muted" textAlign="center">
                  Expert Courses
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="purple.50"
                  _dark={{ bg: "purple.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiAward} boxSize={{ base: '6', md: '8' }} color="purple.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  30,000+
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="muted" textAlign="center">
                  Certificates Issued
                </Text>
              </VStack>
              
              <VStack spacing="2">
                <Flex
                  width={{ base: '60px', md: '80px' }}
                  height={{ base: '60px', md: '80px' }}
                  borderRadius="2xl"
                  bg="orange.50"
                  _dark={{ bg: "orange.900" }}
                  align="center"
                  justify="center"
                >
                  <Icon as={FiTrendingUp} boxSize={{ base: '6', md: '8' }} color="orange.500" />
                </Flex>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color={accentColor}>
                  95%
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="muted" textAlign="center">
                  Success Rate
                </Text>
              </VStack>
            </SimpleGrid>
          </FallInPlace>
        </Container>
      </Box>

      {/* Free Courses Section */}
      <Box py={{ base: '16', md: '24' }} position="relative">
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex 
                justify="space-between" 
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align="start" spacing="2">
                  <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                    Free Access
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Start Learning For Free
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="muted">
                    Begin your cybersecurity journey with our free courses
                  </Text>
                </VStack>
                <ButtonLink 
                  href="/academy/courses?free=true" 
                  colorScheme="primary" 
                  variant="outline"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Free Courses
                </ButtonLink>
              </Flex>
            </FallInPlace>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {freeCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Premium Courses Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex 
                justify="space-between" 
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align="start" spacing="2">
                  <Badge colorScheme="purple" fontSize="sm" px="3" py="1" borderRadius="full">
                    Premium Content
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Advanced Training Programs
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="muted">
                    Professional courses with industry-recognized certifications
                  </Text>
                </VStack>
                <ButtonLink 
                  href="/academy/courses?premium=true" 
                  colorScheme="primary" 
                  variant="outline"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Premium
                </ButtonLink>
              </Flex>
            </FallInPlace>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {premiumCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Upcoming Live Batches Section */}
      {/* <Box py={{ base: '16', md: '24' }} position="relative" overflow="hidden">
        <Box
          position="absolute"
          bottom="-10%"
          left="-5%"
          width="500px"
          height="500px"
          borderRadius="full"
          bg={accentColor}
          opacity="0.08"
          filter="blur(100px)"
          pointerEvents="none"
        />
        
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }} align="stretch">
            <FallInPlace>
              <Flex 
                justify="space-between" 
                align={{ base: "start", md: "center" }}
                direction={{ base: "column", md: "row" }}
                gap="4"
              >
                <VStack align="start" spacing="2">
                  <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                    🔴 Live Training
                  </Badge>
                  <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                    Upcoming Live Batches
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="muted">
                    Join live interactive sessions with expert instructors
                  </Text>
                </VStack>
                <ButtonLink 
                  href="/academy/live" 
                  colorScheme="primary"
                  rightIcon={<Icon as={FiArrowRight} />}
                >
                  View All Batches
                </ButtonLink>
              </Flex>
            </FallInPlace>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {upcomingLiveCourses.map((course, index) => (
                <FallInPlace key={course.id} delay={0.1 * index}>
                  <CourseCard course={course} />
                </FallInPlace>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box> */}

      {/* How It Works Section */}
      <Box py={{ base: '16', md: '24' }} bg={bgColor}>
        <Container maxW="container.xl">
          <VStack spacing={{ base: '8', md: '12' }}>
            <FallInPlace>
              <VStack spacing="4" textAlign="center">
                <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
                  Simple Process
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}>
                  How It Works
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="muted" maxW="2xl">
                  Start your cybersecurity journey in three simple steps
                </Text>
              </VStack>
            </FallInPlace>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: '8', md: '12' }}>
              <FallInPlace delay={0.1}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="green.50"
                    _dark={{ bg: "green.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="green.500">
                      1
                    </Text>
                  </Flex>
                  <Heading size="md">Choose Your Course</Heading>
                  <Text color="muted">
                    Browse our extensive catalog and select the course that matches your
                    goals and skill level.
                  </Text>
                </VStack>
              </FallInPlace>
              
              <FallInPlace delay={0.2}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="blue.50"
                    _dark={{ bg: "blue.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="blue.500">
                      2
                    </Text>
                  </Flex>
                  <Heading size="md">Learn at Your Pace</Heading>
                  <Text color="muted">
                    Access high-quality video lectures, hands-on labs, and practical
                    exercises anytime, anywhere.
                  </Text>
                </VStack>
              </FallInPlace>
              
              <FallInPlace delay={0.3}>
                <VStack spacing="4" textAlign="center">
                  <Flex
                    w="100px"
                    h="100px"
                    borderRadius="2xl"
                    bg="purple.50"
                    _dark={{ bg: "purple.900" }}
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="purple.500">
                      3
                    </Text>
                  </Flex>
                  <Heading size="md">Get Certified</Heading>
                  <Text color="muted">
                    Complete the course, pass the assessments, and earn your industry-recognized
                    certificate.
                  </Text>
                </VStack>
              </FallInPlace>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={{ base: '16', md: '24' }}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Box
              bg={cardBg}
              borderWidth="1px"
              borderColor="green.500"
              p={{ base: '8', md: '12', lg: '16' }}
              borderRadius="3xl"
              textAlign="center"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-50%"
                right="-20%"
                width="400px"
                height="400px"
                borderRadius="full"
                bg={accentColor}
                opacity="0.1"
                filter="blur(80px)"
                pointerEvents="none"
              />
              
              <VStack spacing="6" position="relative" zIndex="1">
                <Badge colorScheme="green" fontSize="md" px="4" py="2" borderRadius="full">
                  Start Today
                </Badge>
                <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} maxW="3xl">
                  Ready to Start Your <Em>Cybersecurity Journey?</Em>
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color="muted" maxW="2xl">
                  Join HACKTOLIVE Academy today and learn from the best. Get lifetime access to all
                  course materials and join our thriving community of cyber warriors.
                </Text>
                <Flex gap="4" flexDirection={{ base: 'column', sm: 'row' }} pt="4">
                  <ButtonLink
                    href="/academy/courses"
                    size="lg"
                    colorScheme="primary"
                    rightIcon={<Icon as={FiArrowRight} />}
                    flex={{ base: '1', sm: 'none' }}
                  >
                    Explore Courses
                  </ButtonLink>
                  <ButtonLink
                    href="/signup"
                    size="lg"
                    variant="outline"
                    flex={{ base: '1', sm: 'none' }}
                  >
                    Sign Up Free
                  </ButtonLink>
                </Flex>
              </VStack>
            </Box>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  );
}
