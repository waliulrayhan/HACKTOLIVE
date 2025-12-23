"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Textarea,
  Divider,
  useColorModeValue,
  useToast,
  Spinner,
  Icon,
  Badge,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { blogApi } from "@/lib/api/blog";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

interface CommentSectionProps {
  blogId: string;
}

const CommentSection = ({ blogId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("green.500", "green.400");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  const toast = useToast();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await blogApi.getComments(blogId);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (commentText.trim().length < 3) {
      toast({
        title: "Comment too short",
        description: "Comment must be at least 3 characters long",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to comment");
      }

      const newComment = await blogApi.addComment(blogId, commentText.trim(), token);

      // Add new comment to the list
      setComments([newComment, ...comments]);
      setCommentText("");

      toast({
        title: "Comment posted!",
        description: "Your comment has been added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post comment",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getUserAvatar = (avatar?: string) => {
    if (!avatar) return undefined;
    return avatar.startsWith('http') 
      ? avatar 
      : `${process.env.NEXT_PUBLIC_API_URL}${avatar}`;
  };

  return (
    <Box w="full" py="4">
      <VStack align="stretch" spacing="4">
        {/* Header */}
        <HStack spacing="2" pb="2">
          <Icon as={FiMessageSquare} boxSize="5" color={accentColor} />
          <Text fontSize="xl" fontWeight="bold">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </Text>
        </HStack>

        <Divider />

        {/* Comment Form */}
        {user ? (
          <Box as="form" onSubmit={handleSubmit}>
            <VStack align="stretch" spacing="3">
              <HStack align="start" spacing="3">
                <Avatar
                  size="sm"
                  name={user.name || undefined}
                  src={getUserAvatar(user.avatar || undefined)}
                  bg={accentColor}
                  color="white"
                />
                <VStack align="stretch" spacing="2" flex="1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    bg={bgColor}
                    borderColor={borderColor}
                    _focus={{ borderColor: accentColor, bg: "white" }}
                    _dark={{ _focus: { bg: "gray.800" } }}
                    minH="80px"
                    fontSize="sm"
                    resize="vertical"
                  />
                  <HStack justify="flex-end" spacing="2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCommentText("")}
                      isDisabled={!commentText || submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      colorScheme="green"
                      isLoading={submitting}
                      loadingText="Posting..."
                      isDisabled={!commentText.trim() || commentText.trim().length < 3}
                    >
                      Add Comment
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        ) : (
          <Box
            p="4"
            bg={bgColor}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack spacing="2" justify="center">
              <Text fontSize="sm" color={mutedColor}>
                Please
              </Text>
              <Link href="/login" passHref>
                <ChakraLink color={accentColor} fontWeight="medium" fontSize="sm">
                  log in
                </ChakraLink>
              </Link>
              <Text fontSize="sm" color={mutedColor}>
                or
              </Text>
              <Link href="/signup" passHref>
                <ChakraLink color={accentColor} fontWeight="medium" fontSize="sm">
                  sign up
                </ChakraLink>
              </Link>
              <Text fontSize="sm" color={mutedColor}>
                to comment
              </Text>
            </HStack>
          </Box>
        )}

        <Divider />

        {/* Comments List */}
        {loading ? (
          <Box textAlign="center" py="8">
            <Spinner size="md" color="green.500" />
          </Box>
        ) : comments.length > 0 ? (
          <VStack spacing="0" align="stretch" divider={<Divider />}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                py="4"
                px="2"
                transition="all 0.2s"
                _hover={{ bg: hoverBg }}
                borderRadius="md"
              >
                <HStack align="start" spacing="3">
                  <Avatar
                    size="sm"
                    name={comment.user.name}
                    src={getUserAvatar(comment.user.avatar)}
                    bg={accentColor}
                    color="white"
                  />
                  <VStack align="stretch" spacing="1" flex="1">
                    <HStack spacing="2" flexWrap="wrap">
                      <Text fontWeight="semibold" fontSize="sm">
                        {comment.user.name}
                      </Text>
                      {comment.user.role && (
                        <Badge
                          colorScheme="green"
                          fontSize="2xs"
                          textTransform="capitalize"
                          borderRadius="sm"
                        >
                          {comment.user.role.toLowerCase()}
                        </Badge>
                      )}
                      <Text fontSize="xs" color={mutedColor}>
                        •
                      </Text>
                      <Text fontSize="xs" color={mutedColor}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" lineHeight="1.6" pt="1">
                      {comment.comment}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box textAlign="center" py="8">
            <VStack spacing="2">
              <Icon as={FiMessageSquare} boxSize="10" color="gray.400" />
              <Text fontSize="sm" color={mutedColor}>
                No comments yet
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {user ? "Be the first to share your thoughts!" : "Log in to be the first to comment!"}
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default CommentSection;
