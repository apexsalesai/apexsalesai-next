// Leads Management Page – Premium UI
'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Heading, HStack, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure, Input, Badge, Spinner, useToast, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, FormControl, FormLabel, Select, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Fade, useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, StarIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import MaxAgent from '../components/MaxAgent';

interface Lead {
  id: number;
  name: string;
  email: string;
  industry: string;
  stage: string;
  confidence_score: number;
  source?: string;
  assignedTo?: { name: string } | null;
  createdAt: string;
  updatedAt: string;
}

const stages = ['New', 'Qualified', 'Contacted', 'Demo', 'Proposal', 'Won', 'Lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }

  function openAdd() {
    setSelected({ id: 0, name: '', email: '', industry: '', stage: stages[0], confidence_score: 50, source: '', assignedTo: null, createdAt: '', updatedAt: '' });
    onOpen();
  }
  function openEdit(lead: Lead) {
    setSelected(lead);
    onOpen();
  }
  function closeDrawer() {
    setSelected(null);
    onClose();
  }

  async function saveLead() {
    setIsSaving(true);
    const method = selected?.id && selected.id !== 0 ? 'PUT' : 'POST';
    const res = await fetch('/api/leads', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selected),
    });
    if (res.ok) {
      toast({ title: 'Lead saved', status: 'success' });
      fetchLeads();
      closeDrawer();
    } else {
      toast({ title: 'Error saving lead', status: 'error' });
    }
    setIsSaving(false);
  }

  async function deleteLead(id: number) {
    if (!window.confirm('Delete this lead?')) return;
    const res = await fetch('/api/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast({ title: 'Lead deleted', status: 'info' });
      fetchLeads();
    } else {
      toast({ title: 'Error deleting lead', status: 'error' });
    }
  }

  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  // --- AI Score Popover State ---
  const [aiPopoverLead, setAiPopoverLead] = useState<Lead | null>(null);
  const [aiPopoverOpen, setAiPopoverOpen] = useState(false);
  const [aiScore, setAiScore] = useState<string>('');
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  // Next Best Actions state
  const [nextActions, setNextActions] = useState<string>('');
  const [nbaLoading, setNbaLoading] = useState(false);

  async function fetchNextActions(lead: Lead) {
    setAiPopoverLead(lead);
    setAiPopoverOpen(true);
    setNextActions('');
    setNbaLoading(true);
    try {
      const res = await fetch('/api/leads/next-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      const actionsText = Array.isArray(data.actions) 
        ? data.actions.join('\n') 
        : (data.actions || 'No actions returned.');
      setNextActions(actionsText);
    } catch (e) {
      setNextActions('Error fetching next actions.');
    } finally {
      setNbaLoading(false);
    }
  }

  function markActionDone(idx: number) {
    // For demo: just remove the line from nextActions
    const lines = nextActions.split('\n');
    lines.splice(idx, 1);
    setNextActions(lines.join('\n'));
  }

  function dismissActions() {
    setNextActions('');
  }

  async function fetchAIScore(lead: Lead) {
    setAiPopoverLead(lead);
    setAiPopoverOpen(true);
    setAiScore('');
    setAiRecs([]);
    setAiLoading(true);
    try {
      const res = await fetch('/api/leads/ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      });
      const data = await res.json();
      setAiScore(`Overall Score: ${data.overallScore}/100\n\n${data.nextBestAction || 'No score returned'}`);
      setAiRecs(data.recommendations || []);
    } catch (e) {
      setAiScore('Error fetching AI insights');
      setAiRecs([]);
    } finally {
      setAiLoading(false);
    }
  }

  // --- Ask Max About Lead ---
  function askMaxAboutLead(lead: Lead) {
    // For demo: Prefill MaxAgent with lead context (could be extended for deep integration)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const maxInput = document.querySelector<HTMLInputElement>('input[placeholder^="Ask Max"]');
      if (maxInput) {
        maxInput.value = `Tell me about lead ${lead.name} (${lead.email}) in ${lead.industry}, stage: ${lead.stage}.`;
        maxInput.focus();
      }
    }, 400);
  }

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="cyan.500">Leads Management</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="cyan" onClick={openAdd} size="md">Add Lead</Button>
      </HStack>
      <HStack mb={4}>
        <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} maxW="320px" />
        <IconButton aria-label="Search" icon={<SearchIcon />} onClick={() => {}} />
      </HStack>
      <Box borderRadius="2xl" overflow="hidden" boxShadow="xl" bg="white" p={0}>
        <Table variant="simple" colorScheme="cyan" size="md">
          <Thead bg="cyan.50">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Industry</Th>
              <Th>Stage</Th>
              <Th isNumeric>Confidence</Th>
              <Th>Assigned</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan={8}><Spinner size="lg" /></Td></Tr>
            ) : filtered.length === 0 ? (
              <Tr><Td colSpan={8}><Text>No leads found.</Text></Td></Tr>
            ) : filtered.map(lead => (
              <Tr key={lead.id} _hover={{ bg: 'cyan.50' }}>
                <Td fontWeight="bold">{lead.name}</Td>
                <Td>{lead.email}</Td>
                <Td>{lead.industry}</Td>
                <Td><Badge colorScheme="cyan">{lead.stage}</Badge></Td>
                <Td isNumeric>
                  <HStack spacing={2}>
                    <StarIcon color={lead.confidence_score > 80 ? 'green.400' : lead.confidence_score > 60 ? 'yellow.400' : 'gray.300'} />
                    {lead.confidence_score}%
                    <Popover
                      isOpen={aiPopoverOpen && aiPopoverLead?.id === lead.id}
                      onClose={() => setAiPopoverOpen(false)}
                      placement="top"
                      closeOnBlur={true}
                    >
                      <PopoverTrigger>
                        <HStack>
                          <IconButton
                            aria-label="AI Insights"
                            icon={<InfoOutlineIcon />}
                            size="xs"
                            colorScheme="cyan"
                            variant="ghost"
                            onClick={() => fetchAIScore(lead)}
                            title="Get AI Insights"
                          />
                          <IconButton
                            aria-label="Next Best Actions"
                            icon={<StarIcon />}
                            size="xs"
                            colorScheme="purple"
                            variant="ghost"
                            onClick={() => fetchNextActions(lead)}
                            title="Next Best Actions"
                          />
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent boxShadow="xl" borderColor={useColorModeValue('cyan.200', 'cyan.700')}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight="bold" color="cyan.600">AI Score & Recommendations</PopoverHeader>
                        <PopoverBody>
                          {aiLoading ? (
                            <HStack><Spinner size="sm" /> <Text>Analyzing...</Text></HStack>
                          ) : (
                            <Fade in={!aiLoading}>
                              <VStack align="start" spacing={2}>
                                <Text><b>AI Score:</b> {aiScore}</Text>
                                {aiRecs.length > 0 && <Box>
                                  <Text fontWeight="semibold" mb={1}>Recommendations:</Text>
                                  <VStack align="start" spacing={1}>
                                    {aiRecs.map((rec, i) => <Text key={i} fontSize="sm">• {rec}</Text>)}
                                  </VStack>
                                </Box>}
                                {nbaLoading ? (
                                  <HStack><Spinner size="sm" color="purple.500" /> <Text color="purple.500">Getting next actions...</Text></HStack>
                                ) : nextActions && nextActions.trim() && (
                                  <Box mt={2} p={2} bg="purple.50" borderRadius="md" borderColor="purple.200" borderWidth={1}>
                                    <HStack justify="space-between" mb={1}>
                                      <Text fontWeight="semibold" color="purple.600">Next Best Actions:</Text>
                                      <Button size="xs" colorScheme="purple" variant="ghost" onClick={dismissActions}>Dismiss All</Button>
                                    </HStack>
                                    <VStack align="start" spacing={1}>
                                      {nextActions.split('\n').map((line, idx) => line.trim() && (
                                        <HStack key={idx} spacing={2}>
                                          <Text fontSize="sm">{line}</Text>
                                          <Button size="xs" colorScheme="green" variant="outline" onClick={() => markActionDone(idx)}>Mark Done</Button>
                                        </HStack>
                                      ))}
                                    </VStack>
                                  </Box>
                                )}
                              </VStack>
                            </Fade>
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </HStack>
                </Td>
                <Td>{lead.assignedTo?.name || <Text color="gray.400">Unassigned</Text>}</Td>
                <Td>{new Date(lead.createdAt).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" onClick={() => openEdit(lead)} />
                    <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => deleteLead(lead.id)} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {/* Add/Edit Lead Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={closeDrawer} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{selected?.id && selected.id !== 0 ? 'Edit Lead' : 'Add Lead'}</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Button
                colorScheme="cyan"
                variant="outline"
                leftIcon={<StarIcon />}
                alignSelf="flex-end"
                mb={2}
                onClick={() => selected && fetchAIScore(selected)}
              >
                AI Score & Recommendations
              </Button>
              <Button
                colorScheme="cyan"
                variant="solid"
                leftIcon={<StarIcon />}
                alignSelf="flex-end"
                mb={2}
                onClick={() => selected && askMaxAboutLead(selected)}
              >
                Ask Max about this Lead
              </Button>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input value={selected?.name || ''} onChange={e => setSelected(s => s && { ...s, name: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input value={selected?.email || ''} onChange={e => setSelected(s => s && { ...s, email: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Industry</FormLabel>
                <Input value={selected?.industry || ''} onChange={e => setSelected(s => s && { ...s, industry: e.target.value })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Stage</FormLabel>
                <Select value={selected?.stage} onChange={e => setSelected(s => s && { ...s, stage: e.target.value })}>
                  {stages.map(s => <option key={s}>{s}</option>)}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Confidence Score</FormLabel>
                <Input type="number" value={selected?.confidence_score || 50} min={0} max={100} onChange={e => setSelected(s => s && { ...s, confidence_score: Number(e.target.value) })} />
              </FormControl>
              <FormControl>
                <FormLabel>Source</FormLabel>
                <Input value={selected?.source || ''} onChange={e => setSelected(s => s && { ...s, source: e.target.value })} />
              </FormControl>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>Cancel</Button>
            <Button colorScheme="cyan" onClick={saveLead} isLoading={isSaving}>{selected?.id && selected.id !== 0 ? 'Save' : 'Add'}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* MaxAgent Chat Widget (floating, premium) */}
      <MaxAgent />
    </Box>
  );
}
