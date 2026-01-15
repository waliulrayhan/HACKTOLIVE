"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  Flex,
  HStack,
  Text,
  Spinner,
  VStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiMoreVertical, FiSend, FiEdit2, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
}

const CampaignsPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchCampaigns();
  }, [page]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/campaigns?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch campaigns");

      const data = await response.json();
      setCampaigns(data.data);
      setTotalPages(data.meta.totalPages);
      setTotal(data.meta.total);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm("Are you sure you want to send this campaign to all subscribers?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/campaigns/${id}/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to send campaign");

      const data = await response.json();
      toast({
        title: "Success",
        description: data.message || "Campaign is being sent",
        status: "success",
        duration: 5000,
      });

      fetchCampaigns();
    } catch (error: any) {
      console.error("Error sending campaign:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send campaign",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete campaign");

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
        status: "success",
        duration: 3000,
      });

      fetchCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        status: "error",
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "green";
      case "SENDING":
        return "blue";
      case "SCHEDULED":
        return "purple";
      case "DRAFT":
        return "gray";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return 0;
    return ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return 0;
    return ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(1);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Email Campaigns</Heading>
            <Text color="gray.600" mt={1}>
              Total: {total} campaigns
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="green"
            onClick={() => router.push("/admin/newsletter/campaigns/create")}
          >
            Create Campaign
          </Button>
        </Flex>

        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" color="green.500" />
            </Flex>
          ) : campaigns.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color="gray.500" mb={4}>No campaigns found</Text>
              <Button
                colorScheme="green"
                onClick={() => router.push("/admin/newsletter/campaigns/create")}
              >
                Create Your First Campaign
              </Button>
            </Box>
          ) : (
            <>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Campaign Name</Th>
                      <Th>Subject</Th>
                      <Th>Status</Th>
                      <Th>Sent</Th>
                      <Th>Open Rate</Th>
                      <Th>Click Rate</Th>
                      <Th>Created</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {campaigns.map((campaign) => (
                      <Tr key={campaign.id}>
                        <Td fontWeight="medium">{campaign.name}</Td>
                        <Td maxW="300px" isTruncated>{campaign.subject}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </Td>
                        <Td>
                          {campaign.totalSent > 0 ? (
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm">{campaign.totalSent} sent</Text>
                              {campaign.totalFailed > 0 && (
                                <Text fontSize="xs" color="red.500">
                                  {campaign.totalFailed} failed
                                </Text>
                              )}
                            </VStack>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          {campaign.totalSent > 0 ? (
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">
                                {calculateOpenRate(campaign)}%
                              </Text>
                              <Progress
                                value={parseFloat(calculateOpenRate(campaign))}
                                size="xs"
                                colorScheme="blue"
                                w="60px"
                              />
                            </VStack>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>
                          {campaign.totalSent > 0 ? (
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="medium">
                                {calculateClickRate(campaign)}%
                              </Text>
                              <Progress
                                value={parseFloat(calculateClickRate(campaign))}
                                size="xs"
                                colorScheme="green"
                                w="60px"
                              />
                            </VStack>
                          ) : (
                            "-"
                          )}
                        </Td>
                        <Td>{new Date(campaign.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FiEye />}
                                onClick={() => router.push(`/admin/newsletter/campaigns/${campaign.id}`)}
                              >
                                View Details
                              </MenuItem>
                              {(campaign.status === "DRAFT" || campaign.status === "SCHEDULED") && (
                                <>
                                  <MenuItem
                                    icon={<FiEdit2 />}
                                    onClick={() => router.push(`/admin/newsletter/campaigns/${campaign.id}/edit`)}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiSend />}
                                    onClick={() => handleSend(campaign.id)}
                                  >
                                    Send Now
                                  </MenuItem>
                                </>
                              )}
                              {campaign.status !== "SENDING" && (
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="red.500"
                                  onClick={() => handleDelete(campaign.id)}
                                >
                                  Delete
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {totalPages > 1 && (
                <Flex justify="center" mt={6} gap={2}>
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    isDisabled={page === 1}
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Text alignSelf="center" px={4}>
                    Page {page} of {totalPages}
                  </Text>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    isDisabled={page === totalPages}
                    size="sm"
                  >
                    Next
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default CampaignsPage;
