'use client'

import {
  Box,
  Container,
  Grid,
  GridItem,
  Button,
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
import { FiArrowRight } from 'react-icons/fi'
import { MegaMenuSection, MegaMenuItem } from './mega-menu-data'

const MotionBox = motion(Box)

interface MegaMenuContentProps {
  sections: MegaMenuSection[]
  showItemDescriptions?: boolean
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
  showItemDescriptions = true,
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
        >
          <Container maxW="container.2xl" px={{ base: '8', md: '12', lg: '20' }} py="8">
            <Grid templateColumns={`repeat(${sections.length}, minmax(0, 1fr))`} gap={8}>
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
                    {section.description ? (
                      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} lineHeight="tall">
                        {section.description}
                      </Text>
                    ) : null}
                    <VStack align="stretch" spacing={1}>
                      {section.items.map((item, itemIdx) => (
                        <MenuItemCard
                          key={itemIdx}
                          item={item}
                          hoverBg={hoverBg}
                          onClose={onClose}
                          showDescription={showItemDescriptions}
                        />
                      ))}
                    </VStack>
                  </VStack>
                </GridItem>
              ))}
            </Grid>

            {/* {featured && (
              <Box mt={8}>
                <ChakraLink
                  as={Link}
                  href={featured.href}
                  onClick={onClose}
                  _hover={{ textDecoration: 'none' }}
                >
                  <Box
                    px={6}
                    py={5}
                    bgGradient={useColorModeValue(
                      'linear(135deg, rgba(240,249,255,0.9), rgba(236,253,245,0.95))',
                      'linear(135deg, rgba(15,23,42,0.95), rgba(6,78,59,0.55))'
                    )}
                    borderRadius="xl"
                    border="1px"
                    borderColor={featuredBorder}
                  >
                    <Grid templateColumns={{ base: '1fr', md: '1.2fr auto' }} gap={4} alignItems="center">
                      <Box>
                        <Box
                          px={3}
                          py={1}
                          bg={useColorModeValue('blue.600', 'blue.300')}
                          color={useColorModeValue('white', 'gray.900')}
                          fontSize="xs"
                          fontWeight="bold"
                          borderRadius="full"
                          textTransform="uppercase"
                          display="inline-flex"
                          mb={3}
                        >
                          Featured
                        </Box>
                        <Heading size="sm" color={useColorModeValue('gray.900', 'white')} mb={1}>
                          {featured.title}
                        </Heading>
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                          {featured.description}
                        </Text>
                      </Box>

                      <Button colorScheme="green" rightIcon={<FiArrowRight />}>
                        Explore services
                      </Button>
                    </Grid>
                  </Box>
                </ChakraLink>
              </Box>
            )} */}
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
  showDescription: boolean
}

const MenuItemCard = ({ item, hoverBg, onClose, showDescription }: MenuItemCardProps) => {
  return (
    <ChakraLink
      as={Link}
      href={item.href}
      onClick={onClose}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        px={3}
        py={showDescription ? 2.5 : 3}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{
          bg: hoverBg,
          transform: 'translateX(4px)',
        }}
      >
        <HStack spacing={3} align="center">
          {item.icon && (
            <Icon
              as={item.icon}
              boxSize={5}
              color={useColorModeValue('blue.500', 'blue.300')}
            />
          )}
          <VStack align="start" spacing={showDescription ? 0 : 0.5} flex="1">
            <Text
              fontWeight="semibold"
              fontSize="sm"
              color={useColorModeValue('gray.900', 'white')}
            >
              {item.title}
            </Text>
            {showDescription ? (
              <Text
                fontSize="xs"
                color={useColorModeValue('gray.600', 'gray.400')}
                lineHeight="short"
              >
                {item.description}
              </Text>
            ) : null}
          </VStack>
        </HStack>
      </Box>
    </ChakraLink>
  )
}
