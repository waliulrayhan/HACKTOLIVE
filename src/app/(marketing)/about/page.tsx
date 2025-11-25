import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function AboutPage() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="start">
          <Heading as="h1" size="2xl">
            About Us
          </Heading>
          <Text fontSize="lg" color="gray.600">
            HackToLive (H4K2LIV3) is Bangladesh's premier cybersecurity platform, dedicated to providing 
            professional security services and ethical hacking training in Bengali.
          </Text>
          <Text fontSize="md" color="gray.600">
            Our mission is to empower individuals and organizations with the knowledge and skills needed 
            to protect themselves in an increasingly digital world. We offer comprehensive training programs, 
            professional security assessments, and hands-on learning experiences through CTF challenges.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
