import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import { Navbar } from '@/components/Navbar';
import { Box } from '@chakra-ui/react';
import {
  HomePageHero,
  HomePageScreenshots,
  HomePageCommitments,
  HomePageTasks,
  HomePageDownload,
  HomePageNewHome,
  HomePageFeedback,
  HomePageOpenSource,
  Footer,
} from '@/components';

export default function Home() {
  return (
    <>
      <Head>
        <title>TimeToGive</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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
          <Footer />
        </footer>
      </Box>
    </>
  );
}
