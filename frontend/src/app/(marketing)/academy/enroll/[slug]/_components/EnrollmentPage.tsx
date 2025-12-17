"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListIcon,
  Flex,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Radio,
  RadioGroup,
  Spinner,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
} from "@chakra-ui/react";
import { toast } from '@/components/ui/toast'
import Image from "next/image";
import { Course } from "@/types/academy";
import { FallInPlace } from "@/components/shared/motion/fall-in-place";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import {
  FiCheckCircle,
  FiClock,
  FiBook,
  FiAward,
  FiUsers,
  FiStar,
  FiVideo,
  FiCalendar,
  FiCreditCard,
  FiShield,
  FiZap,
  FiGift,
  FiLock,
  FiEye,
  FiUser
} from "react-icons/fi";
import { FaEyeSlash } from "react-icons/fa";
import academyService from "@/lib/academy-service";
import { useAuth } from "@/context/AuthContext";

interface EnrollmentPageProps {
  slug: string;
}

export default function EnrollmentPage({ slug }: EnrollmentPageProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentBg = useColorModeValue("green.50", "green.900");
  const accentColor = useColorModeValue("green.600", "green.300");

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
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    message: "",
    agreeToTerms: false,
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    couponCode: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course) {
      toast.error("Course not found");
      return;
    }

    // Validation for non-logged in users
    if (!isLoggedIn) {
      const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
      let hasError = false;

      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        hasError = true;
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        hasError = true;
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
        hasError = true;
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        hasError = true;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        hasError = true;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        hasError = true;
      }

      if (hasError) {
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Case 1: User is already logged in
      if (isLoggedIn) {
        if (isFree) {
          await academyService.enrollInCourse(course.id);
          toast.success("Enrollment Successful! 🎉", {
            description: "You're now enrolled in this free course.",
            duration: 5000,
          });
          setTimeout(() => router.push("/student/courses"), 1500);
        } else {
          toast.info("Processing Payment...", {
            description: "Please wait while we process your payment.",
            duration: 3000,
          });
          await academyService.processPaymentAndEnroll(course.id, paymentData);
          toast.success("Payment Successful! 🎉", {
            description: "You're now enrolled! Check your dashboard for course access.",
            duration: 5000,
          });
          setTimeout(() => router.push("/student/courses"), 1500);
        }
      }
      // Case 2: User is NOT logged in - auto signup
      else {
        if (isFree) {
          toast.info("Creating your account...", {
            description: "Setting up your account and enrolling you in the course.",
            duration: 3000,
          });
          await academyService.enrollWithSignup(course.id, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          });
          toast.success("Welcome to HACKTOLIVE! 🎉", {
            description: "Your account has been created and you're enrolled in the course!",
            duration: 5000,
          });
          setTimeout(() => window.location.href = "/student/courses", 1500);
        } else {
          toast.info("Creating your account...", {
            description: "Setting up your account and processing payment.",
            duration: 3000,
          });
          await academyService.enrollWithSignup(course.id, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          });
          toast.info("Processing Payment...", {
            description: "Please wait while we process your payment.",
            duration: 2000,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          toast.success("Welcome & Payment Successful! 🎉", {
            description: "Your account has been created and you're enrolled!",
            duration: 5000,
          });
          setTimeout(() => window.location.href = "/student/courses", 1500);
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

  if (loading) {
    return (
      <Container maxW="container.xl" py="20">
        <Center>
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
        <Center>
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
    <Box>
      {/* Header */}
      <Box 
        mt={{ base: "14", md: "16" }}
        py={{ base: "8", md: "12" }}
        bg={isFree ? accentBg : bgColor} 
        borderBottomWidth="1px"
        borderColor={borderColor}
        sx={{ scrollMarginTop: "var(--navbar-height, 80px)" }}
      >
        <Container maxW="container.xl">
          <FallInPlace>
            <VStack spacing="4" align="start">
              <ButtonLink href={`/academy/courses/${course.slug}`} variant="link" colorScheme="primary">
                ← Back to Course
              </ButtonLink>
              <HStack spacing="3">
                <Badge 
                  colorScheme={isFree ? "green" : "purple"} 
                  fontSize="sm" 
                  px="3" 
                  py="1" 
                  borderRadius="md"
                >
                  {isFree ? "Free Course" : "Premium Course"}
                </Badge>
                {course.deliveryMode === "live" && (
                  <Badge colorScheme="red" fontSize="sm" px="3" py="1" borderRadius="md">
                    <HStack spacing="1">
                      <Icon as={FiVideo} />
                      <Text>Live Classes</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                {isLoggedIn
                  ? (isFree ? "Start Learning Today" : "Complete Your Enrollment")
                  : "Create Account & Enroll"
                }
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="muted">
                {isLoggedIn
                  ? (isFree 
                      ? "Click below to get instant access to this free course"
                      : "Secure your spot in this premium course and unlock expert-led content")
                  : (isFree
                      ? "Create your free account to get instant access to this course"
                      : "Create your account and complete payment to enroll in this premium course")
                }
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Main Content */}
      <Box py={{ base: "12", md: "20" }}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: "8", lg: "12" }}>
            {/* Enrollment Form */}
            <Box gridColumn={{ lg: "span 2" }}>
              <VStack spacing="6" align="stretch">
                {/* Benefits Alert for Free Courses */}
                {isFree && (
                  <FallInPlace>
                    <Alert
                      status="success"
                      variant="subtle"
                      borderRadius="xl"
                      p="4"
                    >
                      <AlertIcon as={FiGift} boxSize="5" />
                      <Box flex="1">
                        <AlertTitle mb="1">Free Access - No Payment Required!</AlertTitle>
                      </Box>
                    </Alert>
                  </FallInPlace>
                )}

                {/* Student Information */}
                <FallInPlace>
                  <Box p={{ base: "2", md: "8" }}>
                    <VStack spacing="6" align="stretch">
                      <HStack>
                        <Icon as={FiUsers} boxSize="5" color="primary.500" />
                        <Heading size="lg">Student Information</Heading>
                      </HStack>
                      
                      <form onSubmit={handleSubmit} id="enrollment-form">
                        <VStack spacing="5" align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                            <FormControl isRequired isInvalid={!!errors.name}>
                              <FormLabel fontWeight="semibold">Full Name</FormLabel>
                              <Input
                                size="lg"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => {
                                  setFormData({ ...formData, name: e.target.value });
                                  setErrors({ ...errors, name: "" });
                                }}
                                borderRadius="lg"
                                isDisabled={isLoggedIn}
                              />
                              <FormErrorMessage>{errors.name}</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontWeight="semibold">Phone Number</FormLabel>
                              <Input
                                size="lg"
                                type="tel"
                                placeholder="+8801XXXXXXXXX"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                borderRadius="lg"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <FormControl isRequired isInvalid={!!errors.email}>
                            <FormLabel fontWeight="semibold">Email Address</FormLabel>
                            <Input
                              size="lg"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                setErrors({ ...errors, email: "" });
                              }}
                              borderRadius="lg"
                              isDisabled={isLoggedIn}
                            />
                            <Text fontSize="xs" color="muted" mt="1">
                              We'll send course access and updates to this email
                            </Text>
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>

                          {/* Password fields for non-logged in users */}
                          {!isLoggedIn && (
                            <>
                              <FormControl isRequired isInvalid={!!errors.password}>
                                <FormLabel fontWeight="semibold">Password</FormLabel>
                                <InputGroup size="lg">
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password (min 6 characters)"
                                    value={formData.password}
                                    onChange={(e) => {
                                      setFormData({ ...formData, password: e.target.value });
                                      setErrors({ ...errors, password: "" });
                                    }}
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
                                <FormLabel fontWeight="semibold">Confirm Password</FormLabel>
                                <InputGroup size="lg">
                                  <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                      setFormData({ ...formData, confirmPassword: e.target.value });
                                      setErrors({ ...errors, confirmPassword: "" });
                                    }}
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

                          {!isFree && (
                            <FormControl>
                              <FormLabel fontWeight="semibold">Additional Notes (Optional)</FormLabel>
                              <Textarea
                                placeholder="Any questions or special requirements?"
                                rows={3}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                borderRadius="lg"
                              />
                            </FormControl>
                          )}
                        </VStack>
                      </form>
                    </VStack>
                  </Box>
                </FallInPlace>

                {/* Payment Section - Only for Paid Courses */}
                {!isFree && (
                  <FallInPlace delay={0.1}>
                    <Box p={{ base: "2", md: "8" }}>
                      <VStack spacing="6" align="stretch">
                        <HStack>
                          <Icon as={FiCreditCard} boxSize="5" color="purple.500" />
                          <Heading size="lg">Payment Details</Heading>
                        </HStack>

                        <VStack spacing="5" align="stretch">
                          {/* Payment Method */}
                          <FormControl>
                            <FormLabel fontWeight="semibold">Payment Method</FormLabel>
                            <RadioGroup 
                              value={paymentData.paymentMethod}
                              onChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                            >
                              <Stack spacing="3">
                                <Radio value="card" size="lg">
                                  <HStack>
                                    <Icon as={FiCreditCard} />
                                    <Text>Credit / Debit Card</Text>
                                  </HStack>
                                </Radio>
                                <Radio value="upi" size="lg">
                                  <HStack>
                                    <Icon as={FiZap} />
                                    <Text>UPI / Net Banking</Text>
                                  </HStack>
                                </Radio>
                              </Stack>
                            </RadioGroup>
                          </FormControl>

                          {paymentData.paymentMethod === "card" && (
                            <>
                              <FormControl isRequired>
                                <FormLabel fontWeight="semibold">Card Number</FormLabel>
                                <Input
                                  size="lg"
                                  placeholder="1234 5678 9012 3456"
                                  value={paymentData.cardNumber}
                                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                  borderRadius="lg"
                                  maxLength={19}
                                />
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontWeight="semibold">Cardholder Name</FormLabel>
                                <Input
                                  size="lg"
                                  placeholder="JOHN DOE"
                                  value={paymentData.cardName}
                                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                                  borderRadius="lg"
                                  textTransform="uppercase"
                                />
                              </FormControl>

                              <SimpleGrid columns={2} spacing="4">
                                <FormControl isRequired>
                                  <FormLabel fontWeight="semibold">Expiry Date</FormLabel>
                                  <Input
                                    size="lg"
                                    placeholder="MM/YY"
                                    value={paymentData.expiryDate}
                                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                                    borderRadius="lg"
                                    maxLength={5}
                                  />
                                </FormControl>

                                <FormControl isRequired>
                                  <FormLabel fontWeight="semibold">CVV</FormLabel>
                                  <Input
                                    size="lg"
                                    type="password"
                                    placeholder="123"
                                    value={paymentData.cvv}
                                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                                    borderRadius="lg"
                                    maxLength={3}
                                  />
                                </FormControl>
                              </SimpleGrid>
                            </>
                          )}

                          {/* Coupon Code */}
                          <FormControl>
                            <FormLabel fontWeight="semibold">Coupon Code (Optional)</FormLabel>
                            <HStack>
                              <Input
                                size="lg"
                                placeholder="Enter coupon code"
                                value={paymentData.couponCode}
                                onChange={(e) => setPaymentData({ ...paymentData, couponCode: e.target.value })}
                                borderRadius="lg"
                                textTransform="uppercase"
                              />
                              <Button colorScheme="green" size="md" px="8">
                                Apply
                              </Button>
                            </HStack>
                          </FormControl>

                          {/* Security Notice */}
                          <HStack 
                            p="4" 
                            bg={useColorModeValue("gray.50", "gray.700")} 
                            borderRadius="lg"
                            spacing="3"
                          >
                            <Icon as={FiShield} color="green.500" boxSize="5" />
                            <Text fontSize="sm" color="muted">
                              Your payment information is secured with 256-bit SSL encryption
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </Box>
                  </FallInPlace>
                )}

                {/* Terms & Submit */}
                <FallInPlace delay={isFree ? 0.1 : 0.2}>
                  <Box bg={cardBg} p={{ base: "6", md: "8" }} borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                    <VStack spacing="5" align="stretch">
                      <FormControl isRequired>
                        <Checkbox
                          size="lg"
                          isChecked={formData.agreeToTerms}
                          onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                        >
                          <Text fontSize="sm">
                            I agree to the{" "}
                            <Text as="span" color="primary.500" fontWeight="semibold" textDecoration="underline">
                              Terms of Service
                            </Text>
                            {" "}and{" "}
                            <Text as="span" color="primary.500" fontWeight="semibold" textDecoration="underline">
                              Privacy Policy
                            </Text>
                          </Text>
                        </Checkbox>
                      </FormControl>

                      <Button
                        type="submit"
                        form="enrollment-form"
                        colorScheme={isFree ? "green" : "green"}
                        size={{ base: "md", md: "xl", lg: "lg" }}
                        fontSize="lg"
                        fontWeight="bold"
                        leftIcon={isFree ? <FiZap /> : <FiLock />}
                        isLoading={isSubmitting}
                        loadingText={isLoggedIn ? (isFree ? "Enrolling..." : "Processing...") : "Creating Account..."}
                        isDisabled={
                          !formData.agreeToTerms || 
                          !formData.name || 
                          !formData.email || 
                          !formData.phone ||
                          (!isLoggedIn && (!formData.password || !formData.confirmPassword)) ||
                          (!isFree && paymentData.paymentMethod === "card" && (
                            !paymentData.cardNumber ||
                            !paymentData.cardName ||
                            !paymentData.expiryDate ||
                            !paymentData.cvv
                          ))
                        }
                      >
                        {isLoggedIn
                          ? (isFree 
                              ? "Start Learning for Free" 
                              : `Complete Payment - ${course.price.toLocaleString()} Tk`)
                          : (isFree
                              ? "Sign Up & Enroll for Free"
                              : `Sign Up & Pay ${course.price.toLocaleString()} Tk`)
                        }
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
                              color="primary.500"
                              fontWeight="semibold"
                            >
                              Log in
                            </ButtonLink>
                          </Text>
                        </>
                      )}
                    </VStack>
                  </Box>
                </FallInPlace>
              </VStack>
            </Box>

            {/* Course Summary Sidebar */}
            <VStack spacing="6" align="stretch">
              {/* Price Summary Card */}
              <FallInPlace delay={0.2}>
                <Box 
                  bg={cardBg} 
                  borderRadius="2xl" 
                  overflow="hidden" 
                  borderWidth="2px" 
                  borderColor={isFree ? "green.500" : "purple.500"}
                  position="sticky"
                  top="calc(var(--navbar-height, 80px) + 20px)"
                >
                  <Box 
                    position="relative" 
                    h="200px"
                    overflow="hidden"
                  >
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={400}
                      height={200}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                        <Text color="white" fontSize="3xl" fontWeight="bold">
                          {isFree ? "0 Tk" : `${course.price.toLocaleString()} Tk`}
                        </Text>
                      </VStack>
                    </Box>
                  </Box>
                  
                  <VStack p="6" spacing="4" align="stretch">
                    <Heading size="md" noOfLines={2}>{course.title}</Heading>
                    
                    <HStack spacing="4" fontSize="sm">
                      <HStack spacing="1">
                        <Icon as={FiStar} color="yellow.500" />
                        <Text fontWeight="bold">{course.rating}</Text>
                        <Text color="muted">({course.totalStudents.toLocaleString()})</Text>
                      </HStack>
                    </HStack>

                    <Divider />

                    {/* Course Features */}
                    <VStack spacing="3" align="stretch" fontSize="sm">
                      <HStack justify="space-between">
                        <HStack spacing="2" color="muted">
                          <Icon as={FiClock} />
                          <Text>Duration</Text>
                        </HStack>
                        <Text fontWeight="semibold">
                          {course.duration} hours
                        </Text>
                      </HStack>
                      
                      <HStack justify="space-between">
                        <HStack spacing="2" color="muted">
                          <Icon as={FiBook} />
                          <Text>Lessons</Text>
                        </HStack>
                        <Text fontWeight="semibold">{course.totalLessons} videos</Text>
                      </HStack>

                      <HStack justify="space-between">
                        <HStack spacing="2" color="muted">
                          <Icon as={FiVideo} />
                          <Text>Mode</Text>
                        </HStack>
                        <Badge colorScheme={course.deliveryMode === "live" ? "red" : "blue"}>
                          {course.deliveryMode === "live" ? "Live" : "Recorded"}
                        </Badge>
                      </HStack>

                      {course.deliveryMode === "live" && course.liveSchedule && (
                        <HStack justify="space-between">
                          <HStack spacing="2" color="muted">
                            <Icon as={FiCalendar} />
                            <Text>Schedule</Text>
                          </HStack>
                          <Text fontWeight="semibold" fontSize="xs" textAlign="right">
                            {course.liveSchedule}
                          </Text>
                        </HStack>
                      )}

                      <HStack justify="space-between">
                        <HStack spacing="2" color="muted">
                          <Icon as={FiAward} />
                          <Text>Certificate</Text>
                        </HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                      </HStack>
                    </VStack>

                    {!isFree && (
                      <>
                        <Divider />
                        <VStack 
                          spacing="2" 
                          p="4" 
                          bg={useColorModeValue("green.50", "green.900")}
                          borderRadius="lg"
                        >
                          <Text fontSize="xs" color="muted" textTransform="uppercase" fontWeight="bold">
                            This Course Includes
                          </Text>
                          <List spacing="2" fontSize="xs" w="full">
                            <ListItem>
                              <ListIcon as={FiCheckCircle} color="purple.500" />
                              Lifetime access
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiCheckCircle} color="purple.500" />
                              30-day money-back guarantee
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiCheckCircle} color="purple.500" />
                              Certificate of completion
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FiCheckCircle} color="purple.500" />
                              Direct instructor support
                            </ListItem>
                          </List>
                        </VStack>
                      </>
                    )}
                  </VStack>
                </Box>
              </FallInPlace>

              {/* What You'll Learn */}
              <FallInPlace delay={0.3}>
                <Box bg={cardBg} p="6" borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" boxSize="5" />
                      <Heading size="md">What You'll Learn</Heading>
                    </HStack>
                    <List spacing="2.5">
                      {course.learningOutcomes.slice(0, 6).map((outcome, index) => (
                        <ListItem key={index} fontSize="sm" display="flex" alignItems="flex-start">
                          <ListIcon as={FiCheckCircle} color="green.500" mt="0.5" />
                          <Text flex="1">{outcome}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </VStack>
                </Box>
              </FallInPlace>

              {/* Instructor */}
              <FallInPlace delay={0.4}>
                <Box bg={cardBg} p="6" borderRadius="2xl" borderWidth="1px" borderColor={borderColor}>
                  <VStack spacing="4" align="stretch">
                    <HStack>
                      <Icon as={FiUsers} color="primary.500" boxSize="5" />
                      <Heading size="md">Your Instructor</Heading>
                    </HStack>
                    <Flex gap="4">
                      {course.instructor.avatar ? (
                        <Image
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          width={70}
                          height={70}
                          style={{ borderRadius: "12px", objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          w="70px"
                          h="70px"
                          borderRadius="12px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg={useColorModeValue('gray.200', 'gray.700')}
                        >
                          <Icon as={FiUser} boxSize="35px" color={useColorModeValue('gray.500', 'gray.400')} />
                        </Box>
                      )}
                      <VStack align="start" spacing="1" flex="1">
                        <Text fontWeight="bold" fontSize="lg">{course.instructor.name}</Text>
                        <Text fontSize="sm" color="muted" noOfLines={2}>
                          {course.instructor.experience}
                        </Text>
                        <HStack spacing="4" fontSize="xs" color="muted" mt="1">
                          <HStack spacing="1">
                            <Icon as={FiStar} color="yellow.500" />
                            <Text fontWeight="semibold">{course.instructor.rating}</Text>
                          </HStack>
                          <HStack spacing="1">
                            <Icon as={FiUsers} />
                            <Text>{course.instructor.totalStudents.toLocaleString()}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Flex>
                  </VStack>
                </Box>
              </FallInPlace>

              {/* Trust Indicators */}
              <FallInPlace delay={0.5}>
                <Box 
                  bg={useColorModeValue("gray.50", "gray.700")} 
                  p="6" 
                  borderRadius="2xl"
                  textAlign="center"
                >
                  <VStack spacing="3">
                    <Icon as={FiShield} boxSize="8" color="green.500" />
                    <Heading size="sm">Secure Enrollment</Heading>
                    <Text fontSize="xs" color="muted">
                      Your data is protected with enterprise-grade security. 
                      {!isFree && " All payments are processed securely."}
                    </Text>
                  </VStack>
                </Box>
              </FallInPlace>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}
