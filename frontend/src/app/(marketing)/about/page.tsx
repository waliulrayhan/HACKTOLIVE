'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  Stack,
  Badge,
  useColorModeValue,
  Grid,
  GridItem,
  Avatar,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import {
  aboutAchievements,
  aboutCallToAction,
  aboutCertifications,
  aboutHighlights,
  aboutFeatures,
  aboutHero,
  aboutMilestones,
  aboutMission,
  aboutOverview,
  aboutTeam,
  aboutValues,
  aboutVision,
} from './_data/about'
import { FallInPlace } from '@/components/shared/motion/fall-in-place'
import { MotionBox } from '@/components/shared/motion/box'
import { useEffect, useRef, useState } from 'react'

export default function AboutPage() {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const iconBg = useColorModeValue('primary.50', 'primary.900')
  const iconColor = useColorModeValue('primary.500', 'primary.400')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const accentBg = useColorModeValue('primary.500', 'primary.400')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  const timelineBorderColor = useColorModeValue('primary.200', 'primary.700')

  const valuesRef = useRef<HTMLDivElement>(null)
  const achievementsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll carousel for team
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || isPaused) return

    let scrollAmount = 0
    const scrollSpeed = 1 // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollAmount += scrollSpeed
        scrollContainer.scrollLeft = scrollAmount

        // Reset scroll when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0
        }
      }
      requestAnimationFrame(scroll)
    }

    const animationFrame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrame)
  }, [isPaused])

  return (
    <Box>
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 32, md: 40 }}
        pb={{ base: 16, md: 20 }}
        bgImage={`url('${aboutHero.backgroundImage}')`}
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
            'linear-gradient(135deg, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.88) 100%)'
          ),
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <FallInPlace>
            <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
              <Badge
                bg={useColorModeValue('green.200', 'green.700')}
                color={useColorModeValue('green.900', 'white')}
                fontSize="sm"
                px={4}
                py={1}
                borderRadius="full"
              >
                {aboutHero.badge}
              </Badge>
              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                fontWeight="bold"
                color="white"
                lineHeight="shorter"
              >
                {aboutHero.titlePrefix}{' '}
                <Text as="span" color="green.400">
                  {aboutHero.titleAccent}
                </Text>
              </Heading>
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                color="gray.200"
                maxW="3xl"
              >
                {aboutHero.description}
              </Text>
            </VStack>
          </FallInPlace>
        </Container>
      </Box>

      {/* Company Overview Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <VStack align="start" spacing={6}>
                  <Badge
                    bg={useColorModeValue('green.200', 'green.700')}
                    color={useColorModeValue('green.900', 'white')}
                    fontSize="sm"
                    px={4}
                    py={1}
                    borderRadius="full"
                  >
                    {aboutOverview.badge}
                  </Badge>
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    {aboutOverview.heading}
                  </Heading>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    {aboutOverview.paragraphs[0]}
                  </Text>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    {aboutOverview.paragraphs[1]}
                  </Text>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    {aboutOverview.paragraphs[2]}
                  </Text>
                </VStack>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <SimpleGrid columns={2} spacing={6}>
                  {aboutOverview.metrics.map((metric) => (
                    <Card
                      key={metric.label}
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                      transition="all 0.3s"
                    >
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Icon as={metric.icon} boxSize={12} color={iconColor} />
                          <Stat textAlign="center">
                            <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                              {metric.value}
                            </StatNumber>
                            <StatLabel color={mutedColor}>{metric.label}</StatLabel>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      {/* <Box py={16} bg={sectionBg} ref={statsRef}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{ 
                    transform: 'translateY(-8px) scale(1.05)', 
                    shadow: '2xl',
                    borderColor: iconColor,
                  }}
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  h="full"
                >
                  <CardBody>
                    <VStack spacing={4}>
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                        transition="all 0.3s"
                      >
                        <Icon as={stat.icon} boxSize={8} color={iconColor} />
                      </Flex>
                      <Stat textAlign="center">
                        <StatNumber fontSize="3xl" fontWeight="bold" color={iconColor}>
                          {stat.value}
                        </StatNumber>
                        <StatLabel fontSize="md" color={mutedColor}>
                          {stat.label}
                        </StatLabel>
                      </Stat>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box> */}

      {/* Mission & Vision Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={12}>
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  p={2}
                >
                  <CardBody>
                    <VStack align="start" spacing={6} h="full">
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                      >
                        <Icon as={aboutMission.icon} boxSize={8} color={iconColor} />
                      </Flex>
                      <Heading as="h2" size="xl" color={iconColor}>
                        {aboutMission.title}
                      </Heading>
                      <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                        {aboutMission.description}
                      </Text>
                      <List spacing={3} pt={4}>
                        {aboutMission.bullets.map((bullet) => (
                          <ListItem key={bullet}>
                            <ListIcon as={FiCheckCircle} color="green.500" />
                            <Text as="span" fontSize="md">
                              {bullet}
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <Card
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  h="full"
                  p={2}
                >
                  <CardBody>
                    <VStack align="start" spacing={6} h="full">
                      <Flex
                        w={16}
                        h={16}
                        align="center"
                        justify="center"
                        rounded="full"
                        bg={iconBg}
                      >
                        <Icon as={aboutVision.icon} boxSize={8} color={iconColor} />
                      </Flex>
                      <Heading as="h2" size="xl" color={iconColor}>
                        {aboutVision.title}
                      </Heading>
                      <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                        {aboutVision.description}
                      </Text>
                      <List spacing={3} pt={4}>
                        {aboutVision.bullets.map((bullet) => (
                          <ListItem key={bullet}>
                            <ListIcon as={FiCheckCircle} color="green.500" />
                            <Text as="span" fontSize="md">
                              {bullet}
                            </Text>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Core Values Section */}
      <Box py={20} bg={sectionBg} ref={valuesRef}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  Our Core Values
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  What Drives Us Forward
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Our values guide every decision we make and shape the culture of our organization.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {aboutValues.map((value, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    h="full"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.3s"
                  >
                    <CardBody>
                      <VStack align="start" spacing={4} h="full">
                        <Flex
                          w={14}
                          h={14}
                          align="center"
                          justify="center"
                          rounded="full"
                          bg={iconBg}
                        >
                          <Icon as={value.icon} boxSize={7} color={iconColor} />
                        </Flex>
                        <Heading as="h3" size="md">
                          {value.title}
                        </Heading>
                        <Text color={mutedColor} lineHeight="tall">
                          {value.description}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Our Story / Timeline Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  Our Journey
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Our Story of Growth
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  From a small initiative to Bangladesh's leading cybersecurity platform.
                </Text>
              </FallInPlace>
            </VStack>

            <VStack spacing={0} w="full" align="stretch" position="relative">
              {/* Timeline Line */}
              <Box
                position="absolute"
                left={{ base: '20px', md: '50%' }}
                top={0}
                bottom={0}
                w="2px"
                bg={timelineBorderColor}
                transform={{ base: 'none', md: 'translateX(-50%)' }}
              />

              {aboutMilestones.map((milestone, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Flex
                    direction={{ base: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' }}
                    align="center"
                    mb={12}
                    position="relative"
                  >
                    <Box
                      flex={{ base: 'none', md: 1 }}
                      textAlign={{ base: 'left', md: index % 2 === 0 ? 'right' : 'left' }}
                      pl={{ base: 16, md: index % 2 === 0 ? 0 : 8 }}
                      pr={{ base: 0, md: index % 2 === 0 ? 8 : 0 }}
                    >
                      <Card
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{ shadow: 'lg' }}
                        transition="all 0.3s"
                      >
                        <CardBody>
                          <VStack
                            align={{ base: 'start', md: index % 2 === 0 ? 'end' : 'start' }}
                            spacing={2}
                          >
                            <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                              {milestone.year}
                            </Badge>
                            <Heading as="h3" size="md">
                              {milestone.title}
                            </Heading>
                            <Text color={mutedColor}>{milestone.description}</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Box>

                    {/* Timeline Dot */}
                    <Flex
                      position="absolute"
                      left={{ base: '12px', md: '50%' }}
                      transform={{ base: 'none', md: 'translateX(-50%)' }}
                      w={4}
                      h={4}
                      align="center"
                      justify="center"
                      bg={accentBg}
                      rounded="full"
                      border="4px solid"
                      borderColor={cardBg}
                      zIndex={1}
                    />

                    <Box flex={{ base: 'none', md: 1 }} />
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Leadership Team Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  Leadership Team
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Meet Our Experts
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Led by industry veterans with decades of combined experience in cybersecurity.
                </Text>
              </FallInPlace>
            </VStack>

            {/* Auto-scrolling carousel */}
            <Box
              w="full"
              overflow="hidden"
              position="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Flex
                ref={scrollContainerRef}
                gap={8}
                overflow="hidden"
                css={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {/* Duplicate team array for seamless loop */}
                {[...aboutTeam, ...aboutTeam].map((member, index) => (
                  <Box
                    key={index}
                    minW={{ base: '280px', sm: '320px', md: '280px' }}
                    flexShrink={0}
                  >
                    <Card
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{
                        transform: 'translateY(-8px) scale(1.02)',
                        shadow: '2xl',
                        borderColor: iconColor,
                      }}
                      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                      h="full"
                    >
                      <CardBody>
                        <VStack spacing={4}>
                          <Avatar
                            size="2xl"
                            src={member.avatar}
                            name={member.name}
                            transition="all 0.3s"
                            _hover={{ transform: 'scale(1.1)' }}
                          />
                          <VStack spacing={1} textAlign="center">
                            <Heading as="h3" size="md" noOfLines={1}>
                              {member.name}
                            </Heading>
                            <Text color={iconColor} fontWeight="semibold" noOfLines={1}>
                              {member.role}
                            </Text>
                            <Text color={mutedColor} fontSize="sm" noOfLines={2}>
                              {member.expertise}
                            </Text>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                ))}
              </Flex>

              {/* Gradient overlays for visual effect */}
              <Box
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w="100px"
                bgGradient={`linear(to-r, ${sectionBg}, transparent)`}
                pointerEvents="none"
                zIndex={1}
              />
              <Box
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                w="100px"
                bgGradient={`linear(to-l, ${sectionBg}, transparent)`}
                pointerEvents="none"
                zIndex={1}
              />
            </Box>

            <Text fontSize="sm" color={mutedColor} textAlign="center" fontStyle="italic">
              Hover over the cards to pause the carousel
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Certifications Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  Certifications
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  Industry-Recognized Certifications
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  Our team holds prestigious cybersecurity certifications from globally recognized organizations.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8} w="full">
              {aboutCertifications.map((cert, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    h="full"
                    _hover={{
                      transform: 'translateY(-8px) scale(1.02)',
                      shadow: '2xl',
                      borderColor: iconColor,
                    }}
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Flex
                          w={16}
                          h={16}
                          align="center"
                          justify="center"
                          rounded="full"
                          bg={iconBg}
                        >
                          <Icon as={cert.icon} boxSize={8} color={iconColor} />
                        </Flex>
                        <VStack align="start" spacing={2}>
                          <Heading as="h3" size="md" color={iconColor}>
                            {cert.name}
                          </Heading>
                          <Text color={mutedColor} fontSize="sm">
                            {cert.description}
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>

            <Card
              bg={iconBg}
              borderWidth="1px"
              borderColor={borderColor}
              w="full"
            >
              <CardBody>
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Icon as={FiCheckCircle} color={iconColor} boxSize={6} />
                  <Text fontSize="lg" fontWeight="semibold">
                    All instructors are certified professionals with active industry experience
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Box py={20} ref={achievementsRef}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <VStack align="start" spacing={6}>
                  <Badge
                    bg={useColorModeValue('green.200', 'green.700')}
                    color={useColorModeValue('green.900', 'white')}
                    fontSize="sm"
                    px={4}
                    py={1}
                    borderRadius="full"
                  >
                    Our Achievements
                  </Badge>
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    Milestones That Define Us
                  </Heading>
                  <Text fontSize="lg" color={mutedColor} lineHeight="tall">
                    Over the years, HackToLive has achieved significant milestones that
                    demonstrate our commitment to cybersecurity excellence and education in
                    Bangladesh.
                  </Text>
                  <List spacing={4} pt={4}>
                    {aboutAchievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <HStack align="start">
                          <Icon as={FiCheckCircle} color="green.500" mt={1} boxSize={5} />
                          <Text fontSize="md">{achievement}</Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <SimpleGrid columns={2} spacing={6}>
                  {aboutHighlights.map((highlight, index) => (
                    <Card
                      key={highlight.label}
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{
                        transform: index % 2 === 0 ? 'scale(1.1) rotate(2deg)' : 'scale(1.1) rotate(-2deg)',
                        shadow: 'xl',
                        borderColor: iconColor,
                      }}
                      transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                      cursor="pointer"
                    >
                      <CardBody textAlign="center">
                        <VStack spacing={2}>
                          <Icon
                            as={highlight.icon}
                            boxSize={10}
                            color={iconColor}
                            transition="all 0.3s"
                            _groupHover={{ transform: 'scale(1.2)' }}
                          />
                          <Stat textAlign="center">
                            <StatNumber fontSize="2xl" fontWeight="bold">
                              {highlight.value}
                            </StatNumber>
                            <StatLabel color={mutedColor}>{highlight.label}</StatLabel>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box py={20} bg={sectionBg}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <FallInPlace>
                <Badge
                  bg={useColorModeValue('green.200', 'green.700')}
                  color={useColorModeValue('green.900', 'white')}
                  fontSize="sm"
                  px={4}
                  py={1}
                  borderRadius="full"
                >
                  Why Choose Us
                </Badge>
              </FallInPlace>
              <FallInPlace delay={0.1}>
                <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                  What Makes Us Different
                </Heading>
              </FallInPlace>
              <FallInPlace delay={0.2}>
                <Text fontSize="lg" color={mutedColor} maxW="2xl">
                  We combine world-class training with practical experience and local expertise.
                </Text>
              </FallInPlace>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {aboutFeatures.map((feature, index) => (
                <MotionBox
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Card
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    h="full"
                    _hover={{ borderColor: iconColor, shadow: 'lg' }}
                    transition="all 0.3s"
                  >
                    <CardBody>
                      <VStack align="start" spacing={4}>
                        <Icon as={feature.icon} boxSize={10} color={iconColor} />
                        <Heading as="h3" size="md">
                          {feature.title}
                        </Heading>
                        <Text color={mutedColor}>{feature.description}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <FallInPlace>
            <Card
              bg={"primary.600"}
              color="white"
              borderWidth="1px"
              borderColor="transparent"
              overflow="hidden"
              position="relative"
            >
              <CardBody p={{ base: 8, md: 12 }}>
                <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
                  <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
                    {aboutCallToAction.heading}
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    {aboutCallToAction.description}
                  </Text>
                  <HStack spacing={4} pt={4}>
                    <Box
                      as="a"
                      href={aboutCallToAction.primaryHref}
                      bg="white"
                      color="primary.500"
                      px={8}
                      py={3}
                      rounded="md"
                      fontWeight="semibold"
                      _hover={{ bg: 'gray.100' }}
                      transition="all 0.3s"
                    >
                      {aboutCallToAction.primaryLabel}
                    </Box>
                    <Box
                      as="a"
                      href={aboutCallToAction.secondaryHref}
                      bg="transparent"
                      color="white"
                      px={8}
                      py={3}
                      rounded="md"
                      fontWeight="semibold"
                      borderWidth="2px"
                      borderColor="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      transition="all 0.3s"
                    >
                      {aboutCallToAction.secondaryLabel}
                    </Box>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </FallInPlace>
        </Container>
      </Box>
    </Box>
  )
}
