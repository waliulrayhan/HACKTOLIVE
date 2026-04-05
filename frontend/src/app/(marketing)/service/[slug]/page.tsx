'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiTarget,
  FiUsers,
} from 'react-icons/fi'
import ServiceFAQ from '../_components/ServiceFAQ'
import { QuotationForm } from '../_components/QuotationForm'
import {
  getServiceBySlug,
  getServicesByCategory,
  serviceCategoryMap,
} from '../_data/services'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const category = serviceCategoryMap[service.categoryId]
  const relatedServices = getServicesByCategory(service.categoryId)

  const pageBg = useColorModeValue('gray.50', '#030712')
  const panelBg = useColorModeValue('white', 'rgba(10, 16, 30, 0.9)')
  const panelBorder = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.2)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box bg={pageBg}>
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 28, md: 34 }}
        pb={{ base: 16, md: 20 }}
        bgGradient={useColorModeValue(
          'linear(128deg, #0a0f1f 0%, #0f172a 55%, #052e2b 100%)',
          'linear(128deg, #05080f 0%, #081121 55%, #052918 100%)'
        )}
        borderBottomWidth="1px"
        borderColor={panelBorder}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack align="start" spacing={6} maxW="4xl">
              <Button
                as={Link}
                href="/service"
                size="sm"
                leftIcon={<FiArrowLeft />}
                variant="outline"
                borderColor="rgba(148, 163, 184, 0.45)"
                color="gray.100"
                _hover={{ bg: 'rgba(15, 23, 42, 0.8)' }}
              >
                Back to Services
              </Button>

              <HStack spacing={3} flexWrap="wrap">
                <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                  {category.label}
                </Badge>
                {service.badge ? (
                  <Badge bg="rgba(30, 41, 59, 0.95)" color="gray.100" px={3} py={1} borderRadius="full">
                    {service.badge}
                  </Badge>
                ) : null}
              </HStack>

              <Heading as="h1" color="white" fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} lineHeight="1.18">
                {service.title}
              </Heading>

              <Text color="gray.200" fontSize={{ base: 'md', md: 'xl' }} maxW="3xl" lineHeight="1.9">
                {service.shortDescription}
              </Text>

              <HStack spacing={3} flexWrap="wrap">
                <Badge bg="rgba(15, 23, 42, 0.9)" color="gray.100" px={3} py={1.5} borderRadius="full">
                  <HStack spacing={1.5}>
                    <FiCalendar />
                    <Text>{service.timeline}</Text>
                  </HStack>
                </Badge>
                <Badge bg="rgba(15, 23, 42, 0.9)" color="gray.100" px={3} py={1.5} borderRadius="full">
                  <HStack spacing={1.5}>
                    <FiLayers />
                    <Text>{service.engagementModel}</Text>
                  </HStack>
                </Badge>
              </HStack>

              <HStack spacing={4} flexWrap="wrap">
                <Button as={Link} href="/contact" colorScheme="green" rightIcon={<FiArrowRight />}>
                  Talk to an Advisor
                </Button>
                <Button
                  as={Link}
                  href="#quotation-form"
                  variant="outline"
                  borderColor="rgba(148, 163, 184, 0.45)"
                  color="gray.100"
                >
                  Request Proposal
                </Button>
              </HStack>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box borderWidth="1px" borderColor={panelBorder} borderRadius="2xl" p={{ base: 6, md: 8 }} bg={panelBg}>
            <Grid templateColumns={{ base: '1fr', lg: '0.9fr 1.4fr' }} gap={8}>
              <GridItem>
                <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} mb={4}>
                  More {category.label}
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {relatedServices.map((item) => {
                    const isCurrent = item.slug === service.slug

                    return (
                      <Button
                        as={Link}
                        key={item.id}
                        href={`/service/${item.slug}`}
                        justifyContent="start"
                        variant="ghost"
                        fontWeight={isCurrent ? 'bold' : 'medium'}
                        bg={isCurrent ? useColorModeValue('green.50', 'rgba(22, 101, 52, 0.25)') : 'transparent'}
                        color={isCurrent ? useColorModeValue('green.700', 'green.200') : useColorModeValue('gray.700', 'gray.200')}
                        borderLeftWidth="3px"
                        borderColor={isCurrent ? useColorModeValue('green.500', 'green.400') : 'transparent'}
                        borderRadius="md"
                        _hover={{ bg: useColorModeValue('gray.100', 'rgba(30, 41, 59, 0.85)') }}
                      >
                        {item.title}
                      </Button>
                    )
                  })}
                </VStack>
              </GridItem>

              <GridItem>
                <VStack align="start" spacing={5}>
                  <Text color={mutedColor} lineHeight="1.9" fontSize={{ base: 'md', md: 'lg' }}>
                    {service.overview}
                  </Text>
                  <Box borderWidth="1px" borderColor={panelBorder} borderRadius="xl" p={5} w="full">
                    <Badge colorScheme="red" variant="subtle" mb={3} borderRadius="full">
                      Core Risk
                    </Badge>
                    <Text color={mutedColor} lineHeight="1.8">
                      {service.challenge}
                    </Text>
                  </Box>
                  <Button as={Link} href="/contact" colorScheme="green" rightIcon={<FiCompass />}>
                    Discuss This Service
                  </Button>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        </MotionBox>

        <MotionBox
          mt={{ base: 12, md: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box
            borderRadius="2xl"
            p={{ base: 6, md: 9 }}
            bgGradient={useColorModeValue(
              'linear(to-r, #0f172a, #1e293b, #1f3d3a)',
              'linear(to-r, #0b1220, #111c31, #15352a)'
            )}
            borderWidth="1px"
            borderColor="rgba(148, 163, 184, 0.2)"
          >
            <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full" mb={4}>
              Our Approach
            </Badge>
            <Heading as="h2" color="white" fontSize={{ base: '2xl', md: '4xl' }} mb={4}>
              Practical, Context-Aware Security Delivery
            </Heading>
            <Text color="gray.200" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.9" maxW="5xl">
              We design each engagement around your architecture, business criticality, and operational constraints.
              The goal is simple: identify what matters most, prove risk clearly, and help your team reduce it fast.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={8}>
              {service.approach.map((item, index) => (
                <HStack
                  key={index}
                  align="start"
                  spacing={3}
                  p={4}
                  borderWidth="1px"
                  borderColor="rgba(148, 163, 184, 0.2)"
                  borderRadius="xl"
                  bg="rgba(15, 23, 42, 0.65)"
                >
                  <Icon as={FiCheckCircle} color="green.300" boxSize={5} mt={1} />
                  <Text color="gray.100">{item}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        </MotionBox>

        <MotionBox
          mt={{ base: 12, md: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <VStack align="start" spacing={4} mb={6}>
            <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
              Delivery Methodology
            </Badge>
            <Heading as="h2" fontSize={{ base: '2xl', md: '4xl' }}>
              Structured Execution from Discovery to Closure
            </Heading>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
            {service.methodology.map((step) => (
              <Box
                key={step.title}
                bg={panelBg}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="xl"
                p={6}
              >
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {step.title}
                </Text>
                <Text color={mutedColor} lineHeight="1.8" fontSize="sm">
                  {step.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>

        <MotionBox
          mt={{ base: 12, md: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            bgGradient={useColorModeValue(
              'linear(to-r, #0f172a, #1e293b, #3b1d4a)',
              'linear(to-r, #0b1220, #10192d, #2a143c)'
            )}
            borderWidth="1px"
            borderColor="rgba(148, 163, 184, 0.2)"
          >
            <VStack align="start" spacing={4} mb={6}>
              <Badge colorScheme="pink" variant="subtle" px={3} py={1} borderRadius="full">
                Key Statistics
              </Badge>
              <Heading as="h2" color="white" fontSize={{ base: '2xl', md: '4xl' }}>
                Why This Risk Category Demands Attention
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {service.kpis.map((kpi) => (
                <Box key={`${kpi.value}-${kpi.label}`} p={5} borderRadius="xl" bg="rgba(15, 23, 42, 0.62)" borderWidth="1px" borderColor="rgba(148, 163, 184, 0.24)">
                  <Text fontSize={{ base: '3xl', md: '4xl' }} color="white" fontWeight="black" lineHeight="1">
                    {kpi.value}
                  </Text>
                  <Text color="gray.200" mt={2} fontWeight="semibold">
                    {kpi.label}
                  </Text>
                  <Text color="gray.400" mt={3} fontSize="xs">
                    {kpi.source}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </MotionBox>

        <MotionBox
          mt={{ base: 12, md: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <Grid templateColumns={{ base: '1fr', xl: '1.3fr 1fr' }} gap={6}>
            <GridItem>
              <Box bg={panelBg} borderWidth="1px" borderColor={panelBorder} borderRadius="2xl" p={{ base: 6, md: 8 }} h="full">
                <Badge colorScheme="yellow" variant="subtle" px={3} py={1} borderRadius="full" mb={3}>
                  Expected Outcomes
                </Badge>
                <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }} mb={4}>
                  What You Achieve from This Engagement
                </Heading>
                <List spacing={3}>
                  {service.outcomes.map((item, index) => (
                    <ListItem key={index}>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiTarget} color="green.400" mt={1} />
                        <Text color={mutedColor}>{item}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>

                <Heading as="h3" size="md" mt={8} mb={3}>
                  Deliverables
                </Heading>
                <List spacing={3}>
                  {service.deliverables.map((item, index) => (
                    <ListItem key={index}>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiCheckCircle} color="green.400" mt={1} />
                        <Text color={mutedColor}>{item}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={panelBg} borderWidth="1px" borderColor={panelBorder} borderRadius="2xl" p={{ base: 6, md: 8 }} h="full">
                <Badge colorScheme="cyan" variant="subtle" px={3} py={1} borderRadius="full" mb={3}>
                  Best Fit
                </Badge>
                <Heading as="h3" fontSize={{ base: 'xl', md: '2xl' }} mb={4}>
                  Ideal For
                </Heading>
                <Stack spacing={3}>
                  {service.idealFor.map((item, index) => (
                    <HStack key={index} align="start" spacing={3}>
                      <Icon as={FiUsers} color="green.400" mt={1} />
                      <Text color={mutedColor}>{item}</Text>
                    </HStack>
                  ))}
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </MotionBox>

        {service.faqs.length > 0 ? (
          <MotionBox
            mt={{ base: 12, md: 16 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <ServiceFAQ
              faqs={service.faqs}
              title={`Frequently Asked Questions: ${service.title}`}
              subtitle="Everything you need to know before starting this engagement."
            />
          </MotionBox>
        ) : null}

        <MotionBox
          id="quotation-form"
          mt={{ base: 12, md: 16 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <QuotationForm serviceName={service.title} />
        </MotionBox>
      </Container>
    </Box>
  )
}
