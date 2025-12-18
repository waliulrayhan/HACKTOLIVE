'use client'

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MegaMenuSection, MegaMenuItem } from './mega-menu-data'

const MotionBox = motion(Box)

interface MegaMenuContentProps {
  sections: MegaMenuSection[]
  featured?: {
    title: string
    description: string
    image?: string
    href: string
  }
  isOpen: boolean
  onClose: () => void
}

export const MegaMenuContent = ({
  sections,
  featured,
  isOpen,
  onClose,
}: MegaMenuContentProps) => {
  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.800')
  const featuredBg = useColorModeValue('blue.50', 'blue.900')
  const featuredBorder = useColorModeValue('blue.200', 'blue.700')

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          position="absolute"
          left="0"
          right="0"
          top="100%"
          bg={bgColor}
          borderBottom="1px"
          borderColor={borderColor}
          boxShadow="xl"
          zIndex={50}
          onMouseLeave={onClose}
        >
          <Container maxW="container.2xl" px={{ base: '8', md: '12', lg: '20' }} py="8">
            <Grid
              templateColumns={featured ? 'repeat(4, 1fr)' : `repeat(${sections.length}, 1fr)`}
              gap={8}
            >
              {sections.map((section, idx) => (
                <GridItem key={idx}>
                  <VStack align="stretch" spacing={4}>
                    <Heading
                      size="sm"
                      color={useColorModeValue('gray.700', 'gray.300')}
                      fontWeight="semibold"
                      textTransform="uppercase"
                      fontSize="xs"
                      letterSpacing="wide"
                    >
                      {section.title}
                    </Heading>
                    <VStack align="stretch" spacing={1}>
                      {section.items.map((item, itemIdx) => (
                        <MenuItemCard
                          key={itemIdx}
                          item={item}
                          hoverBg={hoverBg}
                          onClose={onClose}
                        />
                      ))}
                    </VStack>
                  </VStack>
                </GridItem>
              ))}

              {featured && (
                <GridItem>
                  <ChakraLink
                    as={Link}
                    href={featured.href}
                    onClick={onClose}
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Box
                      p={6}
                      bg={featuredBg}
                      borderRadius="lg"
                      border="1px"
                      borderColor={featuredBorder}
                      h="full"
                      transition="all 0.2s"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                    >
                      <VStack align="start" spacing={3} h="full">
                        <Box
                          px={3}
                          py={1}
                          bg={useColorModeValue('blue.600', 'blue.300')}
                          color={useColorModeValue('white', 'gray.900')}
                          fontSize="xs"
                          fontWeight="bold"
                          borderRadius="full"
                          textTransform="uppercase"
                        >
                          Featured
                        </Box>
                        <Heading size="sm" color={useColorModeValue('gray.900', 'white')}>
                          {featured.title}
                        </Heading>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue('gray.600', 'gray.300')}
                          flex="1"
                        >
                          {featured.description}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={useColorModeValue('blue.600', 'blue.300')}
                          fontWeight="semibold"
                        >
                          Learn more →
                        </Text>
                      </VStack>
                    </Box>
                  </ChakraLink>
                </GridItem>
              )}
            </Grid>
          </Container>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}

interface MenuItemCardProps {
  item: MegaMenuItem
  hoverBg: string
  onClose: () => void
}

const MenuItemCard = ({ item, hoverBg, onClose }: MenuItemCardProps) => {
  return (
    <ChakraLink
      as={Link}
      href={item.href}
      onClick={onClose}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        p={3}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{
          bg: hoverBg,
          transform: 'translateX(4px)',
        }}
      >
        <HStack spacing={3} align="start">
          {item.icon && (
            <Icon
              as={item.icon}
              boxSize={5}
              color={useColorModeValue('blue.500', 'blue.300')}
              mt={0.5}
            />
          )}
          <VStack align="start" spacing={0.5} flex="1">
            <Text
              fontWeight="semibold"
              fontSize="sm"
              color={useColorModeValue('gray.900', 'white')}
            >
              {item.title}
            </Text>
            <Text
              fontSize="xs"
              color={useColorModeValue('gray.600', 'gray.400')}
              lineHeight="short"
            >
              {item.description}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </ChakraLink>
  )
}
