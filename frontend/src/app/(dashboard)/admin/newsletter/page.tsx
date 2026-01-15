"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  useColorModeValue,
  Spinner,
  Flex,
  Button,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FiUsers, FiMail, FiSend, FiTrendingUp, FiPlus, FiList } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  totalCampaigns: number;
  sentCampaigns: number;
  recentSubscriptions: number;
  subscriptionRate: string;
}

const NewsletterDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Newsletter Management</Heading>
            <Text color="gray.600" mt={1}>
              Manage your email subscribers and campaigns
            </Text>
          </Box>
          <HStack>
            <Button
              leftIcon={<FiList />}
              colorScheme="blue"
              variant="outline"
              onClick={() => router.push("/admin/newsletter/subscribers")}
            >
              View Subscribers
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="green"
              onClick={() => router.push("/admin/newsletter/campaigns/create")}
            >
              Create Campaign
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stat>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel>Total Subscribers</StatLabel>
                  <StatNumber fontSize="3xl">{stats?.totalSubscribers || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats?.recentSubscriptions || 0} in last 30 days
                  </StatHelpText>
                </Box>
                <Icon as={FiUsers} boxSize={10} color="blue.500" />
              </Flex>
            </Stat>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stat>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel>Active Subscribers</StatLabel>
                  <StatNumber fontSize="3xl" color="green.500">
                    {stats?.activeSubscribers || 0}
                  </StatNumber>
                  <StatHelpText>
                    {stats?.subscriptionRate || 0}% subscription rate
                  </StatHelpText>
                </Box>
                <Icon as={FiMail} boxSize={10} color="green.500" />
              </Flex>
            </Stat>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stat>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel>Total Campaigns</StatLabel>
                  <StatNumber fontSize="3xl">{stats?.totalCampaigns || 0}</StatNumber>
                  <StatHelpText>
                    {stats?.sentCampaigns || 0} sent
                  </StatHelpText>
                </Box>
                <Icon as={FiSend} boxSize={10} color="purple.500" />
              </Flex>
            </Stat>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stat>
              <Flex justify="space-between" align="start">
                <Box>
                  <StatLabel>Unsubscribed</StatLabel>
                  <StatNumber fontSize="3xl" color="red.500">
                    {stats?.unsubscribed || 0}
                  </StatNumber>
                  <StatHelpText>
                    {stats?.totalSubscribers
                      ? (
                          ((stats.unsubscribed / stats.totalSubscribers) * 100).toFixed(1)
                        )
                      : 0}% churn rate
                  </StatHelpText>
                </Box>
                <Icon as={FiTrendingUp} boxSize={10} color="red.500" />
              </Flex>
            </Stat>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <VStack spacing={3} align="stretch">
              <Button
                justifyContent="flex-start"
                leftIcon={<FiPlus />}
                onClick={() => router.push("/admin/newsletter/campaigns/create")}
                colorScheme="green"
              >
                Create New Campaign
              </Button>
              <Button
                justifyContent="flex-start"
                leftIcon={<FiList />}
                onClick={() => router.push("/admin/newsletter/campaigns")}
                variant="outline"
              >
                View All Campaigns
              </Button>
              <Button
                justifyContent="flex-start"
                leftIcon={<FiUsers />}
                onClick={() => router.push("/admin/newsletter/subscribers")}
                variant="outline"
              >
                Manage Subscribers
              </Button>
            </VStack>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading size="md" mb={4}>Tips</Heading>
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm">
                📧 <strong>Best Time to Send:</strong> Tuesday-Thursday, 10 AM - 2 PM
              </Text>
              <Text fontSize="sm">
                ✍️ <strong>Subject Line:</strong> Keep it under 50 characters for better open rates
              </Text>
              <Text fontSize="sm">
                📱 <strong>Mobile Friendly:</strong> 60% of emails are opened on mobile devices
              </Text>
              <Text fontSize="sm">
                🎯 <strong>Call to Action:</strong> Include clear CTAs to increase engagement
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default NewsletterDashboard;
