import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import { Navbar } from '@/components/Navbar';
import {
  Text,
  UnorderedList,
  ListItem,
  Stack,
  Heading,
} from '@chakra-ui/react';
import {
  ContentWrapper,
  HomePageHero,
  HomePageParagraph,
} from '@/components';

const content = {
  mission: {
    title: 'Mission',
    description: (
      <Text fontSize="xl">
        Our mission is to enable people to use their spare time for
        good. Directly for a charity, in return for a pledge to a
        charity, to directly help a family or someone in need, for the
        good of the local community, to gain a new experience, or
        simply to make a connection with someone. No money is ever
        exchanged for the time that is given.
      </Text>
    ),
  },
  why: {
    title: 'Why?',
    description: (
      <Text fontSize="xl">
        People like to volunteer. People want to give back. But might
        not be able to make regular long term commitments. There is
        huge untapped potential in people&apos;s spare time (perhaps
        outside of work hours, in between jobs, unable to work, or
        retired). Many people are lonely and want to do
        &quot;something&quot;. People also want to help
        &quot;locally&quot; (to where they live, or to where they
        currently are). People want to help in real-time. People want
        to make meaningful connections. People want to use their
        skills for good.
      </Text>
    ),
  },
  different: {
    title: `How's this different?`,
    description: (
      <Text fontSize="xl">
        There&apos;s lots of fabulous organisations, services,
        platforms that offer help, advice and volunteering
        opportunities. The majority of these are focussed on providing
        help directly to charities, using trained volunteers to offer
        advice on a more regular basis. There are also many companies
        that make money from the services that they provide.
        TimeToGive is different, it allows people, anyone, to help
        anyone else, with anything, even with the smallest amount of
        free time. If the task or advice isn&apos;t directly for a
        good cause, then a charity can still benefit through a pledge.
        It&apos;s ambition is to use technology to facilitate this at
        scale and run this as a non-profit. We also hope volunteering
        organisations, businesses, services, charities and
        non-profits, all use the TimeToGive app as well.
      </Text>
    ),
  },
  manifesto: {
    title: `Manifesto`,
    description: (
      <UnorderedList fontSize="xl">
        <ListItem ml={6}>
          TimeToGive will always be run as a non profit
        </ListItem>
        <ListItem ml={6}>
          TimeToGive will never display adverts or exploit user data
        </ListItem>
        <ListItem ml={6}>
          TimeToGive will be funded and operated via sponsorship and
          donations
        </ListItem>
        <ListItem ml={6}>
          TimeToGive will be entirely open source
        </ListItem>
        <ListItem ml={6}>
          TimeToGive will be moderated and run by the community itself
        </ListItem>
      </UnorderedList>
    ),
  },
  concept: {
    title: `Concept`,
    description: (
      <Stack direction="column" spacing={12} fontSize="xl">
        <Stack direction="column" spacing={3}>
          <Heading size="md">Users</Heading>
          <Text>
            Users can post tasks or ask for advice. Users can carry
            out these tasks, offer advice and help solve problems.
            Users can be anyone - individuals, businesses, charities,
            community groups.
          </Text>
        </Stack>
        <Stack direction="column" spacing={3}>
          <Heading size="md">Tasks</Heading>
          <Text>
            Tasks are something that someone needs help with - for
            example, their Wi-Fi is broken, need help clearing some
            rubbish, mowing the lawn, changing some bulbs, clearing a
            gutter, getting a lift somewhere, painting some garden
            furniture, assembling some ikea furniture, doing some data
            entry, some filing, a small roof repair. Anything! Think
            of a global-local TaskRabbit but for good not money.
          </Text>
          <Text>
            When a task is created, the user makes a pledge (eg
            it&apos;s directly for a charity, it&apos;s for someone in
            real need, will pledge £X to Y cause, will buy you a
            coffee, feed you some lunch, or any combo). This forms
            part of the listing.
          </Text>
        </Stack>
        <Stack direction="column" spacing={3}>
          <Heading size="md">Advice</Heading>
          <Text>
            Asking for advice might be something as simple as does
            anyone know a good carpenter? Can anyone recommend a
            builder? Where&apos;s good to eat? To much more complex
            things like how do I get planning permission, how do I go
            about setting up a website. All of these things can be
            posed on the forums. You can ask anything! (Moderated by
            community owners). Chat can be open or direct between
            users. Think of an ultra-local Quora here.
          </Text>
          <Text>
            When a question or advice is answered then the user that
            posed the question reports back on how they made the world
            better (the question / advice directly benefited a
            charity, they made a payment to a charity, bought someone
            a coffee etc…).
          </Text>
        </Stack>
        <Stack direction="column" spacing={3}>
          <Heading size="md">Points</Heading>
          <Text>
            Users earn points when they carry out a task (time is
            directly proportional to points), when they help answer a
            question (replying to a question, or directly attributed
            as solving a question, having answers upvoted). Users can
            also earn points by becoming moderators (deleting posts,
            and blocking accounts).
          </Text>
        </Stack>
        <Stack direction="column" spacing={3}>
          <Heading size="md">Access</Heading>
          <Text>
            Users find tasks by using a map and search. Based on
            profile settings, they can receive alerts. Questions are
            only posed within a geographical area. This means
            you&apos;re answering questions from people local to the
            area you are looking at (could be where you live or even
            when you&apos;re away travelling). Everything is displayed
            in real time. It&apos;s all delivered on a lovely iOS app
            and Android App.
          </Text>
        </Stack>
      </Stack>
    ),
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <HomePageHero />
        <HomePageParagraph title={content.mission.title}>
          {content.mission.description}
        </HomePageParagraph>
        <HomePageParagraph title={content.why.title}>
          {content.why.description}
        </HomePageParagraph>
        <HomePageParagraph title={content.different.title}>
          {content.different.description}
        </HomePageParagraph>
        <HomePageParagraph title={content.manifesto.title}>
          {content.manifesto.description}
        </HomePageParagraph>
        <HomePageParagraph title={content.concept.title}>
          {content.concept.description}
        </HomePageParagraph>
      </main>
    </>
  );
}
