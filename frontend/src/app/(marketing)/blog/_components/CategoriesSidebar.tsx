"use client";
import {
  Box,
  Text,
  useColorModeValue,
  Stack,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

const categoryGroups = [
  {
    label: "Fundamentals",
    items: ["Cybersecurity Basics", "Networking & Network Security", "Privacy & Online Safety", "Cryptography", "Programming for Cybersecurity"],
  },
  {
    label: "Offensive Security",
    items: ["Ethical Hacking", "Penetration Testing", "Red Teaming", "Kali Linux & Linux Security"],
  },
  {
    label: "Defensive Security",
    items: ["Blue Teaming", "Incident Response & SOC", "Security Best Practices", "Digital Forensics"],
  },
  {
    label: "Technical Domains",
    items: ["Web Application Security", "Mobile Security", "Cloud Security", "IoT Security", "AI in Cybersecurity", "Cloud & DevSecOps"],
  },
  {
    label: "Threats & Attacks",
    items: ["Cyber Threats & Attacks", "Malware & Ransomware", "Vulnerabilities & Exploits", "OSINT (Open-Source Intelligence)"],
  },
  {
    label: "Tools & Resources",
    items: ["Cybersecurity Tools", "Security Tools Tutorials"],
  },
  {
    label: "Learning & Career",
    items: ["Security Certifications", "Career Guides", "CTF Walkthroughs & Labs", "Guides & Step-by-Step Tutorials"],
  },
  {
    label: "News & Updates",
    items: ["Cybersecurity News & Updates"],
  },
];

const CategoriesSidebar = () => {
  const accentColor = useColorModeValue("green.500", "green.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const groupLabelColor = useColorModeValue("gray.400", "gray.500");

  return (
    <Box>
      {categoryGroups.map((group) => (
        <Box key={group.label} mb="4">
          <Text
            fontSize="10px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="wider"
            mb="1"
            color={groupLabelColor}
          >
            {group.label}
          </Text>
          <Stack spacing="0">
            {group.items.map((category) => (
              <Button
                key={category}
                as={Link}
                href={`/blog?category=${encodeURIComponent(category)}`}
                size="sm"
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="normal"
                fontSize="xs"
                h="7"
                px="2"
                color={mutedColor}
                _hover={{ bg: hoverBg, pl: "3", color: accentColor }}
                transition="all 0.2s"
                borderLeftWidth="2px"
                borderLeftColor="transparent"
                _active={{ borderLeftColor: accentColor }}
                borderRadius="0"
              >
                {category}
              </Button>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default CategoriesSidebar;

