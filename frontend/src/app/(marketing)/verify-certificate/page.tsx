import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Certificate - HACKTOLIVE Academy',
  description: 'Verify the authenticity of HACKTOLIVE Academy certificates. Enter a certificate code to check if a certificate is valid and view certificate details.',
  keywords: [
    'verify certificate',
    'certificate verification',
    'authentic certificate',
    'HACKTOLIVE certificate',
    'course certificate',
    'certificate validation'
  ],
  openGraph: {
    title: 'Verify Certificate - HACKTOLIVE Academy',
    description: 'Verify the authenticity of HACKTOLIVE Academy certificates. Check certificate validity and details.',
    url: 'https://hacktolive.io/verify-certificate',
    siteName: 'HACKTOLIVE',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'HACKTOLIVE Certificate Verification',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verify Certificate - HACKTOLIVE Academy',
    description: 'Verify the authenticity of HACKTOLIVE Academy certificates.',
    images: ['/logo.svg'],
  },
}

'use client'

import {
    Box,
    Button,
    Card,
    CardBody,
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
    Text,
    VStack,
    useColorModeValue,
    Divider,
    HStack,
    Alert,
    AlertTitle,
    AlertDescription,
    Image,
    SimpleGrid,
} from '@chakra-ui/react'
import { toast } from '@/components/ui/toast'
import {
    FiCheckCircle,
    FiXCircle,
    FiSearch,
    FiAward,
    FiUser,
    FiBook,
    FiCalendar,
    FiShield,
    FiDownload,
    FiArrowRight,
} from 'react-icons/fi'
import { useState } from 'react'
import { BackgroundGradient } from '@/components/shared/gradients/background-gradient'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'

interface CertificateData {
    id: string
    verificationCode: string
    studentName: string
    courseName: string
    instructorName: string
    issuedAt: string
    status: string
    certificateUrl?: string
}

interface VerificationResponse {
    valid: boolean
    certificate?: CertificateData
}

