'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  VStack,
  UnorderedList,
  ListItem,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiCheckCircle, 
  FiShield, 
  FiUsers, 
  FiBook, 
  FiBriefcase, 
  FiLock,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiXCircle,
  FiEdit,
  FiGlobe,
  FiMail
} from 'react-icons/fi'

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const floatingAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`

export default function TermsOfService() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')

  return (
    <Box 
      position="relative"
      minH="100vh" 
      pt={{ base: 24, md: 16 }} 
      pb={{ base: 8, md: 16 }}
      overflow="hidden"
    >
      {/* Animated Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(45deg, green.500, cyan.500, blue.500, green.500)"
        backgroundSize="400% 400%"
        sx={{
          animation: `${gradientAnimation} 15s ease infinite`,
        }}
        opacity={useColorModeValue(0.08, 0.04)}
        zIndex={0}
      />
      
      {/* Floating Circles */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        width="300px"
        height="300px"
        borderRadius="full"
        bg={useColorModeValue('blue.100', 'blue.900')}
        opacity={0.3}
        filter="blur(60px)"
        animation={`${floatingAnimation} 8s ease-in-out infinite`}
        zIndex={0}
      />
      <Box
        position="absolute"
        top="60%"
        right="10%"
        width="250px"
        height="250px"
        borderRadius="full"
        bg={useColorModeValue('green.100', 'green.900')}
        opacity={0.3}
        filter="blur(60px)"
        animation={`${floatingAnimation} 10s ease-in-out infinite 2s`}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="10%"
        left="15%"
        width="200px"
        height="200px"
        borderRadius="full"
        bg={useColorModeValue('pink.100', 'pink.900')}
        opacity={0.3}
        filter="blur(60px)"
        animation={`${floatingAnimation} 12s ease-in-out infinite 4s`}
        zIndex={0}
      />
      
      <Box position="relative" zIndex={1} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Flex justify="center" mb={4}>
              <Icon 
                as={FiFileText} 
                w={16} 
                h={16} 
                color={accentColor}
              />
            </Flex>
            <Heading
              as="h1"
              size="3xl"
              mb={4}
              bgGradient="linear(to-r, blue.400, green.500)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="1.2"
            >
              Terms of Service
            </Heading>
            <Text 
              color="gray.600" 
              _dark={{ color: 'gray.400' }} 
              fontSize="lg"
              maxW="2xl"
              mx="auto"
            >
              Last Updated: November 25, 2025
            </Text>
            <Text 
              color="gray.500" 
              _dark={{ color: 'gray.500' }} 
              fontSize="md"
              mt={2}
            >
              Please read these terms carefully before using our services
            </Text>
          </Box>

          {/* Content Sections */}
          <SimpleGrid columns={{ base: 1 }} spacing={6}>
            {/* Section 1 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiCheckCircle} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  1. Acceptance of Terms
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                By accessing and using HackToLive (H4K2LIV3) services, including our website, 
                academy courses, training programs, security services, and any related offerings, 
                you acknowledge that you have read, understood, and agree to be bound by these 
                Terms of Service and our Privacy Policy. If you do not agree to these terms, 
                please do not use our services.
              </Text>
            </Box>

            {/* Section 2 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiBriefcase} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  2. Service Description
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                HackToLive provides:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Professional cybersecurity services including penetration testing, vulnerability assessments, and digital forensics</ListItem>
                <ListItem>Educational courses and training programs in Bengali language for ethical hacking and cybersecurity</ListItem>
                <ListItem>Capture The Flag (CTF) challenges and competitions</ListItem>
                <ListItem>Security Operation Center (SOC) services</ListItem>
                <ListItem>Community platform for cybersecurity professionals and learners</ListItem>
              </UnorderedList>
            </Box>

            {/* Section 3 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiUsers} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  3. User Responsibilities and Code of Conduct
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                Users must:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Use all knowledge and tools for legal and ethical purposes only</ListItem>
                <ListItem>Not engage in any illegal activities, including unauthorized access to systems</ListItem>
                <ListItem>Practice responsible disclosure when discovering security vulnerabilities</ListItem>
                <ListItem>Maintain the confidentiality of their account credentials</ListItem>
                <ListItem>Not share, sell, or distribute course materials without authorization</ListItem>
                <ListItem>Respect intellectual property rights of HackToLive and third parties</ListItem>
                <ListItem>Use lab environments and practice systems only for educational purposes</ListItem>
                <ListItem>Not attempt to compromise or disrupt our services or infrastructure</ListItem>
              </UnorderedList>
            </Box>

            {/* Section 4 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiShield} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  4. Ethical Hacking and Legal Compliance
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We are committed to promoting ethical hacking practices. Users must:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Only perform security testing on systems they own or have explicit written permission to test</ListItem>
                <ListItem>Comply with all applicable local, national, and international laws and regulations</ListItem>
                <ListItem>Understand that unauthorized access to computer systems is illegal in Bangladesh and most jurisdictions</ListItem>
                <ListItem>Use skills learned responsibly and professionally</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                HackToLive is not responsible for any misuse of knowledge or tools obtained through our services.
              </Text>
            </Box>

            {/* Section 5 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiBook} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  5. Academy Enrollment and Courses
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                For academy students:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Course content is provided for personal educational use only</ListItem>
                <ListItem>Access to course materials is limited to the enrollment period unless otherwise specified</ListItem>
                <ListItem>Completion certificates are awarded based on meeting course requirements</ListItem>
                <ListItem>Refund policies are outlined separately and apply based on enrollment date</ListItem>
                <ListItem>Course schedules and content may be updated to reflect current security practices</ListItem>
              </UnorderedList>
            </Box>

            {/* Section 6 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiBriefcase} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  6. Professional Services
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                For cybersecurity service clients:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>All professional engagements require a signed service agreement</ListItem>
                <ListItem>Scope of work is defined before engagement begins</ListItem>
                <ListItem>Findings and reports are confidential and client-owned</ListItem>
                <ListItem>We maintain professional standards and certifications</ListItem>
                <ListItem>Client data is handled according to our Privacy Policy</ListItem>
              </UnorderedList>
            </Box>

            {/* Section 7 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiLock} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  7. Intellectual Property
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                All content, materials, courses, logos, and trademarks on HackToLive are owned by 
                HackToLive (H4K2LIV3) or licensed to us. Users may not reproduce, distribute, modify, 
                or create derivative works without explicit written permission. Course materials are 
                licensed for personal educational use only.
              </Text>
            </Box>

            {/* Section 8 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiDollarSign} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  8. Payment and Billing
                </Heading>
              </Flex>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>All fees are listed in Bangladeshi Taka (BDT) unless otherwise stated</ListItem>
                <ListItem>Payment is required before service delivery or course access</ListItem>
                <ListItem>We accept various payment methods as displayed during checkout</ListItem>
                <ListItem>Refunds are processed according to our refund policy</ListItem>
                <ListItem>Prices are subject to change with notice</ListItem>
              </UnorderedList>
            </Box>

            {/* Section 9 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiLock} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  9. Privacy and Data Protection
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                Your privacy is important to us. Please review our Privacy Policy to understand how 
                we collect, use, and protect your personal information. By using our services, you 
                consent to our data practices as described in the Privacy Policy.
              </Text>
            </Box>

            {/* Section 10 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiAlertCircle} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  10. Limitation of Liability
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                HackToLive provides services "as is" without warranties of any kind. We are not liable 
                for any indirect, incidental, special, or consequential damages arising from use of our 
                services. Our total liability shall not exceed the amount paid by you for the specific 
                service in question. We do not guarantee employment, certification outcomes, or specific 
                skill levels from our training programs.
              </Text>
            </Box>

            {/* Section 11 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiXCircle} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  11. Account Termination
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We reserve the right to suspend or terminate accounts that violate these terms, engage 
                in illegal activities, or disrupt our services. Users may close their accounts at any time 
                by contacting support. Termination does not entitle users to refunds for unused services 
                unless required by law.
              </Text>
            </Box>

            {/* Section 12 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiEdit} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  12. Modifications to Terms
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We may update these Terms of Service periodically. Changes will be posted on this page 
                with an updated "Last Updated" date. Continued use of our services after changes constitutes 
                acceptance of the modified terms. We encourage you to review these terms regularly.
              </Text>
            </Box>

            {/* Section 13 */}
            <Box
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              shadow="lg"
              transition="all 0.3s"
              _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiGlobe} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  13. Governing Law
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                These Terms of Service are governed by the laws of Bangladesh. Any disputes arising from 
                these terms or use of our services shall be subject to the exclusive jurisdiction of the 
                courts of Dhaka, Bangladesh.
              </Text>
            </Box>

            {/* Contact Section */}
            <Box 
              bg={cardBg}
              p={{ base: 6, md: 8 }}
              borderRadius="xl"
              borderWidth="2px"
              borderColor={accentColor}
              shadow="xl"
              bgGradient="linear(to-br, blue.50, green.50)"
              _dark={{ bgGradient: 'linear(to-br, blue.900, green.900)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiMail} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  Contact Us
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={4}>
                If you have questions about these Terms of Service, please contact us:
              </Text>
              <VStack align="start" spacing={2} color="gray.700" _dark={{ color: 'gray.300' }}>
                <Text><strong>Email:</strong> legal@hacktolive.net</Text>
                <Text><strong>Phone:</strong> +880 1521-416287 / +880 1601-020699</Text>
                <Text><strong>Address:</strong> Mohammadpur, Dhaka, Bangladesh</Text>
                <Text><strong>Website:</strong> hacktolive.net</Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
      </Box>
    </Box>
  )
}
