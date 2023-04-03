import { ContentWrapper } from '@/components';
import { privacy } from '@/lib/privacy';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';

// All pretty horrible but the the very basic privacy policy for TTG
// generated via Termly.io is a single HTML file. All this needs
// converting into proper formatting. But for MVP release it's fine.
const Privacy = () => {
  return (
    <>
      <Head>
        <title>TimeToGive Terms & Conditions</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <ContentWrapper>
        <Box p={10}>
          <div dangerouslySetInnerHTML={{ __html: privacy }} />
        </Box>
      </ContentWrapper>
    </>
  );
};

export default Privacy;
