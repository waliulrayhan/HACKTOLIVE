'use client'

import { Box, Container, Heading, Text, VStack, Link } from '@chakra-ui/react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function ContactPage() {
  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="start">
          <Heading as="h1" size="2xl">
            Contact Us
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Get in touch with our team for any inquiries about our services, courses, or partnerships.
          </Text>
          
          <VStack spacing={4} align="start" mt={8}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box as={FaPhone} color="green.500" boxSize={5} />
              <Link href="tel:+8801521416287" fontSize="lg">
                +880 1521-416287
              </Link>
            </Box>
            
            <Box display="flex" alignItems="center" gap={3}>
              <Box as={FaPhone} color="green.500" boxSize={5} />
              <Link href="tel:+8801601020699" fontSize="lg">
                +880 1601-020699
              </Link>
            </Box>
            
            <Box display="flex" alignItems="center" gap={3}>
              <Box as={FaMapMarkerAlt} color="green.500" boxSize={5} />
              <Text fontSize="lg">
                Mohammadpur, Dhaka, Bangladesh
              </Text>
            </Box>
            
            <Box display="flex" alignItems="center" gap={3}>
              <Box as={FaEnvelope} color="green.500" boxSize={5} />
              <Link href="https://hacktolive.net" fontSize="lg" isExternal>
                hacktolive.net
              </Link>
            </Box>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}
