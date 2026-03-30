'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiArrowRight, FiRadio } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Notice {
  id: string;
  title?: string | null;
  message: string;
  linkUrl?: string | null;
}

export const MainNoticeTicker = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  const surfaceBg = useColorModeValue('linear-gradient(90deg, #0b1d3a, #102a57)', 'linear-gradient(90deg, #18223b, #1e315d)');
  const borderColor = useColorModeValue('rgba(255,255,255,0.18)', 'rgba(255,255,255,0.22)');
  const labelBg = useColorModeValue('orange.400', 'orange.300');
  const labelText = useColorModeValue('black', 'black');
  const textColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_URL}/notices/active`);
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setNotices(data);
        }
      } catch {
        setNotices([]);
      }
    };

    void fetchNotices();
  }, []);

  const marqueeItems = useMemo(() => {
    if (!notices.length) {
      return [];
    }
    return notices;
  }, [notices]);

  if (!notices.length) {
    return null;
  }

  const renderNoticeItems = (keyPrefix: string) =>
    marqueeItems.map((notice, index) => {
      const key = `${keyPrefix}-${notice.id}-${index}`;
      return (
        <HStack key={key} spacing={3} whiteSpace="nowrap">
          <FiRadio size={12} color="rgba(255, 196, 112, 0.95)" />
          {notice.linkUrl ? (
            <Link
              href={notice.linkUrl}
              isExternal
              fontWeight="700"
              fontSize={{ base: '13px', md: '14px' }}
              _hover={{ color: 'orange.200', textDecoration: 'none' }}
            >
              {notice.title ? `${notice.title}: ` : ''}
              {notice.message}
              <Box as="span" ml="2" display="inline-flex" verticalAlign="middle">
                <FiArrowRight />
              </Box>
            </Link>
          ) : (
            <Text fontWeight="700" fontSize={{ base: '13px', md: '14px' }}>
              {notice.title ? `${notice.title}: ` : ''}
              {notice.message}
            </Text>
          )}
        </HStack>
      );
    });

  return (
    <Box
      position="fixed"
      top={{ base: '68px', md: '72px' }}
      left="0"
      right="0"
      w="full"
      zIndex={1000}
    >
      <HStack
        w="full"
        spacing={0}
        overflow="hidden"
        borderTopWidth="1px"
        borderBottomWidth="1px"
        borderColor={borderColor}
        bgGradient={surfaceBg}
        boxShadow="0 10px 24px rgba(5, 18, 40, 0.20)"
        _hover={{
          '& .notice-marquee-track': {
            animationPlayState: 'paused',
          },
        }}
      >
        <Box
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 2 }}
          bg={labelBg}
          color={labelText}
          fontWeight="900"
          letterSpacing="0.08em"
          fontSize={{ base: '10px', md: '11px' }}
          whiteSpace="nowrap"
          textTransform="uppercase"
        >
          Latest Notice
        </Box>

        <Box flex="1" minW={0} overflow="hidden" py={{ base: 2, md: 2 }}>
          <Flex
            className="notice-marquee-track"
            align="center"
            w="max-content"
            color={textColor}
            sx={{
              animation: 'noticeTickerFilled 32s linear infinite',
              '@keyframes noticeTickerFilled': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-25%)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            {[0, 1, 2, 3].map((group) => (
              <HStack key={group} spacing={10} px={4} pr={10}>
                {renderNoticeItems(`group-${group}`)}
              </HStack>
            ))}
          </Flex>
        </Box>
      </HStack>
    </Box>
  );
};
