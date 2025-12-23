"use client";
import {
  Icon,
  IconButton,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FiFacebook, FiLinkedin, FiLink } from "react-icons/fi";
import { RiTwitterXLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/toast/use-toast";

interface SharePostProps {
  title?: string;
  url?: string;
}

const SharePost = ({ title = "Check out this article", url }: SharePostProps) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Get the full absolute URL that will work in both development and production
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // In production: NEXT_PUBLIC_SITE_URL = https://hacktolive.io
      // In development: falls back to window.location.origin (http://localhost:3000)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : window.location.href;
      setCurrentUrl(fullUrl);
    }
  }, [url]);

  const shareUrl = currentUrl || url || '';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("green.500", "green.400");

  const handleCopyLink = async () => {
    if (!shareUrl) {
      toast.error("Unable to copy link");
      return;
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast.success("Link copied!", {
        description: "The link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error("Copy failed", {
        description: "Please try selecting and copying the URL manually",
      });
    }
  };

  const handleSocialShare = (url: string, platform: string) => {
    if (typeof window !== 'undefined') {
      // Open in popup window for better UX
      window.open(url, platform, 'width=600,height=400');
    }
  };

  const socialButtons = [
    {
      label: "Share on Facebook",
      icon: FiFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877F2",
    },
    {
      label: "Share on X (Twitter)",
      icon: RiTwitterXLine,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#000000",
    },
    {
      label: "Share on LinkedIn",
      icon: FiLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "#0A66C2",
    },
  ];

  return (
    <HStack spacing="2">
      {socialButtons.map((button, index) => (
        <IconButton
          key={index}
          aria-label={button.label}
          icon={<Icon as={button.icon} boxSize="4" />}
          size="sm"
          variant="ghost"
          color={iconColor}
          onClick={(e) => {
            e.preventDefault();
            handleSocialShare(button.href, button.label);
          }}
          _hover={{ 
            color: button.color,
            transform: "translateY(-2px)",
          }}
          transition="all 0.2s"
          isDisabled={!shareUrl}
        />
      ))}
      
      <IconButton
        aria-label="Copy link to clipboard"
        icon={<Icon as={FiLink} boxSize="4" />}
        size="sm"
        variant="ghost"
        color={copied ? accentColor : iconColor}
        onClick={handleCopyLink}
        _hover={{ 
          color: accentColor,
          transform: "translateY(-2px)",
        }}
        transition="all 0.2s"
        isDisabled={!shareUrl}
      />
    </HStack>
  );
};

export default SharePost;
