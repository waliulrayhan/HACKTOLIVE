"use client";
import {
  Box,
  Heading,
  HStack,
  Icon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiFacebook, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";

interface SharePostProps {
  title?: string;
  url?: string;
}

const SharePost = ({ title = "Check out this article", url }: SharePostProps) => {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const accentColor = useColorModeValue("green.500", "green.400");

  return (
    <Box>
      <Heading size="sm" mb="4">
        Share This Article
      </Heading>
      <HStack spacing="3">
        <IconButton
          as="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          icon={<Icon as={FiFacebook} boxSize="5" />}
          variant="ghost"
          colorScheme="gray"
          color={iconColor}
          _hover={{ color: accentColor, transform: "translateY(-2px)" }}
          transition="all 0.2s"
        />
        <IconButton
          as="a"
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          icon={<Icon as={FiTwitter} boxSize="5" />}
          variant="ghost"
          colorScheme="gray"
          color={iconColor}
          _hover={{ color: accentColor, transform: "translateY(-2px)" }}
          transition="all 0.2s"
        />
        <IconButton
          as="a"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          icon={<Icon as={FiLinkedin} boxSize="5" />}
          variant="ghost"
          colorScheme="gray"
          color={iconColor}
          _hover={{ color: accentColor, transform: "translateY(-2px)" }}
          transition="all 0.2s"
        />
        <IconButton
          as="a"
          href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`}
          aria-label="Share via Email"
          icon={<Icon as={FiMail} boxSize="5" />}
          variant="ghost"
          colorScheme="gray"
          color={iconColor}
          _hover={{ color: accentColor, transform: "translateY(-2px)" }}
          transition="all 0.2s"
        />
      </HStack>
    </Box>
  );
};

export default SharePost;
