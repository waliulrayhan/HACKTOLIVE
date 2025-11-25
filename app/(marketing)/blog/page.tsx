import { Box, Container, Heading, Text } from '@chakra-ui/react'

export default function BlogPage() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <Heading as="h1" size="2xl" mb={4}>
          Blog
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Stay updated with the latest cybersecurity news, tutorials, and insights from HackToLive.
        </Text>
      </Container>
    </Box>
  )
}
