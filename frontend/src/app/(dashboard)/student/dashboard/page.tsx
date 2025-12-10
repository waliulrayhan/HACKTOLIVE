"use client";

import React from "react";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, Text } from "@chakra-ui/react";
import { FaBook, FaCertificate, FaTrophy, FaClock } from "react-icons/fa";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading size="lg">Student Dashboard</Heading>
          <Text color="gray.600" mt={1}>Welcome back! Here's your learning progress</Text>
        </div>
      </div>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Enrolled Courses</StatLabel>
                  <StatNumber>8</StatNumber>
                  <StatHelpText>Active learning</StatHelpText>
                </div>
                <Box className="p-3 bg-blue-100 rounded-lg">
                  <FaBook className="w-6 h-6 text-blue-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Completed</StatLabel>
                  <StatNumber>3</StatNumber>
                  <StatHelpText>Certificates earned</StatHelpText>
                </div>
                <Box className="p-3 bg-green-100 rounded-lg">
                  <FaCertificate className="w-6 h-6 text-green-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Total Progress</StatLabel>
                  <StatNumber>62%</StatNumber>
                  <StatHelpText>Across all courses</StatHelpText>
                </div>
                <Box className="p-3 bg-purple-100 rounded-lg">
                  <FaTrophy className="w-6 h-6 text-purple-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Learning Hours</StatLabel>
                  <StatNumber>156</StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </div>
                <Box className="p-3 bg-orange-100 rounded-lg">
                  <FaClock className="w-6 h-6 text-orange-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Continue Learning</Heading>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Text fontWeight="bold">Web Security Fundamentals</Text>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-lime-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <Text fontSize="sm" color="gray.600" mt={2}>75% complete</Text>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Text fontWeight="bold">Network Defense Basics</Text>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-lime-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <Text fontSize="sm" color="gray.600" mt={2}>45% complete</Text>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Achievements</Heading>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Box className="p-3 bg-yellow-100 rounded-lg">
                  <FaTrophy className="w-6 h-6 text-yellow-600" />
                </Box>
                <div>
                  <Text fontWeight="bold">Course Completion</Text>
                  <Text fontSize="sm" color="gray.600">Completed "Intro to Cybersecurity"</Text>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Box className="p-3 bg-green-100 rounded-lg">
                  <FaCertificate className="w-6 h-6 text-green-600" />
                </Box>
                <div>
                  <Text fontWeight="bold">Certificate Earned</Text>
                  <Text fontSize="sm" color="gray.600">Ethical Hacking Basics</Text>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </SimpleGrid>
    </div>
  );
}
