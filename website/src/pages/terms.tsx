import { terms } from '@/lib/terms';
import Head from 'next/head';

// All pretty horrible but the the very basic privacy policy for TTG
// generated via Termly.io is a single HTML file. All this needs
// converting into proper formatting. But for MVP release it's fine.
const Terms = () => {
  return (
    <>
      <Head>
        <title>TimeToGive Privacy Policy</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: terms }} />
    </>
  );
};

export default Terms;
