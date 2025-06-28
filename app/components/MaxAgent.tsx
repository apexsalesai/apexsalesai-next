// components/MaxAgent.tsx
'use client';

import React, { useRef, useState } from 'react';
import { Box, Input, Button, Avatar, Spinner, Text, VStack, HStack, useColorModeValue, IconButton, Tooltip } from '@chakra-ui/react';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MaxAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi, I'm Max, your executive AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setSuggestions([]);
    setLoading(true);
    try {
      const res = await fetch('/api/max-chat/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages(msgs => [...msgs, { role: 'assistant', content: data.answer }]);
      }
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, there was an error contacting Max.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  // Voice recognition handlers
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };
  const stopListening = () => {
    setListening(false);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return (
    <Box
      maxW="420px"
      w="100%"
      bg={useColorModeValue('white', 'gray.900')}
      borderRadius="2xl"
      boxShadow="2xl"
      p={4}
      borderWidth={1}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      position="fixed"
      bottom={6}
      right={6}
      zIndex={9999}
      fontFamily="Inter, sans-serif"
    >
      <HStack mb={2} spacing={3} align="center">
        <Avatar src="/max-avatar.png" name="Max" size="sm" />
        <Text fontWeight="bold" color="cyan.600" fontSize="lg">Max</Text>
        <Text fontSize="sm" color="gray.400">AI Revenue Agent</Text>
      </HStack>
      <Box
        ref={chatRef}
        bg={useColorModeValue('gray.50', 'gray.800')}
        borderRadius="lg"
        p={3}
        h="320px"
        overflowY="auto"
        mb={2}
        borderWidth={1}
        borderColor={useColorModeValue('gray.100', 'gray.700')}
      >
        <VStack align="stretch" spacing={2}>
          {messages.map((msg, i) => (
            <HStack key={i} alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'} spacing={2}>
              {msg.role === 'assistant' && <Avatar src="/max-avatar.png" name="Max" size="xs" />}
              <Box
                bg={msg.role === 'user' ? 'blue.500' : 'cyan.600'}
                color="white"
                px={3}
                py={2}
                borderRadius="xl"
                fontSize="sm"
                maxW="80%"
                boxShadow="md"
              >
                {msg.content}
              </Box>
              {msg.role === 'user' && <Avatar name="You" size="xs" />}
            </HStack>
          ))}
          {loading && (
            <HStack alignSelf="flex-start" spacing={2}>
              <Avatar src="/max-avatar.png" name="Max" size="xs" />
              <Box bg="cyan.600" color="white" px={3} py={2} borderRadius="xl" fontSize="sm" boxShadow="md">
                <Spinner size="xs" mr={2} /> Thinking...
              </Box>
            </HStack>
          )}
        </VStack>
      </Box>
      {suggestions.length > 0 && (
        <Box mb={2}>
          <Text fontSize="xs" color="gray.500" mb={1}>Suggestions:</Text>
          <HStack spacing={2}>
            {suggestions.map((s, i) => (
              <Button key={i} size="xs" variant="outline" colorScheme="cyan" onClick={() => handleSuggestion(s)}>
                {s}
              </Button>
            ))}
          </HStack>
        </Box>
      )}
      <HStack as="form" spacing={2} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
        <Input
          placeholder="Ask Max anything about revenue, leads, or AI..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
          isDisabled={loading}
          autoFocus
        />
        <Tooltip label={listening ? 'Listening...' : 'Push to talk'}>
          <IconButton
            aria-label={listening ? 'Stop voice input' : 'Start voice input'}
            icon={listening ? <FiMicOff /> : <FiMic />}
            colorScheme={listening ? 'red' : 'cyan'}
            onClick={listening ? stopListening : startListening}
            isLoading={false}
            variant={listening ? 'solid' : 'outline'}
            bg={listening ? 'red.400' : undefined}
          />
        </Tooltip>
        <IconButton
          aria-label="Send"
          icon={<FiSend />}
          colorScheme="cyan"
          onClick={sendMessage}
          isLoading={loading}
          type="submit"
        />
      </HStack>
    </Box>
  );
};

export default MaxAgent;