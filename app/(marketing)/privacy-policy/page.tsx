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
  FiShield, 
  FiDatabase, 
  FiSettings, 
  FiShare2, 
  FiLock,
  FiEye,
  FiUserCheck,
  FiClock,
  FiUsers,
  FiGlobe,
  FiLink,
  FiEdit,
  FiMapPin,
  FiMail
} from 'react-icons/fi'

const waveAnimation = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-25%) translateY(-25%);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`

const pulseAnimation = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
`

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export default function PrivacyPolicy() {
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
      {/* Animated Wave Background */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        width="200%"
        height="200%"
        opacity={useColorModeValue(0.08, 0.04)}
        zIndex={0}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="radial(circle, blue.400 0%, purple.500 50%, transparent 70%)"
          animation={`${waveAnimation} 20s ease-in-out infinite`}
        />
      </Box>
      
      {/* Pulsing Geometric Shapes */}
      <Box
        position="absolute"
        top="20%"
        right="5%"
        width="400px"
        height="400px"
        border="2px solid"
        borderColor={useColorModeValue('blue.200', 'blue.800')}
        borderRadius="20%"
        opacity={0.2}
        sx={{
          animation: `${rotateAnimation} 30s linear infinite, ${pulseAnimation} 8s ease-in-out infinite`,
        }}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="8%"
        width="300px"
        height="300px"
        border="2px solid"
        borderColor={useColorModeValue('purple.200', 'purple.800')}
        borderRadius="30%"
        opacity={0.2}
        sx={{
          animation: `${rotateAnimation} 25s linear infinite reverse 1s, ${pulseAnimation} 6s ease-in-out infinite 1s`,
        }}
        zIndex={0}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width="500px"
        height="500px"
        border="2px solid"
        borderColor={useColorModeValue('pink.200', 'pink.800')}
        borderRadius="40%"
        opacity={0.15}
        transform="translate(-50%, -50%)"
        sx={{
          animation: `${rotateAnimation} 40s linear infinite 2s, ${pulseAnimation} 10s ease-in-out infinite 2s`,
        }}
        zIndex={0}
      />
      
      {/* Gradient Overlay Dots */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        width="150px"
        height="150px"
        borderRadius="full"
        bgGradient="radial(circle, blue.300, transparent)"
        opacity={0.4}
        filter="blur(40px)"
        sx={{
          animation: `${pulseAnimation} 7s ease-in-out infinite`,
        }}
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="20%"
        right="15%"
        width="200px"
        height="200px"
        borderRadius="full"
        bgGradient="radial(circle, purple.300, transparent)"
        opacity={0.4}
        filter="blur(40px)"
        sx={{
          animation: `${pulseAnimation} 9s ease-in-out infinite 3s`,
        }}
        zIndex={0}
      />
      
      <Box position="relative" zIndex={1} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={10} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Flex justify="center" mb={4}>
              <Icon 
                as={FiShield} 
                w={16} 
                h={16} 
                color={accentColor}
              />
            </Flex>
            <Heading
              as="h1"
              size="3xl"
              mb={4}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="1.2"
            >
              Privacy Policy
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
              Learn how we collect, use, and protect your personal information
            </Text>
          </Box>

          {/* Content Sections */}
          <SimpleGrid columns={{ base: 1 }} spacing={6}>
            {/* Introduction */}
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
                  Introduction
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                HackToLive (H4K2LIV3) is committed to protecting your privacy and ensuring the 
                security of your personal information. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our website, services, 
                academy courses, and related offerings. Please read this policy carefully to understand 
                our practices regarding your personal data.
              </Text>
            </Box>

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
                <Icon as={FiDatabase} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  1. Information We Collect
                </Heading>
              </Flex>
              
              <Heading as="h3" size="md" mb={3} mt={4}>
                1.1 Personal Information
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We collect information that you provide directly to us, including:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Name, email address, phone number</ListItem>
                <ListItem>Billing and payment information</ListItem>
                <ListItem>Account credentials (username, password)</ListItem>
                <ListItem>Educational background and professional information</ListItem>
                <ListItem>Profile information and preferences</ListItem>
                <ListItem>Communications with our support team</ListItem>
              </UnorderedList>

              <Heading as="h3" size="md" mb={3} mt={4}>
                1.2 Automatically Collected Information
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                When you access our services, we automatically collect:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Device information (IP address, browser type, operating system)</ListItem>
                <ListItem>Usage data (pages visited, time spent, click patterns)</ListItem>
                <ListItem>Course progress and completion data</ListItem>
                <ListItem>CTF challenge attempts and scores</ListItem>
                <ListItem>Log files and analytics data</ListItem>
                <ListItem>Cookies and similar tracking technologies</ListItem>
              </UnorderedList>

              <Heading as="h3" size="md" mb={3} mt={4}>
                1.3 Professional Service Information
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                For cybersecurity service clients:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Company information and contact details</ListItem>
                <ListItem>System and network information for security assessments</ListItem>
                <ListItem>Vulnerability and security assessment data</ListItem>
                <ListItem>Project communications and documentation</ListItem>
              </UnorderedList>
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
                <Icon as={FiSettings} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  2. How We Use Your Information
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We use collected information for the following purposes:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Provide, maintain, and improve our services and courses</ListItem>
                <ListItem>Process enrollments, payments, and transactions</ListItem>
                <ListItem>Deliver course content and track learning progress</ListItem>
                <ListItem>Communicate about services, updates, and promotional offers</ListItem>
                <ListItem>Provide customer support and respond to inquiries</ListItem>
                <ListItem>Conduct security assessments and deliver professional services</ListItem>
                <ListItem>Analyze usage patterns to enhance user experience</ListItem>
                <ListItem>Prevent fraud, abuse, and security incidents</ListItem>
                <ListItem>Comply with legal obligations and enforce our terms</ListItem>
                <ListItem>Send administrative information, such as policy updates</ListItem>
                <ListItem>Facilitate CTF competitions and community engagement</ListItem>
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
                <Icon as={FiShare2} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  3. Information Sharing and Disclosure
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We do not sell your personal information. We may share information in the following circumstances:
              </Text>
              
              <Heading as="h3" size="md" mb={3} mt={4}>
                3.1 Service Providers
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We may share information with third-party vendors who perform services on our behalf, 
                such as payment processing, hosting, email delivery, and analytics. These providers 
                are contractually obligated to protect your information and use it only for specified purposes.
              </Text>

              <Heading as="h3" size="md" mb={3} mt={4}>
                3.2 Legal Requirements
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We may disclose information if required by law, legal process, or government request, 
                or to protect the rights, property, or safety of HackToLive, our users, or others.
              </Text>

              <Heading as="h3" size="md" mb={3} mt={4}>
                3.3 Business Transfers
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                In the event of a merger, acquisition, or sale of assets, your information may be 
                transferred to the acquiring entity.
              </Text>

              <Heading as="h3" size="md" mb={3} mt={4}>
                3.4 With Your Consent
              </Heading>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We may share information for any other purpose with your explicit consent.
              </Text>
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
                <Icon as={FiLock} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  4. Data Security
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Encryption of data in transit and at rest</ListItem>
                <ListItem>Secure access controls and authentication mechanisms</ListItem>
                <ListItem>Regular security assessments and vulnerability testing</ListItem>
                <ListItem>Employee training on data protection and security</ListItem>
                <ListItem>Incident response procedures</ListItem>
                <ListItem>Compliance with industry security standards</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
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
                <Icon as={FiEye} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  5. Cookies and Tracking Technologies
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                We use cookies and similar technologies to:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Remember user preferences and settings</ListItem>
                <ListItem>Authenticate users and prevent fraud</ListItem>
                <ListItem>Analyze site traffic and usage patterns</ListItem>
                <ListItem>Personalize content and advertisements</ListItem>
                <ListItem>Improve our services and user experience</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                You can control cookies through your browser settings. However, disabling cookies may 
                affect the functionality of our services.
              </Text>
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
                <Icon as={FiUserCheck} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  6. Your Rights and Choices
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                You have the following rights regarding your personal information:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem><strong>Access:</strong> Request a copy of your personal data</ListItem>
                <ListItem><strong>Correction:</strong> Update or correct inaccurate information</ListItem>
                <ListItem><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</ListItem>
                <ListItem><strong>Opt-out:</strong> Unsubscribe from marketing communications</ListItem>
                <ListItem><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</ListItem>
                <ListItem><strong>Object:</strong> Object to certain processing of your information</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                To exercise these rights, contact us at privacy@hacktolive.net. We will respond to 
                your request within a reasonable timeframe and as required by applicable law.
              </Text>
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
                <Icon as={FiClock} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  7. Data Retention
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We retain your personal information for as long as necessary to fulfill the purposes 
                outlined in this policy, comply with legal obligations, resolve disputes, and enforce 
                our agreements. Course completion records and certificates may be retained indefinitely 
                for verification purposes. When information is no longer needed, we will securely delete 
                or anonymize it.
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
                <Icon as={FiUsers} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  8. Children's Privacy
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                Our services are not directed to individuals under the age of 16. We do not knowingly 
                collect personal information from children under 16. If you believe we have collected 
                information from a child under 16, please contact us immediately, and we will take 
                steps to delete such information.
              </Text>
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
                <Icon as={FiGlobe} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  9. International Data Transfers
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                Your information may be transferred to and processed in countries other than Bangladesh. 
                These countries may have different data protection laws. When we transfer information 
                internationally, we implement appropriate safeguards to protect your data in accordance 
                with this Privacy Policy and applicable laws.
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
                <Icon as={FiLink} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  10. Third-Party Links
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                Our services may contain links to third-party websites or services. We are not responsible 
                for the privacy practices or content of these third parties. We encourage you to review 
                the privacy policies of any third-party sites you visit.
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
                <Icon as={FiEdit} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  11. Changes to This Privacy Policy
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors. We will post the updated policy on this 
                page with a new "Last Updated" date. Significant changes will be communicated through email 
                or prominent notice on our website. Your continued use of our services after changes 
                constitutes acceptance of the updated policy.
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
                <Icon as={FiMapPin} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  12. Bangladesh Data Protection Compliance
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall">
                HackToLive operates primarily in Bangladesh and complies with applicable Bangladeshi 
                laws regarding data protection and privacy. We are committed to protecting your personal 
                information in accordance with the Information and Communication Technology Act and other 
                relevant regulations.
              </Text>
            </Box>

            {/* Section 13 - CCPA */}
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
                  13. CCPA Privacy Rights (California Residents)
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                Under the California Consumer Privacy Act (CCPA), California residents have the right to:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem>Request disclosure of categories and specific pieces of personal data we have collected</ListItem>
                <ListItem>Request deletion of personal data we have collected</ListItem>
                <ListItem>Opt-out of the sale of personal data (we do not sell personal data)</ListItem>
                <ListItem>Non-discrimination for exercising CCPA rights</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                To exercise these rights, contact us at privacy@hacktolive.net. We will respond within 30 days.
              </Text>
            </Box>

            {/* Section 14 - GDPR */}
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
                  14. GDPR Data Protection Rights (EU Residents)
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={3}>
                Under the General Data Protection Regulation (GDPR), EU residents are entitled to:
              </Text>
              <UnorderedList spacing={2} pl={6} color="gray.700" _dark={{ color: 'gray.300' }}>
                <ListItem><strong>Right to access:</strong> Request copies of your personal data</ListItem>
                <ListItem><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete information</ListItem>
                <ListItem><strong>Right to erasure:</strong> Request deletion of personal data under certain conditions</ListItem>
                <ListItem><strong>Right to restrict processing:</strong> Request limitation of data processing under certain conditions</ListItem>
                <ListItem><strong>Right to object:</strong> Object to processing of personal data under certain conditions</ListItem>
                <ListItem><strong>Right to data portability:</strong> Request transfer of data to another organization or to you</ListItem>
              </UnorderedList>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={3}>
                To exercise these rights, contact us at privacy@hacktolive.net. We will respond within one month.
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
              bgGradient="linear(to-br, blue.50, purple.50)"
              _dark={{ bgGradient: 'linear(to-br, blue.900, purple.900)' }}
            >
              <Flex align="center" mb={4}>
                <Icon as={FiMail} w={8} h={8} color={accentColor} mr={3} />
                <Heading as="h2" size="lg">
                  Contact Us About Privacy
                </Heading>
              </Flex>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mb={4}>
                If you have questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us:
              </Text>
              <VStack align="start" spacing={2} color="gray.700" _dark={{ color: 'gray.300' }}>
                <Text><strong>Privacy Email:</strong> privacy@hacktolive.net</Text>
                <Text><strong>General Email:</strong> legal@hacktolive.net</Text>
                <Text><strong>Phone:</strong> +880 1521-416287 / +880 1601-020699</Text>
                <Text><strong>Address:</strong> Mohammadpur, Dhaka, Bangladesh</Text>
                <Text><strong>Website:</strong> hacktolive.net</Text>
              </VStack>
              <Text color="gray.700" _dark={{ color: 'gray.300' }} lineHeight="tall" mt={4}>
                We are committed to resolving privacy concerns promptly and transparently.
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
      </Box>
    </Box>
  )
}
