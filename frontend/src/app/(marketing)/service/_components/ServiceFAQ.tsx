'use client'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'

interface FAQItem {
  question: string
  answer: string
}

interface ServiceFAQProps {
  faqs: FAQItem[]
}

export default function ServiceFAQ({ faqs }: ServiceFAQProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
    >
      <Heading
        as="h2"
        size="lg"
        mb={6}
        bgGradient="linear(to-r, green.400, teal.500)"
        bgClip="text"
      >
        Frequently Asked Questions
      </Heading>
      <Accordion allowMultiple>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} border="none" mb={2}>
            <h3>
              <AccordionButton
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.700'),
                }}
                borderRadius="md"
                py={4}
              >
                <Box flex="1" textAlign="left" fontWeight="semibold">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4} pt={2} color={useColorModeValue('gray.600', 'gray.400')}>
              {faq.answer}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  )
}
