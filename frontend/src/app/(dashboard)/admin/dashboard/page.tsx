"use client";

import React from "react";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, Text, Button, Badge } from "@chakra-ui/react";
import { FaUsers, FaBook, FaCheckCircle, FaChartLine } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading size="lg">Admin Dashboard</Heading>
          <Text color="gray.600" mt={1}>System overview and management</Text>
        </div>
      </div>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <div className="flex items-center justify-between">
                <div>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber>5,234</StatNumber>
                  <StatHelpText>+12% this month</StatHelpText>
                </div>
                <Box className="p-3 bg-blue-100 rounded-lg">
                  <FaUsers className="w-6 h-6 text-blue-600" />
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
                  <StatLabel>Total Courses</StatLabel>
                  <StatNumber>145</StatNumber>
                  <StatHelpText>23 pending approval</StatHelpText>
                </div>
                <Box className="p-3 bg-green-100 rounded-lg">
                  <FaBook className="w-6 h-6 text-green-600" />
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
                  <StatLabel>Active Enrollments</StatLabel>
                  <StatNumber>8,456</StatNumber>
                  <StatHelpText>Across all courses</StatHelpText>
                </div>
                <Box className="p-3 bg-purple-100 rounded-lg">
                  <FaCheckCircle className="w-6 h-6 text-purple-600" />
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
                  <StatNumber>$45.2k</StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </div>
                <Box className="p-3 bg-orange-100 rounded-lg">
                  <FaChartLine className="w-6 h-6 text-orange-600" />
                </Box>
              </div>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <Heading size="md">Pending Course Approvals</Heading>
              <Badge colorScheme="red">23</Badge>
            </div>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Blockchain Security Fundamentals</Text>
                    <Text fontSize="sm" color="gray.600">By: Dr. Sarah Johnson</Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>Submitted 2 days ago</Text>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" colorScheme="green">Approve</Button>
                    <Button size="sm" colorScheme="red" variant="outline">Reject</Button>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Cloud Security Architecture</Text>
                    <Text fontSize="sm" color="gray.600">By: Prof. Michael Chen</Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>Submitted 3 days ago</Text>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" colorScheme="green">Approve</Button>
                    <Button size="sm" colorScheme="red" variant="outline">Reject</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent System Activity</Heading>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">New Instructor Registration</Text>
                    <Text fontSize="sm" color="gray.600">Dr. Emily Watson verified</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">1h ago</Text>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">Course Published</Text>
                    <Text fontSize="sm" color="gray.600">"Advanced Network Defense" approved</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">3h ago</Text>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Text fontWeight="bold">System Update</Text>
                    <Text fontSize="sm" color="gray.600">Security patches applied</Text>
                  </div>
                  <Text fontSize="xs" color="gray.500">5h ago</Text>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>User Distribution</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box className="p-4 border rounded-lg text-center">
              <Text fontSize="3xl" fontWeight="bold" color="blue.600">3,456</Text>
              <Text color="gray.600">Students</Text>
              <Text fontSize="sm" color="green.500">+8% this month</Text>
            </Box>
            <Box className="p-4 border rounded-lg text-center">
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">1,234</Text>
              <Text color="gray.600">Instructors</Text>
              <Text fontSize="sm" color="green.500">+12% this month</Text>
            </Box>
            <Box className="p-4 border rounded-lg text-center">
              <Text fontSize="3xl" fontWeight="bold" color="orange.600">544</Text>
              <Text color="gray.600">Admins</Text>
              <Text fontSize="sm" color="gray.500">No change</Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </div>
  );
}
