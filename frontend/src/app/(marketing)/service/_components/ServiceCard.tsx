'use client'

import Link from 'next/link'
import {
  Badge,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiArrowRight } from 'react-icons/fi'

interface ServiceCardProps {
  title: string
  description: string
  icon: IconType
  href: string
  categoryLabel: string
  badge?: string
}

export function ServiceCard({ title, description, icon, href, categoryLabel, badge }: ServiceCardProps) {
  const cardBg = useColorModeValue('white', 'rgba(13, 18, 31, 0.92)')
  const borderColor = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.16)')
  const iconBg = useColorModeValue('gray.100', 'rgba(34, 197, 94, 0.12)')
  const iconColor = useColorModeValue('green.600', 'green.300')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const labelColor = useColorModeValue('gray.500', 'gray.400')
  const hoverBorderColor = useColorModeValue('green.300', 'green.400')
  const hoverShadow = useColorModeValue('xl', '0 16px 40px rgba(5, 150, 105, 0.22)')

  return (
    <Card
      as={Link}
      href={href}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      backdropFilter="blur(8px)"
      _hover={{
        borderColor: hoverBorderColor,
        transform: 'translateY(-6px)',
        shadow: hoverShadow,
      }}
      transition="all 0.25s ease"
      cursor="pointer"
      h="full"
      rounded="2xl"
    >
      <CardBody p={{ base: 6, md: 7 }}>
        <VStack align="start" spacing={5} h="full">
          <Flex justify="space-between" w="full" align="start" gap={3}>
            <Flex
              w={12}
              h={12}
              align="center"
              justify="center"
              rounded="xl"
              bg={iconBg}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'rgba(34, 197, 94, 0.28)')}
            >
              <Icon as={icon} boxSize={6} color={iconColor} />
            </Flex>

            <HStack spacing={2} flexWrap="wrap" justify="end">
              <Badge
                variant="subtle"
                colorScheme="green"
                fontSize="0.68rem"
                px={2.5}
                py={1}
                borderRadius="full"
              >
                {categoryLabel}
              </Badge>
              {badge ? (
                <Badge
                  bg={useColorModeValue('gray.200', 'rgba(30, 41, 59, 0.95)')}
                  color={useColorModeValue('gray.700', 'gray.200')}
                  fontSize="0.68rem"
                  px={2.5}
                  py={1}
                  borderRadius="full"
                >
                  {badge}
                </Badge>
              ) : null}
            </HStack>
          </Flex>

          <VStack align="start" spacing={2} flex={1}>
            <Heading as="h3" size="md" lineHeight="1.3">
              {title}
            </Heading>
            <Text color={mutedColor} fontSize="sm" lineHeight="tall">
              {description}
            </Text>
          </VStack>

          <Flex align="center" color={iconColor} fontWeight="semibold" fontSize="sm" gap={2}>
            <Text color={labelColor}>Explore service</Text>
            <Icon as={FiArrowRight} />
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  )
}
