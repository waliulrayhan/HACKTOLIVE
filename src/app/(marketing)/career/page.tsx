import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function CareerPage() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={6} align="start">
          <Heading as="h1" size="2xl">
            Career Opportunities
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Join our team of cybersecurity professionals and help shape the future of digital security in Bangladesh.
          </Text>
          <Text fontSize="md" color="gray.600">
            We're always looking for talented individuals who are passionate about cybersecurity, 
            ethical hacking, and education. Whether you're an experienced professional or just starting 
            your journey, we have opportunities for growth and development.
          </Text>
          <Text fontSize="md" color="gray.600">
            Check back soon for current openings or send your resume to join our talent pool.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
