'use client'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

interface FAQItem {
  question: string
  answer: string
}

interface ServiceFAQProps {
  faqs: FAQItem[]
  title?: string
  subtitle?: string
}

export default function ServiceFAQ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Answers to common questions about this engagement model and delivery process.',
}: ServiceFAQProps) {
  const bgColor = useColorModeValue('white', 'rgba(13, 18, 31, 0.9)')
  const borderColor = useColorModeValue('gray.200', 'rgba(148, 163, 184, 0.16)')
  const itemBg = useColorModeValue('gray.50', 'rgba(20, 28, 45, 0.88)')
  const itemHover = useColorModeValue('gray.100', 'rgba(30, 41, 59, 0.88)')
  const mutedColor = useColorModeValue('gray.600', 'gray.300')

  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      p={{ base: 6, md: 8 }}
      backdropFilter="blur(8px)"
    >
      <Heading
        as="h2"
        size="lg"
        mb={2}
        bgGradient="linear(to-r, green.300, teal.300)"
        bgClip="text"
      >
        {title}
      </Heading>
      <Text color={mutedColor} mb={6}>
        {subtitle}
      </Text>
      <Accordion allowMultiple>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} border="none" mb={3}>
            <h3>
              <AccordionButton
                _hover={{
                  bg: itemHover,
                }}
                bg={itemBg}
                borderRadius="lg"
                py={4}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4} pt={3} color={mutedColor}>
              {faq.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}
