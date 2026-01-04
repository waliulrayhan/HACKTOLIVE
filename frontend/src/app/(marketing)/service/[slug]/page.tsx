'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  List,
  ListItem,
  ListIcon,
  Divider,
  Card,
  CardBody,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi'
import { services } from '../_data/services'
import { QuotationForm } from '../_components/QuotationForm'
import ServiceFAQ from '../_components/ServiceFAQ'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    notFound()
  }

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage="url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000')"
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: useColorModeValue(
            'linear-gradient(135deg, rgba(26, 32, 44, 0.85) 0%, rgba(45, 55, 72, 0.90) 100%)',
            'linear-gradient(135deg, rgba(26, 32, 44, 0.70) 0%, rgba(45, 55, 72, 0.75) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
              <HStack spacing={4} justify="center">
                <Box
                  bg={iconBg}
                  color={iconColor}
                  borderRadius="full"
                  p={4}
                >
                  <Icon as={service.icon} boxSize={8} />
                </Box>
                {service.badge && (
                  <Badge
                    colorScheme="green"
                    fontSize="sm"
                    px={4}
                    py={1}
                    borderRadius="full"
                  >
                    {service.badge}
                  </Badge>
                )}
              </HStack>
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
              >
                {service.title}
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.200"
                maxW="3xl"
              >
                {service.shortDescription}
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      <Container maxW="container.xl" py={16}>
        {/* Overview Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          mb={20}
        >
          <VStack spacing={6} align="start">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
            >
              <Text as="span" color="green.400">
                Overview
              </Text>
            </Heading>
            <Text fontSize="lg" color={mutedColor} lineHeight="tall">
              {service.overview}
            </Text>
          </VStack>
        </MotionBox>

        {/* Why This Matters Section */}
        <Box bg={sectionBg} borderRadius="2xl" p={{ base: 8, md: 12 }} mb={20}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              mb={8}
              textAlign="center"
            >
              Why This Matters
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {service.whyMatters.map((reason, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    variant="outline"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                      borderColor: 'green.500',
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody>
                      <HStack align="start" spacing={3}>
                        <Icon as={FiCheckCircle} color="green.500" boxSize={5} mt={1} flexShrink={0} />
                        <Text>{reason}</Text>
                      </HStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Box>

        {/* Deliverables Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          mb={20}
        >
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            mb={8}
          >
            What You'll Receive
          </Heading>
          <Card bg={cardBg} borderColor={borderColor} variant="outline">
            <CardBody p={8}>
              <List spacing={4}>
                {service.deliverables.map((deliverable, index) => (
                  <ListItem key={index}>
                    <HStack align="start" spacing={3}>
                      <ListIcon as={FiCheckCircle} color="green.500" fontSize="xl" mt={1} />
                      <Text fontSize="md">{deliverable}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Methodology Section */}
        <Box bg={sectionBg} borderRadius="2xl" p={{ base: 8, md: 12 }} mb={20}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              mb={8}
              textAlign="center"
            >
              Our Methodology
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {service.methodology.map((step, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    bg={cardBg}
                    borderColor={borderColor}
                    variant="outline"
                    height="full"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'lg',
                      borderColor: 'green.500',
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Box
                            bg="green.500"
                            color="white"
                            borderRadius="full"
                            w={10}
                            h={10}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontWeight="bold"
                            fontSize="lg"
                          >
                            {index + 1}
                          </Box>
                        </HStack>
                        <Text fontWeight="semibold" fontSize="md">
                          {step}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        </Box>

        {/* Tools & Technologies Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          mb={20}
        >
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            mb={6}
          >
            Tools & Technologies
          </Heading>
          <HStack spacing={3} flexWrap="wrap">
            {service.tools.map((tool, index) => (
              <Badge
                key={index}
                colorScheme="green"
                fontSize="md"
                px={4}
                py={2}
                borderRadius="full"
                variant="subtle"
              >
                {tool}
              </Badge>
            ))}
          </HStack>
        </MotionBox>

        {/* Timeline & Target Audience Section */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} mb={20}>
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              height="full"
            >
              <Card bg={cardBg} borderColor={borderColor} variant="outline" height="full">
                <CardBody p={8}>
                  <HStack mb={4}>
                    <Icon as={FiClock} color="green.500" boxSize={6} />
                    <Heading as="h3" size="md">
                      Expected Timeline
                    </Heading>
                  </HStack>
                  <Text fontSize="lg" fontWeight="semibold" color="green.500">
                    {service.timeline}
                  </Text>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>

          <GridItem>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              height="full"
            >
              <Card bg={cardBg} borderColor={borderColor} variant="outline" height="full">
                <CardBody p={8}>
                  <HStack mb={4}>
                    <Icon as={FiUsers} color="green.500" boxSize={6} />
                    <Heading as="h3" size="md">
                      Who Should Use This Service
                    </Heading>
                  </HStack>
                  <List spacing={2}>
                    {service.whoShouldUse.map((audience, index) => (
                      <ListItem key={index}>
                        <HStack align="start">
                          <ListIcon as={FiCheckCircle} color="green.500" mt={1} />
                          <Text fontSize="sm">{audience}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </MotionBox>
          </GridItem>
        </Grid>

        {/* Modules Section (if applicable) */}
        {service.modules && service.modules.length > 0 && (
          <Box bg={sectionBg} borderRadius="2xl" p={{ base: 8, md: 12 }} mb={20}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <Heading
                as="h2"
                fontSize={{ base: '2xl', md: '3xl' }}
                mb={8}
                textAlign="center"
              >
                Service Modules
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {service.modules.map((module, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      bg={cardBg}
                      borderColor={borderColor}
                      variant="outline"
                      _hover={{
                        transform: 'translateY(-4px)',
                        shadow: 'lg',
                        borderColor: 'green.500',
                      }}
                      transition="all 0.3s"
                    >
                      <CardBody>
                        <Heading as="h4" size="sm" mb={3} color="green.500">
                          {module.name}
                        </Heading>
                        <Text color={mutedColor} fontSize="sm">
                          {module.description}
                        </Text>
                      </CardBody>
                    </Card>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </MotionBox>
          </Box>
        )}

        {/* FAQ Section */}
        {service.faqs && service.faqs.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            mb={20}
          >
            <ServiceFAQ faqs={service.faqs} />
          </MotionBox>
        )}

        <Divider my={12} />

        {/* Request Quotation Form */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack spacing={4} mb={8}>
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '3xl' }}
              textAlign="center"
            >
              Request a Quote
            </Heading>
            <Text textAlign="center" fontSize="lg" color={mutedColor} maxW="2xl">
              Get a customized proposal for your organization
            </Text>
          </VStack>
          <QuotationForm serviceName={service.title} />
        </MotionBox>
      </Container>
    </Box>
  )
}
