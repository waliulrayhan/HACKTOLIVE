'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { toast } from '@/components/ui/toast'

interface QuotationFormProps {
  serviceName: string
}

export function QuotationForm({ serviceName }: QuotationFormProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceType: serviceName,
    budget: '',
    timeline: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.message.trim()) newErrors.message = 'Please describe your requirements'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Quote request submitted!', {
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      })

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        serviceType: serviceName,
        budget: '',
        timeline: '',
        message: '',
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="start">
            <Heading as="h3" size="lg">
              Request a Quote
            </Heading>
            <Text color="gray.600">
              Fill out the form below and our team will get back to you within 24 hours.
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Full Name *</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address *</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.company}>
                <FormLabel>Company Name *</FormLabel>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Ltd."
                />
                <FormErrorMessage>{errors.company}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Phone Number *</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XX-XXXXXXX"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Budget Range</FormLabel>
                <Select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Select budget range"
                >
                  <option value="under-50k">Under ৳50,000</option>
                  <option value="50k-100k">৳50,000 - ৳100,000</option>
                  <option value="100k-200k">৳100,000 - ৳200,000</option>
                  <option value="200k-500k">৳200,000 - ৳500,000</option>
                  <option value="500k-plus">৳500,000+</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Expected Timeline</FormLabel>
                <Select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="Select timeline"
                >
                  <option value="urgent">Urgent (Within 2 weeks)</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="2-3-months">2-3 months</option>
                  <option value="flexible">Flexible</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.message}>
                <FormLabel>Project Requirements *</FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your requirements, scope, and any specific concerns..."
                  rows={6}
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="full"
                isLoading={isSubmitting}
              >
                Submit Request
              </Button>
            </VStack>
          </form>
        </VStack>
      </CardBody>
    </Card>
  )
}
