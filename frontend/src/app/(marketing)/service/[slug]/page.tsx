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
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiTarget,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiClipboard,
} from 'react-icons/fi'
import ServiceFAQ from '../_components/ServiceFAQ'
import { ConsultationModal } from '../_components/ConsultationModal'
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
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (!service) {
    notFound()
  }

  const category = serviceCategoryMap[service.categoryId]
  const relatedServices = getServicesByCategory(service.categoryId).filter(s => s.id !== service.id)
  const slugCommand = service.slug.replace(/-/g, '_')
  const terminalFocus = service.idealFor[0] ?? category.label
  const terminalOutcome = service.outcomes[0] ?? 'Operational resilience improved'
  const terminalDeliverable = service.deliverables[0] ?? 'Actionable service report'
  const terminalKpi = service.kpis[0]
  const terminalRiskLine = terminalKpi
    ? `${terminalKpi.value} ${terminalKpi.label}`
    : `Priority risk profile validated for ${service.title}`

  const pageBg = useColorModeValue('gray.50', '#030712')
  const panelBg = useColorModeValue('white', 'rgba(10, 16, 30, 0.9)')
  const panelBorder = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.2)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')
  const accentCardBg = useColorModeValue('rgba(16, 185, 129, 0.08)', 'rgba(16, 185, 129, 0.1)')
  const dangerCardBg = useColorModeValue('rgba(239, 68, 68, 0.08)', 'rgba(239, 68, 68, 0.1)')

  return (
    <Box bg={pageBg}>
      {/* HERO SECTION */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 28, md: 36 }}
        pb={{ base: 20, md: 28 }}
        bgGradient={useColorModeValue(
          'linear(128deg, #0a0f1f 0%, #0f172a 40%, #1a3d47 70%, #052e2b 100%)',
          'linear(128deg, #05080f 0%, #081121 40%, #1a3d47 70%, #052918 100%)'
        )}
        borderBottomWidth="1px"
        borderColor={panelBorder}
      >
        {/* Animated background gradients */}
        <Box
          position="absolute"
          top="-40%"
          right="-20%"
          width="600px"
          height="600px"
          borderRadius="full"
          bgGradient="radial(circle, rgba(16, 185, 129, 0.15), transparent)"
          filter="blur(80px)"
          zIndex={0}
        />
        <Box
          position="absolute"
          bottom="-30%"
          left="-10%"
          width="500px"
          height="500px"
          borderRadius="full"
          bgGradient="radial(circle, rgba(59, 130, 246, 0.1), transparent)"
          filter="blur(60px)"
          zIndex={0}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap={{ base: 10, lg: 12 }} alignItems="center">
              <VStack align="start" spacing={8}>
                <Button
                  as={Link}
                  href="/service"
                  size="sm"
                  leftIcon={<FiArrowLeft size={16} />}
                  variant="outline"
                  borderColor="rgba(148, 163, 184, 0.45)"
                  color="gray.100"
                  _hover={{ bg: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(148, 163, 184, 0.7)' }}
                >
                  Back to Services
                </Button>

                <VStack align="start" spacing={6} w="full">
                  <HStack spacing={3} flexWrap="wrap">
                    <Badge colorScheme="green" variant="subtle" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="600">
                      {category.label}
                    </Badge>
                    {service.badge ? (
                      <Badge bg="rgba(249, 115, 22, 0.2)" color="orange.200" px={4} py={2} borderRadius="full" fontSize="sm" fontWeight="600">
                        {service.badge}
                      </Badge>
                    ) : null}
                  </HStack>

                  <VStack align="start" spacing={4}>
                    <Heading
                      as="h1"
                      color="white"
                      fontSize={{ base: '2.5xl', md: '4xl', lg: '5xl' }}
                      lineHeight="1.2"
                      fontWeight="800"
                    >
                      {service.title}
                    </Heading>

                    <Text
                      color="gray.300"
                      fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                      maxW="3xl"
                      lineHeight="1.6"
                      fontWeight="500"
                    >
                      {service.shortDescription}
                    </Text>
                  </VStack>

                  {/* Quick Info Cards */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="2xl" pt={2}>
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg="rgba(15, 23, 42, 0.85)"
                      borderWidth="1px"
                      borderColor="rgba(148, 163, 184, 0.25)"
                      backdropFilter="blur(10px)"
                    >
                      <HStack spacing={2} mb={2}>
                        <Icon as={FiClock} color="blue.300" boxSize={5} />
                        <Text fontSize="sm" color="gray.400" fontWeight="500">Timeline</Text>
                      </HStack>
                      <Text fontSize="md" color="white" fontWeight="600">{service.timeline}</Text>
                    </Box>

                    <Box
                      p={4}
                      borderRadius="lg"
                      bg="rgba(15, 23, 42, 0.85)"
                      borderWidth="1px"
                      borderColor="rgba(148, 163, 184, 0.25)"
                      backdropFilter="blur(10px)"
                    >
                      <HStack spacing={2} mb={2}>
                        <Icon as={FiLayers} color="emerald.300" boxSize={5} />
                        <Text fontSize="sm" color="gray.400" fontWeight="500">Engagement Model</Text>
                      </HStack>
                      <Text fontSize="md" color="white" fontWeight="600">{service.engagementModel}</Text>
                    </Box>
                  </SimpleGrid>

                  <HStack spacing={4} flexWrap="wrap" pt={2}>
                    <Button
                      onClick={onOpen}
                      colorScheme="green"
                      size="lg"
                      rightIcon={<FiArrowRight size={18} />}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    >
                      Talk to an Advisor
                    </Button>
                    <Button
                      onClick={onOpen}
                      variant="outline"
                      size="lg"
                      borderColor="rgba(16, 185, 129, 0.5)"
                      color="emerald.300"
                      _hover={{ bg: 'rgba(16, 185, 129, 0.1)', borderColor: 'emerald.300' }}
                    >
                      Request Consultation
                    </Button>
                  </HStack>
                </VStack>
              </VStack>

              <Box
                borderRadius="2xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor="rgba(148, 163, 184, 0.25)"
                bg="#040b16"
                boxShadow="0 30px 70px rgba(0, 0, 0, 0.45)"
                w="full"
                maxW={{ base: 'full', lg: '560px' }}
                justifySelf={{ base: 'stretch', lg: 'end' }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  px={4}
                  py={3}
                  bg="rgba(15, 23, 42, 0.95)"
                  borderBottomWidth="1px"
                  borderColor="rgba(148, 163, 184, 0.25)"
                >
                  <HStack spacing={2}>
                    <Box w={3} h={3} borderRadius="full" bg="#f87171" />
                    <Box w={3} h={3} borderRadius="full" bg="#fbbf24" />
                    <Box w={3} h={3} borderRadius="full" bg="#4ade80" />
                  </HStack>
                  <Text color="gray.400" fontSize="xs" fontFamily="mono" letterSpacing="0.04em">
                    htl-sec ~ {service.slug}
                  </Text>
                </Flex>

                <Box px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }} fontFamily="mono" fontSize={{ base: 'sm', md: 'md' }}>
                  <Text color="#4ade80" mb={3}>htl@sec:~$ assess_service --slug "{service.slug}"</Text>
                  <VStack align="start" spacing={2} mb={5} color="gray.200" pl={2}>
                    <Text>{'>'} Scope aligned for {category.label}</Text>
                    <Text color="#fca5a5">{'>'} {terminalRiskLine}</Text>
                    <Text>{'>'} Primary focus: {terminalFocus}</Text>
                  </VStack>

                  <Text color="#4ade80" mb={3}>htl@sec:~$ simulate_{slugCommand} --timeline "{service.timeline}"</Text>
                  <VStack align="start" spacing={2} color="#86efac" pl={2}>
                    <Text>{'>'} Outcome signal: {terminalOutcome}</Text>
                    <Text>{'>'} Deliverable queued: {terminalDeliverable}</Text>
                  </VStack>

                  <Text color="#4ade80" mt={6}>htl@sec:~$</Text>
                </Box>
              </Box>
            </Grid>
          </FallInPlace>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxW="container.xl" py={{ base: 12, md: 20 }}>
        
        {/* OVERVIEW & CHALLENGE SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 16, md: 24 }}
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Overview Card */}
            <GridItem>
              <Box
                bg={panelBg}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
                h="full"
              >
                <HStack spacing={2} mb={4}>
                  <Icon as={FiCompass} color="blue.400" boxSize={6} />
                  <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                    Overview
                  </Heading>
                </HStack>
                <Text color={mutedColor} lineHeight="1.9" fontSize="md">
                  {service.overview}
                </Text>
              </Box>
            </GridItem>

            {/* Challenge Card */}
            <GridItem>
              <Box
                bg={dangerCardBg}
                borderWidth="2px"
                borderColor="rgba(239, 68, 68, 0.3)"
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
                h="full"
              >
                <HStack spacing={2} mb={4}>
                  <Icon as={FiAlertCircle} color="red.400" boxSize={6} />
                  <Heading as="h2" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="700">
                    The Challenge
                  </Heading>
                </HStack>
                <Text color={mutedColor} lineHeight="1.9" fontSize="md">
                  {service.challenge}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </MotionBox>

        {/* WHAT YOU GET SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 16, md: 24 }}
        >
          <VStack align="start" spacing={6} mb={8}>
            <VStack align="start" spacing={2}>
              <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                Expected Outcomes
              </Badge>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3.5xl' }} fontWeight="800">
                What You Achieve
              </Heading>
            </VStack>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {service.outcomes.map((outcome, idx) => (
              <Box
                key={idx}
                bg={accentCardBg}
                borderWidth="1px"
                borderColor="rgba(16, 185, 129, 0.3)"
                borderRadius="xl"
                p={6}
                _hover={{ 
                  borderColor: 'rgba(16, 185, 129, 0.6)',
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.3s ease"
              >
                <HStack spacing={3} mb={3}>
                  <Icon as={FiCheckCircle} color="emerald.400" boxSize={5} />
                  <Text fontSize="sm" color="emerald.300" fontWeight="600">Result</Text>
                </HStack>
                <Text color="white" fontSize="md" fontWeight="600" lineHeight="1.6">
                  {outcome}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </MotionBox>

        {/* KEY STATISTICS SECTION */}
        {service.kpis.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            mb={{ base: 16, md: 24 }}
          >
            <VStack align="start" spacing={6} mb={8}>
              <Badge colorScheme="pink" variant="subtle" px={3} py={1} borderRadius="full">
                Industry Context
              </Badge>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3.5xl' }} fontWeight="800">
                Why This Matters
              </Heading>
              <Text color={mutedColor} fontSize="lg" maxW="3xl" lineHeight="1.7">
                These metrics show why this service category is critical to your security posture and business continuity.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {service.kpis.map((kpi, idx) => (
                <MotionBox
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Box
                    bg={panelBg}
                    borderWidth="1px"
                    borderColor={panelBorder}
                    borderRadius="xl"
                    p={6}
                    _hover={{ borderColor: 'rgba(148, 163, 184, 0.4)' }}
                    transition="all 0.3s ease"
                  >
                    <Text 
                      fontSize={{ base: '3xl', md: '4xl' }} 
                      color="emerald.400" 
                      fontWeight="900" 
                      lineHeight="1"
                      mb={3}
                    >
                      {kpi.value}
                    </Text>
                    <Text color="white" fontWeight="700" fontSize="md" mb={3} lineHeight="1.4">
                      {kpi.label}
                    </Text>
                    <Text color="gray.400" fontSize="xs" fontStyle="italic">
                      Source: {kpi.source}
                    </Text>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionBox>
        )}

        {/* OUR APPROACH SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 16, md: 24 }}
        >
          <Box
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            bgGradient={useColorModeValue(
              'linear(to-r, #0f172a, #1e293b, #1f3d3a)',
              'linear(to-r, #0b1220, #111c31, #15352a)'
            )}
            borderWidth="1px"
            borderColor="rgba(148, 163, 184, 0.2)"
          >
            <VStack align="start" spacing={6} mb={8}>
              <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                Methodology
              </Badge>
              <Heading as="h2" color="white" fontSize={{ base: '2xl', md: '3.5xl' }} fontWeight="800">
                Our Approach
              </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
              {service.approach.map((item, index) => (
                <Box
                  key={index}
                  p={5}
                  borderWidth="1px"
                  borderColor="rgba(16, 185, 129, 0.25)"
                  borderRadius="lg"
                  bg="rgba(15, 23, 42, 0.65)"
                  _hover={{ borderColor: 'rgba(16, 185, 129, 0.5)' }}
                  transition="all 0.3s ease"
                >
                  <HStack spacing={3} align="start">
                    <Icon as={FiCheckCircle} color="emerald.300" boxSize={5} mt={1} flexShrink={0} />
                    <Text color="gray.100" fontSize="md" fontWeight="500" lineHeight="1.6">
                      {item}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </MotionBox>

        {/* DELIVERY METHODOLOGY SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 16, md: 24 }}
        >
          <VStack align="start" spacing={6} mb={8}>
            <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
              Process
            </Badge>
            <Heading as="h2" fontSize={{ base: '2xl', md: '3.5xl' }} fontWeight="800">
              Structured Delivery Process
            </Heading>
            <Text color={mutedColor} fontSize="lg" maxW="3xl" lineHeight="1.7">
              Our proven methodology ensures consistency, quality, and measurable outcomes across every engagement.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {service.methodology.map((step, idx) => (
              <MotionBox
                key={step.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Box
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="xl"
                  p={6}
                  position="relative"
                  overflow="hidden"
                >
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    width="4px"
                    height="full"
                    bg={`linear-gradient(180deg, rgba(16, 185, 129, 0.6) 0%, rgba(16, 185, 129, 0) 100%)`}
                  />
                  <HStack spacing={3} mb={3}>
                    <Flex
                      width={10}
                      height={10}
                      borderRadius="full"
                      bg="rgba(16, 185, 129, 0.1)"
                      borderWidth="2px"
                      borderColor="emerald.400"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Text fontSize="lg" fontWeight="900" color="emerald.400">
                        {idx + 1}
                      </Text>
                    </Flex>
                    <Heading as="h3" fontSize="lg" fontWeight="700">
                      {step.title}
                    </Heading>
                  </HStack>
                  <Text color={mutedColor} lineHeight="1.8" fontSize="md" ml={14}>
                    {step.description}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </MotionBox>

        {/* DELIVERABLES & IDEAL FOR SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 16, md: 24 }}
        >
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Deliverables */}
            <GridItem>
              <Box
                bg={panelBg}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
              >
                <HStack spacing={2} mb={6}>
                  <Icon as={FiClipboard} color="blue.400" boxSize={6} />
                  <Heading as="h3" fontSize="xl" fontWeight="700">
                    Deliverables
                  </Heading>
                </HStack>
                <List spacing={4}>
                  {service.deliverables.map((item, index) => (
                    <ListItem key={index}>
                      <HStack align="start" spacing={3}>
                        <ListIcon as={FiCheckCircle} color="emerald.400" boxSize={5} mt={0.5} flexShrink={0} />
                        <Text color={mutedColor} fontSize="md" lineHeight="1.6">
                          {item}
                        </Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </GridItem>

            {/* Ideal For */}
            <GridItem>
              <Box
                bg={panelBg}
                borderWidth="1px"
                borderColor={panelBorder}
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
              >
                <HStack spacing={2} mb={6}>
                  <Icon as={FiUsers} color="indigo.400" boxSize={6} />
                  <Heading as="h3" fontSize="xl" fontWeight="700">
                    Ideal For
                  </Heading>
                </HStack>
                <List spacing={4}>
                  {service.idealFor.map((item, index) => (
                    <ListItem key={index}>
                      <HStack align="start" spacing={3}>
                        <Icon as={FiTarget} color="indigo.400" boxSize={5} mt={0.5} flexShrink={0} />
                        <Text color={mutedColor} fontSize="md" lineHeight="1.6">
                          {item}
                        </Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </GridItem>
          </Grid>
        </MotionBox>

        {/* RELATED SERVICES SECTION */}
        {relatedServices.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            mb={{ base: 16, md: 24 }}
          >
            <VStack align="start" spacing={6} mb={8}>
              <Badge colorScheme="cyan" variant="subtle" px={3} py={1} borderRadius="full">
                Explore More
              </Badge>
              <Heading as="h2" fontSize={{ base: '2xl', md: '3.5xl' }} fontWeight="800">
                Related Services
              </Heading>
              <Text color={mutedColor} fontSize="lg" maxW="3xl" lineHeight="1.7">
                Complementary services that often work together for comprehensive security coverage.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {relatedServices.map((relService) => (
                <Box
                  key={relService.id}
                  as={Link}
                  href={`/service/${relService.slug}`}
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={panelBorder}
                  borderRadius="xl"
                  p={6}
                  _hover={{
                    borderColor: 'rgba(16, 185, 129, 0.5)',
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.3s ease"
                >
                  <HStack spacing={4} mb={3}>
                    <Box p={3} bg="rgba(16, 185, 129, 0.1)" borderRadius="lg">
                      <Icon as={relService.icon} color="emerald.400" boxSize={6} />
                    </Box>
                    <Heading as="h4" fontSize="lg" fontWeight="700">
                      {relService.title}
                    </Heading>
                  </HStack>
                  <Text color={mutedColor} fontSize="sm" lineHeight="1.6" mb={4}>
                    {relService.shortDescription}
                  </Text>
                  <HStack spacing={2} color="emerald.400" fontWeight="600" fontSize="sm">
                    <Text>Explore Service</Text>
                    <FiArrowRight size={16} />
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          </MotionBox>
        )}

        {/* FAQ SECTION */}
        {service.faqs.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            mb={{ base: 16, md: 24 }}
          >
            <ServiceFAQ
              faqs={service.faqs}
              title={`Frequently Asked Questions`}
              subtitle="Common questions about this service and how it works."
            />
          </MotionBox>
        )}

        {/* FINAL CTA SECTION */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          mb={{ base: 12, md: 16 }}
        >
          <Box
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            bgGradient={useColorModeValue(
              'linear(135deg, #0f172a 0%, #1a3d47 50%, #1e293b 100%)',
              'linear(135deg, #0b1220 0%, #1a3d47 50%, #111c31 100%)'
            )}
            borderWidth="1px"
            borderColor="rgba(16, 185, 129, 0.3)"
            textAlign="center"
          >
            <VStack spacing={6}>
              <VStack spacing={3}>
                <Heading as="h2" color="white" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800">
                  Ready to Get Started?
                </Heading>
                <Text color="gray.300" fontSize="lg" maxW="2xl">
                  Schedule a consultation with our security experts to discuss how this service aligns with your organization's goals.
                </Text>
              </VStack>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button 
                  onClick={onOpen}
                  colorScheme="green" 
                  size="lg"
                  rightIcon={<FiArrowRight size={18} />}
                >
                  Schedule Consultation
                </Button>
                <Button
                  onClick={onOpen}
                  variant="outline"
                  size="lg"
                  borderColor="rgba(16, 185, 129, 0.5)"
                  color="emerald.300"
                  _hover={{ bg: 'rgba(16, 185, 129, 0.1)', borderColor: 'emerald.300' }}
                >
                  Request Proposal
                </Button>
              </HStack>
            </VStack>
          </Box>
        </MotionBox>

      </Container>

      <ConsultationModal
        isOpen={isOpen}
        onClose={onClose}
        serviceName={service.title}
        heading={`Request Consultation: ${service.title}`}
      />
    </Box>
  )
}
