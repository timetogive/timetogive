import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  Image,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiGithub } from 'react-icons/fi';
import { ContentWrapper } from '../ContentWrapper';
import { Sidebar } from './Sidebar';
import { ToggleButton } from './ToggleButton';

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow="sm"
      position="sticky"
      willChange="transform"
      zIndex={1}
    >
      <ContentWrapper>
        <Flex justify="space-between" py={{ base: '3', lg: '4' }}>
          <Image
            alt="Time to Give Logo"
            src="/ttg-white.svg"
            width={60}
          />
          <HStack spacing="4">
            <ButtonGroup
              variant="ghost"
              colorScheme="cyan"
              spacing="1"
            >
              <Link
                href="https://github.com/timetogive/timetogive"
                target="_blank"
              >
                <IconButton
                  icon={<FiGithub fontSize="2rem" />}
                  aria-label="Search"
                />
              </Link>
            </ButtonGroup>
          </HStack>
        </Flex>
      </ContentWrapper>
    </Box>
  );
};
