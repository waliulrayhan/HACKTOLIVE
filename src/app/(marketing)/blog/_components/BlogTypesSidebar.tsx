"use client";
import {
  Box,
  Text,
  useColorModeValue,
  Stack,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

const BlogTypesSidebar = () => {
  const accentColor = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  
  // Get unique blog types
  const blogTypes = [
    "Threat Alerts",
    "How-to Tutorials",
    "Best Security Practices",
    "Compliance Guides",
    "Case Study Stories",
  ];

  return (
    <Box>
      <Text 
        fontSize="xs" 
        fontWeight="bold" 
        textTransform="uppercase" 
        letterSpacing="wider"
        mb="3"
        color={mutedColor}
      >
        Blog Types
      </Text>
      <Stack spacing="1">
        {blogTypes.map((type, index) => (
          <Button
            key={index}
            as={Link}
            href={`/blog?type=${type}`}
            size="sm"
            variant="ghost"
            justifyContent="flex-start"
            fontWeight="normal"
            px="2"
            _hover={{ bg: hoverBg, pl: "3", color: accentColor }}
            transition="all 0.2s"
            borderLeftWidth="2px"
            borderLeftColor="transparent"
            _active={{ borderLeftColor: accentColor }}
            borderRadius="0"
          >
            {type}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default BlogTypesSidebar;
