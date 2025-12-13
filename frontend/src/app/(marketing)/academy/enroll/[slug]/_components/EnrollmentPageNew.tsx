"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Badge,
  Icon,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Image as ChakraImage,
  SimpleGrid,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Grid,
  GridItem,
  Flex,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import Image from "next/image";
import { Link as ButtonLink } from "@saas-ui/react";
import {
  FiCheckCircle,
  FiClock,
  FiBook,
  FiVideo,
  FiAward,
  FiStar,
  FiCalendar,
  FiGift,
  FiShield,
  FiZap,
  FiCreditCard,
  FiEye,
} from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "@/components/ui/toast";
import academyService from "@/lib/academy-service";
import { Course } from "@/types/academy";
import { useAuth } from "@/context/AuthContext";
import { BackgroundGradient } from "@/components/shared/gradients/background-gradient";
import { PageTransition } from "@/components/shared/motion/page-transition";

interface EnrollmentPageProps {
  slug: string;
}

export default function EnrollmentPage({ slug }: EnrollmentPageProps) {
  const router = useRouter();
  const { user, loading: authLoading, signup: authSignup } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Color theme
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const leftBgColor = useColorModeValue("#4d7c0f", "#365314");
  const accentBg = useColorModeValue("green.50", "green.900");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
    payment: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const courseData = await academyService.getCourseBySlug(slug);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    // Pre-fill user data if logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const isFree = course?.price === 0;
  const isLoggedIn = !authLoading && !!user;

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: "",
      payment: "",
    };
    let isValid = true;

    // If not logged in, validate signup fields
    if (!isLoggedIn) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    // Validate phone for all users
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
      isValid = false;
    }

    // Validate payment for paid courses
    if (!isFree && paymentData.paymentMethod === "card") {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        newErrors.payment = "Valid card number is required";
        isValid = false;
      }
      if (!paymentData.cardName) {
        newErrors.payment = "Cardholder name is required";
        isValid = false;
      }
      if (!paymentData.expiryDate) {
        newErrors.payment = "Expiry date is required";
        isValid = false;
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        newErrors.payment = "Valid CVV is required";
        isValid = false;
      }
    }

    // Validate terms
    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!course) {
      toast.error("Course not found");
      return;
    }

    setIsSubmitting(true);

    try {
      // Case 1: User is already logged in
      if (isLoggedIn) {
        if (isFree) {
          // Free course - direct enrollment
          await academyService.enrollInCourse(course.id);
          
          toast.success("Enrollment Successful! 🎉", {
            description: "You're now enrolled in this free course.",
            duration: 5000,
          });

          // Redirect to student dashboard or course page
          setTimeout(() => {
            router.push("/student/courses");
          }, 1500);
        } else {
          // Paid course - process payment then enroll
          toast.info("Processing Payment...", {
            description: "Please wait while we process your payment.",
            duration: 3000,
          });

          await academyService.processPaymentAndEnroll(course.id, paymentData);

          toast.success("Payment Successful! 🎉", {
            description: "You're now enrolled! Check your dashboard for course access.",
            duration: 5000,
          });

          setTimeout(() => {
            router.push("/student/courses");
          }, 1500);
        }
      }
      // Case 2: User is NOT logged in - auto signup
      else {
        if (isFree) {
          // Free course - signup and enroll
          toast.info("Creating your account...", {
            description: "Setting up your account and enrolling you in the course.",
            duration: 3000,
          });

          const result = await academyService.enrollWithSignup(course.id, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          });

          toast.success("Welcome to HACKTOLIVE! 🎉", {
            description: "Your account has been created and you're enrolled in the course!",
            duration: 5000,
          });

          // Reload to update auth context
          setTimeout(() => {
            window.location.href = "/student/courses";
          }, 1500);
        } else {
          // Paid course - signup, process payment, then enroll
          toast.info("Creating your account...", {
            description: "Setting up your account and processing payment.",
            duration: 3000,
          });

          // First signup
          const result = await academyService.enrollWithSignup(course.id, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          });

          // Process payment (dummy for now)
          toast.info("Processing Payment...", {
            description: "Please wait while we process your payment.",
            duration: 2000,
          });

          await new Promise((resolve) => setTimeout(resolve, 2000));

          toast.success("Welcome & Payment Successful! 🎉", {
            description: "Your account has been created and you're enrolled!",
            duration: 5000,
          });

          setTimeout(() => {
            window.location.href = "/student/courses";
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      
      const errorMessage = error.response?.data?.message || error.message || "An error occurred";
      
      if (errorMessage.includes("already enrolled")) {
        toast.error("Already Enrolled", {
          description: "You are already enrolled in this course.",
          duration: 5000,
        });
      } else if (errorMessage.includes("already exists") || errorMessage.includes("User already exists")) {
        toast.error("Email Already Registered", {
          description: "This email is already registered. Please login instead.",
          duration: 5000,
        });
      } else {
        toast.error("Enrollment Failed", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (loading || authLoading) {
    return (
      <Container maxW="container.xl" py="20">
        <Center minH="60vh">
          <VStack spacing="4">
            <Spinner size="xl" color="green.500" thickness="4px" />
            <Text color="muted">Loading enrollment details...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxW="container.xl" py="20">
        <Center minH="60vh">
          <VStack spacing="4">
            <Heading>Course Not Found</Heading>
            <Text color="muted">The course you're trying to enroll in doesn't exist.</Text>
            <ButtonLink href="/academy/courses" colorScheme="primary">
              Browse All Courses
            </ButtonLink>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH="100vh">
      {/* Left Column - Course Summary */}
      <GridItem
        bg={leftBgColor}
        display={{ base: "none", lg: "flex" }}
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={0}
          pointerEvents="none"
          overflow="hidden"
          opacity={0.3}
        >
          {/* Geometric shapes */}
          <Box
            position="absolute"
            top="15%"
            left="15%"
            w="150px"
            h="150px"
            border="2px solid"
            borderColor="whiteAlpha.300"
            transform="rotate(45deg)"
            animation="rotateShape 20s linear infinite"
          />
          <Box
            position="absolute"
            top="60%"
            right="20%"
            w="100px"
            h="100px"
            borderRadius="50%"
            border="2px solid"
            borderColor="whiteAlpha.200"
            animation="float 15s ease-in-out infinite"
          />
          <Box
            position="absolute"
            bottom="20%"
            left="25%"
            w="80px"
            h="80px"
            border="2px solid"
            borderColor="whiteAlpha.300"
            transform="rotate(30deg)"
            animation="rotateShapeReverse 25s linear infinite"
          />
        </Box>

        {/* Course Info */}
        <VStack spacing={6} zIndex={1} px={8} maxW="lg">
          <Box
            position="relative"
            w="full"
            h="250px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="2xl"
          >
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              style={{ objectFit: "cover" }}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.400"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <VStack spacing="2">
                <Text color="white" fontSize="sm" fontWeight="semibold">
                  {isFree ? "FREE COURSE" : "PREMIUM COURSE"}
                </Text>
                <Text color="white" fontSize="4xl" fontWeight="bold">
                  {isFree ? "0 Tk" : `${course.price.toLocaleString()} Tk`}
                </Text>
              </VStack>
            </Box>
          </Box>

          <VStack spacing={3} align="stretch" w="full">
            <Heading size="lg" color="white" textAlign="center">
              {course.title}
            </Heading>

            <HStack justify="center" spacing={4} color="whiteAlpha.900">
              <HStack spacing={1}>
                <Icon as={FiStar} color="yellow.300" />
                <Text fontWeight="bold">{course.rating}</Text>
              </HStack>
              <Text>•</Text>
              <HStack spacing={1}>
                <Icon as={FiClock} />
                <Text>{course.duration}h</Text>
              </HStack>
              <Text>•</Text>
              <HStack spacing={1}>
                <Icon as={FiBook} />
                <Text>{course.totalLessons} lessons</Text>
              </HStack>
            </HStack>

            <Divider borderColor="whiteAlpha.400" />

            <VStack spacing={2} align="start" color="whiteAlpha.900">
              <Text fontSize="sm" fontWeight="semibold" color="white">
                What you'll get:
              </Text>
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.300" />
                <Text fontSize="sm">Lifetime access to course materials</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.300" />
                <Text fontSize="sm">Certificate of completion</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="green.300" />
                <Text fontSize="sm">Expert instructor support</Text>
              </HStack>
              {course.deliveryMode === "live" && (
                <HStack spacing={2}>
                  <Icon as={FiCheckCircle} color="green.300" />
                  <Text fontSize="sm">Live interactive sessions</Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </VStack>
      </GridItem>

      {/* Right Column - Enrollment Form */}
      <GridItem bg={cardBg} position="relative">
        <BackgroundGradient zIndex="-1" opacity={0.1} />

        <Flex
          minH="100vh"
          alignItems="center"
          justifyContent="center"
          px={{ base: 6, sm: 8, md: 12, lg: 16 }}
          py={{ base: 12, md: 16 }}
        >
          <PageTransition width="100%">
            <Box maxW="md" w="full" mx="auto">
              <VStack spacing={6} align="stretch">
                {/* Header */}
                <VStack spacing={2} align="center">
                  <Badge
                    colorScheme={isFree ? "green" : "purple"}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {isFree ? "Free Enrollment" : "Premium Enrollment"}
                  </Badge>
                  <Heading size="lg" textAlign="center">
                    {isLoggedIn
                      ? isFree
                        ? "Start Learning Today"
                        : "Complete Your Enrollment"
                      : "Create Account & Enroll"}
                  </Heading>
                  <Text fontSize="sm" color="muted" textAlign="center">
                    {isLoggedIn
                      ? isFree
                        ? "Click below to get instant access"
                        : "Secure your spot in this premium course"
                      : isFree
                      ? "Sign up to get instant access to this free course"
                      : "Create your account and complete payment to enroll"}
                  </Text>
                </VStack>

                {/* Free Course Alert */}
                {isFree && (
                  <Alert
                    status="success"
                    variant="subtle"
                    borderRadius="xl"
                    p={4}
                  >
                    <AlertIcon as={FiGift} boxSize={5} />
                    <Box flex="1">
                      <AlertTitle mb={1}>Free Access - No Payment Required!</AlertTitle>
                      <AlertDescription fontSize="sm">
                        {isLoggedIn
                          ? "Click enroll to start learning immediately"
                          : "Create your free account to get started"}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* Enrollment Form */}
                <form onSubmit={handleSubmit}>
                  <VStack spacing={5} align="stretch">
                    {/* Show signup fields only if not logged in */}
                    {!isLoggedIn && (
                      <>
                        <FormControl isRequired isInvalid={!!errors.name}>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            size="lg"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            borderRadius="lg"
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.email}>
                          <FormLabel>Email Address</FormLabel>
                          <Input
                            size="lg"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            borderRadius="lg"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.password}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password (min 6 characters)"
                              value={formData.password}
                              onChange={(e) => handleInputChange("password", e.target.value)}
                              borderRadius="lg"
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                icon={showPassword ? <FaEyeSlash /> : <FiEye />}
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                          <FormLabel>Confirm Password</FormLabel>
                          <InputGroup size="lg">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              borderRadius="lg"
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                icon={showConfirmPassword ? <FaEyeSlash /> : <FiEye />}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                variant="ghost"
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}

                    {/* Phone (optional for all) */}
                    <FormControl isInvalid={!!errors.phone}>
                      <FormLabel>Phone Number {!isLoggedIn && "(Optional)"}</FormLabel>
                      <Input
                        size="lg"
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        borderRadius="lg"
                        isDisabled={isLoggedIn}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>

                    {/* Payment Section - Only for Paid Courses */}
                    {!isFree && (
                      <Box
                        p={5}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="xl"
                        bg={useColorModeValue("gray.50", "gray.700")}
                      >
                        <VStack spacing={4} align="stretch">
                          <HStack>
                            <Icon as={FiCreditCard} color="purple.500" boxSize={5} />
                            <Heading size="sm">Payment Details</Heading>
                          </HStack>

                          <FormControl>
                            <FormLabel fontSize="sm">Payment Method</FormLabel>
                            <RadioGroup
                              value={paymentData.paymentMethod}
                              onChange={(value) =>
                                setPaymentData({ ...paymentData, paymentMethod: value })
                              }
                            >
                              <Stack direction="row" spacing={4}>
                                <Radio value="card" size="md">
                                  Credit/Debit Card
                                </Radio>
                                <Radio value="bkash" size="md">
                                  bKash
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>

                          {paymentData.paymentMethod === "card" && (
                            <>
                              <FormControl isRequired>
                                <FormLabel fontSize="sm">Card Number</FormLabel>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  value={paymentData.cardNumber}
                                  onChange={(e) =>
                                    setPaymentData({
                                      ...paymentData,
                                      cardNumber: e.target.value.replace(/\s/g, "").slice(0, 16),
                                    })
                                  }
                                  maxLength={19}
                                />
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="sm">Cardholder Name</FormLabel>
                                <Input
                                  placeholder="John Doe"
                                  value={paymentData.cardName}
                                  onChange={(e) =>
                                    setPaymentData({ ...paymentData, cardName: e.target.value })
                                  }
                                />
                              </FormControl>

                              <SimpleGrid columns={2} spacing={3}>
                                <FormControl isRequired>
                                  <FormLabel fontSize="sm">Expiry Date</FormLabel>
                                  <Input
                                    placeholder="MM/YY"
                                    value={paymentData.expiryDate}
                                    onChange={(e) =>
                                      setPaymentData({ ...paymentData, expiryDate: e.target.value })
                                    }
                                    maxLength={5}
                                  />
                                </FormControl>

                                <FormControl isRequired>
                                  <FormLabel fontSize="sm">CVV</FormLabel>
                                  <Input
                                    type="password"
                                    placeholder="123"
                                    value={paymentData.cvv}
                                    onChange={(e) =>
                                      setPaymentData({
                                        ...paymentData,
                                        cvv: e.target.value.slice(0, 4),
                                      })
                                    }
                                    maxLength={4}
                                  />
                                </FormControl>
                              </SimpleGrid>
                            </>
                          )}

                          {errors.payment && (
                            <Text color="red.500" fontSize="sm">
                              {errors.payment}
                            </Text>
                          )}

                          <HStack
                            p={3}
                            bg={useColorModeValue("green.50", "green.900")}
                            borderRadius="md"
                            spacing={2}
                          >
                            <Icon as={FiShield} color="green.500" boxSize={4} />
                            <Text fontSize="xs" color="muted">
                              Your payment information is secure and encrypted
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    )}

                    {/* Terms & Conditions */}
                    <FormControl isRequired isInvalid={!!errors.terms}>
                      <Checkbox
                        size="md"
                        isChecked={formData.agreeToTerms}
                        onChange={(e) => {
                          setFormData({ ...formData, agreeToTerms: e.target.checked });
                          if (e.target.checked) {
                            setErrors((prev) => ({ ...prev, terms: "" }));
                          }
                        }}
                      >
                        <Text fontSize="sm">
                          I agree to the{" "}
                          <ButtonLink href="/terms-of-service" color="blue.500">
                            Terms of Service
                          </ButtonLink>{" "}
                          and{" "}
                          <ButtonLink href="/privacy-policy" color="blue.500">
                            Privacy Policy
                          </ButtonLink>
                        </Text>
                      </Checkbox>
                      <FormErrorMessage>{errors.terms}</FormErrorMessage>
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      colorScheme="green"
                      size="lg"
                      fontSize="lg"
                      fontWeight="bold"
                      leftIcon={isFree ? <FiZap /> : <FiCreditCard />}
                      isLoading={isSubmitting}
                      loadingText={
                        isLoggedIn
                          ? isFree
                            ? "Enrolling..."
                            : "Processing..."
                          : "Creating Account..."
                      }
                      isDisabled={!formData.agreeToTerms}
                    >
                      {isLoggedIn
                        ? isFree
                          ? "Enroll for Free"
                          : `Pay ${course.price.toLocaleString()} Tk & Enroll`
                        : isFree
                        ? "Sign Up & Enroll for Free"
                        : `Sign Up & Pay ${course.price.toLocaleString()} Tk`}
                    </Button>

                    {!isFree && (
                      <Text fontSize="xs" color="muted" textAlign="center">
                        30-day money-back guarantee • Instant access after payment
                      </Text>
                    )}

                    {/* Login Link for non-logged in users */}
                    {!isLoggedIn && (
                      <>
                        <Divider />
                        <Text textAlign="center" fontSize="sm" color="muted">
                          Already have an account?{" "}
                          <ButtonLink
                            href={`/login?redirect=/academy/enroll/${slug}`}
                            color="blue.500"
                            fontWeight="semibold"
                          >
                            Log in
                          </ButtonLink>
                        </Text>
                      </>
                    )}
                  </VStack>
                </form>
              </VStack>
            </Box>
          </PageTransition>
        </Flex>
      </GridItem>
    </Grid>
  );
}
