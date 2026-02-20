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
import { FiAlertCircle, FiShoppingBag, FiBookOpen, FiGrid, FiHome, FiShoppingCart, FiPackage } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import axios from "axios";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");
  const [paymentType, setPaymentType] = useState<'course' | 'product' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const warningColor = useColorModeValue("orange.500", "orange.400");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const warningBgColor = useColorModeValue("orange.50", "orange.900");

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
      <Center minH="80vh" bg={bgColor} pt={24}>
        <VStack spacing={6}>
          <Spinner size="xl" color={warningColor} thickness="4px" speed="0.8s" />
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
            bg={warningColor}
            rounded="full" 
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiAlertCircle} boxSize={16} color="white" strokeWidth={2.5} />
          </Box>

          <VStack spacing={3} textAlign="center">
            <Heading size="xl" color={textColor} fontWeight="bold">
              Payment Cancelled
            </Heading>
            <Text color={mutedColor} fontSize="md" maxW="md" lineHeight="tall">
              You have cancelled the payment process. No charges have been made to your account.
            </Text>
          </VStack>

          {paymentType && (
            <HStack 
              spacing={3} 
              px={6} 
              py={4} 
              bg={warningBgColor} 
              rounded="lg"
              w="full"
              justify="center"
            >
              <TypeIcon size={20} color={warningColor} />
              <Text color={textColor} fontWeight="medium" fontSize="sm">
                {isCourse ? 'Course Enrollment Cancelled' : 'Product Order Cancelled'}
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
              href="/student/dashboard" 
              variant="ghost"
              size="lg"
              flex="1"
              minW="180px"
              leftIcon={<FiHome />}
            >
              Go to Dashboard
            </ButtonLink>
          </HStack>
        </VStack>
      </Container>
    </Center>
  );
}

export default function PaymentCancelPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const warningColor = useColorModeValue("orange.500", "orange.400");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Suspense fallback={
      <Center minH="80vh" bg={bgColor} pt={24}>
        <VStack spacing={6}>
          <Spinner size="xl" color={warningColor} thickness="4px" speed="0.8s" />
          <Heading size="md" color={textColor} fontWeight="medium">
            Loading Payment Details
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            Please wait...
          </Text>
        </VStack>
      </Center>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
