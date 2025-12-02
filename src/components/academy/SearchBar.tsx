"use client";

import { useState } from "react";
import { Input, InputGroup, InputLeftElement, Icon, useColorModeValue } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = "Search courses...",
  onSearch,
  defaultValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const inputColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("gray.500", "gray.400");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <InputGroup size="lg">
      <InputLeftElement pointerEvents="none">
        <Icon as={FaSearch} color={iconColor} />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        borderRadius="full"
        bg={useColorModeValue("white", "gray.800")}
        color={inputColor}
        _placeholder={{ color: placeholderColor }}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
      />
    </InputGroup>
  );
}
