import { Box, Container, Heading, Text } from '@chakra-ui/react'

export default function ShoppingPage() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <Heading as="h1" size="2xl" mb={4}>
          Shopping
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Browse our collection of cybersecurity tools, courses, and merchandise.
        </Text>
      </Container>
    </Box>
  )
}
