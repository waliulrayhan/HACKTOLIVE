"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("No email address provided");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/newsletter/unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "You have been successfully unsubscribed from our newsletter.");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to unsubscribe. Please try again.");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={20}>
      <Container maxW="container.md">
        <VStack
          spacing={8}
          bg={bgColor}
          p={10}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          {status === "idle" && (
            <>
              <Heading size="xl">Unsubscribe from Newsletter</Heading>
              <Text fontSize="lg" color="gray.600">
                We're sorry to see you go! Are you sure you want to unsubscribe from our newsletter?
              </Text>
              {email && (
                <Text fontSize="md" color="gray.500">
                  Email: <strong>{email}</strong>
                </Text>
              )}
              <VStack spacing={3} pt={4}>
                <Button
                  colorScheme="red"
                  size="lg"
                  onClick={handleUnsubscribe}
                  isLoading={loading}
                  loadingText="Unsubscribing..."
                >
                  Unsubscribe
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => window.location.href = "/"}
                >
                  Keep Subscription
                </Button>
              </VStack>
            </>
          )}

          {status === "success" && (
            <>
              <Icon as={FiCheckCircle} boxSize={20} color="green.500" />
              <Heading size="xl">Successfully Unsubscribed</Heading>
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Done!</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Box>
              </Alert>
              <Text fontSize="md" color="gray.600">
                You will no longer receive emails from us. If you change your mind, you can always
                subscribe again from our website.
              </Text>
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => window.location.href = "/"}
              >
                Return to Homepage
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Icon as={FiXCircle} boxSize={20} color="red.500" />
              <Heading size="xl">Oops! Something went wrong</Heading>
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Box>
              </Alert>
              <VStack spacing={3} pt={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleUnsubscribe}
                  isLoading={loading}
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => window.location.href = "/"}
                >
                  Return to Homepage
                </Button>
              </VStack>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
