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
import { FiXCircle } from "react-icons/fi";
import { ButtonLink } from "@/components/shared/button-link/button-link";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tran_id");

  return (
    <Container maxW="container.md" py="20">
      <VStack spacing="6" textAlign="center">
        <Icon as={FiXCircle} boxSize="20" color="red.500" />
        <Heading size="xl">Payment Failed</Heading>
        <Text fontSize="lg" color="muted" maxW="md">
          Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.
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
          <ButtonLink href="/contact" variant="ghost">
            Contact Support
          </ButtonLink>
        </VStack>
      </VStack>
    </Container>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <Container maxW="container.md" py="20">
        <Center>
          <Spinner size="xl" color="red.500" thickness="4px" />
        </Center>
      </Container>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