export default function VerifyCertificatePage() {
    const [verificationCode, setVerificationCode] = useState('')
    const [error, setError] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null)

    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const iconBg = useColorModeValue('primary.50', 'primary.900')
    const iconColor = useColorModeValue('primary.500', 'primary.400')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const inputBg = useColorModeValue('white', 'gray.700')
    const inputBorder = useColorModeValue('gray.300', 'gray.600')
    const successBg = useColorModeValue('green.50', 'green.900')
    const successColor = useColorModeValue('green.500', 'green.400')
    const errorBg = useColorModeValue('red.50', 'red.900')
    const errorColor = useColorModeValue('red.500', 'red.400')

    const validateCode = () => {
        if (!verificationCode.trim()) {
            setError('Verification code is required')
            return false
        }

        // Basic format validation (HACK-XXXXXXXXXX-XXXXXXXX)
        const codePattern = /^HACK-[A-Z0-9]+-[A-Z0-9]+$/i
        if (!codePattern.test(verificationCode.trim())) {
            setError('Invalid verification code format. Expected format: HACK-XXXXXXXXXX-XXXXXXXX')
            return false
        }

        setError('')
        return true
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateCode()) {
            return
        }

        setIsVerifying(true)
        setVerificationResult(null)

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/academy/certificates/verify/${verificationCode.trim()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (!response.ok) {
                if (response.status === 404) {
                    setVerificationResult({ valid: false })
                    toast.error('Certificate not found', {
                        description: 'No certificate with this verification code exists in our system.',
                        duration: 5000,
                    })
                } else {
                    throw new Error('Failed to verify certificate')
                }
            } else {
                const data: VerificationResponse = await response.json()
                setVerificationResult(data)

                if (data.valid && data.certificate?.status === 'ISSUED') {
                    toast.success('Certificate verified successfully!', {
                        description: 'This certificate is authentic and was issued by HackToLive.',
                        duration: 5000,
                    })
                }
            }
        } catch (error) {
            console.error('Error verifying certificate:', error)
            toast.error('Verification failed', {
                description: 'Unable to verify the certificate. Please try again.',
                duration: 5000,
            })
        } finally {
            setIsVerifying(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value)
        if (error) {
            setError('')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <Box>
            {/* Hero Section */}
            <Box
                position="relative"
                overflow="hidden"
                pt={{ base: 32, md: 40 }}
                pb={{ base: 16, md: 20 }}
                bgImage="url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000')"
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
                            <Flex
                                align="center"
                                justify="center"
                                w={20}
                                h={20}
                                rounded="full"
                                bg="whiteAlpha.200"
                                backdropFilter="blur(10px)"
                            >
                                <Icon as={FiShield} boxSize={10} color="white" />
                            </Flex>

                            <Box>
                                <Heading
                                    as="h1"
                                    fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                                    fontWeight="bold"
                                    lineHeight="1.2"
                                    mb={4}
                                    color="white"
                                >
                                    Verify Certificate
                                </Heading>
                                <Box
                                    width="120px"
                                    height="4px"
                                    bg="primary.400"
                                    mx="auto"
                                    borderRadius="full"
                                />
                            </Box>

                            <Text
                                fontSize={{ base: 'lg', md: 'xl' }}
                                color="whiteAlpha.900"
                                maxW="2xl"
                            >
                                Enter the verification code to confirm certificate authenticity issued by HackToLive Academy
                            </Text>
                        </VStack>
                    </FallInPlace>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
                <Grid
                    templateColumns={{ base: '1fr', lg: '1fr 1.2fr' }}
                    gap={8}
                    alignItems="start"
                >
                    {/* Left Side - Example */}
                    <FallInPlace delay={0.1}>
                        <VStack spacing={6} align="stretch" position="sticky" top="100px">
                            <Card
                                bg={cardBg}
                                borderWidth="1px"
                                borderColor={borderColor}
                                shadow="lg"
                                rounded="xl"
                            >
                                <CardBody p={6}>
                                    <VStack spacing={4} align="stretch">
                                        <Heading size="md" color={iconColor}>
                                            Where to find the code?
                                        </Heading>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Look for the verification code at the bottom of your certificate. It follows this format:
                                        </Text>

                                        {/* Certificate Preview with Arrow */}
                                        <Box position="relative" mt={4}>
                                            {/* Certificate Image Mockup */}
                                            <Box
                                                position="relative"
                                                borderWidth="2px"
                                                borderColor={borderColor}
                                                rounded="lg"
                                                p={8}
                                                bg={useColorModeValue('gray.50', 'gray.900')}
                                                shadow="md"
                                            >
                                                <VStack spacing={4}>
                                                    <Icon as={FiAward} boxSize={12} color={iconColor} />
                                                    <Heading size="md" textAlign="center">Certificate of Completion</Heading>
                                                    <Text fontSize="sm" color={mutedColor} textAlign="center">
                                                        This certifies that
                                                    </Text>
                                                    <Text fontWeight="bold" fontSize="lg">Student Name</Text>
                                                    <Text fontSize="sm" color={mutedColor} textAlign="center">
                                                        has successfully completed
                                                    </Text>
                                                    <Text fontWeight="semibold">Course Title</Text>
                                                    <Divider my={2} />

                                                    {/* Verification Code Section with Arrow */}
                                                    <Box w="full">
                                                        <HStack
                                                            spacing={2}
                                                            justify="center"
                                                            bg={iconBg}
                                                            p={3}
                                                            rounded="md"
                                                            borderWidth="2px"
                                                            borderColor={iconColor}
                                                            borderStyle="dashed"
                                                        >
                                                            <Icon as={FiShield} color={iconColor} />
                                                            <Text
                                                                fontFamily="mono"
                                                                fontWeight="bold"
                                                                fontSize="sm"
                                                                color={iconColor}
                                                            >
                                                                HACK-XXXXXXXX-XXXXXXXX
                                                            </Text>
                                                            <Icon as={FiArrowRight} boxSize={5} color={iconColor} />
                                                            <Text fontSize="sm" fontWeight="bold" color={iconColor}>
                                                                Verification Code
                                                            </Text>
                                                        </HStack>
                                                    </Box>
                                                </VStack>
                                            </Box>
                                        </Box>
                                    </VStack>
                                </CardBody>
                            </Card>

                            {/* Features */}
                            <SimpleGrid columns={1} spacing={3}>
                                {[
                                    { icon: FiShield, text: 'Secure & Encrypted' },
                                    { icon: FiCheckCircle, text: 'Instant Verification' },
                                    { icon: FiAward, text: 'Trusted Credentials' },
                                ].map((feature, idx) => (
                                    <HStack key={idx} spacing={3} p={3} bg={iconBg} rounded="lg">
                                        <Icon as={feature.icon} color={iconColor} boxSize={5} />
                                        <Text fontSize="sm" fontWeight="medium">
                                            {feature.text}
                                        </Text>
                                    </HStack>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </FallInPlace>

                    {/* Right Side - Verification Form */}
                    <FallInPlace delay={0.2}>
                        <Card
                            bg={cardBg}
                            borderWidth="1px"
                            borderColor={borderColor}
                            shadow="xl"
                            rounded="xl"
                        >
                            <CardBody p={{ base: 6, md: 8 }}>
                                <VStack spacing={6} align="stretch">
                                    <Heading size="lg">Enter Verification Code</Heading>

                                    {/* Verification Form */}
                                    <form onSubmit={handleVerify}>
                                        <VStack spacing={5} align="stretch">
                                            <FormControl isInvalid={!!error}>
                                                <FormLabel>Verification Code</FormLabel>
                                                <Input
                                                    name="verificationCode"
                                                    placeholder="HACK-XXXXXXXXXX-XXXXXXXX"
                                                    value={verificationCode}
                                                    onChange={handleChange}
                                                    size="lg"
                                                    bg={inputBg}
                                                    borderColor={inputBorder}
                                                    _focus={{
                                                        borderColor: 'primary.500',
                                                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                                                    }}
                                                    fontFamily="mono"
                                                    textTransform="uppercase"
                                                />
                                                {error && <FormErrorMessage>{error}</FormErrorMessage>}
                                            </FormControl>

                                            <Button
                                                type="submit"
                                                size="md"
                                                colorScheme="primary"
                                                isLoading={isVerifying}
                                                loadingText="Verifying..."
                                                leftIcon={<FiSearch />}
                                                w="full"
                                            >
                                                Verify Certificate
                                            </Button>
                                        </VStack>
                                    </form>

                                    {/* Verification Result */}
                                    {verificationResult && (
                                        <MotionBox
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Divider my={6} />

                                            {verificationResult.valid && verificationResult.certificate ? (
                                                <VStack spacing={6} align="stretch">
                                                    {/* Success Alert */}
                                                    <Alert
                                                        status={verificationResult.certificate.status === 'ISSUED' ? 'success' : 'warning'}
                                                        variant="subtle"
                                                        rounded="lg"
                                                        flexDirection="column"
                                                        py={6}
                                                    >
                                                        <Icon
                                                            as={verificationResult.certificate.status === 'ISSUED' ? FiCheckCircle : FiAward}
                                                            boxSize={16}
                                                            color={verificationResult.certificate.status === 'ISSUED' ? successColor : 'orange.500'}
                                                            mb={4}
                                                        />
                                                        <AlertTitle fontSize="2xl" mb={2}>
                                                            {verificationResult.certificate.status === 'ISSUED'
                                                                ? '✓ Certificate Verified!'
                                                                : 'Certificate Found'}
                                                        </AlertTitle>
                                                        <AlertDescription textAlign="center" fontSize="md">
                                                            {verificationResult.certificate.status === 'ISSUED'
                                                                ? 'This certificate is authentic and officially issued by HackToLive Academy.'
                                                                : 'This certificate exists but has not been issued yet.'}
                                                        </AlertDescription>
                                                    </Alert>

                                                    {/* Certificate Details */}
                                                    <Box>
                                                        <Heading size="md" mb={4}>
                                                            Certificate Details
                                                        </Heading>
                                                        <VStack spacing={3} align="stretch">
                                                            {/* Student Name */}
                                                            <Flex
                                                                p={4}
                                                                bg={iconBg}
                                                                rounded="lg"
                                                                align="center"
                                                                gap={3}
                                                            >
                                                                <Icon as={FiUser} color={iconColor} boxSize={5} />
                                                                <Box flex={1}>
                                                                    <Text fontSize="xs" color={mutedColor}>
                                                                        Student Name
                                                                    </Text>
                                                                    <Text fontWeight="semibold" fontSize="md">
                                                                        {verificationResult.certificate.studentName}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>

                                                            {/* Course Name */}
                                                            <Flex
                                                                p={4}
                                                                bg={iconBg}
                                                                rounded="lg"
                                                                align="center"
                                                                gap={3}
                                                            >
                                                                <Icon as={FiBook} color={iconColor} boxSize={5} />
                                                                <Box flex={1}>
                                                                    <Text fontSize="xs" color={mutedColor}>
                                                                        Course Name
                                                                    </Text>
                                                                    <Text fontWeight="semibold" fontSize="md">
                                                                        {verificationResult.certificate.courseName}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>

                                                            {/* Instructor */}
                                                            <Flex
                                                                p={4}
                                                                bg={iconBg}
                                                                rounded="lg"
                                                                align="center"
                                                                gap={3}
                                                            >
                                                                <Icon as={FiAward} color={iconColor} boxSize={5} />
                                                                <Box flex={1}>
                                                                    <Text fontSize="xs" color={mutedColor}>
                                                                        Instructor
                                                                    </Text>
                                                                    <Text fontWeight="semibold" fontSize="md">
                                                                        {verificationResult.certificate.instructorName}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>

                                                            {/* Issued Date */}
                                                            <Flex
                                                                p={4}
                                                                bg={iconBg}
                                                                rounded="lg"
                                                                align="center"
                                                                gap={3}
                                                            >
                                                                <Icon as={FiCalendar} color={iconColor} boxSize={5} />
                                                                <Box flex={1}>
                                                                    <Text fontSize="xs" color={mutedColor}>
                                                                        Issued Date
                                                                    </Text>
                                                                    <Text fontWeight="semibold" fontSize="md">
                                                                        {verificationResult.certificate.issuedAt
                                                                            ? formatDate(verificationResult.certificate.issuedAt)
                                                                            : 'Not issued yet'}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>

                                                            {/* Verification Code */}
                                                            <Flex
                                                                p={4}
                                                                bg={iconBg}
                                                                rounded="lg"
                                                                align="center"
                                                                gap={3}
                                                            >
                                                                <Icon as={FiShield} color={iconColor} boxSize={5} />
                                                                <Box flex={1}>
                                                                    <Text fontSize="xs" color={mutedColor}>
                                                                        Verification Code
                                                                    </Text>
                                                                    <Text fontWeight="semibold" fontFamily="mono" fontSize="md">
                                                                        {verificationResult.certificate.verificationCode}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        </VStack>

                                                        {/* Download Certificate */}
                                                        {verificationResult.certificate.certificateUrl && (
                                                            <Button
                                                                mt={6}
                                                                w="full"
                                                                size="lg"
                                                                colorScheme="primary"
                                                                leftIcon={<FiDownload />}
                                                                as="a"
                                                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${verificationResult.certificate.certificateUrl}`}
                                                                target="_blank"
                                                            >
                                                                Download Certificate
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </VStack>
                                            ) : (
                                                <Alert
                                                    status="error"
                                                    variant="subtle"
                                                    rounded="lg"
                                                    flexDirection="column"
                                                    py={6}
                                                >
                                                    <Icon as={FiXCircle} boxSize={16} color={errorColor} mb={4} />
                                                    <AlertTitle fontSize="2xl" mb={2}>
                                                        Certificate Not Found
                                                    </AlertTitle>
                                                    <AlertDescription textAlign="center" fontSize="md">
                                                        No certificate with this verification code exists in our system.
                                                        Please verify the code and try again.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </MotionBox>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    </FallInPlace>
                </Grid>
            </Container>
        </Box>
    )
}
