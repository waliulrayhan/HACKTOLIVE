"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Flex,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Code,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiSave, FiSend, FiArrowLeft } from "react-icons/fi";

const CreateCampaignPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (sendNow: boolean = false) => {
    if (!formData.name || !formData.subject || !formData.body) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            createdBy: user?.name || user?.email,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create campaign");

      const data = await response.json();

      // If send now, trigger send
      if (sendNow && data.data?.id) {
        const sendToken = localStorage.getItem('token');
        const sendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/campaigns/${data.data.id}/send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sendToken}`,
            },
          }
        );

        if (!sendResponse.ok) throw new Error("Campaign created but failed to send");

        toast({
          title: "Success",
          description: "Campaign created and is being sent to subscribers",
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Success",
          description: "Campaign created successfully",
          status: "success",
          duration: 3000,
        });
      }

      router.push("/admin/newsletter/campaigns");
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const emailTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 30px;
      }
      .button {
        display: inline-block;
        background: #48bb78;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        background: #f7fafc;
        padding: 20px;
        text-align: center;
        color: #718096;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔒 HackToLive Newsletter</h1>
      </div>
      <div class="content">
        <h2>Your Email Content Here</h2>
        <p>Write your newsletter content here...</p>
        
        <a href="#" class="button">Call to Action</a>
        
        <p>Best regards,<br><strong>The HackToLive Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} HackToLive. All rights reserved.</p>
        <p>You're receiving this email because you subscribed to our newsletter.</p>
      </div>
    </div>
  </body>
</html>`;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              mb={2}
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Heading size="lg">Create Email Campaign</Heading>
            <Text color="gray.600" mt={1}>
              Create and send promotional emails to your subscribers
            </Text>
          </Box>
        </Flex>

        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>Campaign Name</FormLabel>
              <Input
                name="name"
                placeholder="e.g., Monthly Security Update - January 2026"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Subject</FormLabel>
              <Input
                name="subject"
                placeholder="e.g., Your Monthly Cybersecurity Digest"
                value={formData.subject}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email Body (HTML)</FormLabel>
              <Tabs>
                <TabList>
                  <Tab>Edit HTML</Tab>
                  <Tab>Template</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <Textarea
                      name="body"
                      placeholder="Enter your HTML email content..."
                      value={formData.body}
                      onChange={handleChange}
                      rows={20}
                      fontFamily="monospace"
                      fontSize="sm"
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <Text fontSize="sm" mb={2} color="gray.600">
                      Copy this template to get started:
                    </Text>
                    <Box
                      bg="gray.50"
                      p={4}
                      borderRadius="md"
                      maxH="400px"
                      overflowY="auto"
                    >
                      <Code
                        display="block"
                        whiteSpace="pre"
                        fontSize="xs"
                        p={2}
                      >
                        {emailTemplate}
                      </Code>
                    </Box>
                    <Button
                      size="sm"
                      mt={2}
                      onClick={() => setFormData({ ...formData, body: emailTemplate })}
                    >
                      Use This Template
                    </Button>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </FormControl>

            <HStack spacing={4} pt={4}>
              <Button
                colorScheme="green"
                leftIcon={<FiSave />}
                onClick={() => handleSubmit(false)}
                isLoading={loading}
                loadingText="Saving..."
              >
                Save as Draft
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<FiSend />}
                onClick={() => handleSubmit(true)}
                isLoading={loading}
                loadingText="Sending..."
              >
                Save and Send Now
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateCampaignPage;
