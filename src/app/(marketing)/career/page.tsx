'use client'

import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
  Badge,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { toast } from '@/components/ui/toast'
import {
  FiTarget,
  FiHeart,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiBook,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiSend,
  FiUpload,
  FiCheckCircle,
  FiCode,
  FiShield,
  FiMonitor,
  FiLayers,
} from 'react-icons/fi'
import { useState } from 'react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  icon: any
}

const jobOpenings: JobPosition[] = [
  {
    id: '1',
    title: 'Senior Penetration Tester',
    department: 'Security Services',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '৳80,000 - ৳120,000',
    description:
      'Lead penetration testing engagements for web applications, mobile apps, and network infrastructure. Mentor junior team members and contribute to our security methodology.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'OSCP, CEH, or equivalent certification',
      '3+ years of penetration testing experience',
      'Proficient with tools like Burp Suite, Metasploit, Nmap',
      'Strong knowledge of OWASP Top 10 vulnerabilities',
      'Excellent report writing skills in English and Bengali',
    ],
    icon: FiShield,
  },
  {
    id: '2',
    title: 'Ethical Hacking Instructor',
    department: 'Academy',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '৳60,000 - ৳90,000',
    description:
      'Deliver high-quality cybersecurity training in Bengali. Develop course content, conduct hands-on labs, and guide students through practical scenarios.',
    requirements: [
      'Strong expertise in ethical hacking and cybersecurity',
      'Experience in teaching or training',
      'Fluent in Bengali and English',
      'Passionate about education and mentoring',
      'Familiarity with CTF challenges and platforms',
      'Ability to explain complex concepts simply',
    ],
    icon: FiBook,
  },
  {
    id: '3',
    title: 'Security Operations Analyst',
    department: 'SOC Team',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    experience: '1-3 years',
    salary: '৳50,000 - ৳75,000',
    description:
      'Monitor security events, investigate incidents, and respond to threats. Work with SIEM tools and contribute to improving security operations.',
    requirements: [
      'Understanding of security principles and best practices',
      'Experience with SIEM tools (Splunk, ELK, etc.)',
      'Knowledge of network protocols and log analysis',
      'Strong analytical and problem-solving skills',
      'Ability to work in shifts',
      'Security certifications are a plus',
    ],
    icon: FiMonitor,
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    department: 'Technology',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '৳60,000 - ৳90,000',
    description:
      'Build and maintain our learning platform and internal tools. Work with modern web technologies to create secure, scalable applications.',
    requirements: [
      'Proficient in React, Node.js, and TypeScript',
      'Experience with Next.js and modern web frameworks',
      'Understanding of secure coding practices',
      'Database design and optimization skills',
      'API design and development experience',
      'Interest in cybersecurity is a plus',
    ],
    icon: FiCode,
  },
]

