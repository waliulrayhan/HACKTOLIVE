"use client";
import { useState } from "react";
import {
  IconButton,
  Text,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

interface LikeButtonProps {
  initialLikes?: number;
  articleId?: string;
}

const LikeButton = ({ initialLikes = 0, articleId }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  
  const accentColor = useColorModeValue("red.500", "red.400");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
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
