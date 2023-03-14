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
import { FiGithub } from 'react-icons/fi';
import { ContentWrapper } from '../ContentWrapper';
import { Sidebar } from './Sidebar';
import { ToggleButton } from './ToggleButton';

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box as="nav" bg="bg-surface" boxShadow="sm" position="sticky">
      <ContentWrapper>
        <Flex justify="space-between" py={{ base: '3', lg: '4' }}>
          <Image alt="Time to Give Logo" src="/ttg.svg" width={40} />
          {isDesktop ? (
            <HStack spacing="4">
              <ButtonGroup variant="ghost" spacing="1">
                <Button>Mission</Button>
                <Button>Manifesto</Button>
                <Button>Concept</Button>
                <Button>Early Registration</Button>
                <Button>Sponsorship</Button>
              </ButtonGroup>
              <ButtonGroup variant="ghost" spacing="1">
                <IconButton
                  icon={<FiGithub fontSize="1.25rem" />}
                  aria-label="Search"
                />
              </ButtonGroup>
            </HStack>
          ) : (
            <>
              <ToggleButton
                isOpen={isOpen}
                aria-label="Open Menu"
                onClick={onToggle}
              />
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                isFullHeight
                preserveScrollBarGap
                // Only disabled for showcase
                trapFocus={false}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <Sidebar />
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Flex>
      </ContentWrapper>
    </Box>
  );
};
