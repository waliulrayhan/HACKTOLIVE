"use client";
import {
  Icon,
  IconButton,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FiFacebook, FiTwitter, FiLinkedin, FiLink } from "react-icons/fi";
import { useState } from "react";

interface SharePostProps {
  title?: string;
  url?: string;
}

const SharePost = ({ title = "Check out this article", url }: SharePostProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("green.500", "green.400");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const socialButtons = [
    {
      label: "Facebook",
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Twitter",
      icon: FiTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      icon: FiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <HStack spacing="2">
      {socialButtons.map((button, index) => (
        <IconButton
          key={index}
          as="a"
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={button.label}
          icon={<Icon as={button.icon} boxSize="4" />}
          size="sm"
          variant="ghost"
          color={iconColor}
          _hover={{ 
            color: accentColor,
          }}
          transition="all 0.2s"
        />
      ))}
      
      <IconButton
        aria-label="Copy link"
        icon={<Icon as={FiLink} boxSize="4" />}
        size="sm"
        variant="ghost"
        color={copied ? accentColor : iconColor}
        onClick={handleCopyLink}
        _hover={{ 
          color: accentColor,
        }}
        transition="all 0.2s"
      />
    </HStack>
  );
};

export default SharePost;
