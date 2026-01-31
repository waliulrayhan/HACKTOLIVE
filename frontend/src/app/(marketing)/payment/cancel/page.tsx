"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");

  return (
    <Container maxW="container.md" py="20">
      <VStack spacing="6" textAlign="center">
        <Icon as={FiAlertCircle} boxSize="20" color="orange.500" />
        <Heading size="xl">Payment Cancelled</Heading>
        <Text fontSize="lg" color="muted" maxW="md">
          You have cancelled the payment process. No charges have been made to your account.
        </Text>
        {transactionId && (
          <Text color="muted" fontSize="sm">
            Transaction ID: <Text as="span" fontWeight="bold">{transactionId}</Text>
          </Text>
        )}
        <VStack spacing="3" pt="4">
          <ButtonLink href="/academy/courses" colorScheme="green" size="lg">
            Browse Courses
          </ButtonLink>
          <ButtonLink href="/shopping" colorScheme="green" size="lg">
            Continue Shopping
          </ButtonLink>
          <ButtonLink href="/student/dashboard" variant="ghost">
            Go to Dashboard
          </ButtonLink>
        </VStack>
      </VStack>
    </Container>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <Container maxW="container.md" py="20">
        <Center>
          <Spinner size="xl" color="orange.500" thickness="4px" />
        </Center>
      </Container>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
