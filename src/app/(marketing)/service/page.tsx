'use client'

import { Box, Container, Heading, Text, VStack, SimpleGrid, Card, CardBody } from '@chakra-ui/react'

export default function ServicePage() {
  const services = [
    {
      title: 'Penetration Testing',
      description: 'Comprehensive security assessments to identify vulnerabilities in your systems, networks, and applications.',
    },
    {
      title: 'Vulnerability Assessment',
      description: 'Systematic evaluation of security weaknesses in your infrastructure with detailed reporting and remediation guidance.',
    },
    {
      title: 'Digital Forensics',
      description: 'Expert investigation and analysis of digital evidence for incident response and legal proceedings.',
    },
    {
      title: 'SOC Services',
      description: 'Security Operations Center services providing 24/7 monitoring, threat detection, and incident response.',
    },
    {
      title: 'Security Audit',
      description: 'Thorough examination of your security policies, procedures, and controls to ensure compliance and best practices.',
    },
    {
      title: 'Security Consulting',
      description: 'Strategic guidance and expert advice to build and improve your organization\'s security posture.',
    },
  ]

  return (
    <Box py={20}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} align="start">
            <Heading as="h1" size="2xl">
              Our Services
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Professional cybersecurity services tailored to protect your organization from digital threats.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {services.map((service, index) => (
              <Card key={index} variant="outline" _hover={{ shadow: 'lg', borderColor: 'green.500' }} transition="all 0.3s">
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Heading as="h3" size="md" color="green.600">
                      {service.title}
                    </Heading>
                    <Text color="gray.600">
                      {service.description}
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