export default function CareerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null as File | null,
    coverLetter: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorder = useColorModeValue('gray.300', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const dividerColor = useColorModeValue('primary.500', 'primary.400')
  const badgeBg = useColorModeValue('primary.100', 'primary.900')
  const badgeColor = useColorModeValue('primary.800', 'primary.200')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required'
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required'
    } else if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Application submitted successfully!', {
        description: "We'll review your application and get back to you soon.",
        duration: 5000,
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        resume: null,
        coverLetter: '',
      })
      setSelectedJob(null)
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }))
    }
  }

  const handleApplyClick = (jobId: string, jobTitle: string) => {
    setSelectedJob(jobId)
    setFormData((prev) => ({ ...prev, position: jobTitle }))
    const applicationForm = document.getElementById('application-form')
    applicationForm?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        position="relative" 
        overflow="hidden" 
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2000')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: useColorModeValue(
            'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.90) 100%)',
            'linear-gradient(135deg, rgba(26, 32, 44, 0.70) 0%, rgba(45, 55, 72, 0.75) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={4} textAlign="center" maxW="3xl" mx="auto">
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontWeight="bold"
                  lineHeight="1.2"
                  mb={4}
                  color="white"
                >
                  Join Our Team
                </Heading>
                <Box
                  width="120px"
                  height="4px"
                  bg={dividerColor}
                  mx="auto"
                  borderRadius="full"
                />
              </Box>
              <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.900">
                Help shape the future of cybersecurity in Bangladesh. Join our
                passionate team of security professionals and educators.
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Why Join Us Section */}
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <VStack spacing={8} mb={16}>
          <FallInPlace>
            <VStack spacing={3} textAlign="center">
              <Heading size="xl">Why Work at HackToLive?</Heading>
              <Text color={mutedColor} maxW="2xl">
                We're building Bangladesh's leading cybersecurity platform. Join us
                to make a real impact in protecting digital Bangladesh.
              </Text>
            </VStack>
          </FallInPlace>

          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={6}
            w="full"
          >
            <FallInPlace delay={0.1}>
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
                height="100%"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: iconColor,
                }}
                transition="all 0.3s"
              >
                <VStack spacing={4} align="center">
                  <Flex
                    w={14}
                    h={14}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={iconBg}
                  >
                    <Icon as={FiTrendingUp} boxSize={7} color={iconColor} />
                  </Flex>
                  <Heading size="sm" textAlign="center">
                    Growth Opportunities
                  </Heading>
                  <Text fontSize="sm" textAlign="center" color={mutedColor}>
                    Continuous learning, certifications, and career advancement in
                    the fast-growing cybersecurity field.
                  </Text>
                </VStack>
              </Card>
            </FallInPlace>

            <FallInPlace delay={0.2}>
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
                height="100%"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: iconColor,
                }}
                transition="all 0.3s"
              >
                <VStack spacing={4} align="center">
                  <Flex
                    w={14}
                    h={14}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={iconBg}
                  >
                    <Icon as={FiUsers} boxSize={7} color={iconColor} />
                  </Flex>
                  <Heading size="sm" textAlign="center">
                    Collaborative Culture
                  </Heading>
                  <Text fontSize="sm" textAlign="center" color={mutedColor}>
                    Work with passionate security experts who love sharing
                    knowledge and solving challenges together.
                  </Text>
                </VStack>
              </Card>
            </FallInPlace>

            <FallInPlace delay={0.3}>
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
                height="100%"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: iconColor,
                }}
                transition="all 0.3s"
              >
                <VStack spacing={4} align="center">
                  <Flex
                    w={14}
                    h={14}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={iconBg}
                  >
                    <Icon as={FiTarget} boxSize={7} color={iconColor} />
                  </Flex>
                  <Heading size="sm" textAlign="center">
                    Meaningful Work
                  </Heading>
                  <Text fontSize="sm" textAlign="center" color={mutedColor}>
                    Protect organizations and train the next generation of
                    cybersecurity professionals in Bangladesh.
                  </Text>
                </VStack>
              </Card>
            </FallInPlace>

            <FallInPlace delay={0.4}>
              <Card
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
                height="100%"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  borderColor: iconColor,
                }}
                transition="all 0.3s"
              >
                <VStack spacing={4} align="center">
                  <Flex
                    w={14}
                    h={14}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={iconBg}
                  >
                    <Icon as={FiHeart} boxSize={7} color={iconColor} />
                  </Flex>
                  <Heading size="sm" textAlign="center">
                    Great Benefits
                  </Heading>
                  <Text fontSize="sm" textAlign="center" color={mutedColor}>
                    Competitive salary, health insurance, flexible hours, and
                    professional development budget.
                  </Text>
                </VStack>
              </Card>
            </FallInPlace>
          </Grid>
        </VStack>

        {/* Perks & Benefits */}
        <Box mb={16}>
          <FallInPlace delay={0.5}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
            >
              <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="center">
                  Perks & Benefits
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiDollarSign} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Competitive Salary
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Market-competitive compensation with performance bonuses
                        and annual increments.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiAward} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Certifications
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Company-sponsored training and certifications (OSCP, CEH,
                        CISSP, etc.).
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiClock} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Flexible Hours
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Work-life balance with flexible working hours and remote
                        work options.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiBook} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Learning Budget
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Annual budget for books, courses, conferences, and
                        professional development.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiLayers} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Latest Tools
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Access to cutting-edge security tools, software, and
                        equipment.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="flex-start" gap={3}>
                    <Icon as={FiUsers} color={iconColor} boxSize={6} mt={1} />
                    <Box>
                      <Heading size="sm" mb={2}>
                        Team Events
                      </Heading>
                      <Text fontSize="sm" color={mutedColor}>
                        Regular team activities, CTF competitions, and social
                        events.
                      </Text>
                    </Box>
                  </Flex>
                </SimpleGrid>
              </VStack>
            </Card>
          </FallInPlace>
        </Box>

        {/* Job Openings */}
        <VStack spacing={8} mb={16}>
          <FallInPlace>
            <VStack spacing={3} textAlign="center">
              <Heading size="xl">Current Openings</Heading>
              <Text color={mutedColor} maxW="2xl">
                Explore our open positions and find the perfect role for your
                skills and aspirations.
              </Text>
            </VStack>
          </FallInPlace>

          <Stack spacing={6} w="full">
            {jobOpenings.map((job, index) => (
              <FallInPlace key={job.id} delay={0.1 * (index + 1)}>
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={{ base: 6, md: 8 }}
                  borderRadius="lg"
                  _hover={{
                    borderColor: iconColor,
                    shadow: 'md',
                  }}
                  transition="all 0.3s"
                >
                  <Grid
                    templateColumns={{ base: '1fr', lg: '1fr auto' }}
                    gap={6}
                    alignItems="start"
                  >
                    <VStack align="stretch" spacing={4}>
                      <Flex align="center" gap={4} flexWrap="wrap">
                        <Flex
                          w={12}
                          h={12}
                          align="center"
                          justify="center"
                          borderRadius="lg"
                          bg={iconBg}
                        >
                          <Icon as={job.icon} boxSize={6} color={iconColor} />
                        </Flex>
                        <Box flex="1" minW="200px">
                          <Heading size="md" mb={1}>
                            {job.title}
                          </Heading>
                          <Text fontSize="sm" color={mutedColor}>
                            {job.department}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex gap={2} flexWrap="wrap">
                        <Badge
                          bg={badgeBg}
                          color={badgeColor}
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon as={FiMapPin} boxSize={3} />
                          {job.location}
                        </Badge>
                        <Badge
                          bg={badgeBg}
                          color={badgeColor}
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon as={FiBriefcase} boxSize={3} />
                          {job.type}
                        </Badge>
                        <Badge
                          bg={badgeBg}
                          color={badgeColor}
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon as={FiCalendar} boxSize={3} />
                          {job.experience}
                        </Badge>
                        <Badge
                          bg={badgeBg}
                          color={badgeColor}
                          px={3}
                          py={1}
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon as={FiDollarSign} boxSize={3} />
                          {job.salary}
                        </Badge>
                      </Flex>

                      <Text color={mutedColor}>{job.description}</Text>

                      <Box>
                        <Heading size="sm" mb={3}>
                          Requirements:
                        </Heading>
                        <List spacing={2}>
                          {job.requirements.map((req, idx) => (
                            <ListItem
                              key={idx}
                              fontSize="sm"
                              color={mutedColor}
                              display="flex"
                              gap={2}
                            >
                              <ListIcon
                                as={FiCheckCircle}
                                color={iconColor}
                                mt={0.5}
                              />
                              {req}
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </VStack>

                    <Button
                      colorScheme="primary"
                      size="lg"
                      onClick={() => handleApplyClick(job.id, job.title)}
                      flexShrink={0}
                      width={{ base: 'full', lg: 'auto' }}
                    >
                      Apply Now
                    </Button>
                  </Grid>
                </Card>
              </FallInPlace>
            ))}
          </Stack>
        </VStack>

        {/* Application Form */}
        <Box id="application-form">
          <FallInPlace delay={0.5}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
            >
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="lg" mb={2}>
                    Submit Your Application
                  </Heading>
                  <Text color={mutedColor}>
                    Fill out the form below and we'll review your application. You
                    can also send your resume directly to careers@hacktolive.net
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={4}
                    >
                      <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>
                    </Grid>

                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                      gap={4}
                    >
                      <FormControl isInvalid={!!errors.phone}>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+880 1XXX-XXXXXX"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.position}>
                        <FormLabel>Position Applied For</FormLabel>
                        <Input
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Select a position above or enter custom"
                          bg={inputBg}
                          borderColor={inputBorder}
                          _hover={{ borderColor: iconColor }}
                          _focus={{
                            borderColor: iconColor,
                            boxShadow: `0 0 0 1px ${iconColor}`,
                          }}
                        />
                        <FormErrorMessage>{errors.position}</FormErrorMessage>
                      </FormControl>
                    </Grid>

                    <FormControl>
                      <FormLabel>Years of Experience</FormLabel>
                      <Input
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g., 3 years"
                        bg={inputBg}
                        borderColor={inputBorder}
                        _hover={{ borderColor: iconColor }}
                        _focus={{
                          borderColor: iconColor,
                          boxShadow: `0 0 0 1px ${iconColor}`,
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Resume / CV</FormLabel>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        bg={inputBg}
                        borderColor={inputBorder}
                        pt={1}
                        _hover={{ borderColor: iconColor }}
                        _focus={{
                          borderColor: iconColor,
                          boxShadow: `0 0 0 1px ${iconColor}`,
                        }}
                      />
                      <Text fontSize="xs" color={mutedColor} mt={1}>
                        Upload your resume in PDF or DOC format (Max 5MB)
                      </Text>
                    </FormControl>

                    <FormControl isInvalid={!!errors.coverLetter}>
                      <FormLabel>Cover Letter</FormLabel>
                      <Textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Tell us why you'd be a great fit for this position..."
                        rows={6}
                        bg={inputBg}
                        borderColor={inputBorder}
                        _hover={{ borderColor: iconColor }}
                        _focus={{
                          borderColor: iconColor,
                          boxShadow: `0 0 0 1px ${iconColor}`,
                        }}
                      />
                      <FormErrorMessage>{errors.coverLetter}</FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="primary"
                      size="lg"
                      rightIcon={<Icon as={FiSend} />}
                      isLoading={isSubmitting}
                      loadingText="Submitting..."
                      width="full"
                    >
                      Submit Application
                    </Button>
                  </Stack>
                </form>
              </VStack>
            </Card>
          </FallInPlace>
        </Box>

        {/* Contact Info */}
        <Box mt={12}>
          <FallInPlace delay={0.6}>
            <Card
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              p={{ base: 6, md: 8 }}
              borderRadius="lg"
              textAlign="center"
            >
              <VStack spacing={4}>
                <Heading size="md">Questions About Careers?</Heading>
                <Text color={mutedColor}>
                  If you have any questions about our open positions or the
                  application process, feel free to reach out to our HR team.
                </Text>
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Link
                    href="mailto:careers@hacktolive.net"
                    color={iconColor}
                    fontWeight="medium"
                  >
                    careers@hacktolive.net
                  </Link>
                  <Text color={mutedColor}>|</Text>
                  <Link
                    href="tel:+8801521416287"
                    color={iconColor}
                    fontWeight="medium"
                  >
                    +880 1521-416287
                  </Link>
                </HStack>
              </VStack>
            </Card>
          </FallInPlace>
        </Box>
      </Container>
    </Box>
  )
}