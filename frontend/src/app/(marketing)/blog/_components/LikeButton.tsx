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
import { useAuth } from "@/context/AuthContext";

interface LikeButtonProps {
  blogId: string;
}

const LikeButton = ({ blogId }: LikeButtonProps) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const accentColor = useColorModeValue("red.500", "red.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const toast = useToast();

  // Fetch likes count and check if user has liked on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        // Use authenticated user's email if logged in, otherwise use guest email from localStorage
        const userEmail = user?.email || localStorage.getItem('userEmail') || '';
        
        // Fetch both count and liked status in parallel
        const [count, hasLiked] = await Promise.all([
          blogApi.getLikesCount(blogId),
          userEmail ? blogApi.hasUserLiked(blogId, userEmail) : Promise.resolve(false)
        ]);
        
        setLikes(count);
        setIsLiked(hasLiked);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    if (blogId) {
      fetchLikes();
    }
  }, [blogId, user]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Use authenticated user's email if logged in, otherwise create guest email
      let userEmail: string;
      if (user?.email) {
        userEmail = user.email;
      } else {
        userEmail = localStorage.getItem('userEmail') || `guest-${Date.now()}@anonymous.com`;
        localStorage.setItem('userEmail', userEmail);
      }

      const result = await blogApi.toggleLike(
        blogId, 
        userEmail,
        user?.token // Pass token if user is authenticated
      );
      
      // Update local state
      if (result.liked) {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        setLikes(likes - 1);
        setIsLiked(false);
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
