import { Divider, Stack, VStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { ContentWrapper } from './ContentWrapper';

export const Footer = () => {
  return (
    <ContentWrapper>
      <Divider color="gray.200" />
      <Stack direction="row" pb={20} pt={10} justify="space-between">
        <VStack align="start">
          <Text color="white">
            Fabulous Supplies Ltd doing business as{' '}
            <Text as="span" fontWeight="bold">
              {' '}
              TimeToGive &copy; 2023
            </Text>
          </Text>
          <Text color="white">
            Contact us at hello@timetogiveapp.com
          </Text>
          <Text color="white"></Text>
        </VStack>
        <VStack align="end">
          <Link href="/terms" target="_blank">
            <Text color="white" decoration="underline">
              Terms &amp; Conditions
            </Text>
          </Link>
          <Link href="/privacy" target="_blank">
            <Text color="white" decoration="underline">
              Privacy Policy
            </Text>
          </Link>
        </VStack>
      </Stack>
    </ContentWrapper>
  );
};
