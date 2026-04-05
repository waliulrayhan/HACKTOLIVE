'use client'

import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Icon,
  Image,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiCheckCircle, FiClock, FiShield, FiZap } from 'react-icons/fi'
import { QuotationForm } from './QuotationForm'
import { services } from '../_data/services'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  heading?: string
}

function getServiceVisual(serviceName: string) {
  const service = services.find((item) => item.title === serviceName)

  if (service) {
    return {
      src: service.imageUrl,
      label: service.title,
    }
  }

  return {
    src: 'https://picsum.photos/seed/cybersecurity-consulting/1600/900',
    label: 'Cybersecurity Consulting',
  }
}

export function ConsultationModal({
  isOpen,
  onClose,
  serviceName,
  heading = 'Book a Security Consultation',
}: ConsultationModalProps) {
  const serviceVisual = getServiceVisual(serviceName)
  const panelBg = useColorModeValue('gray.50', 'rgba(15, 23, 42, 0.75)')
  const panelBorder = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.25)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(8px)" />
      <ModalContent
        bg={useColorModeValue('white', 'rgba(8, 14, 26, 0.97)')}
        borderWidth="1px"
        borderColor={panelBorder}
        borderRadius="2xl"
        minH={{ base: 'auto', md: '82vh' }}
        mx={{ base: 4, md: 0 }}
      >
        <ModalHeader pb={2}>{heading}</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={{ base: 4, md: 6 }}>
          <Grid templateColumns={{ base: '1fr', lg: '0.9fr 1.35fr' }} gap={6}>
            <GridItem>
              <Box
                borderWidth="1px"
                borderColor={panelBorder}
                bg={panelBg}
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
                h="full"
              >
                <VStack align="start" spacing={5}>
                  <Box
                    w="full"
                    borderRadius="lg"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor={panelBorder}
                    position="relative"
                  >
                    <Image
                      src={serviceVisual.src}
                      alt={`${serviceVisual.label} visual`}
                      w="full"
                      h={{ base: '170px', md: '210px' }}
                      objectFit="cover"
                    />
                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-t, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 0.2), transparent)"
                    />
                    <Badge
                      position="absolute"
                      left={3}
                      bottom={3}
                      colorScheme="green"
                      variant="solid"
                      px={2.5}
                      py={1}
                      borderRadius="md"
                    >
                      {serviceVisual.label}
                    </Badge>
                  </Box>

                  <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                    Fast Response
                  </Badge>

                  <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                    Share your goals. Get a clear action plan.
                  </Text>

                  <Text color={mutedColor} lineHeight="1.8">
                    Tell us what you are trying to secure, what timeline you are working with, and where you need help.
                    Our team will respond with scoped recommendations and next steps.
                  </Text>

                  <List spacing={3} pt={1}>
                    <ListItem>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiClock} color="green.400" mt={1} />
                        <Text color={mutedColor}>Initial response in 24 business hours</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiShield} color="green.400" mt={1} />
                        <Text color={mutedColor}>NDA-friendly discovery process</Text>
                      </HStack>
                    </ListItem>
                    <ListItem>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiZap} color="green.400" mt={1} />
                        <Text color={mutedColor}>Practical recommendations, not generic advice</Text>
                      </HStack>
                    </ListItem>
                  </List>

                  <Box
                    borderWidth="1px"
                    borderColor={panelBorder}
                    borderRadius="lg"
                    p={4}
                    bg={useColorModeValue('white', 'rgba(2, 6, 23, 0.8)')}
                    w="full"
                  >
                    <HStack spacing={2} mb={1}>
                      <Icon as={FiCheckCircle} color="green.400" />
                      <Text fontWeight="semibold">Selected Service</Text>
                    </HStack>
                    <Text color={mutedColor}>{serviceName}</Text>
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            <GridItem>
              <QuotationForm serviceName={serviceName} />
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
