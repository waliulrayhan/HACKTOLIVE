"use client";

import React from "react";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, Text, Button } from "@chakra-ui/react";
import { FaBook, FaUserGraduate, FaStar, FaDollarSign, FaPlus } from "react-icons/fa";

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading size="lg">Instructor Dashboard</Heading>
          <Text color="gray.600" mt={1}>Manage your courses and track student progress</Text>
        </div>
        <Button leftIcon={<FaPlus />} colorScheme="blue">
          Create Course
        </Button>
      </div>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Total Courses</StatLabel>
                  <StatNumber>12</StatNumber>
                  <StatHelpText>5 published</StatHelpText>
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
                  <StatLabel>Total Students</StatLabel>
                  <StatNumber>1,234</StatNumber>
                  <StatHelpText>+15% this month</StatHelpText>
                </div>
                <Box className="p-3 bg-green-100 rounded-lg">
                  <FaUserGraduate className="w-6 h-6 text-green-600" />
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
                  <StatLabel>Avg Rating</StatLabel>
                  <StatNumber>4.8</StatNumber>
                  <StatHelpText>Based on 456 reviews</StatHelpText>
                </div>
                <Box className="p-3 bg-yellow-100 rounded-lg">
                  <FaStar className="w-6 h-6 text-yellow-600" />
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
                  <StatLabel>Revenue</StatLabel>
                  <StatNumber>$12.5k</StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </div>
                <Box className="p-3 bg-purple-100 rounded-lg">
                  <FaDollarSign className="w-6 h-6 text-purple-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Popular Courses</Heading>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Advanced Penetration Testing</Text>
                    <Text fontSize="sm" color="gray.600">456 students enrolled</Text>
                  </div>
                  <Box className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Published
                  </Box>
                </div>
                <div className="flex gap-4 mt-3">
                  <Text fontSize="sm">⭐ 4.9</Text>
                  <Text fontSize="sm">📚 24 lessons</Text>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Web Application Security</Text>
                    <Text fontSize="sm" color="gray.600">312 students enrolled</Text>
                  </div>
                  <Box className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Published
                  </Box>
                </div>
                <div className="flex gap-4 mt-3">
                  <Text fontSize="sm">⭐ 4.7</Text>
                  <Text fontSize="sm">📚 18 lessons</Text>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">New Enrollment</Text>
                    <Text fontSize="sm" color="gray.600">John Doe enrolled in "Network Security"</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">2h ago</Text>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">New Review</Text>
                    <Text fontSize="sm" color="gray.600">5-star review on "Ethical Hacking"</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">5h ago</Text>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Course Completed</Text>
                    <Text fontSize="sm" color="gray.600">Sarah completed "Intro to Cybersecurity"</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">1d ago</Text>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </SimpleGrid>
    </div>
  );
}
