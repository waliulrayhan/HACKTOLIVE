"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { FiXCircle, FiShoppingBag, FiBookOpen, FiAlertTriangle, FiGrid, FiHome, FiShoppingCart, FiPackage, FiMessageCircle } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import axios from "axios";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");
  const [paymentType, setPaymentType] = useState<'course' | 'product' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const errorColor = useColorModeValue("red.500", "red.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const errorBgColor = useColorModeValue("red.50", "red.900");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!transactionId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/payment/status/${transactionId}`
        );
        
        const isShopOrder = response.data.metadata;
        setPaymentType(isShopOrder ? 'product' : 'course');
        setErrorMessage(response.data.error_message || null);
      } catch (error) {
        console.error("Failed to fetch payment details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [transactionId]);

  // Loading state
  if (isLoading) {
    return (
      <Center minH="80vh" bg={bgColor} pt={20}>
        <VStack spacing={6}>
          <Spinner size="xl" color={errorColor} thickness="4px" speed="0.8s" />
          <Heading size="md" color={textColor} fontWeight="medium">
            Loading Payment Details
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            Please wait...
          </Text>
        </VStack>
      </Center>
    );
  }

  const isCourse = paymentType === 'course';
  const TypeIcon = isCourse ? FiBookOpen : FiShoppingBag;

  return (
    <Center minH="80vh" bg={bgColor} pt={20}>
      <Container maxW="container.sm">
        <VStack spacing={8} py={12}>
          <Box 
            bg={errorColor}
            rounded="full" 
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiXCircle} boxSize={16} color="white" strokeWidth={2.5} />
          </Box>

          <VStack spacing={3} textAlign="center">
            <Heading size="xl" color={textColor} fontWeight="bold">
              Payment Failed
            </Heading>
            <Text color={mutedColor} fontSize="md" maxW="md" lineHeight="tall">
              Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
            </Text>
          </VStack>

          {paymentType && (
            <HStack 
              spacing={3} 
              px={6} 
              py={4} 
              bg={errorBgColor} 
              rounded="lg"
              w="full"
              justify="center"
            >
              <TypeIcon size={20} color={errorColor} />
              <Text color={textColor} fontWeight="medium" fontSize="sm">
                {isCourse ? 'Course Enrollment Failed' : 'Product Order Failed'}
              </Text>
            </HStack>
          )}

          {errorMessage && (
            <HStack 
              spacing={3} 
              px={4} 
              py={3} 
              bg={errorBgColor} 
              rounded="md"
              w="full"
              align="start"
            >
              <FiAlertTriangle size={18} color={errorColor} style={{ flexShrink: 0, marginTop: '2px' }} />
              <Text color={mutedColor} fontSize="xs" lineHeight="tall">
                {errorMessage}
              </Text>
            </HStack>
          )}

          {transactionId && (
            <>
              <Divider borderColor={dividerColor} />
              <VStack spacing={2} w="full">
                <Text color={mutedColor} fontSize="md" textTransform="uppercase" letterSpacing="wider">
                  Transaction ID
                </Text>
                <Text color={textColor} fontWeight="semibold" fontSize="md" fontFamily="mono">
                  {transactionId}
                </Text>
              </VStack>
            </>
          )}

          <Divider borderColor={dividerColor} />

          <HStack spacing={3} w="full" pt={2} justify="center" wrap="wrap">
            {isCourse ? (
              <>
                <ButtonLink 
                  href="/academy/courses" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiGrid />}
                >
                  Browse Courses
                </ButtonLink>
                <ButtonLink 
                  href="/student/dashboard" 
                  variant="ghost"
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiHome />}
                >
                  Go to Dashboard
                </ButtonLink>
              </>
            ) : paymentType === 'product' ? (
              <>
                <ButtonLink 
                  href="/shopping" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiShoppingCart />}
                >
                  Continue Shopping
                </ButtonLink>
                <ButtonLink 
                  href="/student/orders" 
                  variant="ghost"
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiPackage />}
                >
                  View My Orders
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink 
                  href="/academy/courses" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiGrid />}
                >
                  Browse Courses
                </ButtonLink>
                <ButtonLink 
                  href="/shopping" 
                  colorScheme="green" 
                  size="lg"
                  flex="1"
                  minW="180px"
                  leftIcon={<FiShoppingCart />}
                >
                  Continue Shopping
                </ButtonLink>
              </>
            )}
            <ButtonLink 
              href="/contact" 
              variant="ghost"
              size="lg"
              flex="1"
              minW="180px"
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

export default function PaymentFailedPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const errorColor = useColorModeValue("red.500", "red.400");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Suspense fallback={
      <Center minH="80vh" bg={bgColor} pt={24}>
        <VStack spacing={6}>
          <Spinner size="xl" color={errorColor} thickness="4px" speed="0.8s" />
          <Heading size="md" color={textColor} fontWeight="medium">
            Loading Payment Details
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            Please wait...
          </Text>
        </VStack>
      </Center>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
