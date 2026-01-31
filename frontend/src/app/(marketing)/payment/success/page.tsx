"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Button,
  Spinner,
  Center,
  Box,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";
import axios from "axios";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'pending'>('verifying');
  const [message, setMessage] = useState("Verifying your payment...");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (!transactionId) {
      setStatus('error');
      setMessage("Invalid payment transaction");
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

        if (paymentStatus === 'COMPLETED') {
          setStatus('success');
          setMessage("Payment successful! You're now enrolled in the course.");
        } else if (paymentStatus === 'VALIDATED') {
          setStatus('success');
          setMessage("Payment validated! Your enrollment is being processed.");
        } else if (paymentStatus === 'FAILED') {
          // Redirect to failed page
          router.push(`/payment/failed?tran_id=${transactionId}`);
        } else if (paymentStatus === 'CANCELLED') {
          // Redirect to cancel page
          router.push(`/payment/cancel?tran_id=${transactionId}`);
        } else if (paymentStatus === 'PENDING' || paymentStatus === 'PROCESSING') {
          // Payment is still being processed - retry a few times
          if (retryCount < maxRetries) {
            setMessage(`Payment is being verified... (Attempt ${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 2000); // Retry after 2 seconds
          } else {
            setStatus('pending');
            setMessage("Payment verification is taking longer than expected. This usually means the payment was not completed successfully. Please check your email or contact support if money was deducted.");
          }
        } else {
          setStatus('error');
          setMessage("Payment status unknown. Please check your dashboard or contact support.");
        }
      } catch (error: any) {
        console.error("Payment verification error:", error);
        setStatus('error');
        setMessage(error.response?.data?.message || "Failed to verify payment. Please contact support if money was deducted.");
      }
    };

    verifyPayment();
  }, [transactionId, router, retryCount]);

  if (status === 'verifying') {
    return (
      <Container maxW="container.md" py="20">
        <Center>
          <VStack spacing="6">
            <Spinner size="xl" color="green.500" thickness="4px" />
            <Heading size="lg">Verifying Payment</Heading>
            <Text color="muted">{message}</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  if (status === 'error' || status === 'pending') {
    return (
      <Container maxW="container.md" py="20">
        <Center>
          <VStack spacing="6">
            <Icon as={FiCheckCircle} boxSize="16" color={status === 'pending' ? "orange.500" : "red.500"} />
            <Heading size="lg">{status === 'pending' ? 'Payment Pending' : 'Payment Error'}</Heading>
            <Text color="muted" textAlign="center">{message}</Text>
            <VStack spacing="3" pt="4">
              <ButtonLink href="/academy/courses" colorScheme="primary">
                Browse Courses
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Contact Support
              </ButtonLink>
            </VStack>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py="20">
      <Center>
        <VStack spacing="6" textAlign="center">
          <Icon as={FiCheckCircle} boxSize="20" color="green.500" />
          <Heading size="xl">Payment Successful! 🎉</Heading>
          <Text fontSize="lg" color="muted" maxW="md">
            {message}
          </Text>
          <Text color="muted">
            Transaction ID: <Text as="span" fontWeight="bold">{transactionId}</Text>
          </Text>
          <VStack spacing="3" pt="4">
            <ButtonLink href="/student/courses" colorScheme="green" size="lg">
              Go to My Courses
            </ButtonLink>
            <ButtonLink href="/academy/courses" variant="ghost">
              Browse More Courses
            </ButtonLink>
          </VStack>
        </VStack>
      </Center>
    </Container>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <Container maxW="container.md" py="20">
        <Center>
          <VStack spacing="6">
            <Spinner size="xl" color="green.500" thickness="4px" />
            <Heading size="lg">Verifying Payment</Heading>
            <Text color="muted">Please wait...</Text>
          </VStack>
        </Center>
      </Container>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
