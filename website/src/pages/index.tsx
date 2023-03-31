import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import { Navbar } from '@/components/Navbar';
import { Box, Divider, Text } from '@chakra-ui/react';
import {
  HomePageHero,
  HomePageScreenshots,
  HomePageCommitments,
  HomePageTasks,
  HomePageDownload,
  HomePageNewHome,
  ContentWrapper,
  HomePageFeedback,
  HomePageOpenSource,
} from '@/components';

export default function Home() {
  return (
    <>
      <Head>
        <title>TimeToGive</title>
        <meta
          name="description"
          content="TimeToGive is an app that connects people, with even the smallest amount of free time, to small volunteering tasks that make a big difference in their local community"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box bg="gray.800" position="relative">
        <header>
          <Navbar />
        </header>
        <main>
          <HomePageHero />
          <HomePageScreenshots />
          <HomePageTasks />
          <HomePageCommitments />
          <HomePageDownload />
          <HomePageFeedback />
          <HomePageOpenSource />
          <HomePageNewHome />
        </main>
        <footer>
          <ContentWrapper>
            <Divider color="gray.200" />
            <Text color="white">hello</Text>
          </ContentWrapper>
        </footer>
      </Box>
    </>
  );
}
