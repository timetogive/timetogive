import { Heading, Stack, Text } from '@chakra-ui/layout';
import { ContentWrapper } from '../ContentWrapper';

interface Props {
  title: string;
  children: React.ReactNode;
}
export const HomePageParagraph = ({ title, children }: Props) => {
  return (
    <ContentWrapper>
      <Stack
        direction="column"
        px={{ base: '6', md: '8' }}
        py={10}
        spacing={10}
      >
        <Heading>{title}</Heading>
        {children}
      </Stack>
    </ContentWrapper>
  );
};
