'use client'

import { Box, Container, Heading, Text, VStack, SimpleGrid, Card, CardBody, Badge } from '@chakra-ui/react'

export default function AcademyPage() {
  const courses = [
    {
      title: 'Ethical Hacking Fundamentals',
      level: 'Beginner',
      description: 'Learn the basics of ethical hacking, security concepts, and penetration testing methodologies in Bengali.',
      duration: '8 weeks',
    },
    {
      title: 'Web Application Security',
      level: 'Intermediate',
      description: 'Master web application vulnerabilities, OWASP Top 10, and exploitation techniques.',
      duration: '10 weeks',
    },
    {
      title: 'Network Penetration Testing',
      level: 'Intermediate',
      description: 'Deep dive into network security, scanning, enumeration, and exploitation of network services.',
      duration: '12 weeks',
    },
    {
      title: 'Digital Forensics',
      level: 'Advanced',
      description: 'Learn incident response, evidence collection, and forensic analysis techniques.',
      duration: '10 weeks',
    },
    {
      title: 'CTF Training',
      level: 'All Levels',
      description: 'Hands-on training for Capture The Flag competitions with real-world challenges.',
      duration: 'Ongoing',
    },
    {
      title: 'Security Operations',
      level: 'Advanced',
      description: 'SOC operations, SIEM tools, threat hunting, and incident response procedures.',
      duration: '12 weeks',
    },
  ]

  const levelColors: Record<string, string> = {
    'Beginner': 'green',
    'Intermediate': 'blue',
    'Advanced': 'purple',
    'All Levels': 'orange',
  }

  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} align="start">
            <Heading as="h1" size="2xl">
              HackToLive Academy
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Professional cybersecurity training in Bengali. Learn ethical hacking, penetration testing, 
              and security skills from experienced instructors.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {courses.map((course, index) => (
              <Card key={index} variant="outline" _hover={{ shadow: 'lg', borderColor: 'green.500' }} transition="all 0.3s">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Badge colorScheme={levelColors[course.level]} fontSize="sm">
                      {course.level}
                    </Badge>
                    <Heading as="h3" size="md" color="green.600">
                      {course.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">
                      {course.description}
                    </Text>
                    <Text color="gray.500" fontSize="sm" fontWeight="semibold">
                      Duration: {course.duration}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}
