"use client";
import { useState, useEffect } from "react";
import {
  IconButton,
  Text,
  HStack,
  useColorModeValue,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { blogApi } from "@/lib/api/blog";

interface LikeButtonProps {
  blogId: string;
}

const LikeButton = ({ blogId }: LikeButtonProps) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const accentColor = useColorModeValue("red.500", "red.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const toast = useToast();

  // Fetch likes count on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const count = await blogApi.getLikesCount(blogId);
        setLikes(count);
        
        // Check if user has liked (from localStorage)
        const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
        setIsLiked(likedBlogs.includes(blogId));
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    if (blogId) {
      fetchLikes();
    }
  }, [blogId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Use a guest email for anonymous users
      const userEmail = localStorage.getItem('userEmail') || `guest-${Date.now()}@anonymous.com`;
      localStorage.setItem('userEmail', userEmail);

      const result = await blogApi.toggleLike(blogId, userEmail);
      
      // Update local state
      if (result.liked) {
        setLikes(likes + 1);
        setIsLiked(true);
        // Store in localStorage
        const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
        likedBlogs.push(blogId);
        localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
      } else {
        setLikes(likes - 1);
        setIsLiked(false);
        // Remove from localStorage
        const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
        const filtered = likedBlogs.filter((id: string) => id !== blogId);
        localStorage.setItem('likedBlogs', JSON.stringify(filtered));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to toggle like',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HStack spacing="2">
      <IconButton
        aria-label="Like this article"
        icon={
          <Icon 
            as={FiHeart} 
            boxSize="4" 
            fill={isLiked ? accentColor : "none"}
            color={isLiked ? accentColor : mutedColor}
          />
        }
        variant="ghost"
        size="sm"
        onClick={handleLike}
        isLoading={isLoading}
        _hover={{ 
          color: accentColor,
        }}
        transition="all 0.2s"
      />
      <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
        {likes} {likes === 1 ? 'Like' : 'Likes'}
      </Text>
    </HStack>
  );
};

export default LikeButton;
