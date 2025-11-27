"use client";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Stack,
  Badge,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMail } from "react-icons/fi";

const NewsletterSection = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("green.500", "green.400");

  return (
    <Box 
      py={{ base: "16", md: "20" }} 
      bg={useColorModeValue("green.50", "green.900")}
      borderTopWidth="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.md">
        <VStack spacing="6" textAlign="center">
          <Badge colorScheme="green" fontSize="sm" px="3" py="1" borderRadius="full">
            Stay Updated
          </Badge>
          <Heading size={{ base: "xl", md: "2xl" }}>
            Subscribe to Our Newsletter
          </Heading>
          <Text fontSize="lg" color="muted" maxW="xl">
            Get the latest cybersecurity insights, threat alerts, and tutorials delivered directly to your inbox.
          </Text>
          <Stack 
            as="form" 
            w="full" 
            maxW="md" 
            spacing="3"
            direction={{ base: "column", md: "row" }}
            px={{ base: "4", md: "0" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Enter your email"
              type="email"
              size="lg"
              bg={cardBg}
              borderWidth="2px"
              _focus={{ borderColor: accentColor }}
              h="12"
              flex={{ base: "auto", md: "1" }}
            />
            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              rightIcon={<Icon as={FiMail} />}
              h="12"
              flexShrink={{ base: "auto", md: 0 }}
            >
              Subscribe
            </Button>
          </Stack>
          <Text fontSize="sm" color="muted">
            Join 10,000+ security professionals. Unsubscribe anytime.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default NewsletterSection;
