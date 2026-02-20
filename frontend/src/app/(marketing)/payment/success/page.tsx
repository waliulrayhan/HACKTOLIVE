"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Center,
  Divider,
  useColorModeValue,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FiCheckCircle, FiAlertCircle, FiShoppingBag, FiBookOpen, FiBook, FiGrid, FiPackage, FiShoppingCart, FiMessageCircle, FiHome } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import axios from "axios";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('verifying');
  const [message, setMessage] = useState("Verifying your payment...");
  const [paymentType, setPaymentType] = useState<'course' | 'product' | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);
  const maxRetries = 3;

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const successColor = useColorModeValue("green.500", "green.400");
  const errorColor = useColorModeValue("red.500", "red.400");
  const warningColor = useColorModeValue("orange.500", "orange.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const iconBgColor = useColorModeValue("green.50", "green.900");

  useEffect(() => {
    if (!transactionId) {
      setStatus('error');
      setMessage("Invalid payment transaction");
      setIsDataReady(true);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/verify/${transactionId}`,
          {}
        );

        // Check payment status from response
        const paymentStatus = response.data.status;
        const isShopOrder = response.data.metadata; // Cart data exists for shop orders
        
        setPaymentType(isShopOrder ? 'product' : 'course');

        if (paymentStatus === 'COMPLETED') {
          setStatus('success');
          setMessage(isShopOrder 
            ? "Your order has been confirmed and will be processed shortly."
            : "You're now enrolled in the course.");
          setIsDataReady(true);
        } else if (paymentStatus === 'VALIDATED') {
          setStatus('success');
          setMessage(isShopOrder
            ? "Your order is being processed."
            : "Your enrollment is being processed.");
          setIsDataReady(true);
        } else if (paymentStatus === 'FAILED') {
          router.push(`/payment/failed?tran_id=${transactionId}`);
        } else if (paymentStatus === 'CANCELLED') {
          router.push(`/payment/cancel?tran_id=${transactionId}`);
        } else if (paymentStatus === 'PENDING' || paymentStatus === 'PROCESSING') {
          if (retryCount < maxRetries) {
            setMessage(`Payment is being verified... (Attempt ${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000);
          } else {
            setStatus('pending');
            setMessage("Payment verification is taking longer than expected. This usually means the payment was not completed successfully. Please check your email or contact support if money was deducted.");
            setIsDataReady(true);
          }
        } else {
          setStatus('error');
          setMessage("Payment status unknown. Please check your dashboard or contact support.");
          setIsDataReady(true);
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus('error');
        setMessage(error.response?.data?.message || "Failed to verify payment. Please contact support if money was deducted.");
        setIsDataReady(true);
      }
    };

    verifyPayment();
  }, [transactionId, router, retryCount]);

  // Loading state
  if (!isDataReady) {
    return (
      <Center minH="80vh" bg={bgColor} pt={20}>
        <VStack spacing={6}>
          <Spinner size="xl" color={successColor} thickness="4px" speed="0.8s" />
          <Heading size="md" color={textColor} fontWeight="medium">
            Verifying Payment
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            {message}
          </Text>
        </VStack>
      </Center>
    );
  }

  // Error or Pending state
  if (status === 'error' || status === 'pending') {
    const iconColor = status === 'pending' ? warningColor : errorColor;
    const IconComponent = status === 'pending' ? FiAlertCircle : FiAlertCircle;

    return (
      <Center minH="80vh" bg={bgColor} pt={20}>
        <Container maxW="container.sm">
          <VStack spacing={8} py={12}>
            <Box 
              bg={iconColor}
              rounded="full" 
              p={6}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={IconComponent} boxSize={16} color="white" strokeWidth={2.5} />
            </Box>

            <VStack spacing={3} textAlign="center">
              <Heading size="lg" color={textColor} fontWeight="semibold">
                {status === 'pending' ? 'Payment Verification Pending' : 'Payment Error'}
              </Heading>
              <Text color={mutedColor} fontSize="md" maxW="md" lineHeight="tall">
                {message}
              </Text>
            </VStack>

            <Divider borderColor={dividerColor} />

            <HStack spacing={3} w="full" pt={2} justify="center" wrap="wrap">
              <ButtonLink 
                href="/academy/courses" 
                colorScheme="green" 
                size="lg"
                flex="1"
                minW="200px"
                leftIcon={<FiGrid />}
              >
                Browse Courses
              </ButtonLink>
              <ButtonLink 
                href="/contact" 
                variant="ghost"
                size="lg"
                flex="1"
                minW="200px"
                leftIcon={<FiMessageCircle />}
              >
                Contact Support
              </ButtonLink>
            </HStack>
          </VStack>
        </Container>
      </Center>
    );
  }

  // Success state
  const isCourse = paymentType === 'course';
  const TypeIcon = isCourse ? FiBookOpen : FiShoppingBag;

  return (
    <Center minH="80vh" bg={bgColor} pt={20}>
      <Container maxW="container.sm">
        <VStack spacing={8} py={12}>
          <Box 
            bg={successColor}
            rounded="full" 
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiCheckCircle} boxSize={16} color="white" strokeWidth={2.5} />
          </Box>

          <VStack spacing={3} textAlign="center">
            <Heading size="xl" color={textColor} fontWeight="bold">
              Payment Successful!
            </Heading>
            <Text color={mutedColor} fontSize="md" maxW="md" lineHeight="tall">
              {message}
            </Text>
          </VStack>

          <HStack 
            spacing={3} 
            px={6} 
            py={4} 
            bg={iconBgColor} 
            rounded="lg"
            w="full"
            justify="center"
          >
            <TypeIcon size={20} color={successColor} />
            <Text color={textColor} fontWeight="medium" fontSize="md">
              {isCourse ? 'Course Enrollment' : 'Product Order'}
            </Text>
          </HStack>

          <Divider borderColor={dividerColor} />

          <VStack spacing={1} w="full">
            <Text color={mutedColor} fontSize="md" textTransform="uppercase" letterSpacing="wider">
              Transaction ID
            </Text>
            <Text color={textColor} fontWeight="semibold" fontSize="md" fontFamily="mono">
              {transactionId}
            </Text>
          </VStack>

          <Divider borderColor={dividerColor} />

          <HStack spacing={3} w="full" pt={2} justify="center" wrap="wrap">
            {isCourse ? (
              <>
                <ButtonLink 
                  href="/student/courses" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="200px"
                  leftIcon={<FiBook />}
                >
                  Go to My Courses
                </ButtonLink>
                <ButtonLink 
                  href="/academy/courses" 
                  variant="ghost"
                  size="lg"
                  flex="1"
                  minW="200px"
                  leftIcon={<FiGrid />}
                >
                  Browse More Courses
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink 
                  href="/student/orders" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="200px"
                  leftIcon={<FiPackage />}
                >
                  View My Orders
                </ButtonLink>
                <ButtonLink 
                  href="/shopping" 
                  variant="ghost"
                  size="lg"
                  flex="1"
                  minW="200px"
                  leftIcon={<FiShoppingCart />}
                >
                  Continue Shopping
                </ButtonLink>
              </>
            )}
          </HStack>
        </VStack>
      </Container>
    </Center>
  );
}

export default function PaymentSuccessPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const successColor = useColorModeValue("green.500", "green.400");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Suspense fallback={
      <Center minH="80vh" bg={bgColor} pt={24}>
        <VStack spacing={6}>
          <Spinner size="xl" color={successColor} thickness="4px" speed="0.8s" />
          <Heading size="md" color={textColor} fontWeight="medium">
            Verifying Payment
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            Please wait...
          </Text>
        </VStack>
      </Center>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
