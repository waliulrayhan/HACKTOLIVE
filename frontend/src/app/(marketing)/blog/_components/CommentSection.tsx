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
  Spinner,
  Icon,
  Badge,
  Link as ChakraLink,
  IconButton,
  Collapse,
} from "@chakra-ui/react";
import { FiMessageSquare, FiHeart, FiCornerDownRight, FiUser } from "react-icons/fi";
import { toast } from "@/components/ui/toast";
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
  likes?: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  blogId: string;
}

const CommentSection = ({ blogId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("green.500", "green.400");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const replyBg = useColorModeValue("gray.25", "gray.750");

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

  const handleLikeComment = async (commentId: string) => {
    try {
      // Use a guest email for anonymous users
      const userEmail = localStorage.getItem('userEmail') || `guest-${Date.now()}@anonymous.com`;
      localStorage.setItem('userEmail', userEmail);

      const result = await blogApi.toggleCommentLike(commentId, userEmail);
      
      // Update local state
      const newLiked = new Set(likedComments);
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            if (result.liked) {
              newLiked.add(commentId);
              return { ...comment, likes: (comment.likes || 0) + 1 };
            } else {
              newLiked.delete(commentId);
              return { ...comment, likes: Math.max(0, (comment.likes || 0) - 1) };
            }
          }
          // Check replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateComments(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateComments(comments));
      setLikedComments(newLiked);
      localStorage.setItem("likedComments", JSON.stringify([...newLiked]));
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleReply = (commentId: string) => {
    if (!user) {
      toast.info("Please log in to reply to comments");
      return;
    }
    setReplyingTo(commentId);
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to reply");
      }

      const newReply = await blogApi.addCommentReply(parentCommentId, replyText.trim(), token);

      // Update comments with new reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyText("");
      setReplyingTo(null);

      toast.success("Reply posted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error("Comment required", {
        description: "Please write a comment before submitting",
      });
      return;
    }

    if (commentText.trim().length < 3) {
      toast.error("Comment too short", {
        description: "Comment must be at least 3 characters long",
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

      toast.success("Comment posted!", {
        description: "Your comment has been added successfully",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to post comment",
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
        <Box as="form" onSubmit={handleSubmit}>
          <VStack align="stretch" spacing="3">
            <HStack align="start" spacing="3">
              {user ? (
                <Avatar
                  size="sm"
                  name={user.name || undefined}
                  src={getUserAvatar(user.avatar || undefined)}
                  bg={accentColor}
                  color="white"
                />
              ) : (
                <Avatar
                  size="sm"
                  icon={<Icon as={FiUser} />}
                  bg="gray.400"
                  color="white"
                />
              )}
              <VStack align="stretch" spacing="2" flex="1">
                <Textarea
                  placeholder={user ? "Add a comment..." : "Log in to add a comment..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  _focus={{ borderColor: accentColor, bg: "white" }}
                  _dark={{ _focus: { bg: "gray.800" } }}
                  minH="80px"
                  fontSize="sm"
                  resize="vertical"
                  isDisabled={!user}
                  onClick={() => {
                    if (!user) {
                      toast.info("Login required", {
                        description: "Please log in to comment",
                      });
                    }
                  }}
                />
                {user && (
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
                )}
              </VStack>
            </HStack>
            {!user && (
              <Box
                p="3"
                bg={bgColor}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                borderStyle="dashed"
              >
                <HStack spacing="2" justify="center" fontSize="sm">
                  <Text color={mutedColor}>
                    Please
                  </Text>
                  <Link href="/login" passHref>
                    <ChakraLink color={accentColor} fontWeight="medium">
                      log in
                    </ChakraLink>
                  </Link>
                  <Text color={mutedColor}>
                    or
                  </Text>
                  <Link href="/signup" passHref>
                    <ChakraLink color={accentColor} fontWeight="medium">
                      sign up
                    </ChakraLink>
                  </Link>
                  <Text color={mutedColor}>
                    to comment
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>

        <Divider />

        {/* Comments List */}
        {loading ? (
          <Box textAlign="center" py="8">
            <Spinner size="md" color="green.500" />
          </Box>
        ) : comments.length > 0 ? (
          <VStack spacing="0" align="stretch" divider={<Divider />}>
            {comments.map((comment) => (
              <Box key={comment.id}>
                {/* Main Comment */}
                <Box
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
                    <VStack align="stretch" spacing="2" flex="1">
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
                      <Text fontSize="sm" lineHeight="1.6">
                        {comment.comment}
                      </Text>
                      
                      {/* Comment Actions */}
                      <HStack spacing="4" pt="1">
                        <Button
                          size="xs"
                          variant="ghost"
                          leftIcon={
                            <Icon
                              as={FiHeart}
                              fill={likedComments.has(comment.id) ? "currentColor" : "none"}
                            />
                          }
                          color={likedComments.has(comment.id) ? "red.500" : mutedColor}
                          _hover={{ color: "red.500" }}
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          {comment.likes || 0}
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          leftIcon={<Icon as={FiCornerDownRight} />}
                          color={mutedColor}
                          _hover={{ color: accentColor }}
                          onClick={() => handleReply(comment.id)}
                        >
                          Reply
                        </Button>
                      </HStack>

                      {/* Reply Form */}
                      <Collapse in={replyingTo === comment.id} animateOpacity>
                        <Box pt="3">
                          <HStack align="start" spacing="2">
                            <Avatar
                              size="xs"
                              name={user?.name || undefined}
                              src={getUserAvatar(user?.avatar || undefined)}
                              bg={accentColor}
                              color="white"
                            />
                            <VStack align="stretch" spacing="2" flex="1">
                              <Textarea
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                bg={bgColor}
                                borderColor={borderColor}
                                _focus={{ borderColor: accentColor }}
                                minH="60px"
                                fontSize="sm"
                                size="sm"
                              />
                              <HStack justify="flex-end" spacing="2">
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="xs"
                                  colorScheme="green"
                                  onClick={() => handleSubmitReply(comment.id)}
                                  isLoading={submitting}
                                  isDisabled={!replyText.trim()}
                                >
                                  Reply
                                </Button>
                              </HStack>
                            </VStack>
                          </HStack>
                        </Box>
                      </Collapse>
                    </VStack>
                  </HStack>
                </Box>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <Box pl="12" borderLeftWidth="2px" borderLeftColor={borderColor} ml="6">
                    <VStack spacing="0" align="stretch" divider={<Divider />}>
                      {comment.replies.map((reply) => (
                        <Box
                          key={reply.id}
                          py="3"
                          px="2"
                          transition="all 0.2s"
                          _hover={{ bg: replyBg }}
                          borderRadius="md"
                        >
                          <HStack align="start" spacing="2">
                            <Avatar
                              size="xs"
                              name={reply.user.name}
                              src={getUserAvatar(reply.user.avatar)}
                              bg={accentColor}
                              color="white"
                            />
                            <VStack align="stretch" spacing="1" flex="1">
                              <HStack spacing="2" flexWrap="wrap">
                                <Text fontWeight="semibold" fontSize="xs">
                                  {reply.user.name}
                                </Text>
                                {reply.user.role && (
                                  <Badge
                                    colorScheme="green"
                                    fontSize="2xs"
                                    textTransform="capitalize"
                                    borderRadius="sm"
                                  >
                                    {reply.user.role.toLowerCase()}
                                  </Badge>
                                )}
                                <Text fontSize="2xs" color={mutedColor}>
                                  •
                                </Text>
                                <Text fontSize="2xs" color={mutedColor}>
                                  {formatDate(reply.createdAt)}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" lineHeight="1.6">
                                {reply.comment}
                              </Text>
                              <HStack spacing="3" pt="1">
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  leftIcon={
                                    <Icon
                                      as={FiHeart}
                                      boxSize="3"
                                      fill={likedComments.has(reply.id) ? "currentColor" : "none"}
                                    />
                                  }
                                  color={likedComments.has(reply.id) ? "red.500" : mutedColor}
                                  _hover={{ color: "red.500" }}
                                  onClick={() => handleLikeComment(reply.id)}
                                  fontSize="2xs"
                                >
                                  {reply.likes || 0}
                                </Button>
                              </HStack>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
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
