"use client";
import {
  Box,
  Text,
  useColorModeValue,
  Stack,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import BlogData from "./blogData";

const CategoriesSidebar = () => {
  const accentColor = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  
  // Get unique categories
  const categories = Array.from(new Set(BlogData.map(blog => blog.category)));

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
        Categories
      </Text>
      <Stack spacing="1">
        {categories.map((category, index) => (
          <Button
            key={index}
            as={Link}
            href={`/blog?category=${category}`}
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
            {category}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default CategoriesSidebar;
