'use client'

import { Card, CardBody, VStack, Heading, Text, Icon, Flex, Badge, useColorModeValue, Button } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

interface ServiceCardProps {
  title: string
  description: string
  icon: IconType
  href: string
  badge?: string
}

export function ServiceCard({ title, description, icon, href, badge }: ServiceCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')

  return (
    <Card
      as={Link}
      href={href}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{
        shadow: '2xl',
        borderColor: iconColor,
        transform: 'translateY(-4px)',
      }}
      transition="all 0.3s"
      cursor="pointer"
      h="full"
    >
      <CardBody>
        <VStack align="start" spacing={4} h="full">
          <Flex justify="space-between" w="full" align="start">
            <Flex
              w={14}
              h={14}
              align="center"
              justify="center"
              rounded="full"
              bg={iconBg}
            >
              <Icon as={icon} boxSize={7} color={iconColor} />
            </Flex>
            {badge && (
              <Badge colorScheme="green" fontSize="xs">
                {badge}
              </Badge>
            )}
          </Flex>
          
          <VStack align="start" spacing={2} flex={1}>
            <Heading as="h3" size="md">
              {title}
            </Heading>
            <Text color="gray.600" fontSize="sm" lineHeight="tall">
              {description}
            </Text>
          </VStack>

          <Flex align="center" color={iconColor} fontWeight="semibold" fontSize="sm">
            Learn More
            <Icon as={FiArrowRight} ml={2} />
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  )
}
