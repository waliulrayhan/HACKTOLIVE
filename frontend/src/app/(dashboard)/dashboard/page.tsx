import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Dashboard | HackToLive - Bangladesh's Premier Cybersecurity Platform",
  description:
    "HackToLive Dashboard - Your cybersecurity and ethical hacking control center",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      
      <Box mt={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber>1,234</StatNumber>
                <StatHelpText>↗︎ 12% from last month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Challenges</StatLabel>
                <StatNumber>45</StatNumber>
                <StatHelpText>↗︎ 5 new this week</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Labs</StatLabel>
                <StatNumber>892</StatNumber>
                <StatHelpText>↗︎ 23% increase</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Points</StatLabel>
                <StatNumber>15,340</StatNumber>
                <StatHelpText>Rank: #42</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box mt={8}>
          <Heading size="md" mb={4}>Welcome to HackToLive Dashboard</Heading>
          <Text>
            This is your cybersecurity and ethical hacking control center. 
            Track your progress, manage challenges, and enhance your skills.
          </Text>
        </Box>
      </Box>
    </div>
  );
}
