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
  Input,
  Select,
  HStack,
  Text,
  Spinner,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiTrash2, FiDownload, FiRefreshCw } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

const SubscribersPage = () => {
  const { user, token } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    fetchSubscribers();
  }, [page, statusFilter, searchQuery]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/subscribers?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch subscribers");

      const data = await response.json();
      setSubscribers(data.data);
      setTotalPages(data.meta.totalPages);
      setTotal(data.meta.total);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/subscribers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete subscriber");

      toast({
        title: "Success",
        description: "Subscriber deleted successfully",
        status: "success",
        duration: 3000,
      });

      fetchSubscribers();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        status: "error",
        duration: 3000,
      });
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ["Email", "Name", "Status", "Source", "Subscribed At"],
      ...subscribers.map((sub) => [
        sub.email,
        sub.name || "",
        sub.status,
        sub.source || "",
        new Date(sub.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBSCRIBED":
        return "green";
      case "UNSUBSCRIBED":
        return "red";
      case "BOUNCED":
        return "orange";
      case "COMPLAINED":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="lg">Newsletter Subscribers</Heading>
            <Text color="gray.600" mt={1}>
              Total: {total} subscribers
            </Text>
          </Box>
          <HStack>
            <Button
              leftIcon={<FiDownload />}
              onClick={exportSubscribers}
              colorScheme="blue"
              variant="outline"
            >
              Export CSV
            </Button>
            <IconButton
              icon={<FiRefreshCw />}
              onClick={fetchSubscribers}
              aria-label="Refresh"
              variant="ghost"
            />
          </HStack>
        </Flex>

        <Box bg={bgColor} p={4} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <HStack spacing={4} mb={4} flexWrap="wrap">
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              maxW="400px"
            />
            <Select
              placeholder="All Statuses"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              maxW="200px"
            >
              <option value="SUBSCRIBED">Subscribed</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
              <option value="BOUNCED">Bounced</option>
              <option value="COMPLAINED">Complained</option>
            </Select>
          </HStack>

          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" color="green.500" />
            </Flex>
          ) : subscribers.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">No subscribers found</Text>
            </Box>
          ) : (
            <>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Email</Th>
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Source</Th>
                      <Th>Subscribed At</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {subscribers.map((subscriber) => (
                      <Tr key={subscriber.id}>
                        <Td>{subscriber.email}</Td>
                        <Td>{subscriber.name || "-"}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(subscriber.status)}>
                            {subscriber.status}
                          </Badge>
                        </Td>
                        <Td>{subscriber.source || "-"}</Td>
                        <Td>{new Date(subscriber.subscribedAt).toLocaleDateString()}</Td>
                        <Td>
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete"
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(subscriber.id)}
                          />
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

export default SubscribersPage;
