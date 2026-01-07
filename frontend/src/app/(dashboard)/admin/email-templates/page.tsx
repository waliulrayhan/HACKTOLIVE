'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  useToast,
  HStack,
  VStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Divider,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus, FiSend, FiEye } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  subject: string;
  body: string;
  type: string;
  variables: string[];
  fromEmail: 'NOREPLY' | 'SUPPORT';
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    logs: number;
  };
}

interface EmailStats {
  totalTemplates: number;
  activeTemplates: number;
  totalEmailsSent: number;
  failedEmails: number;
  recentEmailsSent: number;
  successRate: string;
}

interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  failedAt?: string;
  errorMessage?: string;
  createdAt: string;
  template?: {
    name: string;
    slug: string;
  };
}

const EMAIL_TEMPLATE_TYPES = [
  'CAREER_APPLICATION_CONFIRMATION',
  'CAREER_APPLICATION_STATUS_UPDATE',
  'CONTACT_FORM_CONFIRMATION',
  'WELCOME_EMAIL',
  'PASSWORD_RESET',
  'ORDER_CONFIRMATION',
  'COURSE_ENROLLMENT',
  'CERTIFICATE_ISSUED',
  'CUSTOM',
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({});
  const [testEmail, setTestEmail] = useState('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();

  useEffect(() => {
    fetchTemplates();
    fetchStats();
    fetchLogs();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/email-templates`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      toast({
        title: 'Error fetching templates',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/email-templates/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/email-templates/logs?limit=20`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      setLogs(result.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setFormData({
      variables: [],
      fromEmail: 'NOREPLY',
      isActive: true,
    });
    onOpen();
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData(template);
    onOpen();
  };

  const handleView = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    onViewOpen();
  };

  const handleSubmit = async () => {
    try {
      const url = selectedTemplate
        ? `${API_URL}/admin/email-templates/${selectedTemplate.id}`
        : `${API_URL}/admin/email-templates`;
      
      const response = await fetch(url, {
        method: selectedTemplate ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: `Template ${selectedTemplate ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
        });
        fetchTemplates();
        fetchStats();
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error saving template',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/email-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Template deleted successfully',
          status: 'success',
          duration: 3000,
        });
        fetchTemplates();
        fetchStats();
      }
    } catch (error) {
      toast({
        title: 'Error deleting template',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSendTest = async (templateId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/email-templates/${templateId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ recipientEmail: testEmail }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Test email sent successfully',
          description: 'Check your inbox and spam folder',
          status: 'success',
          duration: 5000,
        });
        onTestClose();
        setTestEmail('');
        fetchLogs();
      }
    } catch (error) {
      toast({
        title: 'Error sending test email',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <Heading size="lg">Email Templates</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleCreate}>
            Create Template
          </Button>
        </HStack>

        {/* Statistics */}
        {stats && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} spacing={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Templates</StatLabel>
                  <StatNumber>{stats.totalTemplates}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Active Templates</StatLabel>
                  <StatNumber>{stats.activeTemplates}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Emails Sent</StatLabel>
                  <StatNumber>{stats.totalEmailsSent}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Failed</StatLabel>
                  <StatNumber color="red.500">{stats.failedEmails}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Last 30 Days</StatLabel>
                  <StatNumber>{stats.recentEmailsSent}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Success Rate</StatLabel>
                  <StatNumber color="green.500">{stats.successRate}%</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Tabs for Templates and Logs */}
        <Tabs>
          <TabList>
            <Tab>Email Templates</Tab>
            <Tab>Email Logs</Tab>
          </TabList>

          <TabPanels>
            {/* Templates Tab */}
            <TabPanel px={0}>
              <Card>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>From</Th>
                        <Th>Status</Th>
                        <Th>Emails Sent</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {templates.map((template) => (
                        <Tr key={template.id}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{template.name}</Text>
                              <Text fontSize="sm" color="gray.600">{template.slug}</Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Badge colorScheme="purple" fontSize="xs">
                              {template.type.replace(/_/g, ' ')}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={template.fromEmail === 'NOREPLY' ? 'blue' : 'green'}>
                              {template.fromEmail}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={template.isActive ? 'green' : 'gray'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </Td>
                          <Td>{template._count?.logs || 0}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="View"
                                icon={<FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleView(template)}
                              />
                              <IconButton
                                aria-label="Edit"
                                icon={<FiEdit2 />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(template)}
                              />
                              <IconButton
                                aria-label="Test"
                                icon={<FiSend />}
                                size="sm"
                                colorScheme="green"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  onTestOpen();
                                }}
                              />
                              <IconButton
                                aria-label="Delete"
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(template.id)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Email Logs Tab */}
            <TabPanel px={0}>
              <Card>
                <CardBody>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th>
                        <Th>Subject</Th>
                        <Th>Template</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {logs.map((log) => (
                        <Tr key={log.id}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm">{log.recipientEmail}</Text>
                              {log.recipientName && (
                                <Text fontSize="xs" color="gray.600">{log.recipientName}</Text>
                              )}
                            </VStack>
                          </Td>
                          <Td fontSize="sm">{log.subject}</Td>
                          <Td>
                            {log.template && (
                              <Text fontSize="sm" color="gray.600">{log.template.name}</Text>
                            )}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                log.status === 'SENT' ? 'green' :
                                log.status === 'FAILED' ? 'red' : 'yellow'
                              }
                            >
                              {log.status}
                            </Badge>
                            {log.errorMessage && (
                              <Text fontSize="xs" color="red.500" mt={1}>
                                {log.errorMessage}
                              </Text>
                            )}
                          </Td>
                          <Td fontSize="sm">
                            {log.sentAt ? new Date(log.sentAt).toLocaleString() :
                             log.failedAt ? new Date(log.failedAt).toLocaleString() :
                             new Date(log.createdAt).toLocaleString()}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTemplate ? 'Edit Template' : 'Create Template'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Welcome Email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="welcome-email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select type</option>
                  {EMAIL_TEMPLATE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Welcome {{name}}!"
                />
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Use {'{{'} and {'}}'}  for variables
                </Text>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Body (HTML)</FormLabel>
                <Textarea
                  value={formData.body || ''}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="<h1>Welcome {{name}}</h1>"
                  rows={10}
                  fontFamily="monospace"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Variables</FormLabel>
                <Input
                  value={(formData.variables || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      variables: e.target.value.split(',').map(v => v.trim()).filter(v => v),
                    })
                  }
                  placeholder="name, email, date"
                />
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Comma-separated list of variables
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>From Email</FormLabel>
                <Select
                  value={formData.fromEmail || 'NOREPLY'}
                  onChange={(e) =>
                    setFormData({ ...formData, fromEmail: e.target.value as 'NOREPLY' | 'SUPPORT' })
                  }
                >
                  <option value="NOREPLY">NOREPLY</option>
                  <option value="SUPPORT">SUPPORT</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Template description"
                  rows={3}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Active</FormLabel>
                <Switch
                  isChecked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {selectedTemplate ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Test Email Modal */}
      <Modal isOpen={isTestOpen} onClose={onTestClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Test Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info">
                <AlertIcon />
                Test email will use sample data for all variables
              </Alert>
              <FormControl isRequired>
                <FormLabel>Recipient Email</FormLabel>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onTestClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => selectedTemplate && handleSendTest(selectedTemplate.id)}
              isDisabled={!testEmail}
            >
              Send Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Template Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTemplate?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTemplate && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>Slug:</Text>
                  <Code>{selectedTemplate.slug}</Code>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Type:</Text>
                  <Badge colorScheme="purple">
                    {selectedTemplate.type.replace(/_/g, ' ')}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Subject:</Text>
                  <Text>{selectedTemplate.subject}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>Variables:</Text>
                  <HStack spacing={2}>
                    {selectedTemplate.variables.map((v) => (
                      <Badge key={v}>{v}</Badge>
                    ))}
                  </HStack>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold" mb={2}>Body (HTML):</Text>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    maxH="400px"
                    overflowY="auto"
                    fontFamily="monospace"
                    fontSize="sm"
                  >
                    <pre>{selectedTemplate.body}</pre>
                  </Box>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold" mb={2}>Preview:</Text>
                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onViewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
